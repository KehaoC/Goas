"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TamboProvider } from "@tambo-ai/react";
import { getAgent } from "@/config/agents";
import { components, tools } from "@/lib/tambo";
import { cn } from "@/lib/utils";
import { MessageThreadCollapsible } from "@/components/tambo/message-thread-collapsible";
import HotspotDashboard from "@/components/agent/HotspotDashboard";
import CardsLibrary from "@/components/CardLibrary";

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

