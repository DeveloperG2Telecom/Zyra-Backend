const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticateToken } = require('../middleware/auth');

// Coleção para armazenar posições da topologia
const TOPOLOGY_COLLECTION = 'TOPOLOGIA';
// Coleção para armazenar etiquetas das conexões
const CONNECTION_LABELS_COLLECTION = 'TOPOLOGIA_CONEXOES';

/**
 * @route GET /api/v1/topologia/posicoes
 * @desc Obtém as posições salvas da topologia
 * @access Public
 */
router.get('/posicoes', async (req, res) => {
  try {
    console.log('🔍 TOPOLOGIA: Buscando posições salvas...');
    
    const snapshot = await db.collection(TOPOLOGY_COLLECTION).get();
    const posicoes = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      posicoes[data.popKey] = {
        x: data.x,
        y: data.y,
        lastUpdated: data.lastUpdated
      };
      console.log(`   🔹 ${data.popKey}: (${data.x}, ${data.y}) - ${data.lastUpdated?.toDate?.() || data.lastUpdated}`);
    });
    
    console.log('✅ TOPOLOGIA: Posições encontradas:', Object.keys(posicoes).length);
    
    res.json({
      success: true,
      data: posicoes
    });
  } catch (error) {
    console.error('❌ TOPOLOGIA: Erro ao buscar posições:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao buscar posições da topologia'
    });
  }
});

/**
 * @route POST /api/v1/topologia/posicoes
 * @desc Salva as posições da topologia (apenas elementos modificados)
 * @access Public
 */
router.post('/posicoes', async (req, res) => {
    try {
      const { posicoes, modificados } = req.body;
      
      // Validação simples
      if (!posicoes || typeof posicoes !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Posições devem ser um objeto'
        });
      }
      
      // Validação adicional dos dados
      console.log('🔍 TOPOLOGIA: Validando dados recebidos:');
      console.log('   📊 Posições:', Object.keys(posicoes).length);
      console.log('   🔄 Modificados:', modificados);
      console.log('   📋 Dados:', JSON.stringify(posicoes, null, 2));
      
      const userId = 'anonymous'; // Usuário anônimo para topologia
      const timestamp = new Date();
      
      // Se não especificou quais foram modificados, salvar todos
      const elementosParaSalvar = modificados && Array.isArray(modificados) 
        ? modificados.filter(key => posicoes[key]) 
        : Object.keys(posicoes);
      
      console.log('💾 TOPOLOGIA: Salvando posições modificadas:', elementosParaSalvar.length, 'de', Object.keys(posicoes).length, 'POPs');
      console.log('   🎯 Elementos a serem salvos:', elementosParaSalvar);
      
      // Salvar apenas os elementos modificados
      const batch = db.batch();
      const promises = [];
      
      for (const popKey of elementosParaSalvar) {
        const posicao = posicoes[popKey];
        if (posicao && typeof posicao.x === 'number' && typeof posicao.y === 'number') {
          const docRef = db.collection(TOPOLOGY_COLLECTION).doc(popKey);
          
          // Usar batch.set sem merge - vai sobrescrever o documento completamente
          batch.set(docRef, {
            popKey,
            x: posicao.x,
            y: posicao.y,
            lastUpdated: timestamp,
            updatedBy: userId
          });
          
          console.log(`📝 TOPOLOGIA: Atualizando ${popKey}: (${posicao.x}, ${posicao.y})`);
        } else {
          console.warn(`⚠️ TOPOLOGIA: Dados inválidos para ${popKey}:`, posicao);
        }
      }
      
      try {
        await batch.commit();
        console.log('✅ TOPOLOGIA: Batch commit realizado com sucesso');
      } catch (commitError) {
        console.error('❌ TOPOLOGIA: Erro no batch commit:', commitError);
        throw commitError;
      }
      
      console.log('✅ TOPOLOGIA: Posições modificadas salvas com sucesso');
      
      res.json({
        success: true,
        message: 'Posições da topologia salvas com sucesso',
        data: {
          savedCount: elementosParaSalvar.length,
          totalCount: Object.keys(posicoes).length,
          modifiedElements: elementosParaSalvar,
          timestamp
        }
      });
    } catch (error) {
      console.error('❌ TOPOLOGIA: Erro ao salvar posições:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao salvar posições da topologia'
      });
    }
  }
);

