const express = require('express');
const Equipamento = require('../models/Equipamento');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /equipamentos - Listar equipamentos com paginação
router.get('/', asyncHandler(async (req, res) => {
  try {
    const databaseModule = require('../config/database');
    const { Database, COLLECTIONS } = databaseModule;
    
    // Validar se a coleção está definida
    if (!COLLECTIONS.EQUIPAMENTOS || typeof COLLECTIONS.EQUIPAMENTOS !== 'string') {
      throw new Error('Coleção EQUIPAMENTOS não está definida corretamente');
    }
    
    // Parâmetros de paginação (permitir retornar todos com limit=all)
    const rawLimit = req.query.limit;
    const isAll = rawLimit === 'all' || rawLimit === undefined || rawLimit === null || rawLimit === '';
    const page = parseInt(req.query.page) || 1;
    const limit = isAll ? null : (parseInt(rawLimit) || 20);
    const offset = isAll ? 0 : (page - 1) * limit;
    
    // Buscar equipamentos com paginação
    const result = await Database.findWithPagination(COLLECTIONS.EQUIPAMENTOS, {}, limit, offset);
    
    // Calcular metadados de paginação
    const totalItems = result.total || 0;
    const totalPages = isAll ? 1 : Math.ceil(totalItems / (limit || totalItems || 1));
    const hasNextPage = isAll ? false : page < totalPages;
    const hasPrevPage = isAll ? false : page > 1;
    
    const response = {
      success: true,
      data: result.data || [],
      pagination: {
        currentPage: isAll ? 1 : page,
        totalPages,
        totalItems,
        itemsPerPage: isAll ? result.data.length : limit,
        hasNextPage,
        hasPrevPage
      },
      message: `Encontrados ${result.data?.length || 0} equipamentos na página ${page}`
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Erro ao buscar equipamentos:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      data: []
    });
  }
}));

// GET /equipamentos/:id - Buscar equipamento por ID
router.get('/:id', asyncHandler(async (req, res) => {
  const equipamento = await Equipamento.findEquipamentoById(req.params.id);
  if (!equipamento) return ResponseHelper.notFound(res, 'Equipamento');
  ResponseHelper.success(res, equipamento);
}));

// POST /equipamentos - Criar novo equipamento
router.post('/', validate('equipamento'), asyncHandler(async (req, res) => {
  try {
    const equipamento = await Equipamento.createEquipamento(req.body);
    
    // Atualizar cache do monitoramento
    const { atualizarListaEquipamentos } = require('../services/monitoramentoService');
    atualizarListaEquipamentos().catch(err => console.error('Erro ao atualizar cache:', err.message));
    
    ResponseHelper.success(res, equipamento, null, 201);
  } catch (error) {
    // Verificar se é erro de duplicata e retornar mensagem específica
    if (error.message && (error.message.includes('já está em uso') || error.message.includes('duplicado'))) {
      return res.status(409).json({
        success: false,
        error: error.message,
        code: 'DUPLICATE',
        data: null
      });
    }
    throw error; // Re-lançar outros erros para serem tratados pelo asyncHandler
  }
}));

// PUT /equipamentos/:id - Atualizar equipamento (SIMPLIFICADO)
router.put('/:id', asyncHandler(async (req, res) => {
  try {
    const { Database, COLLECTIONS } = require('../config/database');
    const { id } = req.params;
    
    // Verificar se o equipamento existe
    const equipamentoExistente = await Database.findById(COLLECTIONS.EQUIPAMENTOS, id);
    if (!equipamentoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Equipamento não encontrado',
        data: null
      });
    }
    
    // Atualizar no banco
    const dadosAtualizados = {
      ...req.body,
      atualizadoEm: new Date()
    };
    
    await Database.update(COLLECTIONS.EQUIPAMENTOS, id, dadosAtualizados);
    
    // Atualizar cache do monitoramento
    const { atualizarListaEquipamentos } = require('../services/monitoramentoService');
    atualizarListaEquipamentos().catch(err => console.error('Erro ao atualizar cache:', err.message));
    
    res.json({
      success: true,
      data: { id, ...dadosAtualizados },
      message: 'Equipamento atualizado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar equipamento:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      data: null
    });
  }
}));

// DELETE /equipamentos/:id - Excluir equipamento (SIMPLIFICADO)
router.delete('/:id', asyncHandler(async (req, res) => {
  try {
    const { Database, COLLECTIONS } = require('../config/database');
    const { id } = req.params;
    
    // Verificar se o equipamento existe
    const equipamentoExistente = await Database.findById(COLLECTIONS.EQUIPAMENTOS, id);
    if (!equipamentoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Equipamento não encontrado',
        data: null
      });
    }
    
    // Deletar do banco (soft delete)
    await Database.delete(COLLECTIONS.EQUIPAMENTOS, id);
    
    // Atualizar cache do monitoramento
    const { atualizarListaEquipamentos } = require('../services/monitoramentoService');
    atualizarListaEquipamentos().catch(err => console.error('Erro ao atualizar cache:', err.message));
    
    res.json({
      success: true,
      data: null,
      message: 'Equipamento deletado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao deletar equipamento:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      data: null
    });
  }
}));

// GET /equipamentos/pop/:popId - Buscar equipamentos por POP
router.get('/pop/:popId', asyncHandler(async (req, res) => {
  const { popId } = req.params;
  const equipamentos = await Equipamento.findEquipamentosByPop(popId);
  ResponseHelper.success(res, equipamentos);
}));

// GET /equipamentos/rede-rural/:redeRuralId - Buscar equipamentos por Rede Rural
router.get('/rede-rural/:redeRuralId', asyncHandler(async (req, res) => {
  const { redeRuralId } = req.params;
  const equipamentos = await Equipamento.findEquipamentosByRedeRural(redeRuralId);
  ResponseHelper.success(res, equipamentos);
}));

module.exports = router;
