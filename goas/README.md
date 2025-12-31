# Goas (Guru Agent OS)

基于 Tambo AI 的企业级 AI Agent 应用，支持生成式 UI 和智能组件渲染。

## Quick Start

### 1. 环境准备

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp docker.env.example docker.env
cp example.env.local .env.local
```

### 2. 配置环境变量

**docker.env** - 数据库配置：
```
POSTGRES_DB=goas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

**.env.local** - Tambo 配置：
```
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key  # 从 tambo.co/dashboard 获取
NEXT_PUBLIC_TAMBO_URL=http://localhost:3211
```

### 3. 启动服务

**推荐方式：**
```bash
./goas-run.sh dev    # 一键启动数据库 + 开发服务器
```

**手动方式：**
```bash
# 启动数据库
docker compose --env-file docker.env up postgres -d

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 4. 停止服务

```bash
./goas-run.sh stop
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `./goas-run.sh dev` | 启动数据库 + 开发服务器 |
| `./goas-run.sh db` | 仅启动数据库 |
| `./goas-run.sh stop` | 停止所有服务 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 代码检查 |

## Tech Stack

- **Next.js 15** + **React 19** + **TypeScript**
- **Tambo AI SDK** - AI 生成式 UI
- **Tailwind CSS v4** - 样式
- **PostgreSQL 17** - 数据库

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── chat/             # AI 对话页面
│   ├── creative-hotspot/ # 创意热点 Agent
│   └── layout.tsx        # 根布局
├── components/
│   ├── tambo/            # AI 可渲染组件
│   ├── layout/           # 布局组件
│   └── ui/               # 通用 UI
├── lib/
│   └── tambo.ts          # 组件/工具注册
├── services/             # 业务逻辑
└── db/
    └── init.sql          # 数据库初始化
```

## Customizing

### 添加 AI 组件

在 `src/lib/tambo.ts` 注册组件：

```tsx
const components: TamboComponent[] = [
  {
    name: "MyComponent",
    description: "组件描述",
    component: MyComponent,
    propsSchema: z.object({
      title: z.string(),
      // ...
    }),
  },
];
```

### 添加工具

```tsx
export const tools: TamboTool[] = [
  {
    name: "myTool",
    description: "工具描述",
    tool: myToolFunction,
    toolSchema: z.function().args(/* ... */),
  },
];
```

## Ports

- `3000` - Next.js 应用
- `5434` - PostgreSQL 数据库

## Documentation

- [Tambo 官方文档](https://docs.tambo.co)
- [项目架构说明](./CLAUDE.md)
