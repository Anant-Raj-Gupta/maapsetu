import Link from "next/link";
import { statusTone } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${statusTone(status)}`}>{status.replaceAll("_", " ")}</span>;
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 bg-[var(--paper)]/90 backdrop-blur border-b">
      <div className="india-stripe" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--navy)] text-white font-display text-lg">
            मा
          </span>
          <span>
            <span className="block font-display text-lg leading-none">MaapSetu</span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Legal Metrology
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/verify" className="hidden sm:inline hover:underline">
            Verify certificate
          </Link>
          <Link href="/login" className="btn btn-ghost py-2">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary py-2">
            Register instrument user
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-[var(--muted)]">
        <p className="font-medium text-[var(--navy)]">MaapSetu SIH 2026 prototype</p>
        <p className="mt-1 max-w-3xl">
          Built for SIH26036 — Department of Consumer Affairs. Complements the national e-Maap
          portal with field verification, QR stamping and consumer authentication. Not an official
          Government of India website.
        </p>
      </div>
    </footer>
  );
}
