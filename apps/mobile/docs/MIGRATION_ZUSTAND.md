# Zustand 集成迁移指南

本指南说明如何在现有页面中集成 Zustand 状态管理。

## 已更新的文件

### 核心文件

- ✅ `package.json` - 添加 zustand 依赖
- ✅ `store/auth.store.ts` - 认证状态 Store（新建）
- ✅ `store/app.store.ts` - 应用状态 Store（新建）
- ✅ `store/index.ts` - Store 统一导出（新建）
- ✅ `hooks/useAuth.ts` - 认证 Hook（新建）
- ✅ `app/login.tsx` - 登录页面集成（已更新）
- ✅ `docs/ZUSTAND_GUIDE.md` - 完整使用指南（新建）
- ✅ `docs/ZUSTAND_EXAMPLES.ts` - 使用示例（新建）

## 更新步骤

### 步骤 1：安装依赖

```bash
cd apps/mobile
pnpm install
```

Zustand 已在 package.json 中添加，pnpm install 会自动安装。

### 步骤 2：检查导入

确保所有文件的导入路径正确：

```typescript
// ✅ 正确的导入方式
import { useAuthStore } from "@/store";
import useAuth from "@/hooks/useAuth";

// ❌ 避免
import { useAuthStore } from "@/store/auth.store";
```

### 步骤 3：更新现有页面

#### 个人资料页面示例

**之前**：

```typescript
// apps/mobile/app/(tabs)/profile.tsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const raw = await AsyncStorage.getItem('life.auth.session');
      const session = raw ? JSON.parse(raw) : null;
      setUser(session?.user);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('life.auth.session');
    router.replace('/login');
  };

  return (
    // UI ...
  );
}
```

**之后**：

```typescript
// apps/mobile/app/(tabs)/profile.tsx
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    // UI ...
  );
}
```

#### 标签栏导航 `_layout.tsx` 示例

**之前**：

```typescript
// apps/mobile/app/(tabs)/_layout.tsx
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const raw = await AsyncStorage.getItem('life.auth.session');
      const session = raw ? JSON.parse(raw) : null;
      if (!session?.token) {
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    // Tab 组件 ...
  );
}
```

**之后**：

```typescript
// apps/mobile/app/(tabs)/_layout.tsx
import { useAuthStore } from '@/store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
  const { isAuthenticated, restoreSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const hasSession = await restoreSession();
      if (!hasSession && !isAuthenticated) {
        router.replace('/login');
      }
    };
    checkAuth();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    // Tab 组件 ...
  );
}
```

### 步骤 4：验证更新

运行以下命令验证项目可以正确加载：

```bash
# 安装依赖
pnpm install

# 启动项目
pnpm mobile:start
```

## 常见迁移问题

### 问题 1：状态不会自动更新到 UI

**原因**：没有正确订阅 Store

**解决**：

```typescript
// ❌ 错误：访问整个 store，但没有订阅
const auth = useAuthStore.getState();

// ✅ 正确：使用 Hook，自动订阅
const { user } = useAuthStore();

// ✅ 也可以：选择性订阅
const user = useAuthStore((state) => state.user);
```

### 问题 2：登出后页面没有跳转

**原因**：logout 是异步操作，需要 await

**解决**：

```typescript
// ❌ 错误
const handleLogout = () => {
  logout();
  router.replace("/login");
};

// ✅ 正确
const handleLogout = async () => {
  await logout();
  router.replace("/login");
};
```

### 问题 3：应用重启后丢失用户信息

**原因**：没有在应用启动时恢复会话

**解决**：在应用入口点调用 `restoreSession()`

```typescript
// app/_layout.tsx
useEffect(() => {
  const bootstrap = async () => {
    await useAuthStore.getState().restoreSession();
  };
  bootstrap();
}, []);
```

## API 服务更新

API 服务已经自动支持从 Store 获取 Token，无需修改。

```typescript
// services/api.service.ts 中的 request 方法
const { token } = useAuthStore.getState();
// 通过 Zustand persist 自动提供最新 Token
```

## 回滚计划

如需回滚到之前的实现，只需：

1. 移除 `store/` 目录
2. 移除 `hooks/useAuth.ts`
3. 将 API 调用中的 Token 读取回退为手动从 AsyncStorage 读取
4. 从 package.json 移除 zustand 依赖

但**不建议回滚**，因为 Zustand 提供了更好的状态管理和开发体验。

## 性能优化建议

### 1. 使用选择性订阅

```typescript
// 不会因为 token 更新而重新渲染
const user = useAuthStore((state) => state.user);
```

### 2. 在事件处理器中使用 getState()

```typescript
const handleSubmit = async () => {
  // 在异步操作中获取最新状态
  const { token } = useAuthStore.getState();
  await apiService.post("/data", { token });
};
```

### 3. 避免在循环中创建新 Store 实例

```typescript
// ❌ 每次都创建新的 Store
list.map(() => {
  const store = useAuthStore.getState();
  // ...
});

// ✅ 在外部创建一次
const store = useAuthStore.getState();
list.forEach(() => {
  // 使用 store
});
```

## 下一步

1. 查看 [ZUSTAND_GUIDE.md](./ZUSTAND_GUIDE.md) 了解完整 API
2. 查看 [ZUSTAND_EXAMPLES.ts](./ZUSTAND_EXAMPLES.ts) 查看实际示例
3. 为其他业务域创建新的 Store（训练、AI教练等）
4. 添加 persist 中间件实现更复杂的持久化需求

## 支持

如有问题，请参考：

- Zustand 官方文档：https://github.com/pmndrs/zustand
- 项目文档：[ZUSTAND_GUIDE.md](./ZUSTAND_GUIDE.md)
- 代码示例：[ZUSTAND_EXAMPLES.ts](./ZUSTAND_EXAMPLES.ts)
