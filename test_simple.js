// Teste simples dos endpoints de backup
const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testando endpoints de backup...\n');

  try {
    // Teste 1: GET /api/v1/backups
    console.log('1. Testando GET /api/v1/backups...');
    const result1 = await testEndpoint('/api/v1/backups');
    console.log(`   Status: ${result1.status}`);
    console.log(`   Response:`, result1.data);
    console.log('');

    // Teste 2: POST /api/v1/backups
    console.log('2. Testando POST /api/v1/backups...');
    const result2 = await testEndpoint('/api/v1/backups', 'POST', {
      equipamentoId: 'test-equipamento-123',
      dataBackup: '2024-10-23',
      observacoes: 'Backup de teste'
    });
    console.log(`   Status: ${result2.status}`);
    console.log(`   Response:`, result2.data);
    console.log('');

    // Teste 3: GET /api/v1/health
    console.log('3. Testando GET /api/v1/health...');
    const result3 = await testEndpoint('/api/v1/health');
    console.log(`   Status: ${result3.status}`);
    console.log(`   Response:`, result3.data);

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

runTests();
