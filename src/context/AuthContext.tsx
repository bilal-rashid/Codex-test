"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AppUser } from "@/lib/types";

interface AuthContextType {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUserDoc = (id: string, data: Record<string, unknown>): AppUser => ({
  id,
  name: String(data.name || ""),
  email: String(data.email || ""),
  role: (data.role as AppUser["role"]) || "staff",
  restaurantId: String(data.restaurantId || ""),
  locationIds: Array.isArray(data.locationIds) ? (data.locationIds as string[]) : [],
  isActive: Boolean(data.isActive)
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAppUser = useCallback(async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      setAppUser(null);
      return;
    }
    setAppUser(mapUserDoc(snap.id, snap.data()));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setFirebaseUser(user);
      if (user) {
        await loadAppUser(user.uid);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadAppUser]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await loadAppUser(auth.currentUser.uid);
  };

  const value = useMemo(
    () => ({ firebaseUser, appUser, loading, login, logout, refreshUser }),
    [firebaseUser, appUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
