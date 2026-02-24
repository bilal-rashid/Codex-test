"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const { appUser, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (loading) return;
    if (!appUser || appUser.role !== "staff" || !appUser.isActive) {
      router.replace("/login");
    }
  }, [appUser, loading, router]);

  if (loading || !appUser || appUser.role !== "staff") return <LoadingSpinner label="Validating access..." />;

  return (
    <div>
      <Header
        title="Staff Portal"
        onLogout={logout}
        links={[
          { href: "/staff", label: "Dashboard" },
          { href: "/staff/cash-entry", label: "Cash Entry" }
        ]}
      />
      {children}
    </div>
  );
}
