import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { HotspotCard, hotspotCardSchema } from "@/components/tambo/hotspot-card";
import { HotspotBoard, hotspotBoardSchema } from "@/components/tambo/hotspot-board";
import { CardPreview, cardPreviewSchema } from "@/components/tambo/card-preview";
import { getHotspots } from "@/services/hotspot";
import { saveCard, getCards } from "@/services/card";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

export const tools: TamboTool[] = [
  {
    name: "getHotspots",
    description: "获取今日热点数据。可指定分类：competitor(竞品)、trending(热榜)、ip(IP热度)、meme(热梗)",
    tool: getHotspots,
    toolSchema: z
      .function()
      .args(
        z.object({
          category: z.enum(["competitor", "trending", "ip", "meme"]).optional(),
          limit: z.number().optional(),
        }).optional()
      )
      .returns(
        z.array(
          z.object({
            id: z.string(),
            category: z.string(),
            title: z.string(),
            description: z.string().nullable(),
            heatScore: z.number().nullable(),
          })
        )
      ),
  },
  {
    name: "saveCard",
    description: "将内容保存为 Card，用于保存热点或 AI 生成的内容",
    tool: saveCard,
    toolSchema: z
      .function()
      .args(
        z.object({
          title: z.string(),
          content: z.string(),
          sourceAgent: z.string(),
          imageUrl: z.string().optional(),
        })
      )
      .returns(z.object({ id: z.string(), success: z.boolean() })),
  },
  {
    name: "getMyCards",
    description: "获取用户保存的所有 Card",
    tool: getCards,
    toolSchema: z
      .function()
      .args(
        z.object({
          limit: z.number().optional(),
          offset: z.number().optional(),
        }).optional()
      )
      .returns(
        z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            sourceAgent: z.string(),
          })
        )
      ),
  },
];

export const components: TamboComponent[] = [
  {
    name: "Graph",
    description: "数据可视化图表组件，支持柱状图、折线图、饼图",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "数据卡片组件，展示可点击的选项列表",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "HotspotCard",
    description: "单个热点卡片，展示热点标题、描述和热度分数",
    component: HotspotCard,
    propsSchema: hotspotCardSchema,
  },
  {
    name: "HotspotBoard",
    description: "热点看板，展示某个分类的热点列表",
    component: HotspotBoard,
    propsSchema: hotspotBoardSchema,
  },
  {
    name: "CardPreview",
    description: "Card 保存预览组件，让用户确认要保存的内容",
    component: CardPreview,
    propsSchema: cardPreviewSchema,
  },
];
