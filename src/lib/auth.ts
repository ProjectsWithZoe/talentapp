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
          from: "TalentApp <noreply@talentapp.co.uk>",
          to: email,
          subject: "Your sign-in link for TalentApp",
          html: `<p>Click the link below to sign in to TalentApp. This link expires in 15 minutes.</p><p><a href="${url}">Sign in to TalentApp</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
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
    },
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
});

export type Auth = typeof auth;
