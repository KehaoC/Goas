// @ts-nocheck
"use client";

import { z } from "zod";
import { hotspotCardSchema, HotspotCard } from "./hotspot-card";

export const hotspotBoardSchema = z.object({
  category: z.string(),
  title: z.string().optional(),
  hotspots: z.array(hotspotCardSchema),
});

type HotspotBoardProps = z.infer<typeof hotspotBoardSchema>;

const categoryLabels: Record<string, { name: string; icon: string }> = {
  competitor: { name: "竞品动态", icon: "🏢" },
  trending: { name: "热榜", icon: "🔥" },
  ip: { name: "IP热度", icon: "⭐" },
  meme: { name: "热梗", icon: "😂" },
};

export function HotspotBoard({ category, title, hotspots }: HotspotBoardProps) {
  const cat = categoryLabels[category] || { name: category, icon: "📌" };
  const displayTitle = title || `${cat.icon} ${cat.name}`;

  return (
    <div
      className="bg-card border-2 border-pencil p-5"
      style={{
        borderRadius: "var(--wobbly-md)",
        boxShadow: "var(--shadow-soft)",
        backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* Header with squiggly underline */}
      <h3 className="font-heading text-xl text-pencil mb-4 flex items-center gap-2">
        <span className="text-2xl">{cat.icon}</span>
        <span className="squiggly-underline">{displayTitle}</span>
      </h3>

      {/* Hotspot cards */}
      <div className="space-y-3">
        {hotspots.length === 0 ? (
          <div
            className="py-8 text-center border-2 border-dashed border-muted"
            style={{ borderRadius: "var(--wobbly-sm)" }}
          >
            <div className="text-3xl mb-2">📭</div>
            <p className="text-lg text-muted-foreground font-body">暂无数据</p>
          </div>
        ) : (
          hotspots.map((hotspot, index) => (
            <div
              key={hotspot.id}
              style={{ transform: `rotate(${index % 2 === 0 ? 0.5 : -0.5}deg)` }}
            >
              <HotspotCard {...hotspot} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
