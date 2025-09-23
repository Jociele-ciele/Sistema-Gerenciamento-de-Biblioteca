const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: "development",
    version: "1.0.0",
  });
});

// Rota para testar materiais
app.get("/api/materiais", (req, res) => {
  const materiais = [
    {
      id: 1,
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      isbn: "978-85-7232-200-1",
      categoria: "ficcao",
      editora: "Editora Nova Aguilar",
      ano: 1899,
      descricao: "Romance clássico da literatura brasileira",
      status: "disponivel",
      imagem: "books-2562331_640.jpg",
      avaliacao: 4.8,
      totalAvaliacoes: 1250,
      emprestimosTotais: 32,
    },
    {
      id: 2,
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      isbn: "978-85-262-5000-2",
      categoria: "tecnico",
      editora: "Alta Books",
      ano: 2008,
      descricao: "Guia para escrever código limpo e profissional",
      status: "emprestado",
      imagem: "books-2617938_1280.jpg",
      avaliacao: 4.9,
      totalAvaliacoes: 890,
      emprestimosTotais: 45,
    },
  ];

  res.json({ materiais });
});

// Rota para testar usuários
app.get("/api/usuarios", (req, res) => {
  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      tipo: "bibliotecario",
      pontos: 850,
      conquistas: 3,
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      tipo: "leitor",
      pontos: 420,
      conquistas: 1,
    },
  ];

  res.json({ usuarios });
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Sistema de Biblioteca - Backend funcionando!",
    endpoints: {
      health: "/api/health",
      materiais: "/api/materiais",
      usuarios: "/api/usuarios",
    },
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Sistema de Biblioteca - Backend`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`📖 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Materiais: http://localhost:${PORT}/api/materiais`);
  console.log(`👥 Usuários: http://localhost:${PORT}/api/usuarios`);
});
