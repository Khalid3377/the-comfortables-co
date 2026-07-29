"use server";

import { createDiscount, updateDiscount, deleteDiscount } from "@/lib/data/discounts";
import { DiscountCode } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveDiscountAction(code: string | null, data: Partial<DiscountCode>) {
  if (code) {
    await updateDiscount(code, data);
  } else {
    const fullDiscount: DiscountCode = {
      code: data.code || "",
      type: data.type || "percentage",
      value: data.value || 0,
      usageLimit: 0,
      usageCount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      active: data.active ?? true,
    };
    await createDiscount(fullDiscount);
  }
  revalidatePath("/admin/discounts");
}

export async function toggleDiscountAction(code: string, currentActive: boolean) {
  await updateDiscount(code, { active: !currentActive });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscountAction(code: string) {
  await deleteDiscount(code);
  revalidatePath("/admin/discounts");
}
