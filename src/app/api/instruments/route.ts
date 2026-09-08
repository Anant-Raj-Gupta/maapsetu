import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { catalogueFor } from "@/lib/constants";

const schema = z.object({
  category: z.string(),
  serialNumber: z.string().min(3),
  make: z.string().min(2),
  model: z.string().min(1),
  capacity: z.string().min(1),
  premisesName: z.string().min(2),
  address: z.string().min(4),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const where = session.role === "TRADER" ? { ownerId: session.id } : {};
  const instruments = await prisma.instrument.findMany({
    where,
    include: { owner: true, certificates: { orderBy: { issuedAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ instruments });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TRADER") {
    return NextResponse.json({ error: "Only instrument users can register devices" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Check instrument details" }, { status: 400 });
  }

  const catalogue = catalogueFor(parsed.data.category);
  if (!catalogue) {
    return NextResponse.json({ error: "Unsupported instrument category" }, { status: 400 });
  }

  const instrument = await prisma.instrument.create({
    data: {
      ...parsed.data,
      ownerId: session.id,
      accuracyClass: catalogue.accuracyClass,
      district: session.district,
      status: "UNVERIFIED",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.id,
      action: "INSTRUMENT_REGISTERED",
      entity: "Instrument",
      entityId: instrument.id,
      detail: `${instrument.category} ${instrument.serialNumber}`,
    },
  });

  return NextResponse.json({ instrument });
}
