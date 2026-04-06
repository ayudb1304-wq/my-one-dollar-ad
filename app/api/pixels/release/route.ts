import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { reservation_id } = await request.json();

  if (!reservation_id) {
    return NextResponse.json({ error: "Missing reservation_id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Only delete if still pending (not yet paid)
  await supabase
    .from("pixels")
    .delete()
    .eq("id", reservation_id)
    .eq("status", "pending")
    .is("payment_id", null);

  return NextResponse.json({ success: true });
}
