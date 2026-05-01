import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { analysisSchema } from "@/lib/analysis-schema";
import { SYSTEM_PROMPT, buildAnalysisPrompt } from "@/lib/prompts";

export const maxDuration = 60;

async function runAnalysis(resumeText: string, jobDescription: string, includeOptimizedBullets: boolean) {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-6"),
    schema: analysisSchema,
    system: SYSTEM_PROMPT,
    prompt: buildAnalysisPrompt(resumeText, jobDescription, includeOptimizedBullets),
  });
  return object;
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (dbUser.tier === "free" && dbUser.freeReportUsed) {
    return NextResponse.json({ error: "entitlement_exhausted" }, { status: 403 });
  }

  const body = await req.json();
  const { resumeText, jobDescription } = body;

  if (!resumeText || !jobDescription) {
    return NextResponse.json({ error: "resumeText and jobDescription are required" }, { status: 400 });
  }

  const isLifetime = dbUser.tier === "lifetime";

  let analysisObject;
  try {
    analysisObject = await runAnalysis(resumeText, jobDescription, isLifetime);
  } catch {
    // Retry once without optimizedBullets on failure
    try {
      analysisObject = await runAnalysis(resumeText, jobDescription, false);
    } catch {
      return NextResponse.json({ error: "analysis_failed" }, { status: 500 });
    }
  }

  // Commit freeReportUsed only after successful analysis
  if (dbUser.tier === "free" && !dbUser.freeReportUsed) {
    await db.update(user).set({ freeReportUsed: true }).where(eq(user.id, dbUser.id));
  }

  return NextResponse.json(analysisObject);
}
