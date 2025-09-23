const { DataTypes } = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
  const Reserva = sequelize.define(
    "Reserva",
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
      dataReserva: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
        },
      },
      dataExpiracao: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      status: {
        type: DataTypes.ENUM(
          "pendente",
          "ativa",
          "expirada",
          "cancelada",
          "concluida"
        ),
        allowNull: false,
        defaultValue: "pendente",
        validate: {
          isIn: {
            args: [["pendente", "ativa", "expirada", "cancelada", "concluida"]],
            msg: "Status inválido",
          },
        },
      },
      prioridade: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 5,
        },
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "reservas",
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
          fields: ["dataReserva"],
        },
      ],
    }
  );

  // Hook para calcular data de expiração
  Reserva.beforeCreate(async (reserva) => {
    if (!reserva.dataExpiracao) {
      const diasReserva = 7; // Configurável
      reserva.dataExpiracao = moment().add(diasReserva, "days").toDate();
    }
  });

  // Método para verificar se está expirada
  Reserva.prototype.isExpirada = function () {
    return moment().isAfter(this.dataExpiracao);
  };

  // Método para ativar reserva
  Reserva.prototype.ativar = async function () {
    if (this.status !== "pendente") {
      throw new Error("Apenas reservas pendentes podem ser ativadas");
    }

    this.status = "ativa";
    await this.save();

    return this;
  };

  // Método para cancelar reserva
  Reserva.prototype.cancelar = async function () {
    if (!["pendente", "ativa"].includes(this.status)) {
      throw new Error("Reserva não pode ser cancelada");
    }

    this.status = "cancelada";
    await this.save();

    return this;
  };

  // Método para concluir reserva
  Reserva.prototype.concluir = async function () {
    if (this.status !== "ativa") {
      throw new Error("Apenas reservas ativas podem ser concluídas");
    }

    this.status = "concluida";
    await this.save();

    return this;
  };

  // Método estático para buscar reservas expiradas
  Reserva.findExpiradas = function () {
    return this.findAll({
      where: {
        status: "pendente",
        dataExpiracao: {
          [sequelize.Op.lt]: new Date(),
        },
      },
      include: ["usuario", "material"],
    });
  };

  // Método estático para buscar próxima reserva de um material
  Reserva.findProxima = function (materialId) {
    return this.findOne({
      where: {
        materialId,
        status: "pendente",
      },
      order: [["dataReserva", "ASC"]],
      include: ["usuario"],
    });
  };

  return Reserva;
};
