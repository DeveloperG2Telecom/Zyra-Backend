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
      // Se Firebase não estiver configurado, simular criação
      if (!this.db) {
        console.log('⚠️  Simulando criação de cidade (modo desenvolvimento)');
        
        // Simular criação de cidade
        const newCidade = {
          id: 'mock-cidade-' + Date.now(),
          ...cidadeData,
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        };

        return newCidade;
      }

      // Verificar se cidade já existe
      const existingCidade = await this.findAll({ 
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
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      console.log('⚠️  Usando dados mockados para buscar cidade por ID');
      const mockCidades = [
        {
          id: 'mock-cidade-1',
          nome: 'São Paulo',
          estado: 'SP',
          codigoIBGE: '3550308',
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-cidade-2',
          nome: 'Rio de Janeiro',
          estado: 'RJ',
          codigoIBGE: '3304557',
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-cidade-3',
          nome: 'Belo Horizonte',
          estado: 'MG',
          codigoIBGE: '3106200',
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ];
      
      const cidade = mockCidades.find(c => c.id === id);
      return cidade || null;
    }
    
    return super.findById(COLLECTIONS.CIDADES, id);
  }

  static async findAll(filters = {}) {
    // Se Firebase não estiver configurado, usar dados mockados
    if (!this.db) {
      console.log('⚠️  Usando dados mockados de cidades para desenvolvimento');
      const mockCidades = [
        {
          id: 'mock-cidade-1',
          nome: 'São Paulo',
          estado: 'SP',
          codigoIBGE: '3550308',
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-cidade-2',
          nome: 'Rio de Janeiro',
          estado: 'RJ',
          codigoIBGE: '3304557',
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-cidade-3',
          nome: 'Belo Horizonte',
          estado: 'MG',
          codigoIBGE: '3106200',
          ativa: true,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ];
      
      // Aplicar filtros nos dados mockados
      let filteredCidades = mockCidades;
      
      if (filters.estado) {
        filteredCidades = filteredCidades.filter(c => c.estado === filters.estado);
      }
      if (filters.nome) {
        filteredCidades = filteredCidades.filter(c => c.nome === filters.nome);
      }
      if (filters.ativa !== undefined) {
        filteredCidades = filteredCidades.filter(c => c.ativa === filters.ativa);
      }
      
      return filteredCidades;
    }
    
    return super.findAll(COLLECTIONS.CIDADES, filters);
  }

  async update(updateData) {
    try {
      // Se Firebase não estiver configurado, simular atualização
      if (!this.constructor.db) {
        console.log('⚠️  Simulando atualização de cidade (modo desenvolvimento)');
        
        // Simular atualização
        Object.assign(this, updateData);
        this.atualizadoEm = new Date();
        
        return this;
      }

      // Verificar se nova cidade já existe (se estiver sendo alterada)
      if (updateData.nome && updateData.estado && 
          (updateData.nome !== this.nome || updateData.estado !== this.estado)) {
        const existingCidade = await this.constructor.findAll({ 
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
    try {
      // Se Firebase não estiver configurado, simular exclusão
      if (!this.constructor.db) {
        console.log('⚠️  Simulando exclusão de cidade (modo desenvolvimento)');
        
        // Simular exclusão (soft delete)
        this.ativa = false;
        this.atualizadoEm = new Date();
        
        return { success: true, message: 'Cidade excluída com sucesso' };
      }

      return super.delete(COLLECTIONS.CIDADES);
    } catch (error) {
      throw new Error(`Erro ao excluir cidade: ${error.message}`);
    }
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
