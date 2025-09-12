# 🔄 Fluxos de Trabalho - Sistema Zyra

## 📋 Visão Geral

Este documento descreve os principais fluxos de trabalho do sistema Zyra, desde o cadastro de equipamentos até o monitoramento e alertas.

## 🏗️ 1. Fluxo de Cadastro de Equipamento

### 1.1 Início do Processo
```mermaid
graph TD
    A[Técnico acessa sistema] --> B[Navega para Cadastro de Equipamentos]
    B --> C[Preenche formulário básico]
    C --> D[Valida dados obrigatórios]
    D --> E{Dados válidos?}
    E -->|Não| F[Exibe erros de validação]
    F --> C
    E -->|Sim| G[Salva equipamento no banco]
    G --> H[Gera ID único]
    H --> I[Atualiza timestamp]
    I --> J[Exibe confirmação]
    J --> K[Redireciona para detalhes]
```

### 1.2 Validações Obrigatórias
- **Nome**: Único no sistema
- **IP Privado**: Único na rede
- **Serial**: Único por fabricante
- **Coordenadas**: Latitude/longitude válidas
- **Data de Aquisição**: Não pode ser futura

### 1.3 Dados Opcionais
- IP Público
- Fotos do equipamento
- Observações técnicas
- Porta de acesso específica

### 1.4 Pós-Cadastro
1. **Configuração de Monitoramento**: Ativar ping automático
2. **Upload de Fotos**: Adicionar imagens do equipamento
3. **Definição de Links**: Conectar com outros equipamentos
4. **Configuração de Alertas**: Definir limites de monitoramento

## 🔗 2. Fluxo de Gestão de Topologia

### 2.1 Visualização da Topologia
```mermaid
graph TD
    A[Acessa Topologia] --> B[Carrega equipamentos ativos]
    B --> C[Carrega links existentes]
    C --> D[Renderiza diagrama]
    D --> E[Exibe status visual]
    E --> F[Permite interação]
```

### 2.2 Edição de Conexões
```mermaid
graph TD
    A[Seleciona equipamento] --> B[Clica em 'Adicionar Link']
    B --> C[Seleciona equipamento destino]
    C --> D[Define propriedades do link]
    D --> E[Valida conexão]
    E --> F{Conexão válida?}
    F -->|Não| G[Exibe erro]
    G --> D
    F -->|Sim| H[Salva link]
    H --> I[Atualiza topologia]
    I --> J[Exibe confirmação]
```

### 2.3 Validações de Topologia
- **Conexão Dupla**: Não permitir loops desnecessários
- **Capacidade**: Verificar se equipamentos suportam a conexão
- **Status**: Apenas equipamentos ativos podem ser conectados
- **Tipo de Link**: Validar compatibilidade entre equipamentos

## 📊 3. Fluxo de Monitoramento

### 3.1 Coleta de Métricas
```mermaid
graph TD
    A[Script de Coleta] --> B[Lê lista de equipamentos ativos]
    B --> C[Para cada equipamento]
    C --> D[Executa ping]
    D --> E[Coleta métricas SNMP]
    E --> F[Armazena no banco]
    F --> G[Verifica limites]
    G --> H{Gera alerta?}
    H -->|Sim| I[Cria alerta]
    H -->|Não| J[Continua próximo]
    I --> J
    J --> K{Próximo equipamento?}
    K -->|Sim| C
    K -->|Não| L[Finaliza coleta]
```

### 3.2 Processamento de Alertas
```mermaid
graph TD
    A[Métrica coletada] --> B[Compara com limites]
    B --> C{Limite excedido?}
    C -->|Não| D[Continua monitoramento]
    C -->|Sim| E[Verifica alerta existente]
    E --> F{Alerta já existe?}
    F -->|Sim| G[Atualiza timestamp]
    F -->|Não| H[Cria novo alerta]
    H --> I[Define severidade]
    I --> J[Envia notificações]
    J --> K[Registra no log]
```

### 3.3 Tipos de Coleta
- **Ping (ICMP)**: A cada 5 minutos
- **SNMP**: A cada 15 minutos
- **SSH/API**: A cada 30 minutos
- **Backup**: Verificação diária

## 🚨 4. Fluxo de Alertas

### 4.1 Geração de Alertas
```mermaid
graph TD
    A[Condição detectada] --> B[Verifica configurações]
    B --> C[Define severidade]
    C --> D[Cria registro de alerta]
    D --> E[Envia notificações]
    E --> F[Atualiza dashboard]
    F --> G[Registra no log]
```

