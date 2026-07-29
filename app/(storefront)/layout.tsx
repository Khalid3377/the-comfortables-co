import React from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { BackToTop } from "@/components/back-to-top";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { getSettings } from "@/lib/data/settings";
import { getProducts } from "@/lib/data/products";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const products = await getProducts({ publishedOnly: true });
  const messages = settings.announcementMessages;
  const speed = `${settings.announcementSpeed}s`;

  return (
    <>
      <header className="sticky top-0 z-[60] w-full">
        <AnnouncementBar messages={messages} speed={speed} />
        <Navbar products={products} />
      </header>
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
