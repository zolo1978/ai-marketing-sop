import { User, IUser } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export interface LoginResult {
  user: {
    _id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * 认证服务类
 * 包含登录、刷新Token等业务逻辑
 */
export class AuthService {
  /**
   * 用户登录
   */
  async login(email: string, password: string): Promise<LoginResult> {
    // 1. 查找用户（需要包含password字段）
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 2. 验证密码
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误');
    }

    // 3. 生成Token
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // 4. 返回用户信息（不包含密码）和Token
    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * 刷新访问Token
   */
  async refreshAccessToken(refreshToken: string): Promise<LoginResult> {
    // 1. 验证刷新Token
    const decoded = verifyRefreshToken(refreshToken);

    // 2. 查找用户
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('用户不存在');
    }

    // 3. 生成新的Token
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // 4. 返回新Token
    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
}
