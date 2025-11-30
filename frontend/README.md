# Frontend (React + Vite)

Interface web do Sistema de Leilão Online.

## Requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3000`

O Vite já está configurado para fazer proxy para o backend:
- `'/api'` → `http://localhost:3000`
- `'/socket.io'` (WS) → `http://localhost:3000`

## Instalação

```powershell
cd frontend
npm install
```

## Desenvolvimento

```powershell
npm run dev
```

Aplicação: `http://localhost:5173`

Se necessário, ajuste o CORS do backend no `.env`:
```env
WS_CORS_ORIGIN=http://localhost:5173
```

## Build e Preview

```powershell
npm run build
npm run preview
```

## Autenticação

- O token JWT é armazenado no `localStorage` como `token`.
- Requisições são feitas via Axios (`src/api/axios.ts`) com baseURL `/api`.
- WebSocket usa namespace `/auction` e envia `auth.token` com `Bearer <JWT>`.

## Estrutura

- `src/pages` — telas principais (Dashboard, Auctions, AuctionRoom, Admin, etc.)
- `src/components` — componentes compartilhados (Navbar, Timer, BidControls, etc.)
- `src/context` — contextos (Auth, Notifications, Socket)
- `src/api` — chamadas de API organizadas por domínio

## Credenciais de exemplo (seed)

Após rodar `npm run seed` no backend:
- Admin: `admin@auction.com` / `admin123`
- Participante: `joao@email.com` / `senha123`

## Dicas

- Inicie o backend primeiro (`npm run start:dev` na pasta `backend`).
- A documentação da API está em `http://localhost:3000/api/docs` (Swagger).
