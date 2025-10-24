const { Database, COLLECTIONS } = require('../config/database');

class Backup {
  constructor(data) {
    Object.assign(this, data);
  }

  // Criar backup
  static async create(backupData) {
    const { equipamentoId, dataBackup, observacoes } = backupData;
    
    try {
      const result = await Database.create(COLLECTIONS.BACKUPS || 'backups', {
        equipamentoId,
        dataBackup,
        observacoes: observacoes || '',
        ativo: true
      });
      
      return new Backup(result);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw new Error('Erro ao criar backup');
    }
  }

  // Buscar todos os backups
  static async findAll(filters = {}) {
    try {
      const results = await Database.findAll(COLLECTIONS.BACKUPS || 'backups', {
        ...filters,
        ativo: true
      });
      
      return results.map(backup => new Backup(backup));
    } catch (error) {
      console.error('Erro ao buscar backups:', error);
      throw new Error('Erro ao buscar backups');
    }
  }

  // Buscar backup por ID
  static async findById(id) {
    try {
      const result = await Database.findById(COLLECTIONS.BACKUPS || 'backups', id);
      return result ? new Backup(result) : null;
    } catch (error) {
      console.error('Erro ao buscar backup por ID:', error);
      throw new Error('Erro ao buscar backup');
    }
  }

  // Atualizar backup
  static async update(id, backupData) {
    const { equipamentoId, dataBackup, observacoes } = backupData;
    
    try {
      const result = await Database.update(COLLECTIONS.BACKUPS || 'backups', id, {
        equipamentoId,
        dataBackup,
        observacoes: observacoes || ''
      });
      
      return new Backup(result);
    } catch (error) {
      console.error('Erro ao atualizar backup:', error);
      throw new Error('Erro ao atualizar backup');
    }
  }

  // Deletar backup
  static async delete(id) {
    try {
      await Database.delete(COLLECTIONS.BACKUPS || 'backups', id);
      return true;
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      throw new Error('Erro ao deletar backup');
    }
  }

  // Buscar backups por equipamento
  static async findByEquipamento(equipamentoId) {
    try {
      const results = await Database.findAll(COLLECTIONS.BACKUPS || 'backups', {
        equipamentoId,
        ativo: true
      });
      
      return results.map(backup => new Backup(backup));
    } catch (error) {
      console.error('Erro ao buscar backups por equipamento:', error);
      throw new Error('Erro ao buscar backups do equipamento');
    }
  }

  // Buscar último backup de um equipamento
  static async findLastByEquipamento(equipamentoId) {
    try {
      const results = await Database.findAll(COLLECTIONS.BACKUPS || 'backups', {
        equipamentoId,
        ativo: true
      });
      
      // Ordenar por data e pegar o primeiro (mais recente)
      const sortedResults = results.sort((a, b) => new Date(b.dataBackup) - new Date(a.dataBackup));
      return sortedResults.length > 0 ? new Backup(sortedResults[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar último backup:', error);
      throw new Error('Erro ao buscar último backup');
    }
  }
}

module.exports = Backup;
