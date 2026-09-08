import Link from "next/link";
import {
  QrCode,
  Smartphone,
  ShieldCheck,
  Bell,
  MapPin,
  FileCheck,
  Scale,
  Landmark,
  BadgeCheck,
  Users,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public";
import { VerifySearch } from "@/components/forms";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [instruments, certificates, pending, officers] = await Promise.all([
    prisma.instrument.count(),
    prisma.certificate.count(),
    prisma.application.count({ where: { status: { in: ["SUBMITTED", "ASSIGNED"] } } }),
    prisma.user.count({ where: { role: { in: ["LMO", "GATC"] } } }),
  ]);

  return (
    <div>
      <PublicHeader search />
      <main id="main-content">
        <section className="hero-gov">
          <div className="gov-wrap py-16 sm:py-20 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--saffron)] font-semibold">
              राष्ट्रीय विधिक माप विज्ञान पोर्टल · SIH 2026
            </p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">
              MaapSetu
            </h1>
            <p className="mt-2 text-lg text-white/85">
              Where verification, stamping and consumer trust converge
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-white/75">
              Online verification of weighing and measuring instruments under the Legal Metrology
              Act, 2009 — for traders, Legal Metrology Officers, GATCs and the public.
            </p>
            <div className="mx-auto mt-8 flex justify-center">
              <VerifySearch variant="hero" />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/verify" className="chip">
                Verify Scale
              </Link>
              <Link href="/login" className="chip">
                Officer Login
              </Link>
              <Link href="/register" className="chip">
                Apply for Verification
              </Link>
              <Link href="/login" className="chip">
                GATC Login
              </Link>
              <Link href="/verify" className="chip">
                Know Your Certificate
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="gov-wrap flex flex-col sm:flex-row items-center gap-5 py-8">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--navy)] text-white text-2xl font-bold">
              DoCA
            </div>
            <blockquote className="card flex-1 p-5 shadow-sm">
              <p>
                “Every weight or measure used in any transaction or for protection shall be verified
                and stamped before being put into use, and shall be reverified at such periodical
                intervals as may be prescribed.”
              </p>
              <footer className="mt-3 text-sm text-[var(--muted)]">
                Legal Metrology Act, 2009 · Department of Consumer Affairs
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="stat-bar">
          <div className="gov-wrap grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 text-center">
            <Stat icon={Scale} value={instruments} label="Registered instruments" />
            <Stat icon={BadgeCheck} value={certificates} label="Digital certificates" />
            <Stat icon={Bell} value={pending} label="Pending verifications" />
            <Stat icon={Users} value={officers} label="LMOs & GATCs onboarded" />
          </div>
        </section>

        <section className="py-12">
          <div className="gov-wrap">
            <h2 className="text-2xl font-bold text-[var(--navy)]">Online services</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Citizen, trader and enforcement services at a glance</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <Link key={s.title} href={s.href} className="card p-5 hover:border-[var(--navy)]">
                  <s.icon className="text-[var(--goi-red)]" size={28} />
                  <h3 className="mt-3 font-bold text-[var(--navy)]">{s.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{s.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="gov-wrap grid lg:grid-cols-[0.9fr_1.1fr] gap-0 overflow-hidden rounded-[6px] border">
            <div className="red-panel p-8">
              <h2 className="text-2xl font-bold">Online services</h2>
              <p className="mt-2 text-white/90">Avail online verification and save time at the circle office.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="border border-white/30 p-3">
                  <p className="text-2xl font-bold">{instruments}</p>
                  <p>Instruments</p>
                </div>
                <div className="border border-white/30 p-3">
                  <p className="text-2xl font-bold">{certificates}</p>
                  <p>Certificates</p>
                </div>
                <div className="border border-white/30 p-3">
                  <p className="text-2xl font-bold">3</p>
                  <p>Stakeholder roles</p>
                </div>
                <div className="border border-white/30 p-3">
                  <p className="text-2xl font-bold">24×7</p>
                  <p>Public verify</p>
                </div>
              </div>
              <Link href="/register" className="mt-6 inline-block border border-white px-4 py-2 font-bold">
                View all
              </Link>
            </div>
            <div className="bg-white p-8">
              <h2 className="text-2xl font-bold text-[var(--navy)]">How to use this portal</h2>
              <ol className="mt-4 space-y-3 text-sm">
                <li>
                  <strong>1. Instrument user —</strong> Login as shop@maapsetu.gov.in and apply for
                  re-verification of the expiring counter scale.
                </li>
                <li>
                  <strong>2. Controller —</strong> Login as admin@maapsetu.gov.in and auto-assign pending
                  jobs to LMO / GATC.
                </li>
                <li>
                  <strong>3. Field officer —</strong> Login as lmo@maapsetu.gov.in and record inspection
                  of the fuel dispenser.
                </li>
                <li>
                  <strong>4. Citizen —</strong> Search certificate <code>VC/TS/HYD/2025/00011</code>{" "}
                  from the box above.
                </li>
              </ol>
              <p className="mt-5 text-xs text-[var(--muted)]">
                Complements the national e-Maap portal. Does not replace model approval, LMPC or
                manufacturing licences.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Scale;
  value: number;
  label: string;
}) {
  return (
    <div>
      <Icon className="mx-auto text-[var(--goi-red)]" size={28} />
      <p className="mt-2 text-3xl font-bold text-[var(--navy)]">{value}</p>
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}

const services = [
  {
    href: "/verify",
    icon: QrCode,
    title: "Know Your Certificate",
    body: "Scan or enter a QR certificate number to check if a scale is valid for trade.",
  },
  {
    href: "/register",
    icon: FileCheck,
    title: "Apply for verification",
    body: "Register as a trader and submit first verification or re-verification applications.",
  },
  {
    href: "/login",
    icon: Smartphone,
    title: "Field officer workspace",
    body: "LMOs record MPE, photographs and geo-tagged inspection results on site.",
  },
  {
    href: "/login",
    icon: Landmark,
    title: "GATC test centre",
    body: "Government Approved Test Centres receive high-capacity weighbridge assignments.",
  },
  {
    href: "/login",
    icon: MapPin,
    title: "Controller dashboard",
    body: "Monitor pendency, assign work and view district-level enforcement status.",
  },
  {
    href: "/login",
    icon: ShieldCheck,
    title: "Digital stamping",
    body: "QR-enabled verification certificates with an integrity hash for public authentication.",
  },
];
