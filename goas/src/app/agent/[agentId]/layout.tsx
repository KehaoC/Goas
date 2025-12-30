"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TamboProvider } from "@tambo-ai/react";
import { getAgent } from "@/config/agents";
import { components, tools } from "@/lib/tambo";
import { cn } from "@/lib/utils";
import { MessageThreadCollapsible } from "@/components/tambo/message-thread-collapsible";
import {
  getHotspots,
  type Hotspot,
  type HotspotCategory,
  type HotspotSource,
  categoryLabels,
  sourceLabels,
} from "@/services/hotspot";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = getAgent(agentId);

  const [selectedApp, setSelectedApp] = useState(agent?.apps[0]?.id || "");

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="p-8 bg-postit border-2 border-pencil shadow-hand text-center"
          style={{ borderRadius: "var(--wobbly-md)", transform: "rotate(-1deg)" }}
        >
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="font-heading text-xl text-pencil">Agent not found</h2>
        </div>
      </div>
    );
  }

  // 分离普通 apps 和特殊 apps（如卡片库）
  const regularApps = agent.apps.filter(app => !app.isSpecial);
  const specialApps = agent.apps.filter(app => app.isSpecial);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      components={components}
      tools={tools}
    >
      <div className="flex h-screen">
        {/* Left Sidebar - Hand-drawn style */}
        <aside
          className="w-64 bg-card border-r-[3px] border-pencil flex flex-col relative"
          style={{
            backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          {/* Back button */}
          <Link
            href="/explore"
            className="px-4 py-3 text-lg font-body text-pencil hover:bg-secondary/50 border-b-2 border-dashed border-muted flex items-center gap-2 transition-colors"
          >
            <span>←</span>
            <span>返回广场</span>
          </Link>

          {/* Regular Apps section */}
          <div className="flex-1 overflow-auto py-4">
            <div className="px-4 py-2 font-heading text-sm text-muted-foreground uppercase tracking-wide">
              功能
            </div>
            <div className="space-y-1 px-2">
              {regularApps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left font-body text-lg flex items-center gap-3 transition-all duration-100 border-2",
                    selectedApp === app.id
                      ? "bg-postit border-pencil shadow-hand-sm text-pencil"
                      : "border-transparent hover:bg-secondary/30 text-muted-foreground hover:text-pencil"
                  )}
                  style={{
                    borderRadius: selectedApp === app.id
                      ? "var(--wobbly-sm)"
                      : "8px",
                    transform: selectedApp === app.id
                      ? `rotate(${index % 2 === 0 ? -1 : 1}deg)`
                      : "none"
                  }}
                >
                  <span className="text-xl">{app.icon}</span>
                  <span>{app.name}</span>
                </button>
              ))}
            </div>

            {/* Special Apps section (卡片库) */}
            {specialApps.length > 0 && (
              <>
                {/* Divider */}
                <div className="mx-4 my-4 border-t-2 border-dashed border-muted relative">
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-card px-2 text-xs text-muted-foreground">
                    我的收藏
                  </span>
                </div>

                <div className="space-y-1 px-2">
                  {specialApps.map((app, index) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id)}
                      className={cn(
                        "w-full px-4 py-3 text-left font-body text-lg flex items-center gap-3 transition-all duration-100 border-2",
                        selectedApp === app.id
                          ? "bg-ink-blue/10 border-ink-blue shadow-hand-sm text-ink-blue"
                          : "border-transparent hover:bg-ink-blue/5 text-muted-foreground hover:text-ink-blue"
                      )}
                      style={{
                        borderRadius: selectedApp === app.id
                          ? "var(--wobbly-sm)"
                          : "8px",
                        transform: selectedApp === app.id
                          ? `rotate(${index % 2 === 0 ? -1 : 1}deg)`
                          : "none"
                      }}
                    >
                      <span className="text-xl">{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Decorative corner element */}
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-dashed border-muted rounded-full opacity-30"></div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <AgentAppContent agentId={agentId} appId={selectedApp} />
        </main>

        {/* Floating Chat */}
        <MessageThreadCollapsible defaultOpen={false} height="70vh" />
      </div>
    </TamboProvider>
  );
}

