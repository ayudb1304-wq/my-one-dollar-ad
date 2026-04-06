"use client";

import { useCallback, useRef, useState } from "react";

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 10;

export function useGridTransform(canvasSize: number) {
  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: canvasSize / 1000, // fit grid to canvas
  });

  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Convert screen coordinates to grid coordinates
  const screenToGrid = useCallback(
    (screenX: number, screenY: number) => {
      return {
        gx: (screenX - transform.x) / transform.scale,
        gy: (screenY - transform.y) / transform.scale,
      };
    },
    [transform],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;

      setTransform((prev) => {
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, prev.scale * zoomFactor),
        );
        const ratio = newScale / prev.scale;

        return {
          scale: newScale,
          x: mouseX - (mouseX - prev.x) * ratio,
          y: mouseY - (mouseY - prev.y) * ratio,
        };
      });
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only pan with middle mouse or when not in buy mode (handled by parent)
      isPanning.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning.current) return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    },
    [],
  );

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const resetView = useCallback(() => {
    setTransform({
      x: 0,
      y: 0,
      scale: canvasSize / 1000,
    });
  }, [canvasSize]);

  const zoomIn = useCallback(() => {
    setTransform((prev) => {
      const newScale = Math.min(MAX_SCALE, prev.scale * 1.5);
      const center = canvasSize / 2;
      const ratio = newScale / prev.scale;
      return {
        scale: newScale,
        x: center - (center - prev.x) * ratio,
        y: center - (center - prev.y) * ratio,
      };
    });
  }, [canvasSize]);

  const zoomOut = useCallback(() => {
    setTransform((prev) => {
      const newScale = Math.max(MIN_SCALE, prev.scale / 1.5);
      const center = canvasSize / 2;
      const ratio = newScale / prev.scale;
      return {
        scale: newScale,
        x: center - (center - prev.x) * ratio,
        y: center - (center - prev.y) * ratio,
      };
    });
  }, [canvasSize]);

  return {
    transform,
    screenToGrid,
    handlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    resetView,
    zoomIn,
    zoomOut,
  };
}
