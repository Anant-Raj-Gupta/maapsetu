import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ClearComplaintButton } from "@/components/clear-complaint-button";

export const revalidate = 0;

export default async function AdminComplaintsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/app");

  // Fetch all complaints
  const complaints = await prisma.complaint.findMany({
    include: {
      trader: { select: { name: true, phone: true } },
      targetOfficer: { select: { name: true, role: true, district: true } },
      clearedBy: { select: { name: true } }
    },
    orderBy: [
      { status: "desc" }, // PENDING first, then CLEARED (alphabetically P > C)
      { createdAt: "desc" }
    ]
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Officer Complaints</h1>
      <p className="text-[var(--muted)] mt-1 mb-6">
        Monitor and resolve complaints filed by shopkeepers against LMO and GATC officers.
      </p>

      {complaints.length === 0 ? (
        <div className="p-8 text-center bg-white rounded border border-dashed text-gray-500">
          No complaints have been filed.
        </div>
      ) : (
        <div className="grid gap-4">
          {complaints.map(c => (
            <div key={c.id} className={`card p-5 bg-white border-l-4 ${c.status === "CLEARED" ? "border-l-green-500" : "border-l-orange-500"}`}>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-[var(--navy)] text-lg">Against: {c.targetOfficer.name}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                      {c.targetOfficer.role} - {c.targetOfficer.district}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3 flex gap-4">
                    <span>Filed by: <strong>{c.trader.name}</strong> ({c.trader.phone})</span>
                    <span>App Serial: <strong className="font-mono">{c.applicationSerial}</strong></span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded text-sm text-gray-800 border">
                    {c.description}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {c.status === "CLEARED" ? (
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded inline-block">CLEARED</span>
                      <p className="text-xs text-green-700 font-medium mt-2">By Admin: {c.clearedBy?.name}</p>
                    </div>
                  ) : (
                    <>
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1.5 rounded inline-block mb-1">PENDING</span>
                      <ClearComplaintButton complaintId={c.id} />
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-400 border-t pt-2">
                Filed on: {formatDate(c.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
