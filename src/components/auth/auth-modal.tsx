"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

type State = "idle" | "loading" | "sent" | "error";

export function AuthModal({ open, onOpenChange, onSuccess, title, description }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function sendLink(emailToSend: string) {
    setState("loading");
    setError("");

    const callbackURL = typeof window !== "undefined" ? window.location.href : "/";
    const result = await authClient.signIn.magicLink({ email: emailToSend, callbackURL });

    if (result.error) {
      setError(result.error.message ?? "Failed to send link. Please try again.");
      setState("error");
    } else {
      setState("sent");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendLink(email);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setEmail("");
      setState("idle");
      setError("");
    }
    onOpenChange(next);
  }

  if (state === "sent") {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Check your inbox</DialogTitle>
            <DialogDescription>
              We sent a sign-in link to <strong>{email}</strong>. Click it to continue — it expires in 15 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Can&apos;t find it? Check your spam folder.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => sendLink(email)}
            >
              Resend link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title ?? "Sign in to continue"}</DialogTitle>
          <DialogDescription>
            {description ?? "Enter your email and we’ll send you a sign-in link — no password needed."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              disabled={state === "loading"}
              autoFocus
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full gap-2" disabled={state === "loading"}>
            {state === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {state === "loading" ? "Sending…" : "Send sign-in link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
