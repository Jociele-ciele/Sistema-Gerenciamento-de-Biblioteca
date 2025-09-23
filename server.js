const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de Segurança
app.use(helmet());
app.use(compression());

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por IP
  message: {
    error: "Muitas requisições deste IP, tente novamente mais tarde.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rotas da API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/materiais", require("./routes/materiais"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/emprestimos", require("./routes/emprestimos"));
app.use("/api/reservas", require("./routes/reservas"));
app.use("/api/notificacoes", require("./routes/notificacoes"));
app.use("/api/relatorios", require("./routes/relatorios"));
app.use("/api/upload", require("./routes/upload"));

// Rota de Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: require("./package.json").version,
  });
});

// Rota raiz - redireciona para o frontend
app.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:8000");
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Token inválido ou expirado",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "ID inválido",
    });
  }

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor"
        : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Sistema de Biblioteca - Backend`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`📖 Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM recebido. Fechando servidor...");
  server.close(() => {
    console.log("Servidor fechado.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT recebido. Fechando servidor...");
  server.close(() => {
    console.log("Servidor fechado.");
    process.exit(0);
  });
});

module.exports = app;
