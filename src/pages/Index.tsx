import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Member, generateMockMembers } from "@/data/mockData";
import AnnouncementBoard from "@/components/AnnouncementBoard";
import StatCards from "@/components/StatCards";
import ProgramSheet from "@/components/ProgramSheet";
import RegistrationModal from "@/components/RegistrationModal";
import LoginModal from "@/components/LoginModal";
import ContentPage from "@/components/ContentPage";
import BottomNav from "@/components/BottomNav";
import MediaPage from "@/components/MediaPage";
import SettingsPage from "@/components/SettingsPage";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut, Shield, Menu } from "lucide-react";
import ktpLogo from "@/assets/ktp-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MemberTable from "@/components/MemberTable";

const initialMembers = generateMockMembers();

const MENU_PAGES = ["Branch C/m List", "Group C/m List", "Sub C/m List", "Branch Inkaihhruaina", "Member List"] as const;

const Index = () => {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [announcement, setAnnouncement] = useState("KTP Ramhlun Venglai Branch member zawng zawng te chibai ka buk a che u. He app hi inzir nan a siam a ni e.");
  const [regOpen, setRegOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [pageContents, setPageContents] = useState<Record<string, string>>({
    "Branch C/m List": "",
    "Group C/m List": "",
    "Sub C/m List": "",
    "Branch Inkaihhruaina": "",
    "Member List": "",
  });
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "media" | "settings">("home");

  let nextId = useMemo(() => Math.max(...members.map(m => Number(m.id))) + 1, [members]);

  const addMember = (data: Omit<Member, "id">) => {
    setMembers(prev => [...prev, { ...data, id: String(nextId++) }]);
  };

  const handleEdit = (m: Member) => {
    setEditMember(m);
    setRegOpen(true);
  };

  const handleDelete = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (data: Omit<Member, "id">) => {
    if (editMember) {
      setMembers(prev => prev.map(m => m.id === editMember.id ? { ...data, id: editMember.id } : m));
      setEditMember(null);
    } else {
      addMember(data);
    }
  };

  const isAdmin = user.role === "super_admin" || user.role === "group_leader";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={ktpLogo} alt="KTP Logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">KTPRVL</h1>
              {user.role !== "public" && (
                <p className="text-xs opacity-80 flex items-center gap-1"><Shield className="h-3 w-3" />{user.label}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user.role === "public" ? (
              <Button variant="secondary" size="sm" onClick={() => setLoginOpen(true)} className="gap-1"><LogIn className="h-4 w-4" />Login</Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={logout} className="gap-1"><LogOut className="h-4 w-4" />Logout</Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {MENU_PAGES.map((page) => (
                  <DropdownMenuItem key={page} onClick={() => setActivePage(page)}>
                    {page}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {activeTab === "home" && (
          <>
            <AnnouncementBoard text={announcement} onUpdate={setAnnouncement} />
            <ProgramSheet />
            <StatCards members={members} />
            {isAdmin && (
              <MemberTable members={members} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </>
        )}
        {activeTab === "media" && <MediaPage />}
        {activeTab === "settings" && <SettingsPage />}
      </main>

      {/* FAB - only on home */}
      {activeTab === "home" && (
        <button
          onClick={() => { setRegOpen(true); }}
          className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          aria-label="Add member"
        >
          <Plus className="h-7 w-7" />
        </button>
      )}

      <BottomNav active={activeTab} onChange={setActiveTab} />

      <RegistrationModal
        open={regOpen}
        onOpenChange={(open) => { setRegOpen(open); if (!open) setEditMember(null); }}
        onSubmit={handleSubmit}
        editMember={editMember}
        allowedGroup={user.role === "group_leader" ? user.group : undefined}
      />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      {activePage && activePage === "Member List" ? (
        <Dialog open={!!activePage} onOpenChange={(open) => { if (!open) setActivePage(null); }}>
          <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-primary">Member List</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <MemberTable members={members} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </DialogContent>
        </Dialog>
      ) : activePage ? (
        <ContentPage
          title={activePage}
          content={pageContents[activePage]}
          onUpdate={(content) => setPageContents(prev => ({ ...prev, [activePage]: content }))}
          open={!!activePage}
          onOpenChange={(open) => { if (!open) setActivePage(null); }}
        />
      ) : null}
    </div>
  );
};

export default Index;
