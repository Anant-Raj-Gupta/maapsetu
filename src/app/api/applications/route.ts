import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { catalogueFor } from "@/lib/constants";
import { nextApplicationNo } from "@/lib/certificates";
import { invalidateCache } from "@/lib/cache";

function generate9DigitSerial(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

async function uniqueSerial(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const serial = generate9DigitSerial();
    const exists = await prisma.application.findUnique({
      where: { systemSerialNo: serial },
    });
    if (!exists) return serial;
  }
  throw new Error("Could not generate unique serial after 10 attempts");
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const where =
    session.role === "TRADER"
      ? { instrument: { ownerId: session.id } }
      : session.role === "ADMIN"
        ? {}
        : { assignedToId: session.id };

  const applications = await prisma.application.findMany({
    where,
    include: {
      instrument: { include: { owner: true } },
      assignedTo: true,
      inspection: true,
      certificate: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TRADER") {
    return NextResponse.json({ error: "Only instrument users can apply" }, { status: 403 });
  }

  const form = await request.formData();
  const instrumentId = String(form.get("instrumentId") || "");
  const type = String(form.get("type") || "");

  if (!instrumentId || (type !== "FIRST" && type !== "REVERIFICATION")) {
    return NextResponse.json({ error: "Invalid application" }, { status: 400 });
  }

  const photo = form.get("instrumentPhoto");
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "Instrument photo is required" }, { status: 400 });
  }

  const instrument = await prisma.instrument.findFirst({
    where: { id: instrumentId, ownerId: session.id },
  });
  if (!instrument) {
    return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
  }

  const open = await prisma.application.findFirst({
    where: {
      instrumentId: instrument.id,
      status: { in: ["SUBMITTED", "ASSIGNED", "SCHEDULED", "IN_PROGRESS"] },
    },
  });
  if (open) {
    return NextResponse.json({ error: "An application is already in progress for this instrument" }, { status: 409 });
  }

  // Save instrument photo
  const bytes = Buffer.from(await photo.arrayBuffer());
  const uploads = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploads, { recursive: true });
  const filename = `instr-${instrumentId}-${Date.now()}${path.extname(photo.name) || ".jpg"}`;
  await writeFile(path.join(uploads, filename), bytes);
  const instrumentPhotoUrl = `/uploads/${filename}`;

  // Generate collision-safe 9-digit serial
  const systemSerialNo = await uniqueSerial();

  const catalogue = catalogueFor(instrument.category);
  const application = await prisma.application.create({
    data: {
      applicationNo: await nextApplicationNo(),
      instrumentId: instrument.id,
      type,
      status: "SUBMITTED",
      feeAmount: catalogue?.fee ?? 200,
      systemSerialNo,
      instrumentPhotoUrl,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.id,
      action: "APPLICATION_SUBMITTED",
      entity: "Application",
      entityId: application.id,
      detail: `${application.applicationNo} serial ${systemSerialNo} fee ₹${application.feeAmount} (demo payment captured)`,
    },
  });

  invalidateCache("apps:");
  invalidateCache("instr:");
  invalidateCache("home-stats");

  return NextResponse.json({ application });
}
