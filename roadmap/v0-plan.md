# V0 版本计划：基于 Tambo SDK 的可展示版本

## 核心目标

验证产品形态与核心交互是否成立，使用 Tambo SDK 实现最小可用的「Agent + Card」闭环。

**验收标准**：能完整演示「与 AI 对话 → AI 调用工具获取热点 → 动态渲染热点组件 → 保存为 Card → 查看 Card」的流程。

---

## 架构设计

### 整体架构

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              用户浏览器                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Goas Next.js App (goas/)                          │  │
│  │  ┌─────────────┬─────────────────────┬─────────────────┐            │  │
│  │  │  左侧导航    │    中间内容区        │   右侧 Chatbot   │            │  │
│  │  │  (Agent切换) │    (路由页面)        │   (Tambo SDK)   │            │  │
│  │  └─────────────┴─────────────────────┴─────────────────┘            │  │
│  │                           │                                          │  │
│  │              ┌────────────┴────────────┐                             │  │
│  │              │     Tambo React SDK     │                             │  │
│  │              │  - useTamboThread       │                             │  │
│  │              │  - TamboProvider        │                             │  │
│  │              │  - 组件/工具注册         │                             │  │
│  │              └────────────┬────────────┘                             │  │
│  └───────────────────────────│──────────────────────────────────────────┘  │
└──────────────────────────────│──────────────────────────────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
         ▼                                           ▼
┌──────────────────────┐                   ┌──────────────────────┐
│   Tambo Cloud API    │                   │    Goas API Routes   │
│  (localhost:3211)    │                   │  (localhost:3000)    │
│  - AI 对话处理        │                   │  - 业务逻辑 API       │
│  - Tool 执行         │                   │  - Card CRUD         │
│  - 组件渲染指令       │                   │  - 热点数据服务       │
└──────────┬───────────┘                   └──────────┬───────────┘
           │                                          │
           ▼                                          ▼
┌──────────────────────┐                   ┌──────────────────────┐
│ Tambo PostgreSQL     │                   │  Goas PostgreSQL     │
│  (localhost:5433)    │                   │  (localhost:5434)    │
│  - Tambo 框架数据     │                   │  - Cards 业务数据     │
│  - Thread/Message    │                   │  - Hotspots 热点      │
│  - 组件注册信息       │                   │  - Users 用户        │
└──────────────────────┘                   └──────────────────────┘
```

**架构说明**：
- **Tambo Cloud**: 处理 AI 对话、组件渲染、Tool 调用等核心 AI 能力
- **Goas 业务层**: 独立的 Next.js 应用，负责业务逻辑、数据持久化
- **双数据库设计**: Tambo 和 Goas 各自维护独立的 PostgreSQL，职责分离

### Tambo SDK 核心能力利用

| Tambo 能力 | Goas 应用场景 |
|-----------|-------------|
| **AI 对话** | 右侧全局 Chatbot，用户与 AI 交互 |
| **Generative UI** | AI 根据对话动态渲染热点卡片、Card 预览等 |
| **Tools** | AI 调用后端获取热点数据、保存 Card 等 |
| **Thread 管理** | 保持对话上下文，切换页面不丢失 |

---

## 页面结构与路由

### 路由设计

```
/                         # 重定向到 /explore
/explore                  # 用户广场（首页）- 展示所有可用 Agent
/agent/[agentId]          # Agent 页面（进入具体 Agent）
/agent/[agentId]/[appId]  # Agent 内的具体 App 页面
/cards                    # 我的 Card 列表（跨 Agent）
/cards/[id]               # Card 详情页
```

### 页面层级

```
┌─────────────────────────────────────────────────────────────┐
│                      Explore 页面                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ 创意热点 │  │ 素材生成 │  │ 策略生成 │  │ 数据分析 │        │
│  │  Agent  │  │  Agent  │  │  Agent  │  │  Agent  │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                             │
│  点击 Agent 卡片 → 进入 /agent/[agentId]                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Agent 页面布局                           │
│  ┌──────────┬─────────────────────────┬──────────────────┐  │
│  │  左侧栏   │        中间内容区        │      右侧栏      │  │
│  │          │                         │                  │  │
│  │ ┌──────┐ │   由左侧 App 选择决定    │   由左侧聊天     │  │
│  │ │ Apps │ │                         │   记录选择决定   │  │
│  │ │ 切换 │ │                         │                  │  │
│  │ └──────┘ │                         │   ┌──────────┐   │  │
│  │          │                         │   │ AI 对话  │   │  │
│  │ ──────── │                         │   │          │   │  │
│  │          │                         │   │ [消息]   │   │  │
│  │ ┌──────┐ │                         │   │ [组件]   │   │  │
│  │ │ 聊天 │ │                         │   │ [消息]   │   │  │
│  │ │ 记录 │ │                         │   │          │   │  │
│  │ └──────┘ │                         │   │ [输入框] │   │  │
│  │          │                         │   └──────────┘   │  │
│  └──────────┴─────────────────────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 全局布局设计

