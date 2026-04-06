import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: pixels, error } = await supabase
    .from("pixels")
    .select("id, x, y, width, height, image_url, color, display_name, destination_url")
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pixels });
}
