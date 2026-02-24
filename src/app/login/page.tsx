"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Toast } from "@/components/Toast";

export default function LoginPage() {
  const { login, appUser, loading } = useAuth();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appUser) return;
    router.replace(appUser.role === "admin" ? "/admin" : "/staff");
  }, [appUser, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!usernameOrEmail || !password) {
      setError("Username/email and password are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await login(usernameOrEmail, password);
    } catch {
      setError("Invalid credentials or account unavailable.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Tip Distribution Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Admin quick login: username <strong>admin</strong> and password <strong>admin123</strong>.
        </p>
        <input
          type="text"
          placeholder="Username or Email"
          className="w-full rounded border px-3 py-2"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-70"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
    </div>
  );
}
