import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const isRefreshTokenValid = (refreshToken: string): boolean => {
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyToken = (token: string): TokenPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded as TokenPayload;
};

export const refreshAccessToken = (refreshToken: string, payload: TokenPayload): string | null => {
  if (!isRefreshTokenValid(refreshToken)) {
    return null; 
  }

  return generateToken(payload);
};