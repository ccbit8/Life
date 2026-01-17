# Backend

NestJS backend API server for Life application.

## Features

- ✅ 手机号验证码登录
- ✅ 用户管理
- ✅ Swagger API 文档
- ✅ 输入验证
- ✅ CORS 支持

## Quick Start

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm start:dev
```

服务器将在 http://localhost:3000 启动

### API 文档

启动服务后访问: http://localhost:3000/api

### 生产构建

```bash
pnpm build
pnpm start:prod
```

## API 端点

### 认证

- `POST /auth/send-code` - 发送验证码
- `POST /auth/verify-code` - 验证码登录

### 用户

- `GET /users/:id` - 获取用户信息

### 健康检查

- `GET /` - 基础健康检查
- `GET /health` - 详细健康状态

## 环境变量

复制 `.env.example` 到 `.env` 并配置:

```bash
NODE_ENV=development
PORT=3000
```

## 项目结构

```
src/
├── auth/           # 认证模块
├── users/          # 用户模块
├── app.module.ts   # 根模块
├── app.controller.ts
├── app.service.ts
└── main.ts         # 入口文件
```
