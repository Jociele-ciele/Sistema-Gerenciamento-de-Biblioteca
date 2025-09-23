-- Script de inicialização do PostgreSQL para Docker
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Criar usuário específico (opcional)
-- CREATE USER biblioteca_user WITH PASSWORD 'biblioteca123';
-- GRANT ALL PRIVILEGES ON DATABASE biblioteca_digital TO biblioteca_user;

-- Log de inicialização
\echo 'PostgreSQL inicializado com sucesso para o Sistema de Biblioteca!'
