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
    const jwtSecret = process.env.JWT_SECRET || 'zyra-super-secret-jwt-key-for-development-only';
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email, 
        role: this.role 
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  // Criar usuário
  static async create(userData) {
    try {
      // Se Firebase não estiver configurado, simular criação
      if (!this.db) {
        console.log('⚠️  Simulando criação de usuário (modo desenvolvimento)');
        
        // Hash da senha
        const hashedPassword = await User.hashPassword(userData.senha);

        // Simular criação de usuário
        const newUser = {
          id: 'mock-user-' + Date.now(),
          nome: userData.nome,
          email: userData.email,
          senha: hashedPassword,
          role: userData.role || 'user',
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        };

        // Adicionar métodos necessários
        newUser.verifyPassword = async function(password) {
          return await bcrypt.compare(password, this.senha);
        };
        newUser.generateToken = function() {
          const jwtSecret = process.env.JWT_SECRET || 'zyra-super-secret-jwt-key-for-development-only';
          return jwt.sign(
            { 
              id: this.id, 
              email: this.email, 
              role: this.role 
            },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
          );
        };
        newUser.toPublicObject = function() {
          const { senha, ...publicData } = this;
          return publicData;
        };
        newUser.isAdmin = function() {
          return this.role === 'admin';
        };
        newUser.isUser = function() {
          return this.role === 'user';
        };

        return newUser;
      }

      // Verificar se email já existe
      const existingUser = await this.findAll({ email: userData.email });
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
      // Se Firebase não estiver configurado, usar dados mockados
      if (!this.db) {
        console.log('⚠️  Usando dados mockados para desenvolvimento');
        const mockUsers = [
          {
            id: 'mock-user-1',
            nome: 'Administrador',
            email: 'admin@G2telecom.com',
            senha: '$2a$10$97KM4UIR2Dn9xkWB/Md9XOGIYWIhiUNOc.XlLCxNKTKRasYZ1TWCG', // password: "123456"
            role: 'admin',
            ativo: true,
            criadoEm: new Date(),
            atualizadoEm: new Date()
          },
          {
            id: 'mock-user-2',
            nome: 'Usuário Teste',
            email: 'teste@G2telecom.com',
            senha: '$2a$10$97KM4UIR2Dn9xkWB/Md9XOGIYWIhiUNOc.XlLCxNKTKRasYZ1TWCG', // password: "123456"
            role: 'user',
            ativo: true,
            criadoEm: new Date(),
            atualizadoEm: new Date()
          }
        ];
        
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          // Adicionar métodos necessários ao usuário mockado
          user.verifyPassword = async function(password) {
            return await bcrypt.compare(password, this.senha);
          };
          user.generateToken = function() {
            const jwtSecret = process.env.JWT_SECRET || 'zyra-super-secret-jwt-key-for-development-only';
            return jwt.sign(
              { 
                id: this.id, 
                email: this.email, 
                role: this.role 
              },
              jwtSecret,
              { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );
          };
          user.toPublicObject = function() {
            const { senha, ...publicData } = this;
            return publicData;
          };
          user.isAdmin = function() {
            return this.role === 'admin';
          };
          user.isUser = function() {
            return this.role === 'user';
          };
        }
        return user || null;
      }
      
      const users = await this.findAll(COLLECTIONS.USERS, { email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Buscar por ID
  static async findById(id) {
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      console.log('⚠️  Usando dados mockados para buscar usuário por ID');
      const mockUsers = [
        {
          id: 'mock-user-1',
          nome: 'Administrador',
          email: 'admin@G2telecom.com',
          senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          role: 'admin',
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-user-2',
          nome: 'Usuário Teste',
          email: 'teste@G2telecom.com',
          senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          role: 'user',
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ];
      
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        // Adicionar métodos necessários ao usuário mockado
        user.verifyPassword = async function(password) {
          return await bcrypt.compare(password, this.senha);
        };
        user.generateToken = function() {
          const jwtSecret = process.env.JWT_SECRET || 'zyra-super-secret-jwt-key-for-development-only';
          return jwt.sign(
            { 
              id: this.id, 
              email: this.email, 
              role: this.role 
            },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
          );
        };
        user.toPublicObject = function() {
          const { senha, ...publicData } = this;
          return publicData;
        };
        user.isAdmin = function() {
          return this.role === 'admin';
        };
        user.isUser = function() {
          return this.role === 'user';
        };
      }
      return user || null;
    }
    
    return super.findById(COLLECTIONS.USERS, id);
  }

  // Listar todos os usuários
  static async findAll(filters = {}) {
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      console.log('⚠️  Usando dados mockados para listar usuários');
      const mockUsers = [
        {
          id: 'mock-user-1',
          nome: 'Administrador',
          email: 'admin@G2telecom.com',
          senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          role: 'admin',
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-user-2',
          nome: 'Usuário Teste',
          email: 'teste@G2telecom.com',
          senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          role: 'user',
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ];
      
      // Aplicar filtros nos dados mockados
      let filteredUsers = mockUsers;
      
      if (filters.email) {
        filteredUsers = filteredUsers.filter(u => u.email === filters.email);
      }
      if (filters.role) {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
      }
      if (filters.ativo !== undefined) {
        filteredUsers = filteredUsers.filter(u => u.ativo === filters.ativo);
      }
      
      return filteredUsers;
    }
    
    return super.findAll(COLLECTIONS.USERS, filters);
  }

  // Atualizar usuário
  async update(updateData) {
    try {
      // Se Firebase não estiver configurado, simular atualização
      if (!this.db) {
        console.log('⚠️  Simulando atualização de usuário (modo desenvolvimento)');
        
        // Se está atualizando a senha, fazer hash
        if (updateData.senha) {
          updateData.senha = await User.hashPassword(updateData.senha);
        }

        // Simular atualização
        Object.assign(this, updateData);
        this.atualizadoEm = new Date();
        
        return this;
      }

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