function AgentAppContent({ agentId, appId }: { agentId: string; appId: string }) {
  const agent = getAgent(agentId);
  const app = agent?.apps.find((a) => a.id === appId);

  if (!app) return null;

  // 创意灵感 - 热点看板
  if (agentId === "creative-hotspot" && appId === "inspiration") {
    return <HotspotDashboard />;
  }

  // 卡片库 - 特殊处理
  if (appId === "cards") {
    return <CardsLibrary />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 flex items-center justify-center text-2xl bg-postit border-2 border-pencil"
          style={{ borderRadius: "var(--wobbly-circle)" }}
        >
          {app.icon}
        </div>
        <div>
          <h2 className="text-2xl font-heading text-pencil">{app.name}</h2>
          <p className="text-muted-foreground font-body">{app.description}</p>
        </div>
      </div>

      {/* Coming soon card */}
      <div
        className="p-12 bg-card border-2 border-dashed border-muted text-center"
        style={{ borderRadius: "var(--wobbly-md)" }}
      >
        <div className="text-4xl mb-4">🚧</div>
        <p className="text-xl font-body text-muted-foreground">功能开发中...</p>
        <svg className="mx-auto mt-4 w-24 h-8 text-muted" viewBox="0 0 96 32" fill="none">
          <path d="M8,16 Q24,8 48,16 T88,16" stroke="currentColor" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
        </svg>
      </div>
    </div>
  );
}

function CardsLibrary() {
  // TODO: 从 API 获取卡片数据
  const cards: { id: string; title: string; content: string; sourceAgent: string; createdAt: string }[] = [];

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-14 h-14 flex items-center justify-center text-3xl bg-ink-blue/10 border-2 border-ink-blue"
          style={{ borderRadius: "var(--wobbly-circle)" }}
        >
          📁
        </div>
        <div>
          <h1 className="text-3xl font-heading text-pencil">卡片库</h1>
          <p className="text-muted-foreground font-body">保存的灵感与素材</p>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="inline-block p-8 bg-ink-blue/5 border-2 border-dashed border-ink-blue/30 mb-6"
            style={{ borderRadius: "var(--wobbly-md)" }}
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-heading text-pencil mb-2">还没有保存任何卡片</h2>
            <p className="text-muted-foreground font-body max-w-sm mx-auto">
              在使用其他功能时，可以将有价值的内容保存为卡片，方便后续查阅
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-card border-2 border-pencil p-4 hover:shadow-hand transition-all duration-100 cursor-pointer group"
              style={{
                borderRadius: "var(--wobbly-md)",
                boxShadow: "var(--shadow-soft)",
                transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`
              }}
            >
              <h3 className="font-heading text-lg text-pencil mb-2 group-hover:text-ink-blue transition-colors">
                {card.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm line-clamp-3 mb-3">
                {card.content}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span
                  className="px-2 py-0.5 bg-secondary border border-pencil/30"
                  style={{ borderRadius: "var(--wobbly-sm)" }}
                >
                  {card.sourceAgent}
                </span>
                <span>{card.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HotspotDashboard() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<HotspotCategory | "all">("all");
  const [source, setSource] = useState<HotspotSource | "all">("all");
  const [sortBy, setSortBy] = useState<"heat" | "recent">("heat");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const params: Parameters<typeof getHotspots>[0] = {
        sortBy,
        limit: 9,
      };
      if (category !== "all") params.category = category;
      if (source !== "all") params.source = source;
      const data = await getHotspots(params);
      setHotspots(data);
      setLoading(false);
    }
    fetchData();
  }, [category, source, sortBy]);

  const categories: { id: HotspotCategory | "all"; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "trending", label: "热门趋势" },
    { id: "brand", label: "品牌动态" },
    { id: "meme", label: "热梗玩法" },
    { id: "lifestyle", label: "生活方式" },
    { id: "tech", label: "科技前沿" },
  ];

  const sources: { id: HotspotSource | "all"; label: string }[] = [
    { id: "all", label: "全平台" },
    { id: "weibo", label: "微博" },
    { id: "douyin", label: "抖音" },
    { id: "xiaohongshu", label: "小红书" },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 via-white to-pink-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">创意灵感</h1>
        <p className="text-gray-500">发现最新热点，激发广告创意灵感</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">分类:</span>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full transition-all",
                    category === cat.id
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden md:block" />

          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">来源:</span>
            <div className="flex gap-1">
              {sources.map((src) => (
                <button
                  key={src.id}
                  onClick={() => setSource(src.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full transition-all",
                    source === src.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "heat" | "recent")}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="heat">🔥 热度最高</option>
              <option value="recent">🕐 最新发布</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotspots.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Heat Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <span>🔥</span>
                  <span>{item.heatScore}</span>
                </div>
                {/* Source Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {sourceLabels[item.source]}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hotspots.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">暂无符合条件的热点</p>
        </div>
      )}
    </div>
  );
}
