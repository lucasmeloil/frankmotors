import { Vehicle } from './types';

export interface VehicleRecord {
  id?: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  precoCusto: number;
  preco: number;
  lucro?: number;
  descricao: string;
  tipo: string;
  promocao: boolean;
  estoque: number;
  status: 'disponivel' | 'reservado' | 'vendido';
  compradorNome?: string;
  dataVenda?: any;
  fotos: { url: string; position: number }[];
  created_at?: any;
  updated_at?: any;
}

export interface VendaRecord {
  id?: string;
  vehicleId: string;
  vehicleName: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  precoCusto: number;
  precoVenda: number;
  lucro: number;
  margemPercent: number;
  compradorNome: string;
  dataVenda: any;
  created_at: any;
}

// 1. SAVE VEHICLE via API endpoint
export async function saveVehicleToDatabase(vehicleData: VehicleRecord, id?: string): Promise<string> {
  const payload = {
    ...vehicleData,
    id: id || vehicleData.id,
    cor: vehicleData.cor || 'Preto',
    lucro: Number(((Number(vehicleData.preco) || 0) - (Number(vehicleData.precoCusto) || 0)).toFixed(2))
  };

  const method = id ? 'PUT' : 'POST';
  const res = await fetch('/api/vehicles', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Erro ao salvar veículo no servidor.');
  }

  const result = await res.json();
  return result.id || id;
}

// 2. GET ALL VEHICLES
export async function getAllVehicles(includePrivate = true): Promise<VehicleRecord[]> {
  try {
    const url = typeof window !== 'undefined' 
      ? `/api/vehicles?all=true&includePrivate=${includePrivate}&t=${Date.now()}`
      : `http://localhost:3000/api/vehicles?all=true&includePrivate=${includePrivate}&t=${Date.now()}`;
      
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.vehicles || [];
  } catch (e) {
    console.error('Erro ao buscar veículos:', e);
    return [];
  }
}

// 3. GET SINGLE VEHICLE
export async function getVehicleById(id: string): Promise<VehicleRecord | null> {
  try {
    const url = typeof window !== 'undefined'
      ? `/api/vehicles?id=${id}&t=${Date.now()}`
      : `http://localhost:3000/api/vehicles?id=${id}&t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.vehicle || null;
  } catch (e) {
    console.error('Erro ao buscar veículo por ID:', e);
    return null;
  }
}

// 4. DELETE VEHICLE
export async function deleteVehicleFromDatabase(id: string): Promise<void> {
  const res = await fetch(`/api/vehicles?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Erro ao excluir veículo do banco de dados.');
  }
}

// 5. GET VENDAS
export async function getAllVendas(): Promise<VendaRecord[]> {
  try {
    const url = typeof window !== 'undefined'
      ? `/api/vendas?t=${Date.now()}`
      : `http://localhost:3000/api/vendas?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.vendas || [];
  } catch (e) {
    console.error('Erro ao buscar vendas:', e);
    return [];
  }
}
