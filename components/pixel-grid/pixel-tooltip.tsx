"use client";

import type { PixelBlock } from "@/lib/types";

interface PixelTooltipProps {
  block: PixelBlock | null;
  x: number;
  y: number;
  visible: boolean;
}

export function PixelTooltip({ block, x, y, visible }: PixelTooltipProps) {
  if (!visible || !block) return null;

  const pixelCount = block.width * block.height;

  return (
    <div
      className="pointer-events-none absolute z-50 rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md"
      style={{
        left: x + 12,
        top: y + 12,
      }}
    >
      <p className="font-medium">{block.display_name || "Anonymous"}</p>
      <p className="text-xs text-muted-foreground">
        {block.width}x{block.height} ({pixelCount.toLocaleString()} pixels)
      </p>
      {block.destination_url && (
        <p className="mt-1 text-xs text-primary">Click to visit</p>
      )}
    </div>
  );
}
