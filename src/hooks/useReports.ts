"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { calculateDistribution } from "@/utils/report";
import { ShiftType, StaffMember, TipReport } from "@/lib/types";

export const useReports = () => {
  const [loading, setLoading] = useState(false);

  const getReport = async (locationId: string, date: string, shiftType: ShiftType): Promise<TipReport | null> => {
    const q = query(
      collection(db, "reports"),
      where("locationId", "==", locationId),
      where("date", "==", date),
      where("shiftType", "==", shiftType)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...(docSnap.data() as Omit<TipReport, "id">) };
  };

  const generateReport = async (
    locationId: string,
    date: string,
    shiftType: ShiftType,
    generatedBy: string,
    activeStaff: StaffMember[]
  ) => {
    setLoading(true);
    try {
      const existing = await getReport(locationId, date, shiftType);
      if (existing?.locked) {
        throw new Error("Report is locked and cannot be regenerated.");
      }

      const submissionsQuery = query(
        collection(db, "cashSubmissions"),
        where("locationId", "==", locationId),
        where("date", "==", date),
        where("shiftType", "==", shiftType)
      );
      const submissions = await getDocs(submissionsQuery);

      const totalTips = submissions.docs.reduce((sum, item) => sum + Number(item.data().amount || 0), 0);
      const distributionData = calculateDistribution(totalTips, activeStaff);

      if (existing) {
        await updateDoc(doc(db, "reports", existing.id), {
          generatedBy,
          generatedAt: serverTimestamp(),
          totalTips,
          distributionData,
          locked: false
        });
        return { ...existing, totalTips, distributionData, locked: false };
      }

      const reportDoc = await addDoc(collection(db, "reports"), {
        locationId,
        date,
        shiftType,
        generatedBy,
        generatedAt: serverTimestamp(),
        totalTips,
        distributionData,
        locked: false
      });

      return { id: reportDoc.id, locationId, date, shiftType, totalTips, distributionData, locked: false };
    } finally {
      setLoading(false);
    }
  };

  const lockReport = async (reportId: string) => {
    await updateDoc(doc(db, "reports", reportId), { locked: true });
  };

  return { loading, getReport, generateReport, lockReport };
};
