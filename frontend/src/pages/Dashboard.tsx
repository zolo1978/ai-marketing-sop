import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard页面（示例）
 */
export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                AI 营销 SOP 系统
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                欢迎, {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              欢迎来到Dashboard
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <p className="text-gray-700">
                  您已成功登录到 AI 营销 SOP 系统
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">用户信息</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-600">邮箱:</dt>
                    <dd className="text-sm font-medium text-gray-900">{user?.email}</dd>
                  </div>
                  {user?.name && (
                    <div>
                      <dt className="text-sm text-gray-600">姓名:</dt>
                      <dd className="text-sm font-medium text-gray-900">{user.name}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-gray-600">用户ID:</dt>
                    <dd className="text-sm font-mono text-gray-900">{user?._id}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
