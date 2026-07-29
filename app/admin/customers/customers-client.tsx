"use client";

import React, { useState } from "react";
import { Customer, Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Eye, X } from "lucide-react";

interface CustomerWithOrders extends Customer {
  orders: Order[];
  totalSpent: number;
}

export function CustomersClient({
  customers,
  allOrders,
}: {
  customers: Customer[];
  allOrders: Order[];
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithOrders | null>(null);

  // Match orders and calculate total spent for each customer
  const customersWithStats: CustomerWithOrders[] = customers.map((c) => {
    const customerOrders = allOrders.filter(
      (o) => o.customerEmail.toLowerCase() === c.email.toLowerCase()
    );
    const totalSpent = customerOrders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ...c,
      orders: customerOrders,
      totalSpent,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-2 text-brand-muted dark:text-white/60">
          View customer history, purchase frequency, and lifetime value.
        </p>
      </div>

      <div className="rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border dark:border-white/10 bg-brand-paper dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-center">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4 text-right">History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border dark:divide-white/10 text-sm">
            {customersWithStats.map((customer) => (
              <tr key={customer.id} className="hover:bg-brand-paper/50 dark:hover:bg-white/5 transition">
                <td className="p-4 font-semibold">{customer.name}</td>
                <td className="p-4 text-brand-muted dark:text-white/60 font-mono text-xs">
                  {customer.email}
                </td>
                <td className="p-4 text-brand-muted dark:text-white/60">
                  {new Date(customer.joinedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-center font-semibold">{customer.orders.length}</td>
                <td className="p-4 font-semibold text-brand-teal">
                  {formatCurrency(customer.totalSpent)}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
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
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">
              Customer Profile: {selectedCustomer.name}
            </h2>

            <div className="space-y-6">
              {/* Contact Profile Summary */}
              <div className="grid grid-cols-2 gap-4 border-b border-brand-border dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">Email</h3>
                  <p className="font-mono text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">Member Since</h3>
                  <p className="text-sm">{new Date(selectedCustomer.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-4">
                  Order History ({selectedCustomer.orders.length} orders)
                </h3>
                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-sm text-brand-muted dark:text-white/60 italic">No orders found.</p>
                ) : (
                  <div className="divide-y divide-brand-border dark:divide-white/10 max-h-60 overflow-y-auto pr-2">
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                        <div>
                          <p className="font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-brand-muted dark:text-white/60">
                            {new Date(order.createdAt).toLocaleDateString()} | {order.fulfillmentStatus}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(order.total)}</p>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                              order.paymentStatus === "Paid"
                                                    ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                                                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="flex justify-between items-center pt-4 border-t border-brand-border dark:border-white/10 font-semibold text-lg">
                <span>Lifetime Value (LTV)</span>
                <span className="text-brand-teal">{formatCurrency(selectedCustomer.totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
