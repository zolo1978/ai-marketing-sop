import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from './Input';
import { loginSchema, LoginFormData } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';

/**
 * 登录表单组件
 */
export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  /**
   * 表单提交处理
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      await login(data);

      // 登录成功，跳转到Dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || '登录失败，请检查邮箱和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 全局错误提示 */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* 邮箱输入 */}
      <Input
        label="邮箱地址"
        type="email"
        placeholder="请输入邮箱"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 密码输入 */}
      <Input
        label="密码"
        type="password"
        placeholder="请输入密码"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 记住我 */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...register('rememberMe')}
          />
          <span className="ml-2 text-sm text-gray-700">记住我</span>
        </label>

        <a
          href="#"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          忘记密码?
        </a>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-white
          transition-all duration-200
          ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98]'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            登录中...
          </span>
        ) : (
          '登录'
        )}
      </button>

      {/* 注册链接 */}
      <p className="text-center text-sm text-gray-600">
        还没有账号?{' '}
        <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
          立即注册
        </a>
      </p>
    </form>
  );
};
