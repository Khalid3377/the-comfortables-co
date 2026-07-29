import { getDiscounts } from "@/lib/data/discounts";
import { DiscountsClient } from "./discounts-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Discounts & Promo Builder | The Comfortable Co.",
};

export default async function AdminDiscountsPage() {
  const discounts = await getDiscounts();
  return <DiscountsClient discounts={discounts} />;
}
