import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetOfficerId, applicationSerial, description } = await req.json();

    if (!targetOfficerId || !applicationSerial || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^\d{9}$/.test(applicationSerial)) {
      return NextResponse.json({ error: "Serial number must be exactly 9 digits." }, { status: 400 });
    }

    const applicationExists = await prisma.application.findUnique({
      where: { systemSerialNo: applicationSerial }
    });

    if (!applicationExists) {
      return NextResponse.json({ error: "Invalid Application Serial No. No such application exists." }, { status: 400 });
    }

    const complaint = await prisma.complaint.create({
      data: {
        traderId: session.id,
        targetOfficerId,
        applicationSerial,
        description,
      },
    });

    return NextResponse.json({ success: true, complaint });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
