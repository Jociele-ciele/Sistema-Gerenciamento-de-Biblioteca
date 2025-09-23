const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notificacao = sequelize.define(
    "Notificacao",
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
      titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Título é obrigatório",
          },
          len: {
            args: [1, 200],
            msg: "Título deve ter entre 1 e 200 caracteres",
          },
        },
      },
      mensagem: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Mensagem é obrigatória",
          },
        },
      },
      tipo: {
        type: DataTypes.ENUM("info", "aviso", "erro", "sucesso", "conquista"),
        allowNull: false,
        defaultValue: "info",
        validate: {
          isIn: {
            args: [["info", "aviso", "erro", "sucesso", "conquista"]],
            msg: "Tipo inválido",
          },
        },
      },
      lida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dataLeitura: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "materiais",
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
      reservaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "reservas",
          key: "id",
        },
      },
      pontosGanhos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      acao: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      dados: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "notificacoes",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["usuarioId"],
        },
        {
          fields: ["tipo"],
        },
        {
          fields: ["lida"],
        },
        {
          fields: ["createdAt"],
        },
      ],
    }
  );

  // Método para marcar como lida
  Notificacao.prototype.marcarComoLida = async function () {
    if (!this.lida) {
      this.lida = true;
      this.dataLeitura = new Date();
      await this.save();
    }

    return this;
  };

  // Método para obter resumo da notificação
  Notificacao.prototype.toSummaryJSON = function () {
    return {
      id: this.id,
      titulo: this.titulo,
      mensagem: this.mensagem,
      tipo: this.tipo,
      lida: this.lida,
      dataLeitura: this.dataLeitura,
      createdAt: this.createdAt,
      materialId: this.materialId,
      emprestimoId: this.emprestimoId,
      reservaId: this.reservaId,
      pontosGanhos: this.pontosGanhos,
      valor: this.valor,
    };
  };

  // Método estático para buscar notificações não lidas
  Notificacao.findNaoLidas = function (usuarioId) {
    return this.findAll({
      where: {
        usuarioId,
        lida: false,
      },
      order: [["createdAt", "DESC"]],
      include: ["material", "emprestimo", "reserva"],
    });
  };

  // Método estático para criar notificação
  Notificacao.criar = function (dados) {
    return this.create(dados);
  };

  // Método estático para notificar vencimento de empréstimo
  Notificacao.notificarVencimento = async function (emprestimo) {
    const diasParaVencimento = moment(emprestimo.dataVencimento).diff(
      moment(),
      "days"
    );

    if (diasParaVencimento <= 2 && diasParaVencimento >= 0) {
      await this.create({
        usuarioId: emprestimo.usuarioId,
        titulo: "Empréstimo próximo do vencimento",
        mensagem: `O livro "${emprestimo.material?.titulo}" deve ser devolvido em ${diasParaVencimento} dias`,
        tipo: "aviso",
        emprestimoId: emprestimo.id,
        materialId: emprestimo.materialId,
      });
    }
  };

  // Método estático para notificar material disponível
  Notificacao.notificarDisponibilidade = async function (reserva) {
    await this.create({
      usuarioId: reserva.usuarioId,
      titulo: "Material disponível para retirada",
      mensagem: `O livro "${reserva.material?.titulo}" está disponível para retirada`,
      tipo: "sucesso",
      reservaId: reserva.id,
      materialId: reserva.materialId,
    });
  };

  // Método estático para notificar conquista
  Notificacao.notificarConquista = async function (
    usuarioId,
    titulo,
    descricao,
    pontos
  ) {
    await this.create({
      usuarioId,
      titulo,
      mensagem: descricao,
      tipo: "conquista",
      pontosGanhos: pontos,
    });
  };

  return Notificacao;
};
