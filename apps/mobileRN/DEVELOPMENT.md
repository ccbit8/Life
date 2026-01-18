# mobileRN 应用开发指南

## 📋 目录

1. [项目结构](#项目结构)
2. [应用架构](#应用架构)
3. [开发工作流](#开发工作流)
4. [常用命令](#常用命令)
5. [性能优化](#性能优化)

---

## 项目结构

```
apps/mobileRN/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx         - 登录页面
│   │   ├── HomeScreen.tsx          - 首页（今日概览）
│   │   ├── TrainingScreen.tsx      - 训练页面（计划列表）
│   │   └── ProfileScreen.tsx       - 个人中心
│   └── navigation/
│       ├── TabNavigator.tsx        - 底部 Tab 导航配置
│       └── types.ts                - TypeScript 导航类型定义
├── App.tsx                         - 应用根组件（登录 → 主界面导航）
├── index.js                        - 应用入口
├── metro.config.js                 - Metro Bundler 配置（pnpm 支持）
├── android/                        - Android 原生项目
│   ├── build.gradle                - 项目级别 Gradle 配置
│   ├── gradle.properties           - Gradle 全局属性
│   ├── gradle/wrapper/             - Gradle Wrapper
│   ├── app/build.gradle            - App 模块 Gradle 配置
│   ├── settings.gradle             - 项目设置
│   └── app/src/main/               - Android 源代码
├── ios/                            - iOS 原生项目
├── package.json                    - 依赖和脚本
└── README.md                       - 项目说明
```

---

## 应用架构

### 页面结构图

```
App (根导航)
├── LoginScreen
│   ├── 用户名输入框
│   ├── 密码输入框
│   └── 登录按钮
│       └── 成功 → navigate to "Main"
│
└── Main (BottomTabNavigator)
    ├── Home Tab (首页)
    │   ├── 今日概览卡片
    │   ├── 当日训练进度
    │   └── 快速开始按钮
    │
    ├── Training Tab (训练)
    │   ├── 力量训练计划
    │   │   ├── 计划名称
    │   │   ├── 进度指示
    │   │   └── 完成次数
    │   └── 有氧运动计划
    │       ├── 计划名称
    │       ├── 进度指示
    │       └── 完成次数
    │
    └── Profile Tab (我的)
        ├── 个人信息区
        │   ├── 用户头像
        │   ├── 用户名
        │   └── 邮箱
        ├── 个人中心菜单
        │   ├── 编辑资料
        │   ├── 健康数据
        │   └── 训练记录
        ├── 设置菜单
        │   ├── 通知设置
        │   ├── 隐私设置
        │   └── 关于应用
        └── 退出登录按钮
```

### 技术栈

**前端框架**

- React 19.2.0
- React Native 0.83.1
- TypeScript 5.8.3

**导航库**

- @react-navigation/native 7.1.26 - 核心导航
- @react-navigation/native-stack 7.10.0 - Stack 导航
- @react-navigation/bottom-tabs 7.9.0 - 底部 Tab 导航
- react-native-screens ~4.16.0 - 性能优化
- react-native-gesture-handler ~2.28.0 - 手势处理

**构建工具**

- Metro 0.83.3 - JavaScript bundler
- Babel 7.25.2 - JavaScript 编译器
- Hermes - 性能优化 JavaScript 引擎

### 导航流程

#### 登录流程

```
应用启动
  ↓
检查登录状态
  ↓ 未登录
显示 LoginScreen
  ├─ 输入用户名 & 密码
  ├─ 点击登录按钮
  └─ navigation.replace("Main")
        ↓
    进入 Tab 导航
```

#### Tab 导航

```
BottomTabNavigator
├─ Home (首页) - 默认显示
├─ Training (训练)
└─ Profile (我的)

每个 Tab 点击时：
- 切换到对应 Screen
- 返回时保持 Tab 状态
- 支持深层链接（deep linking）
```

---

## 开发工作流

### 项目初始化（一次性）

```powershell
# 1. 进入 mobileRN 目录
cd C:\git\Life\apps\mobileRN

# 2. 安装依赖（已由 pnpm install 完成）
pnpm install

# 3. 验证 Metro 可用
pnpm start --help
```

### 日常开发流程

**终端 1 - 启动 Metro 开发服务器**

```powershell
cd C:\git\Life\apps\mobileRN

# 启动 Metro（第一次）
./node_modules/.bin/react-native.cmd start --reset-cache

# 或之后的启动（缓存存在）
./node_modules/.bin/react-native.cmd start

# 或从 monorepo 根目录
cd C:\git\Life
pnpm mobile-rn:start
```

**终端 2 - 构建和运行应用**

```powershell
cd C:\git\Life\apps\mobileRN

# 配置 Java 环境
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot'

# 构建并运行（可选清除构建缓存）
rm -r android\build, android\app\build -ErrorAction SilentlyContinue

# 运行应用
./node_modules/.bin/react-native.cmd run-android

# 或从 monorepo 根目录
cd C:\git\Life
pnpm mobile-rn:android
```

### 热更新与调试

**在应用中开发**

- 修改任何 `.tsx`、`.ts`、`.js` 文件
- 保存后应用自动重新加载
- 按 **R** 键手动重新加载
- 按 **D** 键打开开发菜单

**开发菜单选项**

```
Reload (R)
  └─ 重新加载 JavaScript 代码

Fast Refresh (自动)
  └─ 热更新（保持应用状态）

Show Perf Monitor
  └─ 显示性能监控

Debug JS Remotely
  └─ Chrome DevTools 远程调试

Show Inspector
  └─ 元素检查器

Toggle Element Inspector
  └─ 切换检查器

Show PerfMonitor
  └─ 性能监控
```

**查看日志**

```powershell
# 实时查看 Android 日志
adb logcat

# 过滤 React Native 日志
adb logcat | findstr "ReactNativeJS"

# 清空日志后启动
adb logcat -c
adb logcat
```

---

## 常用命令

### 从 mobileRN 目录

```powershell
cd apps/mobileRN

# 启动 Metro 开发服务器
pnpm start

# 构建并在 Android 上运行
pnpm android

# 构建并在 iOS 上运行（macOS only）
pnpm ios

# 代码检查
pnpm lint

# 运行单元测试
pnpm test

# 清除缓存并启动
pnpm start --reset-cache
```

### 从 monorepo 根目录

```powershell
cd C:\git\Life

# 启动 Metro
pnpm mobile-rn:start

# 构建 Android
pnpm mobile-rn:android

# 构建 iOS
pnpm mobile-rn:ios

# 代码检查
pnpm --filter @life/mobile-rn lint
```

### 清除缓存

```powershell
cd apps/mobileRN

# 清除 Metro 缓存
rm -r .metro-cache -ErrorAction SilentlyContinue

# 清除 Gradle 构建
rm -r android\build, android\app\build, android\app\.cxx -ErrorAction SilentlyContinue

# 清除所有缓存
rm -r .metro-cache, android\build, android\app\build, android\app\.cxx, node_modules\.pnpm -ErrorAction SilentlyContinue

# 清除 Gradle 缓存（全局）
rm -r "$env:USERPROFILE\.gradle\caches" -Force -ErrorAction SilentlyContinue
```

---

## 性能优化

### 启用 Hermes 引擎

Hermes 是 Facebook 开发的轻量级 JavaScript 引擎，优化了 React Native 应用的性能。

**检查状态**

编辑 `android/build.gradle`，查看 `hermesEnabled` 设置：

```groovy
ext {
    hermesEnabled = true  // ✅ 已启用
}
```

### 启用 Gradle 配置缓存

编辑 `android/gradle.properties`：

```properties
org.gradle.configuration-cache=true
```

**效果**: 首次构建后，后续构建速度可提升 50%+

### 并行构建

编辑 `android/gradle.properties`：

```properties
org.gradle.parallel=true
org.gradle.workers.max=8  # 根据 CPU 核心数调整
```

### 增加 Gradle 内存

编辑 `android/gradle.properties`：

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

### Metro 优化

编辑 `metro.config.js`：

```javascript
const config = {
  // ... 其他配置
  serializer: {
    // 启用 Hermes
    isHermesStable: true,
  },
  transformer: {
    // 启用内联优化
    inlineRequires: true,
  },
};
```

---

## 代码约定

### 文件命名

- **Screens**: `<Name>Screen.tsx` (例: `LoginScreen.tsx`)
- **Components**: `<Name>.tsx` (例: `Button.tsx`)
- **Hooks**: `use<Name>.ts` (例: `useAuth.ts`)
- **Services**: `<name>.service.ts` (例: `api.service.ts`)
- **Types**: `<name>.types.ts` (例: `navigation.types.ts`)

### 导入顺序

```typescript
// 1. React & React Native
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. 第三方库
import { useNavigation } from '@react-navigation/native';

// 3. 本地导入
import { LoginScreen } from '../screens';
import { useAuth } from '../hooks';
import type { StackScreenProps } from '@react-navigation/native-stack';
```

### 样式定义

推荐使用 `StyleSheet.create()`：

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
});
```

---

## 常见开发任务

### 添加新页面

1. 在 `src/screens/` 创建新文件 `NewScreen.tsx`
2. 实现 Screen 组件
3. 在 `src/navigation/types.ts` 中添加路由类型
4. 在 `src/navigation/` 中注册导航
5. 在 `App.tsx` 中添加 `<Stack.Screen>`

### 添加新 Tab

1. 创建 Screen 文件
2. 在 `src/navigation/TabNavigator.tsx` 添加 `<Tab.Screen>`
3. 定义 Tab 图标和标签

### 处理导航

```typescript
// 获取导航对象
import { useNavigation } from '@react-navigation/native';

export function MyScreen() {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => navigation.navigate('OtherScreen')}
      title="Go to Other"
    />
  );
}
```

---

**最后更新**: 2026-01-18  
**相关**: [环境配置指南](../REACT_NATIVE_SETUP_GUIDE.md)
