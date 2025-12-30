export type HotspotCategory = "trending" | "brand" | "meme" | "lifestyle" | "tech";
export type HotspotSource = "weibo" | "douyin" | "xiaohongshu" | "general";

export interface Hotspot {
  id: string;
  category: HotspotCategory;
  source: HotspotSource;
  title: string;
  description: string;
  imageUrl: string;
  heatScore: number;
  tags: string[];
  createdAt: string;
}

export async function getHotspots(params?: {
  category?: HotspotCategory;
  source?: HotspotSource;
  limit?: number;
  sortBy?: "heat" | "recent";
}): Promise<Hotspot[]> {
  // In production, this would call your API
  // For now, return curated real hotspot data
  let data = getRealHotspots();

  if (params?.category) {
    data = data.filter((h) => h.category === params.category);
  }
  if (params?.source) {
    data = data.filter((h) => h.source === params.source);
  }
  if (params?.sortBy === "heat") {
    data = data.sort((a, b) => b.heatScore - a.heatScore);
  } else if (params?.sortBy === "recent") {
    data = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  if (params?.limit) {
    data = data.slice(0, params.limit);
  }

  return data;
}

function getRealHotspots(): Hotspot[] {
  return [
    {
      id: "1",
      category: "trending",
      source: "xiaohongshu",
      title: "TikTok难民涌入小红书",
      description: "美国用户大量涌入，中英文化碰撞引发全球热议，品牌出海新机遇",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
      heatScore: 98,
      tags: ["出海", "社交媒体", "文化交流"],
      createdAt: "2025-01-14",
    },
    {
      id: "2",
      category: "brand",
      source: "general",
      title: "瑞幸×原神联名爆火",
      description: "枫丹限定饮品+周边套餐，二次元联名营销新标杆",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      heatScore: 95,
      tags: ["联名", "二次元", "饮品"],
      createdAt: "2025-01-10",
    },
    {
      id: "3",
      category: "meme",
      source: "douyin",
      title: "上班恶心穿搭挑战",
      description: "打工人用夸张穿搭表达躺平态度，引发职场共鸣",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
      heatScore: 92,
      tags: ["职场", "穿搭", "躺平"],
      createdAt: "2025-01-12",
    },
    {
      id: "4",
      category: "lifestyle",
      source: "xiaohongshu",
      title: "新中式穿搭持续走红",
      description: "马面裙、盘扣元素融入日常，传统文化现代演绎",
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=300&fit=crop",
      heatScore: 90,
      tags: ["新中式", "国潮", "时尚"],
      createdAt: "2025-01-08",
    },
    {
      id: "5",
      category: "tech",
      source: "weibo",
      title: "AI数字人客服全面铺开",
      description: "品牌争相部署AI客服，24小时服务成为标配",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      heatScore: 88,
      tags: ["AI", "客服", "科技"],
      createdAt: "2025-01-11",
    },
    {
      id: "6",
      category: "brand",
      source: "general",
      title: "喜茶×草间弥生波波茶",
      description: "艺术家联名包装，给世界加点波波",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      heatScore: 87,
      tags: ["联名", "艺术", "茶饮"],
      createdAt: "2025-01-05",
    },
    {
      id: "7",
      category: "lifestyle",
      source: "douyin",
      title: "老钱风穿搭11亿播放",
      description: "低调精英感席卷全网，拉夫劳伦成代表品牌",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      heatScore: 86,
      tags: ["老钱风", "穿搭", "精英"],
      createdAt: "2025-01-09",
    },
    {
      id: "8",
      category: "meme",
      source: "weibo",
      title: "苏超恐龙舞出圈",
      description: "江苏足球联赛恐龙啦啦队走红，城市营销新玩法",
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      heatScore: 85,
      tags: ["体育", "城市营销", "玩梗"],
      createdAt: "2025-01-07",
    },
    {
      id: "9",
      category: "trending",
      source: "xiaohongshu",
      title: "谷子经济爆发式增长",
      description: "二次元周边市场火爆，年轻人为热爱买单",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      heatScore: 84,
      tags: ["二次元", "消费", "年轻人"],
      createdAt: "2025-01-06",
    },
    {
      id: "10",
      category: "brand",
      source: "general",
      title: "创始人IP营销崛起",
      description: "浴见、方里创始人抖音分享创业故事，品牌人格化",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      heatScore: 83,
      tags: ["创始人IP", "个人品牌", "营销"],
      createdAt: "2025-01-04",
    },
    {
      id: "11",
      category: "tech",
      source: "weibo",
      title: "数字游民入选年度流行语",
      description: "远程办公成为生活方式，自由职业者群体壮大",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
      heatScore: 82,
      tags: ["数字游民", "远程办公", "自由"],
      createdAt: "2025-01-03",
    },
    {
      id: "12",
      category: "lifestyle",
      source: "xiaohongshu",
      title: "疗愈经济文旅爆发",
      description: "温泉旅修、山谷冥想，年轻人追求身心放松",
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      heatScore: 81,
      tags: ["疗愈", "文旅", "放松"],
      createdAt: "2025-01-02",
    },
  ];
}

export const categoryLabels: Record<HotspotCategory, string> = {
  trending: "热门趋势",
  brand: "品牌动态",
  meme: "热梗玩法",
  lifestyle: "生活方式",
  tech: "科技前沿",
};

export const sourceLabels: Record<HotspotSource, string> = {
  weibo: "微博",
  douyin: "抖音",
  xiaohongshu: "小红书",
  general: "综合",
};
