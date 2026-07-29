"use server";

import { getProducts } from "@/lib/data/products";
import { Product } from "@/lib/types";

export async function fetchPublishedProducts(): Promise<Product[]> {
  try {
    const products = await getProducts({ publishedOnly: true });
    return products;
  } catch (error) {
    console.error("Error fetching published products:", error);
    return [];
  }
}
