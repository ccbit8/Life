// API 配置
export const API_CONFIG = {
  // 开发环境
  baseURL: __DEV__
    ? "http://192.168.0.102:3000"
    : "https://your-production-api.com",

  timeout: 10000,
};

// API 端点
export const API_ENDPOINTS = {
  auth: {
    sendCode: "/auth/send-code",
    verifyCode: "/auth/verify-code",
  },
  users: {
    getUser: (id: string) => `/users/${id}`,
  },
};
