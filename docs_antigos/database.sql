-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS SANCTUARY
-- Execute este script no seu MySQL Workbench

CREATE DATABASE IF NOT EXISTS sanctuary_db;
USE sanctuary_db;

CREATE TABLE IF NOT EXISTS heroes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(100) NOT NULL,
    race VARCHAR(100) NOT NULL,
    level INT DEFAULT 1,
    save_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Para testar se a tabela foi criada:
SELECT * FROM heroes;
