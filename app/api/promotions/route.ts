import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/promotions - List active promotions
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT p.*, v.modelo, v.marca, v.ano, v.preco
       FROM promotions p
       JOIN vehicles v ON p.vehicle_id = v.id
       WHERE p.active = true
       ORDER BY p.created_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar promoções' },
      { status: 500 }
    );
  }
}
