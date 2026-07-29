import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Server-side Razorpay credentials (never exposed to browser)
const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // ── 1. Verify Supabase session ────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required to place an order." },
        { status: 401 }
      );
    }

    // ── 2. Validate request body ──────────────────────────────────────────────
    const { amount, currency = "INR", items = [], shippingAddress = null, sessionUserId } = await request.json();

    if (sessionUserId && sessionUserId !== user.id) {
      console.error("CHECKOUT_SESSION_MISMATCH", { sessionUserId, authenticatedUserId: user.id });
      return NextResponse.json({ error: "Checkout session no longer matches the authenticated user." }, { status: 409 });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      );
    }

    // ── 3. Create Razorpay order ──────────────────────────────────────────────
    // Amounts are in the smallest currency unit (paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        user_email: user.email ?? "",
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    };

    const order = await razorpay.orders.create(options);

    // Persist a pending record before opening Checkout. This gives failed-payment
    // webhooks a durable order to transition, and the captured webhook promotes
    // the same Razorpay order number to paid in its atomic transaction.
    const admin = createAdminClient();
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (customerError || !customer) {
      console.error("PENDING_ORDER_CUSTOMER_RESOLUTION_ERROR", customerError);
      return NextResponse.json({ error: "Customer profile could not be resolved." }, { status: 500 });
    }

    const { error: pendingOrderError } = await admin.from("orders").insert({
      order_number: order.id,
      customer_id: customer.id,
      customer_email: user.email ?? null,
      status: "pending",
      items,
      subtotal: amount,
      discount: 0,
      total: amount,
      shipping_address: shippingAddress,
      payment_method: "razorpay",
    });

    if (pendingOrderError) {
      console.error("PENDING_ORDER_INSERT_ERROR", { razorpayOrderId: order.id, pendingOrderError });
      return NextResponse.json({ error: "Unable to initialize the order." }, { status: 500 });
    }

    // ── 4. Return order details including the authenticated user_id ───────────
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      user_id: user.id,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
