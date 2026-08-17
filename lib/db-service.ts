import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

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

export const INITIAL_VEHICLES: VehicleRecord[] = [
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

// Helper to sanitize date/timestamp objects from Firestore
function formatFirestoreTimestamp(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val.seconds) return new Date(val.seconds * 1000).toISOString();
  return new Date().toISOString();
}

// 1. SAVE VEHICLE DIRECTLY TO FIRESTORE
export async function saveVehicleToDatabase(vehicleData: VehicleRecord, id?: string): Promise<string> {
  const docId = id || vehicleData.id || `bm-${Date.now()}`;
  const precoCusto = Number(vehicleData.precoCusto) || 0;
  const preco = Number(vehicleData.preco) || 0;
  const lucro = Number((preco - precoCusto).toFixed(2));

  const payload: any = {
    ...vehicleData,
    id: docId,
    cor: vehicleData.cor || 'Preto',
    precoCusto,
    preco,
    lucro,
    promocao: Boolean(vehicleData.promocao),
    estoque: Number(vehicleData.estoque) || 0,
    status: vehicleData.status || 'disponivel',
    fotos: Array.isArray(vehicleData.fotos) ? vehicleData.fotos : [],
    updated_at: new Date().toISOString()
  };

  if (!id && !vehicleData.created_at) {
    payload.created_at = new Date().toISOString();
  }

  try {
    const docRef = doc(db, 'vehicles', docId);
    await setDoc(docRef, payload, { merge: true });

    // If marked as vendido, also record in vendas collection
    if (payload.status === 'vendido') {
      try {
        const margemPercent = precoCusto > 0 ? Number(((lucro / precoCusto) * 100).toFixed(1)) : 0;
        const vendaDocId = `venda-${docId}`;
        const vendaPayload: VendaRecord = {
          id: vendaDocId,
          vehicleId: docId,
          vehicleName: `${payload.marca} ${payload.modelo} ${payload.ano}`,
          marca: payload.marca,
          modelo: payload.modelo,
          ano: payload.ano,
          cor: payload.cor,
          precoCusto,
          precoVenda: preco,
          lucro,
          margemPercent,
          compradorNome: payload.compradorNome || 'Cliente',
          dataVenda: payload.dataVenda || new Date().toISOString(),
          created_at: new Date().toISOString()
        };

        const vendaDocRef = doc(db, 'vendas', vendaDocId);
        await setDoc(vendaDocRef, vendaPayload, { merge: true });
      } catch (vendaErr) {
        console.warn('Erro ao salvar histórico de venda no Firestore:', vendaErr);
      }
    }

    return docId;
  } catch (err: any) {
    console.error('Erro no Firestore ao salvar veículo:', err);
    throw new Error(err.message || 'Erro ao gravar veículo no Firestore');
  }
}

// 2. GET ALL VEHICLES FROM FIRESTORE
export async function getAllVehicles(includePrivate = true): Promise<VehicleRecord[]> {
  try {
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef);
    const snap = await getDocs(q);

    if (snap.empty) {
      // Return initial models if Firestore is newly initialized
      return INITIAL_VEHICLES.filter(v => includePrivate || v.status !== 'vendido');
    }

    const list: VehicleRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as VehicleRecord;
      const v: VehicleRecord = {
        ...data,
        id: docSnap.id,
        precoCusto: Number(data.precoCusto) || 0,
        preco: Number(data.preco) || 0,
        lucro: Number(data.lucro) || (Number(data.preco || 0) - Number(data.precoCusto || 0)),
        created_at: formatFirestoreTimestamp(data.created_at),
        updated_at: formatFirestoreTimestamp(data.updated_at)
      };

      if (includePrivate || v.status !== 'vendido') {
        list.push(v);
      }
    });

    // Sort by created_at desc
    list.sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tB - tA;
    });

    return list;
  } catch (e) {
    console.error('Erro ao buscar veículos no Firestore:', e);
    // Fallback in case of temporary offline/network
    return INITIAL_VEHICLES.filter(v => includePrivate || v.status !== 'vendido');
  }
}

// 3. GET SINGLE VEHICLE
export async function getVehicleById(id: string): Promise<VehicleRecord | null> {
  try {
    const docRef = doc(db, 'vehicles', id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as VehicleRecord;
      return {
        ...data,
        id: snap.id,
        precoCusto: Number(data.precoCusto) || 0,
        preco: Number(data.preco) || 0,
        lucro: Number(data.lucro) || (Number(data.preco || 0) - Number(data.precoCusto || 0)),
        created_at: formatFirestoreTimestamp(data.created_at),
        updated_at: formatFirestoreTimestamp(data.updated_at)
      };
    }

    // Fallback to initial vehicles list
    const found = INITIAL_VEHICLES.find(v => v.id === id);
    return found || null;
  } catch (e) {
    console.error('Erro ao buscar veículo por ID no Firestore:', e);
    const found = INITIAL_VEHICLES.find(v => v.id === id);
    return found || null;
  }
}

// 4. DELETE VEHICLE
export async function deleteVehicleFromDatabase(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'vehicles', id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error('Erro ao excluir veículo do Firestore:', err);
    throw new Error('Erro ao excluir veículo do banco de dados.');
  }
}

// 5. GET VENDAS FROM FIRESTORE
export async function getAllVendas(): Promise<VendaRecord[]> {
  try {
    const vendasRef = collection(db, 'vendas');
    const snap = await getDocs(vendasRef);

    const list: VendaRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as VendaRecord;
      list.push({
        ...data,
        id: docSnap.id,
        precoCusto: Number(data.precoCusto) || 0,
        precoVenda: Number(data.precoVenda) || 0,
        lucro: Number(data.lucro) || (Number(data.precoVenda || 0) - Number(data.precoCusto || 0)),
        dataVenda: formatFirestoreTimestamp(data.dataVenda),
        created_at: formatFirestoreTimestamp(data.created_at)
      });
    });

    list.sort((a, b) => {
      const tA = a.dataVenda ? new Date(a.dataVenda).getTime() : 0;
      const tB = b.dataVenda ? new Date(b.dataVenda).getTime() : 0;
      return tB - tA;
    });

    return list;
  } catch (e) {
    console.error('Erro ao buscar vendas no Firestore:', e);
    return [];
  }
}
