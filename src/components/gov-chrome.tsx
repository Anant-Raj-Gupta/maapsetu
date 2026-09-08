"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu } from "lucide-react";

export function UtilityBar() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [hi, setHi] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    document.documentElement.dataset.font = size;
  }, [size]);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-IN"));
  }, []);

  return (
    <div className="utility-bar">
      <div className="gov-wrap flex items-center justify-between gap-3 py-1.5 text-[11px]">
        <div className="flex items-center gap-3 min-w-0">
          <a href="#main-content" className="underline-offset-2 hover:underline">
            Skip to main content
          </a>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden md:inline truncate">
            Ministry of Consumer Affairs, Food &amp; Public Distribution
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden sm:inline text-white/70">{today}</span>
          <CalendarDays size={13} className="hidden sm:block opacity-80" />
          <span className="text-white/50">|</span>
          <button type="button" onClick={() => setSize("sm")} className="hover:underline" aria-label="Decrease text">
            A-
          </button>
          <button type="button" onClick={() => setSize("md")} className="hover:underline font-semibold" aria-label="Default text">
            A
          </button>
          <button type="button" onClick={() => setSize("lg")} className="text-sm hover:underline" aria-label="Increase text">
            A+
          </button>
          <span className="text-white/50">|</span>
          <button type="button" onClick={() => setHi((v) => !v)} className="hover:underline">
            {hi ? "English" : "हिन्दी"}
          </button>
          <TricolourMini />
        </div>
      </div>
      {hi ? (
        <p className="gov-wrap pb-1 text-[11px] text-white/80">
          यह एक SIH 2026 प्रोटोटाइप है — आधिकारिक भारत सरकार पोर्टल नहीं।
        </p>
      ) : null}
    </div>
  );
}

function TricolourMini() {
  return (
    <svg viewBox="0 0 36 24" className="h-3.5 w-6" aria-hidden>
      <rect width="36" height="8" fill="#FF9933" />
      <rect y="8" width="36" height="8" fill="#fff" />
      <rect y="16" width="36" height="8" fill="#138808" />
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" className="p-2 text-[var(--navy)]" onClick={() => setOpen((v) => !v)} aria-label="Menu">
        <Menu size={22} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full border-b bg-white shadow-md">
          <nav className="gov-wrap py-3 grid gap-2 text-sm">
            <Link href="/verify" onClick={() => setOpen(false)}>Know Your Certificate</Link>
            <Link href="/login" onClick={() => setOpen(false)}>Officer / User Login</Link>
            <Link href="/register" onClick={() => setOpen(false)}>New Registration</Link>
            <Link href="/app" onClick={() => setOpen(false)}>Dashboard</Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
