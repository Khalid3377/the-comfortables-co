import type { Metadata } from "next";
import { CartClient } from "./cart-client";
import { getProducts } from "@/lib/data/products";
import { getCartItems } from "@/lib/actions/cart";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const products = await getProducts({ publishedOnly: true });
  const dbItemsRaw = await getCartItems();
  
  const dbCartItems = dbItemsRaw.map((row: any) => ({
    id: row.id,
    slug: row.products.slug,
    quantity: row.quantity,
    size: row.size,
    color: row.color,
  }));

  return <CartClient products={products} initialDbCart={dbCartItems.length > 0 ? dbCartItems : undefined} />;
}
