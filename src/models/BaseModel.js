const { Database } = require('../config/database');

// Modelo base para simplificar CRUD
class BaseModel {
  constructor(data) {
    Object.assign(this, data);
  }

  // Métodos estáticos genéricos
  static async create(collection, data) {
    try {
      const result = await Database.create(collection, data);
      return new this(result);
    } catch (error) {
      throw new Error(`Erro ao criar ${this.name}: ${error.message}`);
    }
  }

  static async findById(collection, id) {
    try {
      const data = await Database.findById(collection, id);
      return data ? new this(data) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar ${this.name}: ${error.message}`);
    }
  }

  static async findAll(collection, filters = {}) {
    try {
      const data = await Database.findAll(collection, filters);
      return data.map(item => new this(item));
    } catch (error) {
      throw new Error(`Erro ao listar ${this.name}: ${error.message}`);
    }
  }

  static async findWithPagination(collection, filters = {}, limit = 50, offset = 0) {
    try {
      const data = await Database.findWithPagination(collection, filters, limit, offset);
      return data.map(item => new this(item));
    } catch (error) {
      throw new Error(`Erro ao buscar ${this.name} paginados: ${error.message}`);
    }
  }

  async update(collection, updateData) {
    try {
      // Remover campos que não devem ser atualizados
      delete updateData.id;
      delete updateData.criadoEm;
      delete updateData.criadoPor;

      const result = await Database.update(collection, this.id, updateData);
      Object.assign(this, result);
      return this;
    } catch (error) {
      throw new Error(`Erro ao atualizar ${this.constructor.name}: ${error.message}`);
    }
  }

  async delete(collection) {
    try {
      await Database.delete(collection, this.id);
      this.ativo = false;
      return this;
    } catch (error) {
      throw new Error(`Erro ao deletar ${this.constructor.name}: ${error.message}`);
    }
  }

  // Método genérico para buscar por campo
  static async findByField(collection, field, value) {
    try {
      const data = await Database.findAll(collection, { [field]: value, ativo: true });
      return data.map(item => new this(item));
    } catch (error) {
      throw new Error(`Erro ao buscar ${this.name} por ${field}: ${error.message}`);
    }
  }
}

module.exports = BaseModel;
