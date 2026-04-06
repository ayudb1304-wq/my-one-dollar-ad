import { GridSection } from "@/components/pixel-grid/grid-section";
import { createAdminClient } from "@/lib/supabase/admin";
import { TOTAL_PIXELS } from "@/lib/constants";

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
  const remaining = TOTAL_PIXELS - soldPixels;

  return (
    <div className="flex flex-1 flex-col items-center px-1 pt-1">
      <div className="mb-1 flex w-full items-center justify-between px-2 text-xs text-muted-foreground">
        <span>{remaining.toLocaleString()} pixels remaining</span>
        <span>${soldPixels.toLocaleString()} raised</span>
      </div>
      <GridSection pixels={pixels ?? []} />
    </div>
  );
}
