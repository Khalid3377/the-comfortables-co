import { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import CategoryPageClient from "@/components/category/CategoryPageClient";
import { Leaf, Heart, Wind, Shield, Cloud, Zap, Repeat, HelpCircle, Ruler, MessageCircle, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Baby & Kids Collection | The Comfortables Co.",
  description: "Browse organic Cotton × Bamboo blend baby clothing, newborn onesies, bodysuits, and kids sets made hypoallergenic for delicate skin."
};

export default async function BabyKidsPage() {
  const products = await getProducts({ publishedOnly: true, category: "Baby & Kids" });

  const heroConfig = {
    title: "Baby & Kids",
    subtitle: "Softness that hugs, comfort that stays. Thoughtfully made for your little one's delicate skin.",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    badges: [
      { iconName: "Leaf", label: "100% Natural Fabrics", sublabel: "Pure & Safe" },
      { iconName: "Heart", label: "Gentle on Sensitive Skin", sublabel: "Hypoallergenic" },
      { iconName: "Wind", label: "Breathable All Day", sublabel: "Stays Fresh" },
      { iconName: "Shield", label: "Safe & Non-Toxic", sublabel: "No Harmful Chemicals" }
    ]
  };

  // 1. Circle subcategories for baby collection
  const customSubcategories = [
    { name: "Baby Boy", slug: "baby-boy", sublabel: "0-24M", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=100&q=80" },
    { name: "Baby Girl", slug: "baby-girl", sublabel: "0-24M", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=100&q=80" },
    { name: "Unisex", slug: "unisex", sublabel: "0-24M", image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=100&q=80" },
    { name: "Newborn", slug: "newborn", sublabel: "0-6M", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
    { name: "Toddlers", slug: "toddlers", sublabel: "1-4Y", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=100&q=80" },
    { name: "Kids", slug: "kids", sublabel: "4-10Y", image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=100&q=80" }
  ];

  // 2. Trust banner placed right in middle of page
  const midContent = (
    <div className="w-full bg-white border border-[#EAEAEA] rounded-2xl p-8 my-10 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
      <div className="max-w-xs">
        <h3 className="font-display text-[22px] font-bold text-[#2B2B2B]">
          Why Parents Love Comfortables Co.
        </h3>
        <Link
          href="/about"
          className="inline-block mt-4 text-[13px] font-bold text-[#2E6F68] border-[1.5px] border-[#2E6F68] hover:bg-[#2E6F68] hover:text-white px-5 py-2 rounded-lg transition-colors"
        >
          KNOW MORE →
        </Link>
      </div>

      <div className="flex-grow grid grid-cols-2 sm:grid-cols-5 gap-6 w-full lg:w-auto">
        {[
          { icon: Cloud, label: "Ultra Soft", sub: "Feels like a hug" },
          { icon: Shield, label: "Safe & Non-Toxic", sub: "No chemicals" },
          { icon: Wind, label: "Breathable", sub: "Keeps them comfy" },
          { icon: Zap, label: "Durable", sub: "Made to last" },
          { icon: Repeat, label: "Easy Care", sub: "Wash & wear" }
        ].map((item, idx) => {
          const IconC = item.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <IconC size={28} className="text-[#2E6F68] mb-2" />
              <span className="block text-[13px] font-bold text-[#2B2B2B]">{item.label}</span>
              <span className="block text-[11px] text-[#6E6E6E] mt-0.5">{item.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 3. Baby specific trust strip
  const trustStripItems = [
    { iconName: "Leaf", label: "Ultra Soft", sublabel: "Feels like a hug" },
    { iconName: "Shield", label: "Safe & Non-Toxic", sublabel: "No harmful chemicals" },
    { iconName: "Wind", label: "Breathable", sublabel: "Keeps them comfy" },
    { iconName: "Zap", label: "Durable", sublabel: "Made to last" },
    { iconName: "Repeat", label: "Easy Care", sublabel: "Wash, Wear, Repeat" }
  ];

  // 4. Sustainability & Help section at bottom
  const bottomContent = (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left card */}
        <div className="bg-[#F0F7F5] border border-[#E1EFEA] rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-[24px] font-bold text-[#2B2B2B] leading-tight">
              Made with care.<br />For little ones.<br />For a better planet.
            </h3>
            <p className="text-[14px] text-[#6E6E6E] mt-4 leading-relaxed">
              Our baby & kids collection is crafted using sustainable fabrics and ethical practices to ensure a safe, comfortable and better tomorrow for your little world.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/sustainability"
              className="inline-block px-5 py-2.5 bg-[#2E6F68] hover:bg-[#204e49] text-white text-[13px] font-bold rounded-lg transition-colors"
            >
              OUR SUSTAINABILITY →
            </Link>
          </div>
        </div>

        {/* Right card */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-[22px] font-bold text-[#2B2B2B]">
              Need Help Choosing?
            </h3>
            <p className="text-[14px] text-[#6E6E6E] mt-1">We're here for you!</p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {[
              { icon: Ruler, label: "Size Guide", sub: "Find your perfect fit", href: "/size-guide" },
              { icon: MessageCircle, label: "Chat with Us", sub: "We're online to assist", href: "/chat" },
              { icon: Phone, label: "WhatsApp Chat", sub: "+91 12345 67890", href: "https://wa.me/911234567890" }
            ].map((option, idx) => {
              const IconComp = option.icon;
              return (
                <a
                  key={idx}
                  href={option.href}
                  target={option.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-[#EAEAEA] hover:bg-[#FAFAF7] transition-all group"
                >
                  <div className="flex gap-3.5 items-center">
                    <div className="p-2.5 rounded-lg bg-[#2E6F68]/10 text-[#2E6F68]">
                      <IconComp size={16} />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-[#2B2B2B]">{option.label}</span>
                      <span className="block text-[11px] text-[#6E6E6E] mt-0.5">{option.sub}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#6E6E6E] group-hover:translate-x-1 transition-transform" />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );

  return (
    <CategoryPageClient
      initialProducts={products}
      heroConfig={heroConfig}
      type="baby-kids"
      customSubcategories={customSubcategories}
      trustStripItems={trustStripItems}
      midContent={midContent}
      bottomContent={bottomContent}
    />
  );
}
