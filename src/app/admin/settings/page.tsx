"use client";

export default function AdminSettingsPage() {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Settings</h2>
      <p className="mt-2 text-sm text-slate-600">
        Configure shift defaults and operational controls. Store shift windows in <code>shiftConfigs</code> by location.
      </p>
      <div className="mt-4 rounded border border-dashed p-4 text-sm text-slate-500">
        Suggested composite indexes:
        <ul className="list-disc pl-5">
          <li>cashSubmissions: locationId + date + shiftType</li>
          <li>reports: locationId + date + shiftType</li>
        </ul>
      </div>
    </div>
  );
}
