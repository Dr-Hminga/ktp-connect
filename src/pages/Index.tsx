import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Member, generateMockMembers } from "@/data/mockData";
import AnnouncementBoard from "@/components/AnnouncementBoard";
import StatCards from "@/components/StatCards";
import MemberTable from "@/components/MemberTable";
import RegistrationModal from "@/components/RegistrationModal";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";

const initialMembers = generateMockMembers();

const Index = () => {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [announcement, setAnnouncement] = useState("Welcome to KTP Member Management! Sunday service at 10 AM. Youth fellowship every Friday evening.");
  const [regOpen, setRegOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

  let nextId = useMemo(() => Math.max(...members.map(m => Number(m.id))) + 1, [members]);

  const addMember = (data: Omit<Member, "id">) => {
    setMembers(prev => [...prev, { ...data, id: String(nextId++) }]);
  };

  const updateMember = (data: Omit<Member, "id">) => {
    if (!editMember) return;
    setMembers(prev => prev.map(m => m.id === editMember.id ? { ...data, id: m.id } : m));
    setEditMember(null);
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success("Member deleted");
  };

  const allowedGroup = user.role === "group_leader" ? user.group : undefined;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">KTP Member Management</h1>
            {user.role !== "public" && (
              <p className="text-xs opacity-80 flex items-center gap-1"><Shield className="h-3 w-3" />{user.label}</p>
            )}
          </div>
          {user.role === "public" ? (
            <Button variant="secondary" size="sm" onClick={() => setLoginOpen(true)} className="gap-1"><LogIn className="h-4 w-4" />Login</Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={logout} className="gap-1"><LogOut className="h-4 w-4" />Logout</Button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        <AnnouncementBoard text={announcement} onUpdate={setAnnouncement} />
        <StatCards members={members} />
        <MemberTable members={members} onEdit={m => { setEditMember(m); setRegOpen(true); }} onDelete={deleteMember} />
      </main>

      {/* FAB */}
      <button
        onClick={() => { setEditMember(null); setRegOpen(true); }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gold text-gold-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
        aria-label="Add member"
      >
        <Plus className="h-7 w-7" />
      </button>

      <RegistrationModal
        open={regOpen}
        onOpenChange={v => { setRegOpen(v); if (!v) setEditMember(null); }}
        onSubmit={editMember ? updateMember : addMember}
        editMember={editMember}
        allowedGroup={allowedGroup}
      />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default Index;
