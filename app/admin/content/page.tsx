import { getSettings } from "@/lib/data/settings";
import { ContentClient } from "./content-client";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Content & Settings Management | The Comfortable Co.",
};

export default async function AdminContentPage() {
  const settings = await getSettings();
  const { data: hero } = await createAdminClient().from("store_content").select("payload").eq("slug", "homepage-hero").maybeSingle();
  return <ContentClient settings={settings} bannerPayload={hero?.payload} />;
}
