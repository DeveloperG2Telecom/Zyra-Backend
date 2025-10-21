const express = require('express');
const Equipamento = require('../models/Equipamento');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /equipamentos - Listar todos os equipamentos (SIMPLIFICADO)
router.get('/', asyncHandler(async (req, res) => {
  console.log('🔍 BACKEND: Recebida requisição GET /equipamentos');
  console.log('🔍 BACKEND: Query params:', req.query);
  
  try {
    // Buscar TODOS os equipamentos sem filtros complexos
    const { Database, COLLECTIONS } = require('../config/database');
    
    console.log('🔍 BACKEND: Fazendo consulta direta no banco...');
    const equipamentos = await Database.findAll(COLLECTIONS.EQUIPAMENTOS, {});
    
    console.log('🔍 BACKEND: Equipamentos encontrados no banco:', equipamentos?.length || 0);
    console.log('🔍 BACKEND: Dados brutos do banco:', equipamentos);
    
    // Retornar dados simples
    res.json({
      success: true,
      data: equipamentos || [],
      message: `Encontrados ${equipamentos?.length || 0} equipamentos`
    });
    
  } catch (error) {
    console.error('❌ BACKEND: Erro ao buscar equipamentos:', error);
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
  const equipamento = await Equipamento.createEquipamento(req.body);
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
