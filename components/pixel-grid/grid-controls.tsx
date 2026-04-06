"use client";

import { Button } from "@/components/ui/button";

interface GridControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
  buyMode: boolean;
  onToggleBuyMode: () => void;
}

export function GridControls({
  onZoomIn,
  onZoomOut,
  onReset,
  scale,
  buyMode,
  onToggleBuyMode,
}: GridControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
        <Button variant="ghost" size="sm" onClick={onZoomOut} className="h-7 w-7 p-0">
          -
        </Button>
        <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
          {Math.round(scale * 100)}%
        </span>
        <Button variant="ghost" size="sm" onClick={onZoomIn} className="h-7 w-7 p-0">
          +
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 px-2 text-xs">
          Fit
        </Button>
      </div>

      <Button
        size="sm"
        variant={buyMode ? "default" : "outline"}
        onClick={onToggleBuyMode}
      >
        {buyMode ? "Cancel Selection" : "Buy Pixels"}
      </Button>
    </div>
  );
}
