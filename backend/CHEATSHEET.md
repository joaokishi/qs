# ⚡ Comandos Úteis - Cheat Sheet

## 🚀 Instalação e Setup

```powershell
# Instalar dependências
npm install

# Copiar arquivo de ambiente
Copy-Item .env.example .env

# Popular banco de dados
npm run seed

# Iniciar desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Iniciar produção
npm run start:prod
```

## 🗄️ Banco de Dados (SQL.js)

Arquivo: `./data/auction_system.db`

Reset rápido do banco local:
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -ErrorAction SilentlyContinue
Remove-Item -Force -ErrorAction SilentlyContinue data\auction_system.db
npm run seed
```

### TypeORM Migrations
```powershell
# Gerar migration
npm run migration:generate -- src/migrations/MigrationName

# Executar migrations
npm run migration:run

# Reverter última migration
npm run migration:revert
```

## 🧪 Testes via cURL

### Autenticação
```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "name": "Usuário Teste",
    "password": "senha123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auction.com",
    "password": "admin123"
  }'
```

### Categorias
```bash
# Listar
curl http://localhost:3000/api/categories

# Criar (admin)
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nova Categoria",
    "description": "Descrição"
  }'
```

### Itens
```bash
# Listar com filtros
curl "http://localhost:3000/api/items?search=iphone&minValue=5000&maxValue=10000"

# Criar item (admin)
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Novo na caixa",
    "condition": "novo",
    "initialValue": 7000,
    "minimumIncrement": 100,
    "categoryId": "uuid-categoria"
  }'
```

### Leilões
```bash
# Criar leilão (admin)
curl -X POST http://localhost:3000/api/auctions \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Leilão Teste",
    "startDate": "2025-12-01T10:00:00Z", // Deve ser > 30 min no futuro
    "itemIds": ["uuid-1", "uuid-2"]
  }'

# Iniciar leilão (admin)
curl -X POST http://localhost:3000/api/auctions/UUID/start \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Lances
```bash
# Dar lance
curl -X POST http://localhost:3000/api/bids \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "uuid-item",
    "amount": 7500
  }'

# Ver meus lances
curl http://localhost:3000/api/bids/my-bids \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📊 Observações sobre consultas

Como o projeto usa SQL.js, consultas diretas devem ser feitas via aplicação. Para análises, exporte o arquivo `.db` para ferramentas compatíveis.

## 🔍 Debug e Logs

### Ver logs em desenvolvimento
```powershell
# Logs do NestJS aparecem automaticamente no terminal
npm run start:dev
```

### Ver logs do Docker
```powershell
# Todos os containers
docker-compose logs -f

# Apenas backend
docker-compose logs -f app

# Apenas MySQL
docker-compose logs -f mysql
```

### Verificar erros de TypeScript
```powershell
# Compilar sem executar
npm run build
```

## 🛠️ Manutenção

### Limpar node_modules
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Limpar build
```powershell
Remove-Item -Recurse -Force dist
npm run build
```

### Verificar portas em uso
```powershell
# Ver processo na porta 3000
Get-NetTCPConnection -LocalPort 3000

# Matar processo
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Resetar banco embutido (SQL.js)
```powershell
Remove-Item -Force -ErrorAction SilentlyContinue data\auction_system.db
npm run seed
```

## 📦 Backup e Restore

### Backup do banco
```powershell
# Backup
mysqldump -u root -p auction_system > backup.sql

# Restore
mysql -u root -p auction_system < backup.sql
```

## 🔐 Gerar JWT Secret Seguro

```powershell
# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() * 2))
```

## 📝 Aliases Úteis (PowerShell Profile)

Adicione ao seu `$PROFILE`:

```powershell
# Aliases para o projeto
function Start-Auction { npm run start:dev }
function Seed-Auction { npm run seed }
function Build-Auction { npm run build }

Set-Alias auction Start-Auction
Set-Alias seed Seed-Auction
```

Então use:
```powershell
auction  # Inicia o servidor
seed     # Popula o banco
```

## 🎯 Atalhos do VS Code

Adicione ao `.vscode/settings.json`:

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": ["-NoExit", "-Command", "cd c:\\Users\\João\\Downloads\\qs\\qs\\backend"]
    }
  }
}
```

## 🚨 Troubleshooting Rápido

### Erro de módulo não encontrado
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Porta em uso
```powershell
# Alterar porta no .env
PORT=3001

# Ou matar processo
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
```

### CORS para o Vite (frontend)
```env
WS_CORS_ORIGIN=http://localhost:5173
```

---

**Comandos sempre à mão!** ⚡

Salve este arquivo para consulta rápida.
