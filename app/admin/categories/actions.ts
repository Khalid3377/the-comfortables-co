"use server";

import { createCategory, updateCategory, deleteCategory } from "@/lib/data/categories";
import { Category } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveCategoryAction(slug: string | null, data: Partial<Category>) {
  if (slug) {
    await updateCategory(slug, data);
  } else {
    const fullCategory: Category = {
      slug: data.slug || "",
      name: data.name || "",
      description: data.description || "",
      image: data.image || "/images/categories/placeholder.jpg",
    };
    await createCategory(fullCategory);
  }
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteCategoryAction(slug: string) {
  await deleteCategory(slug);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}
