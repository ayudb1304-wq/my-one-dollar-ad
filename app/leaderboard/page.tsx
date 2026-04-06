import { createClient } from "@/lib/supabase/server";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: pixels } = await supabase
    .from("pixels")
    .select("display_name, width, height, destination_url")
    .eq("status", "active");

  // Aggregate by display_name
  const leaderboard = new Map<
    string,
    { total: number; url: string | null }
  >();

  for (const p of pixels ?? []) {
    const name = p.display_name || "Anonymous";
    const existing = leaderboard.get(name) || { total: 0, url: null };
    existing.total += p.width * p.height;
    if (!existing.url && p.destination_url) existing.url = p.destination_url;
    leaderboard.set(name, existing);
  }

  const sorted = [...leaderboard.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 50);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Leaderboard</h1>
      <p className="mb-8 text-muted-foreground">
        Top pixel owners on the grid
      </p>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No pixels sold yet. Be the first!
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Rank</th>
                <th className="px-4 py-2 text-left font-medium">Owner</th>
                <th className="px-4 py-2 text-right font-medium">Pixels</th>
                <th className="px-4 py-2 text-right font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(([name, { total, url }], i) => (
                <tr
                  key={name}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-2 font-medium text-muted-foreground">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {total.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
