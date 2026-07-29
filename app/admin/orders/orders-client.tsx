"use client";

import React, { useState } from "react";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatusesAction } from "./actions";
import { Eye, X } from "lucide-react";

export function OrdersClient({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("All");

  const filteredOrders = orders.filter((o) => {
    const pmMatch = paymentFilter === "All" || o.paymentStatus === paymentFilter;
    const ffMatch = fulfillmentFilter === "All" || o.fulfillmentStatus === fulfillmentFilter;
    return pmMatch && ffMatch;
  });

  const handleUpdateStatus = async (
    id: string,
    updates: Partial<Pick<Order, "status" | "paymentStatus" | "fulfillmentStatus">>
  ) => {
    await updateOrderStatusesAction(id, updates);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, ...updates });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-2 text-brand-muted dark:text-white/60">
          Track customer purchases and update fulfillment status.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between rounded-brand border border-brand-border bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">Payment</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-brand border border-brand-border bg-brand-paper px-3 py-1.5 text-sm outline-none dark:border-white/10 dark:bg-neutral-800"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">Fulfillment</label>
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="rounded-brand border border-brand-border bg-brand-paper px-3 py-1.5 text-sm outline-none dark:border-white/10 dark:bg-neutral-800"
            >
              <option value="All">All Fulfillments</option>
              <option value="Unfulfilled">Unfulfilled</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="text-sm font-semibold text-brand-muted">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border dark:border-white/10 bg-brand-paper dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Fulfillment</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border dark:divide-white/10 text-sm">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-brand-paper/50 dark:hover:bg-white/5 transition">
                <td className="p-4 font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</td>
                <td className="p-4">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-xs text-brand-muted dark:text-white/60">{order.customerEmail}</p>
                </td>
                <td className="p-4 text-brand-muted dark:text-white/60">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                        : order.paymentStatus === "Pending"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                        : "bg-red-50 text-red-600 dark:bg-red-950/20"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.fulfillmentStatus === "Delivered"
                        ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                        : order.fulfillmentStatus === "Shipped"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </td>
                <td className="p-4 font-semibold">{formatCurrency(order.total)}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 rounded-full hover:bg-brand-paper dark:hover:bg-white/10 text-brand-teal transition"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">
              Order Details: #{selectedOrder.id.slice(-8).toUpperCase()}
            </h2>

            <div className="space-y-6">
              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-2 gap-4 border-b border-brand-border dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Customer</h3>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Shipping Address</h3>
                  <p className="text-sm leading-relaxed">
                    {typeof selectedOrder.shippingAddress === "string"
                      ? selectedOrder.shippingAddress
                      : selectedOrder.shippingAddress
                      ? `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} ${selectedOrder.shippingAddress.postalCode}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Order Status Management */}
              <div className="grid grid-cols-2 gap-4 border-b border-brand-border dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Payment Status</h3>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, {
                        paymentStatus: e.target.value as Order["paymentStatus"],
                      })
                    }
                    className="rounded border border-brand-border bg-brand-paper px-3 py-1 text-sm outline-none dark:border-white/10 dark:bg-neutral-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Fulfillment Status</h3>
                  <select
                    value={selectedOrder.fulfillmentStatus}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, {
                        fulfillmentStatus: e.target.value as Order["fulfillmentStatus"],
                      })
                    }
                    className="rounded border border-brand-border bg-brand-paper px-3 py-1 text-sm outline-none dark:border-white/10 dark:bg-neutral-800"
                  >
                    <option value="Unfulfilled">Unfulfilled</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-4">Items Ordered</h3>
                <div className="divide-y divide-brand-border dark:divide-white/10">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-semibold">{item.productName || item.productSlug}</p>
                        <p className="text-xs text-brand-muted dark:text-white/60">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-between items-center pt-4 border-t border-brand-border dark:border-white/10 font-semibold text-lg">
                <span>Total Amount Paid/Due</span>
                <span>{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
