"use client";

export const LoadingSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex min-h-[200px] items-center justify-center text-slate-600">
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <span>{label}</span>
    </div>
  </div>
);
