# 🔥 Configuração do Firebase

## ⚠️ Problema Atual
O sistema está funcionando com dados mock porque o Firebase não está configurado. Para usar dados reais, siga as instruções abaixo.

## 📋 Passos para Configurar o Firebase

### 1. Criar Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "zyra-g2-telecom")
4. Siga os passos de configuração

### 2. Configurar Firestore
1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (para desenvolvimento)
4. Selecione uma localização (ex: "southamerica-east1")

### 3. Gerar Chave de Serviço
1. Vá para "Configurações do projeto" (ícone de engrenagem)
2. Clique na aba "Contas de serviço"
3. Clique em "Gerar nova chave privada"
4. Baixe o arquivo JSON

### 4. Configurar Variáveis de Ambiente
1. Copie o arquivo `env.example` para `.env`
2. Preencha as variáveis do Firebase com os dados do arquivo JSON baixado:

```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY_ID=sua-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=sua-service-account@seu-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=seu-client-id
```

### 5. Reiniciar o Servidor
Após configurar as variáveis, reinicie o servidor:
```bash
npm start
```

## 🎯 Status Atual
- ✅ Sistema funcionando com dados mock
- ✅ Dashboard carregando corretamente
- ✅ Todas as funcionalidades operacionais
- ⚠️ Firebase não configurado (opcional)

## 📊 Dados Mock Disponíveis
O sistema está usando dados de exemplo:
- 3 equipamentos (Router, Switch, Access Point)
- 1 POP (Matriz)
- 1 cidade (São Paulo)

## 🔧 Para Desenvolvedores
Se você quiser continuar usando dados mock para desenvolvimento, não é necessário configurar o Firebase. O sistema detecta automaticamente quando o Firebase não está disponível e usa dados simulados.
