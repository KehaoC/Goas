# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Guru Agent OS (Goas) is a web-based business system designed to improve enterprise execution efficiency. It consists of multiple independent AI Agents that collaborate through a unified "Card" mechanism for context sharing.

## Architecture

### Core Concepts

- **Agents**: Independent modules handling specific business tasks (creative insights, material generation, deployment execution, data analysis)
- **Cards**: Universal context carriers that persist key conclusions and experiences across agent interactions, enabling reuse and reducing repeated analysis

### Design Principle

"Agent of Work + Card as Context" - Agents handle business tasks independently while Cards flow between agents to maintain context continuity and enable experience accumulation.

## Tech Stack

### Frontend (goas/)
- **Framework**: Next.js 15 + React 19
- **AI Integration**: Tambo AI SDK (`@tambo-ai/react`)
- **Styling**: Tailwind CSS v4
- **Validation**: Zod

### Backend
- **AI Backend**: Tambo Cloud (self-hosted via `tambo/`)
- **Business Logic**: Next.js API Routes (goas/src/app/api/)
- **Database**: PostgreSQL 17 (Docker, port 5434)

### Infrastructure
- **Tambo Cloud**: `tambo/` - 提供 AI 对话、组件注册、Tool 调用等核心能力
- **Deployment**: Docker Compose

## Project Structure

```
Goas/
├── goas/                         # 主应用 (Next.js + Tambo SDK)
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── api/              # 业务 API Routes
│   │   │   ├── chat/             # AI 对话页面
│   │   │   ├── creative-hotspot/ # 创意热点 Agent
│   │   │   └── layout.tsx        # 全局布局
│   │   ├── components/
│   │   │   ├── tambo/            # Tambo 组件（AI 可渲染）
│   │   │   ├── layout/           # 布局组件
│   │   │   └── ui/               # 通用 UI 组件
│   │   ├── lib/
│   │   │   └── tambo.ts          # Tambo 组件/工具注册
│   │   ├── services/             # 业务逻辑服务
│   │   └── db/                   # 数据库相关
│   ├── docker-compose.yml        # PostgreSQL 数据库
│   ├── goas-run.sh               # 启动脚本
│   └── .env.local                # 环境变量（不提交）
├── tambo/                        # Tambo Cloud (git submodule)
│   ├── apps/web/                 # Tambo 管理界面
│   ├── apps/api/                 # Tambo API 服务
│   └── docker.env                # Tambo 环境变量（不提交）
├── doc/                          # 项目文档
└── roadmap/                      # 开发计划
```

## Key Tambo Concepts

### 1. Component Registration (AI 可渲染组件)

在 `goas/src/lib/tambo.ts` 注册组件，AI 可以根据用户需求动态渲染：

```tsx
export const components: TamboComponent[] = [
  {
    name: "HotspotCard",
    description: "展示单个热点信息，包含图片、标题、描述",
    component: HotspotCard,
    propsSchema: hotspotCardSchema,
  },
  {
    name: "CardPreview",
    description: "Card 预览组件，用于保存前确认",
    component: CardPreview,
    propsSchema: cardPreviewSchema,
  },
];
```

### 2. Tool Registration (AI 可调用的后端功能)

```tsx
export const tools: TamboTool[] = [
  {
    name: "getHotspots",
    description: "获取今日热点数据",
    tool: getHotspots,
    toolSchema: z.function().args(...).returns(...),
  },
  {
    name: "saveCard",
    description: "将内容保存为 Card",
    tool: saveCard,
    toolSchema: z.function().args(...).returns(...),
  },
];
```

### 3. TamboProvider (应用入口)

```tsx
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY}
  tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
  components={components}
  tools={tools}
>
  {children}
</TamboProvider>
```

## Development Commands

### Goas 主应用（推荐方式）
```bash
cd goas

# 环境配置（首次）
cp docker.env.example docker.env
cp example.env.local .env.local
npm install

# 一键启动（数据库 + 开发服务器）
./goas-run.sh dev

# 其他命令
./goas-run.sh db     # 仅启动数据库
./goas-run.sh stop   # 停止所有服务
```

### Goas 手动启动
```bash
cd goas
docker compose --env-file docker.env up postgres -d  # 启动数据库
npm run dev                                          # 启动开发服务器
```

### Tambo Cloud（可选，用于自托管）
```bash
cd tambo
docker compose --env-file docker.env up -d        # 启动所有服务
docker compose --env-file docker.env down         # 停止服务
```

### 完整启动流程
```bash
# 1. 启动 Tambo Cloud（如果自托管）
cd tambo && docker compose --env-file docker.env up -d

# 2. 启动 Goas 主应用
cd goas && ./goas-run.sh dev
```

## Environment Variables

### goas/.env.local
```
NEXT_PUBLIC_TAMBO_API_KEY=tambo_xxx    # 从 Tambo Cloud 获取
NEXT_PUBLIC_TAMBO_URL=http://localhost:3211
```

### goas/docker.env
```
POSTGRES_DB=goas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### tambo/docker.env
参考 `tambo/docker.env.example`，包含数据库、LLM Provider 等配置。

## Development Status

This project is in early development using Tambo SDK. The roadmap includes:
1. Phase 1: 基础框架 + 全局布局 + Chatbot 集成
2. Phase 2: 创意热点 Agent（热点看板 + AI 分析）
3. Phase 3: Card 系统（保存、列表、上下文传递）
4. Phase 4: 更多 Agent（素材生成、策略生成、数据分析）

## Important Notes

- **Tambo 组件开发**：在 `goas/src/components/tambo/` 创建，需在 `lib/tambo.ts` 注册
- **业务 API**：在 `goas/src/app/api/` 创建 Next.js API Routes
- **敏感信息**：所有 `.env*` 和 `docker.env` 文件已在 `.gitignore` 中
- **Tambo Cloud**：作为 git submodule 管理，可同步上游更新
- **端口**：Next.js (3000) / PostgreSQL (5434)
