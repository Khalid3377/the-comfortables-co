import { CheckCircle, Ruler, MessageCircle, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";

const helpOptions = [
  { icon: Ruler, label: "Size Guide", sub: "Find your perfect fit", href: "/size-guide" },
  { icon: MessageCircle, label: "Chat with Us", sub: "We're online to assist", href: "/chat" },
  { icon: Phone, label: "WhatsApp Chat", sub: "+91 12345 67890", href: "https://wa.me/911234567890" }
];

export default function MaternityBottomContent() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left card */}
        <div className="relative bg-[#FDF8F3] rounded-2xl p-8 overflow-hidden min-h-[240px] flex flex-col justify-between group">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <SafeImage
              src="https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&q=80"
              alt="Maternity lifestyle bg"
              fill
              className="object-cover"
            />
          </div>
          <div className="z-10">
            <h3 className="font-display text-[24px] font-bold text-[#2B2B2B]">
              Essentials for Your Beautiful Journey
            </h3>
            <p className="text-[14px] text-[#6E6E6E] mt-2 max-w-[320px]">
              Explore our must-haves for pregnancy, nursing and postpartum.
            </p>
          </div>
          <div className="z-10 mt-6">
            <Link
              href="/new-in?category=maternity"
              className="inline-block px-5 py-2.5 border-[1.5px] border-[#2E6F68] text-[#2E6F68] hover:bg-[#2E6F68] hover:text-white text-[13px] font-bold rounded-lg transition-colors bg-white/40 backdrop-blur-sm"
            >
              EXPLORE ESSENTIALS →
            </Link>
          </div>
        </div>

        {/* Right card */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-[22px] font-bold text-[#2B2B2B]">
              Need Help Finding the Right Fit?
            </h3>
            <p className="text-[14px] text-[#6E6E6E] mt-1">We&apos;re here for you.</p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {helpOptions.map((option, idx) => {
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
}
