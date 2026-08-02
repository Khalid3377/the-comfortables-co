import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

const razorpay =
  KEY_ID && KEY_SECRET
    ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
    : null;

type RazorpayNotes = Record<string, string | undefined>;

function parseOrderItems(raw: string | undefined): Json[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Json[]) : [];
  } catch (e) {
    console.error("Error parsing order items from notes:", e);
    return [];
  }
}

function parseShippingAddress(raw: string | undefined): Json | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Json;
  } catch (e) {
    console.error("Error parsing shipping address from notes:", e);
    return null;
  }
}

async function transitionOrderStatus(
  event: "payment.failed" | "refund.processed",
  paymentId: string | null,
  razorpayOrderId: string | null,
  targetStatus: "failed" | "refunded"
) {
  if (!paymentId && !razorpayOrderId) {
    console.error("ORDER_STATUS_EVENT_MISSING_IDENTIFIERS", { event, targetStatus });
    return { error: "Webhook event has no payment or Razorpay order identifier." };
  }

  const { data: result, error } = await createAdminClient().rpc(
    "transition_razorpay_order_status",
    {
      p_payment_id: paymentId,
      p_order_number: razorpayOrderId,
      p_target_status: targetStatus,
    }
  );

  if (error) {
    console.error("ORDER_STATUS_TRANSITION_ERROR", { event, paymentId, razorpayOrderId, error });
    return { error: "Unable to update order status." };
  }

  console.log("ORDER_STATUS_TRANSITION", {
    event,
    paymentId,
    razorpayOrderId,
    targetStatus,
    result,
  });
  return { error: null };
}

