"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./image-upload";
import { ColorPicker } from "./color-picker";
import { PRICE_PER_PIXEL } from "@/lib/constants";

interface PurchaseFormProps {
  x: number;
  y: number;
  width: number;
  height: number;
  imageDataUrl: string | null;
  onImageReady: (dataUrl: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  adType: "image" | "color";
  onAdTypeChange: (type: "image" | "color") => void;
  displayName: string;
  onDisplayNameChange: (name: string) => void;
}

export function PurchaseForm({
  x,
  y,
  width,
  height,
  imageDataUrl,
  onImageReady,
  color,
  onColorChange,
  adType,
  onAdTypeChange,
  displayName,
  onDisplayNameChange,
}: PurchaseFormProps) {
  const totalPixels = width * height;
  const totalCost = totalPixels * PRICE_PER_PIXEL;

  const [destinationUrl, setDestinationUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);

  // Reserve pixels immediately when page loads
  useEffect(() => {
    const reserve = async () => {
      try {
        const res = await fetch("/api/pixels/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ x, y, width, height }),
        });
        if (res.ok) {
          const data = await res.json();
          setReservationId(data.reservation_id);
        }
      } catch {
        // Reservation failed — will be caught at checkout time
      }
    };
    reserve();

    // Release reservation on unmount (navigating away)
    return () => {
      if (reservationId) {
        navigator.sendBeacon(
          "/api/pixels/release",
          JSON.stringify({ reservation_id: reservationId }),
        );
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x,
          y,
          width,
          height,
          display_name: displayName,
          destination_url: destinationUrl,
          email,
          name,
          image_data_url: adType === "image" ? imageDataUrl : null,
          color: adType === "color" ? color : null,
          country,
          reservation_id: reservationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch {
      setError("Failed to create checkout session. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Customize */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Customize Your Ad</CardTitle>
          <CardDescription>
            Upload an image or choose a solid color for your pixel block
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Tabs
            value={adType}
            onValueChange={(v) => onAdTypeChange(v as "image" | "color")}
          >
            <TabsList>
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="color">Solid Color</TabsTrigger>
            </TabsList>
            <TabsContent value="image" className="mt-4">
              <ImageUpload
                width={width}
                height={height}
                onImageReady={onImageReady}
              />
            </TabsContent>
            <TabsContent value="color" className="mt-4">
              <ColorPicker color={color} onChange={onColorChange} />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              placeholder="Your brand or company name"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="destination-url">Destination URL</Label>
            <Input
              id="destination-url"
              type="url"
              placeholder="https://yourwebsite.com"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. Your Details</CardTitle>
          <CardDescription>
            We&apos;ll send your receipt to this email
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-name">Name</Label>
              <Input
                id="customer-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customer-country">Country Code</Label>
            <Input
              id="customer-country"
              placeholder="US"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              maxLength={2}
              required
              className="w-20 uppercase"
            />
            <p className="text-xs text-muted-foreground">
              Two-letter ISO country code (e.g. US, GB, IN)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Sticky pay button */}
      <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading
            ? "Creating checkout..."
            : `Pay $${totalCost.toLocaleString()} — Complete Purchase`}
        </Button>
      </div>
    </form>
  );
}
