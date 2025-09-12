# 🔌 Especificação da API - Sistema Zyra

## 📋 Visão Geral

A API do sistema Zyra é construída com Node.js + Express e utiliza Firebase Firestore como banco de dados. Todas as rotas requerem autenticação via Firebase Auth.

**Base URL**: `https://api.zyra.g2telecom.com/v1`

## 🔐 Autenticação

Todas as requisições devem incluir o token de autenticação no header:

```http
Authorization: Bearer <firebase_token>
```

## 📊 Endpoints da API

### 🏙️ Cidades

#### GET /cidades
Lista todas as cidades cadastradas.

**Query Parameters:**
- `ativa` (boolean, opcional): Filtrar por status ativo
- `estado` (string, opcional): Filtrar por estado
- `limit` (number, opcional): Limite de resultados (padrão: 50)
- `offset` (number, opcional): Offset para paginação

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cidade_001",
      "nome": "São Paulo",
      "estado": "SP",
      "codigoIBGE": "3550308",
      "ativa": true,
      "criadoEm": "2024-01-15T10:00:00Z",
      "atualizadoEm": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### POST /cidades
Cria uma nova cidade.

**Request Body:**
```json
{
  "nome": "São Paulo",
  "estado": "SP",
  "codigoIBGE": "3550308",
  "ativa": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cidade_001",
    "nome": "São Paulo",
    "estado": "SP",
    "codigoIBGE": "3550308",
    "ativa": true,
    "criadoEm": "2024-01-15T10:00:00Z",
    "atualizadoEm": "2024-01-15T10:00:00Z",
    "criadoPor": "admin@G2telecom.com"
  }
}
```

#### PUT /cidades/:id
Atualiza uma cidade existente.

**Request Body:**
```json
{
  "nome": "São Paulo - Capital",
  "ativa": false
}
```

#### DELETE /cidades/:id
Remove uma cidade (soft delete).

### 🏢 Locais

#### GET /locais
Lista todos os locais cadastrados.

**Query Parameters:**
- `cidade` (string, opcional): Filtrar por cidade
- `tipo` (string, opcional): Filtrar por tipo (POP, Torre, Rack, Sala Técnica)
- `ativo` (boolean, opcional): Filtrar por status ativo

**Response:**
```json
{
  "success": true,
  "data": [
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
      "criadoEm": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /locais
Cria um novo local.

**Request Body:**
```json
{
  "nome": "POP Central",
  "cidade": "cidade_001",
  "tipo": "POP",
  "endereco": "Rua das Flores, 123 - Centro",
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "ativo": true
}
```

### 🔧 Tipos de Equipamento

#### GET /tipos-equipamento
Lista todos os tipos de equipamento.

**Query Parameters:**
- `fabricante` (string, opcional): Filtrar por fabricante
- `categoria` (string, opcional): Filtrar por categoria
- `ativo` (boolean, opcional): Filtrar por status ativo

#### POST /tipos-equipamento
Cria um novo tipo de equipamento.

**Request Body:**
```json
{
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
  }
}
```

### 🖥️ Equipamentos

#### GET /equipamentos
Lista todos os equipamentos com filtros avançados.

**Query Parameters:**
- `cidade` (string, opcional): Filtrar por cidade
- `fabricante` (string, opcional): Filtrar por fabricante
- `funcao` (string, opcional): Filtrar por função
- `status` (string, opcional): Filtrar por status
- `modoAcesso` (string, opcional): Filtrar por modo de acesso
- `origem` (string, opcional): Filtrar por origem do sinal
- `dataAquisicaoInicio` (string, opcional): Data início (ISO 8601)
- `dataAquisicaoFim` (string, opcional): Data fim (ISO 8601)
- `limit` (number, opcional): Limite de resultados
- `offset` (number, opcional): Offset para paginação
- `sort` (string, opcional): Campo para ordenação
- `order` (string, opcional): Direção da ordenação (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "equip_001",
      "nome": "Roteador POP Central",
      "modelo": "RB4011iGS+",
      "fabricante": "Mikrotik",
      "serial": "7C4E8D123456",
      "ipPrivado": "192.168.1.1",
      "status": "Ativo",
      "funcao": "Roteador Principal",
      "endereco": {
        "cidade": "São Paulo",
        "endereco": "Rua das Flores, 123"
      },
      "coordenadas": {
        "lat": -23.5505,
        "lng": -46.6333
      },
      "criadoEm": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### GET /equipamentos/:id
Obtém detalhes de um equipamento específico.

**Response:**
```json
{
  "success": true,
  "data": {
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
    "atualizadoEm": "2024-01-15T10:00:00Z"
  }
}
```

#### POST /equipamentos
Cria um novo equipamento.

**Request Body:**
```json
{
  "nome": "Roteador POP Central",
  "modelo": "RB4011iGS+",
  "fabricante": "Mikrotik",
  "serial": "7C4E8D123456",
  "mac": "48:8F:5A:12:34:56",
  "ipPrivado": "192.168.1.1",
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
    "endereco": "Rua das Flores, 123"
  },
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "funcao": "Roteador Principal",
  "status": "Ativo",
  "modoAcesso": "SSH",
  "responsavel": {
    "instalou": "João Silva",
    "mantem": "Maria Santos",
    "contato": "maria@G2telecom.com"
  },
  "fornecedor": {
    "nome": "Distribuidora Tech",
    "contato": "vendas@tech.com",
    "notaFiscal": "NF-2023-001234"
  }
}
```

#### PUT /equipamentos/:id
Atualiza um equipamento existente.

#### DELETE /equipamentos/:id
Remove um equipamento (soft delete).

### 🔗 Links

#### GET /equipamentos/:id/links
Lista todos os links de um equipamento.

#### POST /equipamentos/:id/links
Cria um novo link para um equipamento.

**Request Body:**
```json
{
  "destino": "equip_002",
  "rede": "VLAN 100",
  "capacidade": 1000,
  "ativo": true,
  "portaOrigem": 1,
  "portaDestino": 1,
  "tipo": "Fibra"
}
```

### 📊 Métricas

#### GET /equipamentos/:id/metricas/ping
Obtém métricas de ping de um equipamento.

**Query Parameters:**
- `inicio` (string, opcional): Data início (ISO 8601)
- `fim` (string, opcional): Data fim (ISO 8601)
- `limit` (number, opcional): Limite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ping_001",
      "timestamp": "2024-01-15T10:00:00Z",
      "latencia": 45,
      "perda": 0,
      "status": "Online"
    }
  ]
}
```

