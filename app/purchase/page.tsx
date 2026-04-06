"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PurchaseForm } from "@/components/purchase/purchase-form";
import { PurchasePreview } from "@/components/purchase/purchase-preview";
import { useState } from "react";

function PurchaseContent() {
  const searchParams = useSearchParams();
  const x = Number(searchParams.get("x") ?? 0);
  const y = Number(searchParams.get("y") ?? 0);
  const w = Number(searchParams.get("w") ?? 10);
  const h = Number(searchParams.get("h") ?? 10);

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [color, setColor] = useState("#3b82f6");
  const [adType, setAdType] = useState<"image" | "color">("image");
  const [displayName, setDisplayName] = useState("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Complete Your Purchase</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left: Live preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <PurchasePreview
            x={x}
            y={y}
            width={w}
            height={h}
            imageDataUrl={adType === "image" ? imageDataUrl : null}
            color={adType === "color" ? color : null}
            displayName={displayName}
          />
        </div>

        {/* Right: Form */}
        <div className="min-w-0 flex-1">
          <PurchaseForm
            x={x}
            y={y}
            width={w}
            height={h}
            imageDataUrl={imageDataUrl}
            onImageReady={setImageDataUrl}
            color={color}
            onColorChange={setColor}
            adType={adType}
            onAdTypeChange={setAdType}
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
          />
        </div>
      </div>
    </div>
  );
}

export default function PurchasePage() {
  return (
    <Suspense>
      <PurchaseContent />
    </Suspense>
  );
}
