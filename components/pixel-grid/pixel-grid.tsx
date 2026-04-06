"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PixelBlock, PixelSelection } from "@/lib/types";
import { GRID_WIDTH, GRID_HEIGHT, MIN_BLOCK_SIZE } from "@/lib/constants";
import { useGridTransform } from "./use-grid-transform";
import { GridControls } from "./grid-controls";
import { PixelTooltip } from "./pixel-tooltip";

interface PixelGridProps {
  pixels: PixelBlock[];
  onSelectionComplete?: (selection: PixelSelection) => void;
}

const DEFAULT_CANVAS_SIZE = 800;

export function PixelGrid({ pixels, onSelectionComplete }: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedImages = useRef<Map<string, HTMLImageElement>>(new Map());
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);

  // Responsive canvas sizing — fit viewport height too
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth ?? DEFAULT_CANVAS_SIZE;
        const maxHeight = window.innerHeight - 280; // leave room for header, controls, selection bar
        const size = Math.min(DEFAULT_CANVAS_SIZE, parentWidth - 2, maxHeight);
        setCanvasSize(Math.max(300, size)); // minimum 300px
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [buyMode, setBuyMode] = useState(false);
  const [selection, setSelection] = useState<PixelSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStart = useRef<{ gx: number; gy: number } | null>(null);

  const [hoveredBlock, setHoveredBlock] = useState<PixelBlock | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const {
    transform,
    screenToGrid,
    handlers: panHandlers,
    resetView,
    zoomIn,
    zoomOut,
  } = useGridTransform(canvasSize);

  // Build spatial index for fast hit detection
  const findBlockAt = useCallback(
    (gx: number, gy: number): PixelBlock | null => {
      for (const block of pixels) {
        if (
          gx >= block.x &&
          gx < block.x + block.width &&
          gy >= block.y &&
          gy < block.y + block.height
        ) {
          return block;
        }
      }
      return null;
    },
    [pixels],
  );

  // Preload images for sold pixel blocks
  useEffect(() => {
    for (const block of pixels) {
      if (block.image_url && !loadedImages.current.has(block.id)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = block.image_url;
        loadedImages.current.set(block.id, img);
      }
    }
  }, [pixels]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Draw grid background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, GRID_WIDTH, GRID_HEIGHT);

    // Draw fine grid lines when zoomed in enough
    if (transform.scale > 2) {
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 0.5 / transform.scale;
      const step = MIN_BLOCK_SIZE;
      for (let x = 0; x <= GRID_WIDTH; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GRID_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= GRID_HEIGHT; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GRID_WIDTH, y);
        ctx.stroke();
      }
    }

    // Draw pixel blocks (active and pending)
    for (const block of pixels) {
      if (block.status === "pending") {
        // Pending: gray with diagonal stripes
        ctx.fillStyle = "#d4d4d4";
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.lineWidth = 1 / transform.scale;
        ctx.setLineDash([3 / transform.scale, 3 / transform.scale]);
        ctx.strokeRect(block.x, block.y, block.width, block.height);
        ctx.setLineDash([]);
      } else {
        const img = loadedImages.current.get(block.id);
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, block.x, block.y, block.width, block.height);
        } else if (block.color) {
          ctx.fillStyle = block.color;
          ctx.fillRect(block.x, block.y, block.width, block.height);
        }
      }

      // Draw border around blocks
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 0.5 / transform.scale;
      ctx.strokeRect(block.x, block.y, block.width, block.height);
    }

    // Draw selection overlay
    if (selection) {
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
      ctx.fillRect(selection.x, selection.y, selection.width, selection.height);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
      ctx.lineWidth = 2 / transform.scale;
      ctx.setLineDash([4 / transform.scale, 4 / transform.scale]);
      ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
      ctx.setLineDash([]);
    }

    // Draw grid border
    ctx.strokeStyle = "#d4d4d4";
    ctx.lineWidth = 1 / transform.scale;
    ctx.strokeRect(0, 0, GRID_WIDTH, GRID_HEIGHT);

    ctx.restore();
  }, [transform, pixels, selection, canvasSize]);

  // Handle mouse move for tooltip and selection
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const { gx, gy } = screenToGrid(screenX, screenY);

      // Update selection if dragging
      if (isSelecting && selectionStart.current) {
        const startGx = selectionStart.current.gx;
        const startGy = selectionStart.current.gy;

        // Snap to MIN_BLOCK_SIZE grid
        const snapX1 = Math.floor(Math.min(startGx, gx) / MIN_BLOCK_SIZE) * MIN_BLOCK_SIZE;
        const snapY1 = Math.floor(Math.min(startGy, gy) / MIN_BLOCK_SIZE) * MIN_BLOCK_SIZE;
        const snapX2 = Math.ceil(Math.max(startGx, gx) / MIN_BLOCK_SIZE) * MIN_BLOCK_SIZE;
        const snapY2 = Math.ceil(Math.max(startGy, gy) / MIN_BLOCK_SIZE) * MIN_BLOCK_SIZE;

        const w = Math.max(MIN_BLOCK_SIZE, snapX2 - snapX1);
        const h = Math.max(MIN_BLOCK_SIZE, snapY2 - snapY1);

        // Clamp to grid bounds
        const x = Math.max(0, Math.min(snapX1, GRID_WIDTH - w));
        const y = Math.max(0, Math.min(snapY1, GRID_HEIGHT - h));

        setSelection({ x, y, width: w, height: h });
        return;
      }

      // Tooltip on hover (only when not in buy mode)
      if (!buyMode) {
        if (gx >= 0 && gx < GRID_WIDTH && gy >= 0 && gy < GRID_HEIGHT) {
          const block = findBlockAt(gx, gy);
          setHoveredBlock(block);
          setTooltipPos({ x: screenX, y: screenY });
        } else {
          setHoveredBlock(null);
        }
      }
    },
    [screenToGrid, buyMode, isSelecting, findBlockAt],
  );

  // Click on sold block to visit URL
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (buyMode || isSelecting) return;

      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const { gx, gy } = screenToGrid(screenX, screenY);

      const block = findBlockAt(gx, gy);
      if (block?.destination_url) {
        window.open(block.destination_url, "_blank", "noopener,noreferrer");
      }
    },
    [screenToGrid, buyMode, isSelecting, findBlockAt],
  );

  // Buy mode pointer handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (buyMode) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const { gx, gy } = screenToGrid(screenX, screenY);

        if (gx >= 0 && gx < GRID_WIDTH && gy >= 0 && gy < GRID_HEIGHT) {
          setIsSelecting(true);
          selectionStart.current = { gx, gy };
          const snapX = Math.floor(gx / MIN_BLOCK_SIZE) * MIN_BLOCK_SIZE;
          const snapY = Math.floor(gy / MIN_BLOCK_SIZE) * MIN_BLOCK_SIZE;
          setSelection({
            x: snapX,
            y: snapY,
            width: MIN_BLOCK_SIZE,
            height: MIN_BLOCK_SIZE,
          });
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          return;
        }
      }
      panHandlers.onPointerDown(e);
    },
    [buyMode, screenToGrid, panHandlers],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isSelecting) return; // handled by mousemove
      panHandlers.onPointerMove(e);
    },
    [isSelecting, panHandlers],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isSelecting && selection) {
        setIsSelecting(false);
        selectionStart.current = null;

        // Check for overlap with existing pixels
        const overlaps = pixels.some(
          (block) =>
            selection.x < block.x + block.width &&
            selection.x + selection.width > block.x &&
            selection.y < block.y + block.height &&
            selection.y + selection.height > block.y,
        );

        if (overlaps) {
          setSelection(null);
          return;
        }

        onSelectionComplete?.(selection);
        return;
      }
      panHandlers.onPointerUp();
    },
    [isSelecting, selection, pixels, onSelectionComplete, panHandlers],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <GridControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetView}
          scale={transform.scale / (canvasSize / 1000)}
          buyMode={buyMode}
          onToggleBuyMode={() => {
            setBuyMode(!buyMode);
            setSelection(null);
            setIsSelecting(false);
          }}
        />
        {selection && (
          <div className="text-sm text-muted-foreground">
            {selection.width}x{selection.height} ={" "}
            <span className="font-medium text-foreground">
              {(selection.width * selection.height).toLocaleString()} pixels ($
              {(selection.width * selection.height).toLocaleString()})
            </span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-border"
        style={{ width: canvasSize, height: canvasSize }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: canvasSize,
            height: canvasSize,
            cursor: buyMode ? "crosshair" : hoveredBlock ? "pointer" : "grab",
          }}
          onWheel={panHandlers.onWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={() => setHoveredBlock(null)}
        />

        <PixelTooltip
          block={hoveredBlock}
          x={tooltipPos.x}
          y={tooltipPos.y}
          visible={!buyMode && !!hoveredBlock}
        />
      </div>
    </div>
  );
}
