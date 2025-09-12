# 🗄️ Modelo de Dados - Sistema Zyra

## 📊 Estrutura Completa do Banco de Dados Firebase Firestore

### 🏙️ Coleção: `cidades`

```typescript
interface Cidade {
  id: string;
  nome: string;
  estado: string;
  codigoIBGE: string;
  ativa: boolean;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  criadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "cidade_001",
  "nome": "São Paulo",
  "estado": "SP",
  "codigoIBGE": "3550308",
  "ativa": true,
  "criadoEm": "2024-01-15T10:00:00Z",
  "atualizadoEm": "2024-01-15T10:00:00Z",
  "criadoPor": "admin@G2telecom.com"
}
```

### 🏢 Coleção: `locais`

```typescript
interface Local {
  id: string;
  nome: string;
  cidade: string; // Referência para cidades
  tipo: 'POP' | 'Torre' | 'Rack' | 'Sala Técnica';
  endereco: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  ativo: boolean;
  observacoes?: string;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  criadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "local_001",
  "nome": "POP Central",
  "cidade": "cidade_001",
  "tipo": "POP",
  "endereco": "Rua das Flores, 123 - Centro",
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "ativo": true,
  "observacoes": "Prédio principal da operação",
  "criadoEm": "2024-01-15T10:00:00Z",
  "atualizadoEm": "2024-01-15T10:00:00Z",
  "criadoPor": "admin@G2telecom.com"
}
```

### 🔧 Coleção: `tiposEquipamento`

```typescript
interface TipoEquipamento {
  id: string;
  nome: string;
  fabricante: string;
  categoria: 'OLT' | 'ONU' | 'Switch' | 'Roteador' | 'Rádio' | 'Firewall' | 'Servidor';
  portas: number;
  ativo: boolean;
  especificacoes?: {
    consumo: number;
    tensao: string;
    temperatura: {
      min: number;
      max: number;
    };
  };
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  criadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "tipo_001",
  "nome": "RB4011iGS+",
  "fabricante": "Mikrotik",
  "categoria": "Roteador",
  "portas": 11,
  "ativo": true,
  "especificacoes": {
    "consumo": 24,
    "tensao": "24V DC",
    "temperatura": {
      "min": -40,
      "max": 70
    }
  },
  "criadoEm": "2024-01-15T10:00:00Z",
  "atualizadoEm": "2024-01-15T10:00:00Z",
  "criadoPor": "admin@G2telecom.com"
}
```

### 🖥️ Coleção: `equipamentos`

```typescript
interface Equipamento {
  id: string;
  nome: string;
  modelo: string;
  fabricante: string;
  serial: string;
  mac: string;
  ipPublico?: string;
  ipPrivado: string;
  fotos: string[]; // URLs do Firebase Storage
  portas: number;
  alimentacao: {
    tipo: 'AC' | 'DC';
    tensao: string;
    consumo: number;
  };
  dataAquisicao: Timestamp;
  garantia: number; // meses
  firmware: string;
  endereco: {
    cidade: string;
    endereco: string;
    torre?: string;
    salaTecnica?: string;
    rack?: string;
    posicaoRack?: string;
  };
  coordenadas: {
    lat: number;
    lng: number;
  };
  funcao: string;
  status: 'Ativo' | 'Em Manutenção' | 'Reserva' | 'Descartado' | 'Em Teste';
  observacoes?: string;
  portaAcesso?: number;
  modoAcesso: 'SSH' | 'Web' | 'Telnet' | 'Winbox' | 'SNMP' | 'API';
  responsavel: {
    instalou: string;
    mantem: string;
    contato: string;
  };
  fornecedor: {
    nome: string;
    contato: string;
    notaFiscal: string;
    contrato?: string;
  };
  monitoramento: {
    ativo: boolean;
    tempoPing: number; // segundos
    limiteLatencia: number; // ms
    snmp: {
      comunidade: string;
      porta: number;
    };
  };
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  criadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "equip_001",
  "nome": "Roteador POP Central",
  "modelo": "RB4011iGS+",
  "fabricante": "Mikrotik",
  "serial": "7C4E8D123456",
  "mac": "48:8F:5A:12:34:56",
  "ipPublico": "200.160.1.10",
  "ipPrivado": "192.168.1.1",
  "fotos": [
    "equipamentos/equip_001/foto1.jpg",
    "equipamentos/equip_001/foto2.jpg"
  ],
  "portas": 11,
  "alimentacao": {
    "tipo": "DC",
    "tensao": "24V",
    "consumo": 24
  },
  "dataAquisicao": "2023-06-15T00:00:00Z",
  "garantia": 24,
  "firmware": "7.11.2",
  "endereco": {
    "cidade": "São Paulo",
    "endereco": "Rua das Flores, 123",
    "torre": "Torre A",
    "salaTecnica": "Sala 01",
    "rack": "Rack 01",
    "posicaoRack": "U10"
  },
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "funcao": "Roteador Principal",
  "status": "Ativo",
  "observacoes": "Equipamento principal do POP",
  "portaAcesso": 22,
  "modoAcesso": "SSH",
  "responsavel": {
    "instalou": "João Silva",
    "mantem": "Maria Santos",
    "contato": "maria@G2telecom.com"
  },
  "fornecedor": {
    "nome": "Distribuidora Tech",
    "contato": "vendas@tech.com",
    "notaFiscal": "NF-2023-001234",
    "contrato": "CT-2023-001"
  },
  "monitoramento": {
    "ativo": true,
    "tempoPing": 300,
    "limiteLatencia": 150,
    "snmp": {
      "comunidade": "public",
      "porta": 161
    }
  },
  "criadoEm": "2024-01-15T10:00:00Z",
  "atualizadoEm": "2024-01-15T10:00:00Z",
  "criadoPor": "admin@G2telecom.com"
}
```