### 4.2 Tipos de Alertas
- **Ping Alto**: Latência acima do limite
- **Equipamento Offline**: Sem resposta ao ping
- **CPU Alta**: Utilização acima de 80%
- **Memória Baixa**: Disponível abaixo de 15%
- **Temperatura Alta**: Acima do limite seguro
- **Backup Pendente**: Sem backup há X dias

### 4.3 Resolução de Alertas
```mermaid
graph TD
    A[Técnico identifica problema] --> B[Acessa alerta específico]
    B --> C[Investiga causa]
    C --> D[Implementa solução]
    D --> E[Marca alerta como resolvido]
    E --> F[Adiciona observações]
    F --> G[Atualiza status]
    G --> H[Remove do dashboard]
```

## 💾 5. Fluxo de Gestão de Backups

### 5.1 Upload de Backup
```mermaid
graph TD
    A[Técnico acessa equipamento] --> B[Navega para seção Backups]
    B --> C[Clica em 'Novo Backup']
    C --> D[Seleciona arquivo]
    D --> E[Define tipo de backup]
    E --> F[Adiciona observações]
    F --> G[Upload para Firebase Storage]
    G --> H[Gera hash de verificação]
    H --> I[Salva metadados]
    I --> J[Atualiza último backup]
    J --> K[Exibe confirmação]
```

### 5.2 Controle de Pendências
```mermaid
graph TD
    A[Script diário] --> B[Verifica equipamentos ativos]
    B --> C[Calcula dias desde último backup]
    C --> D{Dias > limite?}
    D -->|Não| E[Continua próximo]
    D -->|Sim| F[Verifica alerta existente]
    F --> G{Alerta já existe?}
    G -->|Sim| H[Atualiza timestamp]
    G -->|Não| I[Cria alerta de pendência]
    I --> J[Envia notificação]
    H --> E
    J --> E
    E --> K{Próximo equipamento?}
    K -->|Sim| C
    K -->|Não| L[Finaliza verificação]
```

### 5.3 Download de Backup
```mermaid
graph TD
    A[Técnico acessa backup] --> B[Clica em 'Download']
    B --> C[Verifica permissões]
    C --> D[Gera URL temporária]
    D --> E[Registra acesso no log]
    E --> F[Inicia download]
    F --> G[Verifica integridade]
    G --> H[Exibe arquivo]
```

## 📈 6. Fluxo do Dashboard

### 6.1 Carregamento do Dashboard
```mermaid
graph TD
    A[Usuário acessa dashboard] --> B[Carrega resumo geral]
    B --> C[Carrega equipamentos por tipo]
    C --> D[Carrega equipamentos por status]
    D --> E[Carrega ping médio]
    E --> F[Carrega alertas ativos]
    F --> G[Carrega backups pendentes]
    G --> H[Renderiza dashboard]
    H --> I[Inicia atualizações automáticas]
```

### 6.2 Atualizações em Tempo Real
- **Ping**: Atualizado a cada 5 minutos
- **Alertas**: Atualizado imediatamente
- **Status**: Atualizado a cada 15 minutos
- **Backups**: Atualizado diariamente

## 🔍 7. Fluxo de Busca e Filtros

### 7.1 Busca Global
```mermaid
graph TD
    A[Usuário digita termo] --> B[Debounce de 300ms]
    B --> C[Executa busca]
    C --> D[Busca em equipamentos]
    D --> E[Busca em alertas]
    E --> F[Busca em backups]
    F --> G[Combina resultados]
    G --> H[Exibe resultados]
    H --> I[Permite refinamento]
```

### 7.2 Aplicação de Filtros
```mermaid
graph TD
    A[Usuário seleciona filtro] --> B[Adiciona à lista ativa]
    B --> C[Executa nova consulta]
    C --> D[Atualiza resultados]
    D --> E[Atualiza contadores]
    E --> F[Exibe chips de filtros]
    F --> G[Permite remoção]
```

### 7.3 Filtros Disponíveis
- **Tipo de Equipamento**: Switch, Roteador, OLT, etc.
- **Cidade**: Localização geográfica
- **Status**: Ativo, Manutenção, Reserva, etc.
- **Fabricante**: Mikrotik, Huawei, Ubiquiti, etc.
- **Data de Aquisição**: Período específico
- **Modo de Acesso**: SSH, Web, Telnet, etc.

## ⚙️ 8. Fluxo de Configurações

### 8.1 Acesso às Configurações
```mermaid
graph TD
    A[Usuário acessa configurações] --> B[Carrega configurações atuais]
    B --> C[Exibe formulário]
    C --> D[Usuário modifica valores]
    D --> E[Valida alterações]
    E --> F{Validação OK?}
    F -->|Não| G[Exibe erros]
    G --> D
    F -->|Sim| H[Salva configurações]
    H --> I[Atualiza sistema]
    I --> J[Exibe confirmação]
```

