"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/purchase/image-upload";
import { ColorPicker } from "@/components/purchase/color-picker";

interface EditPixelDialogProps {
  pixel: {
    id: string;
    width: number;
    height: number;
    display_name: string | null;
    destination_url: string | null;
    color: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function EditPixelDialog({
  pixel,
  open,
  onOpenChange,
  onSaved,
}: EditPixelDialogProps) {
  const [displayName, setDisplayName] = useState(pixel.display_name || "");
  const [destinationUrl, setDestinationUrl] = useState(
    pixel.destination_url || "",
  );
  const [color, setColor] = useState(pixel.color || "#3b82f6");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [adType, setAdType] = useState<"image" | "color">(
    pixel.color ? "color" : "image",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/pixels/${pixel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          destination_url: destinationUrl,
          color: adType === "color" ? color : null,
          image_data_url: adType === "image" ? imageDataUrl : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update");
        setLoading(false);
        return;
      }

      onSaved();
    } catch {
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pixel Block</DialogTitle>
          <DialogDescription>
            Update your {pixel.width}x{pixel.height} pixel block
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Tabs
            value={adType}
            onValueChange={(v) => setAdType(v as "image" | "color")}
          >
            <TabsList>
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="color">Solid Color</TabsTrigger>
            </TabsList>
            <TabsContent value="image" className="mt-4">
              <ImageUpload
                width={pixel.width}
                height={pixel.height}
                onImageReady={setImageDataUrl}
              />
            </TabsContent>
            <TabsContent value="color" className="mt-4">
              <ColorPicker color={color} onChange={setColor} />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Display Name</Label>
            <Input
              id="edit-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-url">Destination URL</Label>
            <Input
              id="edit-url"
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
