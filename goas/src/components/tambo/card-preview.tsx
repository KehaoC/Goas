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
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b">
        <div className="text-xs text-gray-500 mb-1">即将保存为 Card</div>
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      {imageUrl && (
        <div className="aspect-video bg-gray-100">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{content}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>来源: {sourceAgent}</span>
        </div>
      </div>
    </div>
  );
}
