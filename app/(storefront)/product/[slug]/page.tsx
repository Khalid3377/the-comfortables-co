import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RotateCw } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CompleteTheSet } from "@/components/product/CompleteTheSet";
import { SizeRecommender } from "@/components/size-recommender";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { AddToCartPanel } from "./product-actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts({ publishedOnly: true });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [{ url: product.image }] }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getProducts({ publishedOnly: true });
  const related = allProducts.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <section className="container-page py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.description,
            offers: { "@type": "Offer", priceCurrency: "INR", price: product.price, availability: "https://schema.org/InStock" }
          })
        }}
      />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {product.gallery.map((image) => (
            <div key={image} className="relative aspect-[4/5] overflow-hidden rounded-brand bg-brand-sand/20">
              <Image src={image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
          <div className="grid aspect-[4/5] place-items-center rounded-brand border border-brand-border bg-white text-center dark:border-white/10 dark:bg-white/5">
            <RotateCw className="mx-auto text-brand-teal" />
            <p className="mt-4 font-display text-2xl font-semibold">360 viewer</p>
            <p className="mt-2 text-sm text-brand-muted dark:text-white/70">Interactive product spin placeholder</p>
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">{product.category}</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold">{formatCurrency(product.price)}</p>
          <p className="mt-5 text-lg leading-8 text-brand-muted dark:text-white/70">{product.description}</p>
          <CompleteTheSet products={allProducts} productId={product.slug} className="mt-8" />
          <p className="mt-5 rounded-brand bg-white p-4 text-sm dark:bg-white/5">
            <strong>Fabric composition:</strong> {product.material}
          </p>
          <div className="mt-5 grid gap-3">
            {Object.entries(product.scores).map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm capitalize">
                  <span>{label} score</span>
                  <span>{value}/100</span>
                </div>
                <div className="h-2 rounded-full bg-brand-border">
                  <div className="h-2 rounded-full bg-brand-teal" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <AddToCartPanel product={product} />
        </div>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <SizeRecommender />
        <section className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-display text-3xl font-semibold">Customer reviews</h2>
          <div className="mt-5 grid gap-4">
            {product.reviews.map((review) => (
              <div key={review.name} className="rounded-brand bg-brand-paper p-4 dark:bg-white/10">
                <p className="font-semibold">{review.name} · {review.rating}/5</p>
                <p className="mt-2 text-sm text-brand-muted dark:text-white/70">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 font-display text-4xl font-semibold">Related products</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => <ProductCard key={item.slug} product={item} />)}
        </div>
      </section>
    </section>
  );
}
