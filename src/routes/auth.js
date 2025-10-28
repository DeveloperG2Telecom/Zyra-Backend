const express = require('express');
const jwt = require('jsonwebtoken');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// POST /auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validação básica
  if (!email || !password) {
    return ResponseHelper.badRequest(res, 'Email e senha são obrigatórios');
  }

  // Para desenvolvimento, aceitar qualquer email e senha
  // Em produção, verificar no banco de dados
  const user = {
    id: 1,
    email: email,
    nome: 'Usuário Demo',
    role: 'admin'
  };

  // Gerar token JWT
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'secret-key-dev',
    { expiresIn: '24h' }
  );

  ResponseHelper.success(res, {
    token,
    user: {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role
    }
  });
}));

// POST /auth/logout
router.post('/logout', asyncHandler(async (req, res) => {
  // Em um sistema real, você invalidaria o token aqui
  ResponseHelper.success(res, { message: 'Logout realizado com sucesso' });
}));

// GET /auth/me
router.get('/me', asyncHandler(async (req, res) => {
  // Verificar token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseHelper.unauthorized(res, 'Token não fornecido');
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-dev');
    
    ResponseHelper.success(res, {
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    ResponseHelper.unauthorized(res, 'Token inválido');
  }
}));

module.exports = router;