import { z } from 'zod';

/**
 * 登录表单验证Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱不能为空')
    .email('请输入有效的邮箱地址')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(6, '密码至少6位')
    .max(100, '密码过长'),

  rememberMe: z.boolean().default(false),
});

/**
 * 登录表单类型（从Schema推导）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
