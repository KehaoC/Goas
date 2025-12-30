"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TamboProvider } from "@tambo-ai/react";
import { getAgent } from "@/config/agents";
import { components, tools } from "@/lib/tambo";
import { cn } from "@/lib/utils";
import { MessageThreadCollapsible } from "@/components/tambo/message-thread-collapsible";
import { getHotspots, type Hotspot, type HotspotCategory } from "@/services/hotspot";

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

          {/* Apps section */}
          <div className="flex-1 overflow-auto py-4">
            <div className="px-4 py-2 font-heading text-sm text-muted-foreground uppercase tracking-wide">
              Apps
            </div>
            <div className="space-y-1 px-2">
              {agent.apps.map((app, index) => (
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

  // Creative Hotspot Dashboard
  if (agentId === "creative-hotspot" && appId === "dashboard") {
    return <HotspotDashboard />;
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

function HotspotDashboard() {
  const categories: { id: HotspotCategory; name: string; icon: string }[] = [
    { id: "competitor", name: "竞品动态", icon: "🏢" },
    { id: "trending", name: "热榜", icon: "🔥" },
    { id: "ip", name: "IP热度", icon: "⭐" },
    { id: "meme", name: "热梗", icon: "😂" },
  ];

  const [hotspots, setHotspots] = useState<Record<string, Hotspot[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const results: Record<string, Hotspot[]> = {};
      await Promise.all(
        categories.map(async (cat) => {
          const data = await getHotspots({ category: cat.id, limit: 3 });
          results[cat.id] = data;
        })
      );
      setHotspots(results);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-14 h-14 flex items-center justify-center text-3xl bg-postit border-2 border-pencil"
          style={{ borderRadius: "var(--wobbly-circle)" }}
        >
          📊
        </div>
        <h2 className="text-3xl font-heading text-pencil">热点看板</h2>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, catIndex) => (
          <div
            key={cat.id}
            className="bg-card border-2 border-pencil p-5 shadow-hand-soft hover:shadow-hand transition-all duration-100"
            style={{
              borderRadius: catIndex % 4 === 0
                ? "var(--wobbly-md)"
                : catIndex % 4 === 1
                  ? "175px 35px 185px 25px / 25px 195px 25px 185px"
                  : catIndex % 4 === 2
                    ? "165px 45px 175px 35px / 35px 175px 35px 165px"
                    : "185px 25px 165px 45px / 45px 165px 45px 185px",
              transform: `rotate(${catIndex % 2 === 0 ? -0.5 : 0.5}deg)`
            }}
          >
            {/* Category header */}
            <h3 className="font-heading text-xl text-pencil mb-4 flex items-center gap-2">
              <span className="text-2xl">{cat.icon}</span>
              <span className="squiggly-underline">{cat.name}</span>
            </h3>

            {/* Hotspot items */}
            <div className="space-y-3">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-3 bg-secondary border border-dashed border-muted animate-pulse"
                    style={{ borderRadius: "var(--wobbly-sm)" }}
                  >
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                (hotspots[cat.id] || []).map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="p-3 bg-secondary/50 border-2 border-transparent hover:border-pencil hover:bg-card cursor-pointer transition-all duration-100 group"
                    style={{
                      borderRadius: "var(--wobbly-sm)",
                      transform: `rotate(${itemIndex % 2 === 0 ? 0.5 : -0.5}deg)`
                    }}
                  >
                    <div className="font-body text-lg text-pencil group-hover:text-ink-red transition-colors">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground font-body mt-1 truncate">
                        {item.description}
                      </div>
                    )}
                    {item.heatScore && (
                      <div className="mt-2 inline-flex items-center gap-1">
                        <span className="text-ink-red">🔥</span>
                        <span
                          className="px-2 py-0.5 bg-postit border border-pencil text-xs font-body"
                          style={{ borderRadius: "var(--wobbly-sm)" }}
                        >
                          {item.heatScore}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
