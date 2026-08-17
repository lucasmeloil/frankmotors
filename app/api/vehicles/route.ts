import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'data', 'vehicles.json');
const VENDAS_FILE = path.join(process.cwd(), 'data', 'vendas.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    // Initial sample real motorcycles for Baby Motos
    const initialVehicles = [
      {
        id: 'bm-titan-160-2026',
        marca: 'Honda',
        modelo: 'CG 160 Titan',
        ano: 2026,
        cor: 'Azul Metálico',
        precoCusto: 16500,
        preco: 19900,
        lucro: 3400,
        descricao: 'Honda CG 160 Titan 2026 Zero KM. Freios CBS, painel digital blackout, partida elétrica e injeção eletrônica.',
        tipo: 'moto',
        promocao: true,
        estoque: 3,
        status: 'disponivel',
        fotos: [{ url: '/assets/hero-1.png', position: 0 }],
        created_at: new Date().toISOString()
      },
      {
        id: 'bm-biz-125-2026',
        marca: 'Honda',
        modelo: 'Biz 125',
        ano: 2026,
        cor: 'Prata / Azul',
        precoCusto: 13200,
        preco: 16500,
        lucro: 3300,
        descricao: 'Honda Biz 125 2026. Câmbio semi-automático, tomada 12V, porta-capacetes espaçoso e máxima economia de combustível.',
        tipo: 'scooter',
        promocao: true,
        estoque: 2,
        status: 'disponivel',
        fotos: [{ url: '/assets/hero-2.png', position: 0 }],
        created_at: new Date().toISOString()
      },
      {
        id: 'bm-pop-110i-2026',
        marca: 'Honda',
        modelo: 'Pop 110i ES',
        ano: 2026,
        cor: 'Branco / Azul',
        precoCusto: 8900,
        preco: 11200,
        lucro: 2300,
        descricao: 'Honda Pop 110i 2026 com partida elétrica. A moto mais econômica do Brasil, ideal para trabalho e mobilidade diária.',
        tipo: 'moto',
        promocao: true,
        estoque: 4,
        status: 'disponivel',
        fotos: [{ url: '/assets/hero-3.png', position: 0 }],
        created_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialVehicles, null, 2), 'utf-8');
  }
}

function readVehicles(): any[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function writeVehicles(vehicles: any[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(vehicles, null, 2), 'utf-8');
}

// GET /api/vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const singleId = searchParams.get('id');
    const includePrivate = searchParams.get('includePrivate') === 'true';
    const all = searchParams.get('all') === 'true';

    const vehicles = readVehicles();

    // If single item requested
    if (singleId) {
      const found = vehicles.find(v => v.id === singleId);
      if (!found) {
        return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
      }
      return NextResponse.json({ vehicle: found });
    }

    let filtered = [...vehicles];

    // Filter by query parameters if not requesting all directly
    if (!all) {
      const marca = searchParams.get('marca');
      const ano = searchParams.get('ano');
      const tipo = searchParams.get('tipo');
      const promocao = searchParams.get('promocao');
      const precoMin = searchParams.get('precoMin');
      const precoMax = searchParams.get('precoMax');

      if (marca) filtered = filtered.filter(v => (v.marca || '').toLowerCase().includes(marca.toLowerCase()));
      if (ano) filtered = filtered.filter(v => v.ano === parseInt(ano));
      if (tipo) filtered = filtered.filter(v => v.tipo === tipo);
      if (promocao === 'true') filtered = filtered.filter(v => Boolean(v.promocao));
      if (precoMin) filtered = filtered.filter(v => (v.preco || 0) >= parseFloat(precoMin));
      if (precoMax) filtered = filtered.filter(v => (v.preco || 0) <= parseFloat(precoMax));
    }

    // If not admin/includePrivate, only show available/non-sold vehicles on public LP and catalog
    if (!includePrivate) {
      filtered = filtered.filter(v => v.status !== 'vendido');
    }

    // Sanitize for public view unless explicitly private
    const sanitized = filtered.map(v => {
      if (includePrivate) return v;
      const { precoCusto, compradorNome, ...publicOnly } = v;
      return publicOnly;
    });

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const startIndex = (page - 1) * pageSize;
    const paginated = all ? sanitized : sanitized.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      vehicles: paginated,
      pagination: {
        page,
        pageSize,
        total: sanitized.length,
        totalPages: Math.ceil(sanitized.length / pageSize) || 1,
      }
    });
  } catch (error: any) {
    console.error('API Vehicles GET error:', error);
    return NextResponse.json({ vehicles: [], error: error.message }, { status: 500 });
  }
}

