import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/authService.js';

const authService = new AuthService();

/**
 * 登录控制器
 * POST /api/auth/login
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: '请求参数验证失败',
        errors: errors.array(),
      });
      return;
    }

    // 2. 提取邮箱和密码
    const { email, password } = req.body;

    // 3. 调用认证服务
    const result = await authService.login(email, password);

    // 4. 返回成功响应
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: result,
    });
  } catch (error: any) {
    // 5. 错误处理
    res.status(401).json({
      success: false,
      message: error.message || '登录失败',
    });
  }
};

/**
 * 刷新Token控制器
 * POST /api/auth/refresh
 */
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: '请求参数验证失败',
        errors: errors.array(),
      });
      return;
    }

    // 2. 提取刷新Token
    const { refreshToken } = req.body;

    // 3. 调用认证服务
    const result = await authService.refreshAccessToken(refreshToken);

    // 4. 返回成功响应
    res.status(200).json({
      success: true,
      message: 'Token刷新成功',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Token刷新失败',
    });
  }
};

/**
 * 获取当前用户信息控制器（需要认证）
 * GET /api/auth/me
 */
export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user 由 authenticate 中间件注入
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '未认证',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * 登出控制器
 * POST /api/auth/logout
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // JWT是无状态的，登出主要在客户端删除Token
  // 服务器端可以记录黑名单（可选，此处简化处理）
  res.status(200).json({
    success: true,
    message: '登出成功',
  });
};
