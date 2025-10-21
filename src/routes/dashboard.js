const express = require('express');
const Equipamento = require('../models/Equipamento');
const Cidade = require('../models/Cidade');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { ResponseHelper, asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// GET /dashboard
router.get('/', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  // Buscar estatísticas dos equipamentos
  const equipamentosStats = await Equipamento.getStats();
  
  // Buscar cidades ativas
  const cidadesAtivas = await Cidade.findAtivas();
  
  // Calcular resumo geral
  const resumo = {
    totalEquipamentos: equipamentosStats.total,
    equipamentosAtivos: equipamentosStats.porStatus['Ativo'] || 0,
    equipamentosOffline: equipamentosStats.porStatus['Em Manutenção'] || 0,
    totalCidades: cidadesAtivas.length,
    alertasAtivos: 0, // TODO: Implementar quando tiver sistema de alertas
    backupsPendentes: 0 // TODO: Implementar quando tiver sistema de backups
  };

  // Preparar dados para gráficos
  const equipamentosPorTipo = Object.entries(equipamentosStats.porFuncao).map(([tipo, quantidade]) => ({
    tipo,
    quantidade
  }));

  const equipamentosPorStatus = Object.entries(equipamentosStats.porStatus).map(([status, quantidade]) => ({
    status,
    quantidade
  }));

  const equipamentosPorFabricante = Object.entries(equipamentosStats.porFabricante).map(([fabricante, quantidade]) => ({
    fabricante,
    quantidade
  }));

  const equipamentosPorCidade = Object.entries(equipamentosStats.porCidade).map(([cidade, quantidade]) => ({
    cidade,
    quantidade
  }));

  // Buscar equipamentos recentes (últimos 5)
  const equipamentosRecentes = await Equipamento.findAllEquipamentos({ ativo: true });
  equipamentosRecentes.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  const ultimosEquipamentos = equipamentosRecentes.slice(0, 5).map(equipamento => ({
    id: equipamento.id,
    nome: equipamento.nome,
    fabricante: equipamento.fabricante,
    status: equipamento.status,
    cidade: equipamento.endereco?.cidade || 'Não informado',
    criadoEm: equipamento.criadoEm
  }));

  // Buscar equipamentos com problemas (status diferente de Ativo)
  const equipamentosComProblemas = equipamentosRecentes.filter(equipamento => 
    equipamento.status !== 'Ativo'
  ).slice(0, 5).map(equipamento => ({
    id: equipamento.id,
    nome: equipamento.nome,
    status: equipamento.status,
    cidade: equipamento.endereco?.cidade || 'Não informado',
    observacoes: equipamento.observacoes
  }));

  ResponseHelper.success(res, {
    resumo,
    equipamentosPorTipo,
    equipamentosPorStatus,
    equipamentosPorFabricante,
    equipamentosPorCidade,
    ultimosEquipamentos,
    equipamentosComProblemas,
    cidadesAtivas: cidadesAtivas.map(cidade => ({
      id: cidade.id,
      nome: cidade.nome,
      estado: cidade.estado
    }))
  });
}));

// GET /dashboard/stats
router.get('/stats', authenticateToken, requireUser, asyncHandler(async (req, res) => {
  const equipamentosStats = await Equipamento.getStats();
  const cidadesAtivas = await Cidade.findAtivas();

  ResponseHelper.success(res, {
    equipamentos: equipamentosStats,
    cidades: {
      total: cidadesAtivas.length,
      porEstado: cidadesAtivas.reduce((acc, cidade) => {
        acc[cidade.estado] = (acc[cidade.estado] || 0) + 1;
        return acc;
      }, {})
    }
  });
}));

module.exports = router;
