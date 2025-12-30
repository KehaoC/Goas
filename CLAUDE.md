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

### Frontend
- **Framework**: React + Vite
- **Structure**: `components/`, `services/`, `pages/`

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL

### Deployment
- Docker (全容器化部署)

## Project Structure

```
Goas/
├── frontend/
│   ├── src/
│   │   ├── components/    # 可复用组件
│   │   ├── services/      # API 调用与业务逻辑
│   │   └── pages/         # 页面组件
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── models/        # 数据库模型
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # 业务逻辑
│   ├── requirements.txt
│   └── main.py
├── docker-compose.yml
└── Dockerfile
```

## Development Status

This project is in early development. The roadmap includes:
1. Phase 1: Demonstrable version with basic Web App framework, at least 1 Agent, and Card creation/display
2. Phase 2: Creative Hotspot Agent + Material Generation Agent with Card context flow
3. Phase 3: Strategy Generation Agent + Data Analysis Agent with decision support loop
4. Phase 4: Complete closed-loop system with unified context mechanism

## Build & Development Commands

### Frontend
```bash
cd frontend
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
```

### Backend
```bash
cd backend
pip install -r requirements.txt    # 安装依赖
uvicorn main:app --reload          # 启动开发服务器
```

### Docker
```bash
docker-compose up --build    # 构建并启动所有服务
docker-compose down          # 停止服务
```
