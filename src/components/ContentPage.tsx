import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Save } from "lucide-react";

interface Props {
  title: string;
  content: string;
  onUpdate: (content: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContentPage = ({ title, content, onUpdate, open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  const isSuperAdmin = user.role === "super_admin";

  const handleOpen = () => {
    setDraft(content);
    setEditing(false);
  };

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (v) handleOpen(); }}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center justify-between">
            {title}
            {isSuperAdmin && !editing && (
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {editing ? (
            <div className="space-y-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[200px]"
                placeholder={`Enter ${title} content...`}
              />
              <Button onClick={handleSave} className="gap-1 w-full">
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {content || <span className="text-muted-foreground italic">No content yet.</span>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPage;
