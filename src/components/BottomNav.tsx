import { Home, Image, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "media" | "settings";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "media", label: "Media", icon: Image },
  { id: "settings", label: "Settings", icon: Settings },
];

const BottomNav = ({ active, onChange }: Props) => (
  <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border shadow-lg">
    <div className="max-w-5xl mx-auto flex justify-around items-center h-16">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1 transition-colors",
            active === id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-[11px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default BottomNav;
