# Use Node.js 18 LTS
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache postgresql-client

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código fonte
COPY . .

# Criar diretório para uploads
RUN mkdir -p uploads

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S biblioteca -u 1001

# Alterar propriedade dos arquivos
RUN chown -R biblioteca:nodejs /app
USER biblioteca

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
