import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, '邮箱不能为空'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '密码不能为空'],
      minlength: [6, '密码至少6位'],
      select: false, // 默认查询不返回密码字段
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  }
);

// 密码加密中间件
userSchema.pre('save', async function (next) {
  // 仅在密码被修改时才加密
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 密码比对方法
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
