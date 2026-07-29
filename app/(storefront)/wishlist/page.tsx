import type { Metadata } from "next";
import { WishlistClient } from "./wishlist-client";
import { getProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const products = await getProducts({ publishedOnly: true });
  return <WishlistClient products={products} />;
}
