"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Instagram, Facebook, Youtube, Play, MessageCircle } from "lucide-react";

// Pinterest Icon since lucide-react doesn't have a built-in standard Pinterest icon in all versions
const PinterestIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.715-.359-1.777c0-1.663.967-2.905 2.167-2.905 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.561-.99 3.985-.283 1.186.592 2.152 1.76 2.152 2.117 0 3.748-2.232 3.748-5.457 0-2.857-2.05-4.849-4.978-4.849-3.39 0-5.378 2.54-5.378 5.166 0 1.022.393 2.117.884 2.712.097.118.11.22.081.339-.09.373-.289 1.173-.328 1.332-.05.207-.168.251-.387.151-1.44-.669-2.338-2.771-2.338-4.457 0-3.633 2.64-6.97 7.611-6.97 3.996 0 7.103 2.847 7.103 6.662 0 3.968-2.502 7.165-5.975 7.165-1.166 0-2.262-.606-2.637-1.321 0 0-.577 2.2-.718 2.738-.26.999-.966 2.247-1.439 3.018 1.127.348 2.32.535 3.559.535 6.62 0 11.988-5.367 11.988-11.987C24 5.367 18.63 0 12.017 0z" />
  </svg>
);

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#2E6F68]"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2a7 7 0 0 1-9 8.8Z" />
    <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
  </svg>
);

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
  };

  return (
    <>
      <footer className="bg-[#2B2B2B] text-white">
        {/* SECTION A — MAIN FOOTER */}
        <div className="mx-auto max-w-7xl px-4 py-[64px] sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-12">
            
            {/* COLUMN 1 — Brand (Wider, ~30% equivalent width on large screens) */}
            <div className="md:col-span-3 lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Link href="/" className="relative flex items-center h-12 w-20">
                  <NextImage 
                    src="/logo.jpeg" 
                    alt="The Comfortables Co. Logo" 
                    fill
                    unoptimized
                    className="object-contain rounded-sm"
                  />
                </Link>
              </div>
              <p className="text-[14px] text-[#9CA3AF] leading-relaxed max-w-[240px]">
                Premium Cotton × Bamboo apparel crafted for breathable comfort, sensitive skin & everyday well-being.
              </p>
              
              {/* Social icons */}
              <div className="flex items-center gap-4 mt-2">
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </Link>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </Link>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </Link>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors" aria-label="Pinterest">
                  <PinterestIcon size={20} />
                </Link>
              </div>
            </div>

            {/* COLUMN 2 — SHOP */}
            <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-[12px] font-semibold tracking-[2px] uppercase text-[#9CA3AF]">
                Shop
              </h4>
              <nav className="flex flex-col gap-2.5 mt-1">
                <Link href="/new-in" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">New In</Link>
                <Link href="/men" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Men</Link>
                <Link href="/women" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Women</Link>
                <Link href="/maternity" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Maternity</Link>
                <Link href="/baby-kids" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Baby & Kids</Link>
                <Link href="/loungewear" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Loungewear</Link>
              </nav>
            </div>

            {/* COLUMN 3 — HELP */}
            <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-[12px] font-semibold tracking-[2px] uppercase text-[#9CA3AF]">
                Help
              </h4>
              <nav className="flex flex-col gap-2.5 mt-1">
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Track Order</Link>
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Returns & Exchanges</Link>
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Size Guide</Link>
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">FAQs</Link>
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Shipping Info</Link>
                <Link href="/contact" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Contact Us</Link>
              </nav>
            </div>

            {/* COLUMN 4 — ABOUT */}
            <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-[12px] font-semibold tracking-[2px] uppercase text-[#9CA3AF]">
                About
              </h4>
              <nav className="flex flex-col gap-2.5 mt-1">
                <Link href="/about" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Our Story</Link>
                <Link href="/sustainability" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Sustainability</Link>
                <Link href="/fabric-innovation" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Fabric Innovation</Link>
                <Link href="/journal" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Journal</Link>
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Careers</Link>
                <Link href="#" className="text-[14px] text-[#D1D5DB] hover:text-white transition-colors">Store Locator</Link>
              </nav>
            </div>

            {/* COLUMN 5 — NEWSLETTER */}
            <div className="md:col-span-3 lg:col-span-2 flex flex-col gap-3">
              <h4 className="font-display text-[16px] font-semibold text-white">
                Stay in the loop
              </h4>
              <p className="text-[13px] text-[#9CA3AF] mb-2 leading-relaxed">
                Get exclusive offers, early access to new drops & more.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full h-[44px] px-3.5 text-[14px] text-white bg-white/5 border border-white/15 rounded-lg outline-none placeholder-[#6B7280] focus:border-[#2E6F68] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full h-[44px] text-[12px] font-semibold tracking-[1.5px] uppercase text-white bg-[#2E6F68] hover:bg-[#2E6F68]/90 rounded-lg transition-colors"
                >
                  SUBSCRIBE
                </button>
              </form>

              {/* We Accept Row */}
              <div className="flex flex-col gap-2 mt-5">
                <span className="text-[11px] text-[#9CA3AF] font-medium tracking-wide">
                  We Accept
                </span>
                
                <div className="flex items-center gap-3">
                  {/* Visa SVG */}
                  <svg className="h-[24px] text-[#D1D5DB]" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="23" height="14" rx="2" fill="white" fillOpacity="0.08"/>
                    <path d="M4 11L5.8 4H7.4L5.6 11H4ZM10.5 4.5C9.8 4.5 9.2 4.9 8.9 5.5L8.1 9H9.7L9.9 8H11.9L12 9H13.6L12.5 4.5H10.5ZM10.3 6.8L10.8 5.2L11.5 6.8H10.3ZM17 4H15.2L14 8.5L14.5 9H16.1L17.9 4ZM19 4L18 8H19.5L20.5 4H19Z" fill="currentColor"/>
                  </svg>
                  {/* Mastercard SVG */}
                  <svg className="h-[24px] text-[#D1D5DB]" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="23" height="14" rx="2" fill="white" fillOpacity="0.08"/>
                    <circle cx="10" cy="7.5" r="4.5" fill="currentColor" fillOpacity="0.7"/>
                    <circle cx="14" cy="7.5" r="4.5" fill="currentColor" fillOpacity="0.7"/>
                  </svg>
                  {/* UPI SVG */}
                  <svg className="h-[24px] text-[#D1D5DB]" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="23" height="14" rx="2" fill="white" fillOpacity="0.08"/>
                    <path d="M5 4.5H7.5V8.5C7.5 9.3 6.8 10 6 10H5V8.5H6V8.5H5V4.5ZM10.5 4.5H12.5C13.3 4.5 14 5.2 14 6C14 6.8 13.3 7.5 12.5 7.5H11.5V10H10.5V4.5ZM11.5 5.5V6.5H12.5C12.8 6.5 13 6.3 13 6C13 5.7 12.8 5.5 12.5 5.5H11.5ZM17.5 4.5H18.5V10H17.5V4.5Z" fill="currentColor"/>
                  </svg>
                  {/* RuPay SVG */}
                  <svg className="h-[24px] text-[#D1D5DB]" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="23" height="14" rx="2" fill="white" fillOpacity="0.08"/>
                    <path d="M4 4.5H7C8.1 4.5 9 5.4 9 6.5C9 7.6 8.1 8.5 7 8.5H5.5V10.5H4V4.5ZM5.5 5.7V7.3H7C7.4 7.3 7.7 7 7.7 6.5C7.7 6 7.4 5.7 7 5.7H5.5ZM10 4.5H11.5V8.5C11.5 9.3 12.2 10 13 10C13.8 10 14.5 9.3 14.5 8.5V4.5H16V8.5C16 10.2 14.7 11.5 13 11.5C11.3 11.5 10 10.2 10 8.5V4.5Z" fill="currentColor"/>
                  </svg>
                  {/* PayPal SVG */}
                  <svg className="h-[24px] text-[#D1D5DB]" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="23" height="14" rx="2" fill="white" fillOpacity="0.08"/>
                    <path d="M7.5 11.5L9.2 4.5H12C13.2 4.5 14 5.2 14 6.2C14 7.2 13.2 8.2 12 8.2H9.8L9 11.5H7.5ZM11.5 11.5L13.2 4.5H16C17.2 4.5 18 5.2 18 6.2C18 7.2 17.2 8.2 16 8.2H13.8L13 11.5H11.5Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION B — BOTTOM BAR */}
        <div className="bg-[#1F1F1F]">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sm:px-6 lg:px-8 text-[12px] text-[#6B7280]">
            <span>
              © 2025 The Comfortables Co. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link href="/returns" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/911234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} className="fill-white text-[#25D366]" />
      </a>
    </>
  );
}
