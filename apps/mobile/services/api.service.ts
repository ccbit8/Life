import { API_CONFIG, API_ENDPOINTS } from './api.config';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiService {
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 发送验证码
  async sendVerificationCode(phoneNumber: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.auth.sendCode, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  // 验证码登录
  async verifyCode(phoneNumber: string, code: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.auth.verifyCode, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code }),
    });
  }

  // 获取用户信息
  async getUser(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.users.getUser(id), {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
