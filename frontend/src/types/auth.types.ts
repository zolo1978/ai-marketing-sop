/**
 * 用户信息接口
 */
export interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 登录凭证接口
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * 认证响应接口
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
