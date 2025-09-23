const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuração do banco de dados
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "biblioteca_digital",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Importar modelos
const Usuario = require("./Usuario")(sequelize);
const Material = require("./Material")(sequelize);
const Emprestimo = require("./Emprestimo")(sequelize);
const Reserva = require("./Reserva")(sequelize);
const Notificacao = require("./Notificacao")(sequelize);
const Multa = require("./Multa")(sequelize);

// Definir associações
// Usuario -> Emprestimos
Usuario.hasMany(Emprestimo, { foreignKey: "usuarioId", as: "emprestimos" });
Emprestimo.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

// Material -> Emprestimos
Material.hasMany(Emprestimo, { foreignKey: "materialId", as: "emprestimos" });
Emprestimo.belongsTo(Material, { foreignKey: "materialId", as: "material" });

// Usuario -> Reservas
Usuario.hasMany(Reserva, { foreignKey: "usuarioId", as: "reservas" });
Reserva.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

// Material -> Reservas
Material.hasMany(Reserva, { foreignKey: "materialId", as: "reservas" });
Reserva.belongsTo(Material, { foreignKey: "materialId", as: "material" });

// Usuario -> Notificacoes
Usuario.hasMany(Notificacao, { foreignKey: "usuarioId", as: "notificacoes" });
Notificacao.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

// Usuario -> Multas
Usuario.hasMany(Multa, { foreignKey: "usuarioId", as: "multas" });
Multa.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

// Emprestimo -> Multas
Emprestimo.hasMany(Multa, { foreignKey: "emprestimoId", as: "multas" });
Multa.belongsTo(Emprestimo, { foreignKey: "emprestimoId", as: "emprestimo" });

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error.message);
  }
};

module.exports = {
  sequelize,
  Usuario,
  Material,
  Emprestimo,
  Reserva,
  Notificacao,
  Multa,
  testConnection,
};
