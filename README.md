# 🌐 Zyra

**Zyra** é um sistema de **documentação e monitoramento de equipamentos** desenvolvido para provedores de internet.  
Com ele, você organiza sua infraestrutura, acompanha métricas em tempo real e recebe alertas sobre problemas críticos antes que impactem os clientes.  

---

## 🚀 Funcionalidades

- **Inventário de Equipamentos**  
  Cadastro detalhado (modelo, fabricante, IP, localização, firmware, status, etc.).

- **Topologia de Rede**  
  Visualização gráfica interativa para mapear conexões entre equipamentos.

- **Monitoramento em Tempo Real**  
  - Ping automático (ICMP)  
  - Métricas via SNMP/API/SSH (CPU, memória, tráfego, temperatura)  
  - Gráficos de tráfego e latência  

- **Alertas Inteligentes**  
  Notificações configuráveis (latência alta, equipamento offline, porta saturada).  

- **Gestão de Backups**  
  Histórico de backups por equipamento com alertas de pendência.  

- **Dashboard Unificado**  
  Resumo da rede com status de links, alertas ativos e indicadores de desempenho.  

---

## 🛠️ Tecnologias

- **Frontend:** React  
- **Backend/API:** Node.js + Express  
- **Banco de Dados:** Firebase Firestore  
- **Armazenamento:** Firebase Storage  
- **Coletor de Métricas:** Node.js/Python  

---

## 📂 Estrutura do Projeto

```bash
zyra/
├── backend/         # API em Node.js/Express
├── frontend/        # Interface em React
├── docs/            # Documentação e diagramas
└── README.md        # Este arquivo
