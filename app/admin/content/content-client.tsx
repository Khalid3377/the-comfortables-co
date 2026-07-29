"use client";

import React, { useState } from "react";
import { SiteSetting } from "@/lib/types";
import { saveSettingsAction, addAnnouncementMessageAction, removeAnnouncementMessageAction, addTimelineItemAction, updateTimelineItemAction, removeTimelineItemAction } from "./actions";
import { Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type BannerPayload = { heading?: string; subheading?: string; cta_text?: string };

export function ContentClient({ settings, bannerPayload }: { settings: SiteSetting; bannerPayload?: unknown }) {
  const router = useRouter();
  const initialBanner = (bannerPayload && typeof bannerPayload === "object" ? bannerPayload : {}) as BannerPayload;
  const [heading, setHeading] = useState(initialBanner.heading || "The Most Comfortable Clothing");
  const [subheading, setSubheading] = useState(initialBanner.subheading || "Premium everyday essentials");
  const [ctaText, setCtaText] = useState(initialBanner.cta_text || "Shop Now");
  const [bannerSaved, setBannerSaved] = useState(false);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [announcementMessages, setAnnouncementMessages] = useState<string[]>(
    settings.announcementMessages || []
  );
  const [announcementSpeed, setAnnouncementSpeed] = useState(settings.announcementSpeed || 3000);
  const [newMsg, setNewMsg] = useState("");

  // Timeline list state
  const [timeline, setTimeline] = useState(settings.sustainabilityTimeline || []);

  const handleSave = async () => {
    await saveSettingsAction({
      announcementMessages,
      announcementSpeed,
      sustainabilityTimeline: timeline,
    });
    alert("Settings updated successfully!");
    router.refresh();
  };

  const handleBannerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBannerSaving(true);
    setBannerSaved(false);
    try {
      const response = await fetch("/api/admin/update-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "banner", slug: "homepage-hero", title: heading, payload: { heading, subheading, cta_text: ctaText } }) });
      if (!response.ok) throw new Error("Unable to save homepage banner");
      setBannerSaved(true);
      router.refresh();
    } catch (error) {
      console.error("Homepage banner save error:", error);
    } finally {
      setBannerSaving(false);
    }
  };

  // Announcement handlers
  const handleAddAnnouncement = async () => {
    if (newMsg) {
      await addAnnouncementMessageAction(newMsg);
      setNewMsg("");
      router.refresh();
    }
  };

  const handleRemoveAnnouncement = async (idx: number) => {
    await removeAnnouncementMessageAction(idx);
    router.refresh();
  };

  // Timeline handlers
  const handleAddTimelineItem = async () => {
    await addTimelineItemAction({ step: "2026", title: "New Milestone", desc: "Details of this innovation step..." });
    router.refresh();
  };

  const handleRemoveTimelineItem = async (idx: number) => {
    await removeTimelineItemAction(idx);
    router.refresh();
  };

  const handleUpdateTimelineItem = async (idx: number, key: string, value: string) => {
    const payload: any = { [key]: value };
    await updateTimelineItemAction(idx, payload);
    router.refresh();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Content & Settings</h1>
          <p className="mt-2 text-brand-muted dark:text-white/60">Customize landing pages and general store text.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-full bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
        >
          <Save size={16} /> Save Settings
        </button>
      </div>

      {/* Hero settings */}
      <form onSubmit={handleBannerSubmit} className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5 space-y-4">
        <h2 className="font-display text-xl font-semibold border-b border-brand-border dark:border-white/10 pb-3">
          Homepage Hero
        </h2>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Title</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Subtitle</label>
          <textarea
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            rows={2}
            className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">CTA text</label>
          <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5" />
        </div>
        <div className="flex items-center gap-3"><button type="submit" disabled={bannerSaving} className="rounded-full bg-brand-teal px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{bannerSaving ? "Saving…" : "Save Hero Banner"}</button>{bannerSaved && <span className="text-sm font-medium text-emerald-700">Homepage banner saved.</span>}</div>
      </form>

      {/* Announcement bar settings */}
      <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5 space-y-4">
        <h2 className="font-display text-xl font-semibold border-b border-brand-border dark:border-white/10 pb-3">
          Announcements Banner
        </h2>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">
            Active Messages
          </label>
          <div className="space-y-2 mb-3">
            {announcementMessages.map((msg, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => {
                    const next = [...announcementMessages];
                    next[idx] = e.target.value;
                    setAnnouncementMessages(next);
                  }}
                  className="flex-1 rounded border border-brand-border bg-brand-paper px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAnnouncement(idx)}
                  className="text-red-500 hover:text-red-700 font-semibold p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add announcement bar text..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-1 rounded border border-brand-border bg-brand-paper px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
            />
            <button
              type="button"
              onClick={handleAddAnnouncement}
              className="px-4 py-2 bg-brand-teal text-white rounded text-sm font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Innovation Timeline Customizer */}
      <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5 space-y-4">
        <div className="flex justify-between items-center border-b border-brand-border dark:border-white/10 pb-3">
          <h2 className="font-display text-xl font-semibold">Fabric Innovation Timeline</h2>
          <button
            onClick={handleAddTimelineItem}
            className="flex items-center gap-1 rounded bg-brand-teal px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-teal-light"
          >
            <Plus size={12} /> Add Milestone
          </button>
        </div>

        <div className="space-y-4">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-brand border border-brand-border bg-brand-paper dark:border-white/5 dark:bg-neutral-900/50 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                  Milestone #{idx + 1}
                </span>
                <button onClick={() => handleRemoveTimelineItem(idx)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-brand-muted mb-1">Step / Year</label>
                  <input
                    type="text"
                    value={item.step}
                    onChange={(e) => handleUpdateTimelineItem(idx, "step", e.target.value)}
                    className="w-full rounded border border-brand-border px-3 py-1.5 text-xs dark:border-white/10 dark:bg-neutral-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold uppercase text-brand-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateTimelineItem(idx, "title", e.target.value)}
                    className="w-full rounded border border-brand-border px-3 py-1.5 text-xs dark:border-white/10 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-brand-muted mb-1">Description</label>
                <textarea
                  value={item.desc}
                  onChange={(e) => handleUpdateTimelineItem(idx, "desc", e.target.value)}
                  rows={2}
                  className="w-full rounded border border-brand-border px-3 py-1.5 text-xs dark:border-white/10 dark:bg-neutral-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
