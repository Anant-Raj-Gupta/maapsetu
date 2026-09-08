import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatusBadge } from "@/components/public";
import { formatDateTime, rupees } from "@/lib/utils";

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const where =
    session.role === "TRADER"
      ? { instrument: { ownerId: session.id } }
      : session.role === "ADMIN"
        ? {}
        : { assignedToId: session.id };

  const applications = await prisma.application.findMany({
    where,
    include: { instrument: { include: { owner: true } }, assignedTo: true, certificate: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Applications</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--muted)]">
            <tr>
              <th className="p-3">No.</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Assigned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 font-medium">{a.applicationNo}</td>
                <td>
                  {a.instrument.serialNumber}
                  <div className="text-xs text-[var(--muted)]">{a.instrument.owner.name}</div>
                </td>
                <td>{a.type}</td>
                <td>{rupees(a.feeAmount)}</td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
                <td>
                  {a.assignedTo?.name || "—"}
                  <div className="text-xs">{formatDateTime(a.scheduledAt)}</div>
                </td>
                <td className="p-3">
                  <Link href={`/app/applications/${a.id}`} className="underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
