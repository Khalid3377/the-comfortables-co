import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data/blog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Journal", description: "Comfort, wellness, fabric, and sustainable fashion articles." };

export default async function JournalPage() {
  const articles = await getBlogPosts({ publishedOnly: true });

  return (
    <section className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Journal</p>
      <h1 className="mt-3 font-display text-6xl font-semibold">Better basics, better living.</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.slug} href={`/journal/${article.slug}`} className="group overflow-hidden rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h2 className="font-display text-3xl font-semibold">{article.title}</h2>
              <p className="mt-3 leading-7 text-brand-muted dark:text-white/70">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
