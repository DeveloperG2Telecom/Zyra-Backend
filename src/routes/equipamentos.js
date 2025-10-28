const express = require('express');
const Equipamento = require('../models/Equipamento');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /equipamentos - Listar equipamentos com paginação
router.get('/', asyncHandler(async (req, res) => {
  try {
    console.log('🚀 EQUIPAMENTOS ROUTE: ===== INICIANDO REQUISIÇÃO =====');
    console.log('🚀 EQUIPAMENTOS ROUTE: Query params recebidos:', req.query);
    console.log('🚀 EQUIPAMENTOS ROUTE: Headers:', req.headers);
    
    const databaseModule = require('../config/database');
    const { Database, COLLECTIONS } = databaseModule;
    console.log('🚀 EQUIPAMENTOS ROUTE: Database e COLLECTIONS carregados');
    console.log('🚀 EQUIPAMENTOS ROUTE: COLLECTIONS.EQUIPAMENTOS:', COLLECTIONS.EQUIPAMENTOS);
    console.log('🚀 EQUIPAMENTOS ROUTE: Tipo de COLLECTIONS.EQUIPAMENTOS:', typeof COLLECTIONS.EQUIPAMENTOS);
    
    // Validar se a coleção está definida
    if (!COLLECTIONS.EQUIPAMENTOS || typeof COLLECTIONS.EQUIPAMENTOS !== 'string') {
      console.error('❌ EQUIPAMENTOS ROUTE: Coleção EQUIPAMENTOS inválida:', COLLECTIONS.EQUIPAMENTOS);
      throw new Error('Coleção EQUIPAMENTOS não está definida corretamente');
    }
    
    // Parâmetros de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    console.log('🚀 EQUIPAMENTOS ROUTE: Parâmetros calculados - Page:', page, 'Limit:', limit, 'Offset:', offset);
    
    // Buscar equipamentos com paginação
    console.log('🚀 EQUIPAMENTOS ROUTE: Chamando Database.findWithPagination...');
    console.log('🚀 EQUIPAMENTOS ROUTE: Argumentos - Collection:', COLLECTIONS.EQUIPAMENTOS, 'Filters:', {}, 'Limit:', limit, 'Offset:', offset);
    
    const result = await Database.findWithPagination(COLLECTIONS.EQUIPAMENTOS, {}, limit, offset);
    
    console.log('🚀 EQUIPAMENTOS ROUTE: ===== RESULTADO RECEBIDO =====');
    console.log('🚀 EQUIPAMENTOS ROUTE: Resultado completo:', JSON.stringify(result, null, 2));
    console.log('🚀 EQUIPAMENTOS ROUTE: Total de itens:', result.total);
    console.log('🚀 EQUIPAMENTOS ROUTE: Dados encontrados:', result.data?.length || 0);
    console.log('🚀 EQUIPAMENTOS ROUTE: Primeiros 3 itens:', result.data?.slice(0, 3) || 'Nenhum item');
    
    // Calcular metadados de paginação
    const totalItems = result.total || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    console.log('🚀 EQUIPAMENTOS ROUTE: Metadados de paginação calculados:', {
      totalItems,
      totalPages,
      hasNextPage,
      hasPrevPage
    });
    
    const response = {
      success: true,
      data: result.data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      },
      message: `Encontrados ${result.data?.length || 0} equipamentos na página ${page}`
    };
    
    console.log('🚀 EQUIPAMENTOS ROUTE: ===== ENVIANDO RESPOSTA =====');
    console.log('🚀 EQUIPAMENTOS ROUTE: Resposta final:', JSON.stringify(response, null, 2));
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ EQUIPAMENTOS ROUTE: ===== ERRO CAPTURADO =====');
    console.error('❌ EQUIPAMENTOS ROUTE: Erro:', error.message);
    console.error('❌ EQUIPAMENTOS ROUTE: Stack trace:', error.stack);
    
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
  console.log('🔍 BACKEND: Recebida requisição POST /equipamentos');
  console.log('🔍 BACKEND: Dados recebidos:', req.body);
  
  const equipamento = await Equipamento.createEquipamento(req.body);
  console.log('✅ BACKEND: Equipamento criado com sucesso:', equipamento);
  
  ResponseHelper.success(res, equipamento, null, 201);
}));

// PUT /equipamentos/:id - Atualizar equipamento (SIMPLIFICADO)
router.put('/:id', asyncHandler(async (req, res) => {
  console.log('🔍 BACKEND: Recebida requisição PUT /equipamentos/' + req.params.id);
  console.log('🔍 BACKEND: Dados para atualizar:', req.body);
  
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
    
    console.log('🔍 BACKEND: Equipamento encontrado:', equipamentoExistente.nome);
    
    // Atualizar no banco
    const dadosAtualizados = {
      ...req.body,
      atualizadoEm: new Date()
    };
    
    await Database.update(COLLECTIONS.EQUIPAMENTOS, id, dadosAtualizados);
    
    console.log('✅ BACKEND: Equipamento atualizado com sucesso');
    
    res.json({
      success: true,
      data: { id, ...dadosAtualizados },
      message: 'Equipamento atualizado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ BACKEND: Erro ao atualizar equipamento:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: null
    });
  }
}));

// DELETE /equipamentos/:id - Excluir equipamento (SIMPLIFICADO)
router.delete('/:id', asyncHandler(async (req, res) => {
  console.log('🔍 BACKEND: Recebida requisição DELETE /equipamentos/' + req.params.id);
  
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
    
    console.log('🔍 BACKEND: Equipamento encontrado para deletar:', equipamentoExistente.nome);
    
    // Deletar do banco (soft delete)
    await Database.delete(COLLECTIONS.EQUIPAMENTOS, id);
    
    console.log('✅ BACKEND: Equipamento deletado com sucesso');
    
    res.json({
      success: true,
      data: null,
      message: 'Equipamento deletado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ BACKEND: Erro ao deletar equipamento:', error);
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
