"use client";

import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { signOut, useSession } from "@/lib/auth-client";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [authOpen, setAuthOpen] = useState(false);

  if (isPending) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />;
  }

  if (!session) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
          Sign in
        </Button>
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{session.user.email}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        className="gap-1.5"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  );
}
