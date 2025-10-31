const { db } = require('./firebase');

// Verificar se o Firebase está configurado
if (!db) {
  console.warn('⚠️  Firebase não disponível. Algumas funcionalidades podem não funcionar.');
} else {
  console.log('✅ Firebase Firestore disponível');
}

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
  // Dados mestres para configurações
  TIPOS_ACESSO: 'tiposAcesso',
  FUNCOES: 'funcoes',
};

// Validar se as constantes estão definidas corretamente
console.log('🔍 DATABASE: COLLECTIONS carregadas:', COLLECTIONS);
console.log('🔍 DATABASE: EQUIPAMENTOS:', COLLECTIONS.EQUIPAMENTOS);
console.log('🔍 DATABASE: Tipo de EQUIPAMENTOS:', typeof COLLECTIONS.EQUIPAMENTOS);
console.log('🔍 DATABASE: EQUIPAMENTOS é string?', typeof COLLECTIONS.EQUIPAMENTOS === 'string');
console.log('🔍 DATABASE: EQUIPAMENTOS tem trim?', COLLECTIONS.EQUIPAMENTOS && typeof COLLECTIONS.EQUIPAMENTOS.trim === 'function');

// Funções auxiliares para o banco
class Database {
  // Criar documento
  static async create(collection, data) {
    console.log('🔍 DATABASE: ===== CREATE INICIADO =====');
    console.log('🔍 DATABASE: Collection recebida:', collection);
    console.log('🔍 DATABASE: Tipo da collection:', typeof collection);
    console.log('🔍 DATABASE: Collection é string?', typeof collection === 'string');
    console.log('🔍 DATABASE: Collection tem trim?', collection && typeof collection.trim === 'function');
    console.log('🔍 DATABASE: Data:', data);
    console.log('🔍 DATABASE: Firebase db disponível:', !!db);
    
    if (!db) {
      console.warn('⚠️  Firebase não configurado. Simulando criação de documento.');
      const mockId = 'mock-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      return { 
        id: mockId, 
        ...data,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection) {
        console.error('❌ DATABASE: Collection é null/undefined:', collection);
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      if (typeof collection !== 'string') {
        console.error('❌ DATABASE: Collection não é string:', collection, 'Tipo:', typeof collection);
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      if (collection.trim() === '') {
        console.error('❌ DATABASE: Collection está vazia:', collection);
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
      console.warn('⚠️  Firebase não configurado. Simulando busca por ID.');
      const mockData = this.getMockData(collection);
      return mockData.find(item => item.id === id) || null;
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
    console.log('🔍 DATABASE: ===== FINDALL INICIADO =====');
    console.log('🔍 DATABASE: Collection recebida:', collection);
    console.log('🔍 DATABASE: Tipo da collection:', typeof collection);
    console.log('🔍 DATABASE: Collection é string?', typeof collection === 'string');
    console.log('🔍 DATABASE: Collection tem trim?', collection && typeof collection.trim === 'function');
    console.log('🔍 DATABASE: Filters:', filters);
    console.log('🔍 DATABASE: Firebase db disponível:', !!db);
    
    if (!db) {
      console.warn('⚠️  Firebase não configurado. Retornando dados mock para desenvolvimento.');
      return this.getMockData(collection, filters);
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection) {
        console.error('❌ DATABASE: Collection é null/undefined:', collection);
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      if (typeof collection !== 'string') {
        console.error('❌ DATABASE: Collection não é string:', collection, 'Tipo:', typeof collection);
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      if (collection.trim() === '') {
        console.error('❌ DATABASE: Collection está vazia:', collection);
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

  // Dados mock para desenvolvimento quando Firebase não está configurado
  static getMockData(collection, filters = {}) {
    console.log('⚠️  MOCK DATA: Coleção solicitada:', collection);
    
    const mockData = {
      equipamentos: [
        {
          id: 'mock-1',
          nome: 'Router Principal - Matriz',
          tipo: 'ROTEADOR',
          fabricante: 'Mikrotik',
          modelo: 'RB4011',
          ipPublico: '200.160.2.1',
          ipPrivado: '192.168.1.1',
          status: 'Ativo',
          ativo: true,
          localidade: {
            endereco: 'POP Matriz - São Paulo/SP',
            lat: -23.5505,
            lng: -46.6333
          },
          pop: {
            nome: 'POP Matriz',
            endereco: 'São Paulo/SP'
          },
          cidade: 'São Paulo',
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-2',
          nome: 'Switch Core - Data Center',
          tipo: 'SWITCH',
          fabricante: 'Cisco',
          modelo: 'Catalyst 2960',
          ipPrivado: '192.168.1.2',
          status: 'Ativo',
          ativo: true,
          localidade: {
            endereco: 'POP Filial - Rio de Janeiro/RJ',
            lat: -22.9068,
            lng: -43.1729
          },
          pop: {
            nome: 'POP Filial Rio',
            endereco: 'Rio de Janeiro/RJ'
          },
          cidade: 'Rio de Janeiro',
          criadoEm: new Date(),
          atualizadoEm: new Date()
        },
        {
          id: 'mock-3',
          nome: 'Access Point - Piso 1',
          tipo: 'AP',
          fabricante: 'Ubiquiti',
          modelo: 'UniFi AP AC Pro',
          ipPrivado: '192.168.1.3',
          status: 'Em Manutenção',
          ativo: true,
          localidade: {
            endereco: 'POP Regional - Belo Horizonte/MG',
            lat: -19.9167,
            lng: -43.9345
          },
          pop: {
            nome: 'POP Regional BH',
            endereco: 'Belo Horizonte/MG'
          },
          cidade: 'Belo Horizonte',
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
      ],
      pops: [],
      cidades: [],
      redesRurais: [],
      backups: []
    };

    let data = mockData[collection] || [];
    
    // Aplicar filtros básicos
    if (filters.ativo !== undefined) {
      data = data.filter(item => item.ativo === filters.ativo);
    }
    
    console.log('⚠️  MOCK DATA: Retornando', data.length, 'itens para', collection);
    return data;
  }

  // Atualizar documento
  static async update(collection, id, data) {
    if (!db) {
      console.warn('⚠️  Firebase não configurado. Simulando atualização de documento.');
      return { 
        id, 
        ...data,
        atualizadoEm: new Date()
      };
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
      console.warn('⚠️  Firebase não configurado. Simulando exclusão de documento.');
      return { 
        id, 
        ativo: false,
        deletadoEm: new Date()
      };
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
    console.log('🔍 FIND_WITH_PAGINATION: Iniciando busca...');
    console.log('🔍 FIND_WITH_PAGINATION: Collection:', collection);
    console.log('🔍 FIND_WITH_PAGINATION: Filters:', filters);
    console.log('🔍 FIND_WITH_PAGINATION: Limit:', limit, 'Offset:', offset);
    console.log('🔍 FIND_WITH_PAGINATION: Firebase db disponível:', !!db);

    if (!db) {
      console.warn('⚠️  FIND_WITH_PAGINATION: Firebase não configurado. Usando dados mock.');
      const mockData = this.getMockData(collection, filters);
      // Se nenhum limite for fornecido (null/undefined) ou for 'all', retorne todos
      if (limit === null || limit === undefined || limit === 'all') {
        return { data: mockData, total: mockData.length };
      }
      const paginatedData = mockData.slice(offset, offset + limit);
      return { data: paginatedData, total: mockData.length };
    }
    
    try {
      // Validar se o collection é uma string válida
      if (!collection || typeof collection !== 'string' || collection.trim() === '') {
        console.error('❌ FIND_WITH_PAGINATION: Nome da coleção inválido:', collection);
        throw new Error('Nome da coleção deve ser uma string não vazia');
      }
      
      console.log('🔍 FIND_WITH_PAGINATION: Executando query no Firebase...');
      let query = db.collection(collection);
      console.log('🔍 FIND_WITH_PAGINATION: Query base criada');
      
      // Aplicar filtros adicionais (exceto ativo)
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && key !== 'ativo') {
          console.log('🔍 FIND_WITH_PAGINATION: Aplicando filtro:', key, '=', filters[key]);
          query = query.where(key, '==', filters[key]);
        }
      });

      // Aplicar paginação somente se limite for numérico válido
      if (limit !== null && limit !== undefined && limit !== 'all') {
        console.log('🔍 FIND_WITH_PAGINATION: Aplicando paginação - Limit:', limit, 'Offset:', offset);
        query = query.limit(limit).offset(offset);
      } else {
        console.log('🔍 FIND_WITH_PAGINATION: Sem paginação (retornando todos os registros)');
      }

      console.log('🔍 FIND_WITH_PAGINATION: Executando query...');
      const snapshot = await query.get();
      console.log('🔍 FIND_WITH_PAGINATION: Query executada. Documentos encontrados:', snapshot.size);
      
      const docs = [];
      snapshot.forEach(doc => {
        const docData = { id: doc.id, ...doc.data() };
        // Filtrar apenas itens ativos (não deletados) - considera ativo se não tem campo ativo ou se ativo === true
        const isActive = docData.ativo === undefined || docData.ativo === true;
        if (isActive) {
          console.log('🔍 FIND_WITH_PAGINATION: Documento ativo encontrado:', doc.id, docData);
          docs.push(docData);
        } else {
          console.log('🔍 FIND_WITH_PAGINATION: Documento inativo ignorado:', doc.id, docData);
        }
      });
      
      console.log('✅ FIND_WITH_PAGINATION: Busca concluída:', { 
        total: docs.length, 
        limit, 
        offset,
        data: docs.map(d => ({ id: d.id, nome: d.nome || 'Sem nome' }))
      });
      
      return { data: docs, total: docs.length };
    } catch (error) {
      console.error('❌ FIND_WITH_PAGINATION: Erro na busca:', error);
      console.error('❌ FIND_WITH_PAGINATION: Stack trace:', error.stack);
      throw new Error(`Erro ao buscar documentos paginados: ${error.message}`);
    }
  }
}

module.exports = {
  Database,
  COLLECTIONS,
};
