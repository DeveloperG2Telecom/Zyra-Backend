# 🚀 Backend Zyra - Sistema de Documentação e Monitoramento de Equipamentos

## 📋 Visão Geral

Backend do sistema Zyra desenvolvido para a G2 Telecom, com autenticação JWT, roles (admin/user) e integração com Firebase Firestore.

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Firebase Firestore** - Banco de dados NoSQL
- **JWT** - Autenticação e autorização
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   ├── firebase.js      # Configuração do Firebase
│   │   └── database.js      # Funções auxiliares do banco
│   ├── middleware/
│   │   ├── auth.js          # Middleware de autenticação
│   │   ├── errorHandler.js  # Tratamento de erros
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── validation.js    # Validação de dados
│   ├── models/
│   │   ├── User.js          # Modelo de usuário
│   │   ├── Equipamento.js   # Modelo de equipamento
│   │   └── Cidade.js        # Modelo de cidade
│   ├── routes/
│   │   ├── auth.js          # Rotas de autenticação
│   │   ├── equipamentos.js  # Rotas de equipamentos
│   │   ├── cidades.js       # Rotas de cidades
│   │   └── dashboard.js     # Rotas do dashboard
│   ├── app.js               # Configuração da aplicação
│   └── server.js            # Servidor principal
├── package.json
├── env.example              # Exemplo de variáveis de ambiente
└── README.md
```

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cp env.example .env
```

### 3. Configurar Firebase

1. Crie um projeto no Firebase Console
2. Gere uma chave de serviço (Service Account)
3. Configure as variáveis de ambiente no arquivo `.env`

### 4. Executar o Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🔐 Autenticação

### Roles Disponíveis

- **admin**: Acesso completo ao sistema
- **user**: Acesso limitado (padrão)

### Endpoints de Autenticação

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `GET /api/v1/auth/me` - Dados do usuário logado
- `PUT /api/v1/auth/me` - Atualizar dados do usuário
- `POST /api/v1/auth/logout` - Logout

### Exemplo de Login

```json
POST /api/v1/auth/login
{
  "email": "admin@G2telecom.com",
  "senha": "123456"
}
```

### Resposta

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "nome": "Administrador",
      "email": "admin@G2telecom.com",
      "role": "admin",
      "ativo": true
    },
    "token": "jwt_token_here"
  }
}
```

## 📊 API Endpoints

### Equipamentos

- `GET /api/v1/equipamentos` - Listar equipamentos
- `GET /api/v1/equipamentos/:id` - Buscar equipamento por ID
- `POST /api/v1/equipamentos` - Criar equipamento
- `PUT /api/v1/equipamentos/:id` - Atualizar equipamento
- `DELETE /api/v1/equipamentos/:id` - Deletar equipamento
- `GET /api/v1/equipamentos/stats` - Estatísticas
- `GET /api/v1/equipamentos/search/:term` - Buscar equipamentos

### Cidades

- `GET /api/v1/cidades` - Listar cidades
- `GET /api/v1/cidades/:id` - Buscar cidade por ID
- `POST /api/v1/cidades` - Criar cidade
- `PUT /api/v1/cidades/:id` - Atualizar cidade
- `DELETE /api/v1/cidades/:id` - Deletar cidade
- `GET /api/v1/cidades/estado/:estado` - Buscar por estado
- `GET /api/v1/cidades/ativas` - Buscar cidades ativas

### Dashboard

- `GET /api/v1/dashboard` - Dados do dashboard
- `GET /api/v1/dashboard/stats` - Estatísticas detalhadas

## 🔒 Segurança

### Middlewares de Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de origens permitidas
- **Rate Limiting**: Limitação de requisições
- **JWT**: Autenticação baseada em tokens
- **bcryptjs**: Hash seguro de senhas

### Rate Limiting

- **Autenticação**: 5 tentativas por 15 minutos
- **API Geral**: 100 requisições por 15 minutos
- **Criação**: 10 criações por minuto

## 📝 Validação de Dados

Todos os dados são validados usando Joi com schemas específicos:

- **Usuário**: Nome, email, senha, role
- **Equipamento**: Dados técnicos completos
- **Cidade**: Nome, estado, código IBGE

## 🗄️ Banco de Dados

### Coleções Firebase Firestore

- `users` - Usuários do sistema
- `equipamentos` - Equipamentos de rede
- `cidades` - Cidades atendidas
- `locais` - POPs, torres, racks
- `tiposEquipamento` - Tipos de equipamentos
- `alertas` - Eventos e alertas
- `configuracoes` - Configurações do sistema

### Estrutura de Dados

Cada documento inclui:
- `criadoEm`: Timestamp de criação
- `atualizadoEm`: Timestamp de atualização
- `criadoPor`: Email do usuário que criou
- `ativo`: Status ativo/inativo (soft delete)

## 🚨 Tratamento de Erros

### Códigos de Erro

- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (recurso já existe)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

### Formato de Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro",
    "details": []
  }
}
```

## 📊 Logs

O sistema registra:
- Requisições HTTP (método, path, timestamp)
- Erros não capturados
- Operações de banco de dados

## 🔄 Desenvolvimento

### Scripts Disponíveis

```bash
npm start          # Executar em produção
npm run dev        # Executar em desenvolvimento
npm test           # Executar testes
```

### Variáveis de Ambiente

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=your-client-email

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📈 Próximos Passos

1. **Sistema de Alertas**: Implementar monitoramento e alertas
2. **Gestão de Backups**: Sistema de upload e controle de backups
3. **Métricas**: Coleta de dados via SNMP/SSH
4. **Relatórios**: Geração de relatórios em PDF/Excel
5. **Notificações**: Integração com Telegram/WhatsApp

## 🤝 Contribuição

1. Siga as convenções de código
2. Documente suas alterações
3. Teste antes de fazer commit
4. Use branches para features

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento da G2 Telecom.

---

**Desenvolvido por**: G2 Telecom  
**Versão**: 1.0.0  
**Última atualização**: 2024
