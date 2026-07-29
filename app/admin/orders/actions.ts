"use server";

import { updateOrderStatuses } from "@/lib/data/orders";
import { Order } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusesAction(
  id: string,
  updates: Partial<Pick<Order, "status" | "paymentStatus" | "fulfillmentStatus">>
) {
  await updateOrderStatuses(id, updates);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
