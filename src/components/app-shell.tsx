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
import { Emblem } from "@/components/emblem";

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
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="india-stripe" />
      <header className="bg-white border-b">
        <div className="flex items-center justify-between gap-3 px-4 py-2">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Emblem className="h-10 w-10 shrink-0" />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Government of India · DoCA
              </span>
              <span className="block font-bold text-[var(--navy)] leading-tight">MaapSetu dashboard</span>
            </span>
          </Link>
          <div className="text-right text-xs">
            <p className="font-semibold">{user.name}</p>
            <p className="text-[var(--muted)]">
              {user.role} · {user.district}
            </p>
          </div>
        </div>
      </header>
      <div className="min-h-[calc(100vh-58px)] grid lg:grid-cols-[230px_1fr]">
        <aside className="bg-[var(--navy)] text-white px-3 py-4 flex flex-col">
          <nav className="space-y-1 flex-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm ${
                    active ? "bg-white/15 font-semibold" : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/verify"
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              <QrCode size={16} />
              Know Your Certificate
            </Link>
          </nav>
          <button type="button" onClick={logout} className="mt-3 flex items-center gap-2 px-3 py-2 text-xs bg-[var(--goi-red)]">
            <LogOut size={14} /> Logout
          </button>
        </aside>
        <main id="main-content" className="p-5 lg:p-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
