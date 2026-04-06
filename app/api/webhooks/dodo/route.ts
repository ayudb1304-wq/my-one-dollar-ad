import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) {
    return NextResponse.json(
      { error: "Webhook key not configured" },
      { status: 500 },
    );
  }

  const headers = {
    "webhook-id": request.headers.get("webhook-id") || "",
    "webhook-signature": request.headers.get("webhook-signature") || "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
  };

  const rawBody = await request.text();

  // Verify webhook signature
  try {
    const webhook = new Webhook(webhookKey);
    await webhook.verify(rawBody, headers);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const supabase = await createClient();

  switch (payload.type) {
    case "payment.succeeded": {
      const paymentId = payload.data.payment_id;

      // Activate pixels
      await supabase
        .from("pixels")
        .update({ status: "active" })
        .eq("payment_id", paymentId);

      // Update transaction
      await supabase
        .from("transactions")
        .update({ status: "succeeded" })
        .eq("dodo_payment_id", paymentId);

      break;
    }

    case "payment.failed": {
      const paymentId = payload.data.payment_id;

      // Release reserved pixels
      await supabase.from("pixels").delete().eq("payment_id", paymentId);

      // Update transaction
      await supabase
        .from("transactions")
        .update({ status: "failed" })
        .eq("dodo_payment_id", paymentId);

      break;
    }

    case "refund.created": {
      const paymentId = payload.data.payment_id;

      // Deactivate pixels
      await supabase.from("pixels").delete().eq("payment_id", paymentId);

      // Update transaction
      await supabase
        .from("transactions")
        .update({ status: "refunded" })
        .eq("dodo_payment_id", paymentId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
