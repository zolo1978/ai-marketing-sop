import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { User, IUser } from '../models/User.js';

// 扩展Express Request类型，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * 认证中间件
 * 验证请求头中的JWT Token，并将用户信息附加到req.user
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. 从请求头提取Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: '未提供认证Token',
      });
      return;
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 2. 验证Token
    const decoded = verifyAccessToken(token);

    // 3. 查询用户
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: '用户不存在',
      });
      return;
    }

    // 4. 将用户信息附加到请求对象
    req.user = user;

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || '认证失败',
    });
  }
};
