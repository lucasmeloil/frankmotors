# 🚀 Frank Motors - Setup Completo

## ✅ Status da Instalação

- ✅ Dependências instaladas
- ✅ Estrutura do projeto criada
- ✅ Logo e assets configurados
- ⏳ Banco de dados precisa ser configurado

## 📦 O que foi criado

### Estrutura do Projeto

```
frankmotors/
├── app/                    # Páginas Next.js
│   ├── admin/             # Painel administrativo
│   │   └── login/         # Login do admin
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticação
│   │   ├── vehicles/      # CRUD de veículos
│   │   └── promotions/    # Promoções
│   ├── contato/           # Página de contato
│   ├── promocoes/         # Página de promoções
│   ├── veiculos/          # Catálogo de veículos
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Home page
├── components/            # Componentes React
│   ├── Footer.tsx         # Rodapé
│   ├── Hero.tsx           # Seção hero
│   ├── MobileFixedMenu.tsx # Menu mobile fixo
│   ├── Navbar.tsx         # Barra de navegação
│   ├── VehicleCard.tsx    # Card de veículo
│   └── WhatsAppButton.tsx # Botão flutuante WhatsApp
├── database/              # Scripts SQL
│   ├── schema.sql         # Schema do banco
│   └── sample-data.sql    # Dados de exemplo
├── lib/                   # Utilitários
│   ├── auth.ts            # Funções de autenticação
│   ├── db.ts              # Conexão com PostgreSQL
│   └── types.ts           # TypeScript types
├── public/                # Assets estáticos
│   └── assets/
│       ├── logo-frankmotors.png
│       └── placeholder-vehicle.jpg
├── scripts/               # Scripts auxiliares
│   └── create-admin.js    # Criar usuário admin
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências
├── README.md              # Documentação completa
├── QUICKSTART.md          # Guia rápido
└── tailwind.config.ts     # Configuração Tailwind
```

### Funcionalidades Implementadas

#### Frontend Público

- ✅ **Home Page** com hero section premium
- ✅ **Catálogo de Veículos** com filtros avançados
- ✅ **Detalhes do Veículo** (estrutura pronta)
- ✅ **Página de Promoções**
- ✅ **Página de Contato** com múltiplos canais
- ✅ **Menu Mobile Fixo** (bottom navigation)
- ✅ **Botão WhatsApp Flutuante**
- ✅ **Design Responsivo** para todos os dispositivos
- ✅ **SEO Otimizado** com meta tags

#### Painel Administrativo

- ✅ **Login Seguro** com JWT
- ✅ **Dashboard** (estrutura pronta)
- ✅ **Gestão de Veículos** (CRUD completo via API)
- ✅ **Gestão de Promoções** (estrutura pronta)
- ✅ **Upload de Fotos** (até 3 por veículo)

#### API Backend

- ✅ **POST /api/auth/login** - Login de admin
- ✅ **GET /api/auth/me** - Verificar autenticação
- ✅ **GET /api/vehicles** - Listar veículos (com filtros)
- ✅ **GET /api/vehicles/[id]** - Detalhes de veículo
- ✅ **POST /api/vehicles** - Criar veículo (admin)
- ✅ **PUT /api/vehicles/[id]** - Atualizar veículo (admin)
- ✅ **DELETE /api/vehicles/[id]** - Deletar veículo (admin)
- ✅ **GET /api/promotions** - Listar promoções

## 🗄️ Configuração do Banco de Dados

### Opção 1: PostgreSQL Local

#### 1. Instalar PostgreSQL

**Windows:**

- Download: https://www.postgresql.org/download/windows/
- Ou use Chocolatey: `choco install postgresql`

**Usando Docker:**

```bash
docker run --name frank-motors-db \
  -e POSTGRES_PASSWORD=strong_password_here \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=frank_motors \
  -p 5432:5432 \
  -d postgres:15
```

