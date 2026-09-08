"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Scale,
  ClipboardList,
  QrCode,
  LogOut,
  Shield,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";

const links = {
  TRADER: [
    { href: "/app", label: "Overview", icon: LayoutDashboard },
    { href: "/app/instruments", label: "Instruments", icon: Scale },
    { href: "/app/applications", label: "Applications", icon: ClipboardList },
  ],
  LMO: [
    { href: "/app", label: "Field roster", icon: LayoutDashboard },
    { href: "/app/applications", label: "Assigned jobs", icon: ClipboardList },
  ],
  GATC: [
    { href: "/app", label: "Test centre", icon: LayoutDashboard },
    { href: "/app/applications", label: "Assigned jobs", icon: ClipboardList },
  ],
  ADMIN: [
    { href: "/app", label: "Control room", icon: LayoutDashboard },
    { href: "/app/applications", label: "All applications", icon: ClipboardList },
    { href: "/app/queue", label: "Assign work", icon: Shield },
  ],
};

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = links[user.role];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-[var(--navy)] text-white px-4 py-5 flex flex-col">
        <Link href="/" className="px-2 mb-8">
          <p className="font-display text-2xl">MaapSetu</p>
          <p className="text-xs text-white/60 uppercase tracking-[0.18em]">Field verification</p>
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/verify"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <QrCode size={16} />
            Public verify
          </Link>
        </nav>
        <div className="rounded-xl bg-white/10 p-3 text-sm">
          <p className="font-semibold">{user.name}</p>
          <p className="text-white/70 text-xs mt-0.5">
            {user.role} · {user.district}
          </p>
          <button type="button" onClick={logout} className="mt-3 flex items-center gap-2 text-xs text-amber-200">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-h-screen">
        <div className="india-stripe" />
        <div className="p-5 lg:p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
