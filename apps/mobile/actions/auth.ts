/**
 * 认证行为层（Actions Layer）
 * 
 * 作用：连接 API 层和 Store 层，提供"一步到位"的业务操作
 * 优点：
 * - 自动处理状态更新
 * - 减少组件中的重复代码
 * - 保持 API 层和 Store 层的独立性
 * - 易于测试和维护
 */

import { apiService } from '@/services/api.service';
import { useAuthStore } from '@/store';
import type { User } from '@/store';

export const authActions = {
  /**
   * 发送验证码
   * @param phoneNumber 手机号
   */
  async sendVerificationCode(phoneNumber: string) {
    return await apiService.sendVerificationCode(phoneNumber);
  },

  /**
   * 验证码登录（自动更新状态）
   * @param phoneNumber 手机号
   * @param code 验证码
   */
  async login(phoneNumber: string, code: string) {
    const response = await apiService.verifyCode(phoneNumber, code);
    
    if (response.success && response.user && response.token) {
      // 自动更新 Zustand Store
      const { login } = useAuthStore.getState();
      await login(response.user, response.token);
    }
    
    return response;
  },

  /**
   * 登出（自动清除状态）
   */
  async logout() {
    const { logout } = useAuthStore.getState();
    await logout();
    
    // 可选：如果后端有登出接口，在这里调用
    // await apiService.logout();
  },

  /**
   * 恢复会话（应用启动时）
   */
  async restoreSession(): Promise<boolean> {
    const { restoreSession } = useAuthStore.getState();
    return await restoreSession();
  },

  /**
   * 刷新 Token（示例，如果后端支持）
   */
  async refreshToken() {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      throw new Error('No token to refresh');
    }

    // 假设有刷新 token 的 API
    // const response = await apiService.refreshToken(token);
    
    // if (response.success && response.newToken) {
    //   const { setToken } = useAuthStore.getState();
    //   setToken(response.newToken);
    // }
    
    // return response;
  },

  /**
   * 获取当前用户信息（从 Store）
   */
  getCurrentUser(): User | null {
    const { user } = useAuthStore.getState();
    return user;
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated;
  },

  /**
   * 获取当前 Token
   */
  getToken(): string | null {
    const { token } = useAuthStore.getState();
    return token;
  },
};
