-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modelo VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL,
  ano INT NOT NULL,
  preco NUMERIC(12,2) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('carro', 'moto', 'jetski', 'utilitario')),
  promocao BOOLEAN DEFAULT FALSE,
  estoque INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create vehicle_photos table
CREATE TABLE IF NOT EXISTS vehicle_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  position INT NOT NULL CHECK (position >= 1 AND position <= 3),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(vehicle_id, position)
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  discount_percent INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_tipo ON vehicles(tipo);
CREATE INDEX IF NOT EXISTS idx_vehicles_promocao ON vehicles(promocao);
CREATE INDEX IF NOT EXISTS idx_vehicles_marca ON vehicles(marca);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_promotions_vehicle_id ON promotions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
