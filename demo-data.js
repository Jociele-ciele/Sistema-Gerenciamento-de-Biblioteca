// Dados de Demonstração para o Sistema de Biblioteca
// Este arquivo contém dados de exemplo mais robustos para demonstração

const DEMO_DATA = {
  // Materiais de exemplo
  materiais: [
    {
      id: 1,
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
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
    {
      id: 4,
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
    },
    {
      id: 5,
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
    },
    {
      id: 6,
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
    },
    {
      id: 7,
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
    },
    {
      id: 8,
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
    },
  ],

  // Usuários de exemplo
  usuarios: [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-9999",
      tipo: "bibliotecario",
      pontos: 850,
      conquistas: 3,
      dataRegistro: new Date("2023-01-15"),
      ultimoAcesso: new Date(),
      emprestimosAtivos: 2,
      totalEmprestimos: 45,
      livrosLidos: 15,
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 88888-8888",
      tipo: "leitor",
      pontos: 420,
      conquistas: 1,
      dataRegistro: new Date("2023-03-20"),
      ultimoAcesso: new Date(),
      emprestimosAtivos: 1,
      totalEmprestimos: 12,
      livrosLidos: 8,
    },
    {
      id: 3,
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      telefone: "(11) 77777-7777",
      tipo: "leitor",
      pontos: 680,
      conquistas: 2,
      dataRegistro: new Date("2023-02-10"),
      ultimoAcesso: new Date(),
      emprestimosAtivos: 0,
      totalEmprestimos: 28,
      livrosLidos: 22,
    },
    {
      id: 4,
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      telefone: "(11) 66666-6666",
      tipo: "administrador",
      pontos: 1200,
      conquistas: 5,
      dataRegistro: new Date("2022-11-05"),
      ultimoAcesso: new Date(),
      emprestimosAtivos: 3,
      totalEmprestimos: 67,
      livrosLidos: 35,
    },
  ],

  // Empréstimos de exemplo
  emprestimos: [
    {
      id: 1,
      materialId: 2,
      usuarioId: 2,
      dataEmprestimo: new Date("2024-01-15"),
      dataVencimento: new Date("2024-01-29"),
      status: "ativo",
      renovacoes: 0,
      multa: 0,
    },
    {
      id: 2,
      materialId: 8,
      usuarioId: 4,
      dataEmprestimo: new Date("2024-01-10"),
      dataVencimento: new Date("2024-01-24"),
      status: "ativo",
      renovacoes: 1,
      multa: 0,
    },
    {
      id: 3,
      materialId: 1,
      usuarioId: 3,
      dataEmprestimo: new Date("2024-01-05"),
      dataVencimento: new Date("2024-01-19"),
      dataDevolucao: new Date("2024-01-18"),
      status: "devolvido",
      renovacoes: 0,
      multa: 0,
    },
  ],

  // Reservas de exemplo
  reservas: [
    {
      id: 1,
      materialId: 4,
      usuarioId: 2,
      dataReserva: new Date("2024-01-20"),
      status: "pendente",
      prioridade: 1,
    },
    {
      id: 2,
      materialId: 5,
      usuarioId: 3,
      dataReserva: new Date("2024-01-18"),
      status: "pendente",
      prioridade: 2,
    },
  ],

  // Notificações de exemplo
  notificacoes: [
    {
      id: 1,
      titulo: "Empréstimo próximo do vencimento",
      mensagem:
        "O livro 'Clean Code' deve ser devolvido em 2 dias (29/01/2024)",
      tipo: "aviso",
      lida: false,
      data: new Date(),
      usuarioId: 2,
      materialId: 2,
    },
    {
      id: 2,
      titulo: "Nova reserva disponível",
      mensagem: "O livro 'Sapiens' está disponível para retirada",
      tipo: "info",
      lida: false,
      data: new Date(),
      usuarioId: 2,
      materialId: 4,
    },
    {
      id: 3,
      titulo: "Parabéns! Nova conquista",
      mensagem:
        "Você desbloqueou a conquista 'Leitor Ávido' por ter lido 15 livros!",
      tipo: "conquista",
      lida: true,
      data: new Date("2024-01-15"),
      usuarioId: 1,
      pontosGanhos: 100,
    },
    {
      id: 4,
      titulo: "Renovação realizada",
      mensagem:
        "Seu empréstimo de 'Breve História do Tempo' foi renovado por mais 7 dias",
      tipo: "sucesso",
      lida: true,
      data: new Date("2024-01-22"),
      usuarioId: 4,
      materialId: 8,
    },
    {
      id: 5,
      titulo: "Multa aplicada",
      mensagem: "Uma multa de R$ 5,00 foi aplicada por atraso na devolução",
      tipo: "erro",
      lida: false,
      data: new Date(),
      usuarioId: 2,
      valor: 5.0,
    },
  ],

  // Estatísticas de exemplo
  estatisticas: {
    totalMateriais: 8,
    totalUsuarios: 4,
    emprestimosAtivos: 2,
    reservasPendentes: 2,
    materiaisMaisEmprestados: [
      { titulo: "Clean Code", emprestimos: 45 },
      { titulo: "1984", emprestimos: 38 },
      { titulo: "Dom Casmurro", emprestimos: 32 },
      { titulo: "Sapiens", emprestimos: 28 },
      { titulo: "O Senhor dos Anéis", emprestimos: 25 },
    ],
    emprestimosPorMes: [
      { mes: "Jan", quantidade: 45 },
      { mes: "Fev", quantidade: 52 },
      { mes: "Mar", quantidade: 38 },
      { mes: "Abr", quantidade: 41 },
      { mes: "Mai", quantidade: 47 },
      { mes: "Jun", quantidade: 43 },
    ],
    usuariosMaisAtivos: [
      { nome: "Pedro Oliveira", emprestimos: 67 },
      { nome: "João Silva", emprestimos: 45 },
      { nome: "Ana Costa", emprestimos: 28 },
      { nome: "Maria Santos", emprestimos: 12 },
    ],
  },

  // Categorias com descrições
  categorias: {
    ficcao: {
      nome: "Ficção",
      descricao: "Romances, contos, fantasia, ficção científica",
      cor: "#2563eb",
      icone: "fas fa-magic",
    },
    "nao-ficcao": {
      nome: "Não-Ficção",
      descricao: "Biografias, história, ciência, filosofia",
      cor: "#10b981",
      icone: "fas fa-book-open",
    },
    tecnico: {
      nome: "Técnico",
      descricao: "Tecnologia, programação, engenharia",
      cor: "#f59e0b",
      icone: "fas fa-code",
    },
    academico: {
      nome: "Acadêmico",
      descricao: "Pesquisa, teses, artigos científicos",
      cor: "#ef4444",
      icone: "fas fa-graduation-cap",
    },
  },
};

