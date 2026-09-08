-- Sample data for Cabo Car Multimarcas
INSERT INTO vehicles (modelo, marca, ano, preco, descricao, tipo, promocao, estoque) VALUES
('L200 Triton Sport HPE-S 2.4 4x4 Diesel', 'Mitsubishi', 2024, 239900.00, 'Picape robusta, motor turbodiesel de 190cv, tração 4x4 Super Select II, câmbio automático.', 'picape', true, 2),
('Hilux SRX 2.8 4x4 Diesel Automática', 'Toyota', 2023, 274900.00, 'Picape premium topo de linha com pacote Toyota Safety Sense, bancos em couro ventilados.', 'picape', false, 1),
('Corolla Altis Hybrid 1.8 Flex', 'Toyota', 2024, 178900.00, 'Sedan híbrido de máxima sofisticação, economia extrema e conforto.', 'carro', true, 3),
('Compass Longitude 1.3 Turbo Flex T270', 'Jeep', 2023, 154900.00, 'SUV moderno com motor turbo de 185cv, central multimídia de 10 polegadas, painel full digital.', 'suv', false, 2);

-- Sample promotions
INSERT INTO promotions (vehicle_id, label, discount_percent, active)
SELECT id, 'Oferta Cabo Car', 8, true
FROM vehicles
WHERE promocao = true
LIMIT 2;

