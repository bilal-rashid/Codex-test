"use client";

import { useAuth } from "@/context/AuthContext";
import { useStaff } from "@/hooks/useStaff";

export default function AdminStaffPage() {
  const { appUser } = useAuth();
  const { staff, loading, error } = useStaff(appUser?.restaurantId);

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Staff Directory</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Loading staff...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : !staff.length ? (
        <p className="text-sm text-slate-500">No active staff records found.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {staff.map((member) => (
            <li key={member.id} className="rounded border p-3">
              <p className="font-medium">{member.name}</p>
              <p className="text-slate-600">@{member.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
