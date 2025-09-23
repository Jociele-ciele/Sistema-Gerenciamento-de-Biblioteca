// Sistema de Gerenciamento de Biblioteca
// Autor: Sistema Biblioteca Digital
// Versão: 1.0.0

class BibliotecaSystem {
  constructor() {
    this.currentUser = null;
    this.materiais = [];
    this.emprestimos = [];
    this.reservas = [];
    this.usuarios = [];
    this.notificacoes = [];
    this.init();
  }

  init() {
    this.loadSampleData();
    this.setupEventListeners();
    this.initializeCharts();
    this.showLoadingScreen();
    this.checkAuthentication();
  }

  // Carregar dados de demonstração
  loadSampleData() {
    // Usar dados de demonstração se disponíveis
    if (window.DEMO_DATA) {
      this.materiais = [...DEMO_DATA.materiais];
      this.usuarios = [...DEMO_DATA.usuarios];
      this.emprestimos = [...DEMO_DATA.emprestimos];
      this.reservas = [...DEMO_DATA.reservas];
      this.notificacoes = [...DEMO_DATA.notificacoes];
      this.currentUser = this.usuarios[0];
    } else {
      // Fallback para dados básicos
      this.materiais = [
        {
          id: 1,
          titulo: "Dom Casmurro",
          autor: "Machado de Assis",
          isbn: "978-85-7232-200-1",
          categoria: "ficcao",
          editora: "Editora Nova Aguilar",
          ano: 1899,
          descricao: "Romance clássico da literatura brasileira",
          status: "disponivel",
          imagem: "books-2562331_640.jpg",
        },
        {
          id: 2,
          titulo: "Clean Code",
          autor: "Robert C. Martin",
          isbn: "978-85-262-5000-2",
          categoria: "tecnico",
          editora: "Alta Books",
          ano: 2008,
          descricao: "Guia para escrever código limpo e profissional",
          status: "emprestado",
          imagem: "books-2617938_1280.jpg",
        },
      ];

      this.usuarios = [
        {
          id: 1,
          nome: "João Silva",
          email: "joao@email.com",
          telefone: "(11) 99999-9999",
          tipo: "bibliotecario",
          pontos: 850,
          conquistas: 3,
        },
      ];

      this.emprestimos = [];
      this.reservas = [];
      this.notificacoes = [];
      this.currentUser = this.usuarios[0];
    }
  }

