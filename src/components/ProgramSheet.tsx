import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProgramSheet = () => {
  const { user } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string>("");
  const [viewOpen, setViewOpen] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setPdfName(file.name);
    toast.success("Program sheet uploaded");
    e.target.value = "";
  };

  const handleRemove = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setPdfName("");
    toast.success("Program sheet removed");
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Monthly Program Sheet
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {pdfUrl ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium truncate">{pdfName}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setViewOpen(true)} className="gap-1 text-primary">
                  <Eye className="h-4 w-4" />View
                </Button>
                {user.role === "super_admin" && (
                  <Button variant="ghost" size="sm" onClick={handleRemove} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No program sheet uploaded yet</p>
            {user.role === "super_admin" && (
              <label>
                <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
                <Button variant="outline" size="sm" className="gap-1 border-primary text-primary cursor-pointer" asChild>
                  <span><Upload className="h-4 w-4" />Upload PDF</span>
                </Button>
              </label>
            )}
          </div>
        )}

        {user.role === "super_admin" && pdfUrl && (
          <label className="mt-2 block">
            <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
            <Button variant="outline" size="sm" className="gap-1 border-primary text-primary cursor-pointer w-full" asChild>
              <span><Upload className="h-4 w-4" />Replace PDF</span>
            </Button>
          </label>
        )}
      </CardContent>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-sm font-semibold">{pdfName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 px-4 pb-4 h-full">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-[calc(85vh-80px)] rounded-lg border"
                title="Program Sheet"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProgramSheet;