### 🔗 Subcoleção: `equipamentos/{id}/links`

```typescript
interface Link {
  id: string;
  origem: string; // ID do equipamento origem
  destino: string; // ID do equipamento destino
  rede: string; // VLAN, Sub-rede, etc.
  capacidade: number; // Mbps
  ativo: boolean;
  portaOrigem?: number;
  portaDestino?: number;
  tipo: 'Fibra' | 'Cobre' | 'Rádio' | 'Wireless';
  observacoes?: string;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  criadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "link_001",
  "origem": "equip_001",
  "destino": "equip_002",
  "rede": "VLAN 100",
  "capacidade": 1000,
  "ativo": true,
  "portaOrigem": 1,
  "portaDestino": 1,
  "tipo": "Fibra",
  "observacoes": "Link principal entre POPs",
  "criadoEm": "2024-01-15T10:00:00Z",
  "atualizadoEm": "2024-01-15T10:00:00Z",
  "criadoPor": "admin@G2telecom.com"
}
```

### 📊 Subcoleção: `equipamentos/{id}/metricasPing`

```typescript
interface MetricaPing {
  id: string;
  timestamp: Timestamp;
  latencia: number; // ms
  perda: number; // %
  status: 'Online' | 'Offline' | 'Timeout';
  coletadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "ping_001",
  "timestamp": "2024-01-15T10:00:00Z",
  "latencia": 45,
  "perda": 0,
  "status": "Online",
  "coletadoPor": "sistema"
}
```

### 📈 Subcoleção: `equipamentos/{id}/metricasInterface`

```typescript
interface MetricaInterface {
  id: string;
  timestamp: Timestamp;
  interface: string; // Nome da interface
  trafegoIn: number; // Bytes/s
  trafegoOut: number; // Bytes/s
  status: 'Up' | 'Down' | 'Unknown';
  coletadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "interface_001",
  "timestamp": "2024-01-15T10:00:00Z",
  "interface": "ether1",
  "trafegoIn": 1024000,
  "trafegoOut": 2048000,
  "status": "Up",
  "coletadoPor": "sistema"
}
```

### 💻 Subcoleção: `equipamentos/{id}/metricasRecurso`

```typescript
interface MetricaRecurso {
  id: string;
  timestamp: Timestamp;
  cpu: number; // %
  memoria: {
    total: number; // MB
    usada: number; // MB
    livre: number; // MB
  };
  temperatura?: number; // °C
  uptime: number; // segundos
  coletadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "recurso_001",
  "timestamp": "2024-01-15T10:00:00Z",
  "cpu": 25,
  "memoria": {
    "total": 1024,
    "usada": 512,
    "livre": 512
  },
  "temperatura": 45,
  "uptime": 86400,
  "coletadoPor": "sistema"
}
```

### 💾 Subcoleção: `equipamentos/{id}/backups`

```typescript
interface Backup {
  id: string;
  nome: string;
  arquivo: string; // Path no Firebase Storage
  tipo: 'Configuração' | 'Firmware' | 'Logs' | 'Outros';
  tamanho: number; // bytes
  hash: string; // MD5 ou SHA256
  data: Timestamp;
  responsavel: string;
  observacoes?: string;
  versao?: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "backup_001",
  "nome": "backup_config_20240115",
  "arquivo": "backups/equip_001/config_20240115.rsc",
  "tipo": "Configuração",
  "tamanho": 1024000,
  "hash": "a1b2c3d4e5f6...",
  "data": "2024-01-15T10:00:00Z",
  "responsavel": "João Silva",
  "observacoes": "Backup antes da atualização",
  "versao": "7.11.2"
}
```

### 🚨 Coleção: `alertas`

```typescript
interface Alerta {
  id: string;
  equipamento: string; // Referência para equipamento
  tipo: 'Ping Alto' | 'CPU Alta' | 'Memória Baixa' | 'Temperatura Alta' | 'Equipamento Offline' | 'Backup Pendente';
  severidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  mensagem: string;
  status: 'Ativo' | 'Resolvido' | 'Ignorado';
  valor: number; // Valor que gerou o alerta
  limite: number; // Limite configurado
  criadoEm: Timestamp;
  resolvidoEm?: Timestamp;
  resolvidoPor?: string;
  notificacoes: {
    email: boolean;
    telegram: boolean;
    whatsapp: boolean;
  };
}
```

