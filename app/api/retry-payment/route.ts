import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required to retry payment." }, { status: 401 });
    }

    const { orderId, sessionUserId } = await request.json();
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "A valid order ID is required." }, { status: 400 });
    }
    if (sessionUserId && sessionUserId !== user.id) {
      console.error("RETRY_PAYMENT_SESSION_MISMATCH", { orderId, sessionUserId, authenticatedUserId: user.id });
      return NextResponse.json({ error: "Checkout session no longer matches the authenticated user." }, { status: 409 });
    }

    const admin = createAdminClient();
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (customerError || !customer) {
      console.error("RETRY_PAYMENT_CUSTOMER_LOOKUP_ERROR", customerError);
      return NextResponse.json({ error: "Customer profile could not be resolved." }, { status: 500 });
    }

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, order_number, total, status")
      .eq("id", orderId)
      .eq("customer_id", customer.id)
      .maybeSingle();

    if (orderError || !order) {
      console.error("RETRY_PAYMENT_ORDER_LOOKUP_ERROR", { orderId, orderError });
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.status !== "failed") {
      return NextResponse.json({ error: "Only failed orders can be retried." }, { status: 409 });
    }

    console.log("RETRY_PAYMENT_INITIALIZED", { orderId: order.id, razorpayOrderId: order.order_number, customerId: customer.id });
    return NextResponse.json({
      order_id: order.order_number,
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      user_id: user.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("RETRY_PAYMENT_ERROR", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
