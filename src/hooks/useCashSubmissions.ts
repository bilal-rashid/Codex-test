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
import { ShiftType } from "@/lib/types";

interface Payload {
  staffId: string;
  locationId: string;
  date: string;
  shiftType: ShiftType;
  amount: number;
}

export const useCashSubmissions = () => {
  const [loading, setLoading] = useState(false);

  const upsertSubmission = async (payload: Payload) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "cashSubmissions"),
        where("staffId", "==", payload.staffId),
        where("locationId", "==", payload.locationId),
        where("date", "==", payload.date),
        where("shiftType", "==", payload.shiftType)
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        const submissionRef = doc(db, "cashSubmissions", existing.docs[0].id);
        await updateDoc(submissionRef, { amount: payload.amount, updatedAt: serverTimestamp() });
        return { id: existing.docs[0].id, updated: true };
      }

      const created = await addDoc(collection(db, "cashSubmissions"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: created.id, updated: false };
    } finally {
      setLoading(false);
    }
  };

  return { upsertSubmission, loading };
};
