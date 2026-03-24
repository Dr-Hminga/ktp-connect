import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, LayoutGrid } from "lucide-react";
import { Member, GROUPS_LIST } from "@/data/mockData";

const StatCards = ({ members }: { members: Member[] }) => {
  const total = members.length;
  const male = members.filter(m => m.gender === "Male").length;
  const female = total - male;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          <div className="flex items-center gap-2 mb-1"><UserX className="h-5 w-5 text-gold" /><span className="text-xs text-muted-foreground">Female</span></div>
          <p className="text-2xl font-bold text-gold">{female}</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20 col-span-2 lg:col-span-1">
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
