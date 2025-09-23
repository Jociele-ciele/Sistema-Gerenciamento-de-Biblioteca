const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Multa = sequelize.define(
    "Multa",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      emprestimoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "emprestimos",
          key: "id",
        },
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      motivo: {
        type: DataTypes.ENUM("atraso", "perdido", "danificado", "outro"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["atraso", "perdido", "danificado", "outro"]],
            msg: "Motivo inválido",
          },
        },
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pendente", "paga", "cancelada"),
        allowNull: false,
        defaultValue: "pendente",
        validate: {
          isIn: {
            args: [["pendente", "paga", "cancelada"]],
            msg: "Status inválido",
          },
        },
      },
      dataVencimento: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      dataPagamento: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      metodoPagamento: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      funcionarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "multas",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["usuarioId"],
        },
        {
          fields: ["emprestimoId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["motivo"],
        },
      ],
    }
  );

  // Hook para calcular data de vencimento
  Multa.beforeCreate(async (multa) => {
    if (!multa.dataVencimento) {
      const diasVencimento = 30; // Configurável
      multa.dataVencimento = moment().add(diasVencimento, "days").toDate();
    }
  });

  // Método para pagar multa
  Multa.prototype.pagar = async function (metodoPagamento = "dinheiro") {
    if (this.status !== "pendente") {
      throw new Error("Apenas multas pendentes podem ser pagas");
    }

    this.status = "paga";
    this.dataPagamento = new Date();
    this.metodoPagamento = metodoPagamento;

    await this.save();

    return this;
  };

  // Método para cancelar multa
  Multa.prototype.cancelar = async function (motivo) {
    if (this.status !== "pendente") {
      throw new Error("Apenas multas pendentes podem ser canceladas");
    }

    this.status = "cancelada";
    this.observacoes = motivo
      ? `${this.observacoes || ""}\nCancelada: ${motivo}`
      : this.observacoes;

    await this.save();

    return this;
  };

  // Método para verificar se está vencida
  Multa.prototype.isVencida = function () {
    return this.status === "pendente" && moment().isAfter(this.dataVencimento);
  };

  // Método estático para buscar multas pendentes
  Multa.findPendentes = function (usuarioId = null) {
    const where = { status: "pendente" };

    if (usuarioId) {
      where.usuarioId = usuarioId;
    }

    return this.findAll({
      where,
      include: ["usuario", "emprestimo", "funcionario"],
      order: [["createdAt", "DESC"]],
    });
  };

  // Método estático para buscar multas vencidas
  Multa.findVencidas = function () {
    return this.findAll({
      where: {
        status: "pendente",
        dataVencimento: {
          [sequelize.Op.lt]: new Date(),
        },
      },
      include: ["usuario", "emprestimo"],
      order: [["dataVencimento", "ASC"]],
    });
  };

  // Método estático para calcular total de multas
  Multa.calcularTotal = async function (usuarioId, status = "pendente") {
    const result = await this.sum("valor", {
      where: {
        usuarioId,
        status,
      },
    });

    return parseFloat(result) || 0;
  };

  // Método estático para aplicar multa por atraso
  Multa.aplicarMultaAtraso = async function (emprestimo, diasAtraso) {
    const multaPorDia = 2.5; // Configurável
    const valor = diasAtraso * multaPorDia;

    return await this.create({
      usuarioId: emprestimo.usuarioId,
      emprestimoId: emprestimo.id,
      valor,
      motivo: "atraso",
      descricao: `Multa por atraso de ${diasAtraso} dias na devolução`,
      funcionarioId: emprestimo.funcionarioId,
    });
  };

  // Método estático para aplicar multa por material perdido
  Multa.aplicarMultaPerdido = async function (emprestimo, valor = 50.0) {
    return await this.create({
      usuarioId: emprestimo.usuarioId,
      emprestimoId: emprestimo.id,
      valor,
      motivo: "perdido",
      descricao: "Multa por material perdido",
      funcionarioId: emprestimo.funcionarioId,
    });
  };

  return Multa;
};