  setupEventListeners() {
    // Navegação
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.getAttribute("href").substring(1);
        this.showSection(target);
      });
    });

    // Busca de materiais
    const searchInput = document.getElementById("material-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchMaterials(e.target.value);
      });
    }

    // Filtros
    const categoriaFilter = document.getElementById("categoria-filter");
    const statusFilter = document.getElementById("status-filter");

    if (categoriaFilter) {
      categoriaFilter.addEventListener("change", () => {
        this.filterMaterials();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", () => {
        this.filterMaterials();
      });
    }

    // Formulário de adicionar material
    const addMaterialForm = document.getElementById("add-material-form");
    if (addMaterialForm) {
      addMaterialForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addMaterial();
      });
    }

    // Notificações
    const notificationsBtn = document.querySelector(".notifications");
    if (notificationsBtn) {
      notificationsBtn.addEventListener("click", () => {
        this.showNotificationsModal();
      });
    }

    // Menu mobile
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    // Fechar modais ao clicar fora
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        this.closeModal(e.target.id);
      }
    });
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        this.updateDashboard();
        this.loadMaterials();
        this.loadRecentActivity();
      }, 500);
    }, 2000);
  }

  checkAuthentication() {
    // Simulação de verificação de autenticação
    if (!this.currentUser) {
      this.showLoginModal();
    } else {
      this.updateUserInfo();
    }
  }

  updateUserInfo() {
    const userName = document.getElementById("user-name");
    const profileName = document.getElementById("profile-name");

    if (userName) userName.textContent = this.currentUser.nome;
    if (profileName) profileName.textContent = this.currentUser.nome;

    // Atualizar informações do perfil
    const profileEmail = document.getElementById("profile-email");
    const profilePhone = document.getElementById("profile-phone");
    const profileFullname = document.getElementById("profile-fullname");

    if (profileEmail) profileEmail.value = this.currentUser.email;
    if (profilePhone) profilePhone.value = this.currentUser.telefone;
    if (profileFullname) profileFullname.value = this.currentUser.nome;
  }

  showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Atualizar navegação ativa
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }

    // Carregar conteúdo específico da seção
    switch (sectionId) {
      case "inicio":
        this.updateDashboard();
        break;
      case "acervo":
        this.loadMaterials();
        break;
      case "emprestimos":
        this.loadLoans();
        break;
      case "reservas":
        this.loadReservations();
        break;
      case "relatorios":
        this.updateCharts();
        break;
    }
  }

  updateDashboard() {
    // Atualizar estatísticas
    const totalLivros = document.getElementById("total-livros");
    const totalUsuarios = document.getElementById("total-usuarios");
    const emprestimosAtivos = document.getElementById("emprestimos-ativos");
    const reservasPendentes = document.getElementById("reservas-pendentes");

    if (totalLivros)
      totalLivros.textContent = this.materiais.length.toLocaleString();
    if (totalUsuarios)
      totalUsuarios.textContent = this.usuarios.length.toLocaleString();
    if (emprestimosAtivos)
      emprestimosAtivos.textContent = this.emprestimos.filter(
        (e) => e.status === "ativo"
      ).length;
    if (reservasPendentes)
      reservasPendentes.textContent = this.reservas.filter(
        (r) => r.status === "pendente"
      ).length;
  }

  loadMaterials() {
    const materialsGrid = document.getElementById("materials-grid");
    if (!materialsGrid) return;

    materialsGrid.innerHTML = "";

    this.materiais.forEach((material) => {
      const materialCard = this.createMaterialCard(material);
      materialsGrid.appendChild(materialCard);
    });
  }

  createMaterialCard(material) {
    const card = document.createElement("div");
    card.className = "material-card fade-in";

    const statusText = {
      disponivel: "Disponível",
      emprestado: "Emprestado",
      reservado: "Reservado",
    };

    const categoriaText = {
      ficcao: "Ficção",
      "nao-ficcao": "Não-Ficção",
      tecnico: "Técnico",
      academico: "Acadêmico",
    };

    card.innerHTML = `
            <div class="material-image">
                <i class="fas fa-book"></i>
            </div>
            <div class="material-info">
                <h3 class="material-title">${material.titulo}</h3>
                <p class="material-author">por ${material.autor}</p>
                <div class="material-meta">
                    <span class="material-category">${
                      categoriaText[material.categoria] || material.categoria
                    }</span>
                    <span class="material-status status-${material.status}">${
      statusText[material.status]
    }</span>
                </div>
                <div class="material-actions">
                    ${
                      material.status === "disponivel"
                        ? '<button class="btn-emprestar" onclick="bibliotecaSystem.emprestarMaterial(' +
                          material.id +
                          ')">Emprestar</button>'
                        : ""
                    }
                    ${
                      material.status === "disponivel" ||
                      material.status === "emprestado"
                        ? '<button class="btn-reservar" onclick="bibliotecaSystem.reservarMaterial(' +
                          material.id +
                          ')">Reservar</button>'
                        : ""
                    }
                    <button class="btn-detalhes" onclick="bibliotecaSystem.verDetalhesMaterial(${
                      material.id
                    })">Detalhes</button>
                </div>
            </div>
        `;

    return card;
  }

  searchMaterials(query) {
    const filteredMaterials = this.materiais.filter(
      (material) =>
        material.titulo.toLowerCase().includes(query.toLowerCase()) ||
        material.autor.toLowerCase().includes(query.toLowerCase()) ||
        material.isbn.includes(query)
    );

    const materialsGrid = document.getElementById("materials-grid");
    if (!materialsGrid) return;

    materialsGrid.innerHTML = "";
    filteredMaterials.forEach((material) => {
      const materialCard = this.createMaterialCard(material);
      materialsGrid.appendChild(materialCard);
    });
  }

  filterMaterials() {
    const categoriaFilter = document.getElementById("categoria-filter");
    const statusFilter = document.getElementById("status-filter");
    const searchInput = document.getElementById("material-search");

    let filteredMaterials = this.materiais;

    // Filtro por categoria
    if (categoriaFilter && categoriaFilter.value) {
      filteredMaterials = filteredMaterials.filter(
        (m) => m.categoria === categoriaFilter.value
      );
    }

    // Filtro por status
    if (statusFilter && statusFilter.value) {
      filteredMaterials = filteredMaterials.filter(
        (m) => m.status === statusFilter.value
      );
    }

    // Filtro por busca
    if (searchInput && searchInput.value) {
      const query = searchInput.value.toLowerCase();
      filteredMaterials = filteredMaterials.filter(
        (material) =>
          material.titulo.toLowerCase().includes(query) ||
          material.autor.toLowerCase().includes(query) ||
          material.isbn.includes(query)
      );
    }

    const materialsGrid = document.getElementById("materials-grid");
    if (!materialsGrid) return;

    materialsGrid.innerHTML = "";
    filteredMaterials.forEach((material) => {
      const materialCard = this.createMaterialCard(material);
      materialsGrid.appendChild(materialCard);
    });
  }

  showAddMaterialModal() {
    this.openModal("add-material-modal");
  }

  addMaterial() {
    const form = document.getElementById("add-material-form");
    const formData = new FormData(form);

    const novoMaterial = {
      id: this.materiais.length + 1,
      titulo: document.getElementById("material-title").value,
      autor: document.getElementById("material-author").value,
      isbn: document.getElementById("material-isbn").value,
      categoria: document.getElementById("material-category").value,
      editora: document.getElementById("material-publisher").value,
      ano:
        parseInt(document.getElementById("material-year").value) ||
        new Date().getFullYear(),
      descricao: document.getElementById("material-description").value,
      status: "disponivel",
      imagem: "books-2562331_640.jpg",
    };

    this.materiais.push(novoMaterial);
    this.closeModal("add-material-modal");
    this.loadMaterials();
    this.showNotification("Material adicionado com sucesso!", "success");

    // Limpar formulário
    form.reset();
  }

  emprestarMaterial(materialId) {
    const material = this.materiais.find((m) => m.id === materialId);
    if (!material) return;

    if (material.status !== "disponivel") {
      this.showNotification(
        "Material não está disponível para empréstimo",
        "error"
      );
      return;
    }

    // Simular empréstimo
    material.status = "emprestado";

    const novoEmprestimo = {
      id: this.emprestimos.length + 1,
      materialId: materialId,
      usuarioId: this.currentUser.id,
      dataEmprestimo: new Date(),
      dataVencimento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
      status: "ativo",
    };

    this.emprestimos.push(novoEmprestimo);
    this.loadMaterials();
    this.showNotification(
      `Livro "${material.titulo}" emprestado com sucesso!`,
      "success"
    );
  }

  reservarMaterial(materialId) {
    const material = this.materiais.find((m) => m.id === materialId);
    if (!material) return;

    const novaReserva = {
      id: this.reservas.length + 1,
      materialId: materialId,
      usuarioId: this.currentUser.id,
      dataReserva: new Date(),
      status: "pendente",
    };

    this.reservas.push(novaReserva);
    this.showNotification(
      `Reserva para "${material.titulo}" realizada com sucesso!`,
      "success"
    );
  }

  verDetalhesMaterial(materialId) {
    const material = this.materiais.find((m) => m.id === materialId);
    if (!material) return;

    // Criar modal de detalhes
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Detalhes do Material</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding: 30px;">
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin-bottom: 30px;">
                        <div style="text-align: center;">
                            <div class="material-image" style="margin: 0 auto 20px;">
                                <i class="fas fa-book" style="font-size: 64px;"></i>
                            </div>
                        </div>
                        <div>
                            <h2 style="margin-bottom: 10px; color: var(--text-primary);">${
                              material.titulo
                            }</h2>
                            <p style="color: var(--text-secondary); margin-bottom: 20px;">por ${
                              material.autor
                            }</p>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <strong>ISBN:</strong><br>
                                    ${material.isbn || "Não informado"}
                                </div>
                                <div>
                                    <strong>Editora:</strong><br>
                                    ${material.editora || "Não informado"}
                                </div>
                                <div>
                                    <strong>Ano:</strong><br>
                                    ${material.ano || "Não informado"}
                                </div>
                                <div>
                                    <strong>Status:</strong><br>
                                    <span class="material-status status-${
                                      material.status
                                    }">${material.status}</span>
                                </div>
                            </div>
                            <p><strong>Descrição:</strong></p>
                            <p style="color: var(--text-secondary);">${
                              material.descricao || "Sem descrição disponível."
                            }</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  loadLoans() {
    const activeLoansTable = document.getElementById("active-loans-table");
    if (!activeLoansTable) return;

    activeLoansTable.innerHTML = "";

    this.emprestimos
      .filter((emprestimo) => emprestimo.status === "ativo")
      .forEach((emprestimo) => {
        const material = this.materiais.find(
          (m) => m.id === emprestimo.materialId
        );
        const usuario = this.usuarios.find(
          (u) => u.id === emprestimo.usuarioId
        );

        if (material && usuario) {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>${material.titulo}</td>
                    <td>${usuario.nome}</td>
                    <td>${this.formatDate(emprestimo.dataEmprestimo)}</td>
                    <td>${this.formatDate(emprestimo.dataVencimento)}</td>
                    <td><span class="material-status status-emprestado">Ativo</span></td>
                    <td>
                        <button class="btn-secondary" onclick="bibliotecaSystem.renovarEmprestimo(${
                          emprestimo.id
                        })">Renovar</button>
                        <button class="btn-primary" onclick="bibliotecaSystem.devolverEmprestimo(${
                          emprestimo.id
                        })">Devolver</button>
                    </td>
                `;
          activeLoansTable.appendChild(row);
        }
      });
  }

  renovarEmprestimo(emprestimoId) {
    const emprestimo = this.emprestimos.find((e) => e.id === emprestimoId);
    if (!emprestimo) return;

    // Adicionar 7 dias à data de vencimento
    emprestimo.dataVencimento = new Date(
      emprestimo.dataVencimento.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    this.showNotification("Empréstimo renovado com sucesso!", "success");
    this.loadLoans();
  }

  devolverEmprestimo(emprestimoId) {
    const emprestimo = this.emprestimos.find((e) => e.id === emprestimoId);
    if (!emprestimo) return;

    // Atualizar status do material
    const material = this.materiais.find((m) => m.id === emprestimo.materialId);
    if (material) {
      material.status = "disponivel";
    }

    // Atualizar status do empréstimo
    emprestimo.status = "devolvido";
    emprestimo.dataDevolucao = new Date();

    this.showNotification("Material devolvido com sucesso!", "success");
    this.loadLoans();
    this.loadMaterials();
  }

  loadReservations() {
    const reservationsGrid = document.getElementById("reservations-grid");
    if (!reservationsGrid) return;

    reservationsGrid.innerHTML = "";

    this.reservas.forEach((reserva) => {
      const material = this.materiais.find((m) => m.id === reserva.materialId);
      const usuario = this.usuarios.find((u) => u.id === reserva.usuarioId);

      if (material && usuario) {
        const reservaCard = document.createElement("div");
        reservaCard.className = "material-card";
        reservaCard.innerHTML = `
                    <div class="material-image">
                        <i class="fas fa-bookmark"></i>
                    </div>
                    <div class="material-info">
                        <h3 class="material-title">${material.titulo}</h3>
                        <p class="material-author">por ${material.autor}</p>
                        <div class="material-meta">
                            <span>Reservado por: ${usuario.nome}</span>
                            <span class="material-status status-reservado">Pendente</span>
                        </div>
                        <div class="material-actions">
                            <button class="btn-emprestar" onclick="bibliotecaSystem.processarReserva(${reserva.id})">Processar</button>
                            <button class="btn-detalhes" onclick="bibliotecaSystem.cancelarReserva(${reserva.id})">Cancelar</button>
                        </div>
                    </div>
                `;
        reservationsGrid.appendChild(reservaCard);
      }
    });
  }

  processarReserva(reservaId) {
    const reserva = this.reservas.find((r) => r.id === reservaId);
    if (!reserva) return;

    // Criar empréstimo
    const novoEmprestimo = {
      id: this.emprestimos.length + 1,
      materialId: reserva.materialId,
      usuarioId: reserva.usuarioId,
      dataEmprestimo: new Date(),
      dataVencimento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "ativo",
    };

    this.emprestimos.push(novoEmprestimo);

    // Atualizar status do material
    const material = this.materiais.find((m) => m.id === reserva.materialId);
    if (material) {
      material.status = "emprestado";
    }

    // Remover reserva
    this.reservas = this.reservas.filter((r) => r.id !== reservaId);

    this.showNotification("Reserva processada com sucesso!", "success");
    this.loadReservations();
    this.loadMaterials();
  }

  cancelarReserva(reservaId) {
    this.reservas = this.reservas.filter((r) => r.id !== reservaId);
    this.showNotification("Reserva cancelada!", "info");
    this.loadReservations();
  }

  loadRecentActivity() {
    const activityList = document.getElementById("activity-list");
    if (!activityList) return;

    // Usar dados de demonstração se disponíveis
    let activities;
    if (window.DemoUtils) {
      activities = window.DemoUtils.getAtividadeRecente();
    } else {
      activities = [
        {
          icon: "fas fa-book",
          title: "Novo empréstimo",
          description: "Clean Code emprestado para Maria Santos",
          time: "2 horas atrás",
        },
        {
          icon: "fas fa-bookmark",
          title: "Nova reserva",
          description: "Sapiens reservado por João Silva",
          time: "1 dia atrás",
        },
        {
          icon: "fas fa-undo",
          title: "Devolução",
          description: "Dom Casmurro devolvido por Ana Costa",
          time: "2 dias atrás",
        },
        {
          icon: "fas fa-plus",
          title: "Novo material",
          description: "1984 adicionado ao acervo",
          time: "3 dias atrás",
        },
      ];
    }

    activityList.innerHTML = "";

    activities.forEach((activity) => {
      const activityItem = document.createElement("div");
      activityItem.className = "activity-item";

      const timeAgo = this.getTimeAgo(activity.data || new Date());

      activityItem.innerHTML = `
                <div class="activity-icon" style="background: ${
                  activity.cor || "var(--primary-color)"
                }">
                    <i class="${activity.icone || activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.titulo || activity.title}</h4>
                    <p>${
                      activity.descricao || activity.description
                    } • ${timeAgo}</p>
                </div>
            `;
      activityList.appendChild(activityItem);
    });
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "agora mesmo";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    return `${Math.floor(diffInSeconds / 2592000)} meses atrás`;
  }

  showNotificationsModal() {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.id = "notifications-modal";

    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Notificações</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="notifications-list" style="max-height: 400px; overflow-y: auto;">
                    ${this.notificacoes
                      .map(
                        (notif) => `
                        <div class="activity-item ${
                          notif.lida ? "" : "unread"
                        }">
                            <div class="activity-icon">
                                <i class="fas fa-${
                                  notif.tipo === "aviso"
                                    ? "exclamation-triangle"
                                    : notif.tipo === "info"
                                    ? "info-circle"
                                    : "trophy"
                                }"></i>
                            </div>
                            <div class="activity-content">
                                <h4>${notif.titulo}</h4>
                                <p>${notif.mensagem}</p>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  showQRScanner() {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.id = "qr-scanner-modal";

    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Scanner de QR Code</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="qr-scanner-container">
                    <div id="qr-reader" style="width: 100%; max-width: 400px; margin: 0 auto;"></div>
                    <div class="qr-result" id="qr-result"></div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Inicializar scanner QR (simulação)
    setTimeout(() => {
      this.simulateQRScan();
    }, 1000);
  }

  simulateQRScan() {
    const qrResult = document.getElementById("qr-result");
    if (qrResult) {
      qrResult.style.display = "block";
      qrResult.innerHTML = `
                <h4>QR Code Lido com Sucesso!</h4>
                <p><strong>Material:</strong> Clean Code</p>
                <p><strong>Autor:</strong> Robert C. Martin</p>
                <p><strong>Status:</strong> Disponível</p>
                <button class="btn-primary" onclick="bibliotecaSystem.emprestarMaterial(2)">
                    Emprestar Material
                </button>
            `;
    }
  }

  initializeCharts() {
    // Inicializar gráficos quando a página carregar
    setTimeout(() => {
      this.updateCharts();
    }, 3000);
  }

  updateCharts() {
    // Gráfico de empréstimos por mês
    const loansCtx = document.getElementById("loans-chart");
    if (loansCtx) {
      new Chart(loansCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Empréstimos",
              data: [12, 19, 3, 5, 2, 3],
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Empréstimos por Mês",
            },
          },
        },
      });
    }

    // Gráfico de materiais por categoria
    const materialsCtx = document.getElementById("materials-chart");
    if (materialsCtx) {
      new Chart(materialsCtx, {
        type: "doughnut",
        data: {
          labels: ["Ficção", "Não-Ficção", "Técnico", "Acadêmico"],
          datasets: [
            {
              data: [45, 30, 15, 10],
              backgroundColor: ["#2563eb", "#10b981", "#f59e0b", "#ef4444"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Distribuição por Categoria",
            },
          },
        },
      });
    }
  }

  generateReport(type) {
    this.showNotification(`Gerando relatório de ${type}...`, "info");

    // Simular geração de relatório
    setTimeout(() => {
      this.showNotification("Relatório gerado com sucesso!", "success");
    }, 2000);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#10b981"
                : type === "error"
                ? "#ef4444"
                : type === "warning"
                ? "#f59e0b"
                : "#2563eb"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

    notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : type === "warning"
                    ? "exclamation-triangle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  logout() {
    if (confirm("Tem certeza que deseja sair?")) {
      this.currentUser = null;
      this.showNotification("Logout realizado com sucesso!", "info");
      // Redirecionar para login ou recarregar página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  toggleMobileMenu() {
    const navMenu = document.querySelector(".nav-menu");
    navMenu.classList.toggle("active");
  }
}

// Funções globais para uso nos event handlers HTML
function showSection(sectionId) {
  bibliotecaSystem.showSection(sectionId);
}

function showAddMaterialModal() {
  bibliotecaSystem.showAddMaterialModal();
}

function showQRScanner() {
  bibliotecaSystem.showQRScanner();
}

function showNotificationsModal() {
  bibliotecaSystem.showNotificationsModal();
}

function logout() {
  bibliotecaSystem.logout();
}

// Inicializar sistema quando a página carregar
let bibliotecaSystem;
document.addEventListener("DOMContentLoaded", () => {
  bibliotecaSystem = new BibliotecaSystem();
});

// Adicionar estilos para animações
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-unread {
        background: rgba(37, 99, 235, 0.05);
        border-left: 4px solid var(--primary-color);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--surface-color);
            box-shadow: var(--shadow-md);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-menu ul {
            flex-direction: column;
            padding: 20px;
        }
    }
`;
document.head.appendChild(style);
