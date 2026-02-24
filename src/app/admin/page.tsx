"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { appUser } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-white p-5 shadow-sm md:col-span-2">
        <h2 className="text-lg font-semibold">Welcome, {appUser?.name}</h2>
        <p className="mt-2 text-sm text-slate-600">Manage tip submissions, generate snapshots, and lock reports.</p>
      </div>
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Quick Rules</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>One submission per staff/date/shift/location.</li>
          <li>Lock reports to freeze financial snapshots.</li>
          <li>Use date+shift filters before generation.</li>
        </ul>
      </div>
    </div>
  );
}
