"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  Leaf,
  Star,
  Package,
  Shield,
  Clock,
  Wind,
  Globe,
  RotateCcw,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Sparkles,
  Heart,
  Zap,
  Users,
  Baby,
  Smile,
  Info,
  Smartphone,
  Phone,
  MessageCircle,
  HelpCircle,
  Maximize,
  Sun,
  Repeat
} from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useCommerceStore } from "@/store/commerce-store";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ChevronRight, ChevronDown, LayoutGrid, List, Leaf, Star, Package, Shield, Clock, Wind, Globe, RotateCcw, SlidersHorizontal, X, Plus, Minus, ShoppingCart, Sparkles, Heart, Zap, Users, Baby, Smile, Info, Smartphone, Phone, MessageCircle, HelpCircle, Maximize, Sun, Repeat
};

interface CategoryBadge {
  iconName: string;
  label: string;
  sublabel: string;
}

interface CategoryHeroConfig {
  title: string;
  subtitle: string;
  image: string;
  badges: CategoryBadge[];
}

interface SubcategoryItem {
  name: string;
  slug: string;
  image: string;
  sublabel?: string;
}

interface CategoryPageClientProps {
  initialProducts: Product[];
  heroConfig: CategoryHeroConfig;
  type: "new-in" | "men" | "women" | "maternity" | "baby-kids" | "loungewear";
  heroFloatingCard?: React.ReactNode;
  trustStripItems?: { iconName: string; label: string; sublabel: string }[];
  customSubcategories?: SubcategoryItem[];
  midContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

// Circle Subcategory definitions for Men & Women fallbacks
const MEN_SUBCATEGORIES: SubcategoryItem[] = [
  { name: "All Men", slug: "all", image: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=100&q=80" },
  { name: "Top Wear", slug: "top-wear", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" },
  { name: "Bottom Wear", slug: "bottom-wear", image: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=100&q=80" },
  { name: "Loungewear", slug: "loungewear", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80" },
  { name: "Innerwear", slug: "innerwear", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80" },
  { name: "Activewear", slug: "activewear", image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=100&q=80" },
  { name: "Shirts", slug: "shirts", image: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=100&q=80" },
  { name: "Shorts", slug: "shorts", image: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=100&q=80" },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80" }
];

const WOMEN_SUBCATEGORIES: SubcategoryItem[] = [
  { name: "All Women", slug: "all", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&q=80" },
  { name: "Dresses", slug: "dresses", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=100&q=80" },
  { name: "Tops & Tees", slug: "tops-tees", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&q=80" },
  { name: "Loungewear", slug: "loungewear", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80" },
  { name: "Maternity", slug: "maternity", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=100&q=80" },
  { name: "Bottoms", slug: "bottoms", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80" },
  { name: "Innerwear", slug: "innerwear", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80" },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80" }
];

export default function CategoryPageClient({
  initialProducts,
  heroConfig,
  type,
  heroFloatingCard,
  trustStripItems,
  customSubcategories,
  midContent,
  bottomContent
}: CategoryPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addToCart = useCommerceStore((state) => state.addToCart);

  // Tab Strip categories (for `/new-in`)
  const newInTabs = [
    { name: "All New In", slug: "all" },
    { name: "Men", slug: "men" },
    { name: "Women", slug: "women" },
    { name: "Maternity", slug: "maternity" },
    { name: "Baby & Kids", slug: "baby-kids" },
    { name: "Loungewear", slug: "loungewear" },
    { name: "Accessories", slug: "accessories" }
  ];

  // Accordion state
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    categories: true,
    gender: true,
    size: true,
    fabric: true,
    color: true,
    price: true,
    stage: true,
    age: true
  });

  // Layout View Mode (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Read URL Params
  const activeTab = searchParams.get("tab") || "all";
  const activeSubcat = searchParams.get("subcategory") || "all";
  const activeSort = searchParams.get("sort") || "newest";
  const activePage = parseInt(searchParams.get("page") || "1", 10);
  
  const selectedCategories = useMemo(() => searchParams.getAll("category"), [searchParams]);
  const selectedGenders = useMemo(() => searchParams.getAll("gender"), [searchParams]);
  const selectedSizes = useMemo(() => searchParams.getAll("size"), [searchParams]);
  const selectedFabrics = useMemo(() => searchParams.getAll("fabric"), [searchParams]);
  const selectedColors = useMemo(() => searchParams.getAll("color"), [searchParams]);
  const selectedStages = useMemo(() => searchParams.getAll("stage"), [searchParams]);
  const selectedAges = useMemo(() => searchParams.getAll("age"), [searchParams]);
  
  const priceMin = parseInt(searchParams.get("minPrice") || "199", 10);
  const priceMax = parseInt(searchParams.get("maxPrice") || "4999", 10);

  // Helper to update query parameters
  const updateQueryParams = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always reset page to 1 when changing filters, unless explicitly changing pages
    if (!updates.page) {
      params.set("page", "1");
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach(val => params.append(key, val));
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const toggleFilter = (section: string) => {
    setOpenFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentList = searchParams.getAll(field);
    let newList: string[];
    if (checked) {
      newList = [...currentList, value];
    } else {
      newList = currentList.filter(item => item !== value);
    }
    updateQueryParams({ [field]: newList.length > 0 ? newList : null });
  };

  const handleSizeToggle = (size: string) => {
    const currentList = searchParams.getAll("size");
    let newList: string[];
    if (currentList.includes(size)) {
      newList = currentList.filter(item => item !== size);
    } else {
      newList = [...currentList, size];
    }
    updateQueryParams({ size: newList.length > 0 ? newList : null });
  };

  const handleColorToggle = (color: string) => {
    const currentList = searchParams.getAll("color");
    let newList: string[];
    if (currentList.includes(color)) {
      newList = currentList.filter(item => item !== color);
    } else {
      newList = [...currentList, color];
    }
    updateQueryParams({ color: newList.length > 0 ? newList : null });
  };

  // Derive counts & filters dynamically from initial products matching base route
  const baseFilteredProducts = useMemo(() => {
    let list = [...initialProducts];
    if (type === "men") {
      const filtered = list.filter(p => 
        p.category.toLowerCase().includes("everyday wear") || 
        p.category.toLowerCase().includes("lounge wear") || 
        p.category.toLowerCase().includes("everyday") || 
        p.category.toLowerCase().includes("men") ||
        p.name.toLowerCase().includes("men")
      );
      return filtered.length >= 3 ? filtered : list;
    } else if (type === "women") {
      const filtered = list.filter(p => 
        p.category.toLowerCase().includes("everyday wear") || 
        p.category.toLowerCase().includes("lounge wear") || 
        p.category.toLowerCase().includes("women") || 
        p.name.toLowerCase().includes("women") || 
        p.category.toLowerCase().includes("maternity")
      );
      return filtered.length >= 3 ? filtered : list;
    } else if (type === "maternity") {
      const filtered = list.filter(p => 
        p.category.toLowerCase().includes("maternity") || 
        p.name.toLowerCase().includes("maternity")
      );
      return filtered.length >= 3 ? filtered : list;
    } else if (type === "baby-kids") {
      const filtered = list.filter(p => 
        p.category.toLowerCase().includes("baby") || 
        p.category.toLowerCase().includes("kids") || 
        p.name.toLowerCase().includes("baby") || 
        p.name.toLowerCase().includes("kids")
      );
      return filtered.length >= 3 ? filtered : list;
    } else if (type === "loungewear") {
      const filtered = list.filter(p => 
        p.category.toLowerCase().includes("lounge") || 
        p.name.toLowerCase().includes("lounge")
      );
      return filtered.length >= 3 ? filtered : list;
    }
    return list;
  }, [initialProducts, type]);

  // Derived filters checklists counts
  const filterCounts = useMemo(() => {
    const counts = {
      categories: {
        "Tops & Tees": 0,
        "Lounge Sets": 0,
        "Dresses": 0,
        "Bottoms": 0,
        "Nightwear": 0,
        "Accessories": 0
      }
    };

    baseFilteredProducts.forEach(p => {
      const cat = p.category.toLowerCase();
      const name = p.name.toLowerCase();
      if (cat.includes("tee") || cat.includes("top") || name.includes("tee") || name.includes("top")) {
        counts.categories["Tops & Tees"]++;
      } else if (cat.includes("lounge") || name.includes("lounge")) {
        counts.categories["Lounge Sets"]++;
      } else if (cat.includes("dress") || name.includes("dress")) {
        counts.categories["Dresses"]++;
      } else if (cat.includes("pant") || cat.includes("bottom") || name.includes("bottom") || name.includes("pant")) {
        counts.categories["Bottoms"]++;
      } else if (cat.includes("night") || cat.includes("sleep") || name.includes("sleep")) {
        counts.categories["Nightwear"]++;
      } else {
        counts.categories["Accessories"]++;
      }
    });

    return counts;
  }, [baseFilteredProducts]);

  // Color options gathered dynamically
  const dynamicColorOptions = useMemo(() => {
    const colorsMap: Record<string, string> = {};
    baseFilteredProducts.forEach(p => {
      if (p.colorVariants) {
        p.colorVariants.forEach(variant => {
          colorsMap[variant.name] = variant.hex;
        });
      }
    });
    return Object.entries(colorsMap).map(([name, hex]) => ({ name, hex }));
  }, [baseFilteredProducts]);

  // Filter & sort logic applied dynamically
  const filteredProducts = useMemo(() => {
    let list = [...baseFilteredProducts];

    // Tab filter for `/new-in`
    if (type === "new-in" && activeTab !== "all") {
      list = list.filter(p => p.category.toLowerCase().includes(activeTab) || p.name.toLowerCase().includes(activeTab));
    }

    // Subcategory thumbnail filter for `/men` and `/women`
    if (type !== "new-in" && activeSubcat !== "all") {
      list = list.filter(p => {
        const query = activeSubcat.replace("-", " ").toLowerCase();
        return p.category.toLowerCase().includes(query) || p.name.toLowerCase().includes(query);
      });
    }

    // Categories filter checkboxes
    if (selectedCategories.length > 0) {
      list = list.filter(p => {
        const cat = p.category.toLowerCase();
        const name = p.name.toLowerCase();
        return selectedCategories.some(sel => {
          if (sel === "Tops & Tees") return cat.includes("tee") || cat.includes("top") || name.includes("tee") || name.includes("top");
          if (sel === "Lounge Sets") return cat.includes("lounge") || name.includes("lounge");
          if (sel === "Dresses") return cat.includes("dress") || name.includes("dress");
          if (sel === "Bottoms") return cat.includes("pant") || cat.includes("bottom") || name.includes("bottom") || name.includes("pant");
          if (sel === "Nightwear") return cat.includes("night") || cat.includes("sleep") || name.includes("sleep");
          return !cat.includes("tee") && !cat.includes("top") && !name.includes("tee") && !name.includes("top") &&
                 !cat.includes("lounge") && !name.includes("lounge") &&
                 !cat.includes("dress") && !name.includes("dress") &&
                 !cat.includes("pant") && !cat.includes("bottom") && !name.includes("bottom") && !name.includes("pant") &&
                 !cat.includes("night") && !cat.includes("sleep") && !name.includes("sleep");
        });
      });
    }

    // Gender checkboxes
    if (selectedGenders.length > 0) {
      list = list.filter(p => {
        const cat = p.category.toLowerCase();
        const name = p.name.toLowerCase();
        return selectedGenders.some(gen => {
          const g = gen.toLowerCase();
          return cat.includes(g) || name.includes(g);
        });
      });
    }

    // Stage filter (for Maternity)
    if (selectedStages.length > 0) {
      list = list.filter(p => p.stage && selectedStages.some(st => {
        const mapped = st.toLowerCase().replace(" ", "-");
        return p.stage?.toLowerCase() === mapped;
      }));
    }

    // Age filter (for Baby & Kids)
    if (selectedAges.length > 0) {
      list = list.filter(p => p.ageRange && selectedAges.some(ag => {
        let key = ag;
        if (ag.includes("Newborn")) key = "0-6M";
        else if (ag.includes("6-12")) key = "6-12M";
        else if (ag.includes("1-2")) key = "1-2Y";
        else if (ag.includes("2-4")) key = "2-4Y";
        else if (ag.includes("4-6")) key = "4-6Y";
        else if (ag.includes("6-10")) key = "6-10Y";
        return p.ageRange?.toLowerCase() === key.toLowerCase();
      }));
    }

    // Sizes checkboxes
    if (selectedSizes.length > 0) {
      list = list.filter(p => p.sizes.some(sz => selectedSizes.includes(sz)));
    }

    // Fabrics checkboxes
    if (selectedFabrics.length > 0) {
      list = list.filter(p => {
        const mat = p.material.toLowerCase();
        return selectedFabrics.some(fab => mat.includes(fab.toLowerCase()));
      });
    }

    // Colors checkboxes
    if (selectedColors.length > 0) {
      list = list.filter(p => p.colors.some(col => selectedColors.includes(col)));
    }

    // Price slider filter
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);

    // Sorting options
    if (activeSort === "newest") {
      list.reverse();
    } else if (activeSort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (activeSort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [baseFilteredProducts, activeTab, activeSubcat, selectedCategories, selectedGenders, selectedStages, selectedAges, selectedSizes, selectedFabrics, selectedColors, priceMin, priceMax, activeSort, type]);

  // Pagination bounds
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIdx = (activePage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, activePage]);

  // Chevron headers for accordion sections
  const AccordionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleFilter(section)}
      className="flex w-full items-center justify-between py-3 border-b border-[#EAEAEA] text-left text-[14px] font-bold text-[#2B2B2B]"
    >
      <span>{title}</span>
      <ChevronDown
        size={16}
        className={`text-[#6E6E6E] transition-transform duration-300 ${
          openFilters[section] ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  const defaultTrustItems = [
    { iconName: "RotateCcw", label: "New Styles Every Week", sublabel: "Stay ahead with fresh arrivals" },
    { iconName: "Star", label: "Premium Comfort", sublabel: "Designed for all-day ease" },
    { iconName: "RotateCcw", label: "Easy 7-Day Returns", sublabel: "Hassle-free returns & trades" },
    { iconName: "Shield", label: "Secure Payments", sublabel: "100% safe & trusted checkout" }
  ];

  const finalTrustStripItems = trustStripItems || defaultTrustItems;
  const finalSubcategories = customSubcategories || (type === "men" ? MEN_SUBCATEGORIES : WOMEN_SUBCATEGORIES);

  return (
    <div className="w-full bg-[#FAFAF7]">
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col md:flex-row w-full overflow-hidden border-b border-[#EAEAEA]">
        
        {/* Left Column (55% width) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[55%] px-6 py-12 md:p-16 flex flex-col justify-center bg-[#FAFAF7] z-10"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-[12px] text-[#6E6E6E] mb-6">
            <Link href="/" className="hover:text-[#2E6F68] transition-colors">Home</Link>
            <ChevronRight size={10} className="text-[#6E6E6E]" />
            <span className="font-semibold text-[#2B2B2B] capitalize">{heroConfig.title}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[44px] md:text-[56px] font-bold text-[#2B2B2B] leading-[1.1] mb-4">
            {heroConfig.title}
          </h1>
          <p className="text-[16px] text-[#6E6E6E] max-w-[400px] leading-relaxed mb-10">
            {heroConfig.subtitle}
          </p>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            {heroConfig.badges.map((badge, idx) => {
              const Icon = iconMap[badge.iconName] || Leaf;
              return (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-[#2E6F68]/10 text-[#2E6F68]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#2B2B2B] leading-none">{badge.label}</h4>
                    <span className="text-[11px] text-[#6E6E6E] mt-1 block">{badge.sublabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column (45% width) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[45%] relative min-h-[300px] md:min-h-auto overflow-hidden bg-[#FDF8F3]"
        >
          <SafeImage
            src={heroConfig.image}
            alt={heroConfig.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Optional Floating Card */}
          {heroFloatingCard}
        </motion.div>
      </section>

      {/* 2. NAVIGATION STRIP */}
      {type === "new-in" ? (
        <div className="sticky top-16 z-30 w-full bg-white border-b border-[#EAEAEA] shadow-sm overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center md:justify-start">
            {newInTabs.map(tab => (
              <button
                key={tab.slug}
                onClick={() => updateQueryParams({ tab: tab.slug })}
                className={`text-[14px] font-semibold px-5 py-4 border-b-2 transition-all shrink-0 ${
                  activeTab === tab.slug
                    ? "border-[#2E6F68] text-[#2B2B2B]"
                    : "border-transparent text-[#6E6E6E] hover:text-[#2B2B2B]"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border-b border-[#EAEAEA] py-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 items-center">
            {finalSubcategories.map(sub => (
              <button
                key={sub.slug}
                onClick={() => updateQueryParams({ subcategory: sub.slug })}
                className="flex flex-col items-center shrink-0 group focus:outline-none"
              >
                <div
                  className={`h-16 w-16 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                    activeSubcat === sub.slug ? "border-[#2E6F68]" : "border-[#EAEAEA] group-hover:border-[#2E6F68]"
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <SafeImage
                      src={sub.image}
                      alt={sub.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className={`text-[12px] font-semibold mt-2 transition-colors ${
                  activeSubcat === sub.slug ? "text-[#2E6F68]" : "text-[#2B2B2B] group-hover:text-[#2E6F68]"
                }`}>
                  {sub.name}
                </span>
                {sub.sublabel && (
                  <span className="text-[10px] text-[#6E6E6E] mt-0.5">{sub.sublabel}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN SHOP LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          
          {/* SIDEBAR FILTER PANEL */}
          <aside className="hidden lg:block sticky top-36 h-fit w-full flex flex-col gap-6">
            
            {/* Sidebar Title */}
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#2B2B2B] font-display flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </h3>
              <button
                onClick={handleClearAll}
                className="text-[13px] font-semibold text-[#2E6F68] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Accordion 1: Categories */}
            <div className="w-full">
              <AccordionHeader title="CATEGORIES" section="categories" />
              <AnimatePresence initial={false}>
                {openFilters.categories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 pt-3 pb-2 text-[13px] text-[#6E6E6E]">
                      {Object.entries(filterCounts.categories).map(([catName, count]) => (
                        <label key={catName} className="flex items-center gap-2.5 cursor-pointer hover:text-[#2B2B2B] transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(catName)}
                            onChange={(e) => handleCheckboxChange("category", catName, e.target.checked)}
                            className="h-4 w-4 rounded border-[#EAEAEA] text-[#2E6F68] focus:ring-[#2E6F68] accent-[#2E6F68]"
                          />
                          <span>{catName}</span>
                          <span className="text-[11px] text-[#C9B79C] font-semibold">({count})</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Gender/Section */}
            <div className="w-full">
              <AccordionHeader title="GENDER / SECTION" section="gender" />
              <AnimatePresence initial={false}>
                {openFilters.gender && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 pt-3 pb-2 text-[13px] text-[#6E6E6E]">
                      {["Men", "Women", "Maternity", "Baby & Kids", "Loungewear"].map(gen => (
                        <label key={gen} className="flex items-center gap-2.5 cursor-pointer hover:text-[#2B2B2B] transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedGenders.includes(gen)}
                            onChange={(e) => handleCheckboxChange("gender", gen, e.target.checked)}
                            className="h-4 w-4 rounded border-[#EAEAEA] text-[#2E6F68] focus:ring-[#2E6F68] accent-[#2E6F68]"
                          />
                          <span>{gen}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2.5: Stage (Maternity only) */}
            {type === "maternity" && (
              <div className="w-full">
                <AccordionHeader title="STAGE" section="stage" />
                <AnimatePresence initial={false}>
                  {openFilters.stage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2.5 pt-3 pb-2 text-[13px] text-[#6E6E6E]">
                        {["First Trimester", "Second Trimester", "Third Trimester", "Postpartum"].map(stg => (
                          <label key={stg} className="flex items-center gap-2.5 cursor-pointer hover:text-[#2B2B2B] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedStages.includes(stg)}
                              onChange={(e) => handleCheckboxChange("stage", stg, e.target.checked)}
                              className="h-4 w-4 rounded border-[#EAEAEA] text-[#2E6F68] focus:ring-[#2E6F68] accent-[#2E6F68]"
                            />
                            <span>{stg}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accordion 2.5: Age (Baby & Kids only) */}
            {type === "baby-kids" && (
              <div className="w-full">
                <AccordionHeader title="AGE" section="age" />
                <AnimatePresence initial={false}>
                  {openFilters.age && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2.5 pt-3 pb-2 text-[13px] text-[#6E6E6E]">
                        {["Newborn (0-6M)", "6-12 Months", "1-2 Years", "2-4 Years", "4-6 Years", "6-10 Years"].map(age => (
                          <label key={age} className="flex items-center gap-2.5 cursor-pointer hover:text-[#2B2B2B] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedAges.includes(age)}
                              onChange={(e) => handleCheckboxChange("age", age, e.target.checked)}
                              className="h-4 w-4 rounded border-[#EAEAEA] text-[#2E6F68] focus:ring-[#2E6F68] accent-[#2E6F68]"
                            />
                            <span>{age}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accordion 3: Sizes */}
            <div className="w-full">
              <AccordionHeader title="SIZE" section="size" />
              <AnimatePresence initial={false}>
                {openFilters.size && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-3 pb-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map(sz => {
                        const active = selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            onClick={() => handleSizeToggle(sz)}
                            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all ${
                              active
                                ? "bg-[#2B2B2B] text-white border-[#2B2B2B]"
                                : "bg-white text-[#6E6E6E] border-[#EAEAEA] hover:border-[#2B2B2B] hover:text-[#2B2B2B]"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4: Fabric */}
            <div className="w-full">
              <AccordionHeader title="FABRIC" section="fabric" />
              <AnimatePresence initial={false}>
                {openFilters.fabric && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 pt-3 pb-2 text-[13px] text-[#6E6E6E]">
                      {["Cotton", "Bamboo", "Cotton Blend", "Modal", "Linen"].map(fab => (
                        <label key={fab} className="flex items-center gap-2.5 cursor-pointer hover:text-[#2B2B2B] transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedFabrics.includes(fab)}
                            onChange={(e) => handleCheckboxChange("fabric", fab, e.target.checked)}
                            className="h-4 w-4 rounded border-[#EAEAEA] text-[#2E6F68] focus:ring-[#2E6F68] accent-[#2E6F68]"
                          />
                          <span>{fab}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 5: Color Swatches */}
            <div className="w-full">
              <AccordionHeader title="COLOR" section="color" />
              <AnimatePresence initial={false}>
                {openFilters.color && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2.5 pt-3 pb-2">
                      {dynamicColorOptions.map(col => {
                        const active = selectedColors.includes(col.name);
                        return (
                          <button
                            key={col.name}
                            onClick={() => handleColorToggle(col.name)}
                            title={col.name}
                            className={`h-6 w-6 rounded-full border border-black/10 transition-all ${
                              active ? "ring-2 ring-offset-2 ring-[#2E6F68] scale-110" : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: col.hex }}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 6: Price range */}
            <div className="w-full">
              <AccordionHeader title="PRICE RANGE" section="price" />
              <AnimatePresence initial={false}>
                {openFilters.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden text-[13px] text-[#6E6E6E]"
                  >
                    <div className="pt-3 pb-2 flex flex-col gap-3">
                      <div className="flex justify-between items-baseline font-semibold text-[#2B2B2B]">
                        <span>{formatCurrency(priceMin)}</span>
                        <span>{formatCurrency(priceMax)}</span>
                      </div>
                      <input
                        type="range"
                        min="199"
                        max="4999"
                        value={priceMax}
                        onChange={(e) => updateQueryParams({ maxPrice: e.target.value })}
                        className="w-full accent-[#2E6F68]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sustainability sidebar card banner */}
            <div className="bg-[#F0F7F5] border border-[#C9E8E0] rounded-xl p-4 mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#2E6F68]">
                <Leaf size={18} />
                <span className="text-[13px] font-bold">Sustainably Made</span>
              </div>
              <p className="text-[11px] text-[#6E6E6E] leading-relaxed">
                Better for you. Better for the planet. Crafted under ethical labor guidelines.
              </p>
            </div>

          </aside>

          {/* RIGHT GRID / LIST AREA */}
          <main className="flex-1">
            
            {/* Top Sort / Toggle header bar */}
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-8">
              <span className="text-[13px] text-[#6E6E6E]">
                Showing {filteredProducts.length === 0 ? "0" : `1–${Math.min(filteredProducts.length, itemsPerPage)}`} of {filteredProducts.length} products
              </span>
              
              <div className="flex items-center gap-6">
                
                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#6E6E6E] hidden sm:inline">Sort:</span>
                  <select
                    value={activeSort}
                    onChange={(e) => updateQueryParams({ sort: e.target.value })}
                    className="text-[13px] font-semibold text-[#2B2B2B] bg-transparent outline-none cursor-pointer border-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rated</option>
                  </select>
                </div>

                {/* Grid / List Toggles */}
                <div className="flex items-center gap-1.5 border border-[#EAEAEA] p-1 rounded-lg bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded ${
                      viewMode === "grid" ? "bg-[#FAFAF7] text-[#2B2B2B]" : "text-[#6E6E6E] hover:text-[#2B2B2B]"
                    }`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded ${
                      viewMode === "list" ? "bg-[#FAFAF7] text-[#2B2B2B]" : "text-[#6E6E6E] hover:text-[#2B2B2B]"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>

              </div>
            </div>

            {/* Products container */}
            {filteredProducts.length === 0 ? (
              <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                <Leaf size={48} className="text-[#C9B79C]/50 mb-4" />
                <h4 className="text-[18px] font-bold text-[#2B2B2B]">No products found</h4>
                <p className="text-[14px] text-[#6E6E6E] mt-2">Try clearing your filters or select a different category.</p>
              </div>
            ) : viewMode === "grid" ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {paginatedProducts.map(product => (
                  <motion.div layout key={product.slug}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col gap-4">
                {paginatedProducts.map(product => (
                  <motion.div
                    layout
                    key={product.slug}
                    className="flex flex-col sm:flex-row gap-5 bg-white border border-[#EAEAEA] rounded-xl p-4 hover:shadow-sm transition-shadow group relative overflow-hidden"
                  >
                    {/* Left image wrapper */}
                    <div className="relative h-28 w-28 shrink-0 bg-neutral-50 rounded-lg overflow-hidden">
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {/* Right details content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-[15px] font-bold text-[#2B2B2B] group-hover:text-[#2E6F68] transition-colors leading-tight">
                            <Link href={`/product/${product.slug}`}>{product.name}</Link>
                          </h4>
                          <span className="text-[14px] font-bold text-[#2B2B2B]">{formatCurrency(product.price)}</span>
                        </div>
                        <span className="text-[12px] text-[#6E6E6E] block mt-1">{product.category}</span>
                        {/* Rating row */}
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1 text-[12px] text-[#F59E0B]">
                            <span>★</span>
                            <span className="font-semibold text-[#2B2B2B]">{product.rating}</span>
                            <span className="text-[#6E6E6E]">({product.reviewCount || 0})</span>
                          </div>
                        )}
                        <p className="text-[13px] text-[#6E6E6E] mt-3 line-clamp-1 leading-relaxed max-w-[500px]">
                          {product.description}
                        </p>
                      </div>

                      {/* Add to Cart row */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Swatches indicator */}
                        <div className="flex gap-1.5">
                          {product.colorVariants?.slice(0, 3).map(col => (
                            <span
                              key={col.name}
                              className="h-3 w-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: col.hex }}
                            />
                          ))}
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => {
                            addToCart({
                              slug: product.slug,
                              quantity: 1,
                              size: product.sizes[0],
                              color: product.colors[0]
                            });
                            alert(`Added ${product.name} to cart!`);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#2B2B2B] text-white hover:bg-[#2E6F68] text-[12px] font-bold rounded-lg transition-colors"
                        >
                          <ShoppingCart size={13} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Optional Middle Page Content (e.g. Baby trust strip card) */}
            {midContent}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12 pt-6 border-t border-[#EAEAEA]">
                <button
                  disabled={activePage === 1}
                  onClick={() => updateQueryParams({ page: (activePage - 1).toString() })}
                  className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-[13px] font-semibold text-[#6E6E6E] hover:border-[#2B2B2B] hover:text-[#2B2B2B] disabled:opacity-50 disabled:hover:border-[#EAEAEA] disabled:hover:text-[#6E6E6E] transition-colors"
                >
                  ← prev
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pg = idx + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => updateQueryParams({ page: pg.toString() })}
                      className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                        activePage === pg
                          ? "bg-[#2E6F68] text-white"
                          : "border border-[#EAEAEA] text-[#6E6E6E] hover:border-[#2B2B2B] hover:text-[#2B2B2B]"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  disabled={activePage === totalPages}
                  onClick={() => updateQueryParams({ page: (activePage + 1).toString() })}
                  className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-[13px] font-semibold text-[#6E6E6E] hover:border-[#2B2B2B] hover:text-[#2B2B2B] disabled:opacity-50 disabled:hover:border-[#EAEAEA] disabled:hover:text-[#6E6E6E] transition-colors"
                >
                  next →
                </button>
              </div>
            )}

          </main>

        </div>
      </section>

      {/* 4. FOOTER TRUST STRIP */}
      <section className="w-full bg-white border-t border-[#EAEAEA] py-10 mt-12">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-${finalTrustStripItems.length} gap-6 text-center md:text-left`}>
          {finalTrustStripItems.map((item, idx) => {
            const Icon = iconMap[item.iconName] || Shield;
            return (
              <div key={idx} className="flex flex-col md:flex-row gap-3.5 items-center md:items-start">
                <Icon size={22} className="text-[#2E6F68] shrink-0" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#2B2B2B]">{item.label}</h4>
                  <span className="text-[11px] text-[#6E6E6E] mt-1 block">{item.sublabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. EXTRA BOTTOM CONTENT */}
      {bottomContent}

    </div>
  );
}
