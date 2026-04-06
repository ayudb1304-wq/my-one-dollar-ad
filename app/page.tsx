import { StatsBar } from "@/components/layout/stats-bar";
import { TOTAL_PIXELS, PRICE_PER_PIXEL, MIN_PIXELS } from "@/lib/constants";
import { GridSection } from "@/components/pixel-grid/grid-section";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function HomePage() {
  const supabase = createAdminClient();
  const { data: pixels } = await supabase
    .from("pixels")
    .select(
      "id, x, y, width, height, image_url, color, display_name, destination_url, status",
    )
    .in("status", ["active", "pending"]);

  const soldPixels = (pixels ?? []).reduce(
    (sum, p) => sum + p.width * p.height,
    0,
  );

  return (
    <>
      <StatsBar soldPixels={soldPixels} />

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Hero — compact */}
        <section className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Own a piece of the internet for{" "}
            <span className="text-primary">$1/pixel</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            {TOTAL_PIXELS.toLocaleString()} pixels. Min{" "}
            {MIN_PIXELS.toLocaleString()} pixels ($
            {MIN_PIXELS * PRICE_PER_PIXEL}). Click &quot;Buy Pixels&quot; then
            drag to select.
          </p>
        </section>

        {/* How it works — inline row */}
        <section className="mb-6">
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-md border border-border px-3 py-3">
              <span className="font-bold text-primary">1.</span> Select pixels
            </div>
            <div className="rounded-md border border-border px-3 py-3">
              <span className="font-bold text-primary">2.</span> Customize ad
            </div>
            <div className="rounded-md border border-border px-3 py-3">
              <span className="font-bold text-primary">3.</span> Pay & go live
            </div>
          </div>
        </section>

        {/* Grid */}
        <section id="grid" className="flex justify-center">
          <GridSection pixels={pixels ?? []} />
        </section>
      </div>
    </>
  );
}
