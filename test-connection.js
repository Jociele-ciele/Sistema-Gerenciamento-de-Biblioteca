const { Sequelize } = require("sequelize");

// Configuração do banco de dados
const sequelize = new Sequelize({
  host: "localhost",
  port: 5432,
  database: "biblioteca_digital",
  username: "postgres",
  password: "biblioteca123",
  dialect: "postgres",
  logging: console.log,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com banco de dados estabelecida com sucesso.");

    // Testar uma query simples
    const result = await sequelize.query(
      "SELECT COUNT(*) as total FROM usuarios",
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log("👥 Total de usuários:", result[0].total);

    const materiais = await sequelize.query(
      "SELECT COUNT(*) as total FROM materiais",
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log("📚 Total de materiais:", materiais[0].total);
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
