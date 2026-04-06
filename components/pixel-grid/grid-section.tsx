"use client";

import { useCallback, useState } from "react";
import { PixelGrid } from "./pixel-grid";
import { SelectionInfo } from "./selection-info";
import type { PixelBlock, PixelSelection } from "@/lib/types";

interface GridSectionProps {
  pixels: PixelBlock[];
}

export function GridSection({ pixels }: GridSectionProps) {
  const [selection, setSelection] = useState<PixelSelection | null>(null);

  const handleSelectionComplete = useCallback(
    (sel: PixelSelection) => {
      setSelection(sel);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setSelection(null);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <PixelGrid pixels={pixels} onSelectionComplete={handleSelectionComplete} />
      {selection && (
        <SelectionInfo selection={selection} onClear={handleClear} />
      )}
    </div>
  );
}
