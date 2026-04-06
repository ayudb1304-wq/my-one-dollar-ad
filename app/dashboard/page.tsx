import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: pixels } = await supabase
    .from("pixels")
    .select(
      "id, x, y, width, height, image_url, color, display_name, destination_url, status, created_at",
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const { data: rawTransactions } = await supabase
    .from("transactions")
    .select(
      "id, amount, status, dodo_payment_id, created_at, pixels(x, y, width, height, display_name)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Normalize: Supabase returns joined relations as arrays, flatten to single object
  const transactions = (rawTransactions ?? []).map((t) => ({
    ...t,
    pixels: Array.isArray(t.pixels) ? t.pixels[0] ?? null : t.pixels,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <DashboardClient
        userName={user.user_metadata?.name || user.email || ""}
        pixels={pixels ?? []}
        transactions={transactions}
      />
    </div>
  );
}
