import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Only administrators can auto-assign" }, { status: 403 });
  }

  const pending = await prisma.application.findMany({
    where: { status: "SUBMITTED" },
    include: { instrument: true },
  });

  const officers = await prisma.user.findMany({
    where: { role: { in: ["LMO", "GATC"] } },
  });

  let assigned = 0;
  for (const application of pending) {
    const want = application.instrument.category === "WEIGHBRIDGE" ? "GATC" : "LMO";
    const pool = officers.filter((o) => o.role === want);
    if (!pool.length) continue;
    const officer = pool[assigned % pool.length];
    const when = new Date();
    when.setDate(when.getDate() + 1 + assigned);
    await prisma.application.update({
      where: { id: application.id },
      data: {
        assignedToId: officer.id,
        assignedKind: officer.role,
        scheduledAt: when,
        status: "ASSIGNED",
      },
    });
    assigned += 1;
  }

  return NextResponse.json({ assigned });
}
