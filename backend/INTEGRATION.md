# 📡 Exemplos de Integração

Este arquivo contém exemplos práticos de como integrar com a API do sistema de leilões.

## 🔐 Autenticação

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Login
async function login(email: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  
  const { accessToken } = response.data;
  localStorage.setItem('token', accessToken);
  return accessToken;
}

// Criar instância com token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Python
```python
import requests

API_URL = 'http://localhost:3000/api'

# Login
def login(email, password):
    response = requests.post(f'{API_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    data = response.json()
    return data['accessToken']

token = login('admin@auction.com', 'admin123')

# Usar token
headers = {'Authorization': f'Bearer {token}'}
```

### cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@auction.com","password":"admin123"}'

# Usar token
curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📦 CRUD de Itens

### Listar Itens com Filtros
```typescript
// TypeScript
async function getItems(filters?: {
  search?: string;
  categoryId?: string;
  minValue?: number;
  maxValue?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.minValue) params.append('minValue', filters.minValue.toString());
  if (filters?.maxValue) params.append('maxValue', filters.maxValue.toString());
  
  const response = await api.get(`/items?${params}`);
  return response.data;
}

// Exemplo de uso
const items = await getItems({
  search: 'iphone',
  minValue: 5000,
  maxValue: 10000
});
```

### Criar Item
```typescript
async function createItem(itemData: {
  name: string;
  description: string;
  condition: string;
  initialValue: number;
  minimumIncrement: number;
  categoryId: string;
}) {
  const response = await api.post('/items', itemData);
  return response.data;
}
```

### Upload de Imagens
```typescript
async function uploadImages(itemId: string, files: File[]) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await api.post(`/items/${itemId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
}
```

## 🎯 Sistema de Lances

### Realizar Lance
```typescript
async function placeBid(itemId: string, amount: number) {
  try {
    const response = await api.post('/bids', {
      itemId,
      amount
    });
    
    return {
      success: true,
      bid: response.data
    };
  } catch (error) {
    if (error.response?.status === 409) {
      return {
        success: false,
        error: 'O valor foi alterado. Atualize a página.'
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao dar lance'
    };
  }
}
```

### Incremento Rápido
```typescript
async function quickBid(itemId: string, currentValue: number, increment: number) {
  const newAmount = currentValue + increment;
  return await placeBid(itemId, newAmount);
}

// Uso
const result = await quickBid(itemId, 100000, 5000); // +R$ 5.000
```

### Listar Meus Lances
```typescript
async function getMyBids() {
  const response = await api.get('/bids/my-bids');
  return response.data;
}

// Agrupar por status
function groupBidsByStatus(bids) {
  return {
    winning: bids.filter(b => b.status === 'vencedor'),
    outbid: bids.filter(b => b.status === 'superado'),
    won: bids.filter(b => b.status === 'arrematado'),
  };
}
```

## 🔌 WebSocket em Tempo Real

### React Hook
```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useAuctionSocket(token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3000/auction', {
      auth: { token: `Bearer ${token}` }
    });
    
    newSocket.on('connect', () => {
      console.log('WebSocket conectado');
      setConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('WebSocket desconectado');
      setConnected(false);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, [token]);
  
  return { socket, connected };
}
```

### Componente de Leilão Ao Vivo
```typescript
import React, { useEffect, useState } from 'react';

interface LiveAuctionProps {
  auctionId: string;
  token: string;
}

export function LiveAuction({ auctionId, token }: LiveAuctionProps) {
  const { socket, connected } = useAuctionSocket(token);
  const [currentItem, setCurrentItem] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  
  useEffect(() => {
    if (!socket || !connected) return;
    
    // Entrar no leilão
    socket.emit('auction:join', auctionId);
    
    // Receber estado inicial
    socket.on('auction:state', (auction) => {
      setCurrentItem(auction.currentItem);
    });
    
    // Atualização de timer
    socket.on('timer:update', (data) => {
      setTimeRemaining(data.remainingSeconds);
    });
    
    // Novo lance
    socket.on('bid:new', (bid) => {
      setHighestBid(bid.amount);
      // Tocar som de notificação
      playBidSound();
    });
    
    // Prorrogação (soft close)
    socket.on('timer:extended', (data) => {
      // Mostrar notificação visual
      showNotification('Tempo prorrogado! +15 segundos');
    });
    
    // Usuário foi superado
    socket.on('user:outbid', (data) => {
      showNotification(`Você foi superado no ${data.itemName}!`, 'warning');
    });
    
    return () => {
      socket.emit('auction:leave', auctionId);
    };
  }, [socket, connected, auctionId]);
  
  return (
    <div>
      <h2>Leilão Ao Vivo</h2>
      <div className="timer">
        Tempo restante: {formatTime(timeRemaining)}
      </div>
      <div className="current-bid">
        Lance atual: R$ {highestBid.toFixed(2)}
      </div>
    </div>
  );
}
```

### Vue.js
```javascript
import { io } from 'socket.io-client';
import { ref, onMounted, onUnmounted } from 'vue';

