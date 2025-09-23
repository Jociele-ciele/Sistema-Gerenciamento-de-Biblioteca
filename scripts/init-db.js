const { sequelize, testConnection } = require("../models");

async function initializeDatabase() {
  try {
    console.log("🔄 Inicializando banco de dados...");

    // Testar conexão
    await testConnection();

    // Sincronizar modelos (criar tabelas)
    console.log("📋 Criando tabelas...");
    await sequelize.sync({ force: true });
    console.log("✅ Tabelas criadas com sucesso!");

    // Executar seed se solicitado
    if (process.argv.includes("--seed")) {
      console.log("🌱 Executando seed...");
      await require("./seed")(sequelize);
      console.log("✅ Seed executado com sucesso!");
    }

    console.log("🎉 Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
