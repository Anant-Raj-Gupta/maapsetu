import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicFooter, PublicHeader, StatusBadge, PageBanner } from "@/components/public";
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
      <PublicHeader search />
      <PageBanner title="Certificate authentication" crumbs="Home / Know Your Certificate / Result" />
      <main id="main-content" className="gov-wrap max-w-4xl py-10">
        <div className={`border-l-4 p-4 mb-6 ${valid ? "border-[var(--forest)] bg-emerald-50" : "border-[var(--goi-red)] bg-red-50"}`}>
          <p className="text-sm uppercase tracking-wide font-bold">
            {valid ? "Valid for use in trade / protection" : "Expired — not valid for trade"}
          </p>
          <h2 className="text-2xl font-bold mt-1">{certificate.certificateNo}</h2>
        </div>
        <div className="card p-6 grid md:grid-cols-[1fr_180px] gap-6">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Instrument", `${certificate.instrument.make} ${certificate.instrument.model}`],
                ["Serial number", certificate.instrument.serialNumber],
                ["Category / class", `${certificate.instrument.category} · Class ${certificate.instrument.accuracyClass}`],
                ["Premises", certificate.instrument.premisesName],
                ["District / State", `${certificate.instrument.district}, ${certificate.instrument.owner.state}`],
                ["Issued on", formatDate(certificate.issuedAt)],
                ["Valid until", formatDate(certificate.validUntil)],
                ["Inspected by", certificate.application.inspection?.officer.name || "—"],
                ["Result", certificate.application.inspection?.result || "PASS"],
              ].map(([k, v]) => (
                <tr key={k} className="border-b">
                  <th className="py-2 pr-4 text-left font-medium text-[var(--muted)] w-44">{k}</th>
                  <td className="py-2 font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certificate.qrPayload} alt="Certificate QR" className="mx-auto w-40 h-40 border" />
            <StatusBadge status={valid ? "VERIFIED" : "EXPIRED"} />
            <Link
              href={`/verify/${encodeURIComponent(certificate.certificateNo)}/print`}
              className="btn btn-ghost mt-3 w-full"
            >
              Print / PDF
            </Link>
            <p className="font-mono text-[10px] break-all mt-3 text-[var(--muted)]">{certificate.integrityHash}</p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
