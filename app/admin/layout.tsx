"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./actions";
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  FolderTree,
  BookOpen,
  MessageSquare,
  Percent,
  Users,
  LogOut,
  Search,
  Grid2X2,
  Bell,
  ChevronDown,
  Image,
  FileText,
  Truck,
  CreditCard,
  Send,
  Tag,
  Package,
  Grid,
  Sparkles,
  User,
  Heart,
  Baby,
  Star,
  Cloud,
  Megaphone,
  BarChart,
  Archive,
  Settings,
} from "lucide-react";

const navGroups = [
  { label: "Manage", items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { label: "Discounts", href: "/admin/discounts", icon: Tag },
  ] },
  { label: "Catalogue", items: [
    { label: "Categories", href: "/admin/categories", icon: Grid },
    { label: "New In", href: "/admin/catalogue/new-in", icon: Sparkles },
    { label: "Men", href: "/admin/catalogue/men", icon: User },
    { label: "Women", href: "/admin/catalogue/women", icon: Heart },
    { label: "Maternity", href: "/admin/catalogue/maternity", icon: Baby },
    { label: "Baby & Kids", href: "/admin/catalogue/baby-kids", icon: Star },
    { label: "Loungewear", href: "/admin/catalogue/loungewear", icon: Cloud },
  ] },
  { label: "Content", items: [
    { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
    { label: "Content & Settings", href: "/admin/content", icon: Settings },
    { label: "Announcement Bar", href: "/admin/content#announcement", icon: Megaphone },
  ] },
  { label: "Analytics", items: [
    { label: "Sales Overview", href: "/admin/analytics", icon: BarChart },
    { label: "Inventory", href: "/admin/inventory", icon: Archive },
  ] },
  { label: "Store", items: [
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the login page, do not render layout decorations
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5] text-[#202522] dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col justify-between border-r border-[#e4e7e3] bg-white p-6 dark:border-white/10 dark:bg-white/5 lg:flex">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-display text-lg font-bold tracking-tight">THE COMFORTABLE CO.</span>
            <span className="rounded bg-brand-teal/10 px-2 py-0.5 text-[10px] font-bold text-brand-teal tracking-wide">
              ADMIN
            </span>
          </div>

          <Link href="/admin" className={`mt-8 flex-shrink-0 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${pathname === "/admin" ? "bg-[#2e6f68] text-white" : "text-[#68706c] hover:bg-[#f2f5f2]"}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <nav className="mt-5 space-y-5 flex-1 overflow-y-auto pr-2 pb-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa29d]">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href && !(item.href === "/admin/content" && pathname !== "/admin/content");
                    return <Link key={`${group.label}-${item.label}`} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-[#e7f2ef] text-[#27645e]" : "text-[#68706c] hover:bg-[#f2f5f2]"}`}><Icon size={17} />{item.label}</Link>;
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-4 flex-shrink-0">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e4e7e3] bg-white/95 px-5 backdrop-blur lg:px-10 dark:border-white/10 dark:bg-black/80">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909894]" size={18} />
            <input aria-label="Search admin" placeholder="Search orders, products, customers..." className="h-10 w-full rounded-xl border border-[#e4e7e3] bg-[#f8faf8] pl-10 pr-4 text-sm outline-none focus:border-[#2e6f68]" />
          </div>
          <div className="ml-4 flex items-center gap-3">
            <button aria-label="Toggle layout view" className="hidden rounded-xl border border-[#e4e7e3] p-2 text-[#5f6964] sm:block"><Grid2X2 size={18} /></button>
            <button aria-label="Notifications" className="rounded-xl border border-[#e4e7e3] p-2 text-[#5f6964]"><Bell size={18} /></button>
            <button className="flex items-center gap-2 rounded-xl border border-[#e4e7e3] p-1.5 pl-2 text-left">
              <span className="hidden text-xs font-semibold sm:block">Store Admin</span><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#2e6f68] text-xs font-bold text-white">SA</span><ChevronDown size={14} className="text-[#89918c]" />
            </button>
          </div>
        </header>
        <main className="p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
