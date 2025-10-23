const express = require('express');
const { Database, COLLECTIONS } = require('../config/database');
const { asyncHandler } = require('../utils/responseHelper');

const router = express.Router();

// Função genérica para CRUD de configurações
const createConfigHandler = (collection, entityName) => {
  return {
    // GET - Listar todos
    list: asyncHandler(async (req, res) => {
      console.log(`🔍 BACKEND: Listando ${entityName}`);
      
      try {
        const items = await Database.findAll(collection, { ativo: true });
        
        res.json({
          success: true,
          data: items || [],
          message: `Encontrados ${items?.length || 0} ${entityName}`
        });
        
      } catch (error) {
        console.error(`❌ BACKEND: Erro ao buscar ${entityName}:`, error);
        res.status(500).json({
          success: false,
          error: error.message,
          data: []
        });
      }
    }),

    // POST - Criar novo
    create: asyncHandler(async (req, res) => {
      console.log(`🔍 BACKEND: Criando ${entityName}`);
      
      try {
        const { nome, descricao, ativo = true } = req.body;
        
        if (!nome || nome.trim() === '') {
          return res.status(400).json({
            success: false,
            error: 'Nome é obrigatório',
            data: null
          });
        }
        
        // Verificar duplicatas
        const existing = await Database.findAll(collection, { nome: nome.trim() });
        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            error: `Já existe um ${entityName.toLowerCase()} com este nome`,
            data: null
          });
        }
        
        const newItem = await Database.create(collection, {
          nome: nome.trim(),
          descricao: descricao?.trim() || '',
          ativo: Boolean(ativo),
          criadoPor: 'sistema'
        });
        
        res.status(201).json({
          success: true,
          data: newItem,
          message: `${entityName} criado com sucesso`
        });
        
      } catch (error) {
        console.error(`❌ BACKEND: Erro ao criar ${entityName}:`, error);
        res.status(500).json({
          success: false,
          error: error.message,
          data: null
        });
      }
    }),

    // PUT - Atualizar
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      console.log(`🔍 BACKEND: Atualizando ${entityName}:`, id);
      
      try {
        const existing = await Database.findById(collection, id);
        if (!existing) {
          return res.status(404).json({
            success: false,
            error: `${entityName} não encontrado`,
            data: null
          });
        }
        
        const { nome, descricao, ativo } = req.body;
        
        if (nome && nome.trim() === '') {
          return res.status(400).json({
            success: false,
            error: 'Nome não pode ser vazio',
            data: null
          });
        }
        
        // Verificar duplicatas se nome mudou
        if (nome && nome.trim() !== existing.nome) {
          const duplicates = await Database.findAll(collection, { nome: nome.trim() });
          if (duplicates.length > 0) {
            return res.status(400).json({
              success: false,
              error: `Já existe um ${entityName.toLowerCase()} com este nome`,
              data: null
            });
          }
        }
        
        const updateData = {
          ...(nome && { nome: nome.trim() }),
          ...(descricao !== undefined && { descricao: descricao?.trim() || '' }),
          ...(ativo !== undefined && { ativo: Boolean(ativo) }),
          atualizadoPor: 'sistema'
        };
        
        await Database.update(collection, id, updateData);
        
        console.log(`✅ BACKEND: ${entityName} atualizado com sucesso:`, id, updateData);
        
        res.json({
          success: true,
          data: { id, ...updateData },
          message: `${entityName} atualizado com sucesso`
        });
        
      } catch (error) {
        console.error(`❌ BACKEND: Erro ao atualizar ${entityName}:`, error);
        res.status(500).json({
          success: false,
          error: error.message,
          data: null
        });
      }
    }),

    // DELETE - Deletar
    delete: asyncHandler(async (req, res) => {
      const { id } = req.params;
      console.log(`🔍 BACKEND: Deletando ${entityName}:`, id);
      
      try {
        const existing = await Database.findById(collection, id);
        if (!existing) {
          return res.status(404).json({
            success: false,
            error: `${entityName} não encontrado`,
            data: null
          });
        }
        
        await Database.delete(collection, id);
        
        console.log(`✅ BACKEND: ${entityName} deletado com sucesso:`, id);
        
        res.json({
          success: true,
          data: { id, ativo: false },
          message: `${entityName} deletado com sucesso`
        });
        
      } catch (error) {
        console.error(`❌ BACKEND: Erro ao deletar ${entityName}:`, error);
        res.status(500).json({
          success: false,
          error: error.message,
          data: null
        });
      }
    })
  };
};

// Configurar rotas para cada tipo
const tiposAcesso = createConfigHandler(COLLECTIONS.TIPOS_ACESSO, 'Tipo de Acesso');
const pops = createConfigHandler(COLLECTIONS.POPS, 'POP');
const funcoes = createConfigHandler(COLLECTIONS.FUNCOES, 'Função');

// Rotas para Tipos de Acesso
router.get('/tipos-acesso', tiposAcesso.list);
router.post('/tipos-acesso', tiposAcesso.create);
router.put('/tipos-acesso/:id', tiposAcesso.update);
router.delete('/tipos-acesso/:id', tiposAcesso.delete);

// Rotas para POPs
router.get('/pops', pops.list);
router.post('/pops', pops.create);
router.put('/pops/:id', pops.update);
router.delete('/pops/:id', pops.delete);

// Rotas para Funções
router.get('/funcoes', funcoes.list);
router.post('/funcoes', funcoes.create);
router.put('/funcoes/:id', funcoes.update);
router.delete('/funcoes/:id', funcoes.delete);

module.exports = router;
