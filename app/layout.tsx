import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Inter_Tight } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://thecomfortables.co"),
  title: {
    default: "The Comfortables Co. | Cotton x Bamboo Comfort Wear",
    template: "%s | The Comfortables Co."
  },
  description:
    "Premium Cotton x Bamboo apparel designed for breathable comfort, skin wellness, and sustainable modern living.",
  openGraph: {
    title: "The Comfortables Co.",
    description: "Comfort-first clothing made from Cotton x Bamboo blends.",
    url: "https://thecomfortables.co",
    siteName: "The Comfortables Co.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "The Comfortables Co.",
    description: "Comfort that cares."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interTight.variable} ${cormorant.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
