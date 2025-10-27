import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { StorageService } from './storageService';

// 创建Axios实例
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * 自动附加Authorization头
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从存储中获取token（使用StorageService）
    const accessToken = StorageService.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一错误处理和token刷新
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Token过期，尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = StorageService.getRefreshToken();

        if (refreshToken) {
          // 调用刷新token接口
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // 更新存储的token（使用StorageService）
          // 判断原先使用的存储类型
          const storageType = localStorage.getItem('accessToken') ? 'local' : 'session';
          StorageService.setTokens(newAccessToken, newRefreshToken, storageType);

          // 重试原请求
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除token并跳转登录（使用StorageService）
        StorageService.clearTokens();

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 其他错误
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      '请求失败，请稍后重试';

    return Promise.reject(new Error(errorMessage));
  }
);
