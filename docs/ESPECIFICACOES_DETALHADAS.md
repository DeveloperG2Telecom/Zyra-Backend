# 📋 Especificações Detalhadas do Sistema Zyra

## 🏗️ Sistema de Documentação e Monitoramento de Equipamentos para Provedora de Internet

### 📌 1. Inventário de Equipamentos (Dados Estáticos)

Cada equipamento terá as seguintes informações no cadastro:

#### Informações Básicas
- **Nome/Identificação**: Identificador único do equipamento
- **Modelo**: Modelo específico do equipamento
- **Fabricante**: Mikrotik, Huawei, Ubiquiti, Cisco, etc.
- **Serial/MAC**: Número de série e endereço MAC
- **IP Público**: Endereço IP público (se aplicável)
- **IP Privado**: Endereço IP privado na rede interna

#### Documentação Visual
- **Foto do Equipamento**: 
  - Armazenada no Firebase Storage
  - Não como URL externa
  - Múltiplas fotos permitidas
  - Compressão automática

#### Especificações Técnicas
- **Quantidade de Portas**: Número total de portas físicas
- **Alimentação**: 
  - Tipo (AC/DC)
  - Tensão (V)
  - Consumo (W)
- **Data de Aquisição**: Data de compra do equipamento
- **Tempo de Garantia**: Período de garantia em meses/anos
- **Versão de Firmware/Software**: Versão atual instalada

#### Localização
- **Endereço Completo**:
  - Cidade
  - Endereço físico
  - Torre (se aplicável)
  - Sala técnica
  - Rack
  - Posição no rack
- **Coordenadas GPS**: Latitude e longitude precisas
- **Localização**: Campo de texto livre para detalhes adicionais

#### Funcionalidade
- **Função na Rede**: 
  - OLT (Optical Line Terminal)
  - ONU (Optical Network Unit)
  - Switch
  - Roteador
  - Rádio
  - Firewall
  - Servidor
  - Outros
- **Status Atual**:
  - Ativo
  - Em manutenção
  - Reserva
  - Descartado
  - Em teste

#### Acesso e Configuração
- **Porta de Acesso**: Porta específica para acesso (opcional)
- **Modo de Acesso**:
  - Telnet
  - SSH
  - Web (HTTP/HTTPS)
  - Winbox (Mikrotik)
  - SNMP
  - API REST
- **Observações Técnicas**: Campo livre para anotações importantes

### 📌 2. Conectividade e Rede

#### Relacionamentos entre Equipamentos
- **Origem do Sinal**: Equipamento ou ponto de origem
- **Destino do Sinal**: Equipamento ou ponto de destino
- **Rede Associada**:
  - VLAN
  - Sub-rede
  - PPPoE
  - BGP
  - ASN (Autonomous System Number)
- **Capacidade Máxima**: Suportada em Mbps/Gbps
- **Histórico de Links**: Registro de todas as conexões anteriores

#### Topologia da Rede
- **Tela Gráfica Interativa**:
  - Diagrama visual da rede
  - Equipamentos representados por ícones
  - Conexões representadas por linhas
  - Drag & drop para reorganização
- **Edição Manual**:
  - Adicionar/remover conexões
  - Editar propriedades dos links
  - Redirecionamento em caso de falha
  - Backup da topologia

### 📌 3. Gestão Operacional

#### Responsabilidade e Fornecimento
- **Responsável Técnico**: 
  - Quem instalou
  - Quem mantém
  - Contato de emergência
- **Fornecedor**: 
  - Revendedor
  - Fabricante
  - Contato comercial
- **Documentação**:
  - Nota fiscal
  - Número do pedido
  - Contrato de garantia
  - SLA (Service Level Agreement)

#### Histórico e Logs
- **Histórico de Manutenções**:
  - Trocas de peças
  - Reparos realizados
  - Upgrades de firmware
  - Manutenções preventivas
- **Logs de Alterações**:
  - Quem editou
  - Quando foi editado
  - O que foi alterado
  - Motivo da alteração

### 📌 4. Monitoramento em Tempo Real

#### Coleta Automática de Dados
- **Ping (ICMP)**:
  - Status online/offline
  - Tempo de resposta
  - Perda de pacotes
  - Frequência configurável
- **SNMP/API/SSH**:
  - CPU (utilização %)
  - Memória (uso/disponível)
  - Temperatura
  - Tráfego por porta
  - Uptime
  - Interfaces ativas

#### Configuração do Monitoramento
- **Configurações Gerais**:
  - Tempo de ping (intervalo)
  - Limite de latência aceitável
  - Parâmetros de coleta SNMP
  - Timeout de conexão
  - Retry attempts

#### Dashboard de Monitoramento
- **Métricas em Tempo Real**:
  - Tempo médio de ping por equipamento
  - Status de disponibilidade
  - Utilização de recursos