export async function POST(request: NextRequest) {
  console.log("WEBHOOK_RECEIVED: Event processing started");
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("WEBHOOK_SIGNATURE_FAILURE: Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature header." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not configured. Webhook verification will be bypassed in dev/test mode.");
    } else {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("WEBHOOK_SIGNATURE_FAILURE: Secrets do not match.");
        return NextResponse.json({ error: "Invalid signature verification." }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (process.env.RAZORPAY_WEBHOOK_DEBUG === "true") {
      const payment = payload?.payload?.payment?.entity;
      console.info("RAZORPAY_WEBHOOK_PAYLOAD_SHAPE", {
        event,
        topLevelKeys: Object.keys(payload ?? {}),
        paymentKeys: payment ? Object.keys(payment) : [],
        paymentId: payment?.id,
        razorpayOrderId: payment?.order_id,
        paymentNoteKeys: payment?.notes ? Object.keys(payment.notes) : [],
      });
    }

    console.log(`Razorpay Webhook Event Received: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
      if (!paymentEntity) {
        console.error("WEBHOOK_PAYLOAD_ERROR: Missing payment/order entity in payload");
        return NextResponse.json({ error: "Invalid event payload shape." }, { status: 400 });
      }
      const orderId = (paymentEntity.order_id || paymentEntity.id) as string;
      const amount = paymentEntity.amount / 100;
      const currency = paymentEntity.currency;
      const email = paymentEntity.email;
      const contact = paymentEntity.contact;

      const supabaseAdmin = createAdminClient();

      // Order metadata (items, address, auth user id) lives on the Razorpay ORDER, not the payment
      let notes: RazorpayNotes = paymentEntity.notes || {};
      if (orderId && razorpay) {
        try {
          const razorpayOrder = await razorpay.orders.fetch(orderId);
          notes = { ...notes, ...(razorpayOrder.notes as RazorpayNotes) };
        } catch (fetchErr) {
          console.error("Failed to fetch Razorpay order notes:", fetchErr);
        }
      }

      const authUserId = notes.user_id || null;
      const items = parseOrderItems(notes.items);
      const shippingAddress = parseShippingAddress(notes.shippingAddress);

      // Extract internal order reference from Razorpay notes or receipt if present
      const internalOrderNumber =
        (notes.order_number as string) ||
        (notes.internal_order_number as string) ||
        (notes.order_id as string) ||
        (notes.receipt as string) ||
        (paymentEntity.receipt as string) ||
        null;

      const targetOrderRef = internalOrderNumber || orderId;

      console.log("Payment Captured Successfully:", {
        orderId,
        internalOrderNumber,
        targetOrderRef,
        paymentId: paymentEntity.id,
        amount,
        currency,
        email,
        contact,
        authUserId,
        itemsCount: items.length,
      });

      // Resolve internal customers.id from Supabase auth_user_id
      let internalCustomerId: string | null = null;

      if (authUserId) {
        const { data: customerData, error: customerError } = await supabaseAdmin
          .from("customers")
          .select("id")
          .eq("auth_user_id", authUserId)
          .maybeSingle();

        if (customerData) {
          internalCustomerId = customerData.id;
        } else {
          console.warn(`Customer record not found for auth_user_id: ${authUserId}`, customerError);
        }
      }

      // A payment associated with an authenticated checkout must be linked to that
      // user's internal customer UUID. Do not create an unlinked fallback order.
      if (authUserId && !internalCustomerId) {
        console.error("CUSTOMER_RESOLUTION_FAILURE", { authUserId, paymentId: paymentEntity.id });
        return NextResponse.json({ error: "Customer record could not be resolved." }, { status: 500 });
      }

      if (!internalCustomerId) {
        console.error("ORDER_MISSING_CUSTOMER", { paymentId: paymentEntity.id });
        return NextResponse.json({ error: "Payment is missing its authenticated customer." }, { status: 400 });
      }

      // Attempt RPC finalization with target order reference (internal order_number or Razorpay order_id)
      const { data: recordedOrderId, error: recordError } = await supabaseAdmin.rpc(
        "finalize_razorpay_order",
        {
          p_order_number: targetOrderRef,
          p_items: items,
          p_payment_id: paymentEntity.id,
        }
      );

      if (recordError) {
        console.warn("ORDER_RPC_FINALIZATION_NOTICE:", recordError.message);
      } else {
        console.log("ORDER_TRANSACTION_RECORDED", {
          orderId: recordedOrderId,
          paymentId: paymentEntity.id,
          customerId: internalCustomerId,
          itemsCount: items.length,
        });
      }

      // Explicitly update order status to 'paid' in Supabase matching internal order_number, Razorpay order_id, or payment_id
      const filterConditions = [
        `order_number.eq.${targetOrderRef}`,
        `order_number.eq.${orderId}`,
        `payment_id.eq.${paymentEntity.id}`,
      ];
      if (internalOrderNumber) {
        filterConditions.unshift(`order_number.eq.${internalOrderNumber}`);
      }

      const { error: statusError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          payment_id: paymentEntity.id,
          payment_method: "razorpay",
        })
        .or(filterConditions.join(","));

      if (statusError) {
        console.error("ORDER_STATUS_UPDATE_ERROR", statusError);
      } else {
        console.log("ORDER_STATUS_UPDATED_TO_PAID", { targetOrderRef, paymentId: paymentEntity.id });
        revalidatePath("/account/orders");
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (event === "payment.failed") {
      const paymentEntity = payload?.payload?.payment?.entity;
      const transition = await transitionOrderStatus(
        "payment.failed",
        paymentEntity?.id ?? null,
        paymentEntity?.order_id ?? null,
        "failed"
      );

      if (transition.error) {
        return NextResponse.json({ error: transition.error }, { status: 500 });
      }
    }

    if (event === "refund.processed") {
      const paymentEntity = payload?.payload?.payment?.entity;
      const refundEntity = payload?.payload?.refund?.entity;
      const transition = await transitionOrderStatus(
        "refund.processed",
        refundEntity?.payment_id ?? paymentEntity?.id ?? null,
        refundEntity?.order_id ?? paymentEntity?.order_id ?? null,
        "refunded"
      );

      if (transition.error) {
        return NextResponse.json({ error: transition.error }, { status: 500 });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Razorpay webhook internal error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
