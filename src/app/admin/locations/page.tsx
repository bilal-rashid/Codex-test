"use client";

import { useAuth } from "@/context/AuthContext";
import { useLocations } from "@/hooks/useLocations";

export default function AdminLocationsPage() {
  const { appUser } = useAuth();
  const { locations, loading, error } = useLocations(appUser?.restaurantId);

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Locations</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Loading locations...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : !locations.length ? (
        <p className="text-sm text-slate-500">No active locations found.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {locations.map((location) => (
            <li key={location.id} className="rounded border p-3">
              <p className="font-medium">{location.name}</p>
              <p className="text-slate-600">Timezone: {location.timezone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
