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
      console.log('🔍 EQUIPAMENTO: ===== CREATE EQUIPAMENTO INICIADO =====');
      console.log('🔍 EQUIPAMENTO: COLLECTIONS:', COLLECTIONS);
      console.log('🔍 EQUIPAMENTO: COLLECTIONS.EQUIPAMENTOS:', COLLECTIONS.EQUIPAMENTOS);
      console.log('🔍 EQUIPAMENTO: Tipo de COLLECTIONS.EQUIPAMENTOS:', typeof COLLECTIONS.EQUIPAMENTOS);
      console.log('🔍 EQUIPAMENTO: EquipamentoData:', equipamentoData);
      
      // Validação mínima - apenas nome obrigatório
      this.validateEquipamentoRequiredFields(equipamentoData);
      
      // Validação de campos únicos apenas se preenchidos (otimizado)
      if (equipamentoData.ipPrivado || equipamentoData.serialMac) {
        await this.validateEquipamentoUniqueFields(equipamentoData);
      }
      
      console.log('🔍 EQUIPAMENTO: Chamando super.create com collection:', COLLECTIONS.EQUIPAMENTOS);
      const result = await super.create(COLLECTIONS.EQUIPAMENTOS, equipamentoData);
      
      // Limpar cache
      CacheHelper.equipamentos.clear();
      return result;
    } catch (error) {
      console.error('❌ EQUIPAMENTO: Erro ao criar equipamento:', error);
      throw new Error(`Erro ao criar equipamento: ${error.message}`);
    }
  }

  // Validação de campos obrigatórios do equipamento (nome e tipo obrigatórios - otimizado)
  static validateEquipamentoRequiredFields(data) {
    // Validação mínima - apenas nome obrigatório
    if (!data.nome || data.nome.trim() === '') {
      throw new Error('Nome do equipamento é obrigatório');
    }
    
    // Validação de tipo apenas se fornecido
    if (data.tipo && data.tipo.trim() !== '') {
      const tiposValidos = ['MIKROTIK', 'MK CONCENTRADOR', 'RADIO PTP', 'AP', 'MIMOSA', 'OLT', 'ROTEADOR', 'SWITCH', 'FIREWALL', 'SERVIDOR', 'ANTENA', 'OUTROS'];
      if (!tiposValidos.includes(data.tipo)) {
        throw new Error('Tipo do equipamento deve ser um dos valores válidos: ' + tiposValidos.join(', '));
      }
    }
    
    // Validações básicas apenas se os campos estiverem preenchidos
    if (data.ipPublico && data.ipPublico.trim() !== '' && !ValidationHelper.validateIP(data.ipPublico)) {
      throw new Error('IP público inválido');
    }
    if (data.ipPrivado && data.ipPrivado.trim() !== '' && !ValidationHelper.validateIP(data.ipPrivado)) {
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

  // Método para obter estatísticas dos equipamentos
  static async getStats() {
    try {
      const equipamentos = await this.findAllEquipamentos();
      
      const stats = {
        total: equipamentos.length,
        porStatus: {},
        porTipo: {},
        porFabricante: {},
        porCidade: {},
        porFuncao: {}
      };

      equipamentos.forEach(equipamento => {
        // Contar por status
        const status = equipamento.status || 'Desconhecido';
        stats.porStatus[status] = (stats.porStatus[status] || 0) + 1;

        // Contar por tipo
        const tipo = equipamento.tipo || 'Desconhecido';
        stats.porTipo[tipo] = (stats.porTipo[tipo] || 0) + 1;

        // Contar por fabricante
        const fabricante = equipamento.fabricante || 'Desconhecido';
        stats.porFabricante[fabricante] = (stats.porFabricante[fabricante] || 0) + 1;

        // Contar por cidade
        const cidade = equipamento.endereco?.cidade || 'Não informado';
        stats.porCidade[cidade] = (stats.porCidade[cidade] || 0) + 1;

        // Contar por função (usando tipo como função)
        const funcao = equipamento.tipo || 'Desconhecido';
        stats.porFuncao[funcao] = (stats.porFuncao[funcao] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos equipamentos:', error);
      return {
        total: 0,
        porStatus: {},
        porTipo: {},
        porFabricante: {},
        porCidade: {},
        porFuncao: {}
      };
    }
  }
}

module.exports = Equipamento;