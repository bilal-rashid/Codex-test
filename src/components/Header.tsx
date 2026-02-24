"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  title: string;
  links: { href: string; label: string }[];
  onLogout: () => Promise<void>;
}

export const Header = ({ title, links, onLogout }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <header className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-1.5 text-sm ${
                pathname === link.href ? "bg-brand text-white" : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={() => void onLogout()} className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
