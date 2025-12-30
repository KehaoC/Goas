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
    <div
      className="bg-card border-2 border-pencil p-4 hover:shadow-hand transition-all duration-100 group cursor-pointer"
      style={{
        borderRadius: "var(--wobbly-sm)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Category tag */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary border border-pencil text-sm font-body"
              style={{ borderRadius: "var(--wobbly-sm)", transform: "rotate(-1deg)" }}
            >
              <span>{cat.icon}</span>
              <span className="text-muted-foreground">{cat.name}</span>
            </span>
          </div>

          {/* Title */}
          <h4 className="font-heading text-lg text-pencil group-hover:text-ink-red transition-colors truncate">
            {title}
          </h4>

          {/* Description */}
          {description && (
            <p className="text-base text-muted-foreground font-body mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Heat score badge */}
        {heatScore !== null && heatScore !== undefined && (
          <div
            className="flex-shrink-0 bg-postit border-2 border-pencil px-3 py-1 font-body text-base flex items-center gap-1"
            style={{ borderRadius: "var(--wobbly-sm)", transform: "rotate(2deg)" }}
          >
            <span className="text-ink-red">🔥</span>
            <span className="font-heading text-pencil">{heatScore}</span>
          </div>
        )}
      </div>
    </div>
  );
}
