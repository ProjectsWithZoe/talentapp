import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle, AlertTriangle, Zap, Target, Eye, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "hirecheck — Know Your Chances Before You Apply",
  description:
    "AI resume analysis for software engineers, DevOps, and data professionals. Get your ATS score, recruiter fit rating, missing skills, and 5 actionable fixes — free.",
  openGraph: {
    title: "hirecheck — AI Resume Analyser for Tech Job Seekers",
    description:
      "Stop wondering why your resume gets no replies. hirecheck tells you exactly what's wrong and how to fix it.",
  },
};

const features = [
  {
    icon: Target,
    title: "ATS Compatibility Score",
    description: "See how well your resume aligns with the job's keywords and formatting requirements — before it hits an ATS.",
  },
  {
    icon: Eye,
    title: "Recruiter Fit Rating",
    description: "Understand how a hiring manager actually perceives your application: Likely to shortlist, Competitive, Borderline, or Unlikely.",
  },
  {
    icon: CheckCircle,
    title: "Strong Matches",
    description: "The skills and experience from your resume that genuinely stand out for this specific role.",
  },
  {
    icon: XCircle,
    title: "Missing Skills",
    description: "The keywords and competencies in the job description that your resume is silent on.",
  },
  {
    icon: AlertTriangle,
    title: "Rejection Risks",
    description: "Patterns that trigger automatic filtering — gaps, formats, phrasing, or red flags recruiters act on fast.",
  },
  {
    icon: Wrench,
    title: "3–5 Actionable Fixes",
    description: "Concrete, prioritised changes ranked by impact. Not generic advice — specific to your resume and this job.",
  },
  {
    icon: Zap,
    title: "Recruiter Perception",
    description: "A plain-English summary of how a senior recruiter reads your resume at first glance.",
  },
  {
    icon: Sparkles,
    title: "Optimised Bullet Points",
    description: "Rewritten bullet points that pass ATS filters and read well to humans. Lifetime access only.",
    lifetime: true,
  },
];

const exampleResult = {
  role: "Senior Software Engineer",
  atsScore: 84,
  recruiterFit: "Likely to shortlist",
  strongMatches: ["Python", "AWS", "System Design", "5 yrs experience"],
  missingSkills: ["Kubernetes", "CI/CD pipelines"],
  rejectionRisk: "Job-hopping pattern: 3 roles in 18 months",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Free for your first analysis
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Know your chances{" "}
            <span className="text-primary">before you apply</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Paste your resume and job description. hirecheck tells you your ATS score, recruiter fit, what&apos;s missing, what&apos;s hurting you, and exactly how to fix it.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/analyze">
                Analyse my resume free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card · Works for UK, US, Canada &amp; Australia
            </p>
          </div>
        </div>
      </section>

      {/* Example result card */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wide mb-8">
            Example analysis
          </p>
          <div className="mx-auto max-w-2xl rounded-xl border bg-background shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-semibold">{exampleResult.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ATS Score</p>
                <p className="text-3xl font-bold text-primary">{exampleResult.atsScore}</p>
              </div>
            </div>
            <div className="mb-4">
              <Badge variant="success" className="text-sm py-1 px-3">
                ✓ {exampleResult.recruiterFit}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2 text-green-700">Strong matches</p>
                <div className="flex flex-wrap gap-1">
                  {exampleResult.strongMatches.map((s) => (
                    <span key={s} className="rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium mb-2 text-yellow-700">Missing skills</p>
                <div className="flex flex-wrap gap-1">
                  {exampleResult.missingSkills.map((s) => (
                    <span key={s} className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
              ⚠ Rejection risk: {exampleResult.rejectionRisk}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything in your analysis
            </h2>
            <p className="mt-4 text-muted-foreground">
              Eight data points — all generated by Claude acting as your senior recruiter, ATS system, and hiring manager simultaneously.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className={feature.lifetime ? "border-primary/30 bg-primary/5" : ""}>
                <CardHeader className="pb-2">
                  <feature.icon className={`h-6 w-6 mb-2 ${feature.lifetime ? "text-primary" : "text-muted-foreground"}`} />
                  <CardTitle className="text-base">
                    {feature.title}
                    {feature.lifetime && (
                      <Badge variant="default" className="ml-2 text-xs">Lifetime</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Built for tech job seekers</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Software Engineers", "DevOps Engineers", "Data Analysts", "Product Engineers", "Backend Developers", "Cloud Engineers", "ML Engineers"].map((role) => (
              <Badge key={role} variant="secondary" className="text-sm py-1.5 px-4">{role}</Badge>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Calibrated for roles in the UK 🇬🇧 · US 🇺🇸 · Canada 🇨🇦 · Australia 🇦🇺
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
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
                  <span className="text-4xl font-bold">£99</span>
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
                <Button asChild className="w-full">
                  <Link href="/api/checkout">Get lifetime access</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Stop guessing. Start knowing.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every day you apply without knowing your ATS score is a day you might be invisible. One free check takes 30 seconds.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2">
            <Link href="/analyze">
              Check my resume now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
