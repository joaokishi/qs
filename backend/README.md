# Sistema de Leilão Online - Backend

Sistema completo de leilões online desenvolvido com NestJS, MySQL e TypeORM, implementando todos os requisitos funcionais e não funcionais especificados.

## 🚀 Tecnologias

- **NestJS** 10.x - Framework Node.js
- **TypeORM** 0.3.x - ORM para banco de dados
- **MySQL** 8.0 - Banco de dados relacional
- **Socket.IO** 4.x - WebSockets para tempo real
- **JWT** - Autenticação e autorização
- **Bcrypt** - Criptografia de senhas
- **Sharp** - Processamento de imagens
- **Nodemailer** - Envio de e-mails
- **Swagger** - Documentação da API

## 📋 Requisitos Implementados

### Requisitos Funcionais

✅ **RF01** - Gestão de Categorias (CRUD completo)  
✅ **RF02** - Gestão de Itens (com upload de imagens otimizadas)  
✅ **RF03** - Criação de Leilões (agendamento com validação de 30min e vinculação de itens)  
✅ **RF04** - Gestão de Participantes (bloqueio/desbloqueio)  
✅ **RF05** - Moderação de Lances (cancelamento com recálculo automático)  
✅ **RF06** - Dashboard (métricas e estatísticas)  
✅ **RF07** - Sala de Disputa (WebSocket em tempo real)  
✅ **RF08** - Realização de Lances (validação de incremento mínimo)  
✅ **RF09** - Histórico e Minha Conta (Dashboard "Meus Lances" com status: Ganhando, Superado, Arrematado)  
✅ **RF10** - Busca e Filtros (por nome, categoria, faixa de valor)  
✅ **RF11** - Encerramento do Leilão (automático via cron job)  
✅ **RF12** - Notificações (e-mail para superado/arrematado)  
✅ **RF13** - Prorrogação Dinâmica (soft close de 15 segundos)

### Requisitos Não Funcionais

✅ **RNF01** - Segurança (JWT, bcrypt, HTTPS)  
✅ **RNF02** - Integridade Transacional (pessimistic locks, transações)  
✅ **RNF03** - Atualização em Tempo Real (WebSocket < 1s latência)  
✅ **RNF04** - Auditoria (logs imutáveis)  
✅ **RNF05** - Performance (otimização de imagens com Sharp)  
✅ **RNF06** - Usabilidade (API RESTful bem documentada)  
✅ **RNF07** - Acessibilidade (endpoints públicos e autenticados)  
✅ **RNF08** - Privacidade (dados sensíveis protegidos)  
✅ **RNF09** - Arquitetura (API RESTful + WebSocket)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│              (React, Vue, Angular, etc.)                    │
└────────────────┬────────────────┬───────────────────────────┘
                 │                │
          REST API          WebSocket (Socket.IO)
                 │                │
┌────────────────┴────────────────┴───────────────────────────┐
│                      BACKEND - NestJS                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers (API REST)                              │   │
│  └─────────────────────┬────────────────────────────────┘   │
│  ┌─────────────────────┴────────────────────────────────┐   │
│  │  Services (Lógica de Negócio)                        │   │
│  │  - Validações                                        │   │
│  │  - Transações                                        │   │
│  │  - Controle de Concorrência                          │   │
│  └─────────────────────┬────────────────────────────────┘   │
│  ┌─────────────────────┴────────────────────────────────┐   │
│  │  TypeORM (ORM)                                       │   │
│  └─────────────────────┬────────────────────────────────┘   │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                     MySQL Database                           │
│  - Users, Categories, Items, Auctions                        │
│  - Bids (com locks), AuditLogs                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Serviços Externos                           │
│  - SMTP (Nodemailer) → Notificações por e-mail              │
│  - File System (Sharp) → Processamento de imagens           │
└──────────────────────────────────────────────────────────────┘
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- MySQL 8.0+ instalado e rodando
- npm ou yarn

### Passo 1: Clonar e instalar dependências

```powershell
cd c:\Users\akiri\Downloads\qs
npm install
```

