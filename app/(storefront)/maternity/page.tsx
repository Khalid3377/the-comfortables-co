import { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import CategoryPageClient from "@/components/category/CategoryPageClient";
import MaternityBottomContent from "@/components/category/MaternityBottomContent";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Maternity Collection | The Comfortables Co.",
  description: "Explore our premium Cotton × Bamboo blend maternity wear designed to stretch and grow with you through pregnancy and postpartum nursing."
};

export default async function MaternityPage() {
  const products = await getProducts({ publishedOnly: true, category: "Maternity" });

  const heroConfig = {
    title: "Maternity",
    subtitle: "Thoughtfully designed maternity wear that grows with you and keeps you comfortable, always.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80",
    badges: [
      { iconName: "Leaf", label: "Soft on You & Your Baby", sublabel: "Gentle Always" },
      { iconName: "Zap", label: "Stretchable", sublabel: "For Every Stage" },
      { iconName: "Shield", label: "Safe & Non-Toxic", sublabel: "Certified Materials" },
      { iconName: "Wind", label: "Breathable", sublabel: "All Day" }
    ]
  };

  // 1. Hero Floating Card
  const heroFloatingCard = (
    <div className="absolute top-8 right-4 md:right-8 z-10 hidden md:block bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-[220px]">
      <h4 className="font-display text-[15px] font-bold text-[#2B2B2B] leading-tight">
        Made for Comfort.<br />Made for You.
      </h4>
      <ul className="mt-4 flex flex-col gap-2">
        {[
          "Pregnancy to Postpartum",
          "Nursing Friendly",
          "Ultra Soft Fabrics",
          "Gentle on Sensitive Skin"
        ].map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2 text-[12px] font-semibold text-[#2B2B2B]">
            <CheckCircle size={14} className="text-[#2E6F68] shrink-0 mt-0.5" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/new-in?category=maternity"
        className="block mt-5 text-center bg-[#2E6F68] hover:bg-[#204e49] text-white text-[12px] font-bold py-2.5 rounded-lg transition-colors"
      >
        SHOP COLLECTION →
      </Link>
    </div>
  );

  // 2. Custom Subcategories (6 circles with label and sublabel)
  const customSubcategories = [
    { name: "Maternity Clothing", slug: "clothing", sublabel: "0-9M", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=100&q=80" },
    { name: "Maternity Nightwear", slug: "nightwear", sublabel: "0-9M", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80" },
    { name: "Nursing Wear", slug: "nursing", sublabel: "0-12M", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&q=80" },
    { name: "Maternity Bottomwear", slug: "bottoms", sublabel: "0-9M", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80" },
    { name: "Feeding Essentials", slug: "essentials", sublabel: "0-12M", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80" },
    { name: "Postpartum Care", slug: "postpartum", sublabel: "0-12M", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=100&q=80" }
  ];

  // 3. Maternity Specific Trust Strip (4 items)
  const trustStripItems = [
    { iconName: "Baby", label: "Designed for Every Stage", sublabel: "From bump to baby and beyond." },
    { iconName: "Heart", label: "Nursing Friendly", sublabel: "Easy access, anywhere." },
    { iconName: "Shield", label: "Ultra Soft & Safe", sublabel: "Gentle on you & your baby." },
    { iconName: "Leaf", label: "Thoughtfully Made", sublabel: "With love, care & sustainability." }
  ];

  return (
    <CategoryPageClient
      initialProducts={products}
      heroConfig={heroConfig}
      type="maternity"
      heroFloatingCard={heroFloatingCard}
      customSubcategories={customSubcategories}
      trustStripItems={trustStripItems}
      bottomContent={<MaternityBottomContent />}
    />
  );
}
