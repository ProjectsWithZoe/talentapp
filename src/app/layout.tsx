import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://talentapp.co.uk"),
  title: {
    default: "TalentApp — AI Resume Analyser for Tech Job Seekers",
    template: "%s | TalentApp",
  },
  description:
    "Know your chances before you apply. Talentapp analyses your resume against any job description — ATS score, recruiter fit, missing skills, and actionable fixes. Free for tech job seekers in the UK, US, Canada, and Australia.",
  keywords: [
    "ATS resume checker",
    "resume analyser for software engineers",
    "tech resume ATS score",
    "why is my resume getting rejected",
    "resume match score UK",
    "ATS keywords for developers",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    alternateLocale: ["en_US", "en_AU", "en_CA"],
    siteName: "Talentapp",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TalentApp",
  url: "https://talentapp.co.uk",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI resume analyser for tech job seekers. Get your ATS score, recruiter fit rating, missing skills, rejection risks, and actionable fixes — free for the first analysis.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", description: "First analysis free, no account required" },
    { "@type": "Offer", price: "5", priceCurrency: "USD", description: "Single analysis credit" },
    { "@type": "Offer", price: "99", priceCurrency: "USD", description: "Lifetime unlimited access" },
  ],
  featureList: [
    "ATS compatibility score",
    "Recruiter fit rating",
    "Missing skills analysis",
    "Rejection risk detection",
    "Actionable resume fixes",
    "AI-optimised bullet points",
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Job seekers",
    geographicArea: "United Kingdom, United States, Canada, Australia",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