### Explore 页面（用户广场）

```
┌─────────────────────────────────────────────────────────────┐
│  Logo    Goas                              [我的 Cards]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   欢迎来到 Goas，选择一个 Agent 开始                          │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │   🔥        │  │   🎨        │  │   📊        │        │
│   │  创意热点    │  │  素材生成    │  │  策略生成    │        │
│   │             │  │             │  │             │        │
│   │ 发现今日热点 │  │ AI生成素材  │  │ 营销策略建议 │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│   ┌─────────────┐                                          │
│   │   📈        │                                          │
│   │  数据分析    │                                          │
│   │             │                                          │
│   │ 数据洞察分析 │                                          │
│   └─────────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Agent 页面（三栏布局 + 双选逻辑）

```
┌──────────────┬─────────────────────────────┬────────────────┐
│    左侧栏     │           中间              │     右侧栏     │
│   (240px)    │        (flex-1)             │    (320px)     │
├──────────────┼─────────────────────────────┼────────────────┤
│              │                             │                │
│ ◀ 返回广场   │                             │  当前对话      │
│              │                             │  ────────────  │
│ ═══ Apps ═══ │                             │                │
│              │   ┌─────────┬─────────┐     │  [AI] 你好！   │
│ ● 热点看板   │   │  竞品   │  热榜   │     │  这里是创意... │
│ ○ 热点分析   │   ├─────────┼─────────┤     │                │
│ ○ 趋势预测   │   │ IP热度  │  热梗   │     │  [HotspotCard] │
│              │   └─────────┴─────────┘     │  某品牌新品... │
│ ═══ 记录 ═══ │                             │                │
│              │   （由上方 App 选择决定）     │  [用户] 帮我   │
│ ● 今日对话   │                             │  保存这个     │
│ ○ 昨天 14:30 │                             │                │
│ ○ 12/28对话  │                             │  ────────────  │
│ ○ 12/27对话  │                             │  ┌──────────┐  │
│ + 新建对话   │                             │  │  输入框  │  │
│              │                             │  └──────────┘  │
└──────────────┴─────────────────────────────┴────────────────┘

双选逻辑：
├─ 左侧「Apps」选择  → 决定中间内容区显示哪个 App
└─ 左侧「记录」选择  → 决定右侧显示哪个 Thread 的对话
```

### 关键技术要点

```tsx
// goas/src/app/agent/[agentId]/layout.tsx - Agent 页面布局
"use client";

import { useState } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";

export default function AgentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { agentId: string };
}) {
  // 双选状态
  const [selectedApp, setSelectedApp] = useState<string>("dashboard");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      components={components}
      tools={tools}
    >
      <div className="flex h-screen">
        {/* 左侧栏 */}
        <AgentSidebar
          agentId={params.agentId}
          selectedApp={selectedApp}
          onSelectApp={setSelectedApp}
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
        />

        {/* 中间内容区 - 由 selectedApp 决定 */}
        <main className="flex-1 overflow-auto">
          <AgentAppContent agentId={params.agentId} appId={selectedApp} />
        </main>

        {/* 右侧聊天栏 - 由 selectedThreadId 决定 */}
        <AgentChatPanel
          agentId={params.agentId}
          threadId={selectedThreadId}
          onNewThread={(id) => setSelectedThreadId(id)}
        />
      </div>
    </TamboProvider>
  );
}

