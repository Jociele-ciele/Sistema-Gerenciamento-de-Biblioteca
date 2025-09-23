const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Material = sequelize.define(
    "Material",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      autor: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Autor é obrigatório",
          },
          len: {
            args: [1, 100],
            msg: "Autor deve ter entre 1 e 100 caracteres",
          },
        },
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: {
          msg: "ISBN já existe no sistema",
        },
        validate: {
          is: {
            args: /^[\d-]{10,17}$/,
            msg: "ISBN deve ter formato válido",
          },
        },
      },
      categoria: {
        type: DataTypes.ENUM(
          "ficcao",
          "nao-ficcao",
          "tecnico",
          "academico",
          "periodico",
          "referencia"
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              [
                "ficcao",
                "nao-ficcao",
                "tecnico",
                "academico",
                "periodico",
                "referencia",
              ],
            ],
            msg: "Categoria inválida",
          },
        },
      },
      editora: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ano: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 1000,
            msg: "Ano deve ser maior que 1000",
          },
          max: {
            args: new Date().getFullYear() + 1,
            msg: "Ano não pode ser no futuro",
          },
        },
      },
      paginas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
        },
      },
      idioma: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "português",
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "disponivel",
          "emprestado",
          "reservado",
          "manutencao",
          "perdido"
        ),
        allowNull: false,
        defaultValue: "disponivel",
        validate: {
          isIn: {
            args: [
              [
                "disponivel",
                "emprestado",
                "reservado",
                "manutencao",
                "perdido",
              ],
            ],
            msg: "Status inválido",
          },
        },
      },
      imagem: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      qrCode: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      localizacao: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      avaliacao: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      totalAvaliacoes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      emprestimosTotais: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: "materiais",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          fields: ["titulo"],
        },
        {
          fields: ["autor"],
        },
        {
          fields: ["categoria"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["isbn"],
        },
      ],
    }
  );

  // Método para verificar se está disponível
  Material.prototype.isDisponivel = function () {
    return this.status === "disponivel";
  };

  // Método para verificar se pode ser emprestado
  Material.prototype.podeSerEmprestado = function () {
    return ["disponivel", "reservado"].includes(this.status);
  };

  // Método para atualizar status
  Material.prototype.atualizarStatus = async function (novoStatus) {
    this.status = novoStatus;
    await this.save();
  };

  // Método para incrementar empréstimos
  Material.prototype.incrementarEmprestimos = async function () {
    this.emprestimosTotais += 1;
    await this.save();
  };

  // Método para calcular nova avaliação
  Material.prototype.atualizarAvaliacao = async function (novaAvaliacao) {
    const totalAtual = this.totalAvaliacoes;
    const mediaAtual = this.avaliacao;

    const novaMedia =
      (mediaAtual * totalAtual + novaAvaliacao) / (totalAtual + 1);

    this.avaliacao = parseFloat(novaMedia.toFixed(1));
    this.totalAvaliacoes += 1;

    await this.save();
  };

  // Método para gerar QR Code
  Material.prototype.gerarQRCode = function () {
    const qrData = {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      isbn: this.isbn,
      tipo: "material",
    };

    return JSON.stringify(qrData);
  };

  // Método para obter dados resumidos
  Material.prototype.toSummaryJSON = function () {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      categoria: this.categoria,
      status: this.status,
      avaliacao: this.avaliacao,
      totalAvaliacoes: this.totalAvaliacoes,
      imagem: this.imagem,
    };
  };

  return Material;
};
