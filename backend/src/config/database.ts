import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI 环境变量未定义');
    }

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB 连接成功');
    console.log(`📊 数据库: ${mongoose.connection.name}`);

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB 连接错误:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB 连接已断开');
    });

  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    process.exit(1);
  }
};
