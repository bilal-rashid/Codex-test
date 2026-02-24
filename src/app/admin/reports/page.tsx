"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocations } from "@/hooks/useLocations";
import { useReports } from "@/hooks/useReports";
import { useStaff } from "@/hooks/useStaff";
import { ShiftType, TipReport } from "@/lib/types";
import { formatCurrency, todayString } from "@/utils/format";
import { Toast } from "@/components/Toast";

export default function AdminReportsPage() {
  const { appUser } = useAuth();
  const { locations } = useLocations(appUser?.restaurantId);
  const [locationId, setLocationId] = useState("");
  const [date, setDate] = useState(todayString());
  const [shiftType, setShiftType] = useState<ShiftType>("day");
  const { staff } = useStaff(appUser?.restaurantId, locationId);
  const { loading, generateReport, lockReport, getReport } = useReports();

  const [report, setReport] = useState<TipReport | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const activeStaff = useMemo(() => staff.filter((member) => member.isActive), [staff]);

  const handleGenerate = async () => {
    if (!appUser || !locationId) {
      setToast({ message: "Please select location and date.", type: "error" });
      return;
    }

    try {
      const data = await generateReport(locationId, date, shiftType, appUser.id, activeStaff);
      setReport(data as TipReport);
      setToast({ message: "Report generated successfully.", type: "success" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Failed to generate report.", type: "error" });
    }
  };

  const handleLoadExisting = async () => {
    if (!locationId) return;
    const found = await getReport(locationId, date, shiftType);
    setReport(found);
  };

  const handleLock = async () => {
    if (!report) return;
    if (!window.confirm("Lock this report? This action prevents further edits.")) return;
    await lockReport(report.id);
    setReport({ ...report, locked: true });
    setToast({ message: "Report locked.", type: "success" });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Generate Report Snapshot</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <select className="rounded border px-3 py-2" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            <option value="">Select location</option>
            {locations.map((location) => (
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
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => void handleGenerate()} className="rounded bg-brand px-3 py-2 text-white">
              {loading ? "Generating..." : "Generate Report"}
            </button>
            <button onClick={() => void handleLoadExisting()} className="rounded bg-slate-200 px-3 py-2">
              Load
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        {!report ? (
          <p className="text-sm text-slate-600">No report loaded.</p>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium">Total Tips: {formatCurrency(report.totalTips)}</p>
                <p className="text-sm text-slate-600">Status: {report.locked ? "Locked" : "Open"}</p>
              </div>
              <button
                onClick={() => void handleLock()}
                disabled={report.locked}
                className="rounded bg-slate-800 px-3 py-2 text-white disabled:opacity-50"
              >
                Lock Report
              </button>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border px-3 py-2 text-left">Staff ID</th>
                  <th className="border px-3 py-2 text-left">Share Amount</th>
                </tr>
              </thead>
              <tbody>
                {report.distributionData.map((row) => (
                  <tr key={row.staffId}>
                    <td className="border px-3 py-2">{row.staffId}</td>
                    <td className="border px-3 py-2">{formatCurrency(row.shareAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
