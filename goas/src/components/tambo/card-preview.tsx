// @ts-nocheck
"use client";

import { z } from "zod";

export const cardPreviewSchema = z.object({
  title: z.string(),
  content: z.string(),
  sourceAgent: z.string(),
  imageUrl: z.string().optional(),
  onConfirm: z.function().optional(),
  onCancel: z.function().optional(),
});

type CardPreviewProps = z.infer<typeof cardPreviewSchema>;

export function CardPreview({ title, content, sourceAgent, imageUrl }: CardPreviewProps) {
  return (
    <div
      className="bg-card border-2 border-pencil overflow-hidden tape"
      style={{
        borderRadius: "var(--wobbly-md)",
        boxShadow: "var(--shadow)",
        transform: "rotate(-1deg)",
      }}
    >
      {/* Header with postit style */}
      <div
        className="px-4 py-3 bg-postit border-b-2 border-dashed border-pencil"
      >
        <div className="text-sm text-muted-foreground font-body mb-1 flex items-center gap-1">
          <span>📝</span>
          <span>即将保存为 Card</span>
        </div>
        <h4 className="font-heading text-xl text-pencil">{title}</h4>
      </div>

      {/* Image */}
      {imageUrl && (
        <div
          className="aspect-video bg-secondary border-b-2 border-dashed border-muted"
        >
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <p className="text-lg text-foreground font-body whitespace-pre-wrap leading-relaxed">
          {content}
        </p>

        {/* Source tag */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 bg-secondary border border-pencil text-sm font-body"
            style={{ borderRadius: "var(--wobbly-sm)", transform: "rotate(1deg)" }}
          >
            <span>📌</span>
            <span className="text-muted-foreground">来源: {sourceAgent}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
