# ✅ Frank Motors - Checklist de Configuração

Use este checklist para configurar o sistema passo a passo.

---

## 📋 Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL instalado OU conta em Neon/Supabase
- [ ] Editor de código (VS Code recomendado)
- [ ] Terminal/PowerShell

---

## 🚀 Configuração Inicial

### Passo 1: Verificar Instalação

```bash
npm run setup:check
```

**Resultado esperado:**

```
✅ Node.js: v18.x.x ou superior
✅ NPM: 9.x.x ou superior
```

---

### Passo 2: Escolher Banco de Dados

#### Opção A: PostgreSQL Local ⚙️

- [ ] PostgreSQL instalado
- [ ] Serviço rodando
- [ ] Banco `frank_motors` criado
- [ ] Usuário `admin` criado

**Comandos:**

```bash
# Criar banco
psql -U postgres
CREATE DATABASE frank_motors;
CREATE USER admin WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE frank_motors TO admin;
\q

# Executar schema
psql -U admin -d frank_motors -f database/schema.sql
```

#### Opção B: Neon.tech (Online) ☁️ **RECOMENDADO**

- [ ] Conta criada em https://neon.tech
- [ ] Projeto criado
- [ ] Connection string copiada
- [ ] Schema executado no SQL Editor
- [ ] Usuário admin criado

---

### Passo 3: Criar Usuário Admin

```bash
npm run setup:admin
```

- [ ] SQL gerado
- [ ] SQL executado no PostgreSQL
- [ ] Credenciais anotadas:
  - Email: `lucasmelo@nexus.com`
  - Senha: `lucas102030`

---

### Passo 4: Configurar Variáveis de Ambiente

- [ ] Arquivo `.env.local` criado na raiz
- [ ] Todas as variáveis preenchidas

**Template `.env.local`:**

```env
# ===== DATABASE =====
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=frank_motors
POSTGRES_USER=admin
POSTGRES_PASSWORD=SUA_SENHA_AQUI

# Connection String (use a do Neon se estiver usando)
DATABASE_URL=postgresql://admin:SUA_SENHA@localhost:5432/frank_motors

# ===== SECURITY =====
# Gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=SUA_CHAVE_SECRETA_LONGA_AQUI

# ===== WHATSAPP =====
NEXT_PUBLIC_WHATSAPP_NUMBER=+5579991015150

# ===== APP =====
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ===== STORAGE (Opcional) =====
STORAGE_BUCKET=frank-motors-media
```

**Checklist de variáveis:**

