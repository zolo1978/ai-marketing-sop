/**
 * Storage 服务
 * 封装 localStorage 和 sessionStorage 操作
 *
 * 优点：
 * - 统一错误处理
 * - 提高可测试性（易于 mock）
 * - 类型安全
 * - 便于扩展（如添加加密）
 */

export type StorageType = 'local' | 'session';

export class StorageService {
  /**
   * 获取指定类型的 Storage
   */
  private static getStorage(type: StorageType): Storage {
    return type === 'local' ? localStorage : sessionStorage;
  }

  /**
   * 存储 Token
   * @param accessToken - 访问令牌
   * @param refreshToken - 刷新令牌
   * @param storageType - 存储类型
   */
  static setTokens(
    accessToken: string,
    refreshToken: string,
    storageType: StorageType
  ): void {
    try {
      const storage = this.getStorage(storageType);
      storage.setItem('accessToken', accessToken);
      storage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('存储Token失败:', error);
      throw new Error('无法保存登录状态');
    }
  }

  /**
   * 获取 AccessToken
   * 优先从 localStorage 读取，其次从 sessionStorage
   */
  static getAccessToken(): string | null {
    try {
      return (
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken')
      );
    } catch (error) {
      console.error('读取AccessToken失败:', error);
      return null;
    }
  }

  /**
   * 获取 RefreshToken
   * 优先从 localStorage 读取，其次从 sessionStorage
   */
  static getRefreshToken(): string | null {
    try {
      return (
        localStorage.getItem('refreshToken') ||
        sessionStorage.getItem('refreshToken')
      );
    } catch (error) {
      console.error('读取RefreshToken失败:', error);
      return null;
    }
  }

  /**
   * 清除所有 Token
   * 同时清除 localStorage 和 sessionStorage
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('清除Token失败:', error);
      // 即使失败也不抛出异常，因为清除操作应该总是成功
    }
  }

  /**
   * 检查是否存在有效的 Token
   */
  static hasTokens(): boolean {
    return this.getAccessToken() !== null;
  }
}
