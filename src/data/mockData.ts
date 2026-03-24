export interface Member {
  id: string;
  fullName: string;
  gender: "Male" | "Female";
  fatherName: string;
  phone: string;
  upaBial: number;
  group: string;
  dualMember: boolean;
  kristianMagazine: boolean;
}

const GROUPS = ["Jeremia", "Amosa", "Obadia", "Mika"];
const NAMES_M = ["Lalthanzuala", "Vanlalruata", "Biakthansanga", "Lalrinmawia", "Zonunsanga", "Remruatdika", "Lalhmangaiha", "Thangzuala", "Ramdinliana", "Lalchhandama"];
const NAMES_F = ["Lalruatfeli", "Vanlalhriati", "Zorinpuii", "Lalhmingsangi", "Esther Lalremi", "Malsawmtluangi", "Vanlalruati", "Rebecca Lalthanpuii"];
const FATHER_NAMES = ["Lalthanga", "Biakzuala", "Vanlalchhuanga", "Thangzuala", "Remruata", "Lalrinawma", "Hmingthanga"];

let id = 0;
const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateMockMembers = (): Member[] => {
  const members: Member[] = [];
  for (let i = 0; i < 48; i++) {
    const gender = Math.random() > 0.45 ? "Male" : "Female";
    const names = gender === "Male" ? NAMES_M : NAMES_F;
    members.push({
      id: String(++id),
      fullName: rand(names),
      gender,
      fatherName: rand(FATHER_NAMES),
      phone: String(Math.floor(6000000000 + Math.random() * 4000000000)),
      upaBial: Math.floor(Math.random() * 12) + 1,
      group: rand(GROUPS),
      dualMember: Math.random() > 0.8,
      kristianMagazine: Math.random() > 0.7,
    });
  }
  return members;
};

export const GROUPS_LIST = GROUPS;
export const UPA_BIAL_LIST = Array.from({ length: 12 }, (_, i) => i + 1);
