// app/admin/content/actions.tsx

"use server";

import { SiteSetting } from "@/lib/types";
import {
  addAnnouncementMessage,
  removeAnnouncementMessage,
  setHeroTitle,
  setHeroSubtitle,
  addTimelineItem,
  updateTimelineItem,
  removeTimelineItem,
  updateSettings,
} from "@/lib/data/settings";

/** Save generic settings (hero, announcements, timeline, etc.) */
export async function saveSettingsAction(data: Partial<SiteSetting>) {
  await updateSettings(data);
}

/** Announcement bar actions */
export async function addAnnouncementMessageAction(message: string) {
  await addAnnouncementMessage(message);
}

export async function removeAnnouncementMessageAction(index: number) {
  await removeAnnouncementMessage(index);
}

/** Hero title / subtitle actions */
export async function setHeroTitleAction(title: string) {
  await setHeroTitle(title);
}

export async function setHeroSubtitleAction(subtitle: string) {
  await setHeroSubtitle(subtitle);
}

/** Timeline actions */
export async function addTimelineItemAction(item: { step: string; title: string; desc: string }) {
  await addTimelineItem(item);
}

export async function updateTimelineItemAction(index: number, payload: Partial<{ step: string; title: string; desc: string }>) {
  await updateTimelineItem(index, payload);
}

export async function removeTimelineItemAction(index: number) {
  await removeTimelineItem(index);
}