// POST /api/vehicles - Add new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const vehicles = readVehicles();

    const newId = body.id || `bm-${Date.now()}`;
    const newVehicle = {
      ...body,
      id: newId,
      cor: body.cor || 'Preto',
      precoCusto: Number(body.precoCusto) || 0,
      preco: Number(body.preco) || 0,
      lucro: Number(((Number(body.preco) || 0) - (Number(body.precoCusto) || 0)).toFixed(2)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    vehicles.unshift(newVehicle);
    writeVehicles(vehicles);

    // If sold, record in vendas
    if (newVehicle.status === 'vendido') {
      try {
        let vendas: any[] = [];
        if (fs.existsSync(VENDAS_FILE)) {
          vendas = JSON.parse(fs.readFileSync(VENDAS_FILE, 'utf-8')) || [];
        }
        vendas.unshift({
          id: `venda-${Date.now()}`,
          vehicleId: newId,
          vehicleName: `${newVehicle.marca} ${newVehicle.modelo} ${newVehicle.ano}`,
          marca: newVehicle.marca,
          modelo: newVehicle.modelo,
          ano: newVehicle.ano,
          cor: newVehicle.cor,
          precoCusto: newVehicle.precoCusto,
          precoVenda: newVehicle.preco,
          lucro: newVehicle.lucro,
          margemPercent: newVehicle.precoCusto > 0 ? Number(((newVehicle.lucro / newVehicle.precoCusto) * 100).toFixed(1)) : 0,
          compradorNome: newVehicle.compradorNome || 'Cliente',
          dataVenda: newVehicle.dataVenda || new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        fs.writeFileSync(VENDAS_FILE, JSON.stringify(vendas, null, 2), 'utf-8');
      } catch (e) {
        console.warn('Venda local record note:', e);
      }
    }

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error: any) {
    console.error('API Vehicles POST error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao cadastrar veículo' }, { status: 500 });
  }
}

// PUT /api/vehicles - Update vehicle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID do veículo obrigatório' }, { status: 400 });
    }

    const vehicles = readVehicles();
    const index = vehicles.findIndex(v => v.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
    }

    const updated = {
      ...vehicles[index],
      ...body,
      cor: body.cor || vehicles[index].cor || 'Preto',
      precoCusto: Number(body.precoCusto) || 0,
      preco: Number(body.preco) || 0,
      lucro: Number(((Number(body.preco) || 0) - (Number(body.precoCusto) || 0)).toFixed(2)),
      updated_at: new Date().toISOString()
    };

    vehicles[index] = updated;
    writeVehicles(vehicles);

    // If marked as vendido on PUT, record/update in vendas
    if (updated.status === 'vendido') {
      try {
        let vendas: any[] = [];
        if (fs.existsSync(VENDAS_FILE)) {
          vendas = JSON.parse(fs.readFileSync(VENDAS_FILE, 'utf-8')) || [];
        }
        
        // Check if existing record for this vehicle
        const existingIndex = vendas.findIndex(v => v.vehicleId === updated.id);
        const vendaRecord = {
          id: existingIndex !== -1 ? vendas[existingIndex].id : `venda-${Date.now()}`,
          vehicleId: updated.id,
          vehicleName: `${updated.marca} ${updated.modelo} ${updated.ano}`,
          marca: updated.marca,
          modelo: updated.modelo,
          ano: updated.ano,
          cor: updated.cor,
          precoCusto: updated.precoCusto,
          precoVenda: updated.preco,
          lucro: updated.lucro,
          margemPercent: updated.precoCusto > 0 ? Number(((updated.lucro / updated.precoCusto) * 100).toFixed(1)) : 0,
          compradorNome: updated.compradorNome || 'Cliente',
          dataVenda: updated.dataVenda || new Date().toISOString(),
          created_at: existingIndex !== -1 ? vendas[existingIndex].created_at : new Date().toISOString()
        };

        if (existingIndex !== -1) {
          vendas[existingIndex] = vendaRecord;
        } else {
          vendas.unshift(vendaRecord);
        }
        fs.writeFileSync(VENDAS_FILE, JSON.stringify(vendas, null, 2), 'utf-8');
      } catch (vendaErr) {
        console.warn('Venda PUT sync error:', vendaErr);
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API Vehicles PUT error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao atualizar veículo' }, { status: 500 });
  }
}

// DELETE /api/vehicles
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    }

    const vehicles = readVehicles();
    const filtered = vehicles.filter(v => v.id !== id);
    writeVehicles(filtered);

    return NextResponse.json({ success: true, message: 'Veículo excluído com sucesso' });
  } catch (error: any) {
    console.error('API Vehicles DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
