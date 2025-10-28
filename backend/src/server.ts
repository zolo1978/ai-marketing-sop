import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'http';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// 获取项目根目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// 加载环境变量（从项目根目录）
dotenv.config({ path: path.join(rootDir, '.env') });

const app: Application = express();
const PORT = process.env.BACKEND_PORT || 3000;

// 限流配置常量（避免魔法数字）
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15分钟
const RATE_LIMIT_MAX_REQUESTS = 100; // 最大请求数

// 保存服务器实例用于优雅关闭
let server: Server | null = null;

/**
 * 初始化服务器
 */
const initializeServer = async (): Promise<void> => {
  try {
    // 1. 连接数据库
    await connectDatabase();

    // 2. 安全中间件
    app.use(helmet()); // 设置安全HTTP头

    // 3. CORS配置
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:8088',
        credentials: true,
      })
    );

    // 4. Body解析
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 5. 限流配置
    const limiter = rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: RATE_LIMIT_MAX_REQUESTS,
      message: '请求过于频繁，请稍后再试',
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/', limiter);

    // 6. 健康检查路由
    app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    });

    // 7. API路由
    app.use('/api/auth', authRoutes);

    // 7.5 临时 Seed 端点（仅生产环境初始化用）
    app.post('/api/seed', async (req, res) => {
      try {
        const { User } = await import('./models/User.js');

        // 检查测试用户是否已存在
        const existingUser = await User.findOne({ email: 'test@example.com' });
        if (existingUser) {
          return res.json({ success: true, message: '测试用户已存在' });
        }

        // 创建测试用户
        const testUser = new User({
          email: 'test@example.com',
          password: 'password123',
          name: '测试用户'
        });

        await testUser.save();

        res.json({ success: true, message: '测试用户创建成功' });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // 8. 404处理
    app.use(notFoundHandler);

    // 9. 错误处理中间件（必须放在最后）
    app.use(errorHandler);

    // 10. 启动服务器
    server = app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 服务器启动成功`);
      console.log(`📡 端口: ${PORT}`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 健康检查: http://localhost:${PORT}/health`);
      console.log(`🔐 认证API: http://localhost:${PORT}/api/auth`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

/**
 * 优雅关闭处理函数
 * 遵循最佳实践：服务器关闭 → 数据库断开 → 进程退出
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n⚠️  收到${signal}信号，开始优雅关闭...`);

  // 设置关闭超时（30秒）
  const shutdownTimeout = setTimeout(() => {
    console.error('❌ 优雅关闭超时，强制退出');
    process.exit(1);
  }, 30000);

  try {
    // 1. 停止接受新连接
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((err) => {
          if (err) {
            console.error('❌ HTTP服务器关闭失败:', err);
            reject(err);
          } else {
            console.log('✅ HTTP服务器已关闭');
            resolve();
          }
        });
      });
    }

    // 2. 关闭数据库连接
    await mongoose.connection.close();
    console.log('✅ 数据库连接已关闭');

    // 3. 清除超时计时器
    clearTimeout(shutdownTimeout);

    console.log('✅ 优雅关闭完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 优雅关闭过程出错:', error);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};

// 监听关闭信号
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 启动服务器
initializeServer();
