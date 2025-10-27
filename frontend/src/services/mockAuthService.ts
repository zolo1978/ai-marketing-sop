/**
 * Mock 认证服务（用于演示，无需后端）
 * 在后端准备好后，切换回真实的 authService
 */

import { LoginCredentials, AuthResponse, User } from '../types/auth.types';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据
const mockUser: User = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  name: '测试用户',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockTokens = {
  accessToken: 'mock_access_token_' + Date.now(),
  refreshToken: 'mock_refresh_token_' + Date.now(),
};

export const mockAuthAPI = {
  /**
   * Mock 登录
   */
  login: async (credentials: Omit<LoginCredentials, 'rememberMe'>): Promise<AuthResponse> => {
    await delay(1000); // 模拟网络延迟

    // 简单验证
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return {
        user: mockUser,
        ...mockTokens,
      };
    }

    throw new Error('邮箱或密码错误');
  },

  /**
   * Mock 刷新Token
   */
  refreshToken: async (_refreshToken: string): Promise<AuthResponse> => {
    await delay(500);
    return {
      user: mockUser,
      ...mockTokens,
    };
  },

  /**
   * Mock 获取用户信息
   */
  getMe: async (): Promise<User> => {
    await delay(300);
    return mockUser;
  },

  /**
   * Mock 登出
   */
  logout: async (): Promise<void> => {
    await delay(200);
  },
};
