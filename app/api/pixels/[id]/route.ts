import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: pixel } = await supabase
    .from("pixels")
    .select("id, owner_id")
    .eq("id", id)
    .single();

  if (!pixel) {
    return NextResponse.json({ error: "Pixel not found" }, { status: 404 });
  }

  if (pixel.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, string | null> = {};

  if (body.display_name !== undefined) updates.display_name = body.display_name;
  if (body.destination_url !== undefined)
    updates.destination_url = body.destination_url;
  if (body.color !== undefined) updates.color = body.color;

  // Handle image upload
  if (body.image_data_url) {
    const base64Data = body.image_data_url.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `pixels/${Date.now()}-${id}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pixel-images")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("pixel-images").getPublicUrl(uploadData.path);

    updates.image_url = publicUrl;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("pixels")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
