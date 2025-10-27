import { create } from 'zustand';
import { User, LoginCredentials } from '../types/auth.types';
import { authAPI } from '../services/authService';
import { StorageService } from '../services/storageService';

interface AuthState {
  // 状态
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 操作
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
}

/**
 * 认证Store
 * 使用Zustand管理全局认证状态
 */
export const useAuth = create<AuthState>((set) => ({
  // 初始状态
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  /**
   * 登录
   */
  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true });

      // 调用登录API
      const response = await authAPI.login({
        email: credentials.email,
        password: credentials.password,
      });

      // 存储Token（使用StorageService）
      const storageType = credentials.rememberMe ? 'local' : 'session';
      StorageService.setTokens(
        response.accessToken,
        response.refreshToken,
        storageType
      );

      // 更新状态
      set({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * 登出
   */
  logout: () => {
    // 清除Token（使用StorageService）
    StorageService.clearTokens();

    // 重置状态
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });

    // 调用登出API（可选）
    authAPI.logout().catch(console.error);
  },

  /**
   * 初始化认证状态
   * 从存储中恢复Token并验证
   */
  initAuth: async () => {
    try {
      // 获取Token（使用StorageService）
      const accessToken = StorageService.getAccessToken();

      if (!accessToken) {
        return;
      }

      set({ isLoading: true });

      // 验证Token有效性（通过获取用户信息）
      const user = await authAPI.getMe();

      // 更新状态
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token无效，清除（使用StorageService）
      StorageService.clearTokens();

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
