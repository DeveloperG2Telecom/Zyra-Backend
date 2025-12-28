const { db } = require('./firebase');

// Verificar se o Firebase está configurado
if (!db) {
  console.error('❌ ERRO CRÍTICO: Firebase não está configurado!');
  console.error('Por favor, configure as variáveis de ambiente do Firebase no arquivo .env');
  throw new Error('Firebase não está configurado. Configure as variáveis FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, etc.');
}

console.log('✅ Firebase Firestore disponível');

// Coleções do Firestore
const COLLECTIONS = {
  USERS: 'users',
  EQUIPAMENTOS: 'equipamentos',
  POPS: 'pops',
  REDES_RURAIS: 'redesRurais',
  CIDADES: 'cidades',
  LOCAIS: 'locais',
  TIPOS_EQUIPAMENTO: 'tiposEquipamento',
  ALERTAS: 'alertas',
  CONFIGURACOES: 'configuracoes',
  BACKUPS: 'backups',
  PING_HISTORICO: 'pingHistorico',
  TIPOS_ACESSO: 'tiposAcesso',
  FUNCOES: 'funcoes',
};

// Funções auxiliares para o banco
class Database {
  // Criar documento
  static async create(collection, data) {
    if (!db) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      const docRef = await db.collection(collection).add({
        ...data,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Erro ao criar documento: ${error.message}`);
    }
  }

  // Buscar por ID
  static async findById(collection, id) {
    if (!db) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      const doc = await db.collection(collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Erro ao buscar documento: ${error.message}`);
    }
  }

  // Buscar todos com filtros
  static async findAll(collection, filters = {}) {
    if (!db) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      let query = db.collection(collection);
      
      // Aplicar filtros adicionais (exceto ativo)
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && key !== 'ativo') {
          query = query.where(key, '==', filters[key]);
        }
      });

      const snapshot = await query.get();
      const docs = [];
      snapshot.forEach(doc => {
        const docData = { id: doc.id, ...doc.data() };
        // Filtrar apenas itens ativos (não deletados) - considera ativo se não tem campo ativo ou se ativo === true
        const isActive = docData.ativo === undefined || docData.ativo === true;
        if (isActive) {
          docs.push(docData);
        }
      });
      
      return docs;
    } catch (error) {
      console.error('❌ Erro ao buscar documentos:', error);
      throw new Error(`Erro ao buscar documentos: ${error.message}`);
    }
  }

  // Atualizar documento
  static async update(collection, id, data) {
    if (!db) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      await db.collection(collection).doc(id).update({
        ...data,
        atualizadoEm: new Date(),
      });
      return { id, ...data };
    } catch (error) {
      throw new Error(`Erro ao atualizar documento: ${error.message}`);
    }
  }

  // Deletar documento (soft delete)
  static async delete(collection, id) {
    if (!db) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      await db.collection(collection).doc(id).update({
        ativo: false,
        deletadoEm: new Date(),
      });
      return { id, ativo: false };
    } catch (error) {
      throw new Error(`Erro ao deletar documento: ${error.message}`);
    }
  }

  // Buscar com paginação
  static async findWithPagination(collection, filters = {}, limit = 50, offset = 0) {
    if (!db) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      let query = db.collection(collection);
      
      // Aplicar filtros adicionais (exceto ativo)
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && key !== 'ativo') {
          query = query.where(key, '==', filters[key]);
        }
      });

      // Aplicar paginação somente se limite for numérico válido
      if (limit !== null && limit !== undefined && limit !== 'all') {
        query = query.limit(limit).offset(offset);
      }

      const snapshot = await query.get();
      
      const docs = [];
      snapshot.forEach(doc => {
        const docData = { id: doc.id, ...doc.data() };
        // Filtrar apenas itens ativos (não deletados) - considera ativo se não tem campo ativo ou se ativo === true
        const isActive = docData.ativo === undefined || docData.ativo === true;
        if (isActive) {
          docs.push(docData);
        }
      });
      
      return { data: docs, total: docs.length };
    } catch (error) {
      console.error('❌ Erro ao buscar documentos paginados:', error);
      throw new Error(`Erro ao buscar documentos paginados: ${error.message}`);
    }
  }
}

module.exports = {
  Database,
  COLLECTIONS,
};
