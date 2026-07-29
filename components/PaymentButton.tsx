"use client";

import React, { useState } from "react";

interface PaymentButtonProps {
  /** Server-rendered session identity used to reject a stale checkout context. */
  authenticatedUserId?: string;
  /** Internal order UUID used to reopen a failed Razorpay order. */
  retryOrderId?: string;
  amount: number;
  currency?: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: Array<{
    productSlug: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  buttonText?: string;
  className?: string;
}

export default function PaymentButton({
  authenticatedUserId,
  retryOrderId,
  amount,
  currency = "INR",
  onSuccess,
  onFailure,
  customerInfo = {},
  items = [],
  shippingAddress,
  buttonText = "Pay with Razorpay",
  className = "w-full py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-teal-light transition-all",
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!authenticatedUserId) {
      onFailure({ message: "Your session has expired. Please sign in again before paying." });
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
      }

      const response = await fetch(retryOrderId ? "/api/retry-payment" : "/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          retryOrderId
            ? { orderId: retryOrderId, sessionUserId: authenticatedUserId }
            : { amount, currency, items, shippingAddress, sessionUserId: authenticatedUserId }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // User is not authenticated — redirect to login
          window.location.href = "/login?redirect=/checkout";
          return;
        }
        throw new Error(errorData.error || "Failed to initiate payment transaction.");
      }

      const orderData = await response.json();

      if (orderData.user_id !== authenticatedUserId) {
        throw new Error("Your checkout session changed. Please refresh the page and try again.");
      }

      console.log("Initializing Razorpay with key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Comfortables Co.",
        description: "Premium Cotton x Bamboo blend apparel",
        order_id: orderData.order_id,
        handler: function (res: any) {
          onSuccess(res);
        },
        prefill: {
          name: customerInfo.name || "",
          email: customerInfo.email || "",
          contact: customerInfo.phone || "",
        },
        notes: {
          address: "Corporate HQ, The Comfortables Co.",
        },
        theme: {
          color: "#2E6F68", // brand teal color
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (resp: any) {
        onFailure(resp.error);
      });
      paymentObject.open();
    } catch (error: any) {
      console.error("Razorpay workflow failed:", error);
      onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || amount <= 0 || !authenticatedUserId}
      className={`${className} flex items-center justify-center gap-2 disabled:opacity-50`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Processing...
        </>
      ) : (
        buttonText
      )}
    </button>
  );
}
