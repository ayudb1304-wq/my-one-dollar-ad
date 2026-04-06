interface Transaction {
  id: string;
  amount: number;
  status: string;
  dodo_payment_id: string | null;
  created_at: string;
  pixels: {
    x: number;
    y: number;
    width: number;
    height: number;
    display_name: string | null;
  } | null;
}

interface PurchaseHistoryProps {
  transactions: Transaction[];
}

export function PurchaseHistory({ transactions }: PurchaseHistoryProps) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No transactions yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Block</th>
            <th className="px-4 py-2 text-left font-medium">Amount</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border last:border-0">
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(tx.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {tx.pixels
                  ? `${tx.pixels.display_name || "Untitled"} (${tx.pixels.width}x${tx.pixels.height})`
                  : "—"}
              </td>
              <td className="px-4 py-2">
                ${(tx.amount / 100).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    tx.status === "succeeded"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