/**
 * @route PUT /api/v1/topologia/posicoes/:popKey
 * @desc Atualiza a posição de um POP específico
 * @access Public
 */
router.put('/posicoes/:popKey', async (req, res) => {
  try {
    const { popKey } = req.params;
    const { x, y } = req.body;
    
    // Validação
    if (typeof x !== 'number' || typeof y !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Coordenadas x e y devem ser números'
      });
    }
    
    const userId = 'anonymous';
    const timestamp = new Date();
    
    console.log(`💾 TOPOLOGIA: Atualizando posição do POP ${popKey}:`, { x, y });
    
    // Atualizar posição específica
    const docRef = db.collection(TOPOLOGY_COLLECTION).doc(popKey);
    
    await docRef.set({
      popKey,
      x,
      y,
      lastUpdated: timestamp,
      updatedBy: userId
    }, { merge: true });
    
    console.log(`✅ TOPOLOGIA: Posição do POP ${popKey} atualizada com sucesso`);
    
    res.json({
      success: true,
      message: `Posição do POP ${popKey} atualizada com sucesso`,
      data: {
        popKey,
        x,
        y,
        timestamp
      }
    });
  } catch (error) {
    console.error(`❌ TOPOLOGIA: Erro ao atualizar posição do POP ${req.params.popKey}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao atualizar posição da topologia'
    });
  }
});

/**
 * @route DELETE /api/v1/topologia/posicoes
 * @desc Limpa todas as posições salvas da topologia
 * @access Public
 */
router.delete('/posicoes', async (req, res) => {
  try {
    console.log('🗑️ TOPOLOGIA: Limpando todas as posições...');
    
    const snapshot = await db.collection(TOPOLOGY_COLLECTION).get();
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log('✅ TOPOLOGIA: Posições limpas com sucesso');
    
    res.json({
      success: true,
      message: 'Posições da topologia limpas com sucesso'
    });
  } catch (error) {
    console.error('❌ TOPOLOGIA: Erro ao limpar posições:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao limpar posições da topologia'
    });
  }
});

/**
 * @route GET /api/v1/topologia/equipamentos
 * @desc Obtém equipamentos com informações para topologia
 * @access Public
 */
router.get('/equipamentos', async (req, res) => {
  try {
    console.log('🔍 TOPOLOGIA: Buscando equipamentos para topologia...');
    
    const snapshot = await db.collection('equipamentos').get();
    const equipamentos = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      equipamentos.push({
        id: doc.id,
        nome: data.nome,
        tipo: data.tipo || data.fabricante,
        fabricante: data.fabricante,
        modelo: data.modelo,
        ipPrivado: data.ipPrivado,
        ipPublico: data.ipPublico,
        status: data.status || 'Desconhecido',
        pop: data.pop || data.localidade?.endereco || data.cidade || 'Não informado',
        equipamentoAnterior: data.equipamentoAnterior,
        equipamentoPosterior: data.equipamentoPosterior,
        coordenadas: data.coordenadas || { lat: 0, lng: 0 }
      });
    });
    
    console.log('✅ TOPOLOGIA: Equipamentos encontrados:', equipamentos.length);
    
    res.json({
      success: true,
      data: equipamentos
    });
  } catch (error) {
    console.error('❌ TOPOLOGIA: Erro ao buscar equipamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao buscar equipamentos para topologia'
    });
  }
});

/**
 * @route GET /api/v1/topologia/conexoes
 * @desc Obtém todas as etiquetas das conexões da topologia
 * @access Public
 */
router.get('/conexoes', async (req, res) => {
  try {
    console.log('🔍 TOPOLOGIA: Buscando etiquetas das conexões...');
    
    const snapshot = await db.collection(CONNECTION_LABELS_COLLECTION).get();
    const labels = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      labels[doc.id] = data.label || '';
    });
    
    console.log('✅ TOPOLOGIA: Etiquetas encontradas:', Object.keys(labels).length);
    
    res.json({
      success: true,
      data: labels
    });
  } catch (error) {
    console.error('❌ TOPOLOGIA: Erro ao buscar etiquetas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao buscar etiquetas das conexões'
    });
  }
});

/**
 * @route POST /api/v1/topologia/conexoes
 * @desc Salva ou atualiza a etiqueta de uma conexão
 * @access Public
 */
router.post('/conexoes', async (req, res) => {
  try {
    const { connectionId, label } = req.body;
    
    // Validação
    if (!connectionId || typeof connectionId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'ID da conexão é obrigatório'
      });
    }
    
    if (label !== undefined && typeof label !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Etiqueta deve ser uma string'
      });
    }
    
    const timestamp = new Date();
    
    console.log(`💾 TOPOLOGIA: Salvando etiqueta para conexão ${connectionId}:`, label);
    
    // Salvar ou atualizar etiqueta
    const docRef = db.collection(CONNECTION_LABELS_COLLECTION).doc(connectionId);
    
    await docRef.set({
      connectionId,
      label: label || '',
      lastUpdated: timestamp,
      updatedBy: 'anonymous'
    }, { merge: true });
    
    console.log(`✅ TOPOLOGIA: Etiqueta salva com sucesso para conexão ${connectionId}`);
    
    res.json({
      success: true,
      message: 'Etiqueta salva com sucesso',
      data: {
        connectionId,
        label: label || '',
        timestamp
      }
    });
  } catch (error) {
    console.error('❌ TOPOLOGIA: Erro ao salvar etiqueta:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao salvar etiqueta da conexão'
    });
  }
});

/**
 * @route PUT /api/v1/topologia/conexoes/:connectionId
 * @desc Atualiza a etiqueta de uma conexão específica
 * @access Public
 */
router.put('/conexoes/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { label } = req.body;
    
    // Validação
    if (label !== undefined && typeof label !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Etiqueta deve ser uma string'
      });
    }
    
    const timestamp = new Date();
    
    console.log(`💾 TOPOLOGIA: Atualizando etiqueta para conexão ${connectionId}:`, label);
    
    // Atualizar etiqueta
    const docRef = db.collection(CONNECTION_LABELS_COLLECTION).doc(connectionId);
    
    await docRef.set({
      connectionId,
      label: label || '',
      lastUpdated: timestamp,
      updatedBy: 'anonymous'
    }, { merge: true });
    
    console.log(`✅ TOPOLOGIA: Etiqueta atualizada com sucesso para conexão ${connectionId}`);
    
    res.json({
      success: true,
      message: 'Etiqueta atualizada com sucesso',
      data: {
        connectionId,
        label: label || '',
        timestamp
      }
    });
  } catch (error) {
    console.error(`❌ TOPOLOGIA: Erro ao atualizar etiqueta da conexão ${req.params.connectionId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao atualizar etiqueta da conexão'
    });
  }
});

/**
 * @route DELETE /api/v1/topologia/conexoes/:connectionId
 * @desc Remove a etiqueta de uma conexão
 * @access Public
 */
router.delete('/conexoes/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    console.log(`🗑️ TOPOLOGIA: Removendo etiqueta da conexão ${connectionId}`);
    
    const docRef = db.collection(CONNECTION_LABELS_COLLECTION).doc(connectionId);
    await docRef.delete();
    
    console.log(`✅ TOPOLOGIA: Etiqueta removida com sucesso para conexão ${connectionId}`);
    
    res.json({
      success: true,
      message: 'Etiqueta removida com sucesso'
    });
  } catch (error) {
    console.error(`❌ TOPOLOGIA: Erro ao remover etiqueta da conexão ${req.params.connectionId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao remover etiqueta da conexão'
    });
  }
});

module.exports = router;
