# React Native mobileRN 开发环境完整配置指南

## 📋 目录

1. [环境要求](#环境要求)
2. [Windows 安装步骤](#windows-安装步骤)
3. [macOS 安装步骤](#macos-安装步骤)
4. [Monorepo 集成](#monorepo-集成)
5. [故障排除](#故障排除)
6. [快速参考](#快速参考)

---

## 环境要求

### 系统要求

| 平台 | 要求 | 支持平台 |
|------|------|----------|
| **Windows** | Windows 10/11 | ✅ Android 开发 |
| **macOS** | macOS 10.15+ (Catalina 或更高) | ✅ iOS + Android 开发 |
| **共同要求** | Node.js 20.x+, pnpm 10.x | 所有平台 |

> **为什么 Windows 不需要 Ruby？**  
> iOS 开发只能在 macOS 上进行（需要 Xcode），CocoaPods（iOS 依赖管理器）依赖 Ruby。Windows 只支持 Android 开发，无需 Ruby/CocoaPods。

### 开发工具版本

| 工具                | 版本             | Windows | macOS | 说明            |
| ------------------- | ---------------- | ------- | ----- | --------------- |
| Java                | 17 LTS (Temurin) | ✅ | ✅ | 推荐用于 Gradle |
| Android SDK         | API 36           | ✅ | ✅ | 应用编译目标    |
| Android Build Tools | 36.0.0           | ✅ | ✅ | 构建工具        |
| NDK                 | 27.1.12297006    | ✅ | ✅ | 原生代码编译    |
| Gradle              | 8.13             | ✅ | ✅ | 构建系统        |
| Ruby                | 3.3+             | ❌ | ✅ | iOS 依赖管理    |
| CocoaPods           | 1.10+            | ❌ | ✅ | iOS 包管理器    |
| Xcode               | 15+              | ❌ | ✅ | iOS 开发必需    |
| React Native        | 0.83.1           | ✅ | ✅ | 应用框架        |
| Metro               | 0.83.3           | ✅ | ✅ | JS bundler      |

---

## macOS 安装步骤

### 1. 安装 Homebrew（如果尚未安装）

```bash
# 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 验证安装
brew --version
```

### 2. 安装 Node.js 和 pnpm

```bash
# 安装 Node.js 20+
brew install node@20

# 安装 pnpm
npm install -g pnpm

# 验证安装
node -v      # v20.x 或更高
pnpm -v      # 10.x 或更高
```

### 3. 安装 rbenv 和 Ruby（iOS 开发必需）

#### 为什么需要 Ruby？
- **CocoaPods** 是 iOS 依赖管理器，用 Ruby 编写
- macOS 系统自带的 Ruby（2.6）**太旧**，CocoaPods 需要 Ruby 3.0+
- 使用 **rbenv** 管理 Ruby 版本，避免与系统 Ruby 冲突

#### 安装步骤

```bash
# 1. 安装 rbenv 和 ruby-build
brew install rbenv ruby-build

# 2. 初始化 rbenv（添加到 shell 配置）
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
source ~/.zshrc

# 3. 安装 Ruby 3.3.6
rbenv install 3.3.6

# 4. 设置全局 Ruby 版本
rbenv global 3.3.6

# 5. 验证 Ruby 版本
ruby -v  # 应显示 ruby 3.3.6
```

### 4. 安装 CocoaPods（通过 Bundler）

#### 为什么使用 Bundler？
- 确保项目团队使用相同版本的 CocoaPods
- 避免全局 gem 冲突
- 项目依赖隔离

```bash
# 进入 mobileRN 项目
cd apps/mobileRN

# 安装 Bundler（如果尚未安装）
gem install bundler

# 使用 Bundler 安装 CocoaPods 和项目依赖
bundle install

# 验证 CocoaPods
bundle exec pod --version  # 应显示 >= 1.10.0
```

### 5. 安装 iOS 依赖

```bash
# 进入 iOS 目录
cd apps/mobileRN/ios

# 安装 CocoaPods 依赖
bundle exec pod install

# ⚠️ 重要：安装后使用 .xcworkspace 文件而不是 .xcodeproj
# 打开方式：open mobileRN.xcworkspace
```

**预期输出**:
```
Pod installation complete! There are 82 dependencies from the Podfile and 81 total pods installed.
```

### 6. 安装 Xcode 和命令行工具

```bash
# 从 App Store 安装 Xcode（15+ 版本）
# 然后安装命令行工具
xcode-select --install

# 接受 Xcode 许可协议
sudo xcodebuild -license accept

# 验证安装
xcodebuild -version
```

### 7. 安装 Java（Android 开发）

```bash
# 使用 Homebrew 安装 Java 17
brew install --cask temurin@17

# 配置 JAVA_HOME（添加到 ~/.zshrc）
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc

# 验证安装
java -version  # 应显示 Java 17
```

### 8. 安装 Android Studio 和 SDK

```bash
# 使用 Homebrew 安装 Android Studio
brew install --cask android-studio
```

**初始化 Android SDK**：

1. 首次启动 Android Studio
2. 选择 "Standard" 安装
3. SDK 默认路径: `~/Library/Android/sdk`
4. 配置环境变量：

```bash
# 添加到 ~/.zshrc
cat >> ~/.zshrc << 'EOF'
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
EOF

# 刷新环境
source ~/.zshrc
```

**安装 SDK 组件**（通过 Android Studio SDK Manager）：

- ✅ Android SDK Platform 36
- ✅ Android SDK Build-Tools 36.0.0
- ✅ Android SDK Command-line Tools
- ✅ Android Emulator
- ✅ NDK 27.1.12297006

### 9. 安装 Watchman（推荐）

```bash
# 监视文件变化，提高 Metro Bundler 性能
brew install watchman

# 验证安装
watchman --version
```

### 10. 验证环境配置

```bash
# 进入 mobileRN 目录
cd apps/mobileRN

# 运行 React Native 诊断工具
npx react-native doctor
```

**预期输出**：
```
Common
 ✓ Node.js
 ✓ npm
 ✓ Watchman
 ✓ Metro

Android
 ✓ JDK
 ✓ Android Studio
 ✓ ANDROID_HOME
 ✓ Gradlew
 ✓ Android SDK

iOS
 ✓ Xcode
 ✓ Ruby
 ✓ CocoaPods
 ✓ .xcode.env
```

### 11. 修复 Gradlew 权限（如果出错）

```bash
chmod +x apps/mobileRN/android/gradlew
```

### 12. 重命名 iOS 应用（可选）

默认应用名称为 "mobileRN"，如需改为自定义名称（如 "Life"），使用以下步骤：

#### 步骤 1：提交当前改动

```bash
cd /Users/cc/Git/Life
git add -A
git commit -m "chore: prepare for app rename"
```

#### 步骤 2：使用 react-native-rename 工具

```bash
cd apps/mobileRN

# 安装并运行重命名工具
# 语法: npx react-native-rename "新应用名" --bundleID "新的bundle ID"
npx react-native-rename "Life" --bundleID "com.life.mobile"
```

**预期输出**：
```
ios/Life RENAMED
ios/Life.xcworkspace RENAMED
ios/Life.xcodeproj RENAMED
ios/Life.xcodeproj/xcshareddata/xcschemes/Life.xcscheme RENAMED
... (多个文件被更新)
SUCCESS! 🎉 Your app has been renamed to "Life".
```

#### 步骤 3：清理旧项目配置

```bash
# 清除 watchman 缓存
watchman watch-del-all

# 进入 iOS 目录
cd apps/mobileRN/ios

# 删除旧的 Pods 和锁文件
rm -rf Pods Podfile.lock

# 重新安装 iOS 依赖
bundle exec pod install
```

#### 步骤 4：清除 Metro 缓存并重新运行

```bash
# 回到项目根目录
cd /Users/cc/Git/Life

# 清除 Metro bundler 缓存
rm -rf apps/mobileRN/.metro-cache

# 重新运行应用
pnpm ios
```

#### 验证重命名成功

检查以下几点：

- ✅ Xcode 工作区文件: `ios/Life.xcworkspace` 存在
- ✅ 模拟器应用名称显示为: **Life**
- ✅ Bundle ID: **com.life.mobile** (或你设置的 ID)
- ✅ Xcode 中的 scheme 名称: **Life**

**什么被重命名了**:

| 项目 | 旧值 | 新值 |
|------|------|------|
| 应用显示名 | mobileRN | Life |
| Bundle ID | org.reactjs.native.example.mobileRN | com.life.mobile |
| iOS 项目 | ios/mobileRN.xcodeproj | ios/Life.xcodeproj |
| Xcode Scheme | mobileRN | Life |
| 项目文件夹 | ios/mobileRN | ios/Life |
| Android 包名 | com.reactnativemobiern | com.life.mobile |

---

## Windows 安装步骤

> **注意**：Windows 上只能开发 Android 应用，无法进行 iOS 开发。

### 1. 安装 Java Development Kit (JDK)

#### 方式 A: 使用 Winget（推荐）

```powershell
# 安装 JDK 17
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

- ✅ NDK 27.1.12297006

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

#### `apps/mobileRN/metro.config.js`（pnpm 支持）

```javascript
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

const config = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, "../../node_modules")],
  resolver: {
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

## 故障排除

### 错误 1: "Unable to resolve module @babel/runtime"

**原因**: 在 pnpm monorepo 中，`@babel/runtime` 在 devDependencies 而不是 dependencies

**解决方案**: 将 `@babel/runtime` 移到 dependencies

```json
{
  "dependencies": {
    "@babel/runtime": "^7.25.0"
  }
}
```

### 错误 2: "Metro cannot resolve module"

**原因**: Metro bundler 不知道如何在 pnpm 的 node_modules 结构中查找模块

**解决方案**: 确保 `metro.config.js` 配置了根 `node_modules` 路径（见上面的配置）

### 错误 3: "Gradle Plugin not found"

**原因**: `@react-native/gradle-plugin` 只安装在根 node_modules

**解决方案**: 在 mobileRN 的 `package.json` 中添加：

```json
{
  "devDependencies": {
    "@react-native/gradle-plugin": "0.83.1",
    "@react-native/codegen": "0.83.1"
  }
}
```

### 错误 4: "Java version not compatible"

**原因**: 使用了不兼容的 Java 版本（如 Java 25）

**解决方案**:

```powershell
# 验证 Java 版本
java -version

# 切换到 Java 17
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot'

# 清除 Gradle 缓存
rm -r "$env:USERPROFILE\.gradle\caches" -Force -ErrorAction SilentlyContinue
```

### 错误 5: "NDK not found or incomplete"

**原因**: NDK 目录未完整安装

**解决方案**:

```powershell
# 创建或验证 NDK source.properties 文件
$ndk_path = "$env:USERPROFILE\AppData\Local\Android\Sdk\ndk\27.1.12297006"
@"
Pkg.Desc = Android NDK
Pkg.Revision = 27.1.12297006
"@ | Out-File "$ndk_path\source.properties" -Encoding UTF8
```

### 错误 6: "Cannot start emulator"

**原因**: 虚拟设备配置不完整或模拟器加速不可用

**解决方案**:

```powershell
# 检查已安装的虚拟设备
$env:ANDROID_HOME = 'C:\Users\<username>\AppData\Local\Android\Sdk'
& "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds

# 手动启动特定设备
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd <device_name>
```

### 错误 7: "React Navigation 库兼容性问题"

**原因**: React Navigation 与 React 19 版本不匹配

**症状**:

- `Cannot read property '$typeof' of undefined` 错误
- 应用崩溃，显示 useContext 错误

**解决方案**:

```powershell
cd apps/mobileRN

# 升级到最新兼容版本
pnpm upgrade @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack --latest

# 清除所有缓存
rm -r .metro-cache, android\build, android\app\build, android\app\.cxx -ErrorAction SilentlyContinue

# 重新安装并启动
pnpm install
npx react-native start --reset-cache
npx react-native run-android
```

---

## 快速参考

### 文件位置

| 组件        | 默认路径                                                   |
| ----------- | ---------------------------------------------------------- |
| Java 17     | `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot` |
| Android SDK | `C:\Users\<username>\AppData\Local\Android\Sdk`            |
| Gradle 缓存 | `C:\Users\<username>\.gradle\caches`                       |
| Metro 缓存  | `apps\mobileRN\.metro-cache`                               |

### 环境变量

| 变量               | 值                                                         |
| ------------------ | ---------------------------------------------------------- |
| `JAVA_HOME`        | `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot` |
| `ANDROID_HOME`     | `C:\Users\<username>\AppData\Local\Android\Sdk`            |
| `ANDROID_SDK_ROOT` | `C:\Users\<username>\AppData\Local\Android\Sdk`            |

### 环境验证脚本

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

Write-Host "`n✅ 验证完成！" -ForegroundColor Green
```

---

## 相关资源

- [React Native 官方文档](https://reactnative.dev/docs/environment-setup)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Android Studio 文档](https://developer.android.com/studio/intro)
- [Gradle 官方文档](https://gradle.org/releases/)
- [Metro Bundler](https://facebook.github.io/metro/)

---

**最后更新**: 2026-01-18  
**作者**: Life 项目团队  
**状态**: ✅ 生产就绪
