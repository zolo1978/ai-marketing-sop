import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}

/**
 * 统一错误处理中间件
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ 错误:', err);

  const response: ErrorResponse = {
    success: false,
    message: err.message || '服务器内部错误',
  };

  let statusCode = err.statusCode || 500;

  // MongoDB 验证错误
  if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    response.message = '数据验证失败';
    response.errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // MongoDB 唯一性约束错误
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    response.message = `${field} 已存在`;
  }

  // MongoDB CastError (无效的ObjectId)
  if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    response.message = '无效的ID格式';
  }

  // 开发环境返回详细堆栈信息
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found 处理
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.method} ${req.originalUrl} 不存在`,
  });
};
