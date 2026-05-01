"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, XCircle, AlertTriangle, Wrench, Eye, Sparkles,
  Share2, Download, ArrowLeft, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisStore } from "@/store/analysis";
import type { RecruiterFit } from "@/lib/analysis-schema";

const recruiterFitConfig: Record<RecruiterFit, { variant: "success" | "warning" | "orange" | "danger"; label: string }> = {
  "Likely to shortlist": { variant: "success", label: "Likely to shortlist" },
  "Competitive": { variant: "warning", label: "Competitive" },
  "Borderline": { variant: "orange", label: "Borderline" },
  "Unlikely": { variant: "danger", label: "Unlikely" },
};

function atsScoreColor(score: number) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  if (score >= 30) return "text-orange-600";
  return "text-red-600";
}

function ResultSection({ title, icon: Icon, children, delay = 0 }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Card
      className="animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { result, isLoading } = useAnalysisStore();

  useEffect(() => {
    if (!result && !isLoading) {
      router.replace("/analyze");
    }
  }, [result, isLoading, router]);

  async function handleShare() {
    if (!result) return;
    const url = `${window.location.origin}/api/og?score=${result.atsScore}&fit=${encodeURIComponent(result.recruiterFit)}`;
    if (navigator.share) {
      await navigator.share({ title: "My hirecheck analysis", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }

  async function handleDownload() {
    const { generatePDF } = await import("@/lib/generate-pdf");
    if (result) generatePDF(result);
  }

  if (!result) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const fitConfig = recruiterFitConfig[result.recruiterFit];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2 gap-1.5 text-muted-foreground">
            <Link href="/analyze">
              <ArrowLeft className="h-4 w-4" /> New analysis
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Your analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your resume and job description
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {/* Score summary row */}
      <div
        className="grid grid-cols-2 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4"
        style={{ animationFillMode: "both" }}
      >
        {/* ATS Score */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">ATS Score</p>
            <div className="flex items-end gap-2 mb-3">
              <span className={`text-5xl font-bold ${atsScoreColor(result.atsScore)}`}>
                {result.atsScore}
              </span>
              <span className="text-muted-foreground text-lg mb-1">/100</span>
            </div>
            <Progress value={result.atsScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Keyword & format alignment</p>
          </CardContent>
        </Card>

        {/* Recruiter Fit */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Recruiter Fit</p>
            <Badge variant={fitConfig.variant} className="text-sm py-1.5 px-3 mt-2">
              {fitConfig.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-3">Hiring manager judgment</p>
          </CardContent>
        </Card>
      </div>

      {/* Results sections */}
      <div className="space-y-4">
        {/* Strong Matches */}
        <ResultSection title="Strong matches" icon={CheckCircle} delay={100}>
          <div className="flex flex-wrap gap-2">
            {result.strongMatches.map((skill) => (
              <span key={skill} className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </ResultSection>

        {/* Missing Skills */}
        <ResultSection title="Missing skills" icon={XCircle} delay={150}>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.length > 0 ? (
              result.missingSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No critical missing skills identified.</p>
            )}
          </div>
        </ResultSection>

        {/* Rejection Risks */}
        <ResultSection title="Rejection risks" icon={AlertTriangle} delay={200}>
          {result.rejectionRisks.length > 0 ? (
            <ul className="space-y-2">
              {result.rejectionRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
                  {risk}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No major rejection risks identified.</p>
          )}
        </ResultSection>

        {/* Recruiter Perception */}
        <ResultSection title="Recruiter perception" icon={Eye} delay={250}>
          <p className="text-sm leading-relaxed">{result.recruiterPerception}</p>
        </ResultSection>

        {/* Fixes */}
        <ResultSection title="Recommended fixes" icon={Wrench} delay={300}>
          <ol className="space-y-3">
            {result.fixes.map((fix, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {i + 1}
                </span>
                {fix}
              </li>
            ))}
          </ol>
        </ResultSection>

        {/* Optimized Bullets — gated for free users */}
        <ResultSection title="Optimised bullet points" icon={Sparkles} delay={350}>
          {result.optimizedBullets ? (
            <ul className="space-y-2">
              {result.optimizedBullets.map((bullet, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : (
            <div className="relative">
              <div className="space-y-2 blur-sm select-none pointer-events-none" aria-hidden>
                {["Rewrote to emphasise measurable impact and specific technologies", "Added quantified outcomes to demonstrate scope and scale"].map((b, i) => (
                  <div key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {b}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-[2px] rounded">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Unlock with Lifetime access</p>
                <Button asChild size="sm">
                  <Link href="/api/checkout">Get Lifetime — £99</Link>
                </Button>
              </div>
            </div>
          )}
        </ResultSection>
      </div>

      {/* Bottom CTA for free users */}
      {!result.optimizedBullets && (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <p className="font-semibold mb-1">Want unlimited analyses + optimised bullet points?</p>
            <p className="text-sm text-muted-foreground mb-4">
              One-time payment of £99 — no subscription, no expiry.
            </p>
            <Button asChild>
              <Link href="/api/checkout">Upgrade to Lifetime</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
