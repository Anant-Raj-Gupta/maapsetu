import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { catalogueFor } from "@/lib/constants";

function generate9DigitSerial(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

async function uniqueInstrumentSerial(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const serial = generate9DigitSerial();
    const exists = await prisma.instrument.findFirst({
      where: { serialNumber: serial },
    });
    if (!exists) return serial;
  }
  throw new Error("Could not generate unique serial after 10 attempts");
}

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

  const form = await request.formData();
  const category = String(form.get("category") || "");
  const make = String(form.get("make") || "");
  const model = String(form.get("model") || "");
  const capacity = String(form.get("capacity") || "");
  const premisesName = String(form.get("premisesName") || "");
  const address = String(form.get("address") || "");
  const lat = Number(form.get("lat") || 0);
  const lng = Number(form.get("lng") || 0);
  const photo = form.get("instrumentPhoto");

  if (!category || !make || !model || !capacity || !premisesName || !address) {
    return NextResponse.json({ error: "Check instrument details" }, { status: 400 });
  }

  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "Instrument photo is required" }, { status: 400 });
  }

  const catalogue = catalogueFor(category);
  if (!catalogue) {
    return NextResponse.json({ error: "Unsupported instrument category" }, { status: 400 });
  }

  // Save instrument photo
  const bytes = Buffer.from(await photo.arrayBuffer());
  const uploads = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploads, { recursive: true });
  const filename = `instr-photo-${Date.now()}${path.extname(photo.name) || ".jpg"}`;
  await writeFile(path.join(uploads, filename), bytes);
  const photoUrl = `/uploads/${filename}`;

  // Auto-generate serial number
  const serialNumber = await uniqueInstrumentSerial();

  const instrument = await prisma.instrument.create({
    data: {
      category,
      serialNumber,
      photoUrl,
      make,
      model,
      capacity,
      premisesName,
      address,
      lat,
      lng,
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
