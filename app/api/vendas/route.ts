import { NextResponse } from 'next/server';
import { getAllVendas } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vendas = await getAllVendas();
    return NextResponse.json({ vendas });
  } catch (error: any) {
    console.error('API Vendas GET error:', error);
    return NextResponse.json({ vendas: [], error: error.message }, { status: 500 });
  }
}
