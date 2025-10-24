// Script para testar os endpoints de backup
const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Função para testar autenticação (removida - não necessária)
async function testAuth() {
  console.log('🔓 Autenticação não necessária - acesso livre');
  return 'no-token-required';
}

// Função para testar GET /backups
async function testGetBackups() {
  try {
    console.log('🔍 Testando GET /backups...');
    const response = await axios.get(`${BASE_URL}/backups`);
    
    console.log('✅ GET /backups:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro GET /backups:', error.response?.data || error.message);
  }
}

// Função para testar POST /backups
async function testCreateBackup() {
  try {
    console.log('➕ Testando POST /backups...');
    const response = await axios.post(`${BASE_URL}/backups`, {
      equipamentoId: 1,
      dataBackup: '2024-01-20',
      observacoes: 'Backup de teste criado via script'
    });
    
    console.log('✅ POST /backups:', response.data);
    return response.data.data?.id;
  } catch (error) {
    console.error('❌ Erro POST /backups:', error.response?.data || error.message);
  }
}

// Função para testar PUT /backups/:id
async function testUpdateBackup(backupId) {
  try {
    console.log(`🔄 Testando PUT /backups/${backupId}...`);
    const response = await axios.put(`${BASE_URL}/backups/${backupId}`, {
      equipamentoId: 1,
      dataBackup: '2024-01-21',
      observacoes: 'Backup atualizado via script'
    });
    
    console.log('✅ PUT /backups:', response.data);
  } catch (error) {
    console.error('❌ Erro PUT /backups:', error.response?.data || error.message);
  }
}

// Função para testar DELETE /backups/:id
async function testDeleteBackup(backupId) {
  try {
    console.log(`🗑️ Testando DELETE /backups/${backupId}...`);
    const response = await axios.delete(`${BASE_URL}/backups/${backupId}`);
    
    console.log('✅ DELETE /backups:', response.data);
  } catch (error) {
    console.error('❌ Erro DELETE /backups:', error.response?.data || error.message);
  }
}

// Função principal de teste
async function runTests() {
  console.log('🚀 Iniciando testes dos endpoints de backup...\n');
  
  // 1. Testar autenticação (não necessária)
  await testAuth();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 2. Testar GET /backups
  await testGetBackups();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 3. Testar POST /backups
  const backupId = await testCreateBackup();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 4. Testar PUT /backups/:id (se backup foi criado)
  if (backupId) {
    await testUpdateBackup(backupId);
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 5. Testar DELETE /backups/:id
    await testDeleteBackup(backupId);
  }
  
  console.log('\n✅ Testes concluídos!');
}

// Executar testes
runTests().catch(console.error);
