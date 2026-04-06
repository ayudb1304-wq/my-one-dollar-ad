import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDodo } from "@/lib/dodo";
import { GRID_WIDTH, GRID_HEIGHT, MIN_BLOCK_SIZE } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    x,
    y,
    width,
    height,
    display_name,
    destination_url,
    email,
    name,
    image_data_url,
    color,
    country,
  } = body;

  // Validate grid bounds
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

  // Validate required fields
  if (!display_name || !destination_url || !email || !name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  // Check for overlap with existing pixels (pending or active)
  const { data: conflicts } = await supabase.rpc("check_pixel_overlap", {
    sel_x: x,
    sel_y: y,
    sel_width: width,
    sel_height: height,
  });

  // If RPC doesn't exist yet, fall back to manual check
  if (conflicts === null) {
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
  } else if (conflicts && conflicts.length > 0) {
    return NextResponse.json(
      { error: "Selected area overlaps with existing pixels" },
      { status: 409 },
    );
  }

  // Upload image to Supabase Storage if provided
  let imageUrl: string | null = null;
  if (image_data_url) {
    const base64Data = image_data_url.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `pixels/${Date.now()}-${x}-${y}.png`;

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

    imageUrl = publicUrl;
  }

  const totalPixels = width * height;
  const amountInCents = totalPixels * 100; // $1 per pixel = 100 cents

  // Reserve pixels in DB
  const { data: pixel, error: pixelError } = await supabase
    .from("pixels")
    .insert({
      x,
      y,
      width,
      height,
      display_name,
      destination_url,
      image_url: imageUrl,
      color: color || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (pixelError) {
    return NextResponse.json(
      { error: "Failed to reserve pixels" },
      { status: 500 },
    );
  }

  // Create Dodo Payments checkout session
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://my-one-dollar-ad.vercel.app";
    const payment = await getDodo().payments.create({
      payment_link: true,
      return_url: `${appUrl}/purchase/success`,
      billing: {
        country: country || "US",
      },
      customer: {
        email,
        name,
      },
      product_cart: [
        {
          product_id: process.env.DODO_PIXEL_PRODUCT_ID || "pixel_block",
          quantity: totalPixels,
        },
      ],
      metadata: {
        pixel_id: pixel.id,
        pixel_x: String(x),
        pixel_y: String(y),
        pixel_width: String(width),
        pixel_height: String(height),
      },
    });

    // Store payment reference
    await supabase
      .from("pixels")
      .update({ payment_id: payment.payment_id })
      .eq("id", pixel.id);

    // Create transaction record
    await supabase.from("transactions").insert({
      pixel_id: pixel.id,
      amount: amountInCents,
      dodo_payment_id: payment.payment_id,
      status: "pending",
    });

    return NextResponse.json({ payment_url: payment.payment_link });
  } catch (err) {
    // Clean up reserved pixel on payment creation failure
    await supabase.from("pixels").delete().eq("id", pixel.id);

    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 },
    );
  }
}