// 左侧栏组件
function AgentSidebar({
  agentId,
  selectedApp,
  onSelectApp,
  selectedThreadId,
  onSelectThread,
}: {
  agentId: string;
  selectedApp: string;
  onSelectApp: (appId: string) => void;
  selectedThreadId: string | null;
  onSelectThread: (threadId: string | null) => void;
}) {
  const agent = getAgentConfig(agentId);
  const { threads } = useAgentThreads(agentId); // 获取该 Agent 的聊天记录

  return (
    <aside className="w-60 border-r flex flex-col">
      {/* 返回按钮 */}
      <Link href="/explore" className="p-4 hover:bg-gray-100">
        ◀ 返回广场
      </Link>

      {/* Apps 切换区 */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-2 text-sm font-medium text-gray-500">Apps</div>
        {agent.apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelectApp(app.id)}
            className={cn(
              "w-full px-4 py-2 text-left",
              selectedApp === app.id && "bg-blue-50 text-blue-600"
            )}
          >
            {app.icon} {app.name}
          </button>
        ))}
      </div>

      {/* 聊天记录区 */}
      <div className="border-t">
        <div className="px-4 py-2 text-sm font-medium text-gray-500">聊天记录</div>
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={cn(
              "w-full px-4 py-2 text-left text-sm",
              selectedThreadId === thread.id && "bg-blue-50"
            )}
          >
            {thread.title || formatDate(thread.createdAt)}
          </button>
        ))}
        <button
          onClick={() => onSelectThread(null)} // null 表示新建对话
          className="w-full px-4 py-2 text-left text-sm text-blue-600"
        >
          + 新建对话
        </button>
      </div>
    </aside>
  );
}

// 右侧聊天面板 - 使用 Tambo 的 Thread
function AgentChatPanel({
  agentId,
  threadId,
  onNewThread,
}: {
  agentId: string;
  threadId: string | null;
  onNewThread: (id: string) => void;
}) {
  // contextKey 使用 agentId + threadId 组合，确保切换 thread 时对话也切换
  const contextKey = threadId
    ? `agent-${agentId}-thread-${threadId}`
    : `agent-${agentId}-new`;

  return (
    <aside className="w-80 border-l flex flex-col">
      <div className="p-4 border-b font-medium">
        {threadId ? "对话" : "新对话"}
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageThreadFull
          contextKey={contextKey}
          onThreadCreated={onNewThread} // 新对话创建时回调
        />
      </div>
    </aside>
  );
}
```

### Agent 配置结构

```tsx
// goas/src/config/agents.ts
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  apps: AgentApp[];
}

export interface AgentApp {
  id: string;
  name: string;
  icon: string;
  description: string;
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
  // ... 更多 Agent
];

export function getAgentConfig(agentId: string): AgentConfig | undefined {
  return agents.find((a) => a.id === agentId);
}
```

---

## Goas 基础设施配置

### 目录结构

```
goas/
├── docker-compose.yml          # Docker 服务编排
├── docker.env.example          # 环境变量模板
├── docker.env                  # 实际环境变量（不提交）
├── goas-setup.sh               # 项目初始化脚本
├── goas-run.sh                 # 启动脚本
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes (业务逻辑)
│   │   ├── layout.tsx          # 全局布局 + TamboProvider
│   │   └── ...
│   ├── components/
│   │   ├── tambo/              # Tambo 可渲染组件
│   │   ├── layout/             # 布局组件
│   │   └── ui/                 # 通用 UI
│   ├── lib/
│   │   ├── tambo.ts            # Tambo 组件/工具注册
│   │   └── db.ts               # 数据库连接
│   ├── services/               # 业务服务层
│   └── db/
│       ├── schema.ts           # Drizzle ORM Schema
│       ├── migrations/         # 数据库迁移文件
│       └── init.sql            # 初始化 SQL
├── public/
├── package.json
└── .env.local                  # Next.js 环境变量（不提交）
```

### docker-compose.yml

```yaml
# goas/docker-compose.yml
volumes:
  goas_postgres_data:

