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
      // Se Firebase não estiver configurado, simular criação
      if (!this.db) {
        console.log('⚠️  Simulando criação de equipamento (modo desenvolvimento)');
        
        // Simular criação de equipamento
        const newEquipamento = {
          id: 'mock-equip-' + Date.now(),
          ...equipamentoData,
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        };

        return newEquipamento;
      }

      // Validações específicas
      await this.validateUniqueFields(equipamentoData);
      return super.create(COLLECTIONS.EQUIPAMENTOS, equipamentoData);
    } catch (error) {
      throw new Error(`Erro ao criar equipamento: ${error.message}`);
    }
  }

  // Métodos específicos do Equipamento
  static async findById(id) {
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      console.log('⚠️  Usando dados mockados para buscar equipamento por ID');
      const mockEquipamentos = [
        {
          id: 'mock-equip-1',
          nome: 'Roteador POP Central',
          modelo: 'RB4011iGS+',
          fabricante: 'Mikrotik',
          serial: '7C4E8D123456',
          mac: '48:8F:5A:12:34:56',
          ipPrivado: '192.168.1.1',
          ipPublico: '200.160.1.10',
          portas: 11,
          status: 'Ativo',
          funcao: 'Roteador Principal',
          modoAcesso: 'SSH',
          endereco: {
            cidade: 'São Paulo',
            endereco: 'Rua das Flores, 123'
          },
          coordenadas: {
            lat: -23.5505,
            lng: -46.6333
          },
          alimentacao: {
            tipo: 'DC',
            tensao: '24V',
            consumo: 24
          },
          dataAquisicao: new Date('2023-06-15'),
          garantia: 24,
          firmware: '7.11.2',
          responsavel: {
            instalou: 'João Silva',
            mantem: 'Maria Santos',
            contato: 'maria@G2telecom.com'
          },
          fornecedor: {
            nome: 'Distribuidora Tech',
            contato: 'vendas@tech.com',
            notaFiscal: 'NF-2023-001234'
          },
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-equip-2',
          nome: 'Switch Torre A',
          modelo: 'CRS326-24G-2S+',
          fabricante: 'Mikrotik',
          serial: '7C4E8D789012',
          mac: '48:8F:5A:78:90:12',
          ipPrivado: '192.168.1.2',
          portas: 26,
          status: 'Ativo',
          funcao: 'Switch de Distribuição',
          modoAcesso: 'Web',
          endereco: {
            cidade: 'São Paulo',
            endereco: 'Torre A, Sala 01'
          },
          coordenadas: {
            lat: -23.5505,
            lng: -46.6333
          },
          alimentacao: {
            tipo: 'AC',
            tensao: '220V',
            consumo: 15
          },
          dataAquisicao: new Date('2023-08-20'),
          garantia: 12,
          firmware: '7.11.2',
          responsavel: {
            instalou: 'Pedro Costa',
            mantem: 'Ana Lima',
            contato: 'ana@G2telecom.com'
          },
          fornecedor: {
            nome: 'Tech Solutions',
            contato: 'contato@techsolutions.com',
            notaFiscal: 'NF-2023-005678'
          },
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ];
      
      const equipamento = mockEquipamentos.find(e => e.id === id);
      return equipamento || null;
    }
    
    return super.findById(COLLECTIONS.EQUIPAMENTOS, id);
  }

  static async findAll(filters = {}) {
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      console.log('⚠️  Usando dados mockados de equipamentos para desenvolvimento');
      const mockEquipamentos = [
        {
          id: 'mock-equip-1',
          nome: 'Roteador POP Central',
          modelo: 'RB4011iGS+',
          fabricante: 'Mikrotik',
          serial: '7C4E8D123456',
          mac: '48:8F:5A:12:34:56',
          ipPrivado: '192.168.1.1',
          ipPublico: '200.160.1.10',
          portas: 11,
          status: 'Ativo',
          funcao: 'Roteador Principal',
          modoAcesso: 'SSH',
          endereco: {
            cidade: 'São Paulo',
            endereco: 'Rua das Flores, 123'
          },
          coordenadas: {
            lat: -23.5505,
            lng: -46.6333
          },
          alimentacao: {
            tipo: 'DC',
            tensao: '24V',
            consumo: 24
          },
          dataAquisicao: new Date('2023-06-15'),
          garantia: 24,
          firmware: '7.11.2',
          responsavel: {
            instalou: 'João Silva',
            mantem: 'Maria Santos',
            contato: 'maria@G2telecom.com'
          },
          fornecedor: {
            nome: 'Distribuidora Tech',
            contato: 'vendas@tech.com',
            notaFiscal: 'NF-2023-001234'
          },
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-equip-2',
          nome: 'Switch Torre A',
          modelo: 'CRS326-24G-2S+',
          fabricante: 'Mikrotik',
          serial: '7C4E8D789012',
          mac: '48:8F:5A:78:90:12',
          ipPrivado: '192.168.1.2',
          portas: 26,
          status: 'Ativo',
          funcao: 'Switch de Distribuição',
          modoAcesso: 'Web',
          endereco: {
            cidade: 'São Paulo',
            endereco: 'Torre A, Sala 01'
          },
          coordenadas: {
            lat: -23.5505,
            lng: -46.6333
          },
          alimentacao: {
            tipo: 'AC',
            tensao: '220V',
            consumo: 15
          },
          dataAquisicao: new Date('2023-08-20'),
          garantia: 12,
          firmware: '7.11.2',
          responsavel: {
            instalou: 'Pedro Costa',
            mantem: 'Ana Lima',
            contato: 'ana@G2telecom.com'
          },
          fornecedor: {
            nome: 'Tech Solutions',
            contato: 'contato@techsolutions.com',
            notaFiscal: 'NF-2023-005678'
          },
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ];
      
      // Aplicar filtros nos dados mockados
      let filteredEquipamentos = mockEquipamentos;
      
      if (filters.fabricante) {
        filteredEquipamentos = filteredEquipamentos.filter(e => e.fabricante === filters.fabricante);
      }
      if (filters.status) {
        filteredEquipamentos = filteredEquipamentos.filter(e => e.status === filters.status);
      }
      if (filters['endereco.cidade']) {
        filteredEquipamentos = filteredEquipamentos.filter(e => e.endereco.cidade === filters['endereco.cidade']);
      }
      if (filters.funcao) {
        filteredEquipamentos = filteredEquipamentos.filter(e => e.funcao === filters.funcao);
      }
      if (filters.ativo !== undefined) {
        filteredEquipamentos = filteredEquipamentos.filter(e => e.ativo === filters.ativo);
      }
      
      return filteredEquipamentos;
    }
    
    return super.findAll(COLLECTIONS.EQUIPAMENTOS, filters);
  }

  static async findWithPagination(filters = {}, limit = 50, offset = 0) {
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      const allEquipamentos = await this.findAll(filters);
      
      // Aplicar paginação
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedEquipamentos = allEquipamentos.slice(startIndex, endIndex);
      
      return paginatedEquipamentos;
    }
    
    return super.findWithPagination(COLLECTIONS.EQUIPAMENTOS, filters, limit, offset);
  }

  async update(updateData) {
    try {
      // Se Firebase não estiver configurado, simular atualização
      if (!this.constructor.db) {
        console.log('⚠️  Simulando atualização de equipamento (modo desenvolvimento)');
        
        // Simular atualização
        Object.assign(this, updateData);
        this.atualizadoEm = new Date();
        
        return this;
      }

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
    try {
      // Se Firebase não estiver configurado, simular exclusão
      if (!this.constructor.db) {
        console.log('⚠️  Simulando exclusão de equipamento (modo desenvolvimento)');
        
        // Simular exclusão (soft delete)
        this.ativo = false;
        this.atualizadoEm = new Date();
        
        return { success: true, message: 'Equipamento excluído com sucesso' };
      }

      return super.delete(COLLECTIONS.EQUIPAMENTOS);
    } catch (error) {
      throw new Error(`Erro ao excluir equipamento: ${error.message}`);
    }
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
      console.error('Erro ao obter estatísticas:', error);
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
