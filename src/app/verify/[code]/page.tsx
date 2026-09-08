import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicFooter, PublicHeader, StatusBadge } from "@/components/public";
import { daysUntil, formatDate } from "@/lib/utils";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificateNo = decodeURIComponent(code);
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNo },
    include: {
      instrument: { include: { owner: true } },
      application: { include: { inspection: { include: { officer: true } } } },
    },
  });

  if (!certificate) notFound();

  const remaining = daysUntil(certificate.validUntil) ?? 0;
  const valid = remaining >= 0;

  return (
    <div>
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className={`rounded-2xl p-4 mb-6 ${valid ? "bg-emerald-50" : "bg-red-50"}`}>
          <p className="text-sm uppercase tracking-wide font-semibold">
            {valid ? "Valid for use in trade" : "Expired — do not use in trade"}
          </p>
          <h1 className="font-display text-3xl mt-1">{certificate.certificateNo}</h1>
        </div>
        <div className="card p-6 grid md:grid-cols-[1fr_180px] gap-6">
          <div className="space-y-3 text-sm">
            <Row label="Instrument" value={`${certificate.instrument.make} ${certificate.instrument.model}`} />
            <Row label="Serial" value={certificate.instrument.serialNumber} />
            <Row label="Category / class" value={`${certificate.instrument.category} · Class ${certificate.instrument.accuracyClass}`} />
            <Row label="Premises" value={certificate.instrument.premisesName} />
            <Row label="District" value={`${certificate.instrument.district}, ${certificate.instrument.owner.state}`} />
            <Row label="Issued" value={formatDate(certificate.issuedAt)} />
            <Row label="Valid until" value={formatDate(certificate.validUntil)} />
            <Row
              label="Inspected by"
              value={certificate.application.inspection?.officer.name || "—"}
            />
            <Row label="Result" value={certificate.application.inspection?.result || "PASS"} />
            <div>
              <p className="text-[var(--muted)]">Integrity hash</p>
              <p className="font-mono text-[11px] break-all mt-1">{certificate.integrityHash}</p>
            </div>
            <StatusBadge status={valid ? "VERIFIED" : "EXPIRED"} />
          </div>
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certificate.qrPayload} alt="Certificate QR" className="mx-auto w-40 h-40" />
            <Link href={`/verify/${encodeURIComponent(certificate.certificateNo)}/print`} className="btn btn-ghost mt-3 w-full">
              Print / PDF
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
