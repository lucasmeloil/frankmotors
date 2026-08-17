import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query
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

const LOCAL_STORAGE_KEY = 'babymotos_vehicles_store';
const LOCAL_STORAGE_VENDAS_KEY = 'babymotos_vendas_store';

// Helper to get local stored vehicles
function getLocalVehicles(): VehicleRecord[] {
  if (typeof window === 'undefined') return [...INITIAL_VEHICLES];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { /* ignore */ }
  return [...INITIAL_VEHICLES];
}

// Helper to save local stored vehicles
function setLocalVehicles(list: VehicleRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) { /* ignore */ }
}

// Helper to get local vendas
function getLocalVendas(): VendaRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VENDAS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) { /* ignore */ }
  return [];
}

// Helper to set local vendas
function setLocalVendas(list: VendaRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_VENDAS_KEY, JSON.stringify(list));
  } catch (e) { /* ignore */ }
}

// Helper to format timestamps
function formatFirestoreTimestamp(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val.seconds) return new Date(val.seconds * 1000).toISOString();
  return new Date().toISOString();
}

// 1. SAVE VEHICLE (Resiliente: Firestore + Local Storage Mirror)
export async function saveVehicleToDatabase(vehicleData: VehicleRecord, id?: string): Promise<string> {
  const docId = id || vehicleData.id || `bm-${Date.now()}`;
  const precoCusto = Number(vehicleData.precoCusto) || 0;
  const preco = Number(vehicleData.preco) || 0;
  const lucro = Number((preco - precoCusto).toFixed(2));

  const payload: VehicleRecord = {
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
    updated_at: new Date().toISOString(),
    created_at: vehicleData.created_at || new Date().toISOString()
  };

  // 1. Instantly update local store so UI is always responsive & persistent
  const localList = getLocalVehicles();
  const existingIdx = localList.findIndex(v => v.id === docId);
  if (existingIdx !== -1) {
    localList[existingIdx] = payload;
  } else {
    localList.unshift(payload);
  }
  setLocalVehicles(localList);

  // If marked as vendido, also update local vendas
  if (payload.status === 'vendido') {
    const localVendas = getLocalVendas();
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
    const existingVendaIdx = localVendas.findIndex(v => v.vehicleId === docId);
    if (existingVendaIdx !== -1) {
      localVendas[existingVendaIdx] = vendaPayload;
    } else {
      localVendas.unshift(vendaPayload);
    }
    setLocalVendas(localVendas);
  }

  // 2. Attempt Firestore Cloud Sync without failing the user action
  try {
    const docRef = doc(db, 'vehicles', docId);
    await setDoc(docRef, payload, { merge: true });

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
      } catch (e) { /* ignore */ }
    }
  } catch (err: any) {
    console.warn('Firestore cloud sync notice (saved to local cache):', err.message);
  }

  return docId;
}

// 2. GET ALL VEHICLES (Merge Firestore + Local Storage Cache)
export async function getAllVehicles(includePrivate = true): Promise<VehicleRecord[]> {
  const localList = getLocalVehicles();
  const map = new Map<string, VehicleRecord>();

  // Populate local store items first
  localList.forEach(v => {
    if (v.id) map.set(v.id, v);
  });

  // Attempt to fetch latest from Firestore and merge
  try {
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef);
    const snap = await getDocs(q);

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
      map.set(docSnap.id, v);
    });
  } catch (e) {
    // Firestore rules active or offline - rely on local store
  }

  const all = Array.from(map.values());

  // Filter out sold vehicles if public view
  const result = all.filter(v => includePrivate || v.status !== 'vendido');

  // Sort by created_at desc
  result.sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA;
  });

  return result;
}

// 3. GET SINGLE VEHICLE
export async function getVehicleById(id: string): Promise<VehicleRecord | null> {
  const localList = getLocalVehicles();
  const localFound = localList.find(v => v.id === id);

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
  } catch (e) {
    // Rely on local
  }

  return localFound || null;
}

// 4. DELETE VEHICLE
export async function deleteVehicleFromDatabase(id: string): Promise<void> {
  // Update local
  const localList = getLocalVehicles().filter(v => v.id !== id);
  setLocalVehicles(localList);

  // Update Firestore
  try {
    const docRef = doc(db, 'vehicles', id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.warn('Firestore delete notice:', err.message);
  }
}

// 5. GET VENDAS
export async function getAllVendas(): Promise<VendaRecord[]> {
  const map = new Map<string, VendaRecord>();
  const localVendas = getLocalVendas();
  localVendas.forEach(v => {
    if (v.id) map.set(v.id, v);
  });

  try {
    const vendasRef = collection(db, 'vendas');
    const snap = await getDocs(vendasRef);

    snap.forEach((docSnap) => {
      const data = docSnap.data() as VendaRecord;
      map.set(docSnap.id, {
        ...data,
        id: docSnap.id,
        precoCusto: Number(data.precoCusto) || 0,
        precoVenda: Number(data.precoVenda) || 0,
        lucro: Number(data.lucro) || (Number(data.precoVenda || 0) - Number(data.precoCusto || 0)),
        dataVenda: formatFirestoreTimestamp(data.dataVenda),
        created_at: formatFirestoreTimestamp(data.created_at)
      });
    });
  } catch (e) {
    // Firestore rules active or offline - rely on local
  }

  const list = Array.from(map.values());
  list.sort((a, b) => {
    const tA = a.dataVenda ? new Date(a.dataVenda).getTime() : 0;
    const tB = b.dataVenda ? new Date(b.dataVenda).getTime() : 0;
    return tB - tA;
  });

  return list;
}
