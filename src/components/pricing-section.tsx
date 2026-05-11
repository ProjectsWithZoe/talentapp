import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PricingSection() {
  const session = await auth.api.getSession({ headers: await headers() });
  const tier = (session?.user as { tier?: string } | undefined)?.tier;

  if (tier === "lifetime") return null;

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing</h2>
          <p className="mt-4 text-muted-foreground">No subscription. No tricks.</p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
          {/* Free */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">£0</span>
              </div>
              <CardDescription>One full analysis, on us.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {["ATS score", "Recruiter fit rating", "Strong matches", "Missing skills", "Rejection risks", "Recruiter perception", "3–5 actionable fixes"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4 shrink-0" />
                  Optimised bullet points
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/analyze">Start free</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Lifetime */}
          <Card className="border-primary shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
              Best value
            </div>
            <CardHeader>
              <CardTitle>Lifetime</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">£29.99</span>
                <span className="text-muted-foreground ml-1 text-sm">one-time</span>
              </div>
              <CardDescription>Unlimited analyses, forever.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[
                  "Everything in Free",
                  "Unlimited analyses",
                  "Optimised bullet points",
                  "Priority processing",
                  "All future features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK!}>Get lifetime access</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
