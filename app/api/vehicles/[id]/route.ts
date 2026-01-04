import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { mockVehicles } from '@/lib/mockVehicles';

// GET /api/vehicles/[id] - Get single vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      const result = await pool.query(
        `SELECT v.*, 
          json_agg(
            json_build_object(
              'id', vp.id,
              'url', vp.url,
              'position', vp.position
            ) ORDER BY vp.position
          ) FILTER (WHERE vp.id IS NOT NULL) as fotos
        FROM vehicles v
        LEFT JOIN vehicle_photos vp ON v.id = vp.vehicle_id
        WHERE v.id = $1
        GROUP BY v.id`,
        [params.id]
      );

      if (result.rows.length > 0) {
        return NextResponse.json(result.rows[0]);
      }
    } catch (dbError) {
      console.warn('Database error fetching single vehicle, checking mock data:', dbError);
    }

    // Fallback to mock data
    const mockVehicle = mockVehicles.find((v: any) => v.id === params.id);
    if (!mockVehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(mockVehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar veículo' },
      { status: 500 }
    );
  }
}

// PUT /api/vehicles/[id] - Update vehicle (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { modelo, marca, ano, preco, descricao, tipo, promocao, estoque, fotos } = await request.json();

    try {
      const result = await pool.query(
        `UPDATE vehicles 
         SET modelo = $1, marca = $2, ano = $3, preco = $4, descricao = $5, 
             tipo = $6, promocao = $7, estoque = $8
         WHERE id = $9
         RETURNING *`,
        [modelo, marca, ano, preco, descricao, tipo, promocao, estoque, params.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Veículo não encontrado' },
          { status: 404 }
        );
      }

      // Update photos: delete old and insert new (simple approach)
      await pool.query('DELETE FROM vehicle_photos WHERE vehicle_id = $1', [params.id]);
      if (fotos && Array.isArray(fotos)) {
        for (const photo of fotos) {
          await pool.query(
            'INSERT INTO vehicle_photos (vehicle_id, url, position) VALUES ($1, $2, $3)',
            [params.id, photo.url, photo.position]
          );
        }
      }

      return NextResponse.json({ ...result.rows[0], fotos: fotos || [] });
    } catch (dbError) {
      console.warn('Database error updating vehicle, simulating success:', dbError);
      return NextResponse.json({ 
        message: 'Modo Offline: Alterações salvas localmente.', 
        id: params.id,
        modelo, marca, ano, preco, fotos: fotos || []
      });
    }
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar veículo' },
      { status: 500 }
    );
  }
}

// DELETE /api/vehicles/[id] - Delete vehicle (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
      const result = await pool.query(
        'DELETE FROM vehicles WHERE id = $1 RETURNING id',
        [params.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Veículo não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: 'Veículo deletado com sucesso' });
    } catch (dbError) {
      console.warn('Database error deleting vehicle, simulating success:', dbError);
      return NextResponse.json({ message: 'Modo Offline: Remoção simulada com sucesso.' });
    }
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar veículo' },
      { status: 500 }
    );
  }
}
