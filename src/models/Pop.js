const BaseModel = require('./BaseModel');
const { COLLECTIONS } = require('../config/database');

class Pop extends BaseModel {
  constructor(data) {
    super({
      ...data,
      ativo: data.ativo !== undefined ? data.ativo : true,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
  }


  // Criar POP
  static async createPop(popData) {
    try {
      this.validatePopRequiredFields(popData);
      await this.validatePopUniqueFields(popData);
      return super.create(COLLECTIONS.POPS, popData);
    } catch (error) {
      throw new Error(`Erro ao criar POP: ${error.message}`);
    }
  }

  // Validação de campos obrigatórios do POP
  static validatePopRequiredFields(data) {
    const requiredFields = [
      'nome', 'codigo', 'endereco', 'cidade', 'estado', 'tipo'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
  }

  // Buscar POP por ID
  static async findPopById(id) {
    return super.findById(COLLECTIONS.POPS, id);
  }

  // Buscar todos os POPs
  static async findAllPops(filters = {}) {
    return super.findAll(COLLECTIONS.POPS, filters);
  }

  // Buscar POPs por tipo (POP ou REDE)
  static async findPopsByTipo(tipo) {
    return this.findAllPops({ tipo, ativo: true });
  }

  // Buscar POPs ativos
  static async findPopsAtivos() {
    return this.findAllPops({ ativo: true, status: 'Ativo' });
  }

  // Atualizar POP
  async updatePop(updateData) {
    try {
      if (updateData.codigo && updateData.codigo !== this.codigo) {
        await this.constructor.validatePopUniqueFields(updateData, this.id);
      }
      return super.update(COLLECTIONS.POPS, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar POP: ${error.message}`);
    }
  }

  // Excluir POP
  async deletePop() {
    try {
      return super.delete(COLLECTIONS.POPS);
    } catch (error) {
      throw new Error(`Erro ao excluir POP: ${error.message}`);
    }
  }

  // Validação de campos únicos do POP
  static async validatePopUniqueFields(data, excludeId = null) {
    const checks = [
      { field: 'codigo', message: 'Código do POP já está em uso' }
    ];

    for (const check of checks) {
      if (data[check.field]) {
        const existing = await this.findAllPops({ [check.field]: data[check.field], ativo: true });
        if (existing.length > 0 && (!excludeId || existing[0].id !== excludeId)) {
          throw new Error(check.message);
        }
      }
    }
  }
}

module.exports = Pop;
