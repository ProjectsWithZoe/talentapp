import { z } from "zod";

export const recruiterFitValues = [
  "Likely to shortlist",
  "Competitive",
  "Borderline",
  "Unlikely",
] as const;

export const analysisSchema = z.object({
  atsScore: z.number().int().min(0).max(100).describe(
    "Keyword and format compatibility score (0-100). Based on how well the resume matches the job description's required skills and terminology."
  ),
  recruiterFit: z.enum(recruiterFitValues).describe(
    "Qualitative shortlist likelihood from a hiring manager's perspective."
  ),
  strongMatches: z.array(z.string()).describe(
    "Skills, experience, or qualifications in the resume that genuinely match this specific role."
  ),
  missingSkills: z.array(z.string()).describe(
    "Keywords, skills, or requirements in the job description that are absent or unclear in the resume."
  ),
  rejectionRisks: z.array(z.string()).describe(
    "Specific patterns, red flags, or gaps that could trigger rejection — by ATS or recruiter."
  ),
  recruiterPerception: z.string().describe(
    "A plain-English paragraph describing how a senior recruiter reads this resume on first glance. Be honest and direct."
  ),
  fixes: z.array(z.string()).min(3).max(5).describe(
    "3-5 specific, actionable changes ranked by impact. Each fix should be concrete: what to change, not just 'add more detail'."
  ),
  optimizedBullets: z.array(z.string()).nullable().describe(
    "Rewritten bullet points from the resume that better match this role's keywords and impact framing. Null if not requested."
  ),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
export type RecruiterFit = typeof recruiterFitValues[number];
