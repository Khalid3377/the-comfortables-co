import type { Metadata } from "next";
import { getSettings } from "@/lib/data/settings";
import { FabricInnovationClient } from "@/components/fabric-innovation/FabricInnovationClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fabric Innovation",
  description: "Cotton familiarity, bamboo intelligence. Learn about our micro-air-channel spinning and circular tension knitting."
};

export default async function FabricInnovationPage() {
  const settings = await getSettings();
  return <FabricInnovationClient timeline={settings.sustainabilityTimeline} />;
}
