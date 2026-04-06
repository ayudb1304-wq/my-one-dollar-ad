import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, {user.user_metadata?.name || user.email}. Your pixel blocks
        will appear here once you make a purchase.
      </p>
    </div>
  );
}
