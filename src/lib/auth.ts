import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: "TalentApp Admin <admin@talentapp.co.uk>",
          to: email,
          subject: "Your TalentApp sign-in link",
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:22px;margin-bottom:8px">Sign in to TalentApp</h1>
  <p style="color:#555">Click the button below to sign in. This link expires in 15 minutes.</p>
  <div style="margin:28px 0">
    <a href="${url}" style="background:#000;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;display:inline-block">
      Sign in to TalentApp →
    </a>
  </div>
  <p style="font-size:12px;color:#999">
    Or copy and paste this URL: <br>
    <a href="${url}" style="color:#999;word-break:break-all">${url}</a>
  </p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="font-size:12px;color:#999">If you didn't request this, you can safely ignore this email.</p>
</body>
</html>`,
        });
      },
    }),
  ],
  user: {
    additionalFields: {
      tier: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      freeReportUsed: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      credits: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
    },
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
});

export type Auth = typeof auth;
