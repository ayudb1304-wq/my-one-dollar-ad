"use client";

import { TOTAL_PIXELS } from "@/lib/constants";

interface StatsBarProps {
  soldPixels: number;
}

export function StatsBar({ soldPixels }: StatsBarProps) {
  const remaining = TOTAL_PIXELS - soldPixels;
  const percentSold = ((soldPixels / TOTAL_PIXELS) * 100).toFixed(1);

  return (
    <div className="border-b border-border bg-muted/50 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 text-sm">
        <span className="font-medium">
          {remaining.toLocaleString()} pixels remaining
        </span>
        <span className="text-muted-foreground">
          {percentSold}% sold
        </span>
        <span className="text-muted-foreground">
          ${soldPixels.toLocaleString()} raised
        </span>
      </div>
    </div>
  );
}
