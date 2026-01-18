# Zustand 全局状态管理

## 概述

项目使用 [Zustand](https://github.com/pmndrs/zustand) 作为全局状态管理库。Zustand 是一个轻量级的状态管理方案，具有简洁的 API 和优异的性能。

## Store 结构

### 1. 认证 Store (`store/auth.store.ts`)

管理用户认证相关状态：

```typescript
export interface AuthState {
  // 状态
  user: User | null; // 当前用户信息
  token: string | null; // 认证令牌
  isAuthenticated: boolean; // 是否已认证
  isLoading: boolean; // 加载状态

  // 操作
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
}
```

### 2. 应用 Store (`store/app.store.ts`)

管理全局应用状态：

```typescript
export interface AppState {
  // 状态
  isAppReady: boolean; // 应用是否就绪
  networkConnected: boolean; // 网络是否连接
  theme: "light" | "dark" | "auto"; // 主题

  // 操作
  setAppReady: (ready: boolean) => void;
  setNetworkConnected: (connected: boolean) => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
}
```

## 使用方法

### 方式 1：使用 Actions 层（推荐 ⭐）

Actions 层结合了 API 调用和状态管理，提供"一步到位"的操作：

```typescript
import { authActions } from '@/actions/auth';

export function LoginScreen() {
  const handleLogin = async () => {
    // 自动调用 API 并更新 Store
    const response = await authActions.login(phone, code);
    if (response.success) {
      router.replace('/(tabs)');
    }
  };

  return <Button onPress={handleLogin} title="登录" />;
}
```

**优点：**

- ✅ 自动处理状态更新，无需手动调用 `login()`
- ✅ 减少组件中的重复代码
- ✅ 保持 API 层和 Store 层的独立性
- ✅ 易于测试和维护

### 方式 2：使用 Hook

```typescript
import useAuth from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <View>
      <Text>{user?.phoneNumber}</Text>
    </View>
  );
}
```

### 方式 3：直接使用 Store（基础用法）

```typescript
import { useAuthStore } from '@/store';

export function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuthStore();

  return (
    <View>
      <Text>{user?.phoneNumber}</Text>
      <Button onPress={() => logout()} title="登出" />
    </View>
  );
}
```

### 方式 4：在异步函数中使用

```typescript
import { useAuthStore } from '@/store';

export function MyComponent() {
  const handleLogin = async () => {
    const { login } = useAuthStore.getState();
    await login(userData, token);
  };

  return <Button onPress={handleLogin} title="登录" />;
}
```

## 实际示例

### 登录页面集成（推荐方式）

使用 Actions 层，代码更简洁：

```typescript
import { authActions } from '@/actions/auth';

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      // 一步到位：调用 API + 更新状态
      const response = await authActions.login(phone, code);
      if (response.success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('登录失败', error.message);
    }
  };

  return (
    // ... UI 代码
  );
}
```

### 登录页面集成（传统方式）

如果需要更细粒度的控制：

```typescript
import { useAuthStore } from '@/store';
import { apiService } from '@/services/api.service';

export default function LoginScreen() {
  const { login } = useAuthStore();

  const handleLogin = async () => {
    const response = await apiService.verifyCode(phone, code);
    if (response.success) {
      // 手动保存到存储并更新状态
      await login(response.user, response.token);
      router.replace('/(tabs)');
    }
  };

  return (
    // ... UI 代码
  );
}
```

### 个人资料页面

使用 Actions 层处理登出：

```typescript
import useAuth from '@/hooks/useAuth';
import { authActions } from '@/actions/auth';

export default function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await authActions.logout();  // 自动清除状态
    router.replace('/login');
  };

  if (!isAuthenticated) {
    return <Text>未登录</Text>;
  }

  return (
    <View>
      <Text>用户：{user?.phoneNumber}</Text>
      <Button onPress={handleLogout} title="登出" />
    </View>
  );
}
```

### 标签栏导航保护

```typescript
import { useAuthStore } from '@/store';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ProtectedRoute() {
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
  }, []);

  return isAuthenticated ? <YourComponent /> : null;
}
```

## 状态持久化

### 自动持久化流程

1. **登录时**：

   ```typescript
   await login(user, token);
   // 通过 persist 自动保存到 AsyncStorage
   ```

2. **应用启动时**：

   ```typescript
   const hasSession = await restoreSession();
   // 从 AsyncStorage 读取并恢复状态
   ```

3. **登出时**：
   ```typescript
   await logout();
   // 通过 persist 自动清空存储
   ```

### 手动管理状态

```typescript
const { setUser, setToken } = useAuthStore();

// 只更新状态，不保存到存储
setUser(newUser);
setToken(newToken);

// 如需同步到存储，使用 login()
const { login } = useAuthStore.getState();
await login(newUser, newToken);
```

## Actions 层（推荐架构）

### 什么是 Actions 层？

Actions 层是连接 API 服务和 Zustand Store 的中间层，提供"一步到位"的业务操作。

**架构图：**

```
组件层 (Component)
    ↓
Actions 层 (actions/auth.ts)
    ↓                    ↓
API 服务层        Zustand Store
(api.service.ts)  (auth.store.ts)
```

### 为什么使用 Actions 层？

**优点：**

1. ✅ **自动化** - 自动处理 API 调用和状态更新
2. ✅ **简洁** - 组件代码更简洁，减少重复
3. ✅ **解耦** - API 层和 Store 层保持独立
4. ✅ **易测试** - 每层职责清晰，易于单元测试
5. ✅ **灵活** - 可以选择使用 Actions 或直接使用 API/Store

**对比：**

```typescript
// ❌ 没有 Actions 层 - 组件中重复代码多
const response = await apiService.login(phone, code);
if (response.success) {
  const { login } = useAuthStore.getState();
  await login(response.user, response.token);
}

// ✅ 使用 Actions 层 - 一行代码搞定
await authActions.login(phone, code);
```

### Actions 层 API

#### authActions

```typescript
// 发送验证码
await authActions.sendVerificationCode(phoneNumber);

// 登录（自动更新状态）
const response = await authActions.login(phoneNumber, code);

// 登出（自动清除状态）
await authActions.logout();

// 恢复会话
const hasSession = await authActions.restoreSession();

// 获取当前用户
const user = authActions.getCurrentUser();

// 检查登录状态
const isAuth = authActions.isAuthenticated();

// 获取 Token
const token = authActions.getToken();
```

### 创建自定义 Actions

```typescript
// services/training.actions.ts
import { apiService } from "./api.service";
import { useTrainingStore } from "@/store";

export const trainingActions = {
  /**
   * 获取训练计划列表
   */
  async fetchTrainingPlans() {
    const response = await apiService.getTrainingPlans();

    if (response.success) {
      const { setPlans } = useTrainingStore.getState();
      setPlans(response.plans);
    }

    return response;
  },

  /**
   * 创建新训练计划
   */
  async createPlan(planData) {
    const response = await apiService.createTrainingPlan(planData);

    if (response.success) {
      const { addPlan } = useTrainingStore.getState();
      addPlan(response.plan);
    }

    return response;
  },
};
```

## 添加新的 Store

### 1. 创建 Store 文件

```typescript
// store/user.store.ts
import { create } from "zustand";

export interface UserState {
  preferences: Record<string, any>;
  setPreferences: (prefs: Record<string, any>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  preferences: {},
  setPreferences: (prefs) => set({ preferences: prefs }),
}));
```

### 2. 导出到 index.ts

```typescript
// store/index.ts
export { useUserStore, type UserState } from "./user.store";
```

### 3. 在组件中使用

```typescript
import { useUserStore } from "@/store";

export function MyComponent() {
  const { preferences, setPreferences } = useUserStore();
  // ...
}
```

## 性能优化

### 1. 选择性订阅（重要）

避免不必要的重新渲染，只订阅需要的状态：

```typescript
// ❌ 不好：订阅整个 store，状态改变都会导致重新渲染
const store = useAuthStore();

// ✅ 好：只订阅需要的状态
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);
```

### 2. 使用浅比较

```typescript
import { useShallow } from "zustand/react";

// 只在 user 对象的引用改变时重新渲染
const user = useAuthStore(useShallow((state) => state.user));
```

## 常见问题

### Q：Store 中的数据如何持久化？

A：认证数据通过 Zustand `persist` 自动持久化到 AsyncStorage。其他 Store 可以添加持久化中间件：

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useUserStore = create(
  persist(
    (set) => ({
      preferences: {},
      setPreferences: (prefs) => set({ preferences: prefs }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Q：如何在多个组件间共享状态？

A：Zustand 的一大优点就是简单的跨组件状态共享：

```typescript
// ComponentA.tsx
import { useAuthStore } from '@/store';

export function ComponentA() {
  const user = useAuthStore((state) => state.user);
  return <Text>{user?.phoneNumber}</Text>;
}

// ComponentB.tsx
export function ComponentB() {
  const user = useAuthStore((state) => state.user);
  // 同一个用户对象
  return <Text>{user?.id}</Text>;
}
```

### Q：如何在类组件中使用 Store？

A：建议使用函数组件和 Hooks。如果必须使用类组件，可以在状态改变时手动订阅：

```typescript
componentDidMount() {
  this.unsubscribe = useAuthStore.subscribe(
    (state) => state.user,
    (user) => this.setState({ user })
  );
}

componentWillUnmount() {
  this.unsubscribe?.();
}
```

## 最佳实践

1. ✅ 为每个业务域创建独立的 Store
2. ✅ 使用 TypeScript 定义状态接口
3. ✅ 使用 Hooks 而不是直接访问 Store
4. ✅ 只订阅需要的状态以优化性能
5. ✅ 在异步操作前后更新 loading 状态
6. ✅ 使用 `getState()` 在事件处理器中获取最新状态
7. ✅ 为敏感信息提供持久化中间件

## 参考资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand 中文文档](https://zustand-demo.pages.dev/)
- [状态管理最佳实践](https://redux.js.org/understanding/thinking-in-redux)
