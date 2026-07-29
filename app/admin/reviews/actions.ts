"use server";

import { updateReviewStatus, deleteReview } from "@/lib/data/reviews";
import { Review } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function approveReviewAction(id: string) {
  await updateReviewStatus(id, "approved");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}

export async function rejectReviewAction(id: string) {
  await updateReviewStatus(id, "rejected");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}
