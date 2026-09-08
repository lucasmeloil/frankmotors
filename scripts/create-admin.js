const bcrypt = require('bcryptjs');

async function generateAdminPassword() {
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'CaboCar@2026';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('='.repeat(60));
  console.log('CABO CAR MULTIMARCAS - Admin User Setup');
  console.log('='.repeat(60));
  console.log('\nExecute este SQL no seu banco de dados PostgreSQL se desejar:\n');
  console.log(`INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@cabocar.com.br',
  '${hash}',
  'admin'
) ON CONFLICT (email) DO NOTHING;`);
  console.log('\n' + '='.repeat(60));
  console.log('Credenciais Oficiais de Administrador:');
  console.log('Email: admin@cabocar.com.br');
  console.log('Senha Inicial Sugerida: ' + password);
  console.log('='.repeat(60) + '\n');
}

generateAdminPassword().catch(console.error);

