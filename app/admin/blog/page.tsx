import { getBlogPosts } from "@/lib/data/blog";
import { BlogClient } from "./blog-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blog Management | The Comfortable Co.",
};

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return <BlogClient posts={posts} />;
}
