import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * 通用Input组件
 * 支持标签、错误提示、所有原生input属性
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-colors duration-200
            ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
