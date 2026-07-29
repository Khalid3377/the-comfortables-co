import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Us",
  description: "Founder story, mission, values, and our journey at The Comfortables Co."
};

export default function AboutPage() {
  return <AboutClient />;
}
