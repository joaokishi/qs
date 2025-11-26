# 📁 Estrutura do Projeto

## Árvore de Diretórios

```
c:\Users\akiri\Downloads\qs\
├── src/                              # Código fonte
│   ├── common/                       # Recursos compartilhados
│   │   └── enums/                    # Enumerações
│   │       ├── auction.enum.ts       # Status do leilão
│   │       ├── bid.enum.ts           # Status do lance
│   │       ├── item.enum.ts          # Condição do item
│   │       ├── user.enum.ts          # Roles e status do usuário
│   │       └── audit.enum.ts         # Ações de auditoria
│   │
│   ├── config/                       # Configurações
│   │   └── typeorm.config.ts         # Config do banco de dados
│   │
│   ├── modules/                      # Módulos da aplicação
│   │   │
│   │   ├── auth/                     # Autenticação e Autorização
│   │   │   ├── decorators/           # Decorators personalizados
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── dto/                  # Data Transfer Objects
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── guards/               # Guards de proteção
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── strategies/           # Estratégias do Passport
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.controller.ts    # Endpoints de auth
│   │   │   ├── auth.service.ts       # Lógica de negócio
│   │   │   └── auth.module.ts        # Módulo do NestJS
│   │   │
│   │   ├── users/                    # Gestão de Usuários
│   │   │   ├── user.entity.ts        # Entidade do banco
│   │   │   ├── users.controller.ts   # Endpoints
│   │   │   ├── users.service.ts      # Lógica de negócio
│   │   │   └── users.module.ts       # Módulo
│   │   │
│   │   ├── categories/               # Categorias de Itens
│   │   │   ├── dto/
│   │   │   │   ├── create-category.dto.ts
│   │   │   │   └── update-category.dto.ts
│   │   │   ├── category.entity.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── categories.module.ts
│   │   │
│   │   ├── items/                    # Itens do Leilão
│   │   │   ├── dto/
│   │   │   │   ├── create-item.dto.ts
│   │   │   │   ├── update-item.dto.ts
│   │   │   │   └── filter-item.dto.ts
│   │   │   ├── item.entity.ts
│   │   │   ├── items.controller.ts   # Inclui upload de imagens
│   │   │   ├── items.service.ts      # Inclui Sharp para otimização
│   │   │   └── items.module.ts
│   │   │
│   │   ├── auctions/                 # Gestão de Leilões
│   │   │   ├── dto/
│   │   │   │   ├── create-auction.dto.ts
│   │   │   │   └── update-auction.dto.ts
│   │   │   ├── auction.entity.ts
│   │   │   ├── auction.gateway.ts    # WebSocket em tempo real
│   │   │   ├── auctions.controller.ts
│   │   │   ├── auctions.service.ts   # Inclui cron jobs
│   │   │   └── auctions.module.ts
│   │   │
│   │   ├── bids/                     # Sistema de Lances
│   │   │   ├── dto/
│   │   │   │   └── create-bid.dto.ts
│   │   │   ├── bid.entity.ts
│   │   │   ├── bids.controller.ts
│   │   │   ├── bids.service.ts       # Controle de concorrência
│   │   │   └── bids.module.ts
│   │   │
│   │   ├── audit/                    # Logs de Auditoria
│   │   │   ├── audit-log.entity.ts
│   │   │   ├── audit.controller.ts
│   │   │   ├── audit.service.ts
│   │   │   └── audit.module.ts
│   │   │
│   │   ├── dashboard/                # Métricas e Relatórios
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.module.ts
│   │   │
│   │   └── notifications/            # Envio de E-mails
│   │       ├── notifications.service.ts
│   │       └── notifications.module.ts
│   │
│   ├── app.module.ts                 # Módulo raiz da aplicação
│   ├── main.ts                       # Ponto de entrada
│   └── seed.ts                       # Script de seed do banco
│
├── uploads/                          # Arquivos enviados
│   └── items/                        # Imagens dos itens
│
├── test/                             # Testes
│   └── jest-e2e.json                 # Config de testes E2E
│
├── .env                              # Variáveis de ambiente (não commitado)
├── .env.example                      # Exemplo de variáveis
├── .gitignore                        # Arquivos ignorados pelo Git
├── docker-compose.yml                # Configuração do Docker
├── Dockerfile                        # Imagem Docker do backend
├── nest-cli.json                     # Configuração do NestJS CLI
├── package.json                      # Dependências e scripts
├── tsconfig.json                     # Configuração do TypeScript
├── README.md                         # Documentação principal
├── QUICKSTART.md                     # Guia de início rápido
├── INTEGRATION.md                    # Exemplos de integração
├── CHEATSHEET.md                     # Comandos úteis
└── PROJECT-STRUCTURE.md              # Este arquivo
```

## 📦 Dependências Principais

### Produção
- **@nestjs/core** - Framework base
- **@nestjs/typeorm** - Integração TypeORM
- **@nestjs/jwt** - Autenticação JWT
- **@nestjs/websockets** - WebSocket
- **@nestjs/schedule** - Cron jobs
- **typeorm** - ORM
- **mysql2** - Driver MySQL
- **bcrypt** - Criptografia de senhas
- **class-validator** - Validação
- **class-transformer** - Transformação de dados
- **sharp** - Processamento de imagens
- **nodemailer** - Envio de e-mails
- **socket.io** - WebSocket

### Desenvolvimento
- **@nestjs/cli** - CLI do NestJS
- **typescript** - TypeScript
- **ts-node** - Executar TypeScript
- **jest** - Testes
- **eslint** - Linter
- **prettier** - Formatação

## 🎯 Módulos e Responsabilidades

