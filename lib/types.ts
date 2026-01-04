export interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  descricao?: string;
  tipo: 'carro' | 'moto' | 'jetski' | 'utilitario';
  promocao: boolean;
  estoque: number;
  created_at?: string | Date;
  fotos?: VehiclePhoto[];
}

export interface VehiclePhoto {
  id: string;
  vehicle_id?: string;
  url: string;
  position: number;
  created_at?: string | Date;
}

export interface Promotion {
  id: string;
  vehicle_id: string;
  label: string;
  discount_percent: number;
  active: boolean;
  created_at?: string | Date;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at?: string | Date;
}

export interface CartItem {
  vehicle: Vehicle;
  quantity: number;
}

export interface CheckoutData {
  nome: string;
  endereco: string;
  pagamento: 'PIX' | 'Cartão' | 'Dinheiro' | 'Financiamento';
  troco_value?: string;
  items: CartItem[];
  valor_total: number;
}
