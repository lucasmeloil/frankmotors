import { NextRequest, NextResponse } from 'next/server';
import { getAllVendas } from '@/lib/db-service';
import { checkIsAdminRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!checkIsAdminRequest(request)) {
      return NextResponse.json({ error: 'Acesso negado: dados financeiros restritos a administradores' }, { status: 403 });
    }
    const vendas = await getAllVendas();
    return NextResponse.json({ vendas });
  } catch (error: any) {
    console.error('API Vendas GET error:', error);
    return NextResponse.json({ vendas: [], error: error.message }, { status: 500 });
  }
}

