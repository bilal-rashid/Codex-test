"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useLocations } from "@/hooks/useLocations";
import { useStaff } from "@/hooks/useStaff";
import { db } from "@/lib/firebase";
import { Toast } from "@/components/Toast";

export default function AdminStaffPage() {
  const { appUser } = useAuth();
  const { locations } = useLocations(appUser?.restaurantId);
  const { staff, loading, error } = useStaff(appUser?.restaurantId);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserLocationIds, setNewUserLocationIds] = useState<string[]>([]);

  const [staffName, setStaffName] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffLocationIds, setStaffLocationIds] = useState<string[]>([]);

  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const restaurantId = useMemo(() => appUser?.restaurantId || "", [appUser?.restaurantId]);

  const toggleLocation = (target: string, ids: string[], setIds: (value: string[]) => void) => {
    setIds(ids.includes(target) ? ids.filter((id) => id !== target) : [...ids, target]);
  };

  const handleCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!restaurantId || !newUserName || !newUserEmail) {
      setToast({ message: "Name and email are required to create a user.", type: "error" });
      return;
    }

    setSubmittingUser(true);
    try {
      await addDoc(collection(db, "users"), {
        name: newUserName,
        email: newUserEmail,
        role: "staff",
        restaurantId,
        locationIds: newUserLocationIds,
        isActive: true,
        createdAt: serverTimestamp()
      });
      setNewUserName("");
      setNewUserEmail("");
      setNewUserLocationIds([]);
      setToast({ message: "User created successfully.", type: "success" });
    } catch {
      setToast({ message: "Failed to create user.", type: "error" });
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleCreateStaff = async (event: FormEvent) => {
    event.preventDefault();
    if (!restaurantId || !staffName || !staffUsername) {
      setToast({ message: "Name and username are required to create staff.", type: "error" });
      return;
    }

    setSubmittingStaff(true);
    try {
      await addDoc(collection(db, "staff"), {
        name: staffName,
        username: staffUsername,
        restaurantId,
        locationIds: staffLocationIds,
        isActive: true,
        createdAt: serverTimestamp()
      });
      setStaffName("");
      setStaffUsername("");
      setStaffLocationIds([]);
      setToast({ message: "Staff member created successfully.", type: "success" });
    } catch {
      setToast({ message: "Failed to create staff member.", type: "error" });
    } finally {
      setSubmittingStaff(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={handleCreateUser} className="rounded-lg border bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Create User</h2>
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded border px-3 py-2"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <div>
            <p className="mb-2 text-sm font-medium">Assign locations</p>
            <div className="space-y-1 text-sm">
              {locations.map((location) => (
                <label key={location.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newUserLocationIds.includes(location.id)}
                    onChange={() => toggleLocation(location.id, newUserLocationIds, setNewUserLocationIds)}
                  />
                  {location.name}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={submittingUser}
            className="rounded bg-brand px-4 py-2 text-white disabled:opacity-60"
          >
            {submittingUser ? "Creating..." : "Create User"}
          </button>
        </form>

        <form onSubmit={handleCreateStaff} className="rounded-lg border bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Create Staff</h2>
          <input
            type="text"
            placeholder="Staff name"
            className="w-full rounded border px-3 py-2"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded border px-3 py-2"
            value={staffUsername}
            onChange={(e) => setStaffUsername(e.target.value)}
          />
          <div>
            <p className="mb-2 text-sm font-medium">Assign locations</p>
            <div className="space-y-1 text-sm">
              {locations.map((location) => (
                <label key={location.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={staffLocationIds.includes(location.id)}
                    onChange={() => toggleLocation(location.id, staffLocationIds, setStaffLocationIds)}
                  />
                  {location.name}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={submittingStaff}
            className="rounded bg-brand px-4 py-2 text-white disabled:opacity-60"
          >
            {submittingStaff ? "Creating..." : "Create Staff"}
          </button>
        </form>
      </div>

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

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
