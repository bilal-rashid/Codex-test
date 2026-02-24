"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocations } from "@/hooks/useLocations";
import { useCashSubmissions } from "@/hooks/useCashSubmissions";
import { useReports } from "@/hooks/useReports";
import { ShiftType } from "@/lib/types";
import { Toast } from "@/components/Toast";
import { todayString } from "@/utils/format";

export default function CashEntryPage() {
  const { appUser } = useAuth();
  const { locations } = useLocations(appUser?.restaurantId);
  const { upsertSubmission, loading } = useCashSubmissions();
  const { getReport } = useReports();

  const initialLocationId = useMemo(() => appUser?.locationIds?.[0] || "", [appUser?.locationIds]);

  const [locationId, setLocationId] = useState(initialLocationId);
  const [date, setDate] = useState(todayString());
  const [shiftType, setShiftType] = useState<ShiftType>("day");
  const [amount, setAmount] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!appUser || !locationId || amount <= 0) {
      setToast({ message: "Location and valid tip amount are required.", type: "error" });
      return;
    }

    const report = await getReport(locationId, date, shiftType);
    if (report?.locked) {
      setToast({ message: "Report is locked; submissions can no longer be edited.", type: "error" });
      return;
    }

    try {
      await upsertSubmission({
        staffId: appUser.id,
        locationId,
        date,
        shiftType,
        amount
      });
      setToast({ message: "Submission saved successfully.", type: "success" });
    } catch {
      setToast({ message: "Failed to save submission.", type: "error" });
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Cash Tip Entry</h2>
      <form className="grid gap-3 md:max-w-lg" onSubmit={handleSubmit}>
        <select className="rounded border px-3 py-2" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
          <option value="">Select location</option>
          {locations
            .filter((location) => appUser?.locationIds.includes(location.id))
            .map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
        </select>
        <input type="date" className="rounded border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
        <select
          className="rounded border px-3 py-2"
          value={shiftType}
          onChange={(e) => setShiftType(e.target.value as ShiftType)}
        >
          <option value="day">Day Shift</option>
          <option value="night">Night Shift</option>
        </select>
        <input
          type="number"
          min={0}
          step="0.01"
          className="rounded border px-3 py-2"
          placeholder="Tip amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button disabled={loading} className="rounded bg-brand px-4 py-2 text-white disabled:opacity-70">
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
