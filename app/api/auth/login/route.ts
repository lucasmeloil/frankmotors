import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Hardcoded fallback for development/emergency access
    if ((email === 'admin@babymotos.com.br' || email === 'baby@motos.com' || email === 'frank@motors.com') && (password === 'baby1234' || password === 'frank1234')) {
      const token = generateToken({
        userId: 'f0000000-0000-0000-0000-000000000000',
        email: email,
        role: 'admin',
      });

      return NextResponse.json({
        token,
        user: {
          id: 'f0000000-0000-0000-0000-000000000000',
          email: email,
          role: 'admin',
          name: 'Baby Motos Admin'
        },
      });
    }

    // Find user in database
    let result;
    try {
      result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
    } catch (dbError) {
      console.error('Database connection failed, using hardcoded check only:', dbError);
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados. Use as credenciais padrão.' },
        { status: 500 }
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao fazer login',
        details: error.message,
        code: error.code // Useful for Postgres errors like 'ECONNREFUSED' or '42P01'
      },
      { status: 500 }
    );
  }
}
