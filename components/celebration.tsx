"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Award, X } from "lucide-react";

import { fireConfetti } from "@/lib/confetti";
import { Button } from "@/components/ui/button";

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function CelebrationModal({
  open,
  onClose,
  title,
  message,
}: CelebrationModalProps) {
  useEffect(() => {
    if (!open) return;
    // A first burst, then a couple of follow-ups from the sides.
    fireConfetti({ count: 120, spread: 1.1 });
    const t1 = window.setTimeout(
      () => fireConfetti({ x: window.innerWidth * 0.2, count: 50, power: 0.9 }),
      220,
    );
    const t2 = window.setTimeout(
      () =>
        fireConfetti({ x: window.innerWidth * 0.8, count: 50, power: 0.9 }),
      420,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-8 text-center shadow-xl data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 ring-8 ring-gold/5">
            <Award className="h-8 w-8 text-gold" />
          </div>
          <Dialog.Title className="font-display text-2xl font-medium tracking-tight">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mx-auto mt-2 max-w-sm text-muted-foreground">
            {message}
          </Dialog.Description>
          <Button onClick={onClose} className="mt-6 w-full" size="lg">
            Keep going
          </Button>
          <Dialog.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
