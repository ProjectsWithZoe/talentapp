import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_LIFETIME_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_CREDIT_PRICE_ID_1CREDIT: z.string().startsWith("price_"),
  STRIPE_CREDIT_PRICE_ID_3PACK: z.string().startsWith("price_"),
  RESEND_API_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME: z.string().url(),
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_1CREDIT: z.string().url(),
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_3CREDITS: z.string().url(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  SANITY_API_TOKEN: z.string().min(1),
});

export const env = serverEnvSchema.parse(process.env);
