const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar middlewares
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Importar rotas
const authRoutes = require('./routes/auth');
const equipamentosRoutes = require('./routes/equipamentos');
const redesRuraisRoutes = require('./routes/redesRurais');
const cidadesRoutes = require('./routes/cidades');
// const dashboardRoutes = require('./routes/dashboard'); // Removido - dashboard agora usa dados diretos
const configuracoesRoutes = require('./routes/configuracoes');
const backupsRoutes = require('./routes/backups');
const topologiaRoutes = require('./routes/topologia');
const monitoramentoRoutes = require('./routes/monitoramento');
const pingHistoricoRoutes = require('./routes/pingHistorico');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://zyra.g2telecom.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:10000', 'null'], // Permite arquivos locais
  credentials: true
}));

// Rate limiting
app.use(apiLimiter);

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging (simplificado)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/equipamentos', equipamentosRoutes);
app.use('/api/v1/redes-rurais', redesRuraisRoutes);
app.use('/api/v1/cidades', cidadesRoutes);
// app.use('/api/v1/dashboard', dashboardRoutes); // Removido - dashboard agora usa dados diretos
app.use('/api/v1/configuracoes', configuracoesRoutes);
app.use('/api/v1/backups', backupsRoutes);
app.use('/api/v1/topologia', topologiaRoutes);
app.use('/api/v1/monitoramento', monitoramentoRoutes);
app.use('/api/v1/ping-historico', pingHistoricoRoutes);

// Rota de health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Zyra funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Zyra - Sistema de Documentação e Monitoramento de Equipamentos',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      equipamentos: '/api/v1/equipamentos',
      redesRurais: '/api/v1/redes-rurais',
      cidades: '/api/v1/cidades',
      // dashboard: '/api/v1/dashboard', // Removido - dashboard agora usa dados diretos
      configuracoes: '/api/v1/configuracoes',
      backups: '/api/v1/backups',
      topologia: '/api/v1/topologia',
      monitoramento: '/api/v1/monitoramento',
      pingHistorico: '/api/v1/ping-historico',
      health: '/api/v1/health'
    }
  });
});

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
