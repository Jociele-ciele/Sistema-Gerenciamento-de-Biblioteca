# 🚀 Guia de Instalação do Backend

## 📋 Pré-requisitos

### Software Necessário

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Opcional (para Docker)

- **Docker** ([Download](https://www.docker.com/products/docker-desktop/))
- **Docker Compose** (vem com Docker Desktop)

## 🛠️ Instalação

### Método 1: Instalação Local

#### 1. Instalar Dependências

```bash
# Instalar dependências do Node.js
npm install

# Ou usando yarn
yarn install
```

#### 2. Configurar Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb biblioteca_digital

# Ou via psql
psql -U postgres
CREATE DATABASE biblioteca_digital;
\q
```

#### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar arquivo .env com suas configurações
nano .env
```

**Configurações mínimas no .env:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=biblioteca_digital
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

#### 4. Inicializar Banco de Dados

```bash
# Criar tabelas e dados de exemplo
npm run migrate
npm run seed
```

#### 5. Executar Aplicação

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

### Método 2: Docker (Recomendado)

#### 1. Executar com Docker Compose

```bash
# Construir e executar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

#### 2. Apenas Banco de Dados

```bash
# Executar apenas PostgreSQL
docker-compose up -d postgres

# Conectar ao banco
docker-compose exec postgres psql -U postgres -d biblioteca_digital
```

## 🔧 Configuração

### Banco de Dados

#### PostgreSQL

```sql
-- Criar usuário específico (opcional)
CREATE USER biblioteca_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE biblioteca_digital TO biblioteca_user;
```

#### Variáveis de Ambiente Completas

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=biblioteca_digital
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Aplicação
NODE_ENV=development
PORT=3000
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Email (para notificações)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_do_email

# URLs
FRONTEND_URL=http://localhost:8000
API_URL=http://localhost:3000

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Debug
DEBUG=true
LOG_LEVEL=info
```

## 🚀 Execução

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa com nodemon

# Produção
npm start           # Executa servidor

# Banco de Dados
npm run migrate     # Cria tabelas
npm run seed        # Adiciona dados de exemplo

# Testes
npm test           # Executa testes

# Docker
docker-compose up -d    # Executa todos os serviços
docker-compose down     # Para todos os serviços
```

### Verificar Instalação

```bash
# Testar API
curl http://localhost:3000/api/health

# Resposta esperada:
{
  "status": "OK",
  "timestamp": "2024-01-15T18:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

## 📊 Dados de Teste

### Usuários Criados

- **Administrador**: pedro.oliveira@email.com / 123456
- **Bibliotecário**: joao.silva@email.com / 123456
- **Leitor**: maria.santos@email.com / 123456
- **Leitor**: ana.costa@email.com / 123456

### Materiais de Exemplo

- Dom Casmurro (Machado de Assis)
- Clean Code (Robert C. Martin)
- 1984 (George Orwell)
- Sapiens (Yuval Noah Harari)
- E mais 4 livros...

## 🔗 Endpoints da API

### Autenticação

```
POST /api/auth/login      # Login
POST /api/auth/register   # Registro
POST /api/auth/refresh    # Renovar token
GET  /api/auth/me         # Dados do usuário
```

### Materiais

```
GET    /api/materiais           # Listar materiais
GET    /api/materiais/:id       # Obter material
POST   /api/materiais           # Criar material
PUT    /api/materiais/:id       # Atualizar material
DELETE /api/materiais/:id       # Deletar material
```

### Empréstimos

```
GET  /api/emprestimos           # Listar empréstimos
POST /api/emprestimos           # Criar empréstimo
PUT  /api/emprestimos/:id       # Atualizar empréstimo
```

### Reservas

```
GET  /api/reservas              # Listar reservas
POST /api/reservas              # Criar reserva
PUT  /api/reservas/:id          # Atualizar reserva
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco

```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Iniciar PostgreSQL
sudo service postgresql start

# Verificar porta
netstat -an | grep 5432
```

### Erro de Permissões

```bash
# Dar permissões ao usuário
sudo chown -R $USER:$USER /caminho/do/projeto

# Permissões de execução
chmod +x scripts/*.js
```

### Erro de Porta em Uso

```bash
# Verificar processos na porta 3000
lsof -i :3000

# Matar processo
kill -9 PID_DO_PROCESSO
```

### Problemas com Docker

```bash
# Limpar containers e volumes
docker-compose down -v
docker system prune -a

# Reconstruir imagens
docker-compose build --no-cache
```

## 📱 Integração com Frontend

### Configurar Frontend para usar Backend

1. **Atualizar URLs no frontend:**

```javascript
// Em config.js ou similar
const API_BASE_URL = "http://localhost:3000/api";
```

2. **Fazer requisições autenticadas:**

```javascript
// Exemplo de requisição
fetch("/api/materiais", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## 🔒 Segurança

### Configurações de Produção

1. **Alterar JWT_SECRET** para um valor único e seguro
2. **Usar HTTPS** em produção
3. **Configurar CORS** adequadamente
4. **Implementar rate limiting** mais restritivo
5. **Usar variáveis de ambiente** para dados sensíveis

### Backup do Banco

```bash
# Backup
pg_dump -U postgres biblioteca_digital > backup.sql

# Restore
psql -U postgres biblioteca_digital < backup.sql
```

## 📈 Monitoramento

### Logs

```bash
# Ver logs da aplicação
tail -f logs/app.log

# Ver logs do Docker
docker-compose logs -f app
```

### Métricas

- **Health Check**: `GET /api/health`
- **Uptime**: Disponível no health check
- **Status do banco**: Verificado automaticamente

## 🎯 Próximos Passos

1. **Configurar SSL/HTTPS**
2. **Implementar CI/CD**
3. **Configurar monitoramento**
4. **Implementar backup automático**
5. **Configurar cache (Redis)**
6. **Implementar testes automatizados**

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs da aplicação
2. Consulte a documentação da API
3. Verifique as configurações do banco
4. Teste os endpoints individualmente

**Sistema funcionando?** ✅  
**API respondendo?** ✅  
**Banco conectado?** ✅  
**Frontend integrado?** ✅

🎉 **Backend pronto para produção!**