### 8.2 Configurações Disponíveis
- **Monitoramento**: Tempo de ping, limites de latência
- **Alertas**: Limites de CPU, memória, temperatura
- **Backups**: Dias sem backup, tipos permitidos
- **Notificações**: Email, Telegram, WhatsApp
- **Sistema**: Timeout, tentativas, logs

## 📊 9. Fluxo de Relatórios

### 9.1 Geração de Relatório
```mermaid
graph TD
    A[Usuário solicita relatório] --> B[Define filtros]
    B --> C[Seleciona formato]
    C --> D[Inicia geração]
    D --> E[Coleta dados]
    E --> F[Processa informações]
    F --> G[Gera arquivo]
    G --> H[Disponibiliza download]
    H --> I[Registra no log]
```

### 9.2 Tipos de Relatórios
- **Inventário**: Lista completa de equipamentos
- **Alertas**: Histórico de alertas por período
- **Backups**: Status de backups por equipamento
- **Performance**: Métricas de monitoramento
- **Topologia**: Mapa da rede atual

## 🔄 10. Fluxo de Sincronização

### 10.1 Sincronização de Dados
```mermaid
graph TD
    A[Script de sincronização] --> B[Verifica equipamentos ativos]
    B --> C[Atualiza informações SNMP]
    C --> D[Verifica mudanças de configuração]
    D --> E[Atualiza banco de dados]
    E --> F[Registra alterações]
    F --> G[Envia notificações se necessário]
```

### 10.2 Frequência de Sincronização
- **Informações básicas**: Diariamente
- **Configurações**: Semanalmente
- **Firmware**: Mensalmente
- **Inventário**: Conforme necessário

## 🚀 11. Fluxo de Deploy

### 11.1 Deploy do Sistema
```mermaid
graph TD
    A[Desenvolvedor faz commit] --> B[CI/CD detecta mudanças]
    B --> C[Executa testes]
    C --> D{Testes passaram?}
    D -->|Não| E[Falha no deploy]
    D -->|Sim| F[Build da aplicação]
    F --> G[Deploy no Firebase]
    G --> H[Atualiza configurações]
    H --> I[Reinicia serviços]
    I --> J[Verifica saúde]
    J --> K[Deploy concluído]
```

### 11.2 Rollback
```mermaid
graph TD
    A[Problema detectado] --> B[Identifica versão anterior]
    B --> C[Para serviços atuais]
    C --> D[Restaura versão anterior]
    D --> E[Reinicia serviços]
    E --> F[Verifica funcionamento]
    F --> G[Notifica equipe]
```

## 📱 12. Fluxo de Notificações

### 12.1 Envio de Notificações
```mermaid
graph TD
    A[Alerta gerado] --> B[Verifica configurações]
    B --> C[Prepara mensagem]
    C --> D[Envia email]
    D --> E[Envia Telegram]
    E --> F[Envia WhatsApp]
    F --> G[Registra envio]
    G --> H[Verifica entrega]
```

### 12.2 Tipos de Notificação
- **Email**: Para alertas críticos
- **Telegram**: Para alertas médios e altos
- **WhatsApp**: Para alertas críticos
- **SMS**: Para alertas críticos (futuro)

## 🔐 13. Fluxo de Autenticação

### 13.1 Login do Usuário
```mermaid
graph TD
    A[Usuário acessa sistema] --> B[Firebase Auth verifica credenciais]
    B --> C{Credenciais válidas?}
    C -->|Não| D[Exibe erro de login]
    C -->|Sim| E[Gera token JWT]
    E --> F[Redireciona para dashboard]
    F --> G[Armazena token]
    G --> H[Inicia sessão]
```

### 13.2 Renovação de Token
```mermaid
graph TD
    A[Token próximo do vencimento] --> B[Firebase renova token]
    B --> C[Atualiza armazenamento]
    C --> D[Continua sessão]
```

## 📋 14. Fluxo de Auditoria

### 14.1 Registro de Alterações
```mermaid
graph TD
    A[Usuário faz alteração] --> B[Sistema captura dados]
    B --> C[Registra timestamp]
    C --> D[Registra usuário]
    D --> E[Registra alteração]
    E --> F[Salva no log de auditoria]
    F --> G[Mantém histórico]
```

### 14.2 Consulta de Auditoria
```mermaid
graph TD
    A[Usuário solicita auditoria] --> B[Define filtros]
    B --> C[Consulta logs]
    C --> D[Processa resultados]
    D --> E[Exibe histórico]
    E --> F[Permite exportação]
```

---

Estes fluxos de trabalho garantem que o sistema Zyra funcione de forma eficiente e confiável, proporcionando uma experiência consistente para os usuários da G2 Telecom.
