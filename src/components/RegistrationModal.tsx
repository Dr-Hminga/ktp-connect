import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Member, GROUPS_LIST, UPA_BIAL_LIST } from "@/data/mockData";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (m: Omit<Member, "id">) => void;
  editMember?: Member | null;
  allowedGroup?: string;
}

const emptyForm = { fullName: "", gender: "" as "" | "Male" | "Female", fatherName: "", phone: "", upaBial: "", group: "", dualMember: false, kristianMagazine: false };

const RegistrationModal = ({ open, onOpenChange, onSubmit, editMember, allowedGroup }: Props) => {
  const [form, setForm] = useState(editMember ? {
    fullName: editMember.fullName, gender: editMember.gender, fatherName: editMember.fatherName,
    phone: editMember.phone, upaBial: String(editMember.upaBial), group: editMember.group,
    dualMember: editMember.dualMember, kristianMagazine: editMember.kristianMagazine,
  } : { ...emptyForm, group: allowedGroup || "" });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.fatherName.trim()) e.fatherName = "Required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Exactly 10 digits";
    if (!form.upaBial) e.upaBial = "Required";
    if (!form.group) e.group = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      fullName: form.fullName.trim(), gender: form.gender as "Male" | "Female",
      fatherName: form.fatherName.trim(), phone: form.phone,
      upaBial: Number(form.upaBial), group: form.group,
      dualMember: form.dualMember, kristianMagazine: form.kristianMagazine,
    });
    toast.success(editMember ? "Member updated" : "Member registered");
    onOpenChange(false);
    if (!editMember) setForm({ ...emptyForm, group: allowedGroup || "" });
  };

  const groups = allowedGroup ? [allowedGroup] : GROUPS_LIST;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-primary">{editMember ? "Edit Member" : "Register New Member"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name *</Label>
            <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
            {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <Label>Gender *</Label>
            <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v as "Male" | "Female" }))}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender}</p>}
          </div>
          <div>
            <Label>Father's Name *</Label>
            <Input value={form.fatherName} onChange={e => setForm(f => ({ ...f, fatherName: e.target.value }))} />
            {errors.fatherName && <p className="text-sm text-destructive mt-1">{errors.fatherName}</p>}
          </div>
          <div>
            <Label>Phone Number * (10 digits)</Label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>
          <div>
            <Label>Upa Bial *</Label>
            <Select value={form.upaBial} onValueChange={v => setForm(f => ({ ...f, upaBial: v }))}>
              <SelectTrigger><SelectValue placeholder="Select Upa Bial" /></SelectTrigger>
              <SelectContent>{UPA_BIAL_LIST.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
            </Select>
            {errors.upaBial && <p className="text-sm text-destructive mt-1">{errors.upaBial}</p>}
          </div>
          <div>
            <Label>Group *</Label>
            <Select value={form.group} onValueChange={v => setForm(f => ({ ...f, group: v }))} disabled={!!allowedGroup}>
              <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
              <SelectContent>{groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
            {errors.group && <p className="text-sm text-destructive mt-1">{errors.group}</p>}
          </div>
          <div className="flex items-center justify-between">
            <Label>Dual Member</Label>
            <Switch checked={form.dualMember} onCheckedChange={v => setForm(f => ({ ...f, dualMember: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Kristian Thalai Magazine</Label>
            <Switch checked={form.kristianMagazine} onCheckedChange={v => setForm(f => ({ ...f, kristianMagazine: v }))} />
          </div>
          <Button type="submit" className="w-full">{editMember ? "Update" : "Register"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
