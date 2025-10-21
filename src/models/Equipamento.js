const BaseModel = require('./BaseModel');
const { COLLECTIONS } = require('../config/database');
const ValidationHelper = require('../utils/validationHelper');
const CacheHelper = require('../utils/cacheHelper');

class Equipamento extends BaseModel {
  constructor(data) {
    super({
      ...data,
      ativo: data.ativo !== undefined ? data.ativo : true,
      status: data.status || 'Ativo',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
  }


  // Criar equipamento (otimizado)
  static async createEquipamento(equipamentoData) {
    try {
      // Validação mínima - apenas nome obrigatório
      this.validateEquipamentoRequiredFields(equipamentoData);
      
      // Validação de campos únicos apenas se preenchidos (otimizado)
      if (equipamentoData.ipPrivado || equipamentoData.serialMac) {
        await this.validateEquipamentoUniqueFields(equipamentoData);
      }
      
      const result = await super.create(COLLECTIONS.EQUIPAMENTOS, equipamentoData);
      
      // Limpar cache
      CacheHelper.equipamentos.clear();
      return result;
    } catch (error) {
      throw new Error(`Erro ao criar equipamento: ${error.message}`);
    }
  }

  // Validação de campos obrigatórios do equipamento (nome e tipo obrigatórios - otimizado)
  static validateEquipamentoRequiredFields(data) {
    // Validação mínima - nome e tipo obrigatórios
    if (!data.nome || data.nome.trim() === '') {
      throw new Error('Nome do equipamento é obrigatório');
    }
    
    if (!data.tipo || data.tipo.trim() === '') {
      throw new Error('Tipo do equipamento é obrigatório');
    }
    
    const tiposValidos = ['MIKROTIK', 'MK CONCENTRADOR', 'RADIO PTP', 'AP', 'MIMOSA', 'OLT', 'ROTEADOR', 'OUTROS'];
    if (!tiposValidos.includes(data.tipo)) {
      throw new Error('Tipo do equipamento deve ser um dos valores válidos: ' + tiposValidos.join(', '));
    }
    
    // Validações básicas apenas se os campos estiverem preenchidos
    if (data.ipPublico && !ValidationHelper.validateIP(data.ipPublico)) {
      throw new Error('IP público inválido');
    }
    if (data.ipPrivado && !ValidationHelper.validateIP(data.ipPrivado)) {
      throw new Error('IP privado inválido');
    }
  }

  // Buscar equipamento por ID
  static async findEquipamentoById(id) {
    return super.findById(COLLECTIONS.EQUIPAMENTOS, id);
  }

  // Buscar todos os equipamentos (com cache)
  static async findAllEquipamentos(filters = {}) {
    // Verificar cache primeiro
    const cached = CacheHelper.equipamentos.get(filters);
    if (cached) {
      console.log('✅ Cache hit para equipamentos');
      return cached;
    }

    const equipamentos = await super.findAll(COLLECTIONS.EQUIPAMENTOS, filters);

    // Salvar no cache
    CacheHelper.equipamentos.set(filters, equipamentos);
    return equipamentos;
  }

  // Buscar equipamentos por POP
  static async findEquipamentosByPop(popId) {
    return this.findAllEquipamentos({ pop: popId, ativo: true });
  }

  // Buscar equipamentos por Rede Rural
  static async findEquipamentosByRedeRural(redeRuralId) {
    return this.findAllEquipamentos({ redeRural: redeRuralId, ativo: true });
  }

  // Atualizar equipamento
  async updateEquipamento(updateData) {
    try {
      if (updateData.ipPrivado && updateData.ipPrivado !== this.ipPrivado) {
        await this.constructor.validateEquipamentoUniqueFields(updateData, this.id);
      }
      
      const result = await super.update(COLLECTIONS.EQUIPAMENTOS, updateData);
      
      // Limpar cache
      CacheHelper.equipamentos.clear();
      return result;
    } catch (error) {
      throw new Error(`Erro ao atualizar equipamento: ${error.message}`);
    }
  }

  // Excluir equipamento
  async deleteEquipamento() {
    try {
      const result = await super.delete(COLLECTIONS.EQUIPAMENTOS);
      
      // Limpar cache
      CacheHelper.equipamentos.clear();
      return result;
    } catch (error) {
      throw new Error(`Erro ao excluir equipamento: ${error.message}`);
    }
  }

  // Validação de campos únicos do equipamento (otimizada)
  static async validateEquipamentoUniqueFields(data, excludeId = null) {
    await ValidationHelper.validateUniqueFields(data, this, excludeId);
  }
}

module.exports = Equipamento;
module.exports = Equipamento;