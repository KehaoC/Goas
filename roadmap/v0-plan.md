# V0 版本计划：可展示版本

## 核心目标

验证产品形态与核心交互是否成立，实现最小可用的「Agent + Card」闭环。

**验收标准**：能完整演示「进入 Agent → 输入需求 → 生成结果 → 形成 Card → 查看 Card」的流程。

---

## 全局布局设计（核心架构）

整个平台采用**三栏固定布局**，这是 V0 必须实现的核心架构：

```
┌──────────────┬─────────────────────────────┬────────────────┐
│    左侧      │           中间              │      右侧      │
│   App 切换   │        Agent 内容区         │    Chatbot     │
│   (固定)     │         (路由切换)          │   (全局保持)   │
├──────────────┼─────────────────────────────┼────────────────┤
│              │                             │                │
│ ○ 创意热点   │   ┌─────────┬─────────┐     │  [用户消息]    │
│ ○ 素材生成   │   │  竞品   │  热榜   │     │  [AI 回复]     │
│ ○ 策略生成   │   ├─────────┼─────────┤     │  [用户消息]    │
│ ○ 数据分析   │   │ IP热度  │  热梗   │     │  ...           │
│              │   └─────────┴─────────┘     │                │
│ ─────────── │                             │  ┌──────────┐  │
│ ○ 我的 Card  │                             │  │ 输入框   │  │
│              │                             │  └──────────┘  │
└──────────────┴─────────────────────────────┴────────────────┘
```

### 关键设计要点

1. **左侧边栏**：App/Agent 切换导航，固定不动
2. **中间内容区**：随路由切换，展示当前 Agent 内容
3. **右侧 Chatbot**：
   - **全局保持**：切换 App 时不刷新，对话状态保持
   - 跨 Agent 通用，可在任何页面与 AI 对话
   - 使用 React Context 管理对话状态，独立于路由

### 技术实现要点

```tsx
// 布局结构示意
<AppLayout>
  <LeftSidebar />           {/* 固定，App 切换 */}
  <MainContent>
    <Outlet />              {/* 路由切换区域 */}
  </MainContent>
  <RightChatbot />          {/* 固定，状态通过 Context 保持 */}
</AppLayout>

// Chatbot 状态管理
<ChatbotProvider>           {/* 包裹整个 App，状态不随路由变化 */}
  <RouterProvider />
</ChatbotProvider>
```

---

## 功能范围

### 1. 基础框架

| 模块 | 内容 |
|------|------|
| 前端 | React + Vite 项目初始化，路由配置，基础布局组件 |
| 后端 | FastAPI 项目初始化，PostgreSQL 连接，API 结构 |
| 部署 | Docker Compose 配置（frontend + backend + postgres） |

### 2. 用户系统（简化版）

采用**邮箱注册登录**方案：
- 邮箱 + 密码注册
- 邮箱 + 密码登录
- **无需邮箱验证**（简化流程）
- 目的：区分不同用户的 Card 归属
- 延后：密码找回、权限管理

### 3. Agent 模块

**选择实现：创意热点 Agent**

#### 形态：热点看板

创意热点 Agent 是一个**热点看板**，展示四个分类的热点内容：

```
┌─────────────────────────────────────────────────────┐
│                   创意热点看板                       │
├────────────────────────┬────────────────────────────┤
│         竞品           │           热榜             │
│  ┌────┐ ┌────┐ ┌────┐ │  ┌────┐ ┌────┐ ┌────┐     │
│  │ 图 │ │ 图 │ │ 图 │ │  │ 图 │ │ 图 │ │ 图 │     │
│  │ 片 │ │ 片 │ │ 片 │ │  │ 片 │ │ 片 │ │ 片 │     │
│  ├────┤ ├────┤ ├────┤ │  ├────┤ ├────┤ ├────┤     │
│  │标题│ │标题│ │标题│ │  │标题│ │标题│ │标题│     │
│  │描述│ │描述│ │描述│ │  │描述│ │描述│ │描述│     │
│  └────┘ └────┘ └────┘ │  └────┘ └────┘ └────┘     │
├────────────────────────┼────────────────────────────┤
│        IP 热度         │           热梗             │
│  ┌────┐ ┌────┐ ┌────┐ │  ┌────┐ ┌────┐ ┌────┐     │
│  │ 图 │ │ 图 │ │ 图 │ │  │ 图 │ │ 图 │ │ 图 │     │
│  │ 片 │ │ 片 │ │ 片 │ │  │ 片 │ │ 片 │ │ 片 │     │
│  ├────┤ ├────┤ ├────┤ │  ├────┤ ├────┤ ├────┤     │
│  │标题│ │标题│ │标题│ │  │标题│ │标题│ │标题│     │
│  │描述│ │描述│ │描述│ │  │描述│ │描述│ │描述│     │
│  └────┘ └────┘ └────┘ │  └────┘ └────┘ └────┘     │
└────────────────────────┴────────────────────────────┘
```

