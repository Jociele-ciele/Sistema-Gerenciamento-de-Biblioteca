const express = require("express");
const { body, query, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Material } = require("../models");
const {
  authenticateToken,
  authorize,
  optionalAuth,
} = require("../middleware/auth");

const router = express.Router();

// Validações
const createMaterialValidation = [
  body("titulo")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Título deve ter entre 1 e 200 caracteres"),
  body("autor")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Autor deve ter entre 1 e 100 caracteres"),
  body("categoria")
    .isIn([
      "ficcao",
      "nao-ficcao",
      "tecnico",
      "academico",
      "periodico",
      "referencia",
    ])
    .withMessage("Categoria inválida"),
  body("isbn")
    .optional()
    .matches(/^[\d-]{10,17}$/)
    .withMessage("ISBN deve ter formato válido"),
  body("ano")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage("Ano inválido"),
  body("paginas")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Páginas deve ser um número positivo"),
];

const updateMaterialValidation = [
  body("titulo")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Título deve ter entre 1 e 200 caracteres"),
  body("autor")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Autor deve ter entre 1 e 100 caracteres"),
  body("categoria")
    .optional()
    .isIn([
      "ficcao",
      "nao-ficcao",
      "tecnico",
      "academico",
      "periodico",
      "referencia",
    ])
    .withMessage("Categoria inválida"),
  body("status")
    .optional()
    .isIn(["disponivel", "emprestado", "reservado", "manutencao", "perdido"])
    .withMessage("Status inválido"),
];

