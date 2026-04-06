"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#000000", "#6b7280", "#ffffff",
];

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 w-8 rounded-md border border-border transition-transform hover:scale-110"
            style={{
              backgroundColor: c,
              outline: color === c ? "2px solid var(--primary)" : "none",
              outlineOffset: 2,
            }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="hex-color" className="text-xs text-muted-foreground">
          Custom:
        </Label>
        <Input
          id="hex-color"
          type="text"
          placeholder="#000000"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-28 font-mono text-sm"
        />
        <div
          className="h-8 w-8 rounded-md border border-border"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
