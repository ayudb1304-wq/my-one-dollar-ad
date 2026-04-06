"use client";

import { useEffect, useRef } from "react";
import { PRICE_PER_PIXEL } from "@/lib/constants";

interface PurchasePreviewProps {
  x: number;
  y: number;
  width: number;
  height: number;
  imageDataUrl: string | null;
  color: string | null;
  displayName: string;
}

const PREVIEW_SIZE = 300;

export function PurchasePreview({
  x,
  y,
  width,
  height,
  imageDataUrl,
  color,
  displayName,
}: PurchasePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalPixels = width * height;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = PREVIEW_SIZE * dpr;
    canvas.height = PREVIEW_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    // Scale to fit the block with padding
    const padding = 20;
    const available = PREVIEW_SIZE - padding * 2;
    const scale = Math.min(available / width, available / height);
    const drawW = width * scale;
    const drawH = height * scale;
    const drawX = (PREVIEW_SIZE - drawW) / 2;
    const drawY = (PREVIEW_SIZE - drawH) / 2;

    // Draw block
    if (imageDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.strokeStyle = "#d4d4d4";
        ctx.lineWidth = 1;
        ctx.strokeRect(drawX, drawY, drawW, drawH);
      };
      img.src = imageDataUrl;
    } else {
      ctx.fillStyle = color || "#3b82f6";
      ctx.fillRect(drawX, drawY, drawW, drawH);
      ctx.strokeStyle = "#d4d4d4";
      ctx.lineWidth = 1;
      ctx.strokeRect(drawX, drawY, drawW, drawH);
    }
  }, [width, height, imageDataUrl, color]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">Live Preview</p>
      <canvas
        ref={canvasRef}
        style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
        className="rounded-lg border border-border"
      />
      <div className="text-sm">
        <p>
          <span className="text-muted-foreground">Position:</span> ({x}, {y})
        </p>
        <p>
          <span className="text-muted-foreground">Size:</span> {width}x{height}
        </p>
        <p>
          <span className="text-muted-foreground">Name:</span>{" "}
          {displayName || "—"}
        </p>
        <p className="text-lg font-bold">
          ${(totalPixels * PRICE_PER_PIXEL).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
