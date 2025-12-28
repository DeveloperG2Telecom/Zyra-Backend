#!/usr/bin/env node

/**
 * Script auxiliar para build do executável
 * Facilita o processo de criação do executável com pkg
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build do executável Zyra Backend...\n');

// Verificar se o pkg está instalado
try {
  require.resolve('pkg');
} catch (e) {
  console.error('❌ Erro: pkg não está instalado!');
  console.log('📦 Instalando pkg...');
  execSync('npm install --save-dev pkg', { stdio: 'inherit' });
}

// Criar diretório dist se não existir
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Diretório dist criado');
}

// Detectar sistema operacional
const platform = process.platform;
let target = '';

switch (platform) {
  case 'win32':
    target = 'node18-win-x64';
    console.log('🪟 Sistema detectado: Windows');
    break;
  case 'linux':
    target = 'node18-linux-x64';
    console.log('🐧 Sistema detectado: Linux');
    break;
  case 'darwin':
    target = 'node18-macos-x64';
    console.log('🍎 Sistema detectado: macOS');
    break;
  default:
    console.log('⚠️  Sistema não reconhecido, usando todos os targets');
    target = 'node18-win-x64,node18-linux-x64,node18-macos-x64';
}

console.log(`\n🎯 Target: ${target}`);
console.log('📦 Iniciando empacotamento...\n');

try {
  // Executar pkg usando npx (para garantir que use a versão local)
  // Usar o arquivo de entrada diretamente para evitar problemas com bin
  const entryFile = path.resolve(__dirname, 'src', 'server.js');
  const outputName = platform === 'win32' ? 'zyra-backend.exe' : 'zyra-backend';
  
  // No Windows, usar barras normais no comando
  const entryFileNormalized = entryFile.replace(/\\/g, '/');
  const distPathNormalized = path.resolve(__dirname, 'dist').replace(/\\/g, '/');
  
  const command = `npx pkg "${entryFileNormalized}" --targets ${target} --output-path "${distPathNormalized}" --output "${outputName}"`;
  execSync(command, { stdio: 'inherit', shell: true });
  
  console.log('\n✅ Build concluído com sucesso!');
  console.log(`📦 Executável gerado em: ${distDir}`);
  
  // Listar arquivos gerados
  const files = fs.readdirSync(distDir);
  console.log('\n📄 Arquivos gerados:');
  files.forEach(file => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   - ${file} (${sizeMB} MB)`);
  });
  
  console.log('\n💡 Próximos passos:');
  console.log('   1. Copie o arquivo .env.example para .env e configure');
  console.log('   2. Coloque o arquivo .env na mesma pasta do executável');
  console.log('   3. Execute o executável');
  
} catch (error) {
  console.error('\n❌ Erro durante o build:', error.message);
  process.exit(1);
}

