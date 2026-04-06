"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PixelSelection } from "@/lib/types";
import { PRICE_PER_PIXEL } from "@/lib/constants";

interface SelectionInfoProps {
  selection: PixelSelection;
  onClear: () => void;
}

export function SelectionInfo({ selection, onClear }: SelectionInfoProps) {
  const totalPixels = selection.width * selection.height;
  const totalCost = totalPixels * PRICE_PER_PIXEL;

  const params = new URLSearchParams({
    x: String(selection.x),
    y: String(selection.y),
    w: String(selection.width),
    h: String(selection.height),
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            ({selection.x}, {selection.y})
          </span>
          <span>
            {selection.width}x{selection.height} &middot;{" "}
            {totalPixels.toLocaleString()} px
          </span>
          <span className="font-bold text-lg">
            ${totalCost.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button size="sm" asChild>
            <Link href={`/purchase?${params.toString()}`}>
              Continue to Purchase
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
