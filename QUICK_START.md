# 🚀 快速开始

## 第一次使用

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动后端
```bash
pnpm backend:dev
```

✅ 后端启动成功标志：
```
Application is running on: http://localhost:3000
Swagger documentation: http://localhost:3000/api
```

### 3. 测试 API（新终端）

访问 Swagger 文档测试 API：
```
http://localhost:3000/api
```

或使用命令行测试：

**发送验证码：**
```bash
curl -X POST http://localhost:3000/auth/send-code ^
  -H "Content-Type: application/json" ^
  -d "{\"phoneNumber\":\"13800138000\"}"
```

**验证登录（开发环境会返回验证码）：**
```bash
curl -X POST http://localhost:3000/auth/verify-code ^
  -H "Content-Type: application/json" ^
  -d "{\"phoneNumber\":\"13800138000\",\"code\":\"返回的验证码\"}"
```

### 4. 启动移动端（新终端）
```bash
pnpm mobile:start
```

然后选择：
- 按 `a` - Android 模拟器
- 按 `i` - iOS 模拟器
- 按 `w` - Web 浏览器

## 日常开发

### 同时启动前后端
```bash
pnpm dev
```

这将同时运行：
- ✅ 移动端开发服务器
- ✅ 后端 API 服务器

### 分别启动
```bash
# 只启动后端
pnpm backend:dev

# 只启动移动端
pnpm mobile:start
```

## 项目结构导航

```
apps/mobile/app/login.tsx     → 手机号登录界面
apps/backend/src/auth/        → 后端登录 API
apps/backend/src/users/       → 用户管理
```

## 常见问题

### Q: 端口被占用
A: 修改 `apps/backend/.env` 中的 `PORT` 配置

### Q: 移动端找不到模块
A: 在 `apps/mobile` 目录运行 `pnpm install`

### Q: 后端启动失败
A: 检查 `apps/backend/.env` 文件是否存在

## 开发提示

- 📝 API 文档: http://localhost:3000/api
- 🔍 后端日志会显示验证码（仅开发环境）
- 🔄 代码改动会自动热重载

## 下一步

查看详细文档：
- [完整功能说明](./MIGRATION_COMPLETE.md)
- [移动端 README](./apps/mobile/README.md)
- [后端 README](./apps/backend/README.md)
