"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResumeUpload } from "@/components/resume-upload";
import { AuthModal } from "@/components/auth/auth-modal";
import { FreeWarningModal } from "@/components/free-warning-modal";
import { UpgradeModal } from "@/components/upgrade-modal";
import { useSession } from "@/lib/auth-client";
import { useAnalysisStore } from "@/store/analysis";
import type { AnalysisResult } from "@/lib/analysis-schema";

export default function AnalyzePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setResult, setError, error } = useAnalysisStore();

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const canSubmit = resumeText.trim().length > 100 && jobDescription.trim().length > 50;

  async function runAnalysis() {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resumeText.trim(), jobDescription: jobDescription.trim() }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Analysis failed" }));
        if (res.status === 403) {
          setUpgradeOpen(true);
        } else {
          throw new Error(error ?? "Analysis failed");
        }
        return;
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleSubmit() {
    if (!canSubmit) return;

    if (!session) {
      setAuthOpen(true);
      return;
    }

    const user = session.user as { freeReportUsed?: boolean; tier?: string };
    const needsWarning = user.tier === "free" && !user.freeReportUsed;

    if (needsWarning) {
      setWarnOpen(true);
    } else {
      runAnalysis();
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Analyse your resume</h1>
        <p className="mt-2 text-muted-foreground">
          Upload or paste your resume, then paste the job description. Results in ~15 seconds.
        </p>
      </div>

      <div className="space-y-6">
        {/* Resume section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            <FileText className="inline h-4 w-4 mr-1.5 -mt-0.5" />
            Your resume
          </Label>
          <ResumeUpload
            onTextExtracted={(text) => setResumeText(text)}
            disabled={isAnalyzing}
          />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or paste as text</span>
            </div>
          </div>
          <Textarea
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            disabled={isAnalyzing}
          />
          <p className="text-xs text-muted-foreground text-right">
            {resumeText.length} chars {resumeText.length < 100 && resumeText.length > 0 && "— add more content"}
          </p>
        </div>

        {/* Job description */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Job description</Label>
          <Textarea
            placeholder="Paste the full job description here — include requirements, responsibilities, and nice-to-haves..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] text-sm"
            disabled={isAnalyzing}
          />
          <p className="text-xs text-muted-foreground text-right">
            {jobDescription.length} chars {jobDescription.length < 50 && jobDescription.length > 0 && "— add more"}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
          </div>
        )}

        {/* Submit */}
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={!canSubmit || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analysing your resume…
            </>
          ) : (
            "Analyse my resume"
          )}
        </Button>

        {isAnalyzing && (
          <p className="text-center text-sm text-muted-foreground animate-pulse">
            Claude is reviewing your application as a senior recruiter…
          </p>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          setAuthOpen(false);
          handleSubmit();
        }}
      />

      <FreeWarningModal
        open={warnOpen}
        onConfirm={() => {
          setWarnOpen(false);
          runAnalysis();
        }}
        onCancel={() => setWarnOpen(false)}
      />
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