#### 四大看板分类

| 分类 | 说明 |
|------|------|
| 竞品 | 竞争对手的最新动态、营销活动 |
| 热榜 | 各平台热搜、热门话题 |
| IP 热度 | 热门 IP、明星、KOL 动态 |
| 热梗 | 网络流行梗、表情包、流行语 |

#### 热点数据结构

每个热点包含：
- **图片**：热点封面图
- **标题**：热点名称
- **描述**：简要说明

#### 数据更新机制

- **更新频率**：每天早上 9:00 自动更新
- **实现方式**：后端定时任务（APScheduler）
- **数据来源**：LLM 生成 + 可选的外部数据源

#### 用户交互

- 点击单个热点 → 可保存为 Card
- 热点详情展开 → 查看更多信息
- 通过右侧 Chatbot 深入讨论某个热点

### 4. Card 模块

**Card 数据结构**：
```
Card {
  id: UUID
  title: string           # 标题
  content: string         # 主要内容/结论
  source_agent: string    # 来源 Agent
  created_by: user_id     # 创建者
  created_at: datetime    # 创建时间
  metadata: JSON          # 扩展字段（预留）
}
```

功能：
- Card 列表页（我的 Card）
- Card 详情页（查看完整内容）
- 从 Agent 结果创建 Card

**延后功能**：
- Card 编辑/删除
- Card 收藏
- Card 作为上下文带入 Agent（阶段二）

---

## 页面结构

```
/                     # 默认跳转到创意热点
/creative-hotspot     # 创意热点看板
/cards                # Card 列表页
/cards/:id            # Card 详情页
/login                # 登录页
/register             # 注册页
```

**注意**：所有主页面都在三栏布局内，右侧 Chatbot 始终可见。

### 页面设计要点

**创意热点看板**
- 2x2 网格布局，四个分区
- 每个分区可横向滚动查看更多热点
- 点击热点可保存为 Card 或与 Chatbot 讨论

**Card 列表页**
- 按时间倒序展示
- 显示：图片缩略图、标题、来源、创建时间
- 点击进入详情

---

## 技术实现

### 前端结构

```
frontend/src/
├── components/
│   ├── Layout/
│   │   ├── AppLayout.tsx      # 三栏主布局
│   │   ├── LeftSidebar.tsx    # 左侧 App 切换栏
│   │   └── RightChatbot.tsx   # 右侧全局 Chatbot
│   ├── Chatbot/
│   │   ├── ChatWindow.tsx     # 聊天窗口
│   │   ├── MessageList.tsx    # 消息列表
│   │   └── ChatInput.tsx      # 输入框
│   ├── HotspotBoard/
│   │   ├── BoardSection.tsx   # 看板分区（竞品/热榜/IP/热梗）
│   │   └── HotspotCard.tsx    # 单个热点卡片
│   └── Card/
│       └── CardItem.tsx       # Card 列表项
├── pages/
│   ├── CreativeHotspot/       # 创意热点看板页
│   ├── CardList/              # Card 列表
│   ├── CardDetail/            # Card 详情
│   ├── Login/                 # 登录页
│   └── Register/              # 注册页
├── contexts/
│   ├── AuthContext.tsx        # 用户认证状态
│   └── ChatbotContext.tsx     # Chatbot 状态（全局保持）
├── services/
│   ├── api.ts                 # API 请求封装
│   ├── auth.ts                # 认证相关
│   ├── hotspot.ts             # 热点数据
│   └── chat.ts                # Chatbot 对话
└── hooks/
    ├── useAuth.ts
    └── useChatbot.ts
```

### 后端结构

