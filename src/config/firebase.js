const admin = require('firebase-admin');
require('dotenv').config();

// Configuração simplificada do Firebase
const initializeFirebase = () => {
  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️  Firebase não configurado. Usando modo de desenvolvimento sem Firebase.');
    return {
      db: null,
      storage: null,
      admin: null
    };
  }

  if (!admin.apps.length) {
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token'
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase:', error.message);
      return {
        db: null,
        storage: null,
        admin: null
      };
    }
  }

  return {
    db: admin.firestore(),
    storage: admin.storage(),
    admin
  };
};

// Inicializar e exportar
const { db, storage } = initializeFirebase();

module.exports = { db, storage, admin };