### Auth Module
- **Função**: Autenticação e autorização
- **Features**: 
  - Login/Registro
  - JWT tokens
  - Guards de proteção
  - Roles (admin/participant)

### Users Module
- **Função**: Gestão de usuários
- **Features**:
  - Listar usuários (admin)
  - Bloquear/desbloquear
  - Perfil do usuário

### Categories Module
- **Função**: Categorias de itens
- **Features**:
  - CRUD completo
  - Listagem pública
  - Gestão (admin)

### Items Module
- **Função**: Itens a serem leiloados
- **Features**:
  - CRUD de itens
  - Upload de imagens (Sharp)
  - Busca e filtros
  - Vinculação a leilões

### Auctions Module
- **Função**: Gestão de leilões
- **Features**:
  - Criar/editar leilões (validação 30min)
  - Iniciar/encerrar
  - Controle de item atual (timers sincronizados)
  - Cron jobs automáticos
  - WebSocket (tempo real)

### Bids Module
- **Função**: Sistema de lances
- **Features**:
  - Realizar lances
  - Validação de incremento
  - Controle de concorrência
  - Histórico de lances (Dashboard "Meus Lances")
  - Cancelamento (admin)

### Audit Module
- **Função**: Logs imutáveis
- **Features**:
  - Registro de ações
  - Consulta de logs
  - Rastreabilidade

### Dashboard Module
- **Função**: Métricas e relatórios
- **Features**:
  - Métricas gerais
  - Top itens
  - Receita por categoria
  - Top participantes

### Notifications Module
- **Função**: Notificações
- **Features**:
  - E-mail quando superado
  - E-mail quando arrematou
  - Notificações de leilão

## 🔐 Fluxo de Autenticação

```
Cliente → POST /auth/login → AuthController
                                    ↓
                              AuthService
                                    ↓
                        Valida credenciais (bcrypt)
                                    ↓
                        Gera JWT token (JwtService)
                                    ↓
                    Retorna token + dados do usuário
                                    ↓
Cliente armazena token → Requisições subsequentes
                                    ↓
                        Header: Authorization: Bearer TOKEN
                                    ↓
                              JwtAuthGuard
                                    ↓
                              JwtStrategy
                                    ↓
                        Valida token e busca usuário
                                    ↓
                        Injeta usuário na requisição
                                    ↓
                            RolesGuard (se necessário)
                                    ↓
                        Verifica role do usuário
                                    ↓
                            Controller/Service
```

## 🔄 Fluxo de Lance

```
Cliente → POST /bids → BidsController
                            ↓
                      BidsService
                            ↓
              Inicia transação (DataSource)
                            ↓
        Busca item com lock pessimista
                            ↓
              Valida se leilão está ativo
                            ↓
        Valida incremento mínimo
                            ↓
    Verifica conflitos (outro lance simultâneo)
                            ↓
        Marca lances anteriores como superados
                            ↓
              Cria novo lance
                            ↓
        Atualiza valor atual do item
                            ↓
              Commit da transação
                            ↓
    Emite evento WebSocket (AuctionGateway)
                            ↓
    Notifica todos os clientes conectados
                            ↓
    Envia e-mail ao usuário superado
```

## 🌐 WebSocket Events

### Cliente → Servidor
- `auction:join` - Entrar em um leilão
- `auction:leave` - Sair de um leilão
- `item:join` - Observar um item específico

### Servidor → Cliente
- `auctions:active` - Lista de leilões ativos
- `auction:state` - Estado do leilão ao entrar
- `bid:new` - Novo lance realizado
- `bid:cancelled` - Lance cancelado
- `item:updated` - Item atualizado
- `timer:update` - Atualização do cronômetro
- `timer:extended` - Tempo prorrogado (soft close)
- `item:changed` - Mudança de item
- `auction:ended` - Leilão encerrado
- `user:outbid` - Usuário foi superado

## 📊 Entidades e Relacionamentos

```
User
├── 1:N → Bid (lances do usuário)
└── role: admin | participant

Category
└── 1:N → Item (itens da categoria)

Item
├── N:1 → Category (categoria do item)
├── N:1 → Auction (leilão do item)
└── 1:N → Bid (lances do item)

Auction
├── 1:N → Item (itens do leilão)
├── currentItemId (item sendo leiloado)
└── status: scheduled | active | completed | cancelled

Bid
├── N:1 → User (quem deu o lance)
├── N:1 → Item (item do lance)
└── status: valid | winning | outbid | won | cancelled

AuditLog
└── userId (opcional)
```

## 🛡️ Segurança

### Implementações
1. **Senhas**: Bcrypt com 10 salt rounds
2. **JWT**: Tokens com expiração configurável
3. **Guards**: JwtAuthGuard + RolesGuard
4. **CORS**: Configurado para origens permitidas
5. **Helmet**: Headers de segurança
6. **Validation**: Class-validator em todos os DTOs
7. **SQL Injection**: Protegido pelo TypeORM
8. **Race Conditions**: Locks pessimistas

### Headers de Segurança (Helmet)
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security

## 🚀 Performance

### Otimizações
1. **Imagens**: Sharp para resize e otimização
2. **Índices**: Criados em campos de busca
3. **Eager Loading**: Relations carregadas quando necessário
4. **Caching**: Considerado para futuras implementações
5. **WebSocket**: Conexões mantidas com baixo overhead

## 📈 Escalabilidade

### Considerações
- **Horizontal**: Stateless (pode adicionar mais instâncias)
- **Database**: Índices e queries otimizadas
- **WebSocket**: Socket.IO com suporte a Redis (futuro)
- **Upload**: Pode ser movido para S3/CDN
- **Cache**: Redis pode ser adicionado

---

**Estrutura completa e organizada!** 📁
