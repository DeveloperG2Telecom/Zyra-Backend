// Helper para respostas padronizadas
class ResponseHelper {
  static success(res, data = null, message = null, statusCode = 200) {
    const response = { success: true };
    if (data !== null) response.data = data;
    if (message) response.message = message;
    return res.status(statusCode).json(response);
  }

  static error(res, message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    const response = {
      success: false,
      error: { code, message }
    };
    if (details) response.error.details = details;
    return res.status(statusCode).json(response);
  }

  static validationError(res, details) {
    return this.error(res, 'Dados inválidos', 'VALIDATION_ERROR', 400, details);
  }

  static notFound(res, resource = 'Recurso') {
    return this.error(res, `${resource} não encontrado`, 'NOT_FOUND', 404);
  }

  static unauthorized(res, message = 'Token de acesso requerido') {
    return this.error(res, message, 'UNAUTHORIZED', 401);
  }

  static forbidden(res, message = 'Acesso negado') {
    return this.error(res, message, 'FORBIDDEN', 403);
  }

  static conflict(res, message = 'Recurso já existe') {
    return this.error(res, message, 'CONFLICT', 409);
  }
}

// Wrapper para async/await com tratamento de erro
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  ResponseHelper,
  asyncHandler
};