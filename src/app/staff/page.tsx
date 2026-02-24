"use client";

import Link from "next/link";

export default function StaffDashboardPage() {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Staff Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Submit and review your cash tip entries for each shift.</p>
      <Link href="/staff/cash-entry" className="mt-4 inline-block rounded bg-brand px-4 py-2 text-white">
        Go to Cash Entry
      </Link>
    </div>
  );
}