services:
  # Goas PostgreSQL 数据库
  postgres:
    image: postgres:17
    container_name: goas_postgres
    restart: unless-stopped
    env_file:
      - ./docker.env
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-goas}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - goas_postgres_data:/var/lib/postgresql/data
      - ./src/db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5434:5432"  # 使用 5434 端口，避免与 Tambo 的 5433 冲突
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-goas}",
        ]
      interval: 8s
      timeout: 5s
      retries: 4
      start_period: 20s

  # Goas Next.js 应用（生产模式）
  web:
    image: goas-web:latest
    env_file:
      - ./docker.env
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: ${NODE_ENV:-production}
    container_name: goas_web
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=${NODE_ENV:-production}
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@postgres:5432/${POSTGRES_DB:-goas}
      - NEXT_PUBLIC_TAMBO_API_KEY=${NEXT_PUBLIC_TAMBO_API_KEY}
      - NEXT_PUBLIC_TAMBO_URL=${NEXT_PUBLIC_TAMBO_URL:-http://localhost:3211}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
```

### docker.env.example

```bash
# goas/docker.env.example
# ========================================
# GOAS DOCKER ENVIRONMENT VARIABLES
# ========================================
# 复制此文件为 docker.env 并填入实际值

# ========================================
# POSTGRESQL 配置
# ========================================
POSTGRES_DB=goas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# ========================================
# TAMBO 连接配置
# ========================================
# Tambo Cloud API 地址（本地开发使用 3211 端口）
NEXT_PUBLIC_TAMBO_URL=http://localhost:3211
# 从 Tambo Cloud 获取的 API Key
NEXT_PUBLIC_TAMBO_API_KEY=tambo_xxx

# ========================================
# 应用配置
# ========================================
NODE_ENV=production

# 数据库连接字符串（Docker 环境自动生成，本地开发需要手动配置）
# DATABASE_URL=postgresql://postgres:postgres@localhost:5434/goas
```

### 数据库初始化脚本 (src/db/init.sql)

```sql
-- goas/src/db/init.sql
-- Goas 业务数据库初始化

-- 启用必要扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Cards 表：用户保存的卡片
-- ========================================
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    source_agent VARCHAR(100) NOT NULL,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    user_id UUID,  -- 预留用户关联
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_source_agent ON cards(source_agent);
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at DESC);

-- ========================================
-- Hotspots 表：热点数据
-- ========================================
CREATE TABLE IF NOT EXISTS hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('competitor', 'trending', 'ip', 'meme')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    source_url TEXT,
    heat_score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_hotspots_category ON hotspots(category);
CREATE INDEX IF NOT EXISTS idx_hotspots_date ON hotspots(date DESC);
CREATE INDEX IF NOT EXISTS idx_hotspots_heat_score ON hotspots(heat_score DESC);

-- ========================================
-- Users 表：用户信息（预留）
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    avatar_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 更新时间戳触发器
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为各表添加触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cards_updated_at') THEN
        CREATE TRIGGER update_cards_updated_at
            BEFORE UPDATE ON cards
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_hotspots_updated_at') THEN
        CREATE TRIGGER update_hotspots_updated_at
            BEFORE UPDATE ON hotspots
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ========================================
-- 插入模拟热点数据（V0 阶段）
-- ========================================
INSERT INTO hotspots (category, title, description, heat_score) VALUES
    ('competitor', '某品牌新品发布会', '某知名品牌于今日发布2025年春季新品系列，主打环保理念', 95),
    ('competitor', '竞品价格调整通知', '主要竞争对手宣布全线产品降价10%', 88),
    ('trending', '微博热搜TOP1', '今日最热话题，引发全网讨论', 100),
    ('trending', '抖音热榜第一', '短视频平台最火挑战，参与人数破百万', 96),
    ('ip', '新晋顶流IP', '某新剧播出后，主角相关话题持续霸榜', 92),
    ('ip', '经典IP联名', '经典动漫与潮牌联名，引发抢购热潮', 89),
    ('meme', '今日最火表情包', '魔性表情包席卷社交平台', 94),
    ('meme', '网络流行语', '"XX了"成为本周最火网络用语', 87)
ON CONFLICT DO NOTHING;
```

### 启动脚本

#### goas-setup.sh（初始化）

```bash
#!/bin/bash
# goas/goas-setup.sh
set -e

echo "🚀 Setting up Goas workspace..."

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js >=20"
    exit 1
fi

# 检查 Node 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js version must be >=20 (current: $(node -v))"
    exit 1
fi

# 安装依赖
echo "📦 Installing dependencies..."
npm ci

# 设置环境文件
echo "🔧 Setting up environment files..."

# 复制 docker.env
if [ ! -f "docker.env" ] && [ -f "docker.env.example" ]; then
    echo "  - Creating docker.env from example..."
    cp docker.env.example docker.env
    echo "⚠️  WARNING: Please update docker.env with your actual values"
fi