### Passo 2: Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha_mysql
DB_DATABASE=auction_system

# JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
JWT_EXPIRATION=24h

# Application
PORT=3000
NODE_ENV=development

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_app
MAIL_FROM=noreply@auction.com

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# WebSocket
WS_CORS_ORIGIN=http://localhost:4200
```

### Passo 3: Criar banco de dados

```sql
CREATE DATABASE auction_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Passo 4: Rodar a aplicação

**Desenvolvimento (com hot-reload):**
```powershell
npm run start:dev
```

**Produção:**
```powershell
npm run build
npm run start:prod
```

A aplicação estará disponível em:
- API: http://localhost:3000/api
- Documentação Swagger: http://localhost:3000/api/docs

## 🐳 Docker (Alternativa)

Para rodar com Docker Compose (MySQL + App):

```powershell
docker-compose up -d
```

Isso iniciará:
- MySQL na porta 3306
- Backend na porta 3000

## 📡 Endpoints Principais

### Autenticação
```
POST   /api/auth/register        # Registrar usuário
POST   /api/auth/login           # Login
```

### Categorias
```
GET    /api/categories           # Listar categorias
POST   /api/categories           # Criar categoria (Admin)
GET    /api/categories/:id       # Buscar categoria
PATCH  /api/categories/:id       # Atualizar categoria (Admin)
DELETE /api/categories/:id       # Remover categoria (Admin)
```

### Itens
```
GET    /api/items                # Listar itens (com filtros)
POST   /api/items                # Criar item (Admin)
GET    /api/items/:id            # Buscar item
PATCH  /api/items/:id            # Atualizar item (Admin)
DELETE /api/items/:id            # Remover item (Admin)
POST   /api/items/:id/images     # Upload de imagens (Admin)
DELETE /api/items/:id/images     # Remover imagem (Admin)
```

### Leilões
```
GET    /api/auctions             # Listar leilões
POST   /api/auctions             # Criar leilão (Admin)
GET    /api/auctions/active      # Listar leilões ativos
GET    /api/auctions/:id         # Buscar leilão
PATCH  /api/auctions/:id         # Atualizar leilão (Admin)
POST   /api/auctions/:id/start   # Iniciar leilão (Admin)
POST   /api/auctions/:id/next    # Próximo item (Admin)
POST   /api/auctions/:id/end     # Encerrar leilão (Admin)
```

### Lances
```
POST   /api/bids                 # Realizar lance
GET    /api/bids/my-bids         # Meus lances
GET    /api/bids/winning         # Lances vencedores
GET    /api/bids/item/:itemId    # Lances de um item
DELETE /api/bids/:id             # Cancelar lance (Admin)
```

### Usuários
```
GET    /api/users                # Listar usuários (Admin)
GET    /api/users/:id            # Buscar usuário (Admin)
PATCH  /api/users/:id/block      # Bloquear usuário (Admin)
PATCH  /api/users/:id/unblock    # Desbloquear usuário (Admin)
```

### Dashboard
```
GET    /api/dashboard/metrics              # Métricas gerais (Admin)
GET    /api/dashboard/items/top-bids       # Itens com mais lances (Admin)
GET    /api/dashboard/revenue/by-category  # Receita por categoria (Admin)
GET    /api/dashboard/auctions/active      # Leilões ativos detalhados (Admin)
GET    /api/dashboard/bidders/top          # Top participantes (Admin)
```

### Auditoria
```
GET    /api/audit                # Listar logs (Admin)
GET    /api/audit/user/:userId   # Logs de usuário (Admin)
```

## 🔌 WebSocket

### Namespace: `/auction`

**Autenticação:**
```javascript
const socket = io('http://localhost:3000/auction', {
  auth: {
    token: 'Bearer YOUR_JWT_TOKEN'
  }
});
```

**Eventos do Cliente:**
```javascript
// Entrar em um leilão
socket.emit('auction:join', auctionId);

// Sair de um leilão
socket.emit('auction:leave', auctionId);

// Entrar em um item específico
socket.emit('item:join', itemId);
```

