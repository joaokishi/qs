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

## 🐳 Docker

```powershell
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🗄️ Banco de Dados

### MySQL CLI
```powershell
# Conectar ao MySQL
mysql -u root -p

# Criar banco
CREATE DATABASE auction_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Usar banco
USE auction_system;

# Ver tabelas
SHOW TABLES;

# Descrever tabela
DESCRIBE users;

# Ver dados
SELECT * FROM users;

# Limpar banco (cuidado!)
DROP DATABASE auction_system;
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
    "startDate": "2024-12-01T10:00:00Z",
    "expectedEndDate": "2024-12-15T18:00:00Z",
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

## 📊 SQL Úteis

### Estatísticas
```sql
-- Total de lances por item
SELECT i.name, COUNT(b.id) as total_lances
FROM items i
LEFT JOIN bids b ON i.id = b.itemId
GROUP BY i.id
ORDER BY total_lances DESC;

-- Maior lance por item
SELECT i.name, MAX(b.amount) as maior_lance
FROM items i
LEFT JOIN bids b ON i.id = b.itemId
GROUP BY i.id;

-- Top 10 participantes
SELECT u.name, COUNT(b.id) as total_lances
FROM users u
LEFT JOIN bids b ON u.id = b.userId
WHERE u.role = 'participant'
GROUP BY u.id
ORDER BY total_lances DESC
LIMIT 10;

-- Receita por categoria
SELECT c.name, SUM(b.amount) as receita
FROM categories c
JOIN items i ON c.id = i.categoryId
JOIN bids b ON i.id = b.itemId
WHERE b.status = 'arrematado'
GROUP BY c.id
ORDER BY receita DESC;
```

### Limpeza
```sql
-- Limpar lances de teste
DELETE FROM bids WHERE userId IN (
  SELECT id FROM users WHERE email LIKE '%teste%'
);

-- Resetar leilão
UPDATE auctions SET status = 'agendado' WHERE id = 'UUID';
UPDATE items SET currentValue = initialValue WHERE auctionId = 'UUID';
DELETE FROM bids WHERE itemId IN (
  SELECT id FROM items WHERE auctionId = 'UUID'
);
```

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

### Resetar MySQL completamente
```sql
DROP DATABASE auction_system;
CREATE DATABASE auction_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Depois:
```powershell
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
      "args": ["-NoExit", "-Command", "cd c:\\Users\\akiri\\Downloads\\qs"]
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

### Erro de conexão MySQL
```powershell
# Verificar se MySQL está rodando
Get-Service MySQL*

# Iniciar MySQL
Start-Service MySQL80
```

### Porta em uso
```powershell
# Alterar porta no .env
PORT=3001

# Ou matar processo
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
```

### TypeORM não sincroniza
```env
# No .env, ative temporariamente:
DB_SYNCHRONIZE=true
```

Reinicie o servidor, depois volte para `false`.

---

**Comandos sempre à mão!** ⚡

Salve este arquivo para consulta rápida.
