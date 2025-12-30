// @ts-nocheck
"use client";

import { z } from "zod";

export const hotspotCardSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  heatScore: z.number().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

type HotspotCardProps = z.infer<typeof hotspotCardSchema>;

const categoryLabels: Record<string, { name: string; icon: string }> = {
  competitor: { name: "竞品", icon: "🏢" },
  trending: { name: "热榜", icon: "🔥" },
  ip: { name: "IP", icon: "⭐" },
  meme: { name: "热梗", icon: "😂" },
};

export function HotspotCard({ title, description, heatScore, category }: HotspotCardProps) {
  const cat = categoryLabels[category] || { name: category, icon: "📌" };

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{cat.icon}</span>
            <span className="text-xs text-gray-500">{cat.name}</span>
          </div>
          <h4 className="font-medium text-gray-900 truncate">{title}</h4>
          {description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
          )}
        </div>
        {heatScore !== null && heatScore !== undefined && (
          <div className="flex-shrink-0 bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-medium">
            🔥 {heatScore}
          </div>
        )}
      </div>
    </div>
  );
}
