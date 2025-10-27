import React from 'react';
import { LoginForm } from '../components/LoginForm';

/**
 * 登录页面
 */
export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="w-full max-w-md px-6">
        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              欢迎回来
            </h1>
            <p className="text-gray-600">
              登录到 AI 营销 SOP 系统
            </p>
          </div>

          {/* 登录表单 */}
          <LoginForm />
        </div>

        {/* 底部提示 */}
        <p className="text-center mt-6 text-sm text-gray-500">
          © 2025 AI 营销 SOP 系统. 保留所有权利.
        </p>
      </div>
    </div>
  );
};
