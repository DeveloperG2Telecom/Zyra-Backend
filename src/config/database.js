const { db } = require('./firebase');

// Verificar se o Firebase está configurado
if (!db) {
  console.warn('⚠️  Firebase não disponível. Algumas funcionalidades podem não funcionar.');
}

// Coleções do Firestore
const COLLECTIONS = {
  USERS: 'users',
  EQUIPAMENTOS: 'equipamentos',
  CIDADES: 'cidades',
  LOCAIS: 'locais',
  TIPOS_EQUIPAMENTO: 'tiposEquipamento',
  ALERTAS: 'alertas',
  CONFIGURACOES: 'configuracoes',
};

// Funções auxiliares para o banco
class Database {
  // Criar documento
  static async create(collection, data) {
    if (!db) {
      throw new Error('Firebase não configurado. Não é possível criar documentos.');
    }
    
    try {
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
      throw new Error('Firebase não configurado. Não é possível buscar documentos.');
    }
    
    try {
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
      throw new Error('Firebase não configurado. Não é possível buscar documentos.');
    }
    
    try {
      let query = db.collection(collection);
      
      // Aplicar filtros
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(key, '==', filters[key]);
        }
      });

      const snapshot = await query.get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      
      return docs;
    } catch (error) {
      throw new Error(`Erro ao buscar documentos: ${error.message}`);
    }
  }

  // Atualizar documento
  static async update(collection, id, data) {
    try {
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
    try {
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
    try {
      let query = db.collection(collection);
      
      // Aplicar filtros
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(key, '==', filters[key]);
        }
      });

      // Aplicar paginação
      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      
      return docs;
    } catch (error) {
      throw new Error(`Erro ao buscar documentos paginados: ${error.message}`);
    }
  }
}

module.exports = {
  Database,
  COLLECTIONS,
};
