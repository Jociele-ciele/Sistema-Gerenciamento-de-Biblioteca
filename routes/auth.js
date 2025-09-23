const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { Usuario } = require("../models");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateToken,
} = require("../middleware/auth");

const router = express.Router();

// Rate limiting para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    code: "TOO_MANY_ATTEMPTS",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validações
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email deve ter formato válido"),
  body("senha")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter pelo menos 6 caracteres"),
];

const registerValidation = [
  body("nome")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email deve ter formato válido"),
  body("senha")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter pelo menos 6 caracteres"),
  body("telefone")
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage("Telefone deve estar no formato (XX) XXXXX-XXXX"),
  body("tipo")
    .optional()
    .isIn(["administrador", "bibliotecario", "leitor"])
    .withMessage("Tipo deve ser: administrador, bibliotecario ou leitor"),
];

// POST /api/auth/login - Login
router.post("/login", authLimiter, loginValidation, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: errors.array(),
        code: "VALIDATION_ERROR",
      });
    }

    const { email, senha } = req.body;

    // Buscar usuário
    const usuario = await Usuario.findOne({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        error: "Conta desativada. Entre em contato com o administrador.",
        code: "ACCOUNT_DISABLED",
      });
    }

    // Verificar senha
    const senhaValida = await usuario.verificarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Atualizar último acesso
    await usuario.atualizarUltimoAcesso();

    // Gerar tokens
    const token = generateToken(usuario);
    const refreshToken = generateRefreshToken(usuario);

    // Resposta
    res.json({
      message: "Login realizado com sucesso",
      token,
      refreshToken,
      usuario: usuario.toPublicJSON(),
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
});

// POST /api/auth/register - Registro
router.post("/register", registerValidation, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: errors.array(),
        code: "VALIDATION_ERROR",
      });
    }

    const { nome, email, senha, telefone, tipo = "leitor" } = req.body;

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        error: "Email já está em uso",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    // Criar usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha,
      telefone,
      tipo,
    });

    // Gerar tokens
    const token = generateToken(novoUsuario);
    const refreshToken = generateRefreshToken(novoUsuario);

    // Resposta
    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      refreshToken,
      usuario: novoUsuario.toPublicJSON(),
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
});

// POST /api/auth/refresh - Renovar token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token necessário",
        code: "REFRESH_TOKEN_REQUIRED",
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        error: "Refresh token inválido ou expirado",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    // Buscar usuário
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        error: "Usuário não encontrado ou inativo",
        code: "USER_NOT_FOUND",
      });
    }

    // Gerar novos tokens
    const newToken = generateToken(usuario);
    const newRefreshToken = generateRefreshToken(usuario);

    res.json({
      message: "Token renovado com sucesso",
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
});

// GET /api/auth/me - Obter dados do usuário logado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      usuario: req.user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
});

// PUT /api/auth/me - Atualizar dados do usuário logado
router.put(
  "/me",
  authenticateToken,
  [
    body("nome")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Nome deve ter entre 2 e 100 caracteres"),
    body("telefone")
      .optional()
      .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
      .withMessage("Telefone deve estar no formato (XX) XXXXX-XXXX"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
          code: "VALIDATION_ERROR",
        });
      }

      const { nome, telefone } = req.body;
      const usuario = req.user;

      // Atualizar apenas campos fornecidos
      if (nome) usuario.nome = nome;
      if (telefone) usuario.telefone = telefone;

      await usuario.save();

      res.json({
        message: "Dados atualizados com sucesso",
        usuario: usuario.toPublicJSON(),
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// POST /api/auth/change-password - Alterar senha
router.post(
  "/change-password",
  authenticateToken,
  [
    body("senhaAtual")
      .isLength({ min: 6 })
      .withMessage("Senha atual é obrigatória"),
    body("novaSenha")
      .isLength({ min: 6 })
      .withMessage("Nova senha deve ter pelo menos 6 caracteres"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
          code: "VALIDATION_ERROR",
        });
      }

      const { senhaAtual, novaSenha } = req.body;
      const usuario = req.user;

      // Verificar senha atual
      const senhaValida = await usuario.verificarSenha(senhaAtual);
      if (!senhaValida) {
        return res.status(400).json({
          error: "Senha atual incorreta",
          code: "INVALID_CURRENT_PASSWORD",
        });
      }

      // Atualizar senha
      usuario.senha = novaSenha;
      await usuario.save();

      res.json({
        message: "Senha alterada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// POST /api/auth/logout - Logout (invalidar token no cliente)
router.post("/logout", authenticateToken, (req, res) => {
  // Em uma implementação mais robusta, você adicionaria o token a uma blacklist
  res.json({
    message: "Logout realizado com sucesso",
  });
});

module.exports = router;
