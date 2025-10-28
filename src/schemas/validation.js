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

  // Equipamentos - Schema ultra simplificado para debug
  equipamento: Joi.object({
    nome: Joi.string().required(),
    tipo: Joi.string().required(),
    modelo: Joi.any().optional(),
    serialMac: Joi.any().optional(),
    ipPublico: Joi.any().optional(),
    ipPrivado: Joi.any().optional(),
    localidade: Joi.any().optional(),
    quantidadePortas: Joi.any().optional(),
    equipamentoAnterior: Joi.any().optional(),
    alimentacao: Joi.any().optional(),
    dataAquisicao: Joi.any().optional(),
    tempoGarantia: Joi.any().optional(),
    versaoFirmware: Joi.any().optional(),
    equipamentoPosterior: Joi.any().optional(),
    fotoEquipamento: Joi.any().optional(),
    pop: Joi.any().optional(),
    redeRural: Joi.any().optional(),
    modoAcesso: Joi.any().optional(),
    funcoes: Joi.any().optional(),
    status: Joi.any().optional(),
    observacoes: Joi.any().optional()
  }),

  // POPs
  pop: Joi.object({
    nome: Joi.string().min(2).max(200).required(),
    codigo: Joi.string().min(2).max(50).required(),
    endereco: Joi.string().min(5).max(300).required(),
    cidade: Joi.string().min(2).max(100).required(),
    estado: Joi.string().length(2).required(),
    coordenadas: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).optional(),
    tipo: Joi.string().valid('POP', 'REDE').required(),
    capacidade: Joi.string().min(1).max(100).optional(),
    status: Joi.string().valid('Ativo', 'Inativo', 'Manutenção').default('Ativo'),
    responsavel: Joi.string().min(2).max(100).optional(),
    contato: Joi.string().email().optional(),
    observacoes: Joi.string().max(500).optional()
  }),

  // Redes Rurais
  redeRural: Joi.object({
    nome: Joi.string().min(2).max(200).required(),
    codigo: Joi.string().min(2).max(50).required(),
    endereco: Joi.string().min(5).max(300).required(),
    cidade: Joi.string().min(2).max(100).required(),
    estado: Joi.string().length(2).required(),
    coordenadas: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).optional(),
    tipo: Joi.string().valid('RADIO_RURAL', 'WIFI_RURAL', 'FIBRA_RURAL').required(),
    tecnologia: Joi.string().min(2).max(100).required(),
    frequencia: Joi.string().min(1).max(50).optional(),
    potencia: Joi.string().min(1).max(50).optional(),
    alcance: Joi.string().min(1).max(50).optional(),
    capacidade: Joi.string().min(1).max(100).optional(),
    clientesConectados: Joi.number().integer().min(0).max(1000).optional(),
    status: Joi.string().valid('Ativo', 'Inativo', 'Manutenção').default('Ativo'),
    responsavel: Joi.string().min(2).max(100).optional(),
    contato: Joi.string().email().optional(),
    observacoes: Joi.string().max(500).optional()
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
    status: Joi.string().optional(),
    localidade: Joi.string().optional(),
    pop: Joi.string().optional(),
    redeRural: Joi.string().optional(),
    modoAcesso: Joi.string().optional(),
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

    console.log('🔍 VALIDATION: Validando dados:', JSON.stringify(req[property], null, 2));
    
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      console.error('❌ VALIDATION: Erro de validação:', error.details);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))
        }
      });
    }
    
    console.log('✅ VALIDATION: Dados validados com sucesso');

    req[property] = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};
