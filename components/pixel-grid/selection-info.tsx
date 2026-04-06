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
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="text-sm">
        <p>
          <span className="text-muted-foreground">Position:</span>{" "}
          ({selection.x}, {selection.y})
        </p>
        <p>
          <span className="text-muted-foreground">Size:</span>{" "}
          {selection.width}x{selection.height} ({totalPixels.toLocaleString()}{" "}
          pixels)
        </p>
        <p className="font-medium">
          Total: ${totalCost.toLocaleString()}
        </p>
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
  );
}
