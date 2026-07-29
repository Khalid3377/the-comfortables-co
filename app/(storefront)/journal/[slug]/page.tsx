import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getBlogPosts({ publishedOnly: true });
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);
  if (!article) notFound();

  return (
    <article className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Journal</p>
      <h1 className="mt-3 max-w-4xl font-display text-6xl font-semibold">{article.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted dark:text-white/70">{article.excerpt}</p>
      <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-brand">
        <Image src={article.image} alt={article.title} fill className="object-cover" priority />
      </div>
      <div className="prose prose-lg mt-10 max-w-3xl dark:prose-invert">
        {article.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
