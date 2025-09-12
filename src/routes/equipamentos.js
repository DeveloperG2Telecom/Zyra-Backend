const express = require('express');
const Equipamento = require('../models/Equipamento');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /equipamentos
router.get('/', authenticateToken, requireUser, validate('equipamentoFilters', 'query'), asyncHandler(async (req, res) => {
  const { fabricante, status, cidade, funcao, limit, offset } = req.query;

  const filters = { ativo: true };
  if (fabricante) filters.fabricante = fabricante;
  if (status) filters.status = status;
  if (cidade) filters['endereco.cidade'] = cidade;
  if (funcao) filters.funcao = funcao;

  const equipamentos = await Equipamento.findWithPagination(filters, limit, offset);

  ResponseHelper.success(res, equipamentos);
}));

// GET /equipamentos/:id
router.get('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const equipamento = await Equipamento.findById(req.params.id);
  
  if (!equipamento) {
    return ResponseHelper.notFound(res, 'Equipamento');
  }

  ResponseHelper.success(res, equipamento);
}));

// POST /equipamentos
router.post('/', authenticateToken, requireUser, validate('equipamento'), asyncHandler(async (req, res) => {
  req.body.criadoPor = req.user.email;
  const equipamento = await Equipamento.create(req.body);
  ResponseHelper.success(res, equipamento, null, 201);
}));

// PUT /equipamentos/:id
router.put('/:id', authenticateToken, requireUser, validate('equipamento'), asyncHandler(async (req, res) => {
  const equipamento = await Equipamento.findById(req.params.id);
  
  if (!equipamento) {
    return ResponseHelper.notFound(res, 'Equipamento');
  }

  await equipamento.update(req.body);
  ResponseHelper.success(res, equipamento);
}));

// DELETE /equipamentos/:id
router.delete('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const equipamento = await Equipamento.findById(req.params.id);
  
  if (!equipamento) {
    return ResponseHelper.notFound(res, 'Equipamento');
  }

  await equipamento.delete();
  ResponseHelper.success(res, null, 'Equipamento deletado com sucesso');
}));

// GET /equipamentos/stats
router.get('/stats', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const stats = await Equipamento.getStats();
  ResponseHelper.success(res, stats);
}));

// GET /equipamentos/search/:term
router.get('/search/:term', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { term } = req.params;
  
  // Buscar por nome, modelo, fabricante, serial, IP
  const equipamentos = await Equipamento.findAll({ ativo: true });
  
  const filtered = equipamentos.filter(equipamento => 
    equipamento.nome.toLowerCase().includes(term.toLowerCase()) ||
    equipamento.modelo.toLowerCase().includes(term.toLowerCase()) ||
    equipamento.fabricante.toLowerCase().includes(term.toLowerCase()) ||
    equipamento.serial.toLowerCase().includes(term.toLowerCase()) ||
    equipamento.ipPrivado.includes(term) ||
    (equipamento.ipPublico && equipamento.ipPublico.includes(term))
  );

  ResponseHelper.success(res, filtered);
}));

module.exports = router;
