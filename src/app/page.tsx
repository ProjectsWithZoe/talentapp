import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Target,
  Eye,
  Wrench,
  Sparkles,
  Star,
  Upload,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PricingSection } from "@/components/pricing-section";
import { CyclingHeadline } from "@/components/cycling-headline";

export const metadata: Metadata = {
  title: "TalentApp — Know Your Chances Before You Apply",
  description:
    "AI resume analysis for software engineers, DevOps, and data professionals. Get your ATS score, recruiter fit rating, missing skills, and 5 actionable fixes — free.",
  openGraph: {
    title: "TalentApp — AI Resume Analyser for Tech Job Seekers",
    description:
      "Stop wondering why your resume gets no replies. TalentApp tells you exactly what's wrong and how to fix it.",
  },
};

const features = [
  {
    icon: Target,
    title: "ATS Compatibility Score",
    description:
      "See how well your resume aligns with the job's keywords and formatting requirements — before it hits an ATS.",
  },
  {
    icon: Eye,
    title: "Recruiter Fit Rating",
    description:
      "Understand how a hiring manager actually perceives your application: Likely to shortlist, Competitive, Borderline, or Unlikely.",
  },
  {
    icon: CheckCircle,
    title: "Strong Matches",
    description:
      "The skills and experience from your resume that genuinely stand out for this specific role.",
  },
  {
    icon: XCircle,
    title: "Missing Skills",
    description:
      "The keywords and competencies in the job description that your resume is silent on.",
  },
  {
    icon: AlertTriangle,
    title: "Rejection Risks",
    description:
      "Patterns that trigger automatic filtering — gaps, formats, phrasing, or red flags recruiters act on fast.",
  },
  {
    icon: Wrench,
    title: "3–5 Actionable Fixes",
    description:
      "Concrete, prioritised changes ranked by impact. Not generic advice — specific to your resume and this job.",
  },
  {
    icon: Zap,
    title: "Recruiter Perception",
    description:
      "A plain-English summary of how a senior recruiter reads your resume at first glance.",
  },
  {
    icon: Sparkles,
    title: "Optimised Bullet Points",
    description:
      "Rewritten bullet points that pass ATS filters and read well to humans. Lifetime access only.",
    lifetime: true,
  },
];

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your resume",
    description: "Drop in your PDF or DOCX. We parse it instantly — no formatting lost.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Paste the job description",
    description: "Copy the full job posting. Our AI reads it the same way a recruiter does.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Get your full analysis",
    description: "ATS score, fit rating, gaps, risks, and fixes — in under 30 seconds.",
  },
];

const testimonials = [
  {
    quote:
      "I'd applied to 40+ roles with zero callbacks. TalentApp showed me I was scoring 38 on ATS. After making the fixes it suggested, I had three interviews within a week.",
    name: "Priya M.",
    role: "Data Analyst · London",
    stars: 5,
  },
  {
    quote:
      "The missing skills section was a wake-up call. I had no idea Kubernetes was mentioned six times in the JD and zero times in my resume. Fixed it in an hour.",
    name: "Alex T.",
    role: "Backend Engineer · Toronto",
    stars: 5,
  },
  {
    quote:
      "The optimised bullet points alone are worth the lifetime price. It rewrote my experience section in a way I never would have thought of myself.",
    name: "James W.",
    role: "DevOps Engineer · Sydney",
    stars: 5,
  },
];

