const express = require('express');
const Pop = require('../models/Pop');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /pops - Listar todos os POPs
router.get('/', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { tipo, cidade, estado, status } = req.query;
  const filters = { ativo: true };
  if (tipo) filters.tipo = tipo;
  if (cidade) filters.cidade = cidade;
  if (estado) filters.estado = estado;
  if (status) filters.status = status;
  
  const pops = await Pop.findAllPops(filters);
  ResponseHelper.success(res, pops);
}));

// GET /pops/:id - Buscar POP por ID
router.get('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const pop = await Pop.findPopById(req.params.id);
  if (!pop) return ResponseHelper.notFound(res, 'POP');
  ResponseHelper.success(res, pop);
}));

// POST /pops - Criar novo POP
router.post('/', authenticateToken, requireUser, validate('pop'), asyncHandler(async (req, res) => {
  const pop = await Pop.createPop(req.body);
  ResponseHelper.success(res, pop, null, 201);
}));

// PUT /pops/:id - Atualizar POP
router.put('/:id', authenticateToken, requireUser, validate('pop'), asyncHandler(async (req, res) => {
  const pop = await Pop.findPopById(req.params.id);
  if (!pop) return ResponseHelper.notFound(res, 'POP');
  
  await pop.updatePop(req.body);
  ResponseHelper.success(res, pop);
}));

// DELETE /pops/:id - Excluir POP
router.delete('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const pop = await Pop.findPopById(req.params.id);
  if (!pop) return ResponseHelper.notFound(res, 'POP');
  
  await pop.deletePop();
  ResponseHelper.success(res, null, 'POP excluído com sucesso');
}));

// GET /pops/tipo/:tipo - Buscar POPs por tipo (POP ou REDE)
router.get('/tipo/:tipo', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { tipo } = req.params;
  const pops = await Pop.findPopsByTipo(tipo);
  ResponseHelper.success(res, pops);
}));

// GET /pops/ativos - Buscar POPs ativos
router.get('/ativos', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const pops = await Pop.findPopsAtivos();
  ResponseHelper.success(res, pops);
}));

module.exports = router;
