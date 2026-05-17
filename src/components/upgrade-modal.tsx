"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Infinity } from "lucide-react";

const LINKS = {
  credit1: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_1CREDIT!,
  credit3: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_3CREDITS!,
  lifetime: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME!,
};

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You&apos;ve used your free analysis</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-2">
          <a href={LINKS.credit1} className="block">
            <div className="rounded-lg border-2 border-muted hover:border-primary/50 hover:bg-muted/50 p-4 cursor-pointer transition-colors">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">1 analysis — $5</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Pay once, analyse one CV right now.
                  </p>
                </div>
              </div>
            </div>
          </a>

          <a href={LINKS.credit3} className="block">
            <div className="rounded-lg border-2 border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 p-4 cursor-pointer transition-colors">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">3 analyses — $12</p>
                    <Badge variant="secondary" className="text-xs">Save 20%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Best value if you&apos;re applying to multiple roles.
                  </p>
                </div>
              </div>
            </div>
          </a>

          <a href={LINKS.lifetime} className="block">
            <div className="rounded-lg border-2 border-muted hover:border-primary/50 hover:bg-muted/50 p-4 cursor-pointer transition-colors">
              <div className="flex items-start gap-3">
                <Infinity className="h-5 w-5 text-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Lifetime access — $99.99</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Unlimited analyses + optimised bullet points, forever.
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>

        <Button variant="ghost" className="w-full mt-1" onClick={onClose}>
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  );
}
