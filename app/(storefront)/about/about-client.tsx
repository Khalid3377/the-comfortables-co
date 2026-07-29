"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Leaf,
  Sparkles,
  Users,
  Globe,
  Heart,
  Sprout,
  Package,
  Star,
  Shield,
  Award,
  RefreshCw,
  Linkedin,
  Instagram,
  ArrowRight
} from "lucide-react";
import SafeImage from "@/components/ui/safe-image";

// Simple Counter Component with In-View Trigger
function Counter({ targetValue, duration = 1.5 }: { targetValue: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const isFloat = targetValue.includes(".");
    const match = targetValue.match(/[\d,.]+/);
    if (!match) {
      setDisplayValue(targetValue);
      return;
    }
    const cleanNum = match[0].replace(/,/g, "");
    const numericTarget = parseFloat(cleanNum);

    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentValue = progress * numericTarget;

      if (isFloat) {
        setDisplayValue(currentValue.toFixed(1) + targetValue.replace(match[0], ""));
      } else {
        const formatted = Math.floor(currentValue).toLocaleString("en-IN");
        setDisplayValue(formatted + targetValue.replace(match[0], ""));
      }

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(targetValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, targetValue, duration]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function AboutClient() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const sectionJourneyRef = useRef<HTMLDivElement>(null);
  const journeyInView = useInView(sectionJourneyRef, { once: true, margin: "-100px" });

  return (
    <div className="w-full bg-white font-sans text-brand-muted">
      
      {/* SECTION 1 — HERO */}
      <section className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#FAFAF7] px-6 py-16 sm:px-12 md:px-16 lg:px-24">
          <nav className="text-xs uppercase tracking-wider text-[#6E6E6E]">
            Home &gt; <span className="text-[#2E6F68] font-medium">About Us</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[#2B2B2B] sm:text-5xl lg:text-6xl">
            About Us
          </h1>
          <p className="mt-2 font-display text-xl font-medium text-[#2E6F68] md:text-2xl">
            Comfort you can feel good about.
          </p>
          <div className="mt-6 max-w-lg space-y-4 text-[15px] sm:text-16 leading-[1.8] text-[#6E6E6E]">
            <p>
              The Comfortables Co. was born out of a simple belief — that comfort should never come at the cost of our planet or the people who live on it.
            </p>
            <p>
              We create thoughtfully designed clothing for every stage of life, using better materials and responsible practices. Because true comfort is sustainable.
            </p>
          </div>
          <div className="mt-8">
            <button className="group inline-flex items-center gap-2 rounded-lg bg-[#2B2B2B] px-8 py-4 text-[13px] font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#2E6F68]">
              OUR STORY <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
        <div className="relative min-h-[40vh] md:min-h-full w-full overflow-hidden bg-[#F5F0EA]">
          <SafeImage
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80"
            alt="About Us Hero"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* SECTION 2 — VALUES STRIP */}
      <section className="relative z-10 w-full bg-white px-6 py-12 md:py-16 lg:px-20 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:flex md:flex-row md:justify-evenly md:divide-x md:divide-[#EAEAEA]">
            {[
              {
                icon: Leaf,
                label: "Thoughtfully Designed",
                sublabel: "Timeless styles made for everyday comfort."
              },
              {
                icon: Sparkles,
                label: "Better Materials",
                sublabel: "Natural, breathable & responsibly sourced."
              },
              {
                icon: Users,
                label: "Made for Everyone",
                sublabel: "For every body, every stage, every you."
              },
              {
                icon: Globe,
                label: "Sustainable First",
                sublabel: "Designed with care for people and planet."
              },
              {
                icon: Heart,
                label: "Loved by You",
                sublabel: "Trusted by thousands of happy customers."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center px-4 md:px-8 first:pl-0 last:pr-0 ${
                    idx === 4 ? "col-span-2 mx-auto max-w-[280px] md:max-w-none md:col-span-1" : ""
                  }`}
                >
                  <Icon size={32} className="text-[#2E6F68] mb-4" />
                  <h4 className="font-display text-[15px] font-bold text-[#2B2B2B]">{item.label}</h4>
                  <p className="mt-2 text-[13px] text-[#6E6E6E] max-w-[140px] leading-relaxed">
                    {item.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR JOURNEY */}
      <section ref={sectionJourneyRef} className="w-full bg-[#FAFAF7] px-6 py-20 lg:px-20 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-bold text-[#2B2B2B] md:text-4xl mb-16">
            Our Journey
          </h2>

          <div className="relative">
            {/* Timeline connectors */}
            {/* Desktop connecting line */}
            <div className="absolute top-[28px] left-[5%] right-[5%] hidden md:block">
              <div className="h-[2px] w-full border-t-2 border-dashed border-[#EAEAEA]" />
              <motion.div
                initial={{ width: 0 }}
                animate={journeyInView ? { width: "100%" } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-[2px] bg-[#2E6F68]"
              />
            </div>

            {/* Mobile connecting line */}
            <div className="absolute left-[28px] top-0 bottom-0 md:hidden w-[2px]">
              <div className="h-full border-l-2 border-dashed border-[#EAEAEA]" />
              <motion.div
                initial={{ height: 0 }}
                animate={journeyInView ? { height: "100%" } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[2px] bg-[#2E6F68]"
              />
            </div>

            {/* Timeline nodes */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={journeyInView ? "show" : "hidden"}
              className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-4 relative z-10"
            >
              {[
                {
                  icon: Sprout,
                  year: "2021",
                  title: "The Beginning",
                  description: "We started with a simple mission to redefine comfort with conscious choices."
                },
                {
                  icon: Package,
                  year: "2022",
                  title: "Growing Together",
                  description: "Launched our first collections in loungewear for men and women."
                },
                {
                  icon: Heart,
                  year: "2023",
                  title: "Expanding Our Family",
                  description: "Welcomed maternity and baby & kids collections into our community."
                },
                {
                  icon: Leaf,
                  year: "2024",
                  title: "Sustainability Commitment",
                  description: "Took stronger steps towards sustainable materials and ethical manufacturing."
                },
                {
                  icon: Star,
                  year: "Today & Beyond",
                  title: "Continuing to Innovate",
                  description: "Continuing to innovate, stay responsible and inspire positive change."
                }
              ].map((node, index) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex flex-row md:flex-col items-center md:text-center gap-6 md:gap-0"
                  >
                    {/* Circle icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2E6F68] bg-white text-[#2E6F68]">
                      <Icon size={24} />
                    </div>

                    <div className="flex flex-col md:items-center">
                      <span className="mt-0 md:mt-4 font-display text-lg font-bold text-[#2B2B2B]">
                        {node.year}
                      </span>
                      <h4 className="font-display text-[15px] font-semibold text-[#2B2B2B] mt-1">
                        {node.title}
                      </h4>
                      <p className="mt-2 text-[13px] text-[#6E6E6E] max-w-[200px] md:max-w-[160px] leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — MEET THE TEAM */}
      <section className="w-full bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-bold text-[#2B2B2B] md:text-4xl">
            Meet the Team
          </h2>
          <p className="mt-2 text-base text-[#6E6E6E] mb-12">
            The dreamers, doers and comfort creators behind The Comfortables Co.
          </p>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              {
                name: "Ananya Sharma",
                role: "Founder & Creative Head",
                bio: "Ananya founded The Comfortables Co. with a vision to create sustainable comfort wear for every stage of life.",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
                initials: "AS"
              },
              {
                name: "Rohit Mehta",
                role: "Co-Founder & CEO",
                bio: "Rohit leads our operations and strategy, ensuring we grow responsibly while staying true to our values.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
                initials: "RM"
              },
              {
                name: "Meera Iyer",
                role: "Head of Design",
                bio: "Meera brings our ideas to life with minimal, timeless designs that you love to live in.",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
                initials: "MI"
              },
              {
                name: "Arjun Nair",
                role: "Head of Sustainability",
                bio: "Arjun ensures every step we take is kinder to the planet and better for future generations.",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
                initials: "AN"
              }
            ].map((member, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center rounded-[20px] border border-[#EAEAEA] bg-white p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-3 border-[#EAEAEA] mb-4 bg-[#F0F7F5] flex items-center justify-center">
                  <SafeImage
                    src={member.avatar}
                    alt={member.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    fallbackClassName="flex items-center justify-center bg-[#F0F7F5]"
                  />
                  {/* Fallback initials displayed inside SafeImage custom behavior */}
                </div>
                <h4 className="font-display text-lg font-bold text-[#2B2B2B]">
                  {member.name}
                </h4>
                <p className="text-[13px] font-medium text-[#2E6F68] mt-1">
                  {member.role}
                </p>
                <p className="mt-3 text-[13px] text-[#6E6E6E] max-w-[200px] leading-relaxed flex-grow">
                  {member.bio}
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <a href="#" className="text-[#6E6E6E] hover:text-[#2E6F68] transition-colors" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-[#6E6E6E] hover:text-[#2E6F68] transition-colors" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — STATS STRIP */}
      <section className="w-full bg-[#FAFAF7] border-y border-[#EAEAEA] px-6 py-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:flex md:flex-row md:justify-evenly text-center">
            {[
              {
                value: "50,000+",
                label: "Happy Customers",
                sublabel: "Growing stronger every day."
              },
              {
                value: "100,000+",
                label: "Trees Planted",
                sublabel: "Through our partnerships."
              },
              {
                value: "1,20,000+",
                label: "Plastic Bags Saved",
                sublabel: "By using better packaging."
              },
              {
                value: "4.8/5",
                label: "Customer Rating",
                sublabel: "From thousands of reviews."
              }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="font-display text-3xl font-bold text-[#2B2B2B] sm:text-4xl lg:text-[48px] leading-tight">
                  <Counter targetValue={stat.value} />
                </span>
                <span className="text-sm font-semibold text-[#2B2B2B] mt-2">
                  {stat.label}
                </span>
                <span className="text-[13px] text-[#6E6E6E] mt-1">
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — OUR VALUES */}
      <section className="w-full bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-bold text-[#2B2B2B] md:text-4xl mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-2 gap-6 lg:flex lg:flex-row lg:justify-between lg:gap-5">
            {[
              {
                icon: Shield,
                title: "Conscious Choices",
                desc: "Every decision we make is rooted in care for people and planet."
              },
              {
                icon: Award,
                title: "Quality First",
                desc: "We never compromise on quality because you deserve the best."
              },
              {
                icon: Heart,
                title: "Kindness Always",
                desc: "From our team to our community, we lead with kindness."
              },
              {
                icon: RefreshCw,
                title: "Better Every Day",
                desc: "We keep learning, improving and finding better ways to do things."
              },
              {
                icon: Sparkles,
                title: "Made With Love",
                desc: "Everything we create is made with love, for you and your family."
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className={`flex flex-col rounded-2xl border border-[#EAEAEA] bg-[#FAFAF7] p-6 lg:p-7 transition-all duration-300 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex-1 ${
                    idx === 4 ? "col-span-2 mx-auto max-w-[280px] md:max-w-none lg:max-w-none lg:col-span-1" : ""
                  }`}
                >
                  <Icon size={32} className="text-[#2E6F68] mb-4" />
                  <h4 className="font-display text-base font-bold text-[#2B2B2B]">
                    {value.title}
                  </h4>
                  <p className="mt-2 text-[13px] text-[#6E6E6E] leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
