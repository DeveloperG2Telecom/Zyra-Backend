const rateLimit = require('express-rate-limit');

// Rate limiter para autenticação
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 tentativas por IP
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não contar requisições bem-sucedidas
});

// Rate limiter geral para API
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requisições por IP
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas requisições. Tente novamente em 15 minutos.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para criação de recursos
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 criações por minuto
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas criações. Tente novamente em 1 minuto.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  apiLimiter,
  createLimiter,
};