- [ ] `DATABASE_URL` configurado
- [ ] `JWT_SECRET` gerado e configurado
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` configurado
- [ ] `NEXT_PUBLIC_BASE_URL` configurado

---

### Passo 5: Testar Conexão com Banco

```bash
# Se PostgreSQL local
psql -U admin -d frank_motors -c "SELECT COUNT(*) FROM users;"
```

**Resultado esperado:** `count: 1` (o admin criado)

- [ ] Conexão funcionando
- [ ] Usuário admin existe

---

### Passo 6: Iniciar o Servidor

```bash
npm run dev
```

**Resultado esperado:**

```
▲ Next.js 15.x.x
- Local: http://localhost:3000
✓ Ready in Xs
```

- [ ] Servidor iniciado sem erros
- [ ] Porta 3000 disponível

---

## 🧪 Testes

### Teste 1: Acessar Home Page

- [ ] Abrir http://localhost:3000
- [ ] Hero section carregou
- [ ] Menu de navegação visível
- [ ] Footer visível
- [ ] Botão WhatsApp flutuante visível

### Teste 2: Acessar Admin Login

- [ ] Abrir http://localhost:3000/admin/login
- [ ] Formulário de login visível
- [ ] Logo aparecendo

### Teste 3: Fazer Login

- [ ] Email: `lucasmelo@nexus.com`
- [ ] Senha: `lucas102030`
- [ ] Login bem-sucedido
- [ ] Token armazenado (verificar localStorage)

### Teste 4: Testar API

```bash
# Listar veículos
curl http://localhost:3000/api/vehicles
```

- [ ] API respondendo
- [ ] Retorna JSON válido

---

## 📊 Dados de Teste (Opcional)

### Adicionar Dados de Exemplo

```bash
psql -U admin -d frank_motors -f database/sample-data.sql
```

- [ ] Dados inseridos
- [ ] Veículos aparecem no catálogo

---

## 🎨 Personalização

### Logo

- [ ] Logo personalizado em `public/assets/logo-frankmotors.png`
- [ ] Favicon atualizado em `public/favicon.ico`

### Cores

- [ ] Cores ajustadas em `tailwind.config.ts`
- [ ] Variáveis CSS atualizadas em `app/globals.css`

### Textos

- [ ] Informações da empresa atualizadas
- [ ] Número do WhatsApp correto
- [ ] Email de contato correto
- [ ] Endereço atualizado

---

## 🔐 Segurança

### Produção

- [ ] JWT_SECRET alterado para valor seguro
- [ ] Senha do admin alterada
- [ ] Variáveis de ambiente configuradas no host
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente

---

## 🚀 Deploy

### Preparação

- [ ] Código commitado no Git
- [ ] `.env.local` no `.gitignore`
- [ ] Build local testado: `npm run build`
- [ ] Sem erros de TypeScript
- [ ] Sem erros de ESLint

### Vercel

- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Site funcionando em produção

---

## 📱 Funcionalidades a Testar

### Público

- [ ] Home page carrega
- [ ] Catálogo de veículos funciona
- [ ] Filtros funcionam
- [ ] Paginação funciona
- [ ] Detalhes do veículo (quando implementado)
- [ ] Página de promoções
- [ ] Página de contato
- [ ] Botão WhatsApp funciona
- [ ] Links do footer funcionam
- [ ] Menu mobile funciona

### Admin

- [ ] Login funciona
- [ ] Logout funciona
- [ ] API de veículos:
  - [ ] GET /api/vehicles
  - [ ] GET /api/vehicles/[id]
  - [ ] POST /api/vehicles (com token)
  - [ ] PUT /api/vehicles/[id] (com token)
  - [ ] DELETE /api/vehicles/[id] (com token)
- [ ] API de promoções:
  - [ ] GET /api/promotions

---

## 🐛 Troubleshooting

### Problema: Erro de conexão com banco

**Soluções:**

- [ ] Verificar se PostgreSQL está rodando
- [ ] Verificar credenciais no `.env.local`
- [ ] Testar conexão manual: `psql -U admin -d frank_motors`
- [ ] Verificar firewall

### Problema: Porta 3000 em uso

**Solução:**

```bash
npm run dev -- -p 3001
```

- [ ] Atualizar `NEXT_PUBLIC_BASE_URL` para `:3001`

### Problema: Módulos não encontrados

**Solução:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: Erro no login

**Verificar:**

- [ ] Usuário admin existe no banco
- [ ] Senha está correta
- [ ] JWT_SECRET está configurado
- [ ] API `/api/auth/login` está respondendo

---

## 📚 Documentação de Referência

- [ ] `PROJECT_SUMMARY.md` - Visão geral completa
- [ ] `SETUP.md` - Guia detalhado de setup
- [ ] `QUICKSTART.md` - Início rápido
- [ ] `README.md` - Documentação técnica

---

## ✨ Próximos Passos

Após configuração completa:

1. **Adicionar Veículos**

   - Via API ou interface admin (quando implementada)
   - Upload de fotos

2. **Configurar Promoções**

   - Marcar veículos em promoção
   - Definir descontos

3. **Personalizar Conteúdo**

   - Textos das páginas
   - Informações de contato
   - Sobre a empresa

4. **Marketing**

   - SEO optimization
   - Google Analytics
   - Facebook Pixel
   - Google Ads

5. **Melhorias**
   - Interface admin visual
   - Dashboard com estatísticas
   - Sistema de favoritos
   - Comparador de veículos

---

## 🎯 Status Final

Marque quando tudo estiver funcionando:

- [ ] ✅ Banco de dados configurado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Servidor rodando
- [ ] ✅ Login funcionando
- [ ] ✅ API funcionando
- [ ] ✅ Site público acessível
- [ ] ✅ WhatsApp integrado
- [ ] ✅ Personalização concluída
- [ ] ✅ Testes realizados
- [ ] ✅ Deploy em produção (opcional)

---

## 🎉 Parabéns!

Se todos os itens acima estão marcados, seu sistema Frank Motors está **100% operacional**!

**Boa sorte com as vendas!** 🚗🏍️

---

_Frank Motors - Loja Destaque 2024 e 2025_ 🏆🏅
