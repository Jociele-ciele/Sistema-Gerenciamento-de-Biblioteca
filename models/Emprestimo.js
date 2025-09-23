const { DataTypes } = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
  const Emprestimo = sequelize.define(
    "Emprestimo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "materiais",
          key: "id",
        },
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      dataEmprestimo: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
        },
      },
      dataVencimento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: {
            args: new Date(),
            msg: "Data de vencimento deve ser no futuro",
          },
        },
      },
      dataDevolucao: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      status: {
        type: DataTypes.ENUM("ativo", "devolvido", "atrasado", "perdido"),
        allowNull: false,
        defaultValue: "ativo",
        validate: {
          isIn: {
            args: [["ativo", "devolvido", "atrasado", "perdido"]],
            msg: "Status inválido",
          },
        },
      },
      renovacoes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 3,
        },
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      multa: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      funcionarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
    },
    {
      tableName: "emprestimos",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["usuarioId"],
        },
        {
          fields: ["materialId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["dataVencimento"],
        },
      ],
    }
  );

  // Hook para calcular data de vencimento
  Emprestimo.beforeCreate(async (emprestimo) => {
    if (!emprestimo.dataVencimento) {
      const diasEmprestimo = 14; // Configurável
      emprestimo.dataVencimento = moment().add(diasEmprestimo, "days").toDate();
    }
  });

  // Método para verificar se está atrasado
  Emprestimo.prototype.isAtrasado = function () {
    return this.status === "ativo" && moment().isAfter(this.dataVencimento);
  };

  // Método para calcular dias de atraso
  Emprestimo.prototype.getDiasAtraso = function () {
    if (!this.isAtrasado()) return 0;
    return moment().diff(this.dataVencimento, "days");
  };

  // Método para calcular multa
  Emprestimo.prototype.calcularMulta = function () {
    const diasAtraso = this.getDiasAtraso();
    const multaPorDia = 2.5; // Configurável
    return diasAtraso * multaPorDia;
  };

  // Método para renovar empréstimo
  Emprestimo.prototype.renovar = async function (diasAdicionais = 7) {
    if (this.status !== "ativo") {
      throw new Error("Apenas empréstimos ativos podem ser renovados");
    }

    if (this.renovacoes >= 3) {
      throw new Error("Máximo de renovações atingido");
    }

    this.renovacoes += 1;
    this.dataVencimento = moment(this.dataVencimento)
      .add(diasAdicionais, "days")
      .toDate();

    await this.save();

    return this;
  };

  // Método para devolver empréstimo
  Emprestimo.prototype.devolver = async function () {
    if (this.status !== "ativo") {
      throw new Error("Empréstimo não está ativo");
    }

    this.status = "devolvido";
    this.dataDevolucao = new Date();

    // Calcular multa se houver atraso
    if (this.isAtrasado()) {
      this.multa = this.calcularMulta();
    }

    await this.save();

    return this;
  };

  // Método para marcar como perdido
  Emprestimo.prototype.marcarComoPerdido = async function () {
    this.status = "perdido";
    this.dataDevolucao = new Date();
    this.multa = 50.0; // Valor da multa por material perdido

    await this.save();

    return this;
  };

  // Método para obter resumo do empréstimo
  Emprestimo.prototype.toSummaryJSON = function () {
    return {
      id: this.id,
      materialId: this.materialId,
      usuarioId: this.usuarioId,
      dataEmprestimo: this.dataEmprestimo,
      dataVencimento: this.dataVencimento,
      dataDevolucao: this.dataDevolucao,
      status: this.status,
      renovacoes: this.renovacoes,
      multa: this.multa,
      isAtrasado: this.isAtrasado(),
      diasAtraso: this.getDiasAtraso(),
    };
  };

  // Método estático para buscar empréstimos ativos
  Emprestimo.findAtivos = function () {
    return this.findAll({
      where: { status: "ativo" },
      include: ["usuario", "material"],
    });
  };

  // Método estático para buscar empréstimos atrasados
  Emprestimo.findAtrasados = function () {
    return this.findAll({
      where: {
        status: "ativo",
        dataVencimento: {
          [sequelize.Op.lt]: new Date(),
        },
      },
      include: ["usuario", "material"],
    });
  };

  // Método estático para estatísticas
  Emprestimo.getEstatisticas = async function () {
    const total = await this.count();
    const ativos = await this.count({ where: { status: "ativo" } });
    const devolvidos = await this.count({ where: { status: "devolvido" } });
    const atrasados = await this.count({
      where: {
        status: "ativo",
        dataVencimento: {
          [sequelize.Op.lt]: new Date(),
        },
      },
    });

    return {
      total,
      ativos,
      devolvidos,
      atrasados,
    };
  };

  return Emprestimo;
};
