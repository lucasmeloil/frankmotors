import { Vehicle } from "./types";

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    marca: "Honda",
    modelo: "Civic Type R",
    ano: 2024,
    preco: 435000,
    tipo: "carro",
    descricao: "O lendário Type R chegou. Performance absurda com o conforto que você já conhece. Único dono, periciado.",
    promocao: true,
    estoque: 1,
    fotos: [{ id: "f1", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000", position: 1 }],
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    marca: "BMW",
    modelo: "M4 Competition",
    ano: 2023,
    preco: 789000,
    tipo: "carro",
    descricao: "M4 Competition em estado de zero. Cor Frozen Portimao Blue. Pacote Carbon Fiber completo.",
    promocao: false,
    estoque: 1,
    fotos: [{ id: "f2", url: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000", position: 1 }],
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    marca: "Porsche",
    modelo: "911 Carrera S",
    ano: 2022,
    preco: 1150000,
    tipo: "carro",
    descricao: "Porsche 911 Carrera S. Interior em Giz, Teto Solar em Vidro, Escapamento Esportivo. Impecável.",
    promocao: true,
    estoque: 1,
    fotos: [{ id: "f3", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000", position: 1 }],
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    marca: "Yamaha",
    modelo: "MT-09",
    ano: 2024,
    preco: 62000,
    tipo: "moto",
    descricao: "The Master of Torque. Nova geração com quickshifter e eletrônica de ponta. Pronta entrega.",
    promocao: false,
    estoque: 2,
    fotos: [{ id: "f4", url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1000", position: 1 }],
    created_at: new Date().toISOString()
  },
  {
    id: "5",
    marca: "Toyota",
    modelo: "Hilux GR-Sport",
    ano: 2024,
    preco: 358000,
    tipo: "utilitario",
    descricao: "Hilux preparada pela Gazoo Racing. Suspensão exclusiva e visual agressivo. Diesel 4x4.",
    promocao: false,
    estoque: 1,
    fotos: [{ id: "f5", url: "https://images.unsplash.com/photo-1621932953912-0b6d8bb2c54e?auto=format&fit=crop&q=80&w=1000", position: 1 }],
    created_at: new Date().toISOString()
  },
  {
    id: "6",
    marca: "Sea-Doo",
    modelo: "RXP-X 325",
    ano: 2024,
    preco: 145000,
    tipo: "jetski",
    descricao: "O Jet Ski mais potente do mundo. 325HP, sistema de áudio BRP, escada de embarque.",
    promocao: true,
    estoque: 1,
    fotos: [{ id: "f6", url: "https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&q=80&w=1000", position: 1 }],
    created_at: new Date().toISOString()
  }
];
