const BaseModel = require('./BaseModel');
const { COLLECTIONS } = require('../config/database');

class Cidade extends BaseModel {
  constructor(data) {
    super({
      ...data,
      ativa: data.ativa !== undefined ? data.ativa : true
    });
  }

  // Criar cidade
  static async create(cidadeData) {
    try {
      // Verificar se cidade já existe
      const existingCidade = await this.findAll(COLLECTIONS.CIDADES, { 
        nome: cidadeData.nome,
        estado: cidadeData.estado 
      });
      if (existingCidade.length > 0) {
        throw new Error('Cidade já cadastrada');
      }

      return super.create(COLLECTIONS.CIDADES, cidadeData);
    } catch (error) {
      throw new Error(`Erro ao criar cidade: ${error.message}`);
    }
  }

  // Métodos específicos da Cidade
  static async findById(id) {
    return super.findById(COLLECTIONS.CIDADES, id);
  }

  static async findAll(filters = {}) {
    return super.findAll(COLLECTIONS.CIDADES, filters);
  }

  async update(updateData) {
    try {
      // Verificar se nova cidade já existe (se estiver sendo alterada)
      if (updateData.nome && updateData.estado && 
          (updateData.nome !== this.nome || updateData.estado !== this.estado)) {
        const existingCidade = await this.constructor.findAll(COLLECTIONS.CIDADES, { 
          nome: updateData.nome,
          estado: updateData.estado 
        });
        if (existingCidade.length > 0) {
          throw new Error('Cidade já cadastrada');
        }
      }

      return super.update(COLLECTIONS.CIDADES, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar cidade: ${error.message}`);
    }
  }

  async delete() {
    return super.delete(COLLECTIONS.CIDADES);
  }

  // Métodos de busca específicos
  static async findByEstado(estado) {
    return this.findByField(COLLECTIONS.CIDADES, 'estado', estado);
  }

  static async findByNome(nome) {
    return this.findByField(COLLECTIONS.CIDADES, 'nome', nome);
  }

  static async findAtivas() {
    return this.findAll(COLLECTIONS.CIDADES, { ativa: true });
  }
}

module.exports = Cidade;
