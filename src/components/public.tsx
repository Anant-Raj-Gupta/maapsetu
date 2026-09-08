import Link from "next/link";
import { Emblem } from "@/components/emblem";
import { MobileNav, UtilityBar } from "@/components/gov-chrome";
import { statusTone } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${statusTone(status)}`}>{status.replaceAll("_", " ")}</span>;
}

export function PublicHeader({ search = false }: { search?: boolean }) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="india-stripe" />
      <UtilityBar />
      <div className="gov-wrap relative flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Emblem className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              भारत सरकार · Government of India
            </span>
            <span className="block text-xl sm:text-2xl font-bold text-[var(--navy)] leading-tight">
              MaapSetu
            </span>
            <span className="hidden sm:block text-xs text-[var(--muted)]">
              Legal Metrology Verification Portal · DoCA
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-3 shrink-0">
          {search ? (
            <form action="/verify" method="get" className="hidden xl:flex overflow-hidden rounded-[2px] border">
              <input
                name="q"
                className="w-48 px-3 py-2 text-sm outline-none"
                placeholder="Search certificate no."
              />
              <button type="submit" className="bg-[var(--goi-red)] px-3 text-sm font-bold text-white">
                Search
              </button>
            </form>
          ) : null}
          <Link href="/login" className="hidden lg:inline text-sm font-semibold text-[var(--navy)]">
            Login
          </Link>
          <Link href="/register" className="hidden lg:inline btn btn-accent py-2 text-sm">
            Register
          </Link>
          <MobileNav />
        </div>
      </div>
      <nav className="hidden lg:block bg-[var(--navy)] text-white text-sm">
        <div className="gov-wrap flex gap-6 py-2.5 font-medium">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/verify" className="hover:underline">
            Know Your Certificate
          </Link>
          <Link href="/login" className="hover:underline">
            Stakeholder Login
          </Link>
          <Link href="/register" className="hover:underline">
            New Registration
          </Link>
          <Link href="/app" className="hover:underline">
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function PageBanner({
  title,
  crumbs,
}: {
  title: string;
  crumbs: string;
}) {
  return (
    <div className="page-banner">
      <div className="gov-wrap">
        <p className="crumb">{crumbs}</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{title}</h1>
      </div>
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="site-footer mt-0">
      <div className="india-stripe" />
      <div className="gov-wrap grid gap-8 py-10 sm:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <Emblem className="h-10 w-10" />
            <p className="font-bold text-white">MaapSetu</p>
          </div>
          <p className="mt-3 max-w-sm">
            Unified online verification, stamping and digital certification of weighing and measuring
            instruments under the Legal Metrology Act, 2009.
          </p>
        </div>
        <div>
          <p className="font-bold text-white mb-2">Quick links</p>
          <ul className="space-y-1">
            <li>
              <Link href="/verify" className="hover:underline">
                Know Your Certificate
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Officer / GATC login
              </Link>
            </li>
            <li>
              <a href="https://emaap.gov.in/" className="hover:underline" target="_blank" rel="noreferrer">
                National e-Maap portal
              </a>
            </li>
            <li>
              <a href="https://consumeraffairs.nic.in/" className="hover:underline" target="_blank" rel="noreferrer">
                Department of Consumer Affairs
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white mb-2">Helpdesk (demo)</p>
          <p>1800-11-4000 (prototype)</p>
          <p className="mt-2">
            This is an SIH 2026 student prototype (SIH26036). It is not an official Government of
            India website and is not affiliated with NIC production systems.
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="gov-wrap py-3 text-xs text-white/70">
          Content owned by Department of Consumer Affairs (demo) · Designed for GIGW-style presentation ·
          Last updated 08 Sep 2026
        </p>
      </div>
    </footer>
  );
}
