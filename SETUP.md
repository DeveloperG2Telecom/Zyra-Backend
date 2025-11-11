# 🚀 Configuração do Backend Zyra

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## ⚙️ Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

#### Configuração Mínima (Modo Desenvolvimento)
```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
PORT=3002
NODE_ENV=development
```

#### Configuração Completa (Com Firebase)
```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
PORT=3002
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### 3. Executar o Backend

#### Modo Desenvolvimento (com nodemon)
```bash
npm run dev
```

#### Modo Produção
```bash
npm start
```

## 🧪 Testando a API

### Health Check
```bash
curl http://localhost:3002/api/v1/health
```

### Usando a Página de Teste
1. Execute o servidor de teste: `npm run serve-test`
2. Acesse: `http://localhost:3001/test`
3. Ou abra `test-page.html` diretamente no navegador

## 📊 Endpoints Disponíveis

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `GET /api/v1/auth/me` - Dados do usuário
- `PUT /api/v1/auth/me` - Atualizar dados
- `POST /api/v1/auth/logout` - Logout

### Equipamentos
- `GET /api/v1/equipamentos` - Listar equipamentos
- `POST /api/v1/equipamentos` - Criar equipamento
- `GET /api/v1/equipamentos/:id` - Buscar por ID
- `PUT /api/v1/equipamentos/:id` - Atualizar equipamento
- `DELETE /api/v1/equipamentos/:id` - Deletar equipamento
- `GET /api/v1/equipamentos/search/:termo` - Buscar por termo
- `GET /api/v1/equipamentos/stats` - Estatísticas

### Cidades
- `GET /api/v1/cidades` - Listar cidades
- `POST /api/v1/cidades` - Criar cidade
- `GET /api/v1/cidades/:id` - Buscar por ID
- `PUT /api/v1/cidades/:id` - Atualizar cidade
- `DELETE /api/v1/cidades/:id` - Deletar cidade
- `GET /api/v1/cidades/estado/:estado` - Buscar por estado
- `GET /api/v1/cidades/ativas` - Cidades ativas

### Dashboard
- `GET /api/v1/dashboard` - Dashboard principal
- `GET /api/v1/dashboard/stats` - Estatísticas detalhadas

### Health Check
- `GET /api/v1/health` - Status da API

## 🔐 Credenciais de Teste

### Usuário Admin
- Email: `admin@G2telecom.com`
- Senha: `123456`

### Usuário Comum
- Email: `teste@G2telecom.com`
- Senha: `123456`

## 🛠️ Modo Desenvolvimento

O backend funciona em modo desenvolvimento sem Firebase, usando dados mockados:
- Usuários pré-cadastrados
- Equipamentos de exemplo
- Cidades de exemplo

## 📝 Scripts Disponíveis

- `npm start` - Iniciar em produção
- `npm run dev` - Iniciar em desenvolvimento (nodemon)
- `npm test` - Executar testes
- `npm run serve-test` - Servir página de teste

## 🔒 Segurança

- JWT para autenticação
- Rate limiting configurado
- CORS configurado
- Helmet para headers de segurança
- Validação de dados com Joi