#### 2. Criar o Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco e usuário
CREATE DATABASE frank_motors;
CREATE USER admin WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE frank_motors TO admin;
\q
```

#### 3. Executar o Schema

```bash
psql -U admin -d frank_motors -f database/schema.sql
```

#### 4. Criar Usuário Admin

Execute o script para gerar o SQL:

```bash
node scripts/create-admin.js
```

Você verá algo assim:

```sql
INSERT INTO users (email, password_hash, role)
VALUES (
  'lucasmelo@nexus.com',
  '$2a$10$...',  -- Hash gerado automaticamente
  'admin'
);
```

Copie e execute esse SQL no PostgreSQL:

```bash
psql -U admin -d frank_motors
# Cole o INSERT gerado
\q
```

#### 5. (Opcional) Adicionar Dados de Exemplo

```bash
psql -U admin -d frank_motors -f database/sample-data.sql
```

### Opção 2: PostgreSQL Online (Neon/Supabase)

#### Usando Neon.tech (Recomendado - Free Tier)

1. Acesse https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string
5. No painel do Neon, vá em "SQL Editor"
6. Cole e execute o conteúdo de `database/schema.sql`
7. Execute o script `node scripts/create-admin.js`
8. Cole e execute o INSERT gerado
9. (Opcional) Execute `database/sample-data.sql`

#### Usando Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Vá em "SQL Editor"
4. Execute os mesmos passos acima

## 🔐 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=frank_motors
POSTGRES_USER=admin
POSTGRES_PASSWORD=strong_password_here

# Database URL (use a connection string do Neon/Supabase se estiver usando)
DATABASE_URL=postgresql://admin:strong_password_here@localhost:5432/frank_motors

# JWT Secret (gere uma chave aleatória longa e segura)
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria_aqui_123456789

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=+5579991015150

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Storage (opcional, para futuro)
STORAGE_BUCKET=frank-motors-media
```

### Gerar JWT Secret Seguro

Execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Iniciar o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 🔑 Acessar o Admin

1. Vá para: **http://localhost:3000/admin/login**
2. **Email**: lucasmelo@nexus.com
3. **Senha**: lucas102030

## 📝 Próximos Passos

### 1. Adicionar Veículos

Via API (use Postman, Insomnia ou curl):

```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "modelo": "Civic",
    "marca": "Honda",
    "ano": 2022,
    "preco": 95000,
    "descricao": "Honda Civic 2022, completo",
    "tipo": "carro",
    "promocao": true,
    "estoque": 1
  }'
```

### 2. Criar Interface Admin Completa

O backend está pronto! Você pode:

- Criar páginas admin para gerenciar veículos visualmente
- Implementar upload de fotos
- Adicionar dashboard com estatísticas

### 3. Personalizar

- Altere cores em `tailwind.config.ts`
- Substitua o logo em `public/assets/logo-frankmotors.png`
- Edite textos nos componentes

## 🎨 Identidade Visual

### Cores Configuradas

```typescript
primary: "#1C1C1C"; // Preto
secondary: "#FF0000"; // Vermelho
background: "#F5F5F5"; // Cinza Claro
text: "#333333"; // Cinza Escuro
accent: "#FFD700"; // Dourado
```

### Fontes

- **Headings**: Roboto (Google Fonts)
- **Body**: Open Sans (Google Fonts)

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"

1. Verifique se o PostgreSQL está rodando:

   ```bash
   # Windows
   Get-Service postgresql*

   # Docker
   docker ps
   ```

2. Teste a conexão:

   ```bash
   psql -U admin -d frank_motors -h localhost
   ```

3. Verifique as credenciais no `.env.local`

### Erro: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Porta 3000 em uso

```bash
npm run dev -- -p 3001
```

### Erro de CORS

Adicione no `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📚 Documentação Adicional

- **README.md**: Documentação completa do projeto
- **QUICKSTART.md**: Guia rápido de início
- **database/schema.sql**: Estrutura do banco de dados
- **database/sample-data.sql**: Dados de exemplo

## 🚢 Deploy em Produção

### Vercel (Recomendado)

1. Push para GitHub
2. Conecte no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras Opções

- Netlify
- Railway
- Render
- AWS Amplify

## 📞 Suporte

Precisa de ajuda?

- Email: contato@frankmotors.com.br
- WhatsApp: (79) 99101-5150

---

**Desenvolvido para Frank Motors** 🏆🏅  
_Loja Destaque 2024 e 2025_
