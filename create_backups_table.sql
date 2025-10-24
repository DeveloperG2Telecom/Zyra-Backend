-- Script para criar a tabela de backups
-- Execute este script no banco de dados MySQL

CREATE TABLE IF NOT EXISTS backups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipamento_id INT NOT NULL,
    data_backup DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Chave estrangeira para equipamentos
    FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE,
    
    -- Índices para melhor performance
    INDEX idx_equipamento_id (equipamento_id),
    INDEX idx_data_backup (data_backup),
    INDEX idx_created_at (created_at)
);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO backups (equipamento_id, data_backup, observacoes) VALUES
(1, '2024-01-15', 'Backup realizado com sucesso'),
(1, '2024-01-08', 'Backup de rotina'),
(2, '2024-01-10', 'Backup após manutenção'),
(2, '2024-01-03', 'Backup semanal'),
(3, '2023-12-20', 'Último backup antes da atualização');

-- Verificar se a tabela foi criada corretamente
SELECT 'Tabela backups criada com sucesso!' as status;
