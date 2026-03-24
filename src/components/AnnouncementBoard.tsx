import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Megaphone, Pencil, Check } from "lucide-react";

interface Props { text: string; onUpdate: (t: string) => void; }

const AnnouncementBoard = ({ text, onUpdate }: Props) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const save = () => { onUpdate(draft); setEditing(false); };

  return (
    <Card className="border-gold/30 bg-gold/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-5 w-5 text-gold" />Announcements</CardTitle>
        {user.role === "super_admin" && !editing && (
          <Button variant="ghost" size="sm" onClick={() => { setDraft(text); setEditing(true); }}><Pencil className="h-4 w-4" /></Button>
        )}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-2">
            <Textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} />
            <Button size="sm" onClick={save}><Check className="h-4 w-4 mr-1" />Save</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{text}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementBoard;