- **Visão Geral**:
  - Quantidade por tipo de equipamento
  - Equipamentos offline
  - Alertas ativos
- **Gráficos**:
  - Tráfego de rede
  - Latência histórica
  - Utilização de CPU/memória
  - Temperatura

### 📌 5. Alertas e Notificações

#### Condições Configuráveis
- **Ping Alto**: Latência acima do limite
- **CPU Alta**: Utilização acima de X%
- **Porta Saturada**: Tráfego próximo ao limite
- **Equipamento Offline**: Sem resposta ao ping
- **Temperatura Alta**: Acima do limite seguro
- **Memória Baixa**: Disponível abaixo de X%

#### Sistema de Notificações
- **Registro de Alertas**: Armazenamento no banco de dados
- **Modal de Aviso**: Notificação no sistema
- **Notificações Externas**:
  - Telegram
  - WhatsApp
  - Email
  - SMS (futuro)

#### Gestão de Alertas
- **Histórico**: Todos os alertas gerados
- **Status**: Ativo, Resolvido, Ignorado
- **Escalação**: Alertas não resolvidos
- **Relatórios**: Estatísticas de alertas

### 📌 6. Gestão de Backups

#### Sistema de Backups por Equipamento
- **Vinculação**: Cada backup vinculado ao ID do equipamento
- **Armazenamento**: Arquivos no Firebase Storage
- **Metadados**:
  - Data do backup
  - Responsável pelo backup
  - Tipo de backup (configuração, firmware, etc.)
  - Tamanho do arquivo
  - Hash de verificação

#### Controle de Pendências
- **Alertas de Pendência**:
  - "Passaram 40 dias sem backup neste equipamento"
  - Configurável por tipo de equipamento
  - Modal de alerta para técnicos
- **Dashboard de Backups**:
  - Equipamentos com backup em dia
  - Equipamentos pendentes
  - Próximos vencimentos
  - Histórico de backups

#### Funcionalidades de Backup
- **Upload Manual**: Interface para upload de arquivos
- **Agendamento**: Backup automático (futuro)
- **Verificação**: Validação de integridade
- **Compressão**: Otimização de espaço
- **Versionamento**: Múltiplas versões

### 📌 7. Organização do Banco de Dados (Firebase Firestore)

#### Estrutura de Coleções

```
cidades/
├── {cidadeId}/
    ├── nome: string
    ├── estado: string
    ├── codigoIBGE: string
    └── ativa: boolean

locais/
├── {localId}/
    ├── nome: string
    ├── cidade: string (referência)
    ├── tipo: string (POP, Torre, Rack)
    ├── endereco: string
    ├── coordenadas: {lat, lng}
    └── ativo: boolean

tiposEquipamento/
├── {tipoId}/
    ├── nome: string
    ├── fabricante: string
    ├── categoria: string
    ├── portas: number
    └── ativo: boolean

equipamentos/
├── {equipamentoId}/
    ├── nome: string
    ├── modelo: string
    ├── fabricante: string
    ├── serial: string
    ├── mac: string
    ├── ipPublico: string
    ├── ipPrivado: string
    ├── fotos: array
    ├── portas: number
    ├── alimentacao: object
    ├── dataAquisicao: timestamp
    ├── garantia: number
    ├── firmware: string
    ├── endereco: object
    ├── coordenadas: {lat, lng}
    ├── funcao: string
    ├── status: string
    ├── observacoes: string
    ├── portaAcesso: number
    ├── modoAcesso: string
    ├── responsavel: string
    ├── fornecedor: string
    ├── notaFiscal: string
    ├── contrato: string
    ├── criadoEm: timestamp
    ├── atualizadoEm: timestamp
    └── criadoPor: string

equipamentos/{id}/links/
├── {linkId}/
    ├── origem: string
    ├── destino: string
    ├── rede: string
    ├── capacidade: number
    ├── ativo: boolean
    └── criadoEm: timestamp

equipamentos/{id}/metricasPing/
├── {metricaId}/
    ├── timestamp: timestamp
    ├── latencia: number
    ├── perda: number
    ├── status: string
    └── coletadoPor: string

equipamentos/{id}/metricasInterface/
├── {metricaId}/
    ├── timestamp: timestamp
    ├── interface: string
    ├── trafegoIn: number
    ├── trafegoOut: number
    ├── status: string
    └── coletadoPor: string

equipamentos/{id}/metricasRecurso/
├── {metricaId}/
    ├── timestamp: timestamp
    ├── cpu: number
    ├── memoria: number
    ├── temperatura: number
    ├── uptime: number
    └── coletadoPor: string

equipamentos/{id}/backups/
├── {backupId}/
    ├── nome: string
    ├── arquivo: string (path no Storage)
    ├── tipo: string
    ├── tamanho: number
    ├── hash: string
    ├── data: timestamp
    ├── responsavel: string
    └── observacoes: string

alertas/
├── {alertaId}/
    ├── equipamento: string (referência)
    ├── tipo: string
    ├── severidade: string
    ├── mensagem: string
    ├── status: string
    ├── criadoEm: timestamp
    ├── resolvidoEm: timestamp
    └── resolvidoPor: string

configuracoes/
├── {configId}/
    ├── tempoPing: number
    ├── limiteLatencia: number
    ├── diasSemBackup: number
    ├── timeoutConexao: number
    ├── retryAttempts: number
    ├── notificacoes: object
    └── atualizadoEm: timestamp
```