**Eventos do Servidor:**
```javascript
// Estado inicial do leilão
socket.on('auctions:active', (auctions) => {...});

// Estado do leilão ao entrar
socket.on('auction:state', (auction) => {...});

// Novo lance
socket.on('bid:new', (bid) => {...});

// Lance cancelado
socket.on('bid:cancelled', (data) => {...});

// Item atualizado
socket.on('item:updated', (data) => {...});

// Timer estendido (soft close)
socket.on('timer:extended', (data) => {...});

// Timer atualizado (a cada segundo)
socket.on('timer:update', (data) => {...});

// Item mudou
socket.on('item:changed', (data) => {...});

// Leilão encerrado
socket.on('auction:ended', () => {...});

// Usuário foi superado
socket.on('user:outbid', (data) => {...});
```

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

**Fazer login:**
```bash
POST /api/auth/login
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome",
    "role": "participant"
  }
}
```

**Usar o token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 Roles

- **admin**: Acesso total ao sistema
- **participant**: Pode dar lances e ver histórico

## 🔐 Segurança Implementada

1. **Senhas**: Criptografadas com bcrypt (salt rounds: 10)
2. **JWT**: Tokens com expiração configurável
3. **Guards**: Proteção de rotas por autenticação e role
4. **CORS**: Configurado para origens permitidas
5. **Helmet**: Headers de segurança HTTP
6. **Validação**: Class-validator em todos os DTOs
7. **SQL Injection**: Prevenido pelo TypeORM
8. **Race Conditions**: Locks pessimistas em transações

## 📊 Sistema de Lances

### Validações
1. Item deve estar em leilão ativo
2. Item deve ser o item atual do leilão
3. Lance deve ser maior que (valor atual + incremento mínimo)
4. Detecção de conflitos (outro lance simultâneo)

### Controle de Concorrência
- Transações com `pessimistic_write` lock
- Verificação de valor atual antes de salvar
- Erro de conflito se valor mudou

### Prorrogação Dinâmica (Soft Close)
- Se um lance for feito com menos de 15 segundos restantes
- O cronômetro é automaticamente resetado para 15 segundos
- Todos os clientes conectados são notificados via WebSocket

## 📧 Notificações

O sistema envia e-mails automaticamente para:

1. **Usuário superado**: Quando outro participante dá um lance maior
2. **Usuário arrematou**: Quando ganha o item ao final
3. **Leilão iniciado**: Notificação de início de leilão

Configure as variáveis SMTP no `.env` para ativar.

## 🗄️ Banco de Dados

### Entidades Principais

- **User**: Usuários do sistema
- **Category**: Categorias de itens
- **Item**: Itens a serem leiloados
- **Auction**: Leilões agendados/ativos
- **Bid**: Lances dos participantes
- **AuditLog**: Logs de auditoria imutáveis

### Diagrama ER (Simplificado)

```
User (1) ──────< (N) Bid
Item (1) ──────< (N) Bid
Category (1) ──< (N) Item
Auction (1) ───< (N) Item
```

## 🧪 Testes

```powershell
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 📝 Scripts Disponíveis

```powershell
npm run start          # Iniciar em modo normal
npm run start:dev      # Iniciar com hot-reload
npm run start:prod     # Iniciar em produção
npm run build          # Build para produção
npm run lint           # Verificar código
npm run format         # Formatar código
```

## 🐛 Troubleshooting

### Erro de conexão com MySQL
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solução**: Verifique usuário e senha no `.env`

### Erro de porta em uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solução**: Altere a porta no `.env` ou mate o processo:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### WebSocket não conecta
**Solução**: Verifique CORS no `.env` e certifique-se de passar o token JWT

### Imagens não são salvas
**Solução**: Certifique-se que o diretório `./uploads` existe e tem permissões de escrita

## 📚 Documentação da API

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:3000/api/docs
- **JSON**: http://localhost:3000/api/docs-json

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Swagger
2. Consulte os logs da aplicação
3. Revise as variáveis de ambiente

## 📄 Licença

MIT License

---

**Desenvolvido com NestJS** 🚀
