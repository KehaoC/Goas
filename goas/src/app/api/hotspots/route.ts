import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hotspots } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const mockHotspots = [
  { id: "1", category: "competitor", title: "某品牌新品发布会", description: "某知名品牌发布2025年春季新品", heatScore: 95 },
  { id: "2", category: "competitor", title: "竞品价格调整", description: "主要竞争对手宣布降价10%", heatScore: 88 },
  { id: "3", category: "trending", title: "微博热搜TOP1", description: "今日最热话题", heatScore: 100 },
  { id: "4", category: "trending", title: "抖音热榜第一", description: "短视频最火挑战", heatScore: 96 },
  { id: "5", category: "ip", title: "新晋顶流IP", description: "某新剧话题持续霸榜", heatScore: 92 },
  { id: "6", category: "ip", title: "经典IP联名", description: "经典动漫与潮牌联名", heatScore: 89 },
  { id: "7", category: "meme", title: "今日最火表情包", description: "魔性表情包席卷社交平台", heatScore: 94 },
  { id: "8", category: "meme", title: "网络流行语", description: "本周最火网络用语", heatScore: 87 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    let query = db.select().from(hotspots).orderBy(desc(hotspots.heatScore)).limit(limit);
    if (category) {
      const data = await query.where(eq(hotspots.category, category));
      return NextResponse.json(data);
    }
    const data = await query;
    return NextResponse.json(data);
  } catch {
    // Fallback to mock data
    let data = mockHotspots;
    if (category) {
      data = data.filter((h) => h.category === category);
    }
    return NextResponse.json(data.slice(0, limit));
  }
}
