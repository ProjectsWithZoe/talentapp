"use client";

import type { AnalysisResult } from "@/lib/analysis-schema";

export async function generatePDF(result: AnalysisResult) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const margin = 18;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addText = (text: string, size: number, bold = false, color = "#111111") => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += (lines.length * size * 0.4) + 3;
  };

  const addSection = (title: string) => {
    if (y > 260) { doc.addPage(); y = margin; }
    y += 3;
    doc.setFillColor("#f3f4f6");
    doc.rect(margin - 2, y - 4, contentWidth + 4, 8, "F");
    addText(title, 11, true, "#1e293b");
    y += 1;
  };

  const addBullet = (text: string, bullet = "•") => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#374151");
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    doc.text(bullet, margin, y);
    doc.text(lines, margin + 6, y);
    y += (lines.length * 10 * 0.4) + 3;
  };

  // Header
  doc.setFillColor("#2563eb");
  doc.rect(0, 0, 210, 22, "F");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#ffffff");
  doc.text("TalentApp.co.uk — Resume Analysis Report", margin, 14);
  y = 32;

  // Scores
  addSection("Scores");
  addText(`ATS Score: ${result.atsScore}/100`, 11, false, "#374151");
  addText(`Recruiter Fit: ${result.recruiterFit}`, 11, false, "#374151");

  // Strong Matches
  addSection("Strong Matches");
  result.strongMatches.forEach((s) => addBullet(s, "✓"));

  // Missing Skills
  addSection("Missing Skills");
  if (result.missingSkills.length > 0) {
    result.missingSkills.forEach((s) => addBullet(s, "✗"));
  } else {
    addText("No critical missing skills identified.", 10);
  }

  // Rejection Risks
  addSection("Rejection Risks");
  if (result.rejectionRisks.length > 0) {
    result.rejectionRisks.forEach((r) => addBullet(r, "⚠"));
  } else {
    addText("No major rejection risks identified.", 10);
  }

  // Recruiter Perception
  addSection("Recruiter Perception");
  addText(result.recruiterPerception, 10);

  // Fixes
  addSection("Recommended Fixes");
  result.fixes.forEach((fix, i) => addBullet(fix, `${i + 1}.`));

  // Optimized Bullets
  if (result.optimizedBullets && result.optimizedBullets.length > 0) {
    addSection("Optimised Bullet Points");
    result.optimizedBullets.forEach((b) => addBullet(b));
  }

  doc.save("Talentapp-report.pdf");
}
