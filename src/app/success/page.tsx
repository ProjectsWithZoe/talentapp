import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Welcome to Lifetime — hirecheck",
};

export default function SuccessPage() {
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
          <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://hirecheck.io")}`} target="_blank" rel="noopener noreferrer">
            <Share2 className="h-4 w-4" />
            Share hirecheck with a colleague
          </Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Confirmation sent to your email. Questions?{" "}
        <a href="mailto:hello@hirecheck.io" className="underline underline-offset-4">hello@hirecheck.io</a>
      </p>
    </div>
  );
}
