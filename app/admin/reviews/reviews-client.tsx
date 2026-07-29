"use client";

import React, { useTransition } from "react";
import { Review } from "@/lib/types";
import { approveReviewAction, rejectReviewAction, deleteReviewAction } from "./actions";
import { Star, Check, X, Trash2 } from "lucide-react";

export function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [isPending, startTransition] = useTransition();
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const historyReviews = reviews.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Review Moderation</h1>
        <p className="mt-2 text-brand-muted dark:text-white/60">Moderate user-submitted reviews before publishing.</p>
      </div>

      {/* Pending Reviews Section */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
          Pending Moderation
          <span className="rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-xs font-bold text-amber-600">
            {pendingReviews.length}
          </span>
        </h2>

        {pendingReviews.length === 0 ? (
          <p className="text-sm text-brand-muted dark:text-white/60 italic">No reviews pending moderation.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-brand-muted dark:text-white/60">Product: {review.productSlug}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-brand-border"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-brand-ink dark:text-white leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-brand-border dark:border-white/10 pt-4">
                  <button
                    onClick={() => startTransition(() => { rejectReviewAction(review.id); })}
                    disabled={isPending}
                    className="flex items-center gap-1 rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/20 transition disabled:opacity-60"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() => startTransition(() => { approveReviewAction(review.id); })}
                    disabled={isPending}
                    className="flex items-center gap-1 rounded-full bg-brand-teal px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-teal-light transition disabled:opacity-60"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderation History */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Moderation History</h2>

        <div className="rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border dark:border-white/10 bg-brand-paper dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60">
                <th className="p-4">Reviewer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-white/10 text-sm">
              {historyReviews.map((review) => (
                <tr key={review.id} className="hover:bg-brand-paper/50 dark:hover:bg-white/5 transition">
                  <td className="p-4 font-semibold">{review.name}</td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-brand-border"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-brand-muted dark:text-white/60 truncate max-w-xs">&ldquo;{review.text}&rdquo;</td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        review.status === "approved"
                          ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                          : "bg-red-50 text-red-600 dark:bg-red-950/20"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Delete review forever?")) {
                          startTransition(() => { deleteReviewAction(review.id); });
                        }
                      }}
                      disabled={isPending}
                      className="p-1.5 rounded-full hover:bg-red-50 text-brand-muted hover:text-red-600 transition disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
