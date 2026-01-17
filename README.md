# Life Monorepo

一个使用 pnpm workspace 管理的 monorepo 项目，包含移动端和后端应用。

## 项目结构

```
Life/
├── apps/
│   ├── mobile/          # React Native/Expo 移动应用
│   └── backend/         # NestJS 后端 API
├── packages/            # 共享包（可选）
├── pnpm-workspace.yaml  # pnpm workspace 配置
└── package.json         # 根 package.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 同时启动移动端和后端
pnpm dev

# 或分别启动
pnpm mobile:start
pnpm backend:dev
```

### 移动端

```bash
# 启动开发服务器
pnpm mobile:start

# 在 Android 上运行
pnpm mobile:android

# 在 iOS 上运行
pnpm mobile:ios

# 在 Web 上运行
pnpm mobile:web
```

### 后端

```bash
# 开发模式
pnpm backend:dev

# 生产构建
pnpm backend:build

# 启动生产服务
pnpm backend:start
```

## 技术栈

### 移动端 (apps/mobile)
- React Native
- Expo
- TypeScript
- Expo Router

### 后端 (apps/backend)
- NestJS
- TypeScript
- Swagger/OpenAPI

## 功能特性

- ✅ 手机号验证码登录
- ✅ 用户管理
- ✅ RESTful API
- ✅ API 文档（Swagger）
- ✅ Monorepo 架构

## API 文档

后端服务启动后，访问 http://localhost:3000/api 查看 Swagger 文档

## 环境配置

### 后端环境变量

复制 `apps/backend/.env.example` 到 `apps/backend/.env` 并配置必要的环境变量。

## 开发指南

### 添加新的 workspace

1. 在 `apps/` 或 `packages/` 下创建新目录
2. 添加 `package.json` 并设置 `name` 为 `@life/xxx`
3. pnpm workspace 会自动识别

### 跨 workspace 依赖

```json
{
  "dependencies": {
    "@life/shared": "workspace:*"
  }
}
```

## 脚本说明

- `pnpm dev` - 同时启动移动端和后端开发服务
- `pnpm mobile:*` - 移动端相关命令
- `pnpm backend:*` - 后端相关命令
- `pnpm lint` - 在所有 workspace 中运行 lint

## License

MIT

