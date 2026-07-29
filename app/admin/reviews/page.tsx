import { getReviews } from "@/lib/data/reviews";
import { ReviewsClient } from "./reviews-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reviews Moderation | The Comfortable Co.",
};

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return <ReviewsClient reviews={reviews} />;
}
