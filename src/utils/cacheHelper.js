class CacheHelper {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time To Live
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos
  }

  // Gerar chave de cache
  generateKey(prefix, ...params) {
    return `${prefix}:${params.join(':')}`;
  }

  // Verificar se cache é válido
  isValid(key) {
    const expiry = this.ttl.get(key);
    return expiry && Date.now() < expiry;
  }

  // Obter do cache
  get(key) {
    if (this.isValid(key)) {
      return this.cache.get(key);
    }
    this.delete(key);
    return null;
  }

  // Salvar no cache
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttl);
  }

  // Deletar do cache
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  // Limpar cache por prefixo
  clearByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.delete(key);
      }
    }
  }

  // Limpar todo o cache
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  // Cache para equipamentos
  static equipamentos = {
    get: (filters) => {
      const key = cacheHelper.generateKey('equipamentos', JSON.stringify(filters));
      return cacheHelper.get(key);
    },
    set: (filters, data) => {
      const key = cacheHelper.generateKey('equipamentos', JSON.stringify(filters));
      cacheHelper.set(key, data, 2 * 60 * 1000); // 2 minutos para equipamentos
    },
    clear: () => {
      cacheHelper.clearByPrefix('equipamentos');
    }
  };

  // Cache para POPs
  static pops = {
    get: (filters) => {
      const key = cacheHelper.generateKey('pops', JSON.stringify(filters));
      return cacheHelper.get(key);
    },
    set: (filters, data) => {
      const key = cacheHelper.generateKey('pops', JSON.stringify(filters));
      cacheHelper.set(key, data, 5 * 60 * 1000); // 5 minutos para POPs
    },
    clear: () => {
      cacheHelper.clearByPrefix('pops');
    }
  };

  // Cache para Redes Rurais
  static redesRurais = {
    get: (filters) => {
      const key = cacheHelper.generateKey('redesRurais', JSON.stringify(filters));
      return cacheHelper.get(key);
    },
    set: (filters, data) => {
      const key = cacheHelper.generateKey('redesRurais', JSON.stringify(filters));
      cacheHelper.set(key, data, 5 * 60 * 1000); // 5 minutos para Redes Rurais
    },
    clear: () => {
      cacheHelper.clearByPrefix('redesRurais');
    }
  };
}

const cacheHelper = new CacheHelper();
module.exports = CacheHelper;
