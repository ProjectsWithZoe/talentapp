"use client";

import { useCallback, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024;

export function ResumeUpload({ onTextExtracted, disabled }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setFileName(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a .pdf or .docx file.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File is too large. Maximum size is 5MB.");
        return;
      }

      setLoading(true);
      setFileName(file.name);

      try {
        let text: string;

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const { parseDocx } = await import("@/lib/parse-docx");
          text = await parseDocx(file);
        } else {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/parse-pdf", { method: "POST", body: form });
          if (!res.ok) {
            const { error: msg } = await res.json();
            throw new Error(msg ?? "Failed to parse PDF");
          }
          const { text: extracted } = await res.json();
          text = extracted;
        }

        if (!text || text.trim().length < 50) {
          throw new Error("Could not read this file. Try pasting your resume as text instead.");
        }

        onTextExtracted(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to read file.");
        setFileName(null);
      } finally {
        setLoading(false);
      }
    },
    [onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clear = () => {
    setFileName(null);
    setError(null);
    onTextExtracted("");
  };

  return (
    <div className="space-y-2">
      <label
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-50",
          fileName && !error && "border-green-300 bg-green-50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          className="sr-only"
          onChange={handleChange}
          disabled={disabled || loading}
        />

        {loading ? (
          <>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
            <p className="text-sm text-muted-foreground">Reading your resume…</p>
          </>
        ) : fileName && !error ? (
          <>
            <FileText className="h-8 w-8 text-green-600 mb-3" />
            <p className="text-sm font-medium text-green-700">{fileName}</p>
            <p className="text-xs text-muted-foreground mt-1">Resume loaded ✓</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Drop your resume here</p>
            <p className="text-xs text-muted-foreground mt-1">.pdf or .docx · max 5MB</p>
          </>
        )}
      </label>

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {fileName && !error && (
        <Button variant="ghost" size="sm" onClick={clear} className="h-auto py-1 text-xs text-muted-foreground">
          <X className="h-3 w-3 mr-1" /> Remove and upload different file
        </Button>
      )}
    </div>
  );
}
