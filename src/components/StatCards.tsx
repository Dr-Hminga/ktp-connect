import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, LayoutGrid, BookOpen, UsersRound } from "lucide-react";
import { Member, GROUPS_LIST } from "@/data/mockData";

const StatCards = ({ members }: { members: Member[] }) => {
  const total = members.length;
  const male = members.filter(m => m.gender === "Male").length;
  const female = total - male;
  const kristianMag = members.filter(m => m.kristianMagazine).length;
  const dualMember = members.filter(m => m.dualMember).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <Card className="border-primary/20">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1"><Users className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Total</span></div>
          <p className="text-2xl font-bold text-primary">{total}</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1"><UserCheck className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Male</span></div>
          <p className="text-2xl font-bold text-primary">{male}</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1"><UserCheck className="h-5 w-5" style={{ color: "#f9a8d4" }} /><span className="text-xs text-muted-foreground">Female</span></div>
          <p className="text-2xl font-bold" style={{ color: "#f9a8d4" }}>{female}</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1"><BookOpen className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Kristian Thalai</span></div>
          <p className="text-2xl font-bold text-primary">{kristianMag}</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1"><UsersRound className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Dual Member</span></div>
          <p className="text-2xl font-bold text-primary">{dualMember}</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1"><LayoutGrid className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Groups</span></div>
          <div className="flex flex-wrap gap-1 mt-1">
            {GROUPS_LIST.map(g => {
              const c = members.filter(m => m.group === g).length;
              return <span key={g} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{g}: {c}</span>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
