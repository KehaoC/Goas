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
    return <div className="p-8">Agent not found</div>;
  }

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      components={components}
      tools={tools}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border-r flex flex-col">
          <Link
            href="/explore"
            className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b flex items-center gap-2"
          >
            ← 返回广场
          </Link>

          {/* Apps */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Apps
            </div>
            {agent.apps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                  selectedApp === app.id
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span>{app.icon}</span>
                <span>{app.name}</span>
              </button>
            ))}
          </div>
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
      <h2 className="text-xl font-medium mb-2">{app.icon} {app.name}</h2>
      <p className="text-gray-500">{app.description}</p>
      <div className="mt-8 p-8 bg-white rounded-lg border text-center text-gray-400">
        功能开发中...
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
      <h2 className="text-xl font-medium mb-6">📊 热点看板</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </h3>
            <div className="space-y-2">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="p-2 bg-gray-50 rounded text-sm text-gray-400 animate-pulse">
                    加载中...
                  </div>
                ))
              ) : (
                (hotspots[cat.id] || []).map((item) => (
                  <div key={item.id} className="p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 cursor-pointer">
                    <div className="font-medium text-gray-800">{item.title}</div>
                    {item.description && (
                      <div className="text-gray-500 text-xs mt-1 truncate">{item.description}</div>
                    )}
                    {item.heatScore && (
                      <div className="text-xs text-orange-500 mt-1">🔥 {item.heatScore}</div>
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
