import { SiteSetting } from "../types";
import { createAdminClient } from "../supabase/admin";
import { Json } from "../supabase/types";

export async function getSettings(): Promise<SiteSetting> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");
    if (error) throw error;
    
    const settings: SiteSetting = {
      announcementMessages: [],
      announcementSpeed: 5,
      heroTitle: "",
      heroSubtitle: "",
      comfortPromise: [],
      sustainabilityTimeline: []
    };

    data?.forEach((row) => {
      if (row.key === "announcement_messages") settings.announcementMessages = row.value as string[];
      if (row.key === "announcement_speed") settings.announcementSpeed = Number(row.value);
      if (row.key === "hero_title") settings.heroTitle = row.value as string;
      if (row.key === "hero_subtitle") settings.heroSubtitle = row.value as string;
      if (row.key === "comfort_promise") settings.comfortPromise = row.value as { title: string; text: string }[];
      if (row.key === "sustainability_timeline") settings.sustainabilityTimeline = row.value as { step: string; title: string; desc: string }[];
    });

    return settings;
  } catch (error) {
    console.error("Error in getSettings:", error);
    return {
      announcementMessages: [],
      announcementSpeed: 5,
      heroTitle: "",
      heroSubtitle: "",
      comfortPromise: [],
      sustainabilityTimeline: []
    };
  }
}

export async function updateSettings(data: Partial<SiteSetting>): Promise<SiteSetting> {
  const supabase = createAdminClient();
  const updates: Array<{ key: string; value: Json }> = [];
  if (data.announcementMessages !== undefined) updates.push({ key: "announcement_messages", value: data.announcementMessages as Json });
  if (data.announcementSpeed !== undefined) updates.push({ key: "announcement_speed", value: data.announcementSpeed as Json });
  if (data.heroTitle !== undefined) updates.push({ key: "hero_title", value: data.heroTitle as Json });
  if (data.heroSubtitle !== undefined) updates.push({ key: "hero_subtitle", value: data.heroSubtitle as Json });
  if (data.comfortPromise !== undefined) updates.push({ key: "comfort_promise", value: data.comfortPromise as unknown as Json });
  if (data.sustainabilityTimeline !== undefined) updates.push({ key: "sustainability_timeline", value: data.sustainabilityTimeline as unknown as Json });

  for (const update of updates) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(update, { onConflict: "key" });
    if (error) throw error;
  }
  return await getSettings();
}

export async function addAnnouncementMessage(msg: string): Promise<SiteSetting> {
  const current = await getSettings();
  const announcements = [...(current.announcementMessages || []), msg];
  return await updateSettings({ announcementMessages: announcements });
}

export async function removeAnnouncementMessage(idx: number): Promise<SiteSetting> {
  const current = await getSettings();
  const announcements = (current.announcementMessages || []).filter((_, i) => i !== idx);
  return await updateSettings({ announcementMessages: announcements });
}

export async function setHeroTitle(title: string): Promise<SiteSetting> {
  return await updateSettings({ heroTitle: title });
}

export async function setHeroSubtitle(subtitle: string): Promise<SiteSetting> {
  return await updateSettings({ heroSubtitle: subtitle });
}

export async function addTimelineItem(item: { step: string; title: string; desc: string }): Promise<SiteSetting> {
  const current = await getSettings();
  const timeline = [...(current.sustainabilityTimeline || []), item];
  return await updateSettings({ sustainabilityTimeline: timeline });
}

export async function updateTimelineItem(idx: number, payload: Partial<{ step: string; title: string; desc: string }>): Promise<SiteSetting> {
  const current = await getSettings();
  const timeline = (current.sustainabilityTimeline || []).map((itm, i) => (i === idx ? { ...itm, ...payload } : itm));
  return await updateSettings({ sustainabilityTimeline: timeline });
}

export async function removeTimelineItem(idx: number): Promise<SiteSetting> {
  const current = await getSettings();
  const timeline = (current.sustainabilityTimeline || []).filter((_, i) => i !== idx);
  return await updateSettings({ sustainabilityTimeline: timeline });
}
