"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCommerceStore } from "@/store/commerce-store";
import PaymentButton from "@/components/PaymentButton";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle, ShieldAlert } from "lucide-react";
import { Product } from "@/lib/types";
import {
  fetchCheckoutProfile,
  saveDefaultShippingAddress,
  type CheckoutProfile,
} from "@/lib/actions/customer";

function formatSlugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

function buildFormFromProfile(
  profile: CheckoutProfile,
  user?: { email?: string | null; user_metadata?: Record<string, unknown> }
) {
  const nameParts = (
    profile.name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    ""
  ).split(" ");
  const defaultAddr = profile.defaultAddress;

  return {
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: profile.email || user?.email || "",
    phone: profile.phone || "",
    address: defaultAddr?.street || "",
    city: defaultAddr?.city || "",
    state: defaultAddr?.state || "",
    pinCode: defaultAddr?.postalCode || "",
  };
}

export default function CheckoutClient({
  products = [],
  user,
  customer: initialCustomer,
}: {
  products: Product[];
  user?: { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
  customer?: { id: string; addresses?: unknown[] } | null;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [customerProfile, setCustomerProfile] = useState<CheckoutProfile | null>(null);
  const profileHydratedRef = useRef(false);
  const { cart, clearCart } = useCommerceStore();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saveAsDefaultAddress, setSaveAsDefaultAddress] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // On mount: query DB for the authenticated user's saved profile and hydrate the form once.
  useEffect(() => {
    if (!isHydrated || profileHydratedRef.current) return;

    let cancelled = false;

    async function hydrateFromDatabase() {
      try {
        const profile = await fetchCheckoutProfile();
        if (cancelled) return;

        if (profile) {
          setCustomerProfile(profile);
          setFormData(buildFormFromProfile(profile, user));
        } else if (initialCustomer || user) {
          // Fallback to server-passed props when the action returns nothing
          const fallbackProfile: CheckoutProfile = {
            customerId: initialCustomer?.id ?? "",
            name: (user?.user_metadata?.full_name as string) || "",
            email: user?.email ?? "",
            phone: "",
            defaultAddress: null,
          };
          const addresses = Array.isArray(initialCustomer?.addresses)
            ? initialCustomer.addresses
            : [];
          if (addresses.length > 0) {
            const addr = addresses[0] as CheckoutProfile["defaultAddress"];
            fallbackProfile.defaultAddress = addr;
          }
          setCustomerProfile(fallbackProfile);
          setFormData(buildFormFromProfile(fallbackProfile, user));
        }
      } catch (err) {
        console.error("Failed to hydrate checkout profile:", err);
      } finally {
        if (!cancelled) {
          profileHydratedRef.current = true;
          setProfileLoading(false);
        }
      }
    }

    hydrateFromDatabase();
    return () => {
      cancelled = true;
    };
  }, [isHydrated, initialCustomer, user]);

  const rows = cart.map((item) => {
    const catalogProduct = products.find((p) => p.slug === item.slug);
    const name = catalogProduct?.name || formatSlugToName(item.slug);
    const price = catalogProduct?.price || 999;
    const image = catalogProduct?.image || "/placeholder.jpg";

    return {
      id: `${item.slug}-${item.size || "default"}-${item.color || "default"}`,
      slug: item.slug,
      name,
      price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image,
    };
  });

  const subtotal = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.state &&
    formData.pinCode;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSuccess = async (response: { razorpay_payment_id?: string }) => {
    console.log("Payment successful:", response);
    setPaymentSuccess(true);
    clearCart();

    if (saveAsDefaultAddress && customerProfile?.customerId) {
      try {
        await saveDefaultShippingAddress(customerProfile.customerId, {
          id: customerProfile.defaultAddress?.id,
          label: customerProfile.defaultAddress?.label ?? "Home",
          street: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pinCode,
          country: "India",
        });
      } catch (err) {
        console.error("Failed to save default address", err);
      }
    }
  };

  const handlePaymentFailure = (error: { description?: string; message?: string }) => {
    console.error("Payment failed:", error);
    setPaymentError(error.description || error.message || "Payment transaction could not be processed.");
  };

  if (!isHydrated || profileLoading) {
    return <div className="p-8 text-center text-brand-muted">Loading your order details...</div>;
  }

  if (paymentSuccess) {
    return (
      <section className="container-page py-20 text-center max-w-lg mx-auto flex flex-col items-center">
        <CheckCircle className="text-brand-teal w-20 h-20 mb-6" />
        <h1 className="font-display text-4xl font-semibold text-brand-ink">Order Placed Successfully!</h1>
        <p className="mt-4 text-brand-muted leading-relaxed">
          Thank you for shopping with The Comfortables Co. Your order has been registered and is currently being processed.
        </p>
        <Link
          href="/account"
          className="mt-4 text-brand-teal font-semibold hover:underline"
        >
          View My Orders
        </Link>
        <Link
          href="/shop"
          className="mt-4 px-8 py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-teal-light transition-all"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-16">
      <h1 className="font-display text-5xl font-semibold mb-1">Checkout</h1>
      <p className="text-brand-muted text-sm mb-10">Please fill out your delivery details to complete your payment.</p>

      {paymentError && (
        <div className="mb-6 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm border bg-red-50 border-red-200 text-red-700">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{paymentError}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold mb-6">Delivery Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="First name"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="Last name"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="Email"
              />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="Phone"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="h-12 md:col-span-2 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="Address"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="City"
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="State"
              />
              <input
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="h-12 rounded-brand border border-brand-border bg-transparent px-3 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none"
                placeholder="PIN code"
              />
            </div>

            {user && (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAsDefaultAddress}
                  onChange={(e) => setSaveAsDefaultAddress(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal h-4 w-4"
                />
                <label htmlFor="saveAddress" className="text-sm text-brand-ink cursor-pointer">
                  Save as default shipping address
                </label>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold mb-4">Order Summary</h2>
            {rows.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
                {rows.map((row) => (
                  <div key={row.id} className="flex justify-between items-center text-sm gap-2">
                    <div className="truncate">
                      <span className="font-medium text-brand-ink">{row.name}</span>
                      <span className="text-xs text-brand-muted block">
                        {row.size} · {row.color} · Qty {row.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-brand-ink">{formatCurrency(row.price * row.quantity)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-muted mb-4">No items in your cart.</p>
            )}

            <div className="border-t border-brand-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-brand-border pt-2 text-brand-ink">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="mt-6">
              {isFormValid && subtotal > 0 ? (
                <PaymentButton
                  authenticatedUserId={user?.id}
                  amount={subtotal}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  customerInfo={{
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                  }}
                  items={rows.map((r) => ({
                    productSlug: r.slug,
                    productName: r.name,
                    quantity: r.quantity,
                    price: r.price,
                    size: r.size,
                    color: r.color,
                  }))}
                  shippingAddress={{
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.pinCode,
                    country: "India",
                  }}
                  buttonText={`Pay ${formatCurrency(subtotal)}`}
                />
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-brand-teal/40 text-white font-bold rounded-xl cursor-not-allowed text-center text-sm"
                >
                  Fill Delivery Form to Pay
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
