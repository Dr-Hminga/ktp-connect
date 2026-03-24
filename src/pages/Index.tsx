import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Member, generateMockMembers } from "@/data/mockData";
import AnnouncementBoard from "@/components/AnnouncementBoard";
import StatCards from "@/components/StatCards";
import ProgramSheet from "@/components/ProgramSheet";
import RegistrationModal from "@/components/RegistrationModal";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut, Shield } from "lucide-react";
import MemberTable from "@/components/MemberTable";

const initialMembers = generateMockMembers();

const Index = () => {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [announcement, setAnnouncement] = useState("Welcome to KTPRVL, Sunday service at 10 AM. Youth fellowship every Friday evening.");
  const [regOpen, setRegOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">KTPRVL</h1>
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
        <ProgramSheet />
        <StatCards members={members} />
        {isAdmin && (
          <MemberTable members={members} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => { setRegOpen(true); }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
        aria-label="Add member"
      >
        <Plus className="h-7 w-7" />
      </button>

      <RegistrationModal
        open={regOpen}
        onOpenChange={(open) => { setRegOpen(open); if (!open) setEditMember(null); }}
        onSubmit={handleSubmit}
        editMember={editMember}
        allowedGroup={user.role === "group_leader" ? user.group : undefined}
      />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default Index;
