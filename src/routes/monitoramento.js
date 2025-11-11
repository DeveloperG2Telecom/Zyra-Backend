const express = require('express');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');
const { getDadosMonitoramento, getDadosMonitoramentoAsObject } = require('../services/monitoramentoService');

const router = express.Router();

// GET /monitoramento - Retorna dados de monitoramento de todos os equipamentos
router.get('/', asyncHandler(async (req, res) => {
  try {
    const dados = getDadosMonitoramentoAsObject();
    
    ResponseHelper.success(res, {
      dados,
      timestamp: new Date().toISOString(),
      totalEquipamentos: Object.keys(dados).length
    });
  } catch (error) {
    console.error('Erro ao buscar dados de monitoramento:', error);
    ResponseHelper.error(res, 'Erro ao buscar dados de monitoramento', 500);
  }
}));

// GET /monitoramento/:equipamentoId - Retorna dados de monitoramento de um equipamento específico
router.get('/:equipamentoId', asyncHandler(async (req, res) => {
  try {
    const { equipamentoId } = req.params;
    const dados = getDadosMonitoramento(equipamentoId);
    
    if (!dados) {
      return ResponseHelper.notFound(res, 'Dados de monitoramento para este equipamento');
    }
    
    ResponseHelper.success(res, dados);
  } catch (error) {
    console.error('Erro ao buscar dados de monitoramento:', error);
    ResponseHelper.error(res, 'Erro ao buscar dados de monitoramento', 500);
  }
}));

module.exports = router;

