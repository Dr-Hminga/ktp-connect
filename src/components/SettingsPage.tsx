import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Monitor, Pencil, Save, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const themes: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
};

const SettingsPage = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "super_admin";

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("app-theme") as Theme) || "light";
  });

  const [about, setAbout] = useState(
    "KTPRVL app hi member ten awlsam zawk la program leh member list te kan vawn that theih nan te. Thlalak leh video awlsam taka kan en zung zung theih na tur atana unofficial a siam a ni e."
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(about);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const handleSave = () => {
    setAbout(draft);
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Settings</h2>

      {/* Theme */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">App Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors",
                  theme === id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1"><Info className="h-4 w-4" />About</span>
            {isAdmin && !editing && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setDraft(about); setEditing(true); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-2">
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-[120px]" />
              <Button size="sm" className="w-full gap-1" onClick={handleSave}>
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
          ) : (
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {about || <span className="text-muted-foreground italic">No info yet.</span>}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
