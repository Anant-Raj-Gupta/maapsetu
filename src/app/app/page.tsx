import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatusBadge } from "@/components/public";
import { AutoAssignButton } from "@/components/forms";
import { daysUntil, formatDate, formatDateTime, rupees } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AppHome() {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.role === "TRADER") return <TraderHome userId={session.id} name={session.name} />;
  if (session.role === "ADMIN") return <AdminHome />;
  return <OfficerHome userId={session.id} role={session.role} name={session.name} />;
}

async function TraderHome({ userId, name }: { userId: string; name: string }) {
  const instruments = await prisma.instrument.findMany({
    where: { ownerId: userId },
    include: { applications: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  const expiring = instruments.filter((i) => {
    const d = daysUntil(i.validUntil);
    return d !== null && d <= 30;
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Namaste, {name}</h1>
      <p className="text-[var(--muted)] mt-1">Your weighing and measuring instruments.</p>
      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <Stat label="Instruments" value={instruments.length} />
        <Stat label="Due in 30 days" value={expiring.length} warn />
        <Stat label="Failed / unverified" value={instruments.filter((i) => i.status !== "VERIFIED").length} />
      </div>
      <div className="flex justify-between items-center mt-8 mb-3">
        <h2 className="font-display text-2xl">Alerts</h2>
        <Link href="/app/instruments/new" className="btn btn-primary">
          Add instrument
        </Link>
      </div>
      <div className="space-y-2">
        {expiring.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No expiry alerts right now.</p>
        ) : (
          expiring.map((i) => (
            <div key={i.id} className="card p-4 flex justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {i.serialNumber} · {i.category}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Valid until {formatDate(i.validUntil)} ({daysUntil(i.validUntil)} days)
                </p>
              </div>
              <StatusBadge status="EXPIRING" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

async function AdminHome() {
  const [submitted, assigned, certified, failed, expiring] = await Promise.all([
    prisma.application.count({ where: { status: "SUBMITTED" } }),
    prisma.application.count({ where: { status: "ASSIGNED" } }),
    prisma.application.count({ where: { status: "CERTIFIED" } }),
    prisma.application.count({ where: { status: "FAILED" } }),
    prisma.instrument.count({
      where: { validUntil: { lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } },
    }),
  ]);

  const recent = await prisma.application.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { instrument: { include: { owner: true } }, assignedTo: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Hyderabad control room</h1>
      <p className="text-[var(--muted)] mt-1">Pendency, enforcement and officer load.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
        <Stat label="Unassigned" value={submitted} warn />
        <Stat label="In field" value={assigned} />
        <Stat label="Certified" value={certified} />
        <Stat label="Failed" value={failed} />
        <Stat label="Expiring instruments" value={expiring} warn />
      </div>
      <div className="mt-8 card p-5">
        <h2 className="font-display text-xl mb-3">Dispatch</h2>
        <AutoAssignButton />
        <p className="text-sm text-[var(--muted)] mt-2">
          Weighbridges are routed to GATCs; NAWI and dispensers to LMOs. Production would add live
          route distance.
        </p>
      </div>
      <h2 className="font-display text-2xl mt-8 mb-3">Recent applications</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--muted)]">
            <tr>
              <th className="p-3">Application</th>
              <th>User</th>
              <th>Instrument</th>
              <th>Status</th>
              <th>Officer</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">
                  <Link href={`/app/applications/${a.id}`} className="underline">
                    {a.applicationNo}
                  </Link>
                </td>
                <td>{a.instrument.owner.name}</td>
                <td>{a.instrument.serialNumber}</td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
                <td>{a.assignedTo?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function OfficerHome({
  userId,
  role,
  name,
}: {
  userId: string;
  role: string;
  name: string;
}) {
  const jobs = await prisma.application.findMany({
    where: { assignedToId: userId },
    include: { instrument: true },
    orderBy: { scheduledAt: "asc" },
  });
  const open = jobs.filter((j) => ["ASSIGNED", "SCHEDULED", "IN_PROGRESS"].includes(j.status));

  return (
    <div>
      <h1 className="font-display text-3xl">
        {role === "GATC" ? "Test centre roster" : "Field roster"} — {name}
      </h1>
      <p className="text-[var(--muted)] mt-1">{open.length} open jobs.</p>
      <div className="space-y-3 mt-6">
        {jobs.map((job) => (
          <Link key={job.id} href={`/app/applications/${job.id}`} className="card p-4 block hover:border-[var(--navy)]">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-semibold">{job.instrument.premisesName}</p>
                <p className="text-sm text-[var(--muted)]">
                  {job.instrument.category} · {job.instrument.serialNumber} · {rupees(job.feeAmount)}
                </p>
                <p className="text-xs mt-1">Scheduled {formatDateTime(job.scheduledAt)}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className={`font-display text-3xl mt-1 ${warn ? "text-[var(--saffron)]" : ""}`}>{value}</p>
    </div>
  );
}
