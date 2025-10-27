import { apiClient } from './apiClient';
import { mockAuthAPI } from './mockAuthService';
import { LoginCredentials, AuthResponse, User, ApiResponse } from '../types/auth.types';

// 检查是否使用Mock模式（通过环境变量控制）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * 真实API服务
 */
const realAuthAPI = {
  /**
   * 用户登录
   */
  login: async (credentials: Omit<LoginCredentials, 'rememberMe'>): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data!;
  },

  /**
   * 刷新Token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data!;
  },

  /**
   * 获取当前用户信息
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data!.user;
  },

  /**
   * 登出
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};

/**
 * 导出API服务（根据环境变量选择Mock或真实API）
 */
export const authAPI = USE_MOCK ? mockAuthAPI : realAuthAPI;
