# 🚀 Guia de Início Rápido

## Passo a Passo para Rodar o Sistema

### 1️⃣ Instalar Dependências

```powershell
npm install
```

### 2️⃣ Configurar Banco de Dados

**Criar o banco de dados MySQL:**
```sql
CREATE DATABASE auction_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Configurar o arquivo `.env`:**
```powershell
Copy-Item .env.example .env
```

Edite o `.env` com suas credenciais do MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=SUA_SENHA_MYSQL
DB_DATABASE=auction_system
JWT_SECRET=uma_chave_secreta_muito_forte
```

### 3️⃣ Executar Seed (Popular Banco)

```powershell
npm run seed
```

Isso criará:
- ✅ Usuário admin: `admin@auction.com` / `admin123`
- ✅ Usuários participantes: `joao@email.com` / `senha123`
- ✅ 6 categorias de exemplo
- ✅ 8 itens de exemplo

### 4️⃣ Iniciar o Servidor

```powershell
npm run start:dev
```

Aguarde a mensagem:
```
🚀 Application is running on: http://localhost:3000/api
📚 Swagger docs: http://localhost:3000/api/docs
```

### 5️⃣ Testar a API

Acesse a documentação interativa:
```
http://localhost:3000/api/docs
```

## 🧪 Testando o Sistema

### Fazer Login como Admin

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "admin@auction.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@auction.com",
    "name": "Administrador",
    "role": "admin"
  }
}
```

### Usar o Token

No Swagger, clique em **Authorize** e cole o token:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Criar um Leilão

**Endpoint:** `POST /api/auctions`

**Body:**
```json
{
  "title": "Leilão de Imóveis - Dezembro 2025",
  "description": "Grande leilão com propriedades premium",
  "startDate": "2025-12-01T10:00:00Z",
  "itemIds": ["uuid-item-1", "uuid-item-2"]
}
> **Nota:** A data de início deve ser pelo menos 30 minutos no futuro.
```

> **Dica:** Use `GET /api/items` para ver os IDs dos itens disponíveis.

### Iniciar um Leilão

**Endpoint:** `POST /api/auctions/{id}/start`

### Fazer Login como Participante

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Realizar um Lance

**Endpoint:** `POST /api/bids`

**Body:**
```json
{
  "itemId": "uuid-do-item-atual",
  "amount": 510000
}
```

## 🔌 Conectar via WebSocket

### Exemplo em JavaScript/TypeScript:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/auction', {
  auth: {
    token: 'Bearer SEU_TOKEN_JWT'
  }
});

// Conectar a um leilão
socket.emit('auction:join', auctionId);

// Escutar novos lances
socket.on('bid:new', (bid) => {
  console.log('Novo lance:', bid);
});

// Escutar timer
socket.on('timer:update', (data) => {
  console.log('Tempo restante:', data.remainingSeconds);
});

// Notificação de superado
socket.on('user:outbid', (data) => {
  alert('Você foi superado!');
});
```

## 📋 Fluxo Completo de um Leilão

1. **Admin cria categorias** → `POST /api/categories`
2. **Admin cadastra itens** → `POST /api/items`
3. **Admin faz upload de imagens** → `POST /api/items/{id}/images`
4. **Admin cria leilão** → `POST /api/auctions`
5. **Admin inicia leilão** → `POST /api/auctions/{id}/start`
6. **Participantes conectam via WebSocket**
7. **Participantes dão lances** → `POST /api/bids`
8. **Sistema aplica soft close** (15s se lance nos últimos 15s)
9. **Cronômetro chega a zero**
10. **Sistema passa para próximo item** (automático)
11. **Admin pode encerrar leilão** → `POST /api/auctions/{id}/end`

## 🎯 Endpoints Mais Usados

### Públicos (sem autenticação)
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/categories` - Listar categorias
- `GET /api/items` - Listar itens
- `GET /api/auctions` - Listar leilões

### Participante (requer autenticação)
- `POST /api/bids` - Dar lance
- `GET /api/bids/my-bids` - Meus lances
- `GET /api/bids/winning` - Lances que estou ganhando

### Admin (requer role admin)
- `POST /api/categories` - Criar categoria
- `POST /api/items` - Criar item
- `POST /api/auctions` - Criar leilão
- `POST /api/auctions/{id}/start` - Iniciar leilão
- `DELETE /api/bids/{id}` - Cancelar lance
- `PATCH /api/users/{id}/block` - Bloquear usuário
- `GET /api/dashboard/metrics` - Ver métricas

## 🐛 Problemas Comuns

### Erro: "Cannot connect to MySQL"
```
✖ Verifique se o MySQL está rodando
✖ Confirme usuário e senha no .env
✖ Certifique-se que o banco 'auction_system' existe
```

### Erro: "JWT_SECRET is not defined"
```
✖ Configure JWT_SECRET no arquivo .env
```

### Erro: "Port 3000 already in use"
```
✖ Altere PORT no .env ou mate o processo:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

## 📦 Docker (Opcional)

Se preferir usar Docker:

```powershell
docker-compose up -d
```

Isso iniciará MySQL + Backend automaticamente.

## 🎓 Próximos Passos

1. Explore a documentação Swagger em `http://localhost:3000/api/docs`
2. Teste os endpoints de Dashboard (métricas)
3. Experimente o sistema de notificações por e-mail
4. Teste o soft close (prorrogação de 15s)
5. Veja os logs de auditoria

## 💡 Dicas

- Use o Swagger para testar todos os endpoints
- O WebSocket requer autenticação JWT
- Lances simultâneos são tratados por transações
- O sistema notifica por e-mail automaticamente
- Logs de auditoria são imutáveis

---

**Pronto para começar!** 🚀

Para mais detalhes, consulte o [README.md](README.md) completo.
