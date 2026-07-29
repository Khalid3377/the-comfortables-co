import type { Metadata } from "next";
import CheckoutClient from "./checkout-client";
import { getProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const products = await getProducts({ publishedOnly: true });
  const userData = await getCurrentUser();

  if (!userData) {
    redirect("/auth/login?next=/checkout");
  }

  return <CheckoutClient products={products} user={userData.user} customer={userData.customer as any} />;
}
