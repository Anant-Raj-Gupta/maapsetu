import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 30;

const empty = { instruments: 0, certificates: 0, pending: 0, officers: 0 };

export async function GET() {
  try {
    const stats = await Promise.all([
      prisma.instrument.count(),
      prisma.certificate.count(),
      prisma.application.count({ where: { status: { in: ["SUBMITTED", "ASSIGNED"] } } }),
      prisma.user.count({ where: { role: { in: ["LMO", "GATC"] } } }),
    ]);
    return NextResponse.json({
      instruments: stats[0],
      certificates: stats[1],
      pending: stats[2],
      officers: stats[3],
    });
  } catch (error) {
    console.error("home-stats", error);
    return NextResponse.json(empty, { status: 200 });
  }
}
