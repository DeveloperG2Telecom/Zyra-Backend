const BaseModel = require('./BaseModel');
const { COLLECTIONS } = require('../config/database');

class RedeRural extends BaseModel {
  constructor(data) {
    super({
      ...data,
      ativo: data.ativo !== undefined ? data.ativo : true,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
  }


  // Criar Rede Rural
  static async createRedeRural(redeRuralData) {
    try {
      this.validateRedeRuralRequiredFields(redeRuralData);
      await this.validateRedeRuralUniqueFields(redeRuralData);
      return super.create(COLLECTIONS.REDES_RURAIS, redeRuralData);
    } catch (error) {
      throw new Error(`Erro ao criar Rede Rural: ${error.message}`);
    }
  }

  // Validação de campos obrigatórios da Rede Rural
  static validateRedeRuralRequiredFields(data) {
    const requiredFields = [
      'nome', 'codigo', 'endereco', 'cidade', 'estado', 'tipo', 'tecnologia'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
  }

  // Buscar Rede Rural por ID
  static async findRedeRuralById(id) {
    return super.findById(COLLECTIONS.REDES_RURAIS, id);
  }

  // Buscar todas as Redes Rurais
  static async findAllRedesRurais(filters = {}) {
    return super.findAll(COLLECTIONS.REDES_RURAIS, filters);
  }

  // Buscar Redes Rurais por tipo
  static async findRedesRuraisByTipo(tipo) {
    return this.findAllRedesRurais({ tipo, ativo: true });
  }

  // Buscar Redes Rurais ativas
  static async findRedesRuraisAtivas() {
    return this.findAllRedesRurais({ ativo: true, status: 'Ativo' });
  }

  // Buscar Redes Rurais por tecnologia
  static async findRedesRuraisByTecnologia(tecnologia) {
    return this.findAllRedesRurais({ tecnologia, ativo: true });
  }

  // Atualizar Rede Rural
  async updateRedeRural(updateData) {
    try {
      if (updateData.codigo && updateData.codigo !== this.codigo) {
        await this.constructor.validateRedeRuralUniqueFields(updateData, this.id);
      }
      return super.update(COLLECTIONS.REDES_RURAIS, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar Rede Rural: ${error.message}`);
    }
  }

  // Excluir Rede Rural
  async deleteRedeRural() {
    try {
      return super.delete(COLLECTIONS.REDES_RURAIS);
    } catch (error) {
      throw new Error(`Erro ao excluir Rede Rural: ${error.message}`);
    }
  }

  // Validação de campos únicos da Rede Rural
  static async validateRedeRuralUniqueFields(data, excludeId = null) {
    const checks = [
      { field: 'codigo', message: 'Código da Rede Rural já está em uso' }
    ];

    for (const check of checks) {
      if (data[check.field]) {
        const existing = await this.findAllRedesRurais({ [check.field]: data[check.field], ativo: true });
        if (existing.length > 0 && (!excludeId || existing[0].id !== excludeId)) {
          throw new Error(check.message);
        }
      }
    }
  }
}

module.exports = RedeRural;
