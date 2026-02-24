"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StaffMember } from "@/lib/types";

export const useStaff = (restaurantId?: string, locationId?: string) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!restaurantId) {
        setStaff([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        setError(null);
        const q = query(collection(db, "staff"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<StaffMember, "id">) }))
          .filter((member) => member.isActive);
        const filtered =
          locationId && locationId.length
            ? data.filter((s) => !s.locationIds || s.locationIds.includes(locationId))
            : data;
        setStaff(filtered);
      } catch {
        setError("Failed to load staff.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [restaurantId, locationId]);

  return { staff, loading, error };
};
