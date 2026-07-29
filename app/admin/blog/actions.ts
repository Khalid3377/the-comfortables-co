"use server";

import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/data/blog";
import { BlogPost } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveBlogPostAction(slug: string | null, data: Partial<BlogPost>) {
  if (slug) {
    await updateBlogPost(slug, data);
  } else {
    const fullPost: BlogPost = {
      slug: data.slug || "",
      title: data.title || "",
      excerpt: data.excerpt || "",
      content: data.content || "",
      image: data.image || "/images/journal/placeholder.jpg",
      published: data.published ?? true,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    await createBlogPost(fullPost);
  }
  revalidatePath("/admin/blog");
  revalidatePath("/journal");
}

export async function deleteBlogPostAction(slug: string) {
  await deleteBlogPost(slug);
  revalidatePath("/admin/blog");
  revalidatePath("/journal");
}
