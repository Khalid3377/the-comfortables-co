import { getOrders } from "@/lib/data/orders";
import { OrdersClient } from "./orders-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Orders Management | The Comfortable Co.",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersClient orders={orders} />;
}
