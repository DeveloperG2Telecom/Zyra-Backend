const ping = require('ping');
const { Database, COLLECTIONS } = require('../config/database');

// Armazenamento em memória para os dados de monitoramento
const dadosMonitoramento = new Map();

// Cache para lista de equipamentos (atualizar a cada 5 minutos)
let listaEquipamentosCache = null;
let ultimaAtualizacaoEquipamentos = 0;
const CACHE_EQUIPAMENTOS_DURACAO = 5 * 60 * 1000; // 5 minutos

/**
 * Executa ping ICMP em um equipamento
 * @param {string} ip - IP privado do equipamento
 * @returns {Promise<{success: boolean, latency: number|null, error?: string}>}
 */
async function executarPing(ip) {
  try {
    if (!ip || typeof ip !== 'string') {
      return { success: false, latency: null, error: 'IP inválido' };
    }

    const result = await ping.promise.probe(ip, {
      timeout: 5, // timeout de 5 segundos
      min_reply: 1 // número mínimo de respostas
    });

    if (result.alive) {
      // result.time contém a latência em ms
      const latency = parseFloat(result.time);
      return { 
        success: true, 
        latency: isNaN(latency) ? null : Math.round(latency),
        error: null
      };
    } else {
      return { 
        success: false, 
        latency: null, 
        error: 'Equipamento não respondeu ao ping'
      };
    }
  } catch (error) {
    console.error(`Erro ao executar ping em ${ip}:`, error.message);
    return { 
      success: false, 
      latency: null, 
      error: error.message || 'Erro desconhecido ao executar ping'
    };
  }
}

/**
 * Busca lista de equipamentos do banco (com cache)
 */
async function buscarEquipamentos() {
  const agora = Date.now();
  
  // Se o cache ainda é válido, usar os dados em cache
  if (listaEquipamentosCache && (agora - ultimaAtualizacaoEquipamentos) < CACHE_EQUIPAMENTOS_DURACAO) {
    return listaEquipamentosCache;
  }
  
  // Buscar do banco apenas se o cache expirou
  try {
    const equipamentos = await Database.findWithPagination(COLLECTIONS.EQUIPAMENTOS, {}, null, 0);
    
    if (equipamentos && equipamentos.data && equipamentos.data.length > 0) {
      listaEquipamentosCache = equipamentos.data;
      ultimaAtualizacaoEquipamentos = agora;
      console.log(`📋 Monitoramento: Lista de equipamentos atualizada (${equipamentos.data.length} equipamentos)`);
    }
    
    return listaEquipamentosCache || [];
  } catch (error) {
    console.error('❌ Monitoramento: Erro ao buscar equipamentos:', error.message);
    // Retornar cache anterior se houver erro
    return listaEquipamentosCache || [];
  }
}

/**
 * Executa ping em todos os equipamentos cadastrados
 */
async function monitorarEquipamentos() {
  try {
    // Buscar equipamentos (com cache de 5 minutos)
    const equipamentos = await buscarEquipamentos();
    
    if (!equipamentos || equipamentos.length === 0) {
      console.log('⚠️ Monitoramento: Nenhum equipamento para monitorar');
      return;
    }

    // Filtrar apenas equipamentos com IP privado
    const equipamentosComIP = equipamentos.filter(eq => eq.ipPrivado && eq.ipPrivado.trim() !== '');

    // Executar ping em paralelo para todos os equipamentos com IP privado
    const promessasPing = equipamentosComIP.map(async (equipamento) => {
      const resultado = await executarPing(equipamento.ipPrivado);
      const agora = new Date().toISOString();
      
      // Armazenar resultado em memória
      dadosMonitoramento.set(equipamento.id, {
        equipamentoId: equipamento.id,
        ipPrivado: equipamento.ipPrivado,
        nome: equipamento.nome,
        latencia: resultado.latency,
        online: resultado.success,
        ultimoPing: agora,
        erro: resultado.error || null
      });

      // Salvar histórico no banco (manter apenas últimos 50)
      try {
        await salvarHistoricoPing(equipamento.id, {
          latencia: resultado.latency,
          online: resultado.success,
          timestamp: agora,
          erro: resultado.error || null,
          ipPrivado: equipamento.ipPrivado
        });
      } catch (error) {
        console.error(`Erro ao salvar histórico para ${equipamento.nome}:`, error.message);
      }

      // Log apenas em caso de erro (reduzir logs)
      if (!resultado.success) {
        console.log(`❌ ${equipamento.nome} (${equipamento.ipPrivado}): ${resultado.error || 'Offline'}`);
      }
    });

    // Aguardar todos os pings concluírem
    await Promise.all(promessasPing);
    
    console.log(`✅ Monitoramento: Ping concluído para ${promessasPing.length} equipamentos`);
  } catch (error) {
    console.error('❌ Monitoramento: Erro ao monitorar equipamentos:', error.message);
  }
}

