const express = require('express');
const Cidade = require('../models/Cidade');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /cidades
router.get('/', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { estado, ativa } = req.query;

  const filters = {};
  if (estado) filters.estado = estado;
  if (ativa !== undefined) filters.ativa = ativa === 'true';

  const cidades = await Cidade.findAll(filters);
  ResponseHelper.success(res, cidades);
}));

// GET /cidades/:id
router.get('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const cidade = await Cidade.findById(req.params.id);
  
  if (!cidade) {
    return ResponseHelper.notFound(res, 'Cidade');
  }

  ResponseHelper.success(res, cidade);
}));

// POST /cidades
router.post('/', authenticateToken, requireUser, validate('cidade'), asyncHandler(async (req, res) => {
  req.body.criadoPor = req.user.email;
  const cidade = await Cidade.create(req.body);
  ResponseHelper.success(res, cidade, null, 201);
}));

// PUT /cidades/:id
router.put('/:id', authenticateToken, requireUser, validate('cidade'), asyncHandler(async (req, res) => {
  const cidade = await Cidade.findById(req.params.id);
  
  if (!cidade) {
    return ResponseHelper.notFound(res, 'Cidade');
  }

  await cidade.update(req.body);
  ResponseHelper.success(res, cidade);
}));

// DELETE /cidades/:id
router.delete('/:id', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const cidade = await Cidade.findById(req.params.id);
  
  if (!cidade) {
    return ResponseHelper.notFound(res, 'Cidade');
  }

  await cidade.delete();
  ResponseHelper.success(res, null, 'Cidade deletada com sucesso');
}));

// GET /cidades/estado/:estado
router.get('/estado/:estado', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const { estado } = req.params;
  const cidades = await Cidade.findByEstado(estado);
  ResponseHelper.success(res, cidades);
}));

// GET /cidades/ativas
router.get('/ativas', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const cidades = await Cidade.findAtivas();
  ResponseHelper.success(res, cidades);
}));

module.exports = router;
