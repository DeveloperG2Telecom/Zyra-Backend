const { ResponseHelper } = require('../utils/responseHelper');

// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);

  // Erro de validação do Joi
  if (err.isJoi) {
    return ResponseHelper.validationError(res, err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    })));
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ResponseHelper.error(res, 'JSON inválido', 'INVALID_JSON', 400);
  }

  // Erro de cast do MongoDB (se usar no futuro)
  if (err.name === 'CastError') {
    return ResponseHelper.error(res, 'ID inválido', 'INVALID_ID', 400);
  }

  // Erro de duplicação (se usar no futuro)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ResponseHelper.conflict(res, `${field} já existe`);
  }

  // Erro padrão
  ResponseHelper.error(res, err.message || 'Erro interno do servidor', err.code || 'INTERNAL_ERROR', err.status || 500);
};

// Middleware para rotas não encontradas
const notFound = (req, res) => {
  ResponseHelper.error(res, `Rota ${req.method} ${req.path} não encontrada`, 'NOT_FOUND', 404);
};

module.exports = {
  errorHandler,
  notFound,
};
