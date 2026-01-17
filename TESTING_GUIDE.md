# 🧪 登录功能测试指南

## 前置条件

1. ✅ 后端服务运行在 http://localhost:3000
2. ✅ 移动端应用已启动

## 测试步骤

### 1️⃣ 启动后端（如果还没启动）

```bash
# 终端 1
cd c:\git\Life
pnpm backend:dev
```

等待看到：
```
Application is running on: http://localhost:3000
Swagger documentation: http://localhost:3000/api
```

### 2️⃣ 启动移动端

```bash
# 终端 2
cd c:\git\Life
pnpm mobile:start
```

选择运行平台：
- 按 `w` - Web 浏览器（最简单）
- 按 `a` - Android 模拟器
- 按 `i` - iOS 模拟器

### 3️⃣ 测试登录流程

1. **进入登录页面**
   - 首页点击"👉 前往手机号登录"

2. **输入手机号**
   - 测试号码：`13800138000`
   - 任何符合格式的 `1[3-9]xxxxxxxxx` 都可以

3. **发送验证码**
   - 点击"发送验证码"按钮
   - 查看弹窗显示的验证码（开发环境）
   - 或查看后端终端日志

4. **输入验证码**
   - 输入刚才收到的 6 位验证码

5. **登录**
   - 点击"登录"按钮
   - 成功后会跳转到主页

## 🔍 调试技巧

### 查看后端日志

后端终端会显示：
```
验证码发送到 13800138000: 123456
```

### 查看移动端日志

在移动端控制台可以看到：
```
登录成功: {id: "xxx", phoneNumber: "13800138000"}
Token: token_xxx_xxx
```

### 测试 API 直接调用

使用 PowerShell 测试后端：

```powershell
# 发送验证码
Invoke-RestMethod -Uri "http://localhost:3000/auth/send-code" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"phoneNumber":"13800138000"}'

# 验证登录
Invoke-RestMethod -Uri "http://localhost:3000/auth/verify-code" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"phoneNumber":"13800138000","code":"验证码"}'
```

### 使用 Swagger UI 测试

访问：http://localhost:3000/api

1. 展开 `POST /auth/send-code`
2. 点击 "Try it out"
3. 输入手机号
4. 点击 "Execute"
5. 查看响应中的验证码

## ❌ 常见问题

### 问题 1: "网络请求失败"

**解决方案：**
- 确认后端服务是否在运行
- 检查 http://localhost:3000/health 是否可访问
- Android 模拟器可能需要使用 `10.0.2.2:3000`

### 问题 2: "验证码错误"

**原因：**
- 验证码有效期 5 分钟
- 每次发送验证码会覆盖之前的

**解决方案：**
- 重新发送验证码
- 查看后端日志获取最新验证码

### 问题 3: Android 无法连接

修改 `apps/mobile/services/api.config.ts`：

```typescript
import { Platform } from 'react-native';

export const API_CONFIG = {
  baseURL: Platform.select({
    android: 'http://10.0.2.2:3000',
    default: 'http://localhost:3000',
  }),
  timeout: 10000,
};
```

### 问题 4: 真机测试无法连接

1. 获取电脑 IP：
```powershell
ipconfig
# 找到 IPv4 地址，如 192.168.1.100
```

2. 修改配置：
```typescript
baseURL: 'http://192.168.1.100:3000'
```

3. 确保手机和电脑在同一局域网

## ✅ 成功标志

- ✅ 点击发送验证码后有弹窗提示
- ✅ 倒计时开始（60 秒）
- ✅ 输入验证码后能成功登录
- ✅ 登录后跳转到主页
- ✅ 后端日志显示请求记录

## 📊 完整测试用例

| 测试项 | 输入 | 预期结果 |
|--------|------|----------|
| 空手机号发送验证码 | 无 | 提示"请输入正确的手机号码" |
| 错误格式手机号 | 12345 | 提示"请输入正确的手机号码" |
| 正确手机号 | 13800138000 | 验证码发送成功 |
| 空验证码登录 | 无 | 提示"请输入手机号和验证码" |
| 错误验证码 | 000000 | 提示"验证码错误" |
| 正确验证码 | 后端返回的码 | 登录成功并跳转 |
| 重复点击发送 | - | 倒计时内按钮禁用 |

祝测试顺利！🎉
