"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Location } from "@/lib/types";

export const useLocations = (restaurantId?: string) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!restaurantId) {
        setLocations([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, "locations"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);
        setLocations(
          snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<Location, "id">)
            }))
            .filter((location) => location.isActive)
        );
      } catch {
        setError("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [restaurantId]);

  return { locations, loading, error };
};
