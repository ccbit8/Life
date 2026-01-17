// 认证相关类型
export interface SendCodeRequest {
  phoneNumber: string;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
  code?: string; // 仅在开发环境返回
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    phoneNumber: string;
  };
  token?: string;
}

// 用户相关类型
export interface User {
  id: string;
  phoneNumber: string;
  createdAt?: string;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
}
