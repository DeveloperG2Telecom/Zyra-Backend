const BaseModel = require('./BaseModel');
const { COLLECTIONS } = require('../config/database');

class Equipamento extends BaseModel {
  constructor(data) {
    super({
      ...data,
      ativo: data.ativo !== undefined ? data.ativo : true,
      status: data.status || 'Ativo',
      fotos: data.fotos || [],
      monitoramento: data.monitoramento || { ativo: true, tempoPing: 300, limiteLatencia: 150 }
    });
  }

  // Criar equipamento
  static async create(equipamentoData) {
    try {
      // Validações específicas
      await this.validateUniqueFields(equipamentoData);
      return super.create(COLLECTIONS.EQUIPAMENTOS, equipamentoData);
    } catch (error) {
      throw new Error(`Erro ao criar equipamento: ${error.message}`);
    }
  }

  // Métodos específicos do Equipamento
  static async findById(id) {
    return super.findById(COLLECTIONS.EQUIPAMENTOS, id);
  }

  static async findAll(filters = {}) {
    return super.findAll(COLLECTIONS.EQUIPAMENTOS, filters);
  }

  static async findWithPagination(filters = {}, limit = 50, offset = 0) {
    return super.findWithPagination(COLLECTIONS.EQUIPAMENTOS, filters, limit, offset);
  }

  async update(updateData) {
    try {
      // Validações específicas para update
      if (updateData.ipPrivado && updateData.ipPrivado !== this.ipPrivado) {
        await this.constructor.validateUniqueFields(updateData, this.id);
      }
      return super.update(COLLECTIONS.EQUIPAMENTOS, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar equipamento: ${error.message}`);
    }
  }

  async delete() {
    return super.delete(COLLECTIONS.EQUIPAMENTOS);
  }

  // Métodos de busca específicos usando o método genérico
  static async findByFabricante(fabricante) {
    return this.findByField(COLLECTIONS.EQUIPAMENTOS, 'fabricante', fabricante);
  }

  static async findByStatus(status) {
    return this.findByField(COLLECTIONS.EQUIPAMENTOS, 'status', status);
  }

  static async findByCidade(cidade) {
    return this.findByField(COLLECTIONS.EQUIPAMENTOS, 'endereco.cidade', cidade);
  }

  // Validação de campos únicos
  static async validateUniqueFields(data, excludeId = null) {
    const checks = [
      { field: 'ipPrivado', message: 'IP privado já está em uso' },
      { field: 'serial', message: 'Serial já está em uso' }
    ];

    for (const check of checks) {
      if (data[check.field]) {
        const existing = await this.findAll({ [check.field]: data[check.field], ativo: true });
        if (existing.length > 0 && (!excludeId || existing[0].id !== excludeId)) {
          throw new Error(check.message);
        }
      }
    }
  }

  // Estatísticas simplificadas
  static async getStats() {
    try {
      const equipamentos = await this.findAll({ ativo: true });
      
      const stats = {
        total: equipamentos.length,
        porStatus: this.groupBy(equipamentos, 'status'),
        porFabricante: this.groupBy(equipamentos, 'fabricante'),
        porFuncao: this.groupBy(equipamentos, 'funcao'),
        porCidade: this.groupBy(equipamentos, 'endereco.cidade', 'Não informado')
      };

      return stats;
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  // Método auxiliar para agrupar dados
  static groupBy(array, field, defaultValue = 'Não informado') {
    return array.reduce((acc, item) => {
      const value = this.getNestedValue(item, field) || defaultValue;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  // Método auxiliar para acessar propriedades aninhadas
  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

module.exports = Equipamento;
