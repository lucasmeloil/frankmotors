const { Pool } = require('pg');

// Tentando conectar com as credenciais padrão do QUICKSTART
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'frank_motors',
  user: 'admin',
  password: 'strong_password_here',
});

console.log('Testando conexão com o banco de dados frank_motors...');

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ ERRO DE CONEXÃO:', err.message);
    console.error('DICA: Verifique se o PostgreSQL está rodando e se o banco "frank_motors" e o usuário "admin" foram criados.');
  } else {
    console.log('✅ CONEXÃO BEM-SUCEDIDA!');
    
    client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'', (err, res) => {
      if (err) {
        console.error('❌ ERRO AO LISTAR TABELAS:', err.message);
      } else {
        console.log('Tabelas encontradas:', res.rows.map(r => r.table_name).join(', ') || '(nenhuma)');
        if (!res.rows.find(r => r.table_name === 'users')) {
          console.log('⚠️ AVISO: A tabela "users" não foi encontrada. Você precisa rodar o script database/schema.sql');
        }
      }
      release();
      process.exit();
    });
  }
});
