const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../schemas/validation');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// POST /auth/login
router.post('/login', validate('login'), asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  // Autenticar usuário
  const user = await User.authenticate(email, senha);

  // Gerar token
  const token = user.generateToken();

  ResponseHelper.success(res, {
    user: user.toPublicObject(),
    token
  });
}));

// POST /auth/register
router.post('/register', validate('register'), asyncHandler(async (req, res) => {
  // Criar usuário
  const user = await User.create(req.body);

  // Gerar token
  const token = user.generateToken();

  ResponseHelper.success(res, {
    user: user.toPublicObject(),
    token
  }, null, 201);
}));

// GET /auth/me
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  ResponseHelper.success(res, {
    user: req.user.toPublicObject()
  });
}));

// PUT /auth/me
router.put('/me', authenticateToken, validate('updateUser'), asyncHandler(async (req, res) => {
  // Atualizar usuário
  await req.user.update(req.body);

  ResponseHelper.success(res, {
    user: req.user.toPublicObject()
  });
}));

// POST /auth/logout
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // Em um sistema JWT stateless, o logout é feito no frontend
  // removendo o token do armazenamento local
  ResponseHelper.success(res, null, 'Logout realizado com sucesso');
}));

module.exports = router;
