const express = require('express');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');
const { buscarHistoricoPing } = require('../services/monitoramentoService');

const router = express.Router();

// GET /ping-historico/:equipamentoId - Retorna histórico de pings de um equipamento
router.get('/:equipamentoId', asyncHandler(async (req, res) => {
  try {
    const { equipamentoId } = req.params;
    const limite = parseInt(req.query.limite) || 50;
    
    const historico = await buscarHistoricoPing(equipamentoId, limite);
    
    ResponseHelper.success(res, {
      equipamentoId,
      historico,
      total: historico.length,
      limite
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de ping:', error);
    ResponseHelper.error(res, 'Erro ao buscar histórico de ping', 500);
  }
}));

module.exports = router;