# 复制 .env.local
if [ ! -f ".env.local" ] && [ -f "example.env.local" ]; then
    echo "  - Creating .env.local from example..."
    cp example.env.local .env.local
    echo "⚠️  WARNING: Please update .env.local with your Tambo API key"
fi

# 构建项目
echo "🔨 Building project..."
npm run build

echo "✅ Goas setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update docker.env with your database password"
echo "  2. Update .env.local with your NEXT_PUBLIC_TAMBO_API_KEY"
echo "  3. Run './goas-run.sh' to start the application"
```

#### goas-run.sh（启动）

```bash
#!/bin/bash
# goas/goas-run.sh
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Goas services...${NC}"

# 检查 docker.env 是否存在
if [ ! -f "docker.env" ]; then
    echo -e "${RED}❌ Error: docker.env not found. Run ./goas-setup.sh first${NC}"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    exit 1
fi

# 解析命令行参数
MODE=${1:-"dev"}

case $MODE in
    "dev")
        echo -e "${YELLOW}📦 Starting PostgreSQL...${NC}"
        docker compose --env-file docker.env up postgres -d

        # 等待数据库就绪
        echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
        until docker exec goas_postgres pg_isready -U postgres -d goas > /dev/null 2>&1; do
            sleep 1
        done
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"

        echo -e "${YELLOW}🔧 Starting Next.js in development mode...${NC}"
        npm run dev
        ;;

    "prod")
        echo -e "${YELLOW}📦 Starting all services in production mode...${NC}"
        docker compose --env-file docker.env up -d
        echo -e "${GREEN}✅ All services started${NC}"
        echo ""
        echo "Services:"
        echo "  - Goas Web: http://localhost:3000"
        echo "  - Goas PostgreSQL: localhost:5434"
        ;;

    "db-only")
        echo -e "${YELLOW}📦 Starting PostgreSQL only...${NC}"
        docker compose --env-file docker.env up postgres -d
        echo -e "${GREEN}✅ PostgreSQL started at localhost:5434${NC}"
        ;;

    "stop")
        echo -e "${YELLOW}🛑 Stopping all services...${NC}"
        docker compose --env-file docker.env down
        echo -e "${GREEN}✅ All services stopped${NC}"
        ;;

    *)
        echo "Usage: ./goas-run.sh [dev|prod|db-only|stop]"
        echo ""
        echo "  dev      - Start PostgreSQL and run Next.js in development mode (default)"
        echo "  prod     - Start all services in production mode via Docker"
        echo "  db-only  - Start only PostgreSQL"
        echo "  stop     - Stop all services"
        exit 1
        ;;
esac
```

### Drizzle ORM 配置 (src/lib/db.ts)

```typescript
// goas/src/lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

const connectionString = process.env.DATABASE_URL!;

// 用于查询的连接
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// 用于迁移的连接（需要时使用）
export const migrationClient = postgres(connectionString, { max: 1 });
```

### 数据库 Schema (src/db/schema.ts)

```typescript
// goas/src/db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, date } from 'drizzle-orm/pg-core';

