const bcrypt = require('bcryptjs');

async function generateAdminPassword() {
  const password = 'lucas102030';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('='.repeat(60));
  console.log('FRANK MOTORS - Admin User Setup');
  console.log('='.repeat(60));
  console.log('\nExecute este SQL no seu banco de dados PostgreSQL:\n');
  console.log(`INSERT INTO users (email, password_hash, role)
VALUES (
  'lucasmelo@nexus.com',
  '${hash}',
  'admin'
);`);
  console.log('\n' + '='.repeat(60));
  console.log('Credenciais de Login:');
  console.log('Email: lucasmelo@nexus.com');
  console.log('Senha: lucas102030');
  console.log('='.repeat(60) + '\n');
}

generateAdminPassword().catch(console.error);
