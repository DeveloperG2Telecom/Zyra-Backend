const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseModel = require('./BaseModel');
const { COLLECTIONS } = require('../config/database');

class User extends BaseModel {
  constructor(data) {
    super({
      ...data,
      role: data.role || 'user',
      ativo: data.ativo !== undefined ? data.ativo : true
    });
  }

  // Criar hash da senha
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verificar senha
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.senha);
  }

  // Gerar token JWT
  generateToken() {
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email, 
        role: this.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  // Criar usuário
  static async create(userData) {
    try {
      // Verificar se email já existe
      const existingUser = await this.findAll(COLLECTIONS.USERS, { email: userData.email });
      if (existingUser.length > 0) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const hashedPassword = await User.hashPassword(userData.senha);

      // Dados do usuário
      const user = {
        nome: userData.nome,
        email: userData.email,
        senha: hashedPassword,
        role: userData.role || 'user',
        ativo: true,
      };

      return super.create(COLLECTIONS.USERS, user);
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Buscar por email
  static async findByEmail(email) {
    try {
      const users = await this.findAll(COLLECTIONS.USERS, { email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Buscar por ID
  static async findById(id) {
    return super.findById(COLLECTIONS.USERS, id);
  }

  // Listar todos os usuários
  static async findAll(filters = {}) {
    return super.findAll(COLLECTIONS.USERS, filters);
  }

  // Atualizar usuário
  async update(updateData) {
    try {
      // Se está atualizando a senha, fazer hash
      if (updateData.senha) {
        updateData.senha = await User.hashPassword(updateData.senha);
      }

      return super.update(COLLECTIONS.USERS, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Deletar usuário (soft delete)
  async delete() {
    return super.delete(COLLECTIONS.USERS);
  }

  // Autenticar usuário
  static async authenticate(email, password) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.ativo) {
        throw new Error('Usuário inativo');
      }

      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        throw new Error('Senha incorreta');
      }

      return user;
    } catch (error) {
      throw new Error(`Erro na autenticação: ${error.message}`);
    }
  }

  // Converter para objeto público (sem senha)
  toPublicObject() {
    const { senha, ...publicData } = this;
    return publicData;
  }

  // Verificar se é admin
  isAdmin() {
    return this.role === 'admin';
  }

  // Verificar se é user
  isUser() {
    return this.role === 'user';
  }
}

module.exports = User;
