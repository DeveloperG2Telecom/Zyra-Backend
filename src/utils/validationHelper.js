const Joi = require('joi');

class ValidationHelper {
  // Validações comuns reutilizáveis
  static commonValidations = {
    id: Joi.string().min(1).max(100),
    nome: Joi.string().min(2).max(200).required(),
    email: Joi.string().email().required(),
    status: Joi.string().valid('Ativo', 'Inativo', 'Manutenção', 'Reserva', 'Descartado', 'Em Teste').default('Ativo'),
    coordenadas: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }),
    endereco: Joi.string().min(5).max(300).required(),
    telefone: Joi.string().min(10).max(20).optional(),
    observacoes: Joi.string().max(500).optional()
  };

  // Validação rápida de campos obrigatórios
  static validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
  }

  // Validação rápida de campos únicos
  static async validateUniqueFields(data, model, excludeId = null) {
    const uniqueFields = ['ipPrivado', 'serialMac', 'email'];
    const checks = uniqueFields.filter(field => data[field]);
    
    for (const field of checks) {
      // Usar o método específico do modelo em vez do genérico
      const existing = await model.findAllEquipamentos({ [field]: data[field], ativo: true });
      if (existing.length > 0 && (!excludeId || existing[0].id !== excludeId)) {
        throw new Error(`${field} já está em uso`);
      }
    }
  }

  // Validação de coordenadas (opcional)
  static validateCoordinates(localidade) {
    if (localidade && typeof localidade === 'object') {
      // Apenas valida se os campos existem, mas não exige que sejam preenchidos
      if (localidade.lat !== undefined && (isNaN(localidade.lat) || localidade.lat < -90 || localidade.lat > 90)) {
        throw new Error('Latitude deve estar entre -90 e 90');
      }
      if (localidade.lng !== undefined && (isNaN(localidade.lng) || localidade.lng < -180 || localidade.lng > 180)) {
        throw new Error('Longitude deve estar entre -180 e 180');
      }
    }
  }

  // Validação de array
  static validateArray(field, data) {
    if (data[field] && !Array.isArray(data[field])) {
      throw new Error(`${field} deve ser um array`);
    }
  }

  // Validação de IP
  static validateIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  }
}

module.exports = ValidationHelper;
