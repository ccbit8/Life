# React Native mobileRN 开发环境完整配置指南

## 📋 目录

1. [环境要求](#环境要求)
2. [安装步骤](#安装步骤)
3. [Monorepo 集成](#monorepo-集成)
4. [故障排除](#故障排除)
5. [开发工作流](#开发工作流)

---

## 环境要求

### 系统要求

- **操作系统**: Windows 10/11
- **Node.js**: 20.x 或更高版本
- **包管理器**: pnpm 10.x

### 开发工具版本

| 工具                | 版本             | 说明            |
| ------------------- | ---------------- | --------------- |
| Java                | 17 LTS (Temurin) | 推荐用于 Gradle |
| Java                | 21               | 已删除          |
| Android SDK         | API 36           | 应用编译目标    |
| Android Build Tools | 36.0.0           | 构建工具        |
| NDK                 | 27.2.12479018    | 原生代码编译    |
| Gradle              | 8.13             | 构建系统        |
| React Native        | 0.83.1           | 应用框架        |
| Metro               | 0.83.3           | JS bundler      |

---

## 安装步骤

### 1. 安装 Java Development Kit (JDK)

#### 方式 A: 使用 Winget（推荐）

```powershell
# 安装 JDK 17（已安装）
winget install EclipseAdoptium.Temurin.17
```

#### 方式 B: 手动安装

- 访问 https://adoptium.net/
- 下载 Eclipse Temurin JDK
- 运行安装程序

#### 配置 JAVA_HOME 环境变量

**临时设置（当前终端会话）**

```powershell
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot'
java -version  # 验证安装
```

**永久设置（推荐）**

```powershell
# 在 PowerShell 中执行（需要管理员权限）
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot", "User")

# 关闭并重新打开 PowerShell，或刷新环境
$env:JAVA_HOME = [Environment]::GetEnvironmentVariable("JAVA_HOME", "User")
```

**验证**

```powershell
java -version
# 输出应该显示 Java 17
```

### 2. 安装 Android Studio

#### 使用 Winget

```powershell
winget install Google.AndroidStudio
```

#### 或手动安装

- 访问 https://developer.android.com/studio
- 下载 Android Studio
- 运行安装程序

#### 初始化 Android SDK

首次启动 Android Studio 时：

1. 选择 "Standard" 安装类型
2. 确认 SDK 安装路径（默认: `C:\Users\<username>\AppData\Local\Android\Sdk`）
3. Android Studio 会自动下载必要的工具

### 3. 安装必需的 Android SDK 组件

#### 使用 Android Studio SDK Manager

1. 打开 Android Studio
2. 进入 **Tools** → **SDK Manager**
3. 安装以下组件：

**SDK Platforms (必须)**

- ✅ Android SDK Platform 36
- ✅ Android SDK Platform 15

**SDK Tools (必须)**

- ✅ Android SDK Build-Tools 36
- ✅ Android SDK Command-line Tools (latest)
- ✅ Android Emulator
- ✅ Android SDK Platform-Tools
- ✅ Intel x86 Emulator Accelerator (HAXM) - Windows 专用

**NDK (可选但推荐)**

- ✅ NDK 27.2.12479018

#### 或使用命令行

```powershell
# 设置 Android SDK 路径
$env:ANDROID_HOME = 'C:\Users\<username>\AppData\Local\Android\Sdk'

# 下载 SDK 工具
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" `
  "platforms;android-36" `
  "build-tools;36.0.0" `
  "system-images;android-36;default;x86_64"
```

### 4. 配置 Android 模拟器

#### 创建虚拟设备

1. **打开 AVD Manager**
   - Android Studio → Tools → AVD Manager
2. **创建新设备**
   - 选择设备型号（如 "Pixel 5"）
   - 选择 API 级别 36
   - 分配内存：
     - RAM: 4GB
     - VM Heap: 512MB
     - 内部存储: 2GB

3. **验证设备启动**
   ```powershell
   # 或从命令行启动
   $env:ANDROID_HOME = 'C:\Users\<username>\AppData\Local\Android\Sdk'
   & "$env:ANDROID_HOME\emulator\emulator.exe" -avd <device_name>
   ```

### 5. 安装 Node.js 和 pnpm

```powershell
# 安装 Node.js 20+（如未安装）
winget install OpenJS.NodeJS

# 安装 pnpm
npm install -g pnpm

# 验证安装
node -v      # v20.x 或更高
pnpm -v      # 10.x 或更高
```

---

## Monorepo 集成

### 项目结构

```
Life (monorepo root)
├── apps/
│   ├── backend/        - NestJS 后端 (@life/backend)
│   ├── mobile/         - Expo React Native (@life/mobile)
│   └── mobileRN/       - React Native CLI (@life/mobile-rn)
├── packages/           - 共享包
├── package.json        - 根 workspace 配置
├── pnpm-workspace.yaml - pnpm workspace 定义
└── pnpm-lock.yaml      - 依赖锁定文件
```

### 关键配置文件

#### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### 根 `package.json` 脚本

```json
{
  "scripts": {
    "mobile-rn:start": "pnpm --filter @life/mobile-rn start",
    "mobile-rn:android": "pnpm --filter @life/mobile-rn android",
    "mobile-rn:ios": "pnpm --filter @life/mobile-rn ios"
  }
}
```

#### `apps/mobileRN/package.json` 关键配置

```json
{
  "name": "@life/mobile-rn",
  "version": "0.0.1",
  "dependencies": {
    "react": "19.2.0",
    "react-native": "0.83.1",
    "@babel/runtime": "^7.25.0",
    "@react-native/new-app-screen": "0.83.1",
    "react-native-safe-area-context": "^5.5.2"
  },
  "devDependencies": {
    "@react-native/gradle-plugin": "0.83.1",
    "@react-native/codegen": "0.83.1",
    "@react-native/metro-config": "0.83.1"
  }
}
```

#### `apps/mobileRN/metro.config.js`（pnpm 支持）

```javascript
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

const config = {
  projectRoot: __dirname,
  watchFolders: [
    // 监视根项目 node_modules（pnpm hoisted 包）
    path.resolve(__dirname, "../../node_modules"),
  ],
  resolver: {
    // 告诉 Metro 在两个地方查找模块
    nodeModulesPaths: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../../node_modules"),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 初始化项目

```powershell
# 1. 进入项目根目录
cd C:\git\Life

# 2. 安装所有依赖
pnpm install

# 3. 验证 mobileRN 包被正确识别
pnpm --filter @life/mobile-rn run
```

---

## 常见问题与故障排除

### 错误 1: "Unable to resolve module @babel/runtime"

**原因**: 在 pnpm monorepo 中，`@babel/runtime` 在 devDependencies 中而不是 dependencies

**解决方案**:

```json
// apps/mobileRN/package.json
{
  "dependencies": {
    "@babel/runtime": "^7.25.0" // ← 移到这里
  },
  "devDependencies": {
    // 移除 @babel/runtime
  }
}
```

### 错误 2: "Metro cannot resolve module"

**原因**: Metro bundler 不知道如何在 pnpm 的 node_modules 结构中查找模块

**解决方案**: 更新 `metro.config.js` 以包含根 `node_modules` 路径（见上面的配置）

### 错误 3: "Gradle Plugin not found"

**原因**: `@react-native/gradle-plugin` 只安装在根 node_modules

**解决方案**: 在 mobileRN 的 `package.json` devDependencies 中添加：

```json
{
  "devDependencies": {
    "@react-native/gradle-plugin": "0.83.1",
    "@react-native/codegen": "0.83.1"
  }
}
```

### 错误 4: "Java version not compatible"

**原因**: 使用了不兼容的 Java 版本

**解决方案**:

```powershell
# 验证 Java 版本
java -version

# 如需要，切换到 Java 17
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot'

# 清除 Gradle 缓存
rm -r "$env:USERPROFILE\.gradle\caches" -Force -ErrorAction SilentlyContinue
```

### 错误 5: "NDK not found"

**原因**: NDK 未完整安装

**解决方案**:

```powershell
# 创建 source.properties 文件
$ndk_path = "$env:USERPROFILE\AppData\Local\Android\Sdk\ndk\27.2.12479018"
@"
Pkg.Desc = Android NDK
Pkg.Revision = 27.2.12479018
"@ | Out-File "$ndk_path\source.properties" -Encoding UTF8
```

### 错误 6: "Cannot start emulator"

**原因**: 虚拟设备配置不完整或模拟器加速不可用

**解决方案**:

```powershell
# 1. 检查已安装的虚拟设备
$env:ANDROID_HOME = 'C:\Users\<username>\AppData\Local\Android\Sdk'
& "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds

# 2. 手动启动特定设备
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd <device_name>

# 3. 或让 React Native CLI 自动启动
pnpm mobile-rn:android
```

---

## 开发工作流

### 项目初始化（一次性）

```powershell
# 1. 配置环境变量
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot'
$env:ANDROID_HOME = 'C:\Users\<username>\AppData\Local\Android\Sdk'

# 2. 进入项目根目录
cd C:\git\Life

# 3. 安装依赖
pnpm install

# 4. 验证设置
pnpm mobile-rn:start  # Ctrl+C 停止
```

### 日常开发流程

**终端 1 - 启动开发服务器**

```powershell
cd C:\git\Life
pnpm mobile-rn:start
```

**终端 2 - 构建并运行应用**

```powershell
cd C:\git\Life
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.x-hotspot'
pnpm mobile-rn:android
```

**在应用中开发**

- 修改代码后，在应用中按 **R** 键重新加载
- 或按 **D** 打开开发菜单
- 查看日志：`adb logcat`

### 常用命令

```powershell
# 从根目录（推荐）
pnpm mobile-rn:start              # 启动 Metro 开发服务器
pnpm mobile-rn:android            # 构建并在 Android 上运行
pnpm mobile-rn:ios                # 构建并在 iOS 上运行
pnpm --filter @life/mobile-rn lint # 代码检查

# 从 apps/mobileRN 目录
cd apps/mobileRN
pnpm start                        # 启动 Metro
pnpm run android                  # 构建并运行
pnpm test                         # 运行测试
```

### 清除缓存与重建

```powershell
# 清除 Metro 缓存
cd C:\git\Life\apps\mobileRN
rm -r .metro-cache -ErrorAction SilentlyContinue
pnpm start --reset-cache

# 清除 Gradle 缓存
rm -r "$env:USERPROFILE\.gradle\caches" -Force -ErrorAction SilentlyContinue

# 清除 Android build 文件
cd apps/mobileRN
rm -r android\build, android\app\build, android\app\.cxx -ErrorAction SilentlyContinue

# 重新安装依赖
pnpm install
```

---

## 性能优化

### 启用 Gradle Configuration Cache

编辑 `apps/mobileRN/gradle.properties`:

```properties
org.gradle.configuration-cache=true
```

### 并行构建

```properties
org.gradle.parallel=true
org.gradle.workers.max=<number of cores>
```

### 增加 Gradle 内存

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

---

## 环境验证清单

运行此脚本验证环境配置：

```powershell
Write-Host "=== 环境验证 ===" -ForegroundColor Green

# Java
Write-Host "`n1. Java 配置:"
java -version

# Node.js
Write-Host "`n2. Node.js 配置:"
node -v

# pnpm
Write-Host "`n3. pnpm 配置:"
pnpm -v

# Android SDK
Write-Host "`n4. Android SDK 路径:"
$env:ANDROID_HOME

# React Native
Write-Host "`n5. React Native CLI:"
npx react-native --version

# 设备列表
Write-Host "`n6. Android 虚拟设备:"
& "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds

Write-Host "`n✅ 验证完成！" -ForegroundColor Green
```

---

## 快速参考

### 文件位置速查表

| 组件        | 默认路径                                                   |
| ----------- | ---------------------------------------------------------- |
| Java 17     | `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot` |
| Android SDK | `C:\Users\<username>\AppData\Local\Android\Sdk`            |
| Gradle 缓存 | `C:\Users\<username>\.gradle\caches`                       |
| Metro 缓存  | `apps\mobileRN\.metro-cache`                               |

### 环境变量速查表

| 变量               | 值                                                         |
| ------------------ | ---------------------------------------------------------- |
| `JAVA_HOME`        | `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot` |
| `ANDROID_HOME`     | `C:\Users\<username>\AppData\Local\Android\Sdk`            |
| `ANDROID_SDK_ROOT` | `C:\Users\<username>\AppData\Local\Android\Sdk`            |

---

## 相关资源

- **React Native 官方文档**: https://reactnative.dev/docs/environment-setup
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **Android Studio 文档**: https://developer.android.com/studio/intro
- **Gradle 官方文档**: https://gradle.org/releases/
- **Metro Bundler**: https://facebook.github.io/metro/

---

## 版本历史

| 日期       | 状态    | 内容                                           |
| ---------- | ------- | ---------------------------------------------- |
| 2026-01-18 | ✅ 完成 | 初始文档创建，包含完整的环境配置和故障排除指南 |

---

**最后更新**: 2026-01-18  
**作者**: Life 项目团队  
**状态**: ✅ 生产就绪
