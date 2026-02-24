"use client";

import { useEffect, useState } from "react";
import { collection, FirestoreError, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
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
      } catch (err) {
        const isPermissionDenied =
          err instanceof FirestoreError && err.code === "permission-denied";

        if (isPermissionDenied && !auth.currentUser && restaurantId === "default-restaurant") {
          const demoStaff = [
            {
              id: "seed-staff-1",
              userId: "seed-admin",
              restaurantId: "default-restaurant",
              name: "Seed Staff",
              username: "seed.staff",
              locationIds: ["default-location"],
              isActive: true
            }
          ];

          setStaff(
            locationId && locationId.length
              ? demoStaff.filter((s) => !s.locationIds || s.locationIds.includes(locationId))
              : demoStaff
          );
          setError(null);
        } else {
          setError("Failed to load staff.");
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [restaurantId, locationId]);

  return { staff, loading, error };
};
