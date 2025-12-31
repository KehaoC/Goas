"use client";

import { useState, useEffect } from "react";
import {
  getHotspots,
  type Hotspot,
  type HotspotCategory,
  type HotspotSource,
  categoryLabels,
  sourceLabels,
} from "@/services/hotspot";
import { cn } from "@/lib/utils";
import { saveCard } from "@/services/card";

export default function HotspotDashboard() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<HotspotCategory | "all">("all");
  const [source, setSource] = useState<HotspotSource | "all">("all");
  const [sortBy, setSortBy] = useState<"heat" | "recent">("heat");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const categories: { id: HotspotCategory | "all"; label: string; icon: string }[] = [
    { id: "all", label: "全部", icon: "✨" },
    { id: "trending", label: "热门趋势", icon: "📈" },
    { id: "brand", label: "品牌动态", icon: "🏷️" },
    { id: "meme", label: "热梗玩法", icon: "🎭" },
    { id: "lifestyle", label: "生活方式", icon: "🌿" },
    { id: "tech", label: "科技前沿", icon: "🤖" },
  ];

  const sources: { id: HotspotSource | "all"; label: string }[] = [
    { id: "all", label: "全平台" },
    { id: "weibo", label: "微博" },
    { id: "douyin", label: "抖音" },
    { id: "xiaohongshu", label: "小红书" },
  ];

  const handleSaveCard = async () => {
    if (!selectedHotspot) return;
    setSaving(true);
    try {
      await saveCard({
        title: selectedHotspot.title,
        content: selectedHotspot.description,
        sourceAgent: "creative-hotspot",
        imageUrl: selectedHotspot.imageUrl,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setSelectedHotspot(null);
      }, 1500);
    } catch (error) {
      console.error("Failed to save card:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 min-h-full">
      {/* Header - Hand-drawn style */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-16 h-16 flex items-center justify-center text-3xl bg-postit border-[3px] border-pencil shadow-hand"
          style={{ borderRadius: "var(--wobbly-circle)", transform: "rotate(-3deg)" }}
        >
          💡
        </div>
        <div>
          <h1 className="text-4xl font-heading text-pencil squiggly-underline inline-block">
            创意灵感
          </h1>
          <p className="text-lg text-muted-foreground font-body mt-1">
            每周 9 点准时更新
          </p>
        </div>
        {/* Decorative arrow */}
        <svg className="w-16 h-8 text-pencil hidden md:block ml-auto" viewBox="0 0 64 32">
          <path
            d="M4,16 Q20,8 40,16 T60,12"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4,3"
            fill="none"
          />
          <path d="M56,8 L62,12 L56,16" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Filter Bar - Hand-drawn card style */}
      <div
        className="bg-card border-[3px] border-pencil p-5 mb-8 tape"
        style={{
          borderRadius: "var(--wobbly-md)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex flex-wrap items-start gap-6">
          {/* Category Filter */}
          <div className="flex-1 min-w-0">
            <span className="text-sm text-muted-foreground font-body mb-2 block">分类筛选</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, index) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-3 py-2 text-base font-body border-2 transition-all duration-100",
                    category === cat.id
                      ? "bg-postit border-pencil text-pencil shadow-hand-sm"
                      : "bg-card border-pencil/40 text-muted-foreground hover:border-pencil hover:bg-secondary/50"
                  )}
                  style={{
                    borderRadius: "var(--wobbly-sm)",
                    transform: category === cat.id ? `rotate(${index % 2 === 0 ? -1 : 1}deg)` : "none",
                  }}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="w-px h-20 border-l-2 border-dashed border-muted hidden lg:block" />

          {/* Source Filter */}
          <div>
            <span className="text-sm text-muted-foreground font-body mb-2 block">来源</span>
            <div className="flex gap-2">
              {sources.map((src, index) => (
                <button
                  key={src.id}
                  onClick={() => setSource(src.id)}
                  className={cn(
                    "px-3 py-2 text-base font-body border-2 transition-all duration-100",
                    source === src.id
                      ? "bg-ink-blue/10 border-ink-blue text-ink-blue shadow-hand-sm"
                      : "bg-card border-pencil/40 text-muted-foreground hover:border-ink-blue/50 hover:text-ink-blue"
                  )}
                  style={{
                    borderRadius: "var(--wobbly-sm)",
                    transform: source === src.id ? `rotate(${index % 2 === 0 ? 1 : -1}deg)` : "none",
                  }}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort - Hand-drawn select */}
          <div>
            <span className="text-sm text-muted-foreground font-body mb-2 block">排序方式</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("heat")}
                className={cn(
                  "px-4 py-2 text-base font-body border-2 transition-all duration-100 flex items-center gap-1",
                  sortBy === "heat"
                    ? "bg-ink-red/10 border-ink-red text-ink-red shadow-hand-sm"
                    : "bg-card border-pencil/40 text-muted-foreground hover:border-ink-red/50"
                )}
                style={{
                  borderRadius: "var(--wobbly-sm)",
                  transform: sortBy === "heat" ? "rotate(-1deg)" : "none",
                }}
              >
                🔥 热度
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={cn(
                  "px-4 py-2 text-base font-body border-2 transition-all duration-100 flex items-center gap-1",
                  sortBy === "recent"
                    ? "bg-ink-blue/10 border-ink-blue text-ink-blue shadow-hand-sm"
                    : "bg-card border-pencil/40 text-muted-foreground hover:border-ink-blue/50"
                )}
                style={{
                  borderRadius: "var(--wobbly-sm)",
                  transform: sortBy === "recent" ? "rotate(1deg)" : "none",
                }}
              >
                🕐 最新
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card border-2 border-pencil/30 overflow-hidden animate-pulse"
              style={{
                borderRadius: "var(--wobbly-md)",
                transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
              }}
            >
              <div className="h-40 bg-muted/50" />
              <div className="p-4">
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted/50 rounded w-full mb-2" />
                <div className="h-4 bg-muted/50 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspots.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedHotspot(item)}
              className="group bg-card border-2 border-pencil overflow-hidden cursor-pointer transition-all duration-100 hover:shadow-hand-md hover-jiggle"
              style={{
                borderRadius: "var(--wobbly-md)",
                boxShadow: "var(--shadow-soft)",
                transform: `rotate(${index % 3 === 0 ? -1 : index % 3 === 1 ? 0.5 : 1}deg)`,
              }}
            >
              {/* Image with hand-drawn overlay */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Heat Badge - Post-it style */}
                <div
                  className="absolute top-3 right-3 bg-postit border-2 border-pencil px-2 py-1 flex items-center gap-1 font-body text-sm text-pencil"
                  style={{
                    borderRadius: "var(--wobbly-sm)",
                    boxShadow: "var(--shadow-sm)",
                    transform: "rotate(3deg)",
                  }}
                >
                  <span>🔥</span>
                  <span className="font-heading">{item.heatScore}</span>
                </div>
                {/* Source Badge */}
                <div
                  className="absolute top-3 left-3 bg-card border-2 border-pencil px-2 py-1 font-body text-sm text-pencil"
                  style={{
                    borderRadius: "var(--wobbly-sm)",
                    transform: "rotate(-2deg)",
                  }}
                >
                  {sourceLabels[item.source]}
                </div>
                {/* Category tag at bottom */}
                <div
                  className="absolute bottom-3 left-3 bg-ink-blue text-white px-2 py-0.5 font-body text-xs"
                  style={{
                    borderRadius: "var(--wobbly-sm)",
                  }}
                >
                  {categoryLabels[item.category]}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-heading text-xl text-pencil mb-2 group-hover:text-ink-red transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-body text-base mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Tags - Hand-drawn style */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-secondary border border-pencil/30 font-body text-sm text-muted-foreground"
                      style={{
                        borderRadius: "var(--wobbly-sm)",
                        transform: `rotate(${tagIndex % 2 === 0 ? -1 : 1}deg)`,
                      }}
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
          <div
            className="inline-block p-8 bg-postit border-[3px] border-dashed border-pencil"
            style={{
              borderRadius: "var(--wobbly-md)",
              transform: "rotate(-2deg)",
            }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-heading text-pencil mb-2">暂无符合条件的热点</h2>
            <p className="text-muted-foreground font-body">试试调整筛选条件？</p>
          </div>
        </div>
      )}

      {/* Detail Modal - Hand-drawn style */}
      {selectedHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "var(--backdrop)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedHotspot(null);
          }}
        >
          <div
            className="bg-card border-[3px] border-pencil max-w-2xl w-full max-h-[90vh] overflow-hidden relative tack"
            style={{
              borderRadius: "var(--wobbly-md)",
              boxShadow: "var(--shadow-lg)",
              transform: "rotate(-0.5deg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Header */}
            <div className="relative h-64">
              <img
                src={selectedHotspot.imageUrl}
                alt={selectedHotspot.title}
                className="w-full h-full object-cover"
              />
              {/* Close Button - Hand-drawn circle */}
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-card border-[3px] border-pencil flex items-center justify-center text-pencil hover:bg-ink-red hover:text-white hover:border-ink-red transition-all duration-100 font-heading text-xl"
                style={{
                  borderRadius: "var(--wobbly-circle)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                ✕
              </button>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className="bg-card border-2 border-pencil px-3 py-1 font-body text-sm text-pencil"
                  style={{ borderRadius: "var(--wobbly-sm)", transform: "rotate(-2deg)" }}
                >
                  {sourceLabels[selectedHotspot.source]}
                </span>
                <span
                  className="bg-ink-red text-white border-2 border-ink-red px-3 py-1 font-body text-sm"
                  style={{ borderRadius: "var(--wobbly-sm)", transform: "rotate(1deg)" }}
                >
                  {categoryLabels[selectedHotspot.category]}
                </span>
              </div>
              {/* Heat Score - Post-it style */}
              <div
                className="absolute bottom-4 right-4 bg-postit border-2 border-pencil px-3 py-1.5 flex items-center gap-2 font-body text-pencil"
                style={{
                  borderRadius: "var(--wobbly-sm)",
                  boxShadow: "var(--shadow-sm)",
                  transform: "rotate(2deg)",
                }}
              >
                <span>🔥</span>
                <span className="font-heading text-lg">热度 {selectedHotspot.heatScore}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 16rem)" }}>
              <h2 className="text-3xl font-heading text-pencil mb-4">
                {selectedHotspot.title}
              </h2>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
                {selectedHotspot.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedHotspot.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary border-2 border-pencil/30 font-body text-base text-pencil"
                    style={{
                      borderRadius: "var(--wobbly-sm)",
                      transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Meta Info - Dashed border */}
              <div className="flex items-center justify-between text-sm text-muted-foreground font-body mb-6 pb-6 border-b-2 border-dashed border-muted">
                <span>📅 发布时间: {selectedHotspot.createdAt}</span>
                <span
                  className="px-2 py-0.5 bg-muted/50 border border-pencil/20"
                  style={{ borderRadius: "var(--wobbly-sm)" }}
                >
                  ID: {selectedHotspot.id}
                </span>
              </div>

              {/* Actions - Hand-drawn buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="flex-1 px-4 py-3 border-[3px] border-pencil bg-card text-pencil font-body text-lg transition-all duration-100 hover:bg-secondary"
                  style={{
                    borderRadius: "var(--wobbly)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  关闭
                </button>
                <button
                  onClick={handleSaveCard}
                  disabled={saving || saveSuccess}
                  className={cn(
                    "flex-1 px-4 py-3 border-[3px] font-body text-lg transition-all duration-100 flex items-center justify-center gap-2",
                    saveSuccess
                      ? "bg-ink-blue border-ink-blue text-white"
                      : "bg-ink-red border-ink-red text-white hover:shadow-hand-sm"
                  )}
                  style={{
                    borderRadius: "var(--wobbly)",
                    boxShadow: saveSuccess ? "none" : "var(--shadow)",
                    transform: saveSuccess ? "translate(4px, 4px)" : "none",
                  }}
                >
                  {saving ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      保存中...
                    </>
                  ) : saveSuccess ? (
                    <>✓ 已保存到卡片库</>
                  ) : (
                    <>📁 保存到卡片库</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
