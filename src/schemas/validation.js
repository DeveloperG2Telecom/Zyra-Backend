const Joi = require('joi');

// Schemas centralizados para validação
const schemas = {
  // Autenticação
  login: Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
  }),

  register: Joi.object({
    nome: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').default('user')
  }),

  updateUser: Joi.object({
    nome: Joi.string().min(2).max(100),
    senha: Joi.string().min(6)
  }),

  // Equipamentos
  equipamento: Joi.object({
    nome: Joi.string().min(2).max(100).required(),
    modelo: Joi.string().min(2).max(100).required(),
    fabricante: Joi.string().min(2).max(100).required(),
    serial: Joi.string().min(2).max(100).required(),
    mac: Joi.string().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).required(),
    ipPrivado: Joi.string().ip().required(),
    ipPublico: Joi.string().ip().optional(),
    portas: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('Ativo', 'Em Manutenção', 'Reserva', 'Descartado', 'Em Teste').default('Ativo'),
    funcao: Joi.string().min(2).max(100).required(),
    modoAcesso: Joi.string().valid('SSH', 'Web', 'Telnet', 'Winbox', 'SNMP', 'API').required(),
    fotos: Joi.array().items(Joi.string()).default([]),
    observacoes: Joi.string().max(500).optional(),
    endereco: Joi.object({
      cidade: Joi.string().min(2).max(100).required(),
      endereco: Joi.string().min(2).max(200).required(),
      torre: Joi.string().max(100).optional(),
      rack: Joi.string().max(100).optional()
    }).required(),
    coordenadas: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).required(),
    alimentacao: Joi.object({
      tipo: Joi.string().valid('AC', 'DC').required(),
      tensao: Joi.string().required(),
      consumo: Joi.number().min(0).required()
    }).required(),
    dataAquisicao: Joi.date().max('now').required(),
    garantia: Joi.number().integer().min(0).required(),
    firmware: Joi.string().min(1).max(50).required(),
    responsavel: Joi.object({
      instalou: Joi.string().min(2).max(100).required(),
      mantem: Joi.string().min(2).max(100).required(),
      contato: Joi.string().email().required()
    }).required(),
    fornecedor: Joi.object({
      nome: Joi.string().min(2).max(100).required(),
      contato: Joi.string().email().required(),
      notaFiscal: Joi.string().min(2).max(100).required(),
      contrato: Joi.string().max(100).optional()
    }).required()
  }),

  // Cidades
  cidade: Joi.object({
    nome: Joi.string().min(2).max(100).required(),
    estado: Joi.string().length(2).required(),
    codigoIBGE: Joi.string().min(7).max(7).required(),
    ativa: Joi.boolean().default(true)
  }),

  // Query parameters
  pagination: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0)
  }),

  equipamentoFilters: Joi.object({
    fabricante: Joi.string().optional(),
    status: Joi.string().optional(),
    cidade: Joi.string().optional(),
    funcao: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0)
  })
};

// Middleware genérico de validação
const validate = (schemaName, property = 'body') => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Schema de validação não encontrado' }
      });
    }

    const { error, value } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};
