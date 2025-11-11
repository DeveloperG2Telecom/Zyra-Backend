const express = require('express');
const router = express.Router();
const Backup = require('../models/Backup');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { createResponse } = require('../utils/responseHelper');

// Modelo Backup com métodos estáticos - não precisa instanciar

// Middleware de autenticação removido para simplificar acesso
// router.use(authenticateToken);

// GET /api/v1/backups - Listar todos os backups
router.get('/', async (req, res) => {
  try {
    console.log('🔍 BACKUP: Buscando todos os backups');
    
    const filters = {
      equipamentoId: req.query.equipamentoId
    };
    
    const backups = await Backup.findAll(filters);
    
    console.log(`✅ BACKUP: ${backups.length} backups encontrados`);
    
    res.json(createResponse(true, 'Backups carregados com sucesso', backups));
  } catch (error) {
    console.error('❌ BACKUP: Erro ao buscar backups:', error);
    res.status(500).json(createResponse(false, 'Erro interno do servidor', null));
  }
});

// GET /api/v1/backups/:id - Buscar backup por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 BACKUP: Buscando backup ID: ${id}`);
    
    const backup = await Backup.findById(id);
    
    if (!backup) {
      return res.status(404).json(createResponse(false, 'Backup não encontrado', null));
    }
    
    console.log('✅ BACKUP: Backup encontrado:', backup);
    res.json(createResponse(true, 'Backup carregado com sucesso', backup));
  } catch (error) {
    console.error('❌ BACKUP: Erro ao buscar backup:', error);
    res.status(500).json(createResponse(false, 'Erro interno do servidor', null));
  }
});

// GET /api/v1/backups/equipamento/:equipamentoId - Buscar backups por equipamento
router.get('/equipamento/:equipamentoId', async (req, res) => {
  try {
    const { equipamentoId } = req.params;
    console.log(`🔍 BACKUP: Buscando backups do equipamento: ${equipamentoId}`);
    
    const backups = await Backup.findByEquipamento(equipamentoId);
    
    console.log(`✅ BACKUP: ${backups.length} backups encontrados para o equipamento`);
    res.json(createResponse(true, 'Backups do equipamento carregados com sucesso', backups));
  } catch (error) {
    console.error('❌ BACKUP: Erro ao buscar backups do equipamento:', error);
    res.status(500).json(createResponse(false, 'Erro interno do servidor', null));
  }
});

// POST /api/v1/backups - Criar novo backup
router.post('/', async (req, res) => {
  try {
    const { equipamentoId, dataBackup, observacoes } = req.body;
    console.log('🔍 BACKUP: Criando novo backup:', { equipamentoId, dataBackup, observacoes });
    
    // Validações básicas
    if (!equipamentoId || !dataBackup) {
      return res.status(400).json(createResponse(false, 'Equipamento e data do backup são obrigatórios', null));
    }
    
    // Verificar se a data é válida
    const dataBackupDate = new Date(dataBackup);
    if (isNaN(dataBackupDate.getTime())) {
      return res.status(400).json(createResponse(false, 'Data do backup inválida', null));
    }
    
    const backupData = {
      equipamentoId,
      dataBackup,
      observacoes: observacoes || ''
    };
    
    const novoBackup = await Backup.create(backupData);
    
    console.log('✅ BACKUP: Backup criado com sucesso:', novoBackup);
    res.status(201).json(createResponse(true, 'Backup criado com sucesso', novoBackup));
  } catch (error) {
    console.error('❌ BACKUP: Erro ao criar backup:', error);
    res.status(500).json(createResponse(false, 'Erro interno do servidor', null));
  }
});

// PUT /api/v1/backups/:id - Atualizar backup
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { equipamentoId, dataBackup, observacoes } = req.body;
    console.log(`🔍 BACKUP: Atualizando backup ID: ${id}`, { equipamentoId, dataBackup, observacoes });
    
    // Validações básicas
    if (!equipamentoId || !dataBackup) {
      return res.status(400).json(createResponse(false, 'Equipamento e data do backup são obrigatórios', null));
    }
    
    // Verificar se a data é válida
    const dataBackupDate = new Date(dataBackup);
    if (isNaN(dataBackupDate.getTime())) {
      return res.status(400).json(createResponse(false, 'Data do backup inválida', null));
    }
    
    const backupData = {
      equipamentoId,
      dataBackup,
      observacoes: observacoes || ''
    };
    
    const backupAtualizado = await Backup.update(id, backupData);
    
    console.log('✅ BACKUP: Backup atualizado com sucesso:', backupAtualizado);
    res.json(createResponse(true, 'Backup atualizado com sucesso', backupAtualizado));
  } catch (error) {
    console.error('❌ BACKUP: Erro ao atualizar backup:', error);
    
    if (error.message === 'Backup não encontrado') {
      return res.status(404).json(createResponse(false, 'Backup não encontrado', null));
    }
    
    res.status(500).json(createResponse(false, 'Erro interno do servidor', null));
  }
});

// DELETE /api/v1/backups/:id - Deletar backup
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 BACKUP: Deletando backup ID: ${id}`);
    
    await Backup.delete(id);
    
    console.log('✅ BACKUP: Backup deletado com sucesso');
    res.json(createResponse(true, 'Backup deletado com sucesso', null));
  } catch (error) {
    console.error('❌ BACKUP: Erro ao deletar backup:', error);
    
    if (error.message === 'Backup não encontrado') {
      return res.status(404).json(createResponse(false, 'Backup não encontrado', null));
    }
    
    res.status(500).json(createResponse(false, 'Erro interno do servidor', null));
  }
});

module.exports = router;
