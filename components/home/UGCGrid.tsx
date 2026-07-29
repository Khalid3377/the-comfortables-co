"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UGCItem {
  id: string;
  imageUrl: string;
  name: string;
  productTag: string;
  handle: string;
}

const MOCK_UGC: UGCItem[] = [
  { id: "1", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", name: "Priya M.", productTag: "CloudKnit Tee", handle: "@priya.m" },
  { id: "2", imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", name: "Ananya R.", productTag: "Maternity Wrap Dress", handle: "@ananya.r" },
  { id: "3", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80", name: "Kavya S.", productTag: "BambooFlow Lounge Set", handle: "@kavya.s" },
  { id: "4", imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80", name: "Meera T.", productTag: "CloudKnit Tee", handle: "@meera.t" },
  { id: "5", imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80", name: "Simran K.", productTag: "BambooFlow Lounge Set", handle: "@simran.k" },
  { id: "6", imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80", name: "Deepa V.", productTag: "Maternity Wrap Dress", handle: "@deepa.v" },
  { id: "7", imageUrl: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=600&q=80", name: "Ritu A.", productTag: "CloudKnit Tee", handle: "@ritu.a" },
  { id: "8", imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=600&q=80", name: "Sana B.", productTag: "BabyCloud Onesie", handle: "@sana.b" },
  { id: "9", imageUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=600&q=80", name: "Lakshmi N.", productTag: "BambooFlow Lounge Set", handle: "@lakshmi.n" },
  { id: "10", imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=600&q=80", name: "Aisha C.", productTag: "CloudKnit Tee", handle: "@aisha.c" },
  { id: "11", imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=600&q=80", name: "Nisha P.", productTag: "Maternity Wrap Dress", handle: "@nisha.p" },
  { id: "12", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", name: "Tanya M.", productTag: "BambooFlow Lounge Set", handle: "@tanya.m" },
  { id: "13", imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80", name: "Geeta L.", productTag: "CloudKnit Tee", handle: "@geeta.l" },
  { id: "14", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80", name: "Pooja S.", productTag: "BabyCloud Onesie", handle: "@pooja.s" },
  { id: "15", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", name: "Divya R.", productTag: "BambooFlow Lounge Set", handle: "@divya.r" },
  { id: "16", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80", name: "Swati G.", productTag: "CloudKnit Tee", handle: "@swati.g" },
  { id: "17", imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80", name: "Anjali K.", productTag: "Maternity Wrap Dress", handle: "@anjali.k" },
  { id: "18", imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80", name: "Rani V.", productTag: "BambooFlow Lounge Set", handle: "@rani.v" },
];

function UGCCell({ item }: { item: UGCItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative aspect-square overflow-hidden bg-brand-sand/20 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={item.imageUrl}
        alt={`${item.name} wearing ${item.productTag}`}
        fill
        sizes="(max-width: 640px) 33vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-ink/80 via-brand-ink/20 to-transparent p-3"
          >
            <p className="text-[11px] font-bold text-white leading-tight">{item.name}</p>
            <p className="text-[10px] text-brand-sand mt-0.5">wearing {item.productTag}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UGCGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.32em] text-brand-teal">
            #WornComfortably
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-light italic leading-tight text-brand-ink dark:text-white"
          >
            Real people. Real comfort.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-1 md:grid-cols-6"
        >
          {MOCK_UGC.map((item) => (
            <UGCCell key={item.id} item={item} />
          ))}
        </motion.div>

        <div className="mt-8 flex justify-center">
          <Link
            href="https://www.instagram.com/explore/tags/worncomfortably/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-teal px-6 py-3 text-sm font-semibold text-brand-teal transition hover:bg-brand-teal hover:text-white"
          >
            Share yours →
          </Link>
        </div>
      </div>
    </section>
  );
}