```
backend/app/
├── api/
│   ├── auth.py           # 注册/登录接口
│   ├── hotspots.py       # 热点数据接口
│   ├── cards.py          # Card CRUD 接口
│   └── chat.py           # Chatbot 对话接口
├── models/
│   ├── user.py           # User 模型
│   ├── card.py           # Card 模型
│   ├── hotspot.py        # Hotspot 热点模型
│   └── chat_message.py   # 聊天消息模型
├── schemas/
│   ├── user.py
│   ├── card.py
│   ├── hotspot.py
│   └── chat.py
├── services/
│   ├── llm.py            # Gemini API 封装
│   ├── hotspot_service.py # 热点生成服务
│   └── chat_service.py   # 聊天服务
├── tasks/
│   └── scheduler.py      # 定时任务（每天9点更新热点）
├── core/
│   ├── config.py         # 配置管理
│   └── database.py       # 数据库连接
└── main.py               # 应用入口
```

### API 设计

```
# 认证
POST   /api/auth/register           # 注册（邮箱+密码）
POST   /api/auth/login              # 登录（邮箱+密码）
GET    /api/auth/me                 # 获取当前用户

# 热点看板
GET    /api/hotspots                # 获取今日热点（四个分类）
GET    /api/hotspots/{category}     # 获取特定分类热点

# Card
GET    /api/cards                   # Card 列表
POST   /api/cards                   # 创建 Card（从热点保存）
GET    /api/cards/{id}              # Card 详情

# Chatbot（全局）
POST   /api/chat                    # 发送消息（支持 streaming）
GET    /api/chat/history            # 获取聊天历史
```

### 数据库设计

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 热点表
CREATE TABLE hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(20) NOT NULL,  -- competitor/trending/ip/meme
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    date DATE NOT NULL,             -- 热点日期
    created_at TIMESTAMP DEFAULT NOW()
);

-- Card 表
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    source_agent VARCHAR(50) NOT NULL,
    source_hotspot_id UUID REFERENCES hotspots(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- 聊天消息表
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) NOT NULL,      -- user/assistant
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_hotspots_date ON hotspots(date DESC);
CREATE INDEX idx_hotspots_category ON hotspots(category);
CREATE INDEX idx_cards_created_by ON cards(created_by);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id, created_at);
```

---

## LLM 集成

### 方案选择

使用 **Google Gemini** 系列模型。

**环境变量配置**（.env 文件，不提交到 Git）：
```
GEMINI_API_KEY=your_api_key_here
```

**核心接口**：
```python
# services/llm.py
import google.generativeai as genai

async def call_gemini(
    prompt: str,
    system_prompt: str = None,
    stream: bool = False,
    model: str = "gemini-pro"
) -> AsyncGenerator[str, None] | str:
    ...
```

### 创意热点 Agent Prompt 设计

*（具体 Prompt 待定，需根据 Agent 形态设计）*

---

## 开发顺序

### Phase 1: 基础搭建
1. 前端项目初始化（Vite + React + Router）
2. 后端项目初始化（FastAPI + SQLAlchemy）
3. Docker Compose 配置
4. 数据库模型创建

### Phase 2: 全局布局
5. 三栏布局实现（左侧边栏 + 中间内容 + 右侧 Chatbot）
6. ChatbotContext 状态管理（确保切换页面不丢失）
7. 左侧 App 切换导航

### Phase 3: 用户认证
8. 注册/登录页面
9. 认证 API + JWT

### Phase 4: 创意热点看板
10. 热点数据模型 + API
11. 四分区看板 UI
12. 定时任务（每天9点更新）
13. 热点生成服务（Gemini）

### Phase 5: Chatbot
14. 聊天 API（streaming）
15. 聊天 UI 组件
16. 聊天历史持久化

### Phase 6: Card 功能
17. 从热点保存为 Card
18. Card 列表 + 详情页

### Phase 7: 完善
19. 样式美化
20. 错误处理
21. 部署测试

---

## 验收 Checklist

### 基础功能
- [ ] 可通过 Docker Compose 一键启动
- [ ] 可注册新账号（邮箱+密码）
- [ ] 可登录系统

### 全局布局（核心）
- [ ] 三栏布局正常显示
- [ ] 左侧可切换不同 App/Agent
- [ ] **切换 App 时右侧 Chatbot 不刷新，对话保持**

### 创意热点看板
- [ ] 四个分区正常展示（竞品/热榜/IP热度/热梗）
- [ ] 每个热点显示：图片 + 标题 + 描述
- [ ] 热点数据每天9点自动更新

### Chatbot
- [ ] 可在右侧发送消息
- [ ] AI 回复正常（流式输出）
- [ ] 聊天历史保持

### Card 功能
- [ ] 可将热点保存为 Card
- [ ] 可在 Card 列表查看已保存的 Card
- [ ] 可查看 Card 详情