const exampleResult = {
  role: "Senior Software Engineer",
  atsScore: 84,
  recruiterFit: "Likely to shortlist",
  strongMatches: ["Python", "AWS", "System Design", "5 yrs experience"],
  missingSkills: ["Kubernetes", "CI/CD pipelines"],
  rejectionRisk: "Job-hopping pattern: 3 roles in 18 months",
  fixes: [
    "Add 'Kubernetes' to your skills section — it appears 7× in the JD",
    "Quantify your AWS impact: replace 'managed cloud infra' with metrics",
    "Remove months from employment dates to reduce job-hopping perception",
  ],
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-primary/3 to-background pt-12 pb-14 md:pt-16 md:pb-18">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5 text-sm px-4 py-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            Free for your first analysis
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-tight">
            <CyclingHeadline />
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Paste your resume and the job description. TalentApp gives you your ATS score, recruiter
            fit rating, skills gaps, rejection risks, and exactly how to fix it — in 30 seconds.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary" className="gap-2 text-base h-12 px-8">
              <Link href="/analyze">
                Analyse my resume free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
              <Link href="#example">See an example result</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card &nbsp;·&nbsp; No signup required &nbsp;·&nbsp; Works for UK, US, Canada &amp; Australia
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-muted/40 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              4.9 / 5 rating
            </span>
            <span>2,400+ analyses run</span>
            <span>Optimized for modern ATS systems</span>
            <span>🇬🇧 🇺🇸 🇨🇦 🇦🇺</span>
          </div>
        </div>
      </section>

      {/* Hired-at strip */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Users who ran an analysis went on to land roles at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["Google", "Amazon", "Microsoft", "Stripe", "Shopify", "Atlassian", "Deliveroo", "Monzo"].map((co) => (
              <span key={co} className="text-sm font-semibold text-muted-foreground/70 tracking-wide">
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps. Thirty seconds.
            </h2>
          </div>
          <div className="relative mx-auto max-w-4xl">
            {/* connector line desktop */}
            <div className="absolute top-10 left-[16.5%] right-[16.5%] hidden h-px bg-border md:block" />
            <div className="grid gap-10 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                    <step.icon className="h-8 w-8 text-primary" />
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step.number.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Example result */}
      <section id="example" className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Example output
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              This is what you&apos;ll get
            </h2>
            <p className="mt-3 text-muted-foreground">
              A real analysis, generated for a Senior Software Engineer application.
            </p>
          </div>

          <div className="mx-auto max-w-2xl space-y-4">
            {/* Score row */}
            <div className="rounded-xl border bg-background shadow-md p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Role</p>
                  <p className="font-semibold text-lg">{exampleResult.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">ATS Score</p>
                  <p className="text-5xl font-bold text-primary leading-none">{exampleResult.atsScore}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">out of 100</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-5">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${exampleResult.atsScore}%` }}
                />
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-sm py-1 px-3">
                ✓ {exampleResult.recruiterFit}
              </Badge>
            </div>

            {/* Matches / gaps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-background shadow-sm p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-3">
                  Strong matches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exampleResult.strongMatches.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border bg-background shadow-sm p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-3">
                  Missing skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exampleResult.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rejection risk */}
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Rejection risk:</strong> {exampleResult.rejectionRisk}
              </span>
            </div>

            {/* Fixes */}
            <div className="rounded-xl border bg-background shadow-sm p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">
                Top fixes (ranked by impact)
              </p>
              <ol className="space-y-2">
                {exampleResult.fixes.map((fix, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{fix}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Before / after */}
          <div className="mx-auto max-w-2xl mt-4">
            <div className="rounded-xl border bg-background shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-4">
                Optimised bullet — before &amp; after
              </p>
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-800">
                  <span className="font-semibold block mb-0.5 text-xs uppercase tracking-wide text-red-500">Before</span>
                  "Responsible for managing cloud infrastructure and supporting the team with deployments."
                </div>
                <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-800">
                  <span className="font-semibold block mb-0.5 text-xs uppercase tracking-wide text-green-600">After</span>
                  "Owned AWS infrastructure for 3 microservices, reducing deployment time by 40% and cutting monthly cloud costs by £12k through reserved instance optimisation."
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/analyze">
                Get my analysis free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              What you get
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Eight data points. One analysis.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Claude acts simultaneously as your ATS system, senior recruiter, and hiring manager —
              so you see exactly how your application is received.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className={
                  feature.lifetime
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "shadow-sm hover:shadow-md transition-shadow"
                }
              >
                <CardHeader className="pb-2">
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                      feature.lifetime ? "bg-primary/15" : "bg-muted"
                    }`}
                  >
                    <feature.icon
                      className={`h-5 w-5 ${feature.lifetime ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {feature.title}
                    {feature.lifetime && (
                      <Badge variant="default" className="text-xs">
                        Lifetime
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter quote */}
      <section className="py-10 border-y bg-muted/20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <blockquote className="text-xl font-medium leading-relaxed text-foreground">
            &ldquo;I screen 150+ CVs a week. In under 10 seconds I&apos;ve decided yes or no. The things TalentApp flags — missing keywords, vague bullets, job-hopping signals — are exactly what makes me reject someone before I&apos;ve read page two.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">
            — Senior Technical Recruiter, FAANG · 8 years hiring software engineers
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Real results
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tech pros who fixed their resume
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border bg-background shadow-sm p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Built for tech job seekers</h2>
          <p className="text-muted-foreground text-sm mb-5">
            Calibrated for roles in 🇬🇧 UK &nbsp;·&nbsp; 🇺🇸 US &nbsp;·&nbsp; 🇨🇦 Canada &nbsp;·&nbsp; 🇦🇺 Australia
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              "Software Engineers",
              "DevOps Engineers",
              "Data Analysts",
              "Product Engineers",
              "Backend Developers",
              "Cloud Engineers",
              "ML Engineers",
              "Data Scientists",
              "Platform Engineers",
            ].map((role) => (
              <Badge key={role} variant="secondary" className="text-sm py-1.5 px-4">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Suspense fallback={null}>
        <PricingSection />
      </Suspense>

      {/* Final CTA */}
      <section className="py-14 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Stop guessing.
            <br />
            <span className="text-primary">Start knowing.</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-lg">
            Every day you apply without knowing your ATS score is a day you might be invisible. One
            free check takes 30 seconds.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary" className="gap-2 h-12 px-8 text-base">
              <Link href="/analyze">
                Check my resume now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Free · No credit card · 30 seconds</p>
        </div>
      </section>
    </div>
  );
}
