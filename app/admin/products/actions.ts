"use server";

import { getProducts, updateProduct, createProduct, deleteProduct } from "@/lib/data/products";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

const storeFrontPaths = ["/", "/shop", "/new-in", "/men", "/women", "/maternity", "/baby-kids", "/loungewear"];

function revalidateStorefront() {
  for (const path of storeFrontPaths) {
    revalidatePath(path);
  }
  // Also revalidate via the route group so Next.js picks up the (storefront) layout
  revalidatePath("/(storefront)/new-in", "page");
  revalidatePath("/(storefront)/men", "page");
  revalidatePath("/(storefront)/women", "page");
  revalidatePath("/(storefront)/maternity", "page");
  revalidatePath("/(storefront)/baby-kids", "page");
  revalidatePath("/(storefront)/loungewear", "page");
  revalidatePath("/(storefront)/shop", "page");
}

export async function togglePublishAction(slug: string, currentStatus: boolean) {
  await updateProduct(slug, { published: !currentStatus });
  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function updateStockAction(slug: string, size: string, quantity: number) {
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error("Product not found");

  const newStock = { ...product.stockBySize, [size]: Math.max(0, quantity) };
  await updateProduct(slug, { stockBySize: newStock });
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
}

export async function saveProductAction(slug: string | null, data: Partial<Product>) {
  if (slug) {
    await updateProduct(slug, data);
  } else {
    const fullProduct: Product = {
      slug: data.slug || "",
      name: data.name || "",
      category: data.category || "",
      collection: "Core Collection",
      price: data.price || 0,
      colors: data.colors || [],
      sizes: data.sizes || [],
      material: "Organic Cotton Blend",
      image: data.image || "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85",
      gallery: data.gallery && data.gallery.length > 0 ? data.gallery : [],
      description: data.description || "",
      inventory: Object.values(data.stockBySize || {}).reduce((a: number, b) => a + (b as number), 0),
      stockBySize: data.stockBySize || {},
      scores: { comfort: 5, breathability: 5, softness: 5 },
      reviews: [],
      published: data.published ?? true,
    };
    await createProduct(fullProduct);
  }
  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function deleteProductAction(slug: string) {
  await deleteProduct(slug);
  revalidatePath("/admin/products");
  revalidateStorefront();
}
