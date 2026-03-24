import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "public" | "super_admin" | "group_leader";

interface AuthUser {
  role: Role;
  group?: string;
  label: string;
}

interface AuthContextType {
  user: AuthUser;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

const GROUPS = ["Jeremia", "Amosa", "Obadia", "Mika"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>({ role: "public", label: "Public" });

  const login = (username: string, password: string): boolean => {
    if (username === "admin" && password === "adminpassword") {
      setUser({ role: "super_admin", label: "Super Admin" });
      return true;
    }
    for (const g of GROUPS) {
      if (username === `leader_${g.toLowerCase()}` && password === "leaderpassword") {
        setUser({ role: "group_leader", group: g, label: `${g} Leader` });
        return true;
      }
    }
    return false;
  };

  const logout = () => setUser({ role: "public", label: "Public" });

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
