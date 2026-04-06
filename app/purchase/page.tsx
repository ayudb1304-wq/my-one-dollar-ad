"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PurchaseForm } from "@/components/purchase/purchase-form";

function PurchaseContent() {
  const searchParams = useSearchParams();
  const x = Number(searchParams.get("x") ?? 0);
  const y = Number(searchParams.get("y") ?? 0);
  const w = Number(searchParams.get("w") ?? 10);
  const h = Number(searchParams.get("h") ?? 10);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Complete Your Purchase</h1>
      <p className="mb-8 text-muted-foreground">
        You&apos;re buying a {w}x{h} block ({(w * h).toLocaleString()} pixels)
        at position ({x}, {y}) for ${(w * h).toLocaleString()}.
      </p>
      <PurchaseForm x={x} y={y} width={w} height={h} />
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
