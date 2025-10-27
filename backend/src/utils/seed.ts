import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';

// 获取项目根目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

// 加载环境变量（从项目根目录）
dotenv.config({ path: path.join(rootDir, '.env') });

/**
 * 创建测试用户
 */
const seedUsers = async (): Promise<void> => {
  try {
    // 连接数据库
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI 环境变量未定义');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ 数据库连接成功');

    // 清空现有用户（可选，小心使用）
    // await User.deleteMany({});
    // console.log('🗑️  已清空用户数据');

    // 检查测试用户是否已存在
    const existingUser = await User.findOne({ email: 'test@example.com' });

    if (existingUser) {
      console.log('⚠️  测试用户已存在，跳过创建');
      console.log('📧 邮箱: test@example.com');
      console.log('🔑 密码: password123');
      process.exit(0);
    }

    // 创建测试用户
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123', // 密码会自动加密
      name: '测试用户',
    });

    console.log('✅ 测试用户创建成功:');
    console.log('📧 邮箱:', testUser.email);
    console.log('🔑 密码: password123');
    console.log('👤 姓名:', testUser.name);
    console.log('🆔 ID:', testUser._id);

    // 断开数据库连接
    await mongoose.disconnect();
    console.log('✅ 数据库断开连接');
    process.exit(0);
  } catch (error) {
    console.error('❌ 种子数据创建失败:', error);
    process.exit(1);
  }
};

// 执行种子脚本
seedUsers();
