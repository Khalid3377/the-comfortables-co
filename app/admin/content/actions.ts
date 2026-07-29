"use server";

import { updateSettings } from "@/lib/data/settings";
import { addAnnouncementMessage, removeAnnouncementMessage, addTimelineItem, updateTimelineItem, removeTimelineItem, setHeroTitle, setHeroSubtitle } from "@/lib/data/settings";
import { SiteSetting } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveSettingsAction(data: Partial<SiteSetting>) {
  await updateSettings(data);
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/fabric-innovation");
}

// New actions
export async function addAnnouncementMessageAction(msg: string) {
  await addAnnouncementMessage(msg);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function removeAnnouncementMessageAction(idx: number) {
  await removeAnnouncementMessage(idx);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function setHeroTitleAction(title: string) {
  await setHeroTitle(title);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function setHeroSubtitleAction(subtitle: string) {
  await setHeroSubtitle(subtitle);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function addTimelineItemAction(item: { step: string; title: string; desc: string }) {
  await addTimelineItem(item);
  revalidatePath("/admin/content");
  revalidatePath("/fabric-innovation");
}

export async function updateTimelineItemAction(idx: number, payload: Partial<{ step: string; title: string; desc: string }>) {
  await updateTimelineItem(idx, payload);
  revalidatePath("/admin/content");
  revalidatePath("/fabric-innovation");
}

export async function removeTimelineItemAction(idx: number) {
  await removeTimelineItem(idx);
  revalidatePath("/admin/content");
  revalidatePath("/fabric-innovation");
}
