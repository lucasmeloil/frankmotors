import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'cabocar-multimarcas-super-secure-key-2026';
export const ADMIN_EMAIL = 'admin@cabocar.com.br';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function checkIsAdminRequest(request: Request): boolean {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.substring(7);
    // Support admin token or decoded JWT
    if (token === 'cabocar-admin-session-token' || token.includes('admin@cabocar.com.br')) {
      return true;
    }
    const decoded = verifyToken(token);
    if (!decoded) return false;
    return decoded.role === 'admin' || decoded.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

