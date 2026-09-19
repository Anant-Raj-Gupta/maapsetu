import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/public";

export const revalidate = 15;

export default async function RegistryPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/app");

  const instruments = await prisma.instrument.findMany({
    select: {
      id: true,
      make: true,
      model: true,
      serialNumber: true,
      category: true,
      status: true,
      owner: {
        select: {
          name: true,
          district: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Instrument Registry</h1>
      <p className="text-[var(--muted)] mt-1 mb-6">
        View all registered instruments, their serial numbers, and verification statuses.
      </p>

      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold">Instrument Serial No.</th>
              <th className="p-3 font-semibold">Instrument details</th>
              <th className="p-3 font-semibold">Owner</th>
              <th className="p-3 font-semibold">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {instruments.map((i) => {
              return (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="p-3 align-top">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-[var(--navy)] font-semibold">
                      {i.serialNumber}
                    </span>
                  </td>
                  <td className="p-3 align-top">
                    <p className="font-semibold text-[var(--navy)]">
                      {i.make} {i.model}
                    </p>
                    <p className="text-gray-500 text-xs">Category: {i.category}</p>
                  </td>
                  <td className="p-3 align-top">
                    <p>{i.owner.name}</p>
                    <p className="text-xs text-gray-500">{i.owner.district}</p>
                  </td>
                  <td className="p-3 align-top">
                    <StatusBadge status={i.status} />
                  </td>
                </tr>
              );
            })}
            
            {instruments.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No instruments found in the registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

