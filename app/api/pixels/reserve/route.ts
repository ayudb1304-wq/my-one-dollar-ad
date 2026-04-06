import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GRID_WIDTH, GRID_HEIGHT, MIN_BLOCK_SIZE } from "@/lib/constants";

export async function POST(request: Request) {
  const { x, y, width, height } = await request.json();

  if (
    x < 0 ||
    y < 0 ||
    width < MIN_BLOCK_SIZE ||
    height < MIN_BLOCK_SIZE ||
    x + width > GRID_WIDTH ||
    y + height > GRID_HEIGHT
  ) {
    return NextResponse.json(
      { error: "Invalid pixel selection" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  // Check for overlap
  const { data: existingPixels } = await supabase
    .from("pixels")
    .select("x, y, width, height")
    .in("status", ["pending", "active"]);

  const overlap = existingPixels?.some(
    (p) =>
      x < p.x + p.width &&
      x + width > p.x &&
      y < p.y + p.height &&
      y + height > p.y,
  );

  if (overlap) {
    return NextResponse.json(
      { error: "Selected area overlaps with existing pixels" },
      { status: 409 },
    );
  }

  // Create a temporary reservation (status: pending, no payment yet)
  const { data: reservation, error } = await supabase
    .from("pixels")
    .insert({
      x,
      y,
      width,
      height,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to reserve pixels" },
      { status: 500 },
    );
  }

  return NextResponse.json({ reservation_id: reservation.id });
}
