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
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-3">{displayTitle}</h3>
      <div className="space-y-2">
        {hotspots.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">暂无数据</div>
        ) : (
          hotspots.map((hotspot) => (
            <HotspotCard key={hotspot.id} {...hotspot} />
          ))
        )}
      </div>
    </div>
  );
}
