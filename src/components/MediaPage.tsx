import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ExternalLink, Camera, Video } from "lucide-react";

interface MediaLink {
  id: string;
  title: string;
  url: string;
}

const MediaPage = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "super_admin";

  const [photos, setPhotos] = useState<MediaLink[]>([
    { id: "1", title: "Sunday Service Gallery", url: "https://photos.google.com" },
    { id: "2", title: "Youth Fellowship Photos", url: "https://photos.google.com" },
  ]);
  const [videos, setVideos] = useState<MediaLink[]>([
    { id: "1", title: "Sunday Worship", url: "https://youtube.com" },
    { id: "2", title: "Youth Fellowship Highlights", url: "https://youtube.com" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addLink = (type: "photos" | "videos") => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const link: MediaLink = { id: Date.now().toString(), title: newTitle, url: newUrl };
    if (type === "photos") setPhotos((p) => [...p, link]);
    else setVideos((v) => [...v, link]);
    setNewTitle("");
    setNewUrl("");
  };

  const removeLink = (type: "photos" | "videos", id: string) => {
    if (type === "photos") setPhotos((p) => p.filter((l) => l.id !== id));
    else setVideos((v) => v.filter((l) => l.id !== id));
  };

  const renderLinks = (type: "photos" | "videos", links: MediaLink[]) => (
    <div className="space-y-3">
      {links.length === 0 && (
        <p className="text-sm text-muted-foreground italic text-center py-6">No {type} links yet.</p>
      )}
      {links.map((link) => (
        <Card key={link.id}>
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex-1 min-w-0 mr-2">
              <p className="text-sm font-medium truncate">{link.title}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span>Open</span>
              </a>
            </div>
            {isAdmin && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeLink(type, link.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      {isAdmin && (
        <Card className="border-dashed">
          <CardContent className="p-3 space-y-2">
            <Input placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="h-8 text-sm" />
            <Input placeholder={type === "photos" ? "Google Photos URL" : "YouTube URL"} value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="h-8 text-sm" />
            <Button size="sm" className="w-full gap-1" onClick={() => addLink(type)}>
              <Plus className="h-4 w-4" /> Add {type === "photos" ? "Photo Link" : "Video Link"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Media Gallery</h2>
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos" className="gap-1"><Camera className="h-4 w-4" />Photos</TabsTrigger>
          <TabsTrigger value="videos" className="gap-1"><Video className="h-4 w-4" />Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="mt-3">
          {renderLinks("photos", photos)}
        </TabsContent>
        <TabsContent value="videos" className="mt-3">
          {renderLinks("videos", videos)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaPage;
