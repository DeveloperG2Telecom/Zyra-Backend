// Teste de conexão simples
const net = require('net');

function testConnection(host, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    
    socket.setTimeout(3000);
    
    socket.on('connect', () => {
      console.log(`✅ Conexão estabelecida com ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log(`❌ Timeout ao conectar com ${host}:${port}`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.log(`❌ Erro ao conectar com ${host}:${port}: ${err.message}`);
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function main() {
  console.log('🔍 Testando conectividade...\n');
  
  const isConnected = await testConnection('localhost', 3002);
  
  if (isConnected) {
    console.log('\n✅ Servidor está rodando na porta 3002');
  } else {
    console.log('\n❌ Servidor NÃO está rodando na porta 3002');
    console.log('💡 Execute: npm start ou node src/server.js');
  }
}

main();
