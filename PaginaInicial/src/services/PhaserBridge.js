class PhaserBridge {
  constructor() {
    this.game = null;
    this.listeners = {};
  }

  // Inicializa o jogo passando o ID do container
  init(containerId) {
    if (this.game) return; // Evita múltiplas instâncias
    if (window.StartPhaserGame) {
      this.game = window.StartPhaserGame(containerId);
      console.log("[PhaserBridge] Phaser Game inicializado!");
    } else {
      console.error("[PhaserBridge] window.StartPhaserGame não encontrado. O módulo foi carregado?");
    }
  }

  // O main_v3.js pode emitir eventos para o Phaser
  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(payload));
    }
  }

  // Cenas do Phaser podem se inscrever para ouvir eventos
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
}

// Cria uma instância global para que ambos os lados (HTML/JS e Phaser) possam acessar
window.PhaserBridge = new PhaserBridge();
