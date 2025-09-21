const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3002;

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor Zyra rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/v1/health`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado.');
    process.exit(0);
  });
});

module.exports = server;
