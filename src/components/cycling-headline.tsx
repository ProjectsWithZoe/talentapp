"use client";

import { useState, useEffect } from "react";

const phrases = [
  "Stop applying with resumes that get filtered out",
  "Find out why recruiters reject your resume before they do",
];

export function CyclingHeadline() {
  const [phrase, setPhrase] = useState<string | null>(null);

  useEffect(() => {
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  return (
    <span className="block text-primary">
      {phrase ?? phrases[0]}
    </span>
  );
}
