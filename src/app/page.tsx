import Link from "next/link";
import { QrCode, Smartphone, ShieldCheck, Bell, MapPin, FileCheck } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public";

const features = [
  {
    icon: FileCheck,
    title: "End-to-end workflow",
    body: "Apply, pay (demo), assign LMO or GATC, inspect, stamp, and store the certificate in one ledger.",
  },
  {
    icon: Smartphone,
    title: "Field officer roster",
    body: "Legal Metrology Officers record errors against MPE, attach a live photo, and geo-tag the visit.",
  },
  {
    icon: QrCode,
    title: "Consumer QR check",
    body: "Anyone can scan the stamp QR and see if a shop scale or dispenser is currently valid.",
  },
  {
    icon: Bell,
    title: "Expiry and pendency",
    body: "Dashboards surface instruments due in 30 days and applications waiting for an officer.",
  },
  {
    icon: MapPin,
    title: "Smart allocation",
    body: "Weighbridges go to GATCs; shop scales and dispensers go to LMOs. Admins can auto-assign.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity hash",
    body: "Each certificate carries a SHA-256 hash of serial, result and dates — shown on the public verify page.",
  },
];

export default function HomePage() {
  return (
    <div>
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-5">
        <section className="grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--saffron)]">
              SIH 2026 · DoCA · SIH26036
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl text-[var(--navy)]">
              Last-mile verification for every weighing and measuring instrument.
            </h1>
            <p className="mt-5 text-lg text-[var(--muted)] max-w-xl">
              MaapSetu is the field-to-consumer layer around Legal Metrology stamping. Traders apply
              online. Officers inspect on site. Consumers scan a QR code before they trust a scale.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-primary">
                Open the control room
              </Link>
              <Link href="/verify" className="btn btn-ghost">
                Verify a certificate
              </Link>
            </div>
            <p className="mt-6 text-sm text-[var(--muted)]">
              Complements the national e-Maap portal at emaap.gov.in — it does not replace licences,
              model approval or LMPC registration.
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm font-semibold text-[var(--navy)]">Try the seeded demo</p>
            <ol className="mt-4 space-y-3 text-sm">
              <li className="rounded-lg bg-[var(--cream)] p-3">
                1. Sign in as <strong>shop@maapsetu.gov.in</strong> and apply re-verification for the
                expiring counter scale.
              </li>
              <li className="rounded-lg bg-[var(--cream)] p-3">
                2. Sign in as <strong>admin@maapsetu.gov.in</strong> and auto-assign pending jobs.
              </li>
              <li className="rounded-lg bg-[var(--cream)] p-3">
                3. Sign in as <strong>lmo@maapsetu.gov.in</strong>, pass the fuel dispenser inspection.
              </li>
              <li className="rounded-lg bg-[var(--cream)] p-3">
                4. Open public verify for <strong>VC/TS/HYD/2025/00011</strong>.
              </li>
            </ol>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-16">
          {features.map((f) => (
            <article key={f.title} className="card p-5">
              <f.icon className="text-[var(--saffron)]" size={22} />
              <h2 className="font-display text-xl mt-3">{f.title}</h2>
              <p className="text-sm text-[var(--muted)] mt-2">{f.body}</p>
            </article>
          ))}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
