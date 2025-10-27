import { Router } from 'express';
import {
  loginController,
  refreshTokenController,
  getMeController,
  logoutController,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { loginValidator, refreshTokenValidator } from '../utils/validators.js';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', loginValidator, loginController);

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新访问Token
 * @access  Public
 */
router.post('/refresh', refreshTokenValidator, refreshTokenController);

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private (需要认证)
 */
router.get('/me', authenticate, getMeController);

/**
 * @route   POST /api/auth/logout
 * @desc    用户登出
 * @access  Public
 */
router.post('/logout', logoutController);

export default router;