// Cards 表
export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  sourceAgent: varchar('source_agent', { length: 100 }).notNull(),
  imageUrl: text('image_url'),
  metadata: jsonb('metadata').default({}),
  userId: uuid('user_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Hotspots 表
export const hotspots = pgTable('hotspots', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  sourceUrl: text('source_url'),
  heatScore: integer('heat_score').default(0),
  metadata: jsonb('metadata').default({}),
  date: date('date').defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Users 表
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 导出类型
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type Hotspot = typeof hotspots.$inferSelect;
export type NewHotspot = typeof hotspots.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 完整启动流程

```bash
# 1. 首次设置
cd goas
./goas-setup.sh

# 2. 配置环境变量
# 编辑 docker.env 和 .env.local

# 3. 启动 Tambo Cloud（另一个终端）
cd ../tambo
docker compose --env-file docker.env up -d

# 4. 启动 Goas（开发模式）
cd ../goas
./goas-run.sh dev

# 或者生产模式
./goas-run.sh prod

# 停止服务
./goas-run.sh stop
```

---

## 功能模块设计

### 1. Tambo 组件注册 (app/src/lib/tambo.ts)

```tsx
import { TamboComponent, TamboTool } from "@tambo-ai/react";
import { z } from "zod";

// ========== 组件注册 ==========

// 热点卡片组件
export const hotspotCardSchema = z.object({
  id: z.string(),
  category: z.enum(["competitor", "trending", "ip", "meme"]),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
});

// Card 预览组件（保存前确认）
export const cardPreviewSchema = z.object({
  title: z.string(),
  content: z.string(),
  sourceAgent: z.string(),
  imageUrl: z.string().optional(),
});

// 热点看板组件（展示多个热点）
export const hotspotBoardSchema = z.object({
  category: z.enum(["competitor", "trending", "ip", "meme"]),
  hotspots: z.array(hotspotCardSchema),
});

export const components: TamboComponent[] = [
  {
    name: "HotspotCard",
    description: "展示单个热点信息，包含图片、标题、描述。用于在对话中展示热点详情。",
    component: HotspotCard,
    propsSchema: hotspotCardSchema,
  },
  {
    name: "HotspotBoard",
    description: "展示某个分类的热点列表，用于查看竞品/热榜/IP热度/热梗。",
    component: HotspotBoard,
    propsSchema: hotspotBoardSchema,
  },
  {
    name: "CardPreview",
    description: "Card 保存预览，让用户确认要保存的内容。",
    component: CardPreview,
    propsSchema: cardPreviewSchema,
  },
  {
    name: "CardList",
    description: "展示用户保存的 Card 列表。",
    component: CardList,
    propsSchema: cardListSchema,
  },
];

// ========== 工具注册 ==========

export const tools: TamboTool[] = [
  {
    name: "getHotspots",
    description: "获取今日热点数据。可指定分类：competitor(竞品)、trending(热榜)、ip(IP热度)、meme(热梗)。不指定则返回全部。",
    tool: getHotspots,
    toolSchema: z.function()
      .args(z.object({
        category: z.enum(["competitor", "trending", "ip", "meme"]).optional(),
      }).optional())
      .returns(z.array(hotspotCardSchema)),
  },
  {
    name: "saveCard",
    description: "将内容保存为 Card。用于用户确认保存某个热点或 AI 生成的内容。",
    tool: saveCard,
    toolSchema: z.function()
      .args(z.object({
        title: z.string(),
        content: z.string(),
        sourceAgent: z.string(),
        imageUrl: z.string().optional(),
        metadata: z.record(z.unknown()).optional(),
      }))
      .returns(z.object({ id: z.string(), success: z.boolean() })),
  },
  {
    name: "getMyCards",
    description: "获取当前用户保存的所有 Card。",
    tool: getMyCards,
    toolSchema: z.function()
      .args(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .returns(z.array(cardSchema)),
  },
];
```

### 2. 热点数据服务 (goas/src/services/hotspot.ts)

```tsx
import { db } from '@/lib/db';
import { hotspots } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// 热点数据类型（从 Schema 推导）
import type { Hotspot } from '@/db/schema';

// 获取热点（供 Tambo Tool 调用）
export async function getHotspots(params?: {
  category?: 'competitor' | 'trending' | 'ip' | 'meme';
  limit?: number;
}): Promise<Hotspot[]> {
  const query = db
    .select()
    .from(hotspots)
    .orderBy(desc(hotspots.heatScore))
    .limit(params?.limit ?? 20);

  if (params?.category) {
    return query.where(eq(hotspots.category, params.category));
  }

  return query;
}

// 获取单个热点详情
export async function getHotspotById(id: string): Promise<Hotspot | null> {
  const result = await db
    .select()
    .from(hotspots)
    .where(eq(hotspots.id, id))
    .limit(1);

  return result[0] ?? null;
}
```

### 3. Card 数据服务 (goas/src/services/card.ts)

```tsx
import { db } from '@/lib/db';
import { cards } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Card 数据类型（从 Schema 推导）
import type { Card, NewCard } from '@/db/schema';

// 保存 Card（供 Tambo Tool 调用）
export async function saveCard(params: {
  title: string;
  content: string;
  sourceAgent: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
}): Promise<{ id: string; success: boolean }> {
  const [newCard] = await db
    .insert(cards)
    .values({
      title: params.title,
      content: params.content,
      sourceAgent: params.sourceAgent,
      imageUrl: params.imageUrl,
      metadata: params.metadata ?? {},
      userId: params.userId,
    })
    .returning({ id: cards.id });

  return { id: newCard.id, success: true };
}

// 获取 Card 列表
export async function getMyCards(params?: {
  limit?: number;
  offset?: number;
  userId?: string;
}): Promise<Card[]> {
  const query = db
    .select()
    .from(cards)
    .orderBy(desc(cards.createdAt))
    .limit(params?.limit ?? 50)
    .offset(params?.offset ?? 0);

  if (params?.userId) {
    return query.where(eq(cards.userId, params.userId));
  }

  return query;
}

// 获取单个 Card 详情
export async function getCardById(id: string): Promise<Card | null> {
  const result = await db
    .select()
    .from(cards)
    .where(eq(cards.id, id))
    .limit(1);

  return result[0] ?? null;
}

// 删除 Card
export async function deleteCard(id: string): Promise<boolean> {
  const result = await db
    .delete(cards)
    .where(eq(cards.id, id))
    .returning({ id: cards.id });

  return result.length > 0;
}
```

---

## 用户交互流程

### 流程 1：查看热点

```
用户: "给我看看今天的竞品动态"
  │
  ▼
AI 调用 getHotspots({ category: "competitor" })
  │
  ▼
AI 返回 + 渲染 HotspotBoard 组件
  │
  ▼
用户在 Chatbot 中看到热点卡片列表
```

### 流程 2：保存为 Card

```
用户: "这个热点不错，帮我保存一下"
  │
  ▼
AI 渲染 CardPreview 组件（让用户确认）
  │
  ▼
用户确认
  │
  ▼
AI 调用 saveCard({ title, content, ... })
  │
  ▼
AI: "已保存到您的 Card 库"
```

### 流程 3：查看我的 Card

```
用户: "看看我保存的 Card"
  │
  ▼
AI 调用 getMyCards()
  │
  ▼
AI 渲染 CardList 组件
  │
  ▼
用户看到自己保存的所有 Card
```

---

## 开发计划

### Phase 0: 基础设施搭建

**目标**：Goas 项目 Docker 化，独立 PostgreSQL 数据库配置

- [ ] 创建 goas/docker-compose.yml
- [ ] 创建 goas/docker.env.example
- [ ] 创建 goas/src/db/init.sql 数据库初始化脚本
- [ ] 创建 goas/goas-setup.sh 初始化脚本
- [ ] 创建 goas/goas-run.sh 启动脚本
- [ ] 配置 Drizzle ORM (src/lib/db.ts + src/db/schema.ts)
- [ ] 添加 Drizzle 相关依赖 (drizzle-orm, postgres, drizzle-kit)
- [ ] 更新 package.json 添加数据库相关脚本
- [ ] 验证 PostgreSQL 可正常启动 (localhost:5434)
- [ ] 验证数据库初始化脚本正确执行

**验收**：`./goas-run.sh dev` 可正常启动 PostgreSQL 和 Next.js 开发服务器

### Phase 1: 基础框架与页面结构

**目标**：项目结构搭建，Explore + Agent 页面框架

- [ ] 创建 src/config/agents.ts（Agent 配置）
- [ ] 实现 /explore 页面（用户广场，Agent 卡片列表）
- [ ] 实现 /agent/[agentId] 路由结构
- [ ] 实现 Agent 页面三栏布局
- [ ] 实现左侧栏双区设计（Apps + 聊天记录）
- [ ] 配置 TamboProvider 在 Agent layout
- [ ] 验证与 Tambo Cloud (localhost:3211) 的连接

**验收**：可从 Explore 进入 Agent，三栏布局正常显示

### Phase 2: 双选逻辑与对话系统

**目标**：实现 Apps/聊天记录双选逻辑

- [ ] 实现 Apps 切换 → 中间内容区切换
- [ ] 实现聊天记录切换 → 右侧对话切换
- [ ] 实现新建对话功能
- [ ] 实现聊天记录列表（useAgentThreads hook）
- [ ] 验证 contextKey 切换时对话正确加载
- [ ] 验证 Tambo Chatbot 基本对话功能

**验收**：双选逻辑工作正常，切换聊天记录可恢复历史对话

### Phase 3: Tambo 组件开发

**目标**：开发 Tambo 可渲染组件

- [ ] HotspotCard 组件（单个热点）
- [ ] HotspotBoard 组件（热点列表）
- [ ] CardPreview 组件（保存预览）
- [ ] CardList 组件（Card 列表）
- [ ] AgentCard 组件（Explore 页面的 Agent 卡片）
- [ ] 在 lib/tambo.ts 注册所有组件

**验收**：组件可在 Chatbot 中被 AI 正确渲染

### Phase 4: 工具与服务开发

**目标**：开发 Tambo Tools 和数据库服务

- [ ] 创建 src/services/hotspot.ts（热点数据服务）
- [ ] 创建 src/services/card.ts（Card 数据服务）
- [ ] getHotspots 工具（从数据库获取热点数据）
- [ ] saveCard 工具（保存 Card 到数据库）
- [ ] getMyCards 工具（从数据库获取 Card 列表）
- [ ] 创建 API Routes: /api/cards, /api/hotspots
- [ ] 验证数据库读写正常

**验收**：AI 能正确调用工具，数据持久化到 PostgreSQL

### Phase 5: Agent Apps 实现

**目标**：实现创意热点 Agent 的各个 App

- [ ] 热点看板 App（四分区热点概览）
- [ ] 热点分析 App（深度分析）
- [ ] 趋势预测 App（预测展示）
- [ ] /cards 页面（跨 Agent 的 Card 列表）
- [ ] /cards/[id] 页面（Card 详情）

**验收**：创意热点 Agent 的所有 App 正常工作

### Phase 6: 联调优化

**目标**：端到端流程测试与优化

- [ ] 完整流程测试（Explore → Agent → 对话 → 保存 Card）
- [ ] AI Prompt 优化（让 AI 更好理解何时渲染组件）
- [ ] 样式美化与交互优化
- [ ] 错误处理完善
- [ ] 聊天记录持久化验证

**验收**：符合验收 Checklist

---

## 验收 Checklist

### 基础设施
- [ ] Goas PostgreSQL 可正常启动 (localhost:5434)
- [ ] 数据库初始化脚本正确执行（cards、hotspots、users 表存在）
- [ ] Drizzle ORM 可正常连接数据库
- [ ] `./goas-run.sh dev` 可正常启动所有服务

### 页面结构
- [ ] /explore 页面正常显示 Agent 卡片列表
- [ ] 点击 Agent 卡片可进入 /agent/[agentId] 页面
- [ ] Agent 页面三栏布局正常显示
- [ ] 左侧栏上半部分显示 Apps 列表
- [ ] 左侧栏下半部分显示聊天记录列表
- [ ] 返回广场按钮可返回 /explore

### 双选逻辑
- [ ] 切换 Apps 选择 → 中间内容区正确切换
- [ ] 切换聊天记录 → 右侧对话正确切换
- [ ] 新建对话功能正常
- [ ] 切换聊天记录后可恢复历史对话

### 基础功能
- [ ] Tambo Cloud 可正常启动 (localhost:3211)
- [ ] Goas 主应用可正常启动并连接 Tambo Cloud (localhost:3000)
- [ ] AI 回复流式输出正常

### 组件渲染
- [ ] AI 能根据对话渲染 HotspotCard
- [ ] AI 能根据对话渲染 HotspotBoard
- [ ] AI 能根据对话渲染 CardPreview
- [ ] AI 能根据对话渲染 CardList

### 工具调用
- [ ] AI 能正确调用 getHotspots 获取热点
- [ ] AI 能正确调用 saveCard 保存 Card
- [ ] AI 能正确调用 getMyCards 获取 Card 列表

### 端到端流程
- [ ] Explore → 点击创意热点 Agent → 进入 Agent 页面
- [ ] 在 Agent 页面选择不同 App → 中间内容切换
- [ ] 用户说"给我看看今天的热点" → AI 展示热点
- [ ] 用户说"保存这个" → AI 展示预览并保存
- [ ] 新建对话 → 切换回旧对话 → 历史记录恢复
- [ ] /cards 页面可查看所有保存的 Card

---

## 后续规划 (V1+)

### 用户系统
- 用户认证（NextAuth.js 集成）
- 用户权限管理
- Card 与用户关联

### 热点数据源
- 接入外部热点 API（微博、抖音等）
- 热点数据自动采集
- 热点数据分析与评分

### 更多 Agent
- 素材生成 Agent（AI 生成图文素材）
- 策略生成 Agent（营销策略建议）
- 数据分析 Agent（数据可视化与洞察）

### Card 上下文增强
- Card 作为 AI 对话上下文
- Card 跨 Agent 流转
- Card 关联与引用
- Card 版本管理

### 部署与运维
- 生产环境 Dockerfile 优化
- CI/CD 流水线
- 监控与日志
