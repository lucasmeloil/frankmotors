import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllVehicles, 
  getVehicleById, 
  saveVehicleToDatabase, 
  deleteVehicleFromDatabase, 
  VehicleRecord 
} from '@/lib/db-service';

export const dynamic = 'force-dynamic';

// GET /api/vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const singleId = searchParams.get('id');
    const includePrivate = searchParams.get('includePrivate') === 'true';
    const all = searchParams.get('all') === 'true';

    // If single item requested
    if (singleId) {
      const found = await getVehicleById(singleId);
      if (!found) {
        return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
      }
      if (!includePrivate) {
        const { precoCusto, compradorNome, ...publicData } = found;
        return NextResponse.json({ vehicle: publicData });
      }
      return NextResponse.json({ vehicle: found });
    }

    const vehicles = await getAllVehicles(includePrivate);

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
    const docId = await saveVehicleToDatabase(body);
    const created = await getVehicleById(docId);
    return NextResponse.json(created || { id: docId, ...body }, { status: 201 });
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

    await saveVehicleToDatabase(body, body.id);
    const updated = await getVehicleById(body.id);
    return NextResponse.json(updated || body);
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

    await deleteVehicleFromDatabase(id);
    return NextResponse.json({ success: true, message: 'Veículo excluído com sucesso' });
  } catch (error: any) {
    console.error('API Vehicles DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