// Funções utilitárias para dados de demonstração
const DemoUtils = {
  // Obter material por ID
  getMaterial(id) {
    return DEMO_DATA.materiais.find((m) => m.id === id);
  },

  // Obter usuário por ID
  getUsuario(id) {
    return DEMO_DATA.usuarios.find((u) => u.id === id);
  },

  // Obter empréstimos ativos
  getEmprestimosAtivos() {
    return DEMO_DATA.emprestimos.filter((e) => e.status === "ativo");
  },

  // Obter reservas pendentes
  getReservasPendentes() {
    return DEMO_DATA.reservas.filter((r) => r.status === "pendente");
  },

  // Obter notificações não lidas
  getNotificacoesNaoLidas() {
    return DEMO_DATA.notificacoes.filter((n) => !n.lida);
  },

  // Obter materiais por categoria
  getMateriaisPorCategoria(categoria) {
    return DEMO_DATA.materiais.filter((m) => m.categoria === categoria);
  },

  // Obter materiais disponíveis
  getMateriaisDisponiveis() {
    return DEMO_DATA.materiais.filter((m) => m.status === "disponivel");
  },

  // Obter estatísticas gerais
  getEstatisticas() {
    return DEMO_DATA.estatisticas;
  },

  // Buscar materiais
  buscarMateriais(query) {
    const termo = query.toLowerCase();
    return DEMO_DATA.materiais.filter(
      (material) =>
        material.titulo.toLowerCase().includes(termo) ||
        material.autor.toLowerCase().includes(termo) ||
        material.isbn.includes(termo) ||
        material.descricao.toLowerCase().includes(termo)
    );
  },

  // Obter recomendações baseadas no histórico
  getRecomendacoes(usuarioId) {
    const usuario = this.getUsuario(usuarioId);
    if (!usuario) return [];

    // Simulação de algoritmo de recomendação
    const emprestimosUsuario = DEMO_DATA.emprestimos.filter(
      (e) => e.usuarioId === usuarioId
    );
    const materiaisEmprestados = emprestimosUsuario.map((e) =>
      this.getMaterial(e.materialId)
    );

    // Buscar materiais similares
    let recomendacoes = [];

    materiaisEmprestados.forEach((material) => {
      const similares = DEMO_DATA.materiais.filter(
        (m) =>
          m.categoria === material.categoria &&
          m.id !== material.id &&
          m.status === "disponivel"
      );
      recomendacoes = recomendacoes.concat(similares);
    });

    // Remover duplicatas e limitar a 5 recomendações
    return [...new Set(recomendacoes.map((r) => r.id))]
      .slice(0, 5)
      .map((id) => this.getMaterial(id));
  },

  // Simular atividade recente
  getAtividadeRecente() {
    return [
      {
        id: 1,
        tipo: "emprestimo",
        titulo: "Novo empréstimo",
        descricao: "Clean Code emprestado para Maria Santos",
        data: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        icone: "fas fa-book",
        cor: "#10b981",
      },
      {
        id: 2,
        tipo: "reserva",
        titulo: "Nova reserva",
        descricao: "Sapiens reservado por João Silva",
        data: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        icone: "fas fa-bookmark",
        cor: "#f59e0b",
      },
      {
        id: 3,
        tipo: "devolucao",
        titulo: "Devolução",
        descricao: "Dom Casmurro devolvido por Ana Costa",
        data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        icone: "fas fa-undo",
        cor: "#2563eb",
      },
      {
        id: 4,
        tipo: "material",
        titulo: "Novo material",
        descricao: "1984 adicionado ao acervo",
        data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        icone: "fas fa-plus",
        cor: "#ef4444",
      },
    ];
  },
};

// Exportar para uso global
window.DEMO_DATA = DEMO_DATA;
window.DemoUtils = DemoUtils;
