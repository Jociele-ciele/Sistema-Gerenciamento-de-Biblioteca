// Configurações do Sistema de Biblioteca
// Este arquivo contém todas as configurações globais do sistema

const CONFIG = {
  // Configurações da aplicação
  APP: {
    NAME: "Sistema de Gerenciamento de Biblioteca",
    VERSION: "1.0.0",
    AUTHOR: "Biblioteca Digital Team",
    DESCRIPTION: "Sistema moderno para gerenciamento de bibliotecas",
  },

  // Configurações de empréstimo
  LOAN: {
    DEFAULT_DAYS: 14, // Prazo padrão de empréstimo
    RENEWAL_DAYS: 7, // Dias adicionais na renovação
    MAX_RENEWALS: 2, // Máximo de renovações
    FINE_PER_DAY: 2.5, // Multa por dia de atraso (R$)
    GRACE_PERIOD_DAYS: 3, // Período de carência antes da multa
  },

  // Configurações de reserva
  RESERVATION: {
    EXPIRY_DAYS: 7, // Dias para expirar reserva não processada
    MAX_PER_USER: 5, // Máximo de reservas por usuário
    NOTIFICATION_HOURS: 24, // Horas para notificar disponibilidade
  },

  // Configurações de usuário
  USER: {
    TYPES: {
      ADMIN: "administrador",
      LIBRARIAN: "bibliotecario",
      READER: "leitor",
    },
    MAX_LOANS: {
      ADMIN: 20,
      LIBRARIAN: 15,
      READER: 10,
    },
  },

  // Configurações de materiais
  MATERIAL: {
    CATEGORIES: {
      FICTION: "ficcao",
      NON_FICTION: "nao-ficcao",
      TECHNICAL: "tecnico",
      ACADEMIC: "academico",
      MAGAZINE: "periodico",
      REFERENCE: "referencia",
    },
    STATUS: {
      AVAILABLE: "disponivel",
      BORROWED: "emprestado",
      RESERVED: "reservado",
      MAINTENANCE: "manutencao",
      LOST: "perdido",
    },
  },

  // Configurações de gamificação
  GAMIFICATION: {
    POINTS: {
      BORROW_BOOK: 10, // Pontos por empréstimo
      RETURN_ON_TIME: 5, // Pontos por devolução no prazo
      REVIEW_BOOK: 15, // Pontos por resenha
      FIRST_BORROW: 25, // Pontos no primeiro empréstimo
      MONTHLY_READER: 50, // Pontos por ser leitor do mês
    },
    ACHIEVEMENTS: {
      FIRST_BORROW: {
        name: "Primeiro Passo",
        description: "Realizou o primeiro empréstimo",
        icon: "fas fa-star",
        points: 25,
      },
      READER_1: {
        name: "Leitor Iniciante",
        description: "Lê 5 livros",
        icon: "fas fa-book",
        points: 100,
      },
      READER_5: {
        name: "Leitor Ávido",
        description: "Lê 25 livros",
        icon: "fas fa-book-open",
        points: 500,
      },
      PUNCTUAL: {
        name: "Pontual",
        description: "Devolveu 10 livros no prazo",
        icon: "fas fa-clock",
        points: 200,
      },
    },
  },

  // Configurações de notificações
  NOTIFICATIONS: {
    TYPES: {
      INFO: "info",
      WARNING: "aviso",
      SUCCESS: "sucesso",
      ERROR: "erro",
      ACHIEVEMENT: "conquista",
    },
    CHANNELS: {
      IN_APP: "sistema",
      EMAIL: "email",
      SMS: "sms",
      PUSH: "push",
    },
  },

  // Configurações de relatórios
  REPORTS: {
    TYPES: {
      LOANS: "emprestimos",
      MATERIALS: "materiais",
      USERS: "usuarios",
      FINES: "multas",
      POPULAR: "populares",
    },
    FORMATS: {
      PDF: "pdf",
      EXCEL: "excel",
      CSV: "csv",
    },
  },

  // Configurações de busca
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_RESULTS: 50,
    HIGHLIGHT_TAGS: ["mark"],
    FUZZY_SEARCH: true,
  },

  // Configurações de cache
  CACHE: {
    DURATION: 300000, // 5 minutos em ms
    MAX_ITEMS: 100,
  },

  // Configurações de API (para integração futura)
  API: {
    BASE_URL: "http://localhost:3000/api",
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
  },

  // Configurações de tema
  THEME: {
    PRIMARY_COLOR: "#2563eb",
    SECONDARY_COLOR: "#64748b",
    SUCCESS_COLOR: "#10b981",
    WARNING_COLOR: "#f59e0b",
    ERROR_COLOR: "#ef4444",
    FONT_FAMILY: "Inter, sans-serif",
    BORDER_RADIUS: "8px",
    SHADOW: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },

  // Configurações de acessibilidade
  ACCESSIBILITY: {
    FOCUS_INDICATOR: true,
    HIGH_CONTRAST: false,
    REDUCED_MOTION: false,
    SCREEN_READER: false,
  },

  // Configurações de desenvolvimento
  DEVELOPMENT: {
    DEBUG: true,
    LOG_LEVEL: "info", // debug, info, warn, error
    MOCK_DATA: true,
    PERFORMANCE_MONITORING: true,
  },
};

// Utilitários de configuração
const ConfigUtils = {
  // Obter configuração por caminho (ex: 'LOAN.DEFAULT_DAYS')
  get(path) {
    return path.split(".").reduce((obj, key) => obj?.[key], CONFIG);
  },

  // Definir configuração por caminho
  set(path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce(
      (obj, key) => (obj[key] = obj[key] || {}),
      CONFIG
    );
    target[lastKey] = value;
  },

  // Verificar se uma configuração existe
  has(path) {
    return this.get(path) !== undefined;
  },

  // Obter todas as configurações
  getAll() {
    return CONFIG;
  },

  // Exportar configurações para localStorage
  saveToStorage() {
    try {
      localStorage.setItem("biblioteca_config", JSON.stringify(CONFIG));
      return true;
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      return false;
    }
  },

  // Carregar configurações do localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem("biblioteca_config");
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        Object.assign(CONFIG, parsedConfig);
        return true;
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
    return false;
  },

  // Resetar para configurações padrão
  reset() {
    localStorage.removeItem("biblioteca_config");
    window.location.reload();
  },
};

// Carregar configurações salvas ao inicializar
ConfigUtils.loadFromStorage();

// Exportar para uso global
window.CONFIG = CONFIG;
window.ConfigUtils = ConfigUtils;
