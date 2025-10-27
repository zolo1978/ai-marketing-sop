import { body, ValidationChain } from 'express-validator';

/**
 * 登录验证规则
 */
export const loginValidator: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6, max: 100 })
    .withMessage('密码长度必须在6-100位之间'),
];

/**
 * 刷新Token验证规则
 */
export const refreshTokenValidator: ValidationChain[] = [
  body('refreshToken')
    .notEmpty()
    .withMessage('刷新Token不能为空')
    .isString()
    .withMessage('刷新Token格式错误'),
];