**Exemplo de documento:**
```json
{
  "id": "alerta_001",
  "equipamento": "equip_001",
  "tipo": "Ping Alto",
  "severidade": "Média",
  "mensagem": "Latência acima do limite configurado",
  "status": "Ativo",
  "valor": 200,
  "limite": 150,
  "criadoEm": "2024-01-15T10:00:00Z",
  "notificacoes": {
    "email": true,
    "telegram": true,
    "whatsapp": false
  }
}
```

### ⚙️ Coleção: `configuracoes`

```typescript
interface Configuracao {
  id: string;
  tempoPing: number; // segundos
  limiteLatencia: number; // ms
  diasSemBackup: number;
  timeoutConexao: number; // segundos
  retryAttempts: number;
  notificacoes: {
    email: {
      ativo: boolean;
      smtp: string;
      porta: number;
      usuario: string;
      destinatarios: string[];
    };
    telegram: {
      ativo: boolean;
      botToken: string;
      chatId: string;
    };
    whatsapp: {
      ativo: boolean;
      webhook: string;
    };
  };
  limites: {
    cpu: number; // %
    memoria: number; // %
    temperatura: number; // °C
    trafego: number; // %
  };
  atualizadoEm: Timestamp;
  atualizadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "config_001",
  "tempoPing": 300,
  "limiteLatencia": 150,
  "diasSemBackup": 30,
  "timeoutConexao": 30,
  "retryAttempts": 3,
  "notificacoes": {
    "email": {
      "ativo": true,
      "smtp": "smtp.gmail.com",
      "porta": 587,
      "usuario": "alertas@G2telecom.com",
      "destinatarios": ["admin@G2telecom.com", "suporte@G2telecom.com"]
    },
    "telegram": {
      "ativo": true,
      "botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
      "chatId": "-1001234567890"
    },
    "whatsapp": {
      "ativo": false,
      "webhook": ""
    }
  },
  "limites": {
    "cpu": 80,
    "memoria": 85,
    "temperatura": 70,
    "trafego": 90
  },
  "atualizadoEm": "2024-01-15T10:00:00Z",
  "atualizadoPor": "admin@G2telecom.com"
}
```

### 👤 Coleção: `usuarios`

```typescript
interface Usuario {
  id: string;
  email: string;
  nome: string;
  cargo: string;
  ativo: boolean;
  ultimoAcesso: Timestamp;
  criadoEm: Timestamp;
  criadoPor: string;
}
```

**Exemplo de documento:**
```json
{
  "id": "user_001",
  "email": "admin@G2telecom.com",
  "nome": "Administrador",
  "cargo": "Administrador de Sistema",
  "ativo": true,
  "ultimoAcesso": "2024-01-15T10:00:00Z",
  "criadoEm": "2024-01-15T10:00:00Z",
  "criadoPor": "system"
}
```

## 🔍 Índices Recomendados

### Índices Compostos
```javascript
// Equipamentos por cidade e status
equipamentos: [cidade, status]

// Equipamentos por fabricante e tipo
equipamentos: [fabricante, funcao]

// Alertas por equipamento e status
alertas: [equipamento, status]

// Métricas por equipamento e timestamp
metricasPing: [equipamento, timestamp]
metricasInterface: [equipamento, timestamp]
metricasRecurso: [equipamento, timestamp]
```

### Índices Simples
```javascript
// Campos frequentemente consultados
equipamentos: [ipPrivado, serial, mac]
alertas: [tipo, severidade, criadoEm]
backups: [data, tipo]
```

## 📋 Regras de Negócio

### Validações
- **IPs únicos**: Não pode haver dois equipamentos com o mesmo IP privado
- **Seriais únicos**: Cada equipamento deve ter um serial único
- **Coordenadas válidas**: Latitude entre -90 e 90, longitude entre -180 e 180
- **Datas consistentes**: Data de aquisição não pode ser futura
- **Status válidos**: Apenas valores predefinidos são aceitos

### Relacionamentos
- **Cidade → Locais**: Uma cidade pode ter múltiplos locais
- **Local → Equipamentos**: Um local pode ter múltiplos equipamentos
- **Equipamento → Links**: Um equipamento pode ter múltiplos links
- **Equipamento → Métricas**: Um equipamento gera múltiplas métricas
- **Equipamento → Backups**: Um equipamento pode ter múltiplos backups

### Segurança
- **Autenticação**: Firebase Auth obrigatório
- **Autorização**: Todos os usuários têm acesso completo (sem roles)
- **Auditoria**: Log de todas as alterações
- **Backup**: Backup automático das configurações críticas

---

Este modelo de dados garante a integridade e performance do sistema Zyra, permitindo consultas eficientes e manutenção simplificada dos dados.
