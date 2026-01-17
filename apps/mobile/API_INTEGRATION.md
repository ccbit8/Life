# API 对接说明

## 已完成的工作

### 1. 创建 API 服务层

- [services/api.config.ts](services/api.config.ts) - API 配置（baseURL、endpoints）
- [services/api.service.ts](services/api.service.ts) - API 请求封装
- [types/api.types.ts](types/api.types.ts) - TypeScript 类型定义

### 2. 更新登录页面

- [app/login.tsx](app/login.tsx) - 集成真实 API 调用
  - ✅ 发送验证码调用后端 API
  - ✅ 验证码登录调用后端 API
  - ✅ 加载状态显示
  - ✅ 错误处理
  - ✅ 开发环境显示验证码

## 使用方法

### 1. 启动后端服务

```bash
# 在项目根目录
pnpm backend:dev
```

确保后端服务在 http://localhost:3000 运行

### 2. 启动移动端

```bash
# 在项目根目录
pnpm mobile:start
```

### 3. 测试登录流程

1. 在登录页面输入手机号（如：13800138000）
2. 点击"发送验证码"
3. **开发环境会在弹窗中显示验证码**
4. 输入验证码
5. 点击"登录"

## API 接口说明

### 发送验证码

**请求：**
```typescript
POST /auth/send-code
{
  "phoneNumber": "13800138000"
}
```

**响应：**
```typescript
{
  "success": true,
  "message": "验证码已发送",
  "code": "123456"  // 仅开发环境
}
```

### 验证登录

**请求：**
```typescript
POST /auth/verify-code
{
  "phoneNumber": "13800138000",
  "code": "123456"
}
```

**响应：**
```typescript
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "user_xxx",
    "phoneNumber": "13800138000"
  },
  "token": "token_xxx"
}
```

## 配置说明

### API 基础地址

在 [services/api.config.ts](services/api.config.ts) 中配置：

```typescript
export const API_CONFIG = {
  baseURL: __DEV__ 
    ? 'http://localhost:3000'      // 开发环境
    : 'https://your-api.com',      // 生产环境
  timeout: 10000,
};
```

### 本地开发注意事项

- **iOS 模拟器**: 使用 `http://localhost:3000`
- **Android 模拟器**: 可能需要使用 `http://10.0.2.2:3000`
- **真机**: 使用电脑的局域网 IP，如 `http://192.168.1.100:3000`

如果 Android 无法连接，修改配置：

```typescript
const API_CONFIG = {
  baseURL: Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',  // Android 模拟器
    default: 'http://localhost:3000',
  }),
};
```

## 功能特性

✅ 完整的 API 请求封装
✅ TypeScript 类型安全
✅ 加载状态管理
✅ 错误处理和提示
✅ 开发环境验证码显示
✅ 请求超时处理
✅ 环境自动切换

## 下一步建议

1. **添加 Token 存储**
   ```bash
   pnpm add @react-native-async-storage/async-storage
   ```

2. **添加全局状态管理**
   - 使用 Context API 或 Zustand
   - 管理用户登录状态

3. **添加请求拦截器**
   - 自动添加 Authorization header
   - 统一错误处理

4. **添加网络状态检测**
   ```bash
   pnpm add @react-native-community/netinfo
   ```
