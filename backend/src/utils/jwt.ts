import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const getSecret = (type: 'access' | 'refresh'): string => {
  const secret = type === 'access'
    ? process.env.JWT_SECRET
    : process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error(`JWT_${type.toUpperCase()}_SECRET 环境变量未定义`);
  }

  return secret;
};

const getExpiresIn = (type: 'access' | 'refresh'): string => {
  return type === 'access'
    ? process.env.JWT_EXPIRES_IN || '7d'
    : process.env.JWT_REFRESH_EXPIRES_IN || '30d';
};

/**
 * 生成访问Token
 */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, getSecret('access'), {
    expiresIn: getExpiresIn('access'),
  });
};

/**
 * 生成刷新Token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, getSecret('refresh'), {
    expiresIn: getExpiresIn('refresh'),
  });
};

/**
 * 验证访问Token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, getSecret('access')) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token已过期');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('无效的Token');
    }
    throw error;
  }
};

/**
 * 验证刷新Token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, getSecret('refresh')) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('刷新Token已过期');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('无效的刷新Token');
    }
    throw error;
  }
};
