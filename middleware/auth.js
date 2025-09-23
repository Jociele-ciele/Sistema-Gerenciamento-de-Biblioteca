const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

// Middleware de autenticação JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: "Token de acesso necessário",
        code: "TOKEN_REQUIRED",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ["senha"] },
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Usuário não encontrado",
        code: "USER_NOT_FOUND",
      });
    }

    if (!usuario.ativo) {
      return res.status(401).json({
        error: "Usuário inativo",
        code: "USER_INACTIVE",
      });
    }

    // Atualizar último acesso
    await usuario.atualizarUltimoAcesso();

    // Adicionar usuário ao request
    req.user = usuario;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Token inválido",
        code: "INVALID_TOKEN",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      });
    }

    console.error("Erro na autenticação:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
};

// Middleware para verificar roles/permissões
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Usuário não autenticado",
        code: "NOT_AUTHENTICATED",
      });
    }

    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({
        error: "Acesso negado. Permissão insuficiente.",
        code: "INSUFFICIENT_PERMISSIONS",
        required: roles,
        current: req.user.tipo,
      });
    }

    next();
  };
};

// Middleware para verificar se é o próprio usuário ou admin
const authorizeSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Usuário não autenticado",
      code: "NOT_AUTHENTICATED",
    });
  }

  const userId = parseInt(req.params.id || req.params.userId);
  const isOwnProfile = req.user.id === userId;
  const isAdmin = ["administrador", "bibliotecario"].includes(req.user.tipo);

  if (!isOwnProfile && !isAdmin) {
    return res.status(403).json({
      error: "Acesso negado. Você só pode acessar seus próprios dados.",
      code: "ACCESS_DENIED",
    });
  }

  next();
};

// Middleware opcional de autenticação (não falha se não houver token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ["senha"] },
      });

      if (usuario && usuario.ativo) {
        req.user = usuario;
      }
    }

    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
};

// Gerar token JWT
const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Gerar refresh token
const generateRefreshToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      type: "refresh",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Verificar refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.type === "refresh" ? decoded : null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  authorize,
  authorizeSelfOrAdmin,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
};
