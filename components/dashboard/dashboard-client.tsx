"use client";

import { useRouter } from "next/navigation";
import { PixelCard } from "./pixel-card";
import { PurchaseHistory } from "./purchase-history";
import { Separator } from "@/components/ui/separator";

interface DashboardClientProps {
  userName: string;
  pixels: Array<{
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
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[];
}

export function DashboardClient({
  userName,
  pixels,
  transactions,
}: DashboardClientProps) {
  const router = useRouter();

  const totalPixels = pixels
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.width * p.height, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Summary */}
      <div>
        <p className="text-muted-foreground">Welcome, {userName}</p>
        <div className="mt-3 flex gap-6">
          <div>
            <p className="text-2xl font-bold">{pixels.length}</p>
            <p className="text-xs text-muted-foreground">Pixel blocks</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {totalPixels.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total pixels</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              ${totalPixels.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Pixel Blocks */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Pixel Blocks</h2>
        {pixels.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You haven&apos;t purchased any pixels yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pixels.map((pixel) => (
              <PixelCard
                key={pixel.id}
                pixel={pixel}
                onUpdated={() => router.refresh()}
              />
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Purchase History */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Purchase History</h2>
        <PurchaseHistory transactions={transactions} />
      </div>
    </div>
  );
}