/**
 * Inicia o serviço de monitoramento periódico
 * Executa ping a cada 30 segundos
 */
function iniciarMonitoramento() {
  console.log('🚀 Monitoramento: Iniciando serviço de monitoramento (ping a cada 30 segundos)');
  
  // Executar imediatamente na inicialização
  monitorarEquipamentos();
  
  // Executar a cada 30 segundos
  const intervalo = setInterval(() => {
    monitorarEquipamentos();
  }, 30000); // 30 segundos

  // Retornar função para parar o monitoramento (útil para testes)
  return () => {
    clearInterval(intervalo);
    console.log('🛑 Monitoramento: Serviço de monitoramento parado');
  };
}

/**
 * Retorna os dados de monitoramento de um equipamento específico
 * @param {string} equipamentoId - ID do equipamento
 * @returns {Object|null}
 */
function getDadosMonitoramento(equipamentoId) {
  return dadosMonitoramento.get(equipamentoId) || null;
}

/**
 * Retorna todos os dados de monitoramento
 * @returns {Map}
 */
function getAllDadosMonitoramento() {
  return dadosMonitoramento;
}

/**
 * Retorna os dados de monitoramento como objeto simples
 * @returns {Object}
 */
function getDadosMonitoramentoAsObject() {
  const obj = {};
  dadosMonitoramento.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Salva histórico de ping no banco (mantém apenas últimos 50)
 */
async function salvarHistoricoPing(equipamentoId, dadosPing) {
  try {
    // Buscar histórico atual do equipamento usando findWithPagination para garantir busca completa
    const resultado = await Database.findWithPagination(COLLECTIONS.PING_HISTORICO, {
      equipamentoId: equipamentoId
    }, null, 0);
    
    const historicoAtual = resultado?.data || [];
    
    // Ordenar por timestamp (mais recente primeiro) e manter apenas os 50 mais recentes
    historicoAtual.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Adicionar novo registro
    await Database.create(COLLECTIONS.PING_HISTORICO, {
      equipamentoId: equipamentoId,
      latencia: dadosPing.latencia,
      online: dadosPing.online,
      timestamp: dadosPing.timestamp,
      erro: dadosPing.erro,
      ipPrivado: dadosPing.ipPrivado
    });
    
    // Remover registros além dos 50 mais recentes
    if (historicoAtual.length >= 50) {
      const registrosParaRemover = historicoAtual.slice(49); // Já temos 49, ao adicionar 1 teremos 50
      for (const registro of registrosParaRemover) {
        try {
          await Database.delete(COLLECTIONS.PING_HISTORICO, registro.id);
        } catch (err) {
          // Ignorar erros ao deletar (pode já ter sido deletado)
        }
      }
    }
  } catch (error) {
    // Se não houver histórico ainda, apenas criar o primeiro registro
    try {
      await Database.create(COLLECTIONS.PING_HISTORICO, {
        equipamentoId: equipamentoId,
        latencia: dadosPing.latencia,
        online: dadosPing.online,
        timestamp: dadosPing.timestamp,
        erro: dadosPing.erro,
        ipPrivado: dadosPing.ipPrivado
      });
    } catch (createError) {
      console.error(`Erro ao criar histórico para ${equipamentoId}:`, createError.message);
    }
  }
}

/**
 * Busca histórico de pings de um equipamento
 */
async function buscarHistoricoPing(equipamentoId, limite = 50) {
  try {
    const resultado = await Database.findWithPagination(COLLECTIONS.PING_HISTORICO, {
      equipamentoId: equipamentoId
    }, null, 0);
    
    const historico = resultado?.data || [];
    
    // Ordenar por timestamp (mais antigo primeiro para o gráfico)
    historico.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Limitar aos últimos N registros
    return historico.slice(-limite);
  } catch (error) {
    console.error(`Erro ao buscar histórico para equipamento ${equipamentoId}:`, error.message);
    return [];
  }
}

/**
 * Força atualização da lista de equipamentos (útil após criar/editar equipamentos)
 */
async function atualizarListaEquipamentos() {
  listaEquipamentosCache = null;
  ultimaAtualizacaoEquipamentos = 0;
  return buscarEquipamentos();
}

module.exports = {
  iniciarMonitoramento,
  monitorarEquipamentos,
  getDadosMonitoramento,
  getAllDadosMonitoramento,
  getDadosMonitoramentoAsObject,
  executarPing,
  atualizarListaEquipamentos,
  buscarHistoricoPing
};

