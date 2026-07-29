import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/data/products";
import { getOrders } from "@/lib/data/orders";
import { getReviews } from "@/lib/data/reviews";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Boxes, CircleDollarSign, PackageCheck, ShoppingBag, UsersRound } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Dashboard | The Comfortable Co." };

const statusClass: Record<string, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  refunded: "border-slate-200 bg-slate-100 text-slate-700",
};

export default async function AdminDashboardPage() {
  const [products, orders, reviews] = await Promise.all([getProducts(), getOrders(), getReviews()]);
  const totalRevenue = orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + order.total, 0);
  const lowStockProductsCount = products.filter((product) => Object.values(product.stockBySize).reduce((sum, stock) => sum + stock, 0) < 10).length;
  const pendingReviews = reviews.filter((review) => review.status === "pending").length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const metrics = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), detail: "Live paid orders", icon: CircleDollarSign, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Orders", value: String(orders.length), detail: "Across all payment states", icon: PackageCheck, tone: "bg-teal-50 text-[#2e6f68]" },
    { label: "Low Stock Alert", value: String(lowStockProductsCount), detail: "Products below 10 units", icon: Boxes, tone: "bg-amber-50 text-amber-600" },
    { label: "Pending Reviews", value: String(pendingReviews), detail: "Awaiting moderation", icon: UsersRound, tone: "bg-violet-50 text-violet-600" },
  ];

  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2e6f68]">Store command center</p><h1 className="mt-1 font-display text-4xl font-bold tracking-tight">Good morning, Admin</h1><p className="mt-2 text-sm text-[#727b76]">Here’s what is happening across your store today.</p></div>
      <button className="rounded-xl bg-[#2e6f68] px-4 py-2.5 text-sm font-semibold text-white shadow-sm">Download report</button>
    </div>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-[#e4e7e3] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-[#717a75]">{label}</p><span className={`rounded-xl p-2 ${tone}`}><Icon size={18} /></span></div><p className="mt-5 text-3xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-[#9aa29d]">{detail}</p></div>)}
    </section>

    <section className="grid gap-5 xl:grid-cols-3">
      <div className="rounded-2xl border border-[#e4e7e3] bg-white p-6 shadow-sm xl:col-span-2"><div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">Sales Overview</h2><p className="text-xs text-[#929a96]">Last 7 days · illustrative trend</p></div><span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">+12.8%</span></div><div className="relative mt-8 h-52 overflow-hidden"><div className="absolute inset-x-0 top-0 border-t border-dashed border-[#e8ece8]" /><div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#e8ece8]" /><div className="absolute inset-x-0 bottom-8 border-t border-dashed border-[#e8ece8]" /><svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 210" preserveAspectRatio="none" aria-label="Illustrative sales graph"><defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#6fa8a1" stopOpacity=".28" /><stop offset="1" stopColor="#6fa8a1" stopOpacity="0" /></linearGradient></defs><path d="M0 165 L95 140 L190 150 L285 95 L380 115 L475 52 L570 75 L700 18 L700 210 L0 210Z" fill="url(#salesFill)" /><path d="M0 165 L95 140 L190 150 L285 95 L380 115 L475 52 L570 75 L700 18" fill="none" stroke="#2e6f68" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-semibold text-[#9aa29d]"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div>
      <div className="rounded-2xl border border-[#e4e7e3] bg-white p-6 shadow-sm"><h2 className="font-display text-xl font-bold">Top Categories</h2><p className="text-xs text-[#929a96]">Current sales mix</p><div className="mx-auto mt-6 grid h-36 w-36 place-items-center rounded-full" style={{ background: "conic-gradient(#2e6f68 0 42%, #c9b79c 42% 69%, #8da8a2 69% 86%, #e8ece8 86% 100%)" }}><div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center"><span className="text-lg font-bold">100%</span><span className="-mt-4 text-[9px] text-[#8b938e]">Sales</span></div></div><div className="mt-6 space-y-2 text-xs">{[["Women", "42%", "bg-[#2e6f68]"], ["Loungewear", "27%", "bg-[#c9b79c]"], ["Men", "17%", "bg-[#8da8a2]"]].map(([name, value, color]) => <div key={name} className="flex items-center justify-between"><span className="flex items-center gap-2 text-[#69716d]"><i className={`h-2 w-2 rounded-full ${color}`} />{name}</span><b>{value}</b></div>)}</div></div>
    </section>

    <section className="grid gap-5 xl:grid-cols-3"><div className="rounded-2xl border border-[#e4e7e3] bg-white p-6 shadow-sm xl:col-span-2"><div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">Recent Orders</h2><p className="text-xs text-[#929a96]">Live orders from Supabase</p></div><Link href="/admin/orders" className="flex items-center gap-1 text-sm font-semibold text-[#2e6f68]">View all <ArrowUpRight size={15} /></Link></div><div className="mt-5 divide-y divide-[#edf0ed]">{recentOrders.length ? recentOrders.map((order) => { const firstItem = order.items[0]; const status = order.status; return <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-[190px]"><p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-[#8b938e]">{firstItem?.productName || firstItem?.productSlug || "Order items"} {order.items.length > 1 ? `+ ${order.items.length - 1} more` : ""}</p></div><div className="text-xs text-[#7b847f]">{new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</div><div className="flex items-center gap-3"><span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass[status] ?? "border-blue-200 bg-blue-50 text-blue-700"}`}>{status}</span><b className="text-sm">{formatCurrency(order.total)}</b></div></div>; }) : <p className="py-10 text-center text-sm text-[#8b938e]">No orders yet.</p>}</div></div>
      <div className="rounded-2xl border border-[#e4e7e3] bg-white p-6 shadow-sm"><h2 className="font-display text-xl font-bold">Customer Insights</h2><p className="text-xs text-[#929a96]">Illustrative engagement snapshot</p><div className="mt-6 space-y-5">{[["Returning customers", "36%", "w-[36%]"], ["Checkout conversion", "4.8%", "w-[48%]"], ["Email engagement", "62%", "w-[62%]"]].map(([label, value, width]) => <div key={label}><div className="flex justify-between text-xs"><span className="text-[#6d7671]">{label}</span><b>{value}</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef1ee]"><div className={`h-full rounded-full bg-[#2e6f68] ${width}`} /></div></div>)}</div><Link href="/admin/customers" className="mt-8 flex items-center justify-between rounded-xl bg-[#f2f7f5] p-3 text-sm font-semibold text-[#2e6f68]">View customer list <ArrowUpRight size={16} /></Link></div></section>
  </div>;
}
