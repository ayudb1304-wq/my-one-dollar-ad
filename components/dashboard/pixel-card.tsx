"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditPixelDialog } from "./edit-pixel-dialog";

interface PixelCardProps {
  pixel: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    image_url: string | null;
    color: string | null;
    display_name: string | null;
    destination_url: string | null;
    status: string;
  };
  onUpdated: () => void;
}

export function PixelCard({ pixel, onUpdated }: PixelCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const totalPixels = pixel.width * pixel.height;

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          {/* Preview */}
          <div
            className="h-16 w-16 shrink-0 rounded border border-border"
            style={{
              backgroundColor: pixel.color || "#e5e5e5",
              backgroundImage: pixel.image_url
                ? `url(${pixel.image_url})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {pixel.display_name || "Untitled"}
            </p>
            <p className="text-xs text-muted-foreground">
              ({pixel.x}, {pixel.y}) &middot; {pixel.width}x{pixel.height} &middot;{" "}
              {totalPixels.toLocaleString()} px
            </p>
            {pixel.destination_url && (
              <p className="truncate text-xs text-primary">
                {pixel.destination_url}
              </p>
            )}
          </div>

          {/* Status + Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                pixel.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {pixel.status}
            </span>
            {pixel.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <EditPixelDialog
        pixel={pixel}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => {
          setEditOpen(false);
          onUpdated();
        }}
      />
    </>
  );
}
