"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  Heart,
  Star,
  CreditCard,
  Bell,
  Ruler,
  Settings,
  Lock,
  LogOut,
  Headphones,
  Camera,
  Pencil,
  CheckCircle,
  Calendar,
  ShoppingBag,
  Gift,
  Crown,
  Wallet,
  ChevronRight,
  RotateCcw,
  Download,
  Plus,
  Globe,
  DollarSign,
  Mail,
  Smartphone,
  PackageX,
  Trash2,
  X,
  ShieldCheck,
  AlertTriangle,
  Save,
  RefreshCw,
} from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import PaymentButton from "@/components/PaymentButton";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";
import { fetchPublishedProducts } from "./actions";
import {
  fetchCustomerOrders,
  saveCustomerSettings,
  type NotificationPreferences,
  type SizeProfile,
} from "@/lib/actions/customer";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { formatCurrency } from "@/lib/utils";
import { useCommerceStore } from "@/store/commerce-store";

// ── Types ────────────────────────────────────────────────────────────────────

interface LiveUser {
  name: string;
  email: string;
  avatar: string | null;
  memberSince: string;
}

interface DBOrder {
  id: string;
  order_number: string;
  customer_email: string | null;
  status: string;
  items: unknown;
  total: number;
  created_at: string;
}

interface SavedAddress {
  id: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CustomerProfile {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  addresses: SavedAddress[];
  reward_points: number;
  tier: string;
  total_spent: number;
  size_profile: SizeProfile;
  notification_preferences: NotificationPreferences;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMemberSince(isoDate: string | undefined): string {
  if (!isoDate) return "Recently";
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const INPUT_CLS =
  "h-11 w-full rounded-lg border border-[#EAEAEA] bg-[#FAFAF7] px-3 text-[13px] text-[#2B2B2B] placeholder-[#9CA3AF] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68]/20 outline-none transition-colors";

// ── Component ────────────────────────────────────────────────────────────────

export default function AccountClient({
  user,
  customer,
}: {
  user: SupabaseUser;
  customer: CustomerProfile | null;
}) {
  const router = useRouter();

  // ── Auth state ──────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<SupabaseUser>(user);
  const [liveUser, setLiveUser] = useState<LiveUser>({
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Guest",
    email: user.email ?? "",
    avatar: user.user_metadata?.avatar_url ?? null,
    memberSince: formatMemberSince(user.created_at),
  });
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(customer || {
    id: "",
    auth_user_id: user.id,
    name: user.user_metadata?.name || "Customer",
    email: user.email ?? "",
    addresses: [],
    reward_points: 0,
    tier: "Seedling",
    total_spent: 0,
    size_profile: { chest: "", waist: "", hips: "", preferredFit: "Regular" },
    notification_preferences: { emailAlerts: true, smsUpdates: true, orderUpdates: true, promotions: false, newArrivals: true },
  });
  const [loadingAuth, setLoadingAuth] = useState(false);

  // ── Orders state ────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ── Address state ───────────────────────────────────────────────────────
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // ── Wishlist / product state ────────────────────────────────────────────
  const wishlist = useCommerceStore((s) => s.wishlist);
  const toggleWishlist = useCommerceStore((s) => s.toggleWishlist);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // ── UI state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("My Profile");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ── 1. Fetch orders by internal customer UUID (not auth UUID) ───────────
  useEffect(() => {
    async function loadOrders() {
      if (!customer?.id) {
        setLoadingOrders(false);
        return;
      }

      try {
        const userOrders = await fetchCustomerOrders(customer.id);
        setOrders(userOrders as DBOrder[]);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [customer?.id]);

  // ── 2. Load wishlist products when wishlist tab is active ────────────────
  useEffect(() => {
    if (activeTab !== "Wishlist" || wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }
    setLoadingWishlist(true);
    fetchPublishedProducts()
      .then((all) => {
        setWishlistProducts(all.filter((p) => wishlist.includes(p.slug)));
      })
      .catch(console.error)
      .finally(() => setLoadingWishlist(false));
  }, [activeTab, wishlist]);

  // ── 3. Load recommended products ────────────────────────────────────────
  useEffect(() => {
    fetchPublishedProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  // ── Address helpers ──────────────────────────────────────────────────────
  async function handleAddAddress() {
    if (!authUser || !customerProfile) return;
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      alert("Please fill all address fields.");
      return;
    }
    setAddressSaving(true);
    try {
      const newAddr: SavedAddress = {
        id: `addr_${Date.now()}`,
        label: addressForm.label || "Home",
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        country: "India",
      };
      const updatedAddresses = [...customerProfile.addresses, newAddr];

      const result = await saveCustomerSettings(customerProfile.id, { addresses: updatedAddresses });

      if (!result.success) {
        console.error("Failed to save address:", result.error);
        alert(result.error || "Could not save address. Please try again.");
      } else {
        setCustomerProfile({ ...customerProfile, addresses: updatedAddresses });
        setShowAddressForm(false);
        setAddressForm({ label: "", street: "", city: "", state: "", postalCode: "" });
      }
    } finally {
      setAddressSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!authUser || !customerProfile) return;
    const updated = customerProfile.addresses.filter((a) => a.id !== id);
    const result = await saveCustomerSettings(customerProfile.id, { addresses: updated });

    if (result.success) {
      setCustomerProfile({ ...customerProfile, addresses: updated });
    } else {
      console.error("Failed to delete address:", result.error);
      alert(result.error || "Could not delete address. Please try again.");
    }
  }

  // ── Size Profile state & handler ─────────────────────────────────────────
  const [sizeProfile, setSizeProfile] = useState({
    chest: "",
    waist: "",
    hips: "",
    preferredFit: "Regular",
  });
  const [sizeSaving, setSizeSaving] = useState(false);
  const [sizeSaved, setSizeSaved] = useState(false);

  // Customer data is server-hydrated, so it survives a refresh and is shared by every tab.
  useEffect(() => {
    if (customerProfile.size_profile) setSizeProfile(customerProfile.size_profile);
  }, [customerProfile.size_profile]);

  async function handleSaveSizeProfile() {
    if (!customerProfile.id) return;
    setSizeSaving(true);
    try {
      const result = await saveCustomerSettings(customerProfile.id, { size_profile: sizeProfile });
      if (!result.success) console.error("Size profile save error:", result.error);
      else {
        setCustomerProfile((current) => ({ ...current, size_profile: sizeProfile }));
        setSizeSaved(true);
        setTimeout(() => setSizeSaved(false), 3000);
      }
    } finally {
      setSizeSaving(false);
    }
  }

  // ── Notification preferences state ───────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState({
    emailAlerts: true,
    smsUpdates: true,
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  useEffect(() => {
    if (customerProfile.notification_preferences) setNotifPrefs(customerProfile.notification_preferences);
  }, [customerProfile.notification_preferences]);

  async function handleSaveNotifPrefs() {
    if (!customerProfile.id) return;
    setNotifSaving(true);
    try {
      const result = await saveCustomerSettings(customerProfile.id, { notification_preferences: notifPrefs });
      if (!result.success) console.error("Notification prefs save error:", result.error);
      else {
        setCustomerProfile((current) => ({ ...current, notification_preferences: notifPrefs }));
        setNotifSaved(true);
        setTimeout(() => setNotifSaved(false), 3000);
      }
    } finally {
      setNotifSaving(false);
    }
  }

  async function handleSignOutAllDevices() {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
    router.push("/login");
  }

  // ── Nav items ────────────────────────────────────────────────────────────
  const navItems = [
    { id: "My Profile",       icon: User,    title: "My Profile",       subtitle: "Personal info & preferences" },
    { id: "My Orders",        icon: Package, title: "My Orders",        subtitle: "Track, return or reorder" },
    { id: "My Addresses",     icon: MapPin,  title: "My Addresses",     subtitle: "Manage delivery addresses" },
    { id: "Wishlist",         icon: Heart,   title: "Wishlist",         subtitle: "Your saved favorites" },
    { id: "Rewards & Points", icon: Star,    title: "Rewards & Points", subtitle: "Points, tiers & benefits" },
    { id: "Payment Methods",  icon: CreditCard, title: "Payment Methods", subtitle: "Saved cards & UPI" },
    { id: "Subscriptions",    icon: Bell,    title: "Subscriptions",    subtitle: "Manage your subscriptions" },
    { id: "Size Profile",     icon: Ruler,   title: "Size Profile",     subtitle: "Your measurements" },
    { id: "Notifications",    icon: Settings, title: "Notifications",   subtitle: "Email, SMS & updates" },
    { id: "Privacy & Security", icon: Lock,  title: "Privacy & Security", subtitle: "Manage your data" },
  ];

  // ── Rewards ring ─────────────────────────────────────────────────────────
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const rewardPoints = customerProfile?.reward_points ?? 0;
  const maxPoints = 2000;
  const strokeDashoffsetTarget =
    circumference - (circumference * Math.min(rewardPoints, maxPoints)) / maxPoints;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#6E6E6E]">
          <div className="h-10 w-10 rounded-full border-4 border-[#2E6F68] border-t-transparent animate-spin" />
          <p className="text-sm font-medium">Loading your account…</p>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const displayName       = liveUser?.name ?? "Guest";
  const displayEmail      = liveUser?.email ?? "";
  const displayAvatar     = liveUser?.avatar ?? null;
  const displayMemberSince = liveUser?.memberSince ?? "Recently";
  const ordersCount       = orders.length;
  const totalSpent        = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const savedAddresses    = customerProfile?.addresses ?? [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-brand-muted">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Help Link */}
        <div className="flex justify-end mb-6">
          <a href="/contact" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6E6E6E] hover:text-[#2E6F68] transition-colors">
            <Headphones size={16} />
            <span>Need Help? Visit Help Center</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">

          {/* ── Sidebar ── */}
          <aside className="h-fit rounded-2xl border border-[#EAEAEA] bg-white p-6 md:sticky md:top-24">
            <div className="flex items-center gap-3 border-b border-[#EAEAEA] pb-5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#EAEAEA] bg-[#F0F7F5] flex items-center justify-center shrink-0">
                {displayAvatar ? (
                  <SafeImage src={displayAvatar} alt={displayName} fill sizes="48px" className="object-cover" />
                ) : (
                  <User size={22} className="text-[#2E6F68]" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[15px] font-bold text-[#2B2B2B] truncate">{displayName}</h3>
                <p className="text-[12px] text-[#6E6E6E] truncate">{displayEmail}</p>
              </div>
            </div>

            <nav className="mt-5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                      isActive ? "bg-[#F0F7F5] text-[#2E6F68]" : "text-[#6E6E6E] hover:bg-[#FAFAF7]"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-[#2E6F68]" : "text-[#6E6E6E]"} />
                    <div className="min-w-0">
                      <span className="block text-[14px] font-semibold text-[#2B2B2B]">{item.title}</span>
                      <span className="block text-[11px] text-[#9CA3AF] truncate leading-none mt-0.5">{item.subtitle}</span>
                    </div>
                  </button>
                );
              })}

              <div className="my-4 border-t border-[#EAEAEA]" />

              <button
                onClick={async () => {
                  const supabaseClient = createClient();
                  await supabaseClient.auth.signOut();
                  router.push("/login");
                  router.refresh();
                }}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-red-500 hover:bg-red-50/50 transition-colors"
              >
                <LogOut size={20} />
                <div>
                  <span className="block text-[14px] font-semibold">Log Out</span>
                  <span className="block text-[11px] text-red-400">Sign out from your account</span>
                </div>
              </button>
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="space-y-6">

            {/* ══ MY PROFILE ══ */}
            {activeTab === "My Profile" && (
              <>
                {/* Profile card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#EAEAEA] bg-[#F0F7F5] flex items-center justify-center">
                        {displayAvatar ? (
                          <SafeImage src={displayAvatar} alt={displayName} fill sizes="96px" className="object-cover" />
                        ) : (
                          <User size={40} className="text-[#2E6F68]" />
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAEA] bg-white shadow-sm hover:scale-105 transition-transform" aria-label="Upload Avatar">
                        <Camera size={14} />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="font-display text-2xl font-bold text-[#2B2B2B]">{displayName}</h2>
                      <div className="mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="text-[13px] text-[#6E6E6E]">{displayEmail}</span>
                        {authUser && <><CheckCircle size={14} className="text-[#2E6F68]" /><span className="text-[12px] font-medium text-[#2E6F68]">Verified</span></>}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[12px] text-[#6E6E6E]">
                        <Calendar size={13} />
                        <span>Member since {displayMemberSince}</span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-1.5 self-center sm:self-start rounded-lg border border-[#EAEAEA] px-4 py-2 text-[13px] font-semibold text-[#2B2B2B] hover:bg-[#FAFAF7] transition-colors">
                    <Pencil size={14} /><span>Edit Profile</span>
                  </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { val: ordersCount,              label: "Orders Placed",  sub: "View all orders",      icon: ShoppingBag },
                    { val: rewardPoints,             label: "Rewards Points", sub: "Available points",     icon: Gift },
                    { val: customerProfile?.tier ?? "—", label: "My Tier",  sub: ordersCount > 0 ? "Earning rewards!" : "Complete a purchase", icon: Crown },
                    { val: formatCurrency(totalSpent), label: "Total Spent", sub: "Lifetime value",        icon: Wallet },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EAEAEA] bg-white p-5">
                        <div>
                          <span className="block font-display text-2xl font-bold text-[#2B2B2B]">{stat.val}</span>
                          <span className="block text-[13px] font-semibold text-[#2B2B2B] mt-1">{stat.label}</span>
                          <span className="block text-[12px] text-[#9CA3AF] mt-0.5">{stat.sub}</span>
                        </div>
                        <div className="rounded-lg bg-[#F0F7F5] p-2 text-[#2E6F68]"><Icon size={24} /></div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent orders */}
                <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-4">
                    <h3 className="font-display text-lg font-bold text-[#2B2B2B]">Recent Orders</h3>
                    {ordersCount > 0 && (
                      <button onClick={() => setActiveTab("My Orders")} className="text-[13px] font-semibold text-[#2E6F68] hover:underline">View All Orders →</button>
                    )}
                  </div>
                  <OrdersList orders={orders.slice(0, 3)} loading={loadingOrders} onShop={() => {}} authenticatedUserId={authUser.id} onRetry={(order) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "pending" } : item))} />
                </div>

                {/* Quick Actions + Saved Addresses preview */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                    <h3 className="font-display text-lg font-bold text-[#2B2B2B] mb-5">Quick Actions</h3>
                    <div className="divide-y divide-[#EAEAEA]">
                      {[
                        { label: "Track Your Order",  icon: MapPin },
                        { label: "Return / Exchange", icon: RotateCcw },
                        { label: "Download Invoices", icon: Download },
                        { label: "Contact Support",   icon: Headphones },
                      ].map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <button key={idx} className="flex w-full items-center gap-3 py-3.5 transition-colors hover:text-[#2E6F68]">
                            <div className="rounded-lg bg-[#F0F7F5] p-2 text-[#2E6F68]"><Icon size={18} /></div>
                            <span className="flex-1 text-left text-[14px] font-semibold text-[#2B2B2B]">{action.label}</span>
                            <ChevronRight size={16} className="text-[#9CA3AF]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-bold text-[#2B2B2B]">Saved Addresses</h3>
                      <button onClick={() => setActiveTab("My Addresses")} className="text-[13px] font-semibold text-[#2E6F68] hover:underline">Manage →</button>
                    </div>
                    {savedAddresses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2 text-center">
                        <MapPin size={28} className="text-[#EAEAEA]" />
                        <p className="text-[13px] text-[#9CA3AF]">No saved addresses yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedAddresses.slice(0, 2).map((addr) => (
                          <div key={addr.id} className="rounded-lg border border-[#EAEAEA] p-3 text-[13px]">
                            <span className="font-semibold text-[#2B2B2B] block">{addr.label || "Home"}</span>
                            <span className="text-[#6E6E6E]">{addr.street}, {addr.city} – {addr.postalCode}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => { setActiveTab("My Addresses"); setShowAddressForm(true); }}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#EAEAEA] p-3 text-[13px] font-medium text-[#6E6E6E] hover:border-[#2E6F68] hover:text-[#2E6F68] transition-all">
                      <Plus size={16} /><span>Add New Address</span>
                    </button>
                  </div>
                </div>

                {/* Rewards & Benefits */}
                <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B] mb-6">Rewards & Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-28 h-28 transform -rotate-90">
                          <circle cx="56" cy="56" r={radius} fill="transparent" stroke="#EAEAEA" strokeWidth="8" />
                          <motion.circle cx="56" cy="56" r={radius} fill="transparent" stroke="#2E6F68" strokeWidth="8"
                            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: strokeDashoffsetTarget }}
                            transition={{ duration: 1.2, ease: "easeOut" }} strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-xl font-bold text-[#2B2B2B]">{rewardPoints}</span>
                          <span className="text-[10px] text-[#6E6E6E] font-medium">Points</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-left flex-1 w-full">
                        <span className="text-base font-bold text-[#2B2B2B]">
                          {rewardPoints === 0 ? "🌱 New Member" : rewardPoints < 500 ? "🌸 Bloom" : "🌲 Forest"}
                        </span>
                        <p className="text-[13px] text-[#6E6E6E] mt-1">
                          {rewardPoints === 0 ? "Earn your first points by placing an order" : `${maxPoints - rewardPoints} pts to next tier`}
                        </p>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-[#EAEAEA]">
                          <motion.div className="h-full rounded-full bg-[#2E6F68]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min((rewardPoints / maxPoints) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-[13px] text-[#2B2B2B]">
                      {["Earn 10 points for every ₹100 spent", "Birthday Reward — 500 points", "Early Access to New Drops", "Exclusive Member Offers"].map((b, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-[#2E6F68] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Account Preferences */}
                <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B] mb-5">Account Preferences</h3>
                  <div className="divide-y divide-[#EAEAEA]">
                    {[
                      { label: "Language", value: "English", icon: Globe },
                      { label: "Currency", value: "INR (₹)", icon: DollarSign },
                      { label: "Email Notifications", value: "Enabled", icon: Mail },
                      { label: "SMS Notifications", value: "Enabled", icon: Smartphone },
                    ].map((pref, idx) => {
                      const Icon = pref.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                          <Icon size={20} className="text-[#6E6E6E]" />
                          <span className="flex-1 text-[14px] font-medium text-[#2B2B2B]">{pref.label}</span>
                          <span className="text-[13px] text-[#6E6E6E] font-medium mr-2">{pref.value}</span>
                          <ChevronRight size={16} className="text-[#9CA3AF]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ══ MY ORDERS ══ */}
            {activeTab === "My Orders" && (
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-4">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B]">Order History</h3>
                </div>
                <OrdersList orders={orders} loading={loadingOrders} onShop={() => router.push("/shop")} authenticatedUserId={authUser.id} onRetry={(order) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "pending" } : item))} />
              </div>
            )}

            {/* ══ MY ADDRESSES ══ */}
            {activeTab === "My Addresses" && (
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B]">My Addresses</h3>
                  <button onClick={() => setShowAddressForm(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E6F68] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#265f59] transition-colors">
                    <Plus size={15} /><span>Add Address</span>
                  </button>
                </div>

                {/* Address list */}
                {savedAddresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <MapPin size={36} className="text-[#EAEAEA]" />
                    <p className="text-[15px] font-semibold text-[#2B2B2B]">No saved addresses</p>
                    <p className="text-[13px] text-[#9CA3AF]">Add an address to speed up checkout.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {savedAddresses.map((addr) => (
                      <div key={addr.id} className="relative rounded-xl border border-[#EAEAEA] bg-[#FAFAF7] p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F7F5] px-2 py-0.5 text-[11px] font-semibold text-[#2E6F68] mb-2">
                              <MapPin size={10} />{addr.label || "Home"}
                            </span>
                            <p className="text-[13px] font-medium text-[#2B2B2B]">{addr.street}</p>
                            <p className="text-[12px] text-[#6E6E6E]">{addr.city}, {addr.state} – {addr.postalCode}</p>
                            <p className="text-[12px] text-[#6E6E6E]">{addr.country}</p>
                          </div>
                          <button onClick={() => handleDeleteAddress(addr.id)}
                            className="shrink-0 rounded-lg p-1.5 text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Form (inline slide-down) */}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 rounded-xl border border-[#2E6F68]/20 bg-[#F0F7F5] p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-[#2B2B2B] text-[14px]">New Address</h4>
                        <button onClick={() => setShowAddressForm(false)} className="text-[#9CA3AF] hover:text-[#2B2B2B]">
                          <X size={18} />
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input className={INPUT_CLS + " sm:col-span-2"} placeholder="Label (e.g. Home, Office)"
                          value={addressForm.label} onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))} />
                        <input className={INPUT_CLS + " sm:col-span-2"} placeholder="Street address *"
                          value={addressForm.street} onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))} />
                        <input className={INPUT_CLS} placeholder="City *"
                          value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} />
                        <input className={INPUT_CLS} placeholder="State *"
                          value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} />
                        <input className={INPUT_CLS} placeholder="Postal Code *"
                          value={addressForm.postalCode} onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))} />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button onClick={handleAddAddress} disabled={addressSaving}
                          className="flex-1 rounded-lg bg-[#2E6F68] py-2.5 text-[13px] font-semibold text-white hover:bg-[#265f59] disabled:opacity-50 transition-colors">
                          {addressSaving ? "Saving…" : "Save Address"}
                        </button>
                        <button onClick={() => setShowAddressForm(false)}
                          className="flex-1 rounded-lg border border-[#EAEAEA] bg-white py-2.5 text-[13px] font-semibold text-[#6E6E6E] hover:bg-[#FAFAF7] transition-colors">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ══ WISHLIST ══ */}
            {activeTab === "Wishlist" && (
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B]">My Wishlist</h3>
                  <span className="text-[13px] text-[#9CA3AF]">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <Heart size={36} className="text-[#EAEAEA]" />
                    <p className="text-[15px] font-semibold text-[#2B2B2B]">Your wishlist is empty</p>
                    <p className="text-[13px] text-[#9CA3AF] max-w-xs">Browse our collection and save your favorites for later.</p>
                    <a href="/shop" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#2E6F68] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#265f59] transition-colors">
                      <ShoppingBag size={15} />Browse Shop
                    </a>
                  </div>
                ) : loadingWishlist ? (
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {wishlist.map((slug) => (
                      <div key={slug} className="animate-pulse rounded-xl border border-[#EAEAEA] bg-white p-4 h-[300px]">
                        <div className="aspect-[4/5] bg-neutral-100 rounded-lg w-full" />
                        <div className="h-4 bg-neutral-100 rounded w-2/3 mt-4" />
                        <div className="h-4 bg-neutral-100 rounded w-1/3 mt-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {wishlistProducts.map((product) => (
                      <div key={product.slug} className="relative group">
                        <ProductCard product={product} />
                        <button
                          onClick={() => toggleWishlist(product.slug)}
                          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Heart size={15} fill="currentColor" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ REWARDS & POINTS ══ */}
            {activeTab === "Rewards & Points" && (
              <div className="space-y-6">
                {/* Points hero */}
                <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B] border-b border-[#EAEAEA] pb-4 mb-6">Rewards & Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Ring */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-36 h-36 transform -rotate-90">
                          <circle cx="72" cy="72" r="60" fill="transparent" stroke="#EAEAEA" strokeWidth="10" />
                          <motion.circle cx="72" cy="72" r="60" fill="transparent" stroke="#2E6F68" strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 60}
                            initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 60 - (2 * Math.PI * 60 * Math.min(rewardPoints, maxPoints)) / maxPoints }}
                            transition={{ duration: 1.4, ease: "easeOut" }} strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-bold text-[#2B2B2B]">{rewardPoints}</span>
                          <span className="text-[11px] text-[#6E6E6E] font-medium">pts</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-left space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] px-3 py-1">
                          <Crown size={14} className="text-[#2E6F68]" />
                          <span className="text-[13px] font-bold text-[#2E6F68]">{customerProfile?.tier ?? "Seedling"}</span>
                        </div>
                        <p className="text-[13px] text-[#6E6E6E]">
                          {rewardPoints === 0 ? "Earn your first points by placing an order" : `${maxPoints - Math.min(rewardPoints, maxPoints)} pts to next tier`}
                        </p>
                        <div className="w-48 h-1.5 rounded-full bg-[#EAEAEA] mt-2">
                          <motion.div className="h-full rounded-full bg-[#2E6F68]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min((rewardPoints / maxPoints) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }} />
                        </div>
                        <p className="text-[11px] text-[#9CA3AF]">{Math.min(rewardPoints, maxPoints)} / {maxPoints} pts</p>
                      </div>
                    </div>
                    {/* Tier table */}
                    <div className="space-y-3">
                      {[
                        { tier: "🌱 Seedling", range: "0 – 499 pts",   perks: "10 pts / ₹100" },
                        { tier: "🌸 Bloom",    range: "500 – 1,999 pts", perks: "15 pts / ₹100 + early access" },
                        { tier: "🌲 Forest",   range: "2,000+ pts",     perks: "20 pts / ₹100 + free shipping" },
                      ].map((row) => {
                        const active = customerProfile?.tier === row.tier.split(" ").slice(1).join(" ");
                        return (
                          <div key={row.tier} className={`rounded-xl border p-4 transition-colors ${
                            active ? "border-[#2E6F68] bg-[#F0F7F5]" : "border-[#EAEAEA] bg-white"
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[13px] text-[#2B2B2B]">{row.tier}</span>
                              {active && <span className="text-[11px] font-bold text-[#2E6F68] bg-[#2E6F68]/10 rounded-full px-2 py-0.5">Current</span>}
                            </div>
                            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{row.range}</p>
                            <p className="text-[12px] text-[#6E6E6E] mt-1">{row.perks}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <h4 className="font-display text-base font-bold text-[#2B2B2B] mb-4">All Member Benefits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Earn on Every Order",    desc: "Points for every rupee spent" },
                      { title: "Birthday Bonus",         desc: "500 bonus points every year" },
                      { title: "Early Access",           desc: "Shop new arrivals before anyone" },
                      { title: "Exclusive Offers",       desc: "Member-only discounts & sales" },
                      { title: "Free Shipping",          desc: "Forest tier — always free" },
                      { title: "Priority Support",       desc: "Skip the queue at every step" },
                    ].map((b, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-[#EAEAEA] p-4">
                        <div className="shrink-0 mt-0.5 rounded-full bg-[#F0F7F5] p-1.5"><CheckCircle size={14} className="text-[#2E6F68]" /></div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#2B2B2B]">{b.title}</p>
                          <p className="text-[11px] text-[#9CA3AF]">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ SIZE PROFILE ══ */}
            {activeTab === "Size Profile" && (
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#2B2B2B]">Size Profile</h3>
                    <p className="text-[13px] text-[#9CA3AF] mt-0.5">Your measurements help us recommend the perfect fit.</p>
                  </div>
                  {sizeSaved && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1 text-[12px] font-semibold text-[#16A34A]">
                      <CheckCircle size={13} />Saved!
                    </motion.span>
                  )}
                </div>

                <div className="max-w-lg space-y-5">
                  {/* Measurements */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {([
                      { key: "chest", label: "Chest (in)", placeholder: "e.g. 38" },
                      { key: "waist", label: "Waist (in)", placeholder: "e.g. 32" },
                      { key: "hips",  label: "Hips (in)",  placeholder: "e.g. 40" },
                    ] as const).map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[12px] font-semibold text-[#6E6E6E] mb-1.5">{label}</label>
                        <input type="number" className={INPUT_CLS} placeholder={placeholder}
                          value={sizeProfile[key]}
                          onChange={(e) => setSizeProfile((p) => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>

                  {/* Preferred fit */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#6E6E6E] mb-2">Preferred Fit</label>
                    <div className="flex flex-wrap gap-2">
                      {["Slim", "Regular", "Relaxed", "Oversized"].map((fit) => (
                        <button key={fit}
                          onClick={() => setSizeProfile((p) => ({ ...p, preferredFit: fit }))}
                          className={`rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors ${
                            sizeProfile.preferredFit === fit
                              ? "border-[#2E6F68] bg-[#F0F7F5] text-[#2E6F68]"
                              : "border-[#EAEAEA] bg-white text-[#6E6E6E] hover:border-[#2E6F68]/40"
                          }`}>{fit}</button>
                      ))}
                    </div>
                  </div>

                  {/* Size guide */}
                  <div className="rounded-xl bg-[#FAFAF7] border border-[#EAEAEA] p-4">
                    <p className="text-[12px] font-semibold text-[#2B2B2B] mb-2">Quick Reference</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-[#6E6E6E]">
                        <thead>
                          <tr className="border-b border-[#EAEAEA]">
                            <th className="py-1.5 pr-4 text-left font-semibold text-[#2B2B2B]">Size</th>
                            <th className="py-1.5 pr-4 text-left">Chest</th>
                            <th className="py-1.5 pr-4 text-left">Waist</th>
                            <th className="py-1.5 text-left">Hips</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAEAEA]">
                          {[["S","34–36","28–30","36–38"],["M","38–40","32–34","40–42"],["L","42–44","36–38","44–46"],["XL","46–48","40–42","48–50"]].map(([s,c,w,h]) => (
                            <tr key={s}>
                              <td className="py-1.5 pr-4 font-semibold text-[#2B2B2B]">{s}</td>
                              <td className="py-1.5 pr-4">{c}"</td>
                              <td className="py-1.5 pr-4">{w}"</td>
                              <td className="py-1.5">{h}"</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button onClick={handleSaveSizeProfile} disabled={sizeSaving}
                    className="flex items-center gap-2 rounded-lg bg-[#2E6F68] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#265f59] disabled:opacity-50 transition-colors">
                    <Save size={14} />{sizeSaving ? "Saving…" : "Save Measurements"}
                  </button>
                </div>
              </div>
            )}

            {/* ══ NOTIFICATIONS ══ */}
            {activeTab === "Notifications" && (
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#2B2B2B]">Notification Preferences</h3>
                    <p className="text-[13px] text-[#9CA3AF] mt-0.5">Control how we reach you.</p>
                  </div>
                  {notifSaved && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1 text-[12px] font-semibold text-[#16A34A]">
                      <CheckCircle size={13} />Saved!
                    </motion.span>
                  )}
                </div>

                <div className="divide-y divide-[#EAEAEA]">
                  {([
                    { key: "emailAlerts",  icon: Mail,        label: "Email Alerts",       desc: "Order confirmations and account updates" },
                    { key: "smsUpdates",   icon: Smartphone,  label: "SMS Updates",        desc: "Shipping & delivery notifications" },
                    { key: "orderUpdates", icon: Package,      label: "Order Updates",      desc: "Real-time order status changes" },
                    { key: "newArrivals",  icon: Bell,         label: "New Arrivals",       desc: "Be first to know about new drops" },
                    { key: "promotions",   icon: Gift,         label: "Promotions & Offers",desc: "Deals, discounts and member exclusives" },
                  ] as const).map(({ key, icon: Icon, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#F0F7F5] p-2 text-[#2E6F68]"><Icon size={18} /></div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#2B2B2B]">{label}</p>
                          <p className="text-[12px] text-[#9CA3AF]">{desc}</p>
                        </div>
                      </div>
                      {/* Toggle switch */}
                      <button
                        onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifPrefs[key] ? "bg-[#2E6F68]" : "bg-[#EAEAEA]"
                        }`}
                      >
                        <motion.span
                          layout
                          transition={{ type: "spring", stiffness: 700, damping: 30 }}
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ${
                            notifPrefs[key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={handleSaveNotifPrefs} disabled={notifSaving}
                  className="flex items-center gap-2 rounded-lg bg-[#2E6F68] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#265f59] disabled:opacity-50 transition-colors">
                  <Save size={14} />{notifSaving ? "Saving…" : "Save Preferences"}
                </button>
              </div>
            )}

            {/* ══ PRIVACY & SECURITY ══ */}
            {activeTab === "Privacy & Security" && (
              <div className="space-y-6">
                {/* Account Security */}
                <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B] border-b border-[#EAEAEA] pb-4 mb-5">Account Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-[#EAEAEA] p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#F0F7F5] p-2 text-[#2E6F68]"><Lock size={18} /></div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#2B2B2B]">Password</p>
                          <p className="text-[12px] text-[#9CA3AF]">Managed via Google OAuth — no password stored</p>
                        </div>
                      </div>
                      <span className="text-[12px] font-semibold text-[#9CA3AF] bg-[#FAFAF7] rounded-full px-3 py-1 border border-[#EAEAEA]">OAuth</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[#EAEAEA] p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#F0F7F5] p-2 text-[#2E6F68]"><ShieldCheck size={18} /></div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#2B2B2B]">Two-Factor Authentication</p>
                          <p className="text-[12px] text-[#9CA3AF]">Add an extra layer via Google Account settings</p>
                        </div>
                      </div>
                      <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer"
                        className="text-[12px] font-semibold text-[#2E6F68] hover:underline">Manage →</a>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[#EAEAEA] p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#F0F7F5] p-2 text-[#2E6F68]"><RefreshCw size={18} /></div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#2B2B2B]">Sign Out of All Devices</p>
                          <p className="text-[12px] text-[#9CA3AF]">Revoke all active sessions globally</p>
                        </div>
                      </div>
                      <button onClick={handleSignOutAllDevices}
                        className="text-[12px] font-semibold text-red-500 hover:underline">Sign Out All</button>
                    </div>
                  </div>
                </div>

                {/* Data & Privacy */}
                <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 md:p-8">
                  <h3 className="font-display text-lg font-bold text-[#2B2B2B] border-b border-[#EAEAEA] pb-4 mb-5">Data & Privacy</h3>
                  <div className="space-y-4 text-[13px] text-[#6E6E6E]">
                    <div className="flex items-start gap-3 rounded-xl bg-[#FAFAF7] border border-[#EAEAEA] p-4">
                      <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <p>Your data is securely stored and never sold to third parties. We comply with India's Digital Personal Data Protection Act (DPDPA).</p>
                    </div>
                    <div className="divide-y divide-[#EAEAEA]">
                      {[
                        { label: "Download My Data", action: "Request export of your account data" },
                        { label: "Delete My Account", action: "Permanently remove all your data" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                          <div>
                            <p className="text-[14px] font-semibold text-[#2B2B2B]">{item.label}</p>
                            <p className="text-[12px] text-[#9CA3AF]">{item.action}</p>
                          </div>
                          <button className={`text-[12px] font-semibold ${
                            item.label.includes("Delete") ? "text-red-500 hover:underline" : "text-[#2E6F68] hover:underline"
                          }`}>
                            {item.label.includes("Delete") ? "Delete →" : "Request →"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ FALLBACK for remaining tabs (Payment Methods, Subscriptions) ══ */}
            {!["My Profile", "My Orders", "My Addresses", "Wishlist", "Rewards & Points", "Size Profile", "Notifications", "Privacy & Security"].includes(activeTab) && (
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-8 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F7F5] text-[#2E6F68] mb-4">
                  {(() => {
                    const matched = navItems.find((n) => n.id === activeTab);
                    if (matched) { const Icon = matched.icon; return <Icon size={24} />; }
                    return null;
                  })()}
                </span>
                <h3 className="font-display text-lg font-bold text-[#2B2B2B]">{activeTab}</h3>
                <p className="mt-2 text-[14px] text-[#6E6E6E]">This section is coming soon.</p>
              </div>
            )}

            {/* You May Also Like */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-[#2B2B2B]">You May Also Like</h3>
                <a href="/shop" className="text-[13px] font-semibold text-[#2E6F68] hover:underline">View All &gt;</a>
              </div>
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="animate-pulse rounded-xl border border-[#EAEAEA] bg-white p-4 h-[300px]">
                      <div className="aspect-[4/5] bg-neutral-100 rounded-lg w-full" />
                      <div className="h-4 bg-neutral-100 rounded w-2/3 mt-4" />
                      <div className="h-4 bg-neutral-100 rounded w-1/3 mt-2" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {products.map((p) => <ProductCard key={p.slug} product={p} />)}
                </div>
              ) : (
                <p className="text-[14px] text-[#6E6E6E]">No recommended products found.</p>
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// ── Extracted OrdersList sub-component ───────────────────────────────────────

function OrdersList({
  orders,
  loading,
  onShop,
  authenticatedUserId,
  onRetry,
}: {
  orders: DBOrder[];
  loading: boolean;
  onShop: () => void;
  authenticatedUserId: string;
  onRetry: (order: DBOrder) => void;
}) {
  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const statusBadgeClass = (status: string) => {
    const normalized = status.toLowerCase();
    switch (normalized) {
      case "failed":
      case "cancelled":
        return "border border-red-200 bg-red-50 text-red-700";
      case "refunded":
        return "border border-slate-200 bg-slate-100 text-slate-700";
      case "paid":
      case "delivered":
      case "completed":
      case "success":
        return "border border-emerald-200 bg-emerald-50 text-emerald-700";
      case "pending":
      case "processing":
        return "border border-amber-200 bg-amber-50 text-amber-700";
      default:
        return "border border-blue-200 bg-blue-50 text-blue-700";
    }
  };

  const displayStatus = (status: string) => {
    const normalized = status.toLowerCase();
    if (["paid", "delivered", "completed", "success"].includes(normalized)) return "Paid";
    if (["failed", "cancelled"].includes(normalized)) return "Failed";
    if (["pending", "processing"].includes(normalized)) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <div className="py-8 text-center text-sm text-[#9CA3AF]">Loading your orders…</div>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F7F5]">
          <PackageX size={26} className="text-[#2E6F68]" />
        </div>
        <p className="text-[15px] font-semibold text-[#2B2B2B]">No orders placed yet</p>
        <p className="text-[13px] text-[#9CA3AF] max-w-xs">Your order history will appear here once you make your first purchase.</p>
        <button onClick={onShop} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#2E6F68] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#265f59] transition-colors">
          <ShoppingBag size={15} />Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#EAEAEA]">
      {orders.map((order) => {
        const itemsList = Array.isArray(order.items) ? order.items : [];
        return (
          <div key={order.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-[14px] font-bold text-[#2B2B2B] block">Order #{order.order_number.slice(-8).toUpperCase()}</span>
                <span className="text-[12px] text-[#9CA3AF]">Placed on {formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold capitalize ${statusBadgeClass(order.status)}`}>{displayStatus(order.status)}</span>
                <span className="text-[14px] font-bold text-[#2B2B2B]">{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="space-y-2">
              {itemsList.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 shrink-0 rounded bg-neutral-100 flex items-center justify-center text-xs font-semibold text-brand-muted">{item.quantity}x</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2B2B2B] truncate">{item.productName}</p>
                    <p className="text-[11px] text-[#6E6E6E] truncate">
                      {item.size ? `Size: ${item.size}` : ""} {item.color ? `· Color: ${item.color}` : ""}
                    </p>
                  </div>
                  <span className="font-semibold text-xs text-[#2B2B2B]">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            {order.status === "failed" && (
              <div className="mt-4 max-w-[180px]">
                <PaymentButton
                  authenticatedUserId={authenticatedUserId}
                  retryOrderId={order.id}
                  amount={order.total}
                  buttonText="Retry Payment"
                  className="w-full rounded-lg bg-[#2E6F68] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#265f59]"
                  onSuccess={() => onRetry(order)}
                  onFailure={(error) => console.error("Retry payment failed:", error)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
