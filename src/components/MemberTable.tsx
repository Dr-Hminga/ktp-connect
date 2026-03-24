import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Member, GROUPS_LIST, UPA_BIAL_LIST } from "@/data/mockData";
import { Pencil, Trash2, Download, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface Props {
  members: Member[];
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
}

const MemberTable = ({ members, onEdit, onDelete }: Props) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterUpaBial, setFilterUpaBial] = useState("all");

  const filtered = members.filter(m => {
    if (user.role === "group_leader" && m.group !== user.group) return false;
    if (search && !m.fullName.toLowerCase().includes(search.toLowerCase()) && !m.phone.includes(search)) return false;
    if (filterGroup !== "all" && m.group !== filterGroup) return false;
    if (filterGender !== "all" && m.gender !== filterGender) return false;
    if (filterUpaBial !== "all" && m.upaBial !== Number(filterUpaBial)) return false;
    return true;
  });

  const canEdit = (m: Member) => {
    if (user.role === "super_admin") return true;
    if (user.role === "group_leader" && m.group === user.group) return true;
    return false;
  };

  const canDelete = () => user.role === "super_admin";

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const byUpaBial: Record<number, Member[]> = {};
    filtered.forEach(m => { (byUpaBial[m.upaBial] ||= []).push(m); });
    const sortedKeys = Object.keys(byUpaBial).map(Number).sort((a, b) => a - b);
    sortedKeys.forEach(ub => {
      const data = byUpaBial[ub].map(m => ({
        "Full Name": m.fullName, Gender: m.gender, "Father's Name": m.fatherName,
        Phone: m.phone, "Upa Bial": m.upaBial, Group: m.group,
        "Dual Member": m.dualMember ? "Yes" : "No", "KT Magazine": m.kristianMagazine ? "Yes" : "No",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, `Upa Bial ${ub}`);
    });
    XLSX.writeFile(wb, "KTP_Members.xlsx");
    toast.success("Exported to Excel");
  };

  const showActions = user.role === "super_admin" || user.role === "group_leader";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Group" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {GROUPS_LIST.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterGender} onValueChange={setFilterGender}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterUpaBial} onValueChange={setFilterUpaBial}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Upa Bial" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {UPA_BIAL_LIST.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
        {user.role === "super_admin" && (
          <Button variant="outline" size="sm" onClick={exportExcel} className="gap-1 border-gold text-gold hover:bg-gold/10">
            <Download className="h-4 w-4" />Excel
          </Button>
        )}
      </div>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5">
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="hidden sm:table-cell">Father</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Upa Bial</TableHead>
              <TableHead>Group</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={showActions ? 7 : 6} className="text-center text-muted-foreground py-8">No members found</TableCell></TableRow>
            ) : filtered.map(m => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.fullName}</TableCell>
                <TableCell>{m.gender}</TableCell>
                <TableCell className="hidden sm:table-cell">{m.fatherName}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>{m.upaBial}</TableCell>
                <TableCell><span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{m.group}</span></TableCell>
                {showActions && (
                  <TableCell className="text-right space-x-1">
                    {canEdit(m) && <Button variant="ghost" size="sm" onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>}
                    {canDelete() && <Button variant="ghost" size="sm" onClick={() => onDelete(m.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground text-right">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default MemberTable;
