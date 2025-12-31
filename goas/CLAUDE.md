# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Goas (Guru Agent OS)** - 基于 Tambo AI 的企业级 AI Agent 应用，支持生成式 UI 和智能组件渲染。

## Quick Start

### 环境配置

```bash
# 1. 复制环境变量文件
cp docker.env.example docker.env
cp example.env.local .env.local

# 2. 编辑环境变量
# docker.env - 数据库配置
# .env.local - Tambo API Key (从 Tambo Cloud 获取)
```

### 启动方式

**推荐方式 - 使用启动脚本：**
```bash
./goas-run.sh dev    # 启动数据库 + 开发服务器
./goas-run.sh db     # 仅启动数据库
./goas-run.sh stop   # 停止所有服务
```

**手动启动：**
```bash
# 1. 启动 PostgreSQL
docker compose --env-file docker.env up postgres -d

# 2. 启动开发服务器
npm run dev
```

### 常用命令

```bash
npm run dev          # 启动开发服务器 (localhost:3000)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run lint:fix     # 代码检查并自动修复
```

## Tech Stack

- **Next.js 15** + **React 19** + **TypeScript**
- **Tambo AI SDK** (`@tambo-ai/react`) - AI 生成式 UI
- **Tailwind CSS v4** - 样式
- **Zod** - Schema 验证
- **PostgreSQL 17** - 数据库 (Docker)

## Architecture

### 核心概念

1. **Component Registration** - 在 `src/lib/tambo.ts` 注册组件，AI 可动态渲染
2. **Tool System** - 注册工具函数，AI 可调用执行后端操作
3. **TamboProvider** - 在 `src/app/layout.tsx` 包裹应用，提供 AI 能力

### 目录结构

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── chat/             # 对话页面
│   ├── creative-hotspot/ # 创意热点 Agent
│   └── layout.tsx        # 根布局 (TamboProvider)
├── components/
│   ├── tambo/            # Tambo 组件 (AI 可渲染)
│   ├── layout/           # 布局组件
│   └── ui/               # 通用 UI
├── lib/
│   ├── tambo.ts          # 组件/工具注册 (核心配置)
│   └── utils.ts          # 工具函数
├── services/             # 业务逻辑
└── db/                   # 数据库相关
    └── init.sql          # 数据库初始化脚本
```

## Development Guidelines

### 添加 AI 可控组件

1. 在 `src/components/tambo/` 创建组件
2. 定义 Zod schema
3. 在 `src/lib/tambo.ts` 的 `components` 数组中注册

```tsx
{
  name: "MyComponent",
  description: "组件描述，帮助 AI 理解何时使用",
  component: MyComponent,
  propsSchema: myComponentSchema,
}
```

### 添加 AI 可调用工具

1. 在 `src/services/` 实现函数
2. 定义 Zod schema
3. 在 `src/lib/tambo.ts` 的 `tools` 数组中注册

```tsx
{
  name: "myTool",
  description: "工具描述",
  tool: myToolFunction,
  toolSchema: z.function().args(...).returns(...),
}
```

### 代码规范

- 使用 Tailwind CSS
- 组件支持 dark mode
- TypeScript 严格模式
- 使用 Zod 进行运行时验证

## Key Tambo Hooks

- `useTamboThread` - 线程状态和消息管理
- `useTamboThreadInput` - 输入处理
- `useTamboStreaming` - 实时流式内容
- `useTamboSuggestions` - AI 建议管理

## Environment Variables

### .env.local
```
NEXT_PUBLIC_TAMBO_API_KEY=tambo_xxx
NEXT_PUBLIC_TAMBO_URL=http://localhost:3211
```

### docker.env
```
POSTGRES_DB=goas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## Ports

- `3000` - Next.js 开发服务器
- `5434` - PostgreSQL 数据库

---

<!-- tambo-docs-v1.0 -->
## Tambo AI Framework

**Documentation**: https://docs.tambo.co/llms.txt

**CLI**: `npx tambo help` - 添加组件或升级
