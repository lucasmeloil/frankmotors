-- Sample data for testing

-- Insert sample vehicles
INSERT INTO vehicles (modelo, marca, ano, preco, descricao, tipo, promocao, estoque) VALUES
('Civic', 'Honda', 2022, 95000.00, 'Honda Civic 2022, completo, único dono, revisões em dia', 'carro', true, 1),
('Corolla', 'Toyota', 2023, 125000.00, 'Toyota Corolla 2023, zero km, todas as opcionais', 'carro', false, 2),
('CG 160', 'Honda', 2021, 12000.00, 'Honda CG 160 2021, baixa quilometragem, excelente estado', 'moto', true, 1),
('PCX 150', 'Honda', 2022, 15000.00, 'Honda PCX 150 2022, scooter moderna e econômica', 'moto', false, 1),
('Hilux', 'Toyota', 2020, 180000.00, 'Toyota Hilux 2020, 4x4, diesel, impecável', 'utilitario', false, 1),
('Onix', 'Chevrolet', 2023, 75000.00, 'Chevrolet Onix 2023, completo, garantia de fábrica', 'carro', true, 3);

-- Note: You'll need to add photos manually through the admin panel or API
-- The vehicle_photos table expects URLs to actual images

-- Sample promotions (optional)
INSERT INTO promotions (vehicle_id, label, discount_percent, active)
SELECT id, 'Oferta Especial', 10, true
FROM vehicles
WHERE promocao = true
LIMIT 3;
