const bcrypt = require("bcryptjs");
const moment = require("moment");

async function seedDatabase(sequelize) {
  const { Usuario, Material, Emprestimo, Reserva, Notificacao } =
    sequelize.models;

  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Criar usuários
    console.log("👥 Criando usuários...");
    const usuarios = await Promise.all([
      Usuario.create({
        nome: "João Silva",
        email: "joao.silva@email.com",
        senha: "123456",
        telefone: "(11) 99999-9999",
        tipo: "bibliotecario",
        pontos: 850,
        conquistas: 3,
      }),
      Usuario.create({
        nome: "Maria Santos",
        email: "maria.santos@email.com",
        senha: "123456",
        telefone: "(11) 88888-8888",
        tipo: "leitor",
        pontos: 420,
        conquistas: 1,
      }),
      Usuario.create({
        nome: "Ana Costa",
        email: "ana.costa@email.com",
        senha: "123456",
        telefone: "(11) 77777-7777",
        tipo: "leitor",
        pontos: 680,
        conquistas: 2,
      }),
      Usuario.create({
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@email.com",
        senha: "123456",
        telefone: "(11) 66666-6666",
        tipo: "administrador",
        pontos: 1200,
        conquistas: 5,
      }),
    ]);

    console.log(`✅ ${usuarios.length} usuários criados`);

    // Criar materiais
    console.log("📚 Criando materiais...");
    const materiais = await Promise.all([
      Material.create({
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        isbn: "978-85-7232-200-1",
        categoria: "ficcao",
        editora: "Editora Nova Aguilar",
        ano: 1899,
        descricao:
          "Romance clássico da literatura brasileira que narra a história de Bentinho e Capitu, explorando temas como ciúme, traição e ambiguidade.",
        status: "disponivel",
        imagem: "books-2562331_640.jpg",
        paginas: 256,
        idioma: "português",
        avaliacao: 4.8,
        totalAvaliacoes: 1250,
        emprestimosTotais: 32,
      }),
      Material.create({
        titulo: "Clean Code",
        autor: "Robert C. Martin",
        isbn: "978-85-262-5000-2",
        categoria: "tecnico",
        editora: "Alta Books",
        ano: 2008,
        descricao:
          "Guia essencial para escrever código limpo e profissional. Aborda princípios fundamentais de desenvolvimento de software.",
        status: "emprestado",
        imagem: "books-2617938_1280.jpg",
        paginas: 464,
        idioma: "português",
        avaliacao: 4.9,
        totalAvaliacoes: 890,
        emprestimosTotais: 45,
      }),
      Material.create({
        titulo: "1984",
        autor: "George Orwell",
        isbn: "978-85-254-2700-3",
        categoria: "ficcao",
        editora: "Companhia das Letras",
        ano: 1949,
        descricao:
          "Distopia clássica que retrata um regime totalitário onde o Estado controla todos os aspectos da vida dos cidadãos.",
        status: "disponivel",
        imagem: "books-2562331_640.jpg",
        paginas: 328,
        idioma: "português",
        avaliacao: 4.7,
        totalAvaliacoes: 2100,
        emprestimosTotais: 38,
      }),
      Material.create({
        titulo: "Sapiens",
        autor: "Yuval Noah Harari",
        isbn: "978-85-254-2700-4",
        categoria: "nao-ficcao",
        editora: "L&PM",
        ano: 2011,
        descricao:
          "Uma breve história da humanidade, explorando como nossa espécie se tornou dominante no planeta.",
        status: "reservado",
        imagem: "books-2617938_1280.jpg",
        paginas: 512,
        idioma: "português",
        avaliacao: 4.6,
        totalAvaliacoes: 1580,
        emprestimosTotais: 28,
      }),
      Material.create({
        titulo: "O Senhor dos Anéis",
        autor: "J.R.R. Tolkien",
        isbn: "978-85-254-2700-5",
        categoria: "ficcao",
        editora: "Martins Fontes",
        ano: 1954,
        descricao:
          "Épico de fantasia que narra a jornada de Frodo para destruir o Um Anel e salvar a Terra Média.",
        status: "disponivel",
        imagem: "books-2562331_640.jpg",
        paginas: 1216,
        idioma: "português",
        avaliacao: 4.9,
        totalAvaliacoes: 3200,
        emprestimosTotais: 25,
      }),
      Material.create({
        titulo: "Algoritmos e Estruturas de Dados",
        autor: "Thomas H. Cormen",
        isbn: "978-85-254-2700-6",
        categoria: "tecnico",
        editora: "Elsevier",
        ano: 2012,
        descricao:
          "Referência clássica em ciência da computação, cobrindo algoritmos fundamentais e estruturas de dados.",
        status: "disponivel",
        imagem: "books-2617938_1280.jpg",
        paginas: 1312,
        idioma: "português",
        avaliacao: 4.8,
        totalAvaliacoes: 450,
        emprestimosTotais: 15,
      }),
      Material.create({
        titulo: "Cem Anos de Solidão",
        autor: "Gabriel García Márquez",
        isbn: "978-85-254-2700-7",
        categoria: "ficcao",
        editora: "Record",
        ano: 1967,
        descricao:
          "Obra-prima do realismo mágico que conta a história da família Buendía ao longo de sete gerações.",
        status: "disponivel",
        imagem: "books-2562331_640.jpg",
        paginas: 448,
        idioma: "português",
        avaliacao: 4.7,
        totalAvaliacoes: 1850,
        emprestimosTotais: 22,
      }),
      Material.create({
        titulo: "Breve História do Tempo",
        autor: "Stephen Hawking",
        isbn: "978-85-254-2700-8",
        categoria: "nao-ficcao",
        editora: "Intrínseca",
        ano: 1988,
        descricao:
          "Exploração fascinante dos conceitos fundamentais da física, do Big Bang aos buracos negros.",
        status: "emprestado",
        imagem: "books-2617938_1280.jpg",
        paginas: 256,
        idioma: "português",
        avaliacao: 4.5,
        totalAvaliacoes: 920,
        emprestimosTotais: 18,
      }),
    ]);

    console.log(`✅ ${materiais.length} materiais criados`);

    // Criar empréstimos
    console.log("📖 Criando empréstimos...");
    const emprestimos = await Promise.all([
      Emprestimo.create({
        materialId: materiais[1].id, // Clean Code
        usuarioId: usuarios[1].id, // Maria Santos
        dataEmprestimo: moment().subtract(10, "days").toDate(),
        dataVencimento: moment().add(4, "days").toDate(),
        status: "ativo",
        renovacoes: 0,
        funcionarioId: usuarios[0].id, // João Silva
      }),
      Emprestimo.create({
        materialId: materiais[7].id, // Breve História do Tempo
        usuarioId: usuarios[3].id, // Pedro Oliveira
        dataEmprestimo: moment().subtract(5, "days").toDate(),
        dataVencimento: moment().add(9, "days").toDate(),
        status: "ativo",
        renovacoes: 1,
        funcionarioId: usuarios[0].id, // João Silva
      }),
      Emprestimo.create({
        materialId: materiais[0].id, // Dom Casmurro
        usuarioId: usuarios[2].id, // Ana Costa
        dataEmprestimo: moment().subtract(20, "days").toDate(),
        dataVencimento: moment().subtract(6, "days").toDate(),
        dataDevolucao: moment().subtract(3, "days").toDate(),
        status: "devolvido",
        renovacoes: 0,
        funcionarioId: usuarios[0].id, // João Silva
      }),
    ]);

    console.log(`✅ ${emprestimos.length} empréstimos criados`);

    // Criar reservas
    console.log("📌 Criando reservas...");
    const reservas = await Promise.all([
      Reserva.create({
        materialId: materiais[3].id, // Sapiens
        usuarioId: usuarios[1].id, // Maria Santos
        dataReserva: moment().subtract(2, "days").toDate(),
        status: "pendente",
        prioridade: 1,
      }),
      Reserva.create({
        materialId: materiais[4].id, // O Senhor dos Anéis
        usuarioId: usuarios[2].id, // Ana Costa
        dataReserva: moment().subtract(1, "day").toDate(),
        status: "pendente",
        prioridade: 2,
      }),
    ]);

    console.log(`✅ ${reservas.length} reservas criadas`);

    // Criar notificações
    console.log("🔔 Criando notificações...");
    const notificacoes = await Promise.all([
      Notificacao.create({
        usuarioId: usuarios[1].id, // Maria Santos
        titulo: "Empréstimo próximo do vencimento",
        mensagem: 'O livro "Clean Code" deve ser devolvido em 2 dias',
        tipo: "aviso",
        lida: false,
        materialId: materiais[1].id,
      }),
      Notificacao.create({
        usuarioId: usuarios[1].id, // Maria Santos
        titulo: "Nova reserva disponível",
        mensagem: 'O livro "Sapiens" está disponível para retirada',
        tipo: "info",
        lida: false,
        materialId: materiais[3].id,
      }),
      Notificacao.create({
        usuarioId: usuarios[0].id, // João Silva
        titulo: "Parabéns! Nova conquista",
        mensagem:
          'Você desbloqueou a conquista "Leitor Ávido" por ter lido 15 livros!',
        tipo: "conquista",
        lida: true,
        pontosGanhos: 100,
      }),
      Notificacao.create({
        usuarioId: usuarios[3].id, // Pedro Oliveira
        titulo: "Renovação realizada",
        mensagem:
          'Seu empréstimo de "Breve História do Tempo" foi renovado por mais 7 dias',
        tipo: "sucesso",
        lida: true,
        materialId: materiais[7].id,
      }),
      Notificacao.create({
        usuarioId: usuarios[1].id, // Maria Santos
        titulo: "Multa aplicada",
        mensagem: "Uma multa de R$ 5,00 foi aplicada por atraso na devolução",
        tipo: "erro",
        lida: false,
        valor: 5.0,
      }),
    ]);

    console.log(`✅ ${notificacoes.length} notificações criadas`);

    console.log("🎉 Seed do banco de dados concluído com sucesso!");
    console.log("\n📊 Resumo:");
    console.log(`   👥 Usuários: ${usuarios.length}`);
    console.log(`   📚 Materiais: ${materiais.length}`);
    console.log(`   📖 Empréstimos: ${emprestimos.length}`);
    console.log(`   📌 Reservas: ${reservas.length}`);
    console.log(`   🔔 Notificações: ${notificacoes.length}`);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    throw error;
  }
}

module.exports = seedDatabase;
