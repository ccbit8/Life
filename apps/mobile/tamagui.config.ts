import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

/**
 * Tamagui 官方默认配置
 *
 * 使用 @tamagui/config/v4 的默认配置，包含：
 * - 完整的 design tokens (colors, sizes, spaces, fonts, etc)
 * - 预生成的主题 (light, dark, accent 及多色彩主题)
 * - 默认组件样式（Button, AlertDialog, Text 等）
 * - 响应式媒体查询配置
 * - 阴影、过渡、动画配置
 *
 * 这提供了一套完整的、生产级别的设计系统
 */

export const config = createTamagui({
  ...defaultConfig,
  media: {
    ...defaultConfig.media,
    // 可在此添加自定义媒体查询
  },
});

/**
 * 导出配置类型供 TypeScript 使用
 */
type Conf = typeof config;

/**
 * 为 Tamagui 全局模块声明配置类型
 */
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