#### GET /equipamentos/:id/metricas/interface
Obtém métricas de interface de um equipamento.

#### GET /equipamentos/:id/metricas/recurso
Obtém métricas de recursos de um equipamento.

### 💾 Backups

#### GET /equipamentos/:id/backups
Lista todos os backups de um equipamento.

#### POST /equipamentos/:id/backups
Cria um novo backup para um equipamento.

**Request Body (multipart/form-data):**
```
arquivo: [arquivo]
tipo: "Configuração"
observacoes: "Backup antes da atualização"
```

#### GET /equipamentos/:id/backups/:backupId/download
Download de um arquivo de backup.

### 🚨 Alertas

#### GET /alertas
Lista todos os alertas.

**Query Parameters:**
- `equipamento` (string, opcional): Filtrar por equipamento
- `tipo` (string, opcional): Filtrar por tipo
- `severidade` (string, opcional): Filtrar por severidade
- `status` (string, opcional): Filtrar por status
- `inicio` (string, opcional): Data início
- `fim` (string, opcional): Data fim

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alerta_001",
      "equipamento": "equip_001",
      "tipo": "Ping Alto",
      "severidade": "Média",
      "mensagem": "Latência acima do limite configurado",
      "status": "Ativo",
      "valor": 200,
      "limite": 150,
      "criadoEm": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### PUT /alertas/:id/resolver
Marca um alerta como resolvido.

**Request Body:**
```json
{
  "observacoes": "Problema resolvido reiniciando o equipamento"
}
```

### ⚙️ Configurações

