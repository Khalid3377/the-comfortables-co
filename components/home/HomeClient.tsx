"use client";

import { useState, useEffect } from "react";
import SafeImage from "@/components/ui/safe-image";
import Link from "next/link";
import { Check, Leaf, ShieldCheck, Sparkles, Wind, type LucideIcon, Cloud, Globe, Heart, Users, Star, Package, Shield, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Product, Category, SiteSetting, BlogPost } from "@/lib/types";
import { motion } from "framer-motion";

// Helper components

// Counter component using RequestAnimationFrame for smooth transitions
const Counter = ({ target, duration = 1500, suffix = "", decimals = 0 }: { target: number; duration?: number; suffix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(progress * target);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, target, duration]);

  return (
    <span ref={setElement}>
      {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  );
};

// Section Reveal animation helper
const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

interface HomeClientProps {
  products: Product[];
  articles: BlogPost[];
  categories: Category[];
  settings: SiteSetting;
  hero: { heading: string; subheading: string; ctaText: string };
}

export function HomeClient({ products, articles, categories, settings, hero }: HomeClientProps) {
  // Category Carousel State
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollLeft / (target.clientWidth * 0.7));
    setActiveCategoryIndex(Math.min(Math.max(index, 0), 4));
  };

  // Categories Mapping Fallback
  const fallbackCategories = [
    { slug: "everyday-wear", name: "Everyday Wear", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" },
    { slug: "loungewear", name: "Loungewear", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
    { slug: "maternity", name: "Maternity", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80" },
    { slug: "baby-kids", name: "Baby & Kids", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80" },
    { slug: "accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80" }
  ];

  const categoryMetadata: Record<string, { subtitle: string; href: string }> = {
    "Everyday Wear": { subtitle: "For Him & Her", href: "/men" },
    "Loungewear": { subtitle: "Relax in Comfort", href: "/loungewear" },
    "Maternity": { subtitle: "For Every Stage", href: "/maternity" },
    "Baby & Kids": { subtitle: "Softest Touch", href: "/baby-kids" },
    "Accessories": { subtitle: "Little Things", href: "/new-in" }
  };

  const finalCategories = fallbackCategories.map(fallback => {
    const dbCat = categories.find(c => c.name.toLowerCase().includes(fallback.name.toLowerCase()) || fallback.name.toLowerCase().includes(c.name.toLowerCase()));
    return {
      slug: dbCat?.slug || fallback.slug,
      name: dbCat?.name || fallback.name,
      image: dbCat?.image || fallback.image,
      subtitle: categoryMetadata[fallback.name]?.subtitle || "Shop Collection",
      href: categoryMetadata[fallback.name]?.href || "/shop"
    };
  });

  // Science Score Bars
  const scienceBars = [
    { label: "Breathability", score: 9.6, percentage: 96 },
    { label: "Softness", score: 9.8, percentage: 98 },
    { label: "Moisture Wicking", score: 9.4, percentage: 94 },
    { label: "Sustainability", score: 9.7, percentage: 97 }
  ];

  // Bestsellers products
  const bestsellerProducts = products.filter(p => p.published).slice(0, 5);

  // Comfort Promise fallbacks
  const promiseDefaults = [
    { Icon: Sparkles, title: "100% Thoughtfully Designed", text: "Every detail considered for your comfort and wellbeing." },
    { Icon: Leaf, title: "Cotton × Bamboo Innovation", text: "Nature's finest fibers engineered for modern comfort." },
    { Icon: Shield, title: "Skin-Friendly Materials", text: "Hypoallergenic, OEKO-TEX certified, safe for all skin types." },
    { Icon: Heart, title: "Comfort-First Philosophy", text: "We never compromise comfort for anything else." }
  ];

  const comfortPromises = settings?.comfortPromise && settings.comfortPromise.length === 4
    ? settings.comfortPromise.map((item, idx) => ({ ...item, Icon: promiseDefaults[idx].Icon }))
    : promiseDefaults;

  // Testimonials
  const testimonials = [
    {
      stars: 5,
      quote: "I've never worn anything so soft in my life. The maternity collection got me through my entire pregnancy comfortably.",
      author: "Priya S.",
      location: "Mumbai",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    },
    {
      stars: 5,
      quote: "The loungewear set is my daily uniform now. Cotton × Bamboo is genuinely different — you feel it immediately.",
      author: "Rahul M.",
      location: "Bangalore",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    {
      stars: 5,
      quote: "Bought the baby collection for my newborn. Zero irritation, incredibly soft. Will never buy anything else.",
      author: "Anita K.",
      location: "Delhi",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
    }
  ];

  return (
    <>
      {/* HOMEPAGE HERO SECTION */}
      <section className="relative flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden bg-[#FAFAF7]">
        {/* LEFT COLUMN (60% width, background #FAFAF7, padding 80px) */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-[60%] bg-[#FAFAF7] px-8 py-16 md:p-20 flex flex-col justify-center order-2 md:order-1 text-[#2B2B2B]"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.0, duration: 0.8, ease: "easeOut" }}
            className="text-[11px] tracking-[3px] text-[#2E6F68] uppercase font-semibold mb-6"
          >
            COMFORT THAT CARES
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
            className="font-display text-[32px] sm:text-[40px] md:text-[64px] font-bold text-[#2B2B2B] leading-[1.1]"
          >
            {hero.heading}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="hidden"
          >
            Premium Cotton × Bamboo apparel crafted for breathable comfort, sensitive skin and a better tomorrow.
          </motion.p>

          <motion.p
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-[16px] text-[#6E6E6E] max-w-[400px] leading-[1.6] mt-5"
          >
            {hero.subheading}
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row gap-4 w-full"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto text-center px-8 py-4 bg-[#2B2B2B] text-white text-[0px] tracking-[1px] font-semibold rounded-lg hover:bg-[#2E6F68] transition-colors duration-300"
            >
              <span className="text-[13px]">{hero.ctaText}</span>
              SHOP COLLECTION →
            </Link>
            <Link
              href="/fabric-innovation"
              className="w-full sm:w-auto text-center px-8 py-4 border-[1.5px] border-[#2B2B2B] text-[#2B2B2B] hover:text-[#2E6F68] hover:border-[#2E6F68] text-[13px] tracking-[1px] font-semibold rounded-lg bg-transparent transition-colors duration-300"
            >
              DISCOVER THE FABRIC
            </Link>
          </motion.div>

          {/* Feature Badges Row */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="mt-10 flex flex-wrap gap-6 sm:gap-8"
          >
            <div className="flex flex-col gap-1 min-w-[120px]">
              <Leaf size={20} className="text-[#2E6F68] mb-1" />
              <span className="text-[13px] font-semibold text-[#2B2B2B]">Skin Friendly</span>
              <span className="text-[11px] text-[#6E6E6E]">Hypoallergenic</span>
            </div>

            <div className="flex flex-col gap-1 min-w-[120px]">
              <Wind size={20} className="text-[#2E6F68] mb-1" />
              <span className="text-[13px] font-semibold text-[#2B2B2B]">Breathable</span>
              <span className="text-[11px] text-[#6E6E6E]">All Day Comfort</span>
            </div>

            <div className="flex flex-col gap-1 min-w-[120px]">
              <Globe size={20} className="text-[#2E6F68] mb-1" />
              <span className="text-[13px] font-semibold text-[#2B2B2B]">Sustainable</span>
              <span className="text-[11px] text-[#6E6E6E]">Better for Earth</span>
            </div>

            <div className="flex flex-col gap-1 min-w-[120px]">
              <Cloud size={20} className="text-[#2E6F68] mb-1" />
              <span className="text-[13px] font-semibold text-[#2B2B2B]">Ultra Soft</span>
              <span className="text-[11px] text-[#6E6E6E]">Feels Natural</span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN (40% width, position relative, overflow hidden) */}
        <div className="w-full md:w-[40%] relative overflow-hidden h-[50vh] md:h-auto order-1 md:order-2 bg-neutral-100">
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-full min-h-[50vh] md:min-h-screen"
          >
            <SafeImage
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
              alt="Sustainable comfort apparel lifestyle"
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* FLOATING STATS CARD */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-10 right-6 z-10 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -8] }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 3,
                ease: "easeInOut"
              }}
              className="bg-white/88 backdrop-blur-[12px] border border-white/60 rounded-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-[180px] flex flex-col gap-4 text-[#2B2B2B]"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Cloud size={18} className="text-[#2E6F68]" />
                  <span className="text-[14px] font-bold">100%</span>
                </div>
                <span className="text-[12px] text-[#6E6E6E]">Natural Fibers</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Leaf size={18} className="text-[#2E6F68]" />
                  <span className="text-[14px] font-bold">0%</span>
                </div>
                <span className="text-[12px] text-[#6E6E6E]">Harmful Chemicals</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Heart size={18} className="text-[#2E6F68]" />
                  <span className="text-[14px] font-bold">365</span>
                </div>
                <span className="text-[12px] text-[#6E6E6E]">Days of Comfort</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1 — SHOP BY CATEGORY */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-[#FAFAF7] py-20 border-b border-[#EAEAEA]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#2E6F68] tracking-[3px] uppercase font-semibold">
              COLLECTIONS
            </span>
            <h2 className="font-display text-[42px] font-bold text-[#2B2B2B] mt-2">
              Shop by Category.
            </h2>
            <p className="text-[16px] text-[#6E6E6E] mt-2">
              Thoughtfully designed for every you.
            </p>
          </div>

          {/* Cards Row */}
          <div
            onScroll={handleCategoryScroll}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-5 md:overflow-visible"
          >
            {finalCategories.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[70vw] snap-start md:min-w-0 flex flex-col group cursor-pointer"
              >
                <Link href={cat.href} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                  {/* Image */}
                  <SafeImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 70vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-start z-10">
                    <span className="font-display text-[18px] font-bold text-white leading-tight">
                      {cat.name}
                    </span>
                    <span className="text-[12px] text-white/80 mt-0.5">
                      {cat.subtitle}
                    </span>
                    
                    {/* Circle Arrow */}
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#2B2B2B] group-hover:bg-[#2E6F68] group-hover:text-white transition-colors duration-300 mt-3">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Dots Indicator (Mobile only) */}
          <div className="flex items-center justify-center gap-2 mt-6 md:hidden">
            {finalCategories.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  activeCategoryIndex === idx ? "bg-[#2E6F68]" : "bg-[#EAEAEA]"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 — SCIENCE OF COTTON × BAMBOO */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-[#F0F0EB] py-20 border-b border-[#EAEAEA]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            
            {/* LEFT COLUMN */}
            <div className="w-full md:w-1/2 md:pr-10 order-2 md:order-1 text-[#2B2B2B]">
              <span className="text-[11px] text-[#2E6F68] tracking-[3px] uppercase font-semibold">
                OUR INNOVATION
              </span>
              <h2 className="font-display text-[42px] font-bold mt-2 leading-[1.2]">
                The Science of Cotton × Bamboo
              </h2>
              <p className="text-[16px] text-[#6E6E6E] leading-[1.7] mt-4 max-w-[440px]">
                We blend the best of nature and technology to create fabrics that feel better, perform better and do better. Every thread is chosen with intention.
              </p>
              
              <Link
                href="/fabric-innovation"
                className="inline-block mt-8 text-[13px] tracking-[1px] font-semibold border-[1.5px] border-[#2E6F68] text-[#2E6F68] hover:bg-[#2E6F68] hover:text-white px-6 py-3 rounded-lg bg-transparent transition-all duration-300"
              >
                EXPLORE FABRIC TECHNOLOGY →
              </Link>

              {/* Composition Badges */}
              <div className="flex flex-col sm:flex-row gap-6 mt-10 w-full">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-black/10 shrink-0">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&q=80"
                      alt="70% Cotton texture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-bold text-[#2B2B2B]">70% Cotton</h4>
                    <span className="text-[12px] text-[#6E6E6E]">Strength & Durability</span>
                    <div className="h-[2px] bg-[#EAEAEA] w-full mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2E6F68] w-[70%]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-black/10 shrink-0">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&q=80"
                      alt="30% Bamboo texture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-bold text-[#2B2B2B]">30% Bamboo</h4>
                    <span className="text-[12px] text-[#6E6E6E]">Softness & Breathability</span>
                    <div className="h-[2px] bg-[#EAEAEA] w-full mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2E6F68] w-[30%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-1/2 order-1 md:order-2">
              {/* Score Bars */}
              <div className="flex flex-col gap-5">
                {scienceBars.map((bar, index) => (
                  <div key={bar.label} className="w-full">
                    <div className="flex justify-between items-baseline mb-1 text-[14px]">
                      <span className="font-semibold text-[#2B2B2B]">{bar.label}</span>
                      <span className="font-bold text-[#2E6F68]">{bar.score}/10</span>
                    </div>
                    
                    <div className="h-[6px] bg-[#EAEAEA] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.15 }}
                        className="h-full bg-[#2E6F68] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Large Fabric Image */}
              <div className="relative w-full h-[280px] rounded-2xl overflow-hidden mt-8 shadow-sm">
                <SafeImage
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                  alt="Premium fabric detail weave"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* SECTION 3 — BESTSELLERS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-[#FAFAF7] py-20 border-b border-[#EAEAEA]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[11px] text-[#2E6F68] tracking-[2px] uppercase font-semibold">
                FEELS GOOD. LOOKS BETTER.
              </span>
              <h2 className="font-display text-[42px] font-bold text-[#2B2B2B] mt-2">
                Our Bestsellers
              </h2>
            </div>
            <Link
              href="/new-in"
              className="text-[14px] font-semibold text-[#2B2B2B] hover:text-[#2E6F68] transition-colors tracking-wide shrink-0"
            >
              VIEW ALL →
            </Link>
          </div>

          {/* Product Grid */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-5 md:overflow-visible">
            {bestsellerProducts.map((product) => (
              <div key={product.slug} className="min-w-[70vw] snap-start md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 — TRUST STATS STRIP */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-[#2B2B2B] py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:flex md:flex-row md:justify-around md:align-center md:gap-y-0">
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center flex-1">
              <Users size={32} className="text-[#2E6F68] mb-3" />
              <span className="font-display text-[36px] font-bold text-white">
                <Counter target={10000} suffix="+" />
              </span>
              <span className="text-[14px] text-[#C9B79C] font-semibold mt-1">Happy Customers</span>
              <span className="text-[12px] text-[#6E6E6E] mt-0.5">Growing stronger every day</span>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-white/10 h-[60px]" />

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center flex-1">
              <Star size={32} className="text-[#2E6F68] mb-3" />
              <span className="font-display text-[36px] font-bold text-white">
                <Counter target={4.8} decimals={1} suffix="/5" />
              </span>
              <span className="text-[14px] text-[#C9B79C] font-semibold mt-1">Average Rating</span>
              <span className="text-[12px] text-[#6E6E6E] mt-0.5">From thousands of reviews</span>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-white/10 h-[60px]" />

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center flex-1">
              <Package size={32} className="text-[#2E6F68] mb-3" />
              <span className="font-display text-[36px] font-bold text-white">
                <Counter target={50000} suffix="+" />
              </span>
              <span className="text-[14px] text-[#C9B79C] font-semibold mt-1">Products Delivered</span>
              <span className="text-[12px] text-[#6E6E6E] mt-0.5">And counting</span>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-white/10 h-[60px]" />

            {/* Stat 4 */}
            <div className="flex flex-col items-center text-center flex-1">
              <Leaf size={32} className="text-[#2E6F68] mb-3" />
              <span className="font-display text-[36px] font-bold text-white">
                <Counter target={1200} suffix="+" />
              </span>
              <span className="text-[14px] text-[#C9B79C] font-semibold mt-1">Trees Planted</span>
              <span className="text-[12px] text-[#6E6E6E] mt-0.5">Through our partnerships</span>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-white/10 h-[60px]" />

            {/* Stat 5 */}
            <div className="flex flex-col items-center text-center flex-1 col-span-2 md:col-span-1">
              <Heart size={32} className="text-[#2E6F68] mb-3" />
              <span className="font-display text-[36px] font-bold text-white">
                <Counter target={200} suffix="+" />
              </span>
              <span className="text-[14px] text-[#C9B79C] font-semibold mt-1">Partner Artisans</span>
              <span className="text-[12px] text-[#6E6E6E] mt-0.5">Across India</span>
            </div>

          </div>
        </div>
      </motion.section>

      {/* SECTION 5 — COMFORT PROMISE */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-white py-20 border-b border-[#EAEAEA]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#2E6F68] tracking-[3px] uppercase font-semibold">
              OUR PROMISE
            </span>
            <h2 className="font-display text-[42px] font-bold text-[#2B2B2B] mt-2">
              The Comfort Promise
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {comfortPromises.map((promise, index) => {
              const Icon = promise.Icon;
              return (
                <div
                  key={promise.title}
                  className="flex flex-col items-center text-center bg-white border border-[#EAEAEA] rounded-2xl p-8 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <Icon size={32} className="text-[#2E6F68] mb-6" />
                  <h3 className="font-display text-[18px] font-bold text-[#2B2B2B] leading-snug">
                    {promise.title}
                  </h3>
                  <p className="text-[14px] text-[#6E6E6E] mt-3">
                    {promise.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* SECTION 6 — TESTIMONIALS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-[#FAFAF7] py-20 border-b border-[#EAEAEA]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#2E6F68] tracking-[3px] uppercase font-semibold">
              WHAT PEOPLE SAY
            </span>
            <h2 className="font-display text-[42px] font-bold italic text-[#2B2B2B] mt-2">
              Real people. Real comfort.
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 md:overflow-visible">
            {testimonials.map((test) => (
              <div
                key={test.author}
                className="min-w-[70vw] snap-start md:min-w-0 flex flex-col justify-between bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: test.stars }).map((_, i) => (
                      <span key={i} className="text-[#F59E0B] text-[16px]">★</span>
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-[16px] text-[#2B2B2B] leading-[1.7] italic mt-6 relative">
                    <span className="absolute -top-6 -left-3 text-[#C9B79C]/30 text-[48px] font-serif leading-none select-none">“</span>
                    {test.quote}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mt-8">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-black/10 shrink-0">
                    <SafeImage
                      src={test.photo}
                      alt={test.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="block text-[14px] font-semibold text-[#2B2B2B]">
                      {test.author}
                    </span>
                    <span className="block text-[12px] text-[#6E6E6E]">
                      {test.location} · Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 7 — NEWSLETTER */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="w-full bg-[#2E6F68] py-20 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center justify-between">
            
            {/* LEFT COLUMN */}
            <div className="flex-1">
              <span className="text-[11px] text-white/70 tracking-[3px] uppercase font-semibold">
                COMFORT FIRST
              </span>
              <h2 className="font-display text-[42px] font-bold text-white mt-2 leading-[1.1]">
                Soft launches, fabric notes, private offers.
              </h2>
              <p className="text-[16px] text-white/80 mt-4 max-w-[440px]">
                Join the community. Be the first to know.
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="h-[52px] flex-grow rounded-lg bg-white/15 border border-white/35 text-white placeholder:text-white/60 px-5 outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="h-[52px] bg-white text-[#2E6F68] hover:bg-[#FAFAF7] font-bold rounded-lg px-8 transition-colors shrink-0 uppercase tracking-wider text-[13px]"
                >
                  SUBSCRIBE
                </button>
              </form>
              <span className="text-[12px] text-white/60 mt-3 flex items-center gap-1.5">
                🔒 No spam, ever. Unsubscribe anytime.
              </span>
            </div>

          </div>
        </div>
      </motion.section>
    </>
  );
}
