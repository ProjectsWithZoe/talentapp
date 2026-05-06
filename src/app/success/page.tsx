import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CheckCircle, ArrowRight, Share2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Welcome to Lifetime — TalentApp",
};

interface ActivateResult {
  activated?: boolean;
  alreadyActivated?: boolean;
  isSignedIn: boolean;
  email: string;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/analyze");
  }

  // Forward the user's cookies so /api/activate can check their auth session
  const reqHeaders = await headers();
  const cookie = reqHeaders.get("cookie") ?? "";

  let result: ActivateResult;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/activate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify({ session_id }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      redirect("/analyze");
    }

    result = await res.json();
  } catch {
    redirect("/analyze");
  }

  // Signed-in user (or already lifetime): show immediate access UI
  if (result.isSignedIn || result.alreadyActivated) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3">
          You&apos;re Lifetime.
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Unlimited analyses, optimised bullet points, and every future feature — forever.
        </p>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full gap-2">
            <Link href="/analyze">
              Start analysing <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="w-full gap-2" asChild>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://TalentApp.co.uk")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Share2 className="h-4 w-4" />
              Share TalentApp with a colleague
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Confirmation sent to your email. Questions?{" "}
          <a href="mailto:hello@talentapp.co.uk" className="underline underline-offset-4">
            hello@talentapp.co.uk
          </a>
        </p>
      </div>
    );
  }

  // Not signed in: direct them to check their inbox for the magic link
  return (
    <div className="container mx-auto max-w-lg px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-blue-100 p-4">
          <Mail className="h-12 w-12 text-blue-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Payment confirmed — check your inbox.
      </h1>
      <p className="text-muted-foreground mb-2 text-lg">
        We&apos;ve sent two emails to:
      </p>
      <p className="font-semibold text-lg mb-8">{result.email}</p>

      <div className="rounded-xl border bg-muted/30 p-5 text-left space-y-3 mb-8 text-sm">
        <div className="flex gap-3">
          <span className="text-green-600 font-bold mt-0.5">✓</span>
          <div>
            <p className="font-medium">Purchase confirmation</p>
            <p className="text-muted-foreground">Your receipt and lifetime access details.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-blue-600 font-bold mt-0.5">→</span>
          <div>
            <p className="font-medium">Your sign-in link</p>
            <p className="text-muted-foreground">Click it to access your TalentApp account — no password needed. Expires in 15 minutes.</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Can&apos;t find it? Check your spam folder, or{" "}
        <Link href="/analyze" className="underline underline-offset-4">
          request a new sign-in link
        </Link>
        .
      </p>
    </div>
  );
}