#### GET /configuracoes
Obtém as configurações do sistema.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "config_001",
    "tempoPing": 300,
    "limiteLatencia": 150,
    "diasSemBackup": 30,
    "timeoutConexao": 30,
    "retryAttempts": 3,
    "limites": {
      "cpu": 80,
      "memoria": 85,
      "temperatura": 70,
      "trafego": 90
    },
    "atualizadoEm": "2024-01-15T10:00:00Z"
  }
}
```

#### PUT /configuracoes
Atualiza as configurações do sistema.

**Request Body:**
```json
{
  "tempoPing": 300,
  "limiteLatencia": 150,
  "diasSemBackup": 30,
  "limites": {
    "cpu": 80,
    "memoria": 85,
    "temperatura": 70,
    "trafego": 90
  }
}
```

### 📈 Dashboard

#### GET /dashboard
Obtém dados para o dashboard principal.

**Response:**
```json
{
  "success": true,
  "data": {
    "resumo": {
      "totalEquipamentos": 150,
      "equipamentosAtivos": 145,
      "equipamentosOffline": 5,
      "alertasAtivos": 3,
      "backupsPendentes": 8
    },
    "equipamentosPorTipo": [
      {
        "tipo": "Switch",
        "quantidade": 45
      },
      {
        "tipo": "Roteador",
        "quantidade": 12
      }
    ],
    "equipamentosPorStatus": [
      {
        "status": "Ativo",
        "quantidade": 145
      },
      {
        "status": "Em Manutenção",
        "quantidade": 3
      }
    ],
    "pingMedio": 45,
    "alertasRecentes": [
      {
        "id": "alerta_001",
        "equipamento": "Roteador POP Central",
        "tipo": "Ping Alto",
        "severidade": "Média",
        "criadoEm": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### 🗺️ Topologia

#### GET /topologia
Obtém a topologia completa da rede.

**Response:**
```json
{
  "success": true,
  "data": {
    "equipamentos": [
      {
        "id": "equip_001",
        "nome": "Roteador POP Central",
        "tipo": "Roteador",
        "status": "Ativo",
        "coordenadas": {
          "lat": -23.5505,
          "lng": -46.6333
        }
      }
    ],
    "links": [
      {
        "id": "link_001",
        "origem": "equip_001",
        "destino": "equip_002",
        "capacidade": 1000,
        "ativo": true,
        "tipo": "Fibra"
      }
    ]
  }
}
```

#### PUT /topologia/links/:id
Atualiza um link da topologia.

## 📤 Upload de Arquivos

### POST /upload/equipamentos/:id/fotos
Upload de fotos de equipamentos.

**Request Body (multipart/form-data):**
```
fotos: [arquivos]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fotos": [
      "equipamentos/equip_001/foto1.jpg",
      "equipamentos/equip_001/foto2.jpg"
    ]
  }
}
```

## 🔍 Busca

### GET /busca
Busca global no sistema.

**Query Parameters:**
- `q` (string, obrigatório): Termo de busca
- `tipo` (string, opcional): Tipo de resultado (equipamentos, alertas, backups)

**Response:**
```json
{
  "success": true,
  "data": {
    "equipamentos": [
      {
        "id": "equip_001",
        "nome": "Roteador POP Central",
        "modelo": "RB4011iGS+",
        "fabricante": "Mikrotik"
      }
    ],
    "alertas": [],
    "backups": []
  }
}
```

## 📊 Relatórios

### GET /relatorios/equipamentos
Gera relatório de equipamentos.

**Query Parameters:**
- `formato` (string, opcional): Formato do relatório (pdf, excel, csv)
- `filtros` (object, opcional): Filtros para o relatório

### GET /relatorios/alertas
Gera relatório de alertas.

### GET /relatorios/backups
Gera relatório de backups.

## 🚫 Códigos de Erro

### 400 - Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": [
      {
        "field": "nome",
        "message": "Nome é obrigatório"
      }
    ]
  }
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticação inválido ou expirado"
  }
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Acesso negado"
  }
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado"
  }
}
```

### 409 - Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Recurso já existe",
    "details": {
      "field": "ipPrivado",
      "value": "192.168.1.1"
    }
  }
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Erro interno do servidor"
  }
}
```

## 📝 Rate Limiting

- **Limite**: 1000 requisições por hora por usuário
- **Header de resposta**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🔄 Paginação

Todas as listas suportam paginação:

**Query Parameters:**
- `limit`: Número de itens por página (padrão: 50, máximo: 100)
- `offset`: Número de itens a pular (padrão: 0)

**Response Headers:**
- `X-Total-Count`: Total de itens
- `X-Page-Size`: Tamanho da página
- `X-Page-Offset`: Offset atual

## 📅 Versionamento

A API utiliza versionamento por URL:
- Versão atual: `v1`
- Versões futuras: `v2`, `v3`, etc.

## 🔒 Segurança

- **HTTPS**: Obrigatório em produção
- **CORS**: Configurado para domínios específicos
- **Validação**: Todos os inputs são validados
- **Sanitização**: Dados são sanitizados antes do armazenamento
- **Logs**: Todas as operações são logadas

---

Esta especificação da API garante uma integração consistente e segura com o sistema Zyra.
