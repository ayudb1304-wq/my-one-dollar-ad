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

  const soldPixels = (pixels ?? [])
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.width * p.height, 0);

  return (
    <>
      <StatsBar soldPixels={soldPixels} />

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Own a piece of the internet
            <br />
            for just <span className="text-primary">$1 per pixel</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Place your ad on our {TOTAL_PIXELS.toLocaleString()}-pixel grid.
            Every pixel links to your website. Minimum{" "}
            {MIN_PIXELS.toLocaleString()} pixels ($
            {MIN_PIXELS * PRICE_PER_PIXEL}).
          </p>
        </section>

        {/* Grid */}
        <section id="grid" className="mb-12 flex justify-center">
          <GridSection pixels={pixels ?? []} />
        </section>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-primary">1</div>
              <h3 className="mb-1 font-medium">Select pixels</h3>
              <p className="text-sm text-muted-foreground">
                Click and drag to select a block on the grid (min 10x10)
              </p>
            </div>
            <div className="rounded-lg border border-border p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-primary">2</div>
              <h3 className="mb-1 font-medium">Customize</h3>
              <p className="text-sm text-muted-foreground">
                Upload your image or pick a color, add your website link
              </p>
            </div>
            <div className="rounded-lg border border-border p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-primary">3</div>
              <h3 className="mb-1 font-medium">Pay & go live</h3>
              <p className="text-sm text-muted-foreground">
                Pay ${PRICE_PER_PIXEL}/pixel and your ad goes live instantly
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
