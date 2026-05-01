"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface FreeWarningModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function FreeWarningModal({ open, onConfirm, onCancel }: FreeWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>This is your one free analysis</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 pt-2">
            <p>
              Your free account includes <strong>1 analysis</strong>. Once submitted, this will be used.
            </p>
            <p>
              <strong>Important:</strong> Reports are not saved. If you close this tab before downloading,{" "}
              your results will be gone. Use the <em>Download Report</em> button on the results page before leaving.
            </p>
            <p>
              To get unlimited analyses, upgrade to Lifetime for £99 — a one-time payment.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Got it — analyse my resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
