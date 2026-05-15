import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env";
import { z } from "zod";

const resend = new Resend(env.RESEND_API_KEY);

const bodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  await resend.emails.send({
    from: "TalentApp Contact <admin@talentapp.co.uk>",
    to: "projectswithzoe@gmail.com",
    replyTo: email,
    subject: `Contact form: ${name}`,
    html: `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${message.replace(/</g, "&lt;")}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