// GET /api/materiais - Listar materiais com busca e filtros
router.get(
  "/",
  optionalAuth,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Página deve ser um número positivo"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limite deve ser entre 1 e 100"),
    query("search")
      .optional()
      .isLength({ min: 1 })
      .withMessage("Busca não pode estar vazia"),
    query("categoria")
      .optional()
      .isIn([
        "ficcao",
        "nao-ficcao",
        "tecnico",
        "academico",
        "periodico",
        "referencia",
      ]),
    query("status")
      .optional()
      .isIn(["disponivel", "emprestado", "reservado", "manutencao", "perdido"]),
    query("sort")
      .optional()
      .isIn(["titulo", "autor", "ano", "avaliacao", "emprestimosTotais"]),
    query("order").optional().isIn(["ASC", "DESC"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Parâmetros inválidos",
          details: errors.array(),
          code: "VALIDATION_ERROR",
        });
      }

      const {
        page = 1,
        limit = 20,
        search,
        categoria,
        status,
        sort = "titulo",
        order = "ASC",
      } = req.query;

      // Construir filtros
      const where = {};

      if (search) {
        where[Op.or] = [
          { titulo: { [Op.iLike]: `%${search}%` } },
          { autor: { [Op.iLike]: `%${search}%` } },
          { isbn: { [Op.iLike]: `%${search}%` } },
          { descricao: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (categoria) {
        where.categoria = categoria;
      }

      if (status) {
        where.status = status;
      }

      // Buscar materiais
      const offset = (page - 1) * limit;
      const { count, rows: materiais } = await Material.findAndCountAll({
        where,
        order: [[sort, order]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });

      // Calcular paginação
      const totalPages = Math.ceil(count / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      res.json({
        materiais,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNext,
          hasPrev,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// GET /api/materiais/:id - Obter material específico
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    });

    if (!material) {
      return res.status(404).json({
        error: "Material não encontrado",
        code: "MATERIAL_NOT_FOUND",
      });
    }

    res.json({ material });
  } catch (error) {
    console.error("Erro ao buscar material:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
});

// POST /api/materiais - Criar novo material
router.post(
  "/",
  authenticateToken,
  authorize("administrador", "bibliotecario"),
  createMaterialValidation,
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

      const materialData = req.body;

      // Verificar se ISBN já existe
      if (materialData.isbn) {
        const existingMaterial = await Material.findOne({
          where: { isbn: materialData.isbn },
        });

        if (existingMaterial) {
          return res.status(409).json({
            error: "ISBN já existe no sistema",
            code: "ISBN_ALREADY_EXISTS",
          });
        }
      }

      const material = await Material.create(materialData);

      res.status(201).json({
        message: "Material criado com sucesso",
        material,
      });
    } catch (error) {
      console.error("Erro ao criar material:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// PUT /api/materiais/:id - Atualizar material
router.put(
  "/:id",
  authenticateToken,
  authorize("administrador", "bibliotecario"),
  updateMaterialValidation,
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

      const material = await Material.findByPk(req.params.id);

      if (!material) {
        return res.status(404).json({
          error: "Material não encontrado",
          code: "MATERIAL_NOT_FOUND",
        });
      }

      // Verificar se ISBN já existe (se fornecido)
      if (req.body.isbn && req.body.isbn !== material.isbn) {
        const existingMaterial = await Material.findOne({
          where: {
            isbn: req.body.isbn,
            id: { [Op.ne]: req.params.id },
          },
        });

        if (existingMaterial) {
          return res.status(409).json({
            error: "ISBN já existe no sistema",
            code: "ISBN_ALREADY_EXISTS",
          });
        }
      }

      await material.update(req.body);

      res.json({
        message: "Material atualizado com sucesso",
        material,
      });
    } catch (error) {
      console.error("Erro ao atualizar material:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// DELETE /api/materiais/:id - Deletar material
router.delete(
  "/:id",
  authenticateToken,
  authorize("administrador"),
  async (req, res) => {
    try {
      const material = await Material.findByPk(req.params.id);

      if (!material) {
        return res.status(404).json({
          error: "Material não encontrado",
          code: "MATERIAL_NOT_FOUND",
        });
      }

      // Verificar se material tem empréstimos ativos
      const emprestimosAtivos = await material.countEmprestimos({
        where: { status: "ativo" },
      });

      if (emprestimosAtivos > 0) {
        return res.status(400).json({
          error: "Não é possível deletar material com empréstimos ativos",
          code: "MATERIAL_HAS_ACTIVE_LOANS",
        });
      }

      await material.destroy();

      res.json({
        message: "Material deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar material:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// GET /api/materiais/:id/emprestimos - Histórico de empréstimos do material
router.get(
  "/:id/emprestimos",
  authenticateToken,
  authorize("administrador", "bibliotecario"),
  async (req, res) => {
    try {
      const material = await Material.findByPk(req.params.id);

      if (!material) {
        return res.status(404).json({
          error: "Material não encontrado",
          code: "MATERIAL_NOT_FOUND",
        });
      }

      const emprestimos = await material.getEmprestimos({
        include: ["usuario"],
        order: [["createdAt", "DESC"]],
        limit: 50,
      });

      res.json({ emprestimos });
    } catch (error) {
      console.error("Erro ao buscar histórico de empréstimos:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// POST /api/materiais/:id/avaliar - Avaliar material
router.post(
  "/:id/avaliar",
  authenticateToken,
  [
    body("avaliacao")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Avaliação deve ser entre 1 e 5"),
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

      const material = await Material.findByPk(req.params.id);

      if (!material) {
        return res.status(404).json({
          error: "Material não encontrado",
          code: "MATERIAL_NOT_FOUND",
        });
      }

      const { avaliacao } = req.body;
      await material.atualizarAvaliacao(avaliacao);

      res.json({
        message: "Avaliação registrada com sucesso",
        material: {
          id: material.id,
          avaliacao: material.avaliacao,
          totalAvaliacoes: material.totalAvaliacoes,
        },
      });
    } catch (error) {
      console.error("Erro ao avaliar material:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

// GET /api/materiais/stats/estatisticas - Estatísticas dos materiais
router.get(
  "/stats/estatisticas",
  authenticateToken,
  authorize("administrador", "bibliotecario"),
  async (req, res) => {
    try {
      const totalMateriais = await Material.count();
      const porCategoria = await Material.findAll({
        attributes: [
          "categoria",
          [
            Material.sequelize.fn("COUNT", Material.sequelize.col("id")),
            "total",
          ],
        ],
        group: ["categoria"],
        raw: true,
      });

      const porStatus = await Material.findAll({
        attributes: [
          "status",
          [
            Material.sequelize.fn("COUNT", Material.sequelize.col("id")),
            "total",
          ],
        ],
        group: ["status"],
        raw: true,
      });

      const maisEmprestados = await Material.findAll({
        attributes: ["id", "titulo", "autor", "emprestimosTotais"],
        order: [["emprestimosTotais", "DESC"]],
        limit: 10,
      });

      res.json({
        totalMateriais,
        porCategoria,
        porStatus,
        maisEmprestados,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

module.exports = router;
