export interface AgentApp {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  apps: AgentApp[];
}

export const agents: AgentConfig[] = [
  {
    id: "creative-hotspot",
    name: "创意热点",
    description: "发现今日热点，获取营销灵感",
    icon: "🔥",
    apps: [
      { id: "dashboard", name: "热点看板", icon: "📊", description: "四分区热点概览" },
      { id: "analysis", name: "热点分析", icon: "🔍", description: "深度分析热点趋势" },
      { id: "prediction", name: "趋势预测", icon: "📈", description: "预测未来热点走向" },
    ],
  },
  {
    id: "material-gen",
    name: "素材生成",
    description: "AI 生成营销素材",
    icon: "🎨",
    apps: [
      { id: "copywriting", name: "文案生成", icon: "✍️", description: "生成营销文案" },
      { id: "image", name: "图片生成", icon: "🖼️", description: "生成配图素材" },
    ],
  },
  {
    id: "strategy",
    name: "策略生成",
    description: "营销策略建议",
    icon: "📋",
    apps: [
      { id: "plan", name: "策略规划", icon: "📝", description: "制定营销计划" },
    ],
  },
  {
    id: "analytics",
    name: "数据分析",
    description: "数据洞察分析",
    icon: "📈",
    apps: [
      { id: "overview", name: "数据概览", icon: "📊", description: "关键指标总览" },
    ],
  },
];

export function getAgent(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}