### 📌 8. Tecnologias e Arquitetura

#### Frontend (React)
- **Framework**: React 18+
- **Roteamento**: React Router
- **Estado**: Context API / Redux Toolkit
- **UI**: Material-UI ou Ant Design
- **Gráficos**: Chart.js ou Recharts
- **Mapas**: Leaflet ou Google Maps
- **Upload**: React Dropzone

#### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Autenticação**: Firebase Auth
- **Validação**: Joi ou Yup
- **Documentação**: Swagger/OpenAPI
- **Logs**: Winston
- **Monitoramento**: PM2

#### Banco de Dados (Firebase)
- **Firestore**: Banco NoSQL
- **Storage**: Armazenamento de arquivos
- **Auth**: Autenticação
- **Functions**: Serverless functions
- **Hosting**: Deploy do frontend

#### Coletor de Métricas
- **Linguagem**: Node.js ou Python
- **SNMP**: net-snmp (Node) ou pysnmp (Python)
- **Ping**: ping (Node) ou ping3 (Python)
- **SSH**: ssh2 (Node) ou paramiko (Python)
- **Agendamento**: node-cron ou APScheduler

### 📌 9. Exemplo Prático de Uso

#### Dashboard Principal
O técnico acessa o dashboard e visualiza:

1. **Resumo da Rede**:
   - 15 switches ativos
   - 8 rádios online
   - 3 roteadores em operação
   - 2 equipamentos offline

2. **Métricas de Performance**:
   - Ping médio: 45ms
   - Switch Torre A: 200ms (ALERTA)
   - Roteador POP Central: 25ms (OK)

3. **Alertas Ativos**:
   - "Switch Torre A acima de 200ms de latência"
   - "Faz 45 dias sem backup do Roteador POP Central"
   - "CPU alta no Switch Sala 2 (85%)"

#### Gestão de Backups
Na seção de Backups:

1. **Status dos Backups**:
   - ✅ 12 equipamentos com backup em dia
   - ⚠️ 3 equipamentos com backup pendente
   - ❌ 1 equipamento sem backup há 60 dias

2. **Ações Disponíveis**:
   - Upload de novo backup
   - Download de backup existente
   - Agendar backup automático
   - Configurar alertas de pendência

#### Topologia da Rede
Na visualização da topologia:

1. **Diagrama Interativo**:
   - Equipamentos representados por ícones
   - Conexões por linhas coloridas
   - Status visual (verde=OK, vermelho=problema)

2. **Edição Manual**:
   - Drag & drop para reorganizar
   - Adicionar/remover conexões
   - Editar propriedades dos links
   - Salvar alterações

#### Configurações do Sistema
Na tela de configurações:

1. **Parâmetros de Monitoramento**:
   - Tempo de ping: 5 minutos
   - Limite de latência: 150ms
   - Timeout de conexão: 30s

2. **Alertas**:
   - Notificações por email: ativo
   - Telegram: ativo
   - WhatsApp: inativo

### 📌 10. Sistema de Filtros

#### Filtros Disponíveis
- **Tipo de Equipamento**: Switch, Roteador, OLT, ONU, Rádio, etc.
- **Cidade**: Filtro por localização geográfica
- **Data de Aquisição**: Período de compra
- **Status Atual**: Ativo, Manutenção, Reserva, Descartado
- **Modo de Acesso**: SSH, Web, Telnet, Winbox, SNMP
- **Origem do Sinal**: POP, Torre, Servidor de borda
- **Fabricante**: Mikrotik, Huawei, Ubiquiti, Cisco, etc.

#### Funcionalidades dos Filtros
- **Combinação**: Múltiplos filtros simultâneos
- **Salvamento**: Salvar combinações de filtros
- **Exportação**: Exportar resultados filtrados
- **Contadores**: Mostrar quantidade de resultados
- **Reset**: Limpar todos os filtros

#### Interface de Filtros
- **Sidebar**: Painel lateral com todos os filtros
- **Chips**: Tags visuais dos filtros ativos
- **Busca Rápida**: Campo de busca por texto
- **Ordenação**: Por nome, data, status, etc.

---

Esta documentação serve como base completa para o desenvolvimento do sistema Zyra, garantindo que todas as funcionalidades sejam implementadas de acordo com as necessidades da G2 Telecom.
