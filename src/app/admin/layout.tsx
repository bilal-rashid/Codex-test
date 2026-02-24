"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Header } from "@/components/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { appUser, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (loading) return;
    if (!appUser || appUser.role !== "admin" || !appUser.isActive) {
      router.replace("/login");
    }
  }, [appUser, loading, router]);

  if (loading || !appUser || appUser.role !== "admin") return <LoadingSpinner label="Validating access..." />;

  return (
    <div>
      <Header
        title="Admin Panel"
        onLogout={logout}
        links={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/reports", label: "Reports" },
          { href: "/admin/staff", label: "Staff" },
          { href: "/admin/locations", label: "Locations" },
          { href: "/admin/settings", label: "Settings" }
        ]}
      />
      {children}
    </div>
  );
}
