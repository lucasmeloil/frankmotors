# Frank Motors - Guia Rápido de Início

## ✅ Instalação Concluída!

As dependências foram instaladas com sucesso. Agora siga estes passos:

## 🗄️ Passo 1: Configurar o Banco de Dados

### Opção A: PostgreSQL Local

1. **Instale o PostgreSQL** (se ainda não tiver):

   - Windows: https://www.postgresql.org/download/windows/
   - Ou use Docker: `docker run --name frank-motors-db -e POSTGRES_PASSWORD=strong_password_here -p 5432:5432 -d postgres`

2. **Crie o banco de dados**:

   ```bash
   psql -U postgres
   CREATE DATABASE frank_motors;
   CREATE USER admin WITH PASSWORD 'strong_password_here';
   GRANT ALL PRIVILEGES ON DATABASE frank_motors TO admin;
   \q
   ```

3. **Execute o schema**:

   ```bash
   psql -U admin -d frank_motors -f database/schema.sql
   ```

4. **Crie o usuário admin**:

   ```bash
   node scripts/create-admin.js
   ```

   Copie o SQL gerado e execute no PostgreSQL.

5. **(Opcional) Adicione dados de exemplo**:
   ```bash
   psql -U admin -d frank_motors -f database/sample-data.sql
   ```

### Opção B: PostgreSQL Online (Neon, Supabase, etc.)

1. Crie uma conta em https://neon.tech ou https://supabase.com
2. Crie um novo projeto PostgreSQL
3. Copie a connection string
4. Execute os scripts SQL através do painel web deles

## 🔐 Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=frank_motors
POSTGRES_USER=admin
POSTGRES_PASSWORD=strong_password_here
DATABASE_URL=postgresql://admin:strong_password_here@localhost:5432/frank_motors

# JWT (gere uma chave aleatória segura)
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria_aqui

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+5579991015150

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🚀 Passo 3: Iniciar o Servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 🔑 Credenciais de Admin

- **URL**: http://localhost:3000/admin/login
- **Email**: lucasmelo@nexus.com
- **Senha**: lucas102030

## 📋 Próximos Passos

1. **Faça login no admin** e adicione veículos
2. **Upload de fotos** dos veículos (até 3 por veículo)
3. **Configure promoções** para veículos em destaque
4. **Personalize** as informações de contato
5. **Teste** o checkout via WhatsApp

## 🎨 Personalização

### Alterar Cores

Edite `tailwind.config.ts`:

```typescript
colors: {
  primary: "#1C1C1C",    // Cor principal
  secondary: "#FF0000",   // Cor secundária
  accent: "#FFD700",      // Cor de destaque
}
```

### Alterar Logo

Substitua `public/assets/logo-frankmotors.png` pelo seu logo.

### Alterar Textos

Edite os componentes em `components/` e páginas em `app/`.

## 🐛 Solução de Problemas

### Erro de conexão com banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env.local`
- Teste a conexão: `psql -U admin -d frank_motors`

### Erro "Module not found"

```bash
npm install
```

### Porta 3000 já em uso

```bash
npm run dev -- -p 3001
```

## 📞 Suporte

Precisa de ajuda? Entre em contato!

---

**Desenvolvido para Frank Motors** 🏆🏅
