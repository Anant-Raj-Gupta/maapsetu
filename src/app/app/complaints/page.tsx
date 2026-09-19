import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ComplaintForm } from "@/components/complaint-form";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function ComplaintsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "TRADER") redirect("/app");

  // Fetch officers for the dropdown
  const officers = await prisma.user.findMany({
    where: { role: { in: ["LMO", "GATC"] } },
    select: { id: true, name: true, role: true, district: true },
    orderBy: { name: "asc" }
  });

  // Fetch past complaints made by this trader
  const complaints = await prisma.complaint.findMany({
    where: { traderId: session.id },
    include: {
      targetOfficer: { select: { name: true, role: true } },
      clearedBy: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Register Complaints</h1>
      <p className="text-[var(--muted)] mt-1 mb-6">
        Report any issues you have faced with an LMO or GATC officer during your application process.
      </p>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
        <ComplaintForm officers={officers} />

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--navy)] border-b pb-2">My Complaints History</h2>
          
          {complaints.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-white rounded border border-dashed">
              You have not registered any complaints.
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map(c => (
                <div key={c.id} className="card p-4 bg-white">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <p className="font-semibold text-[var(--navy)]">Against: {c.targetOfficer.name} ({c.targetOfficer.role})</p>
                      <p className="text-xs text-gray-500 mt-0.5">Instrument S/N: <span className="font-mono">{c.applicationSerial}</span></p>
                    </div>
                    {c.status === "CLEARED" ? (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">CLEARED</span>
                    ) : (
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">PENDING</span>
                    )}
                  </div>
                  <p className="text-sm mt-3 text-gray-700 bg-gray-50 p-3 rounded">{c.description}</p>
                  
                  <div className="mt-3 text-xs text-gray-500 flex justify-between items-center border-t pt-2">
                    <span>Filed: {formatDate(c.createdAt)}</span>
                    {c.status === "CLEARED" && c.clearedBy && (
                      <span className="text-green-700 font-semibold">Cleared by Admin: {c.clearedBy.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
