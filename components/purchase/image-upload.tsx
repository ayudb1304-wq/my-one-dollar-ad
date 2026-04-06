"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  width: number;
  height: number;
  onImageReady: (dataUrl: string) => void;
}

export function ImageUpload({ width, height, onImageReady }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize to match pixel block dimensions
          const canvas = canvasRef.current;
          if (!canvas) return;

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Cover-fit: scale to fill, then center-crop
          const scale = Math.max(width / img.width, height / img.height);
          const sw = width / scale;
          const sh = height / scale;
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sh) / 2;

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/png");
          setPreview(dataUrl);
          onImageReady(dataUrl);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [width, height, onImageReady],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        processFile(file);
      }
    },
    [processFile],
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-40 rounded"
            style={{ imageRendering: width < 100 ? "pixelated" : "auto" }}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Click or drag & drop an image
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, or GIF — will be resized to {width}x{height}px
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />

      {preview && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          Remove image
        </Button>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
