const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Nome é obrigatório",
          },
          len: {
            args: [2, 100],
            msg: "Nome deve ter entre 2 e 100 caracteres",
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          msg: "Email já está em uso",
        },
        validate: {
          isEmail: {
            msg: "Email deve ter formato válido",
          },
          notEmpty: {
            msg: "Email é obrigatório",
          },
        },
      },
      senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [6, 255],
            msg: "Senha deve ter pelo menos 6 caracteres",
          },
          notEmpty: {
            msg: "Senha é obrigatória",
          },
        },
      },
      telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: {
            args: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
            msg: "Telefone deve estar no formato (XX) XXXXX-XXXX",
          },
        },
      },
      tipo: {
        type: DataTypes.ENUM("administrador", "bibliotecario", "leitor"),
        allowNull: false,
        defaultValue: "leitor",
        validate: {
          isIn: {
            args: [["administrador", "bibliotecario", "leitor"]],
            msg: "Tipo deve ser: administrador, bibliotecario ou leitor",
          },
        },
      },
      pontos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      conquistas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      dataRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ultimoAcesso: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
      paranoid: true, // Soft delete
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.senha) {
            const salt = await bcrypt.genSalt(12);
            usuario.senha = await bcrypt.hash(usuario.senha, salt);
          }
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed("senha")) {
            const salt = await bcrypt.genSalt(12);
            usuario.senha = await bcrypt.hash(usuario.senha, salt);
          }
        },
      },
    }
  );

  // Método para verificar senha
  Usuario.prototype.verificarSenha = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
  };

  // Método para obter dados públicos (sem senha)
  Usuario.prototype.toPublicJSON = function () {
    const values = { ...this.get() };
    delete values.senha;
    return values;
  };

  // Método para atualizar último acesso
  Usuario.prototype.atualizarUltimoAcesso = async function () {
    this.ultimoAcesso = new Date();
    await this.save();
  };

  // Método para adicionar pontos
  Usuario.prototype.adicionarPontos = async function (pontos) {
    this.pontos += pontos;
    await this.save();
  };

  // Método para verificar se pode emprestar
  Usuario.prototype.podeEmprestar = function () {
    const limites = {
      administrador: 20,
      bibliotecario: 15,
      leitor: 10,
    };

    return this.emprestimosAtivos < limites[this.tipo];
  };

  return Usuario;
};
