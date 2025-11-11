const express = require('express');
const RedeRural = require('../models/RedeRural');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /redes-rurais - Listar todas as Redes Rurais
router.get('/', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { tipo, cidade, estado, status, tecnologia } = req.query;
  const filters = { ativo: true };
  if (tipo) filters.tipo = tipo;
  if (cidade) filters.cidade = cidade;
  if (estado) filters.estado = estado;
  if (status) filters.status = status;
  if (tecnologia) filters.tecnologia = tecnologia;
  
  const redesRurais = await RedeRural.findAllRedesRurais(filters);
  ResponseHelper.success(res, redesRurais);
}));

// GET /redes-rurais/:id - Buscar Rede Rural por ID
router.get('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const redeRural = await RedeRural.findRedeRuralById(req.params.id);
  if (!redeRural) return ResponseHelper.notFound(res, 'Rede Rural');
  ResponseHelper.success(res, redeRural);
}));

// POST /redes-rurais - Criar nova Rede Rural
router.post('/', authenticateToken, requireUser, validate('redeRural'), asyncHandler(async (req, res) => {
  const redeRural = await RedeRural.createRedeRural(req.body);
  ResponseHelper.success(res, redeRural, null, 201);
}));

// PUT /redes-rurais/:id - Atualizar Rede Rural
router.put('/:id', authenticateToken, requireUser, validate('redeRural'), asyncHandler(async (req, res) => {
  const redeRural = await RedeRural.findRedeRuralById(req.params.id);
  if (!redeRural) return ResponseHelper.notFound(res, 'Rede Rural');
  
  await redeRural.updateRedeRural(req.body);
  ResponseHelper.success(res, redeRural);
}));

// DELETE /redes-rurais/:id - Excluir Rede Rural
router.delete('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const redeRural = await RedeRural.findRedeRuralById(req.params.id);
  if (!redeRural) return ResponseHelper.notFound(res, 'Rede Rural');
  
  await redeRural.deleteRedeRural();
  ResponseHelper.success(res, null, 'Rede Rural excluída com sucesso');
}));

// GET /redes-rurais/tipo/:tipo - Buscar Redes Rurais por tipo
router.get('/tipo/:tipo', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { tipo } = req.params;
  const redesRurais = await RedeRural.findRedesRuraisByTipo(tipo);
  ResponseHelper.success(res, redesRurais);
}));

// GET /redes-rurais/ativas - Buscar Redes Rurais ativas
router.get('/ativas', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const redesRurais = await RedeRural.findRedesRuraisAtivas();
  ResponseHelper.success(res, redesRurais);
}));

// GET /redes-rurais/tecnologia/:tecnologia - Buscar Redes Rurais por tecnologia
router.get('/tecnologia/:tecnologia', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { tecnologia } = req.params;
  const redesRurais = await RedeRural.findRedesRuraisByTecnologia(tecnologia);
  ResponseHelper.success(res, redesRurais);
}));

module.exports = router;