export function useAuction(auctionId, token) {
  const socket = ref(null);
  const timeRemaining = ref(0);
  const currentBid = ref(0);
  
  onMounted(() => {
    socket.value = io('http://localhost:3000/auction', {
      auth: { token: `Bearer ${token}` }
    });
    
    socket.value.emit('auction:join', auctionId);
    
    socket.value.on('timer:update', (data) => {
      timeRemaining.value = data.remainingSeconds;
    });
    
    socket.value.on('bid:new', (bid) => {
      currentBid.value = bid.amount;
    });
  });
  
  onUnmounted(() => {
    socket.value?.emit('auction:leave', auctionId);
    socket.value?.close();
  });
  
  return { timeRemaining, currentBid };
}
```

## 📊 Dashboard e Métricas

### Obter Métricas Gerais
```typescript
async function getDashboardMetrics() {
  const response = await api.get('/dashboard/metrics');
  return response.data;
  // {
  //   activeAuctions: 3,
  //   totalItems: 45,
  //   totalBids: 1250,
  //   totalUsers: 89,
  //   totalRevenue: 2500000
  // }
}
```

### Gráfico de Receita por Categoria
```typescript
async function getRevenueChart() {
  const response = await api.get('/dashboard/revenue/by-category');
  
  // Formatar para Chart.js
  const chartData = {
    labels: response.data.map(item => item.category),
    datasets: [{
      label: 'Receita',
      data: response.data.map(item => item.totalRevenue),
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };
  
  return chartData;
}
```

## 🔔 Notificações

### Escutar Notificações Push
```typescript
if ('Notification' in window && Notification.permission === 'granted') {
  socket.on('user:outbid', (data) => {
    new Notification('Você foi superado!', {
      body: `${data.itemName} - Novo lance: R$ ${data.newAmount}`,
      icon: '/logo.png'
    });
  });
}
```

### Service Worker (PWA)
```typescript
// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

## 🎨 Interface de Lance

### Componente Completo de Lance
```typescript
import React, { useState } from 'react';

interface BidInputProps {
  itemId: string;
  currentValue: number;
  minimumIncrement: number;
  onBidPlaced: (bid: any) => void;
}

export function BidInput({ 
  itemId, 
  currentValue, 
  minimumIncrement,
  onBidPlaced 
}: BidInputProps) {
  const [amount, setAmount] = useState(currentValue + minimumIncrement);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleBid = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await placeBid(itemId, amount);
      
      if (result.success) {
        onBidPlaced(result.bid);
        setAmount(result.bid.amount + minimumIncrement);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao dar lance');
    } finally {
      setLoading(false);
    }
  };
  
  const quickBidOptions = [
    { label: '+R$ 1.000', value: 1000 },
    { label: '+R$ 5.000', value: 5000 },
    { label: '+R$ 10.000', value: 10000 },
  ];
  
  return (
    <div className="bid-input">
      <div className="current-value">
        Valor atual: R$ {currentValue.toLocaleString('pt-BR')}
      </div>
      
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={currentValue + minimumIncrement}
          step={minimumIncrement}
        />
        <button onClick={handleBid} disabled={loading}>
          {loading ? 'Enviando...' : 'Dar Lance'}
        </button>
      </div>
      
      <div className="quick-bids">
        {quickBidOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setAmount(currentValue + option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## 🔍 Busca e Filtros

### Componente de Filtros
```typescript
interface FilterState {
  search: string;
  categoryId: string;
  minValue: number;
  maxValue: number;
}

function ItemFilters({ onFilterChange }: { onFilterChange: (filters: FilterState) => void }) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoryId: '',
    minValue: 0,
    maxValue: 1000000,
  });
  
  const handleChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Buscar..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
      />
      
      <select
        value={filters.categoryId}
        onChange={(e) => handleChange('categoryId', e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {/* Mapear categorias */}
      </select>
      
      <input
        type="number"
        placeholder="Valor mínimo"
        value={filters.minValue}
        onChange={(e) => handleChange('minValue', Number(e.target.value))}
      />
      
      <input
        type="number"
        placeholder="Valor máximo"
        value={filters.maxValue}
        onChange={(e) => handleChange('maxValue', Number(e.target.value))}
      />
    </div>
  );
}
```

---

**Pronto para integrar!** 🚀

Para mais exemplos, consulte a [documentação do Swagger](http://localhost:3000/api/docs).
