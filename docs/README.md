# 🌐 Zyra - Sistema de Documentação e Monitoramento de Equipamentos

## 📋 Visão Geral

O **Zyra** é um sistema completo de documentação e monitoramento de equipamentos desenvolvido especificamente para provedores de internet. O sistema permite organizar a infraestrutura de rede, acompanhar métricas em tempo real e receber alertas sobre problemas críticos antes que impactem os clientes.

## 🎯 Objetivos

- **Documentação Completa**: Inventário detalhado de todos os equipamentos de rede
- **Monitoramento em Tempo Real**: Acompanhamento de performance e disponibilidade
- **Gestão de Topologia**: Visualização e edição da estrutura da rede
- **Alertas Inteligentes**: Notificações proativas sobre problemas
- **Gestão de Backups**: Controle e histórico de backups de configuração
- **Dashboard Unificado**: Visão consolidada da infraestrutura

## 🚀 Funcionalidades Principais

### 1. Inventário de Equipamentos
- Cadastro detalhado com informações técnicas completas
- Upload de fotos dos equipamentos
- Rastreamento de localização física e lógica
- Controle de garantia e manutenção

### 2. Topologia de Rede
- Visualização gráfica interativa das conexões
- Edição manual da topologia
- Mapeamento de links e dependências

### 3. Monitoramento em Tempo Real
- Ping automático (ICMP)
- Coleta de métricas via SNMP/API/SSH
- Gráficos de tráfego e latência
- Monitoramento de recursos (CPU, memória, temperatura)

### 4. Sistema de Alertas
- Configuração de condições de alerta
- Notificações via modal, email, Telegram, WhatsApp
- Histórico de alertas e eventos

### 5. Gestão de Backups
- Upload e armazenamento de arquivos de backup
- Controle de pendências
- Histórico completo de backups

### 6. Dashboard Unificado
- Resumo da rede com KPIs principais
- Status de links e equipamentos
- Indicadores de desempenho
- Alertas ativos

## 🛠️ Stack Tecnológica

- **Frontend**: React
- **Backend**: Node.js + Express
- **Banco de Dados**: Firebase Firestore
- **Armazenamento**: Firebase Storage
- **Coletor de Métricas**: Node.js/Python

## 📂 Estrutura do Projeto

```
zyra/
├── backend/              # API em Node.js/Express
│   ├── src/
│   │   ├── controllers/  # Controladores das rotas
│   │   ├── models/       # Modelos de dados
│   │   ├── routes/       # Definição das rotas
│   │   ├── services/     # Lógica de negócio
│   │   ├── middleware/   # Middlewares
│   │   └── utils/        # Utilitários
│   ├── scripts/          # Scripts de coleta de métricas
│   └── package.json
├── frontend/             # Interface em React
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # Serviços de API
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utilitários
│   │   └── styles/       # Estilos globais
│   └── package.json
├── docs/                 # Documentação
│   ├── api/              # Documentação da API
│   ├── database/         # Modelo de dados
│   └── deployment/       # Guias de deploy
└── README.md
```

## 🗂️ Ordem de Desenvolvimento

1. **Criação do banco de dados no Firebase** na conta Google da G2
2. **Backend conectado ao banco** com rotas de API
3. **Desenvolvimento das funcionalidades básicas**:
   - Inventário de equipamentos
   - Gestão de conectividade e rede
   - Dashboard básico
4. **Funcionalidades avançadas** (em desenvolvimento):
   - Monitoramento em tempo real
   - Sistema de alertas
   - Gestão de backups

## 📊 Modelo de Dados

### Coleções Principais

- `cidades` - Lista de cidades atendidas
- `locais` - POPs, torres, racks
- `tiposEquipamento` - Tipos de equipamentos (switch, roteador, OLT, etc.)
- `equipamentos` - Dados estáticos dos equipamentos
- `alertas` - Eventos críticos e pendências
- `configuracoes` - Parâmetros gerais do sistema

### Subcoleções

- `equipamentos/{id}/links` - Conexões entre equipamentos
- `equipamentos/{id}/metricasPing` - Histórico de ping
- `equipamentos/{id}/metricasInterface` - Tráfego por porta
- `equipamentos/{id}/metricasRecurso` - CPU, memória, temperatura
- `equipamentos/{id}/backups` - Arquivos de backup

## 🔧 Configuração e Deploy

### Pré-requisitos

- Node.js 18+
- Conta Firebase
- Git

### Instalação

1. Clone o repositório
2. Configure as variáveis de ambiente
3. Instale as dependências
4. Configure o Firebase
5. Execute o projeto

## 📈 Roadmap

### Fase 1 - MVP (Inventário)
- [ ] Cadastro de equipamentos
- [ ] Gestão de localizações
- [ ] Dashboard básico
- [ ] Filtros e busca

### Fase 2 - Monitoramento
- [ ] Sistema de ping
- [ ] Coleta de métricas
- [ ] Gráficos de performance
- [ ] Alertas básicos

### Fase 3 - Funcionalidades Avançadas
- [ ] Topologia interativa
- [ ] Gestão de backups
- [ ] Notificações externas
- [ ] Relatórios

## 🤝 Contribuição

Este é um projeto interno da G2 Telecom. Para contribuir:

1. Siga as convenções de código
2. Documente suas alterações
3. Teste antes de fazer commit
4. Use branches para features

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento da G2 Telecom.

---

**Desenvolvido por**: G2 Telecom  
**Versão**: 1.0.0  
**Última atualização**: 2024
