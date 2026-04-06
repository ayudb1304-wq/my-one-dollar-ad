import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || "").split(",").map((e) => e.trim());

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    redirect("/");
  }

  // Fetch stats
  const { data: activePixels } = await supabase
    .from("pixels")
    .select("id, x, y, width, height, display_name, destination_url, status, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const { data: pendingPixels } = await supabase
    .from("pixels")
    .select("id, x, y, width, height, display_name, status, created_at")
    .eq("status", "pending");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, status, created_at")
    .eq("status", "succeeded");

  const totalSold = (activePixels ?? []).reduce(
    (sum, p) => sum + p.width * p.height,
    0,
  );
  const totalRevenue = (transactions ?? []).reduce(
    (sum, t) => sum + t.amount,
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">{totalSold.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Pixels Sold</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">
            ${(totalRevenue / 100).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">{activePixels?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">Active Blocks</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">{pendingPixels?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Active Pixels */}
      <h2 className="mb-4 text-lg font-semibold">Active Pixel Blocks</h2>
      {(activePixels?.length ?? 0) === 0 ? (
        <p className="mb-8 text-sm text-muted-foreground">No active pixels.</p>
      ) : (
        <div className="mb-8 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Position</th>
                <th className="px-3 py-2 text-left font-medium">Size</th>
                <th className="px-3 py-2 text-left font-medium">URL</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {activePixels?.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">{p.display_name || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    ({p.x}, {p.y})
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.width}x{p.height}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2 text-xs text-primary">
                    {p.destination_url || "—"}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Transactions */}
      <h2 className="mb-4 text-lg font-semibold">
        Recent Transactions ({transactions?.length ?? 0})
      </h2>
      <p className="text-sm text-muted-foreground">
        Total: {transactions?.length ?? 0} successful transactions
      </p>
    </div>
  );
}
