"use client";

import { useEffect, useRef } from "react";
import { initAnnouncementBar } from "@/lib/announcement-bar";

const DEFAULT_MESSAGES = [
  "COTTON × BAMBOO — OEKO-TEX CERTIFIED",
  "30-DAY SOFTNESS GUARANTEE",
  "MATERNITY • BABY • EVERYDAY",
  "FREE SHIPPING OVER ₹1,999"
];

interface AnnouncementBarProps {
  messages?: string[];
  bg?: string;
  height?: string;
  fontSize?: string;
  letterSpacing?: string;
  gap?: string;
  speed?: string;
}

export function AnnouncementBar({
  messages = DEFAULT_MESSAGES,
  bg,
  height,
  fontSize,
  letterSpacing,
  gap,
  speed
}: AnnouncementBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;

    if (track && container) {
      initAnnouncementBar(track, messages, {
        bg,
        height,
        fontSize,
        letterSpacing,
        gap,
        speed,
        containerElement: container
      });
    }
  }, [messages, bg, height, fontSize, letterSpacing, gap, speed]);

  return (
    <div
      ref={containerRef}
      className="announcement-bar"
      role="region"
      aria-label="Announcement bar"
    >
      <div
        ref={trackRef}
        className="announcement-bar__track"
      />
    </div>
  );
}
