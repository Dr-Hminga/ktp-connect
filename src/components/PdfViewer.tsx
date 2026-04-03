import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

interface Props {
  url: string;
}

const PdfViewer = ({ url }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let pdfTask: ReturnType<typeof pdfjsLib.getDocument> | null = null;

    const render = async () => {
      setLoading(true);
      setError(null);

      const container = containerRef.current;
      if (container) container.innerHTML = "";

      try {
        pdfTask = pdfjsLib.getDocument({ url });
        const pdf = await pdfTask.promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);

        const activeContainer = containerRef.current;
        if (!activeContainer) return;
        activeContainer.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;

          const containerWidth = activeContainer.clientWidth || 380;
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = (containerWidth * window.devicePixelRatio) / unscaledViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.marginBottom = "8px";
          canvas.style.borderRadius = "4px";

          activeContainer.appendChild(canvas);

          const ctx = canvas.getContext("2d");
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
          }
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load PDF");
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();

    return () => {
      cancelled = true;
      pdfTask?.destroy();
    };
  }, [url]);

  return (
    <div className="w-full h-full overflow-auto">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      <div ref={containerRef} className="w-full" />
      {!loading && !error && pageCount > 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">{pageCount} page{pageCount > 1 ? "s" : ""}</p>
      )}
    </div>
  );
};

export default PdfViewer;
