import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const VENDAS_FILE = path.join(process.cwd(), 'data', 'vendas.json');

function readVendas(): any[] {
  try {
    if (!fs.existsSync(VENDAS_FILE)) {
      const dir = path.dirname(VENDAS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(VENDAS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(VENDAS_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const vendas = readVendas();
    return NextResponse.json({ vendas });
  } catch (error: any) {
    return NextResponse.json({ vendas: [], error: error.message }, { status: 500 });
  }
}
