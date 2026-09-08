import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(8),
  organisation: z.string().min(2),
  district: z.string().min(2),
  state: z.string().min(2),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill every field correctly" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "An account already exists with this email" }, { status: 409 });
  }

  const { password, ...profile } = parsed.data;
  const user = await prisma.user.create({
    data: {
      ...profile,
      email,
      passwordHash: await hashPassword(password),
      role: "TRADER",
    },
  });

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: "TRADER",
    district: user.district,
    state: user.state,
  });

  return NextResponse.json({ ok: true });
}
