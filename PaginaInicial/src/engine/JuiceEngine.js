/**
 * JuiceEngine.js
 * Sistema Profissional de "Game Feel" (Impacto visual)
 */

window.JuiceEngine = {
  init() {
    // Injeta o CSS pro Juice dinamicamente se não existir
    if (!document.getElementById('juice-styles')) {
      const style = document.createElement('style');
      style.id = 'juice-styles';
      style.innerHTML = `
        @keyframes screen-shake-severe {
          0% { transform: translate(10px, 10px) rotate(0deg); }
          10% { transform: translate(-10px, -20px) rotate(-1deg); }
          20% { transform: translate(-30px, 0px) rotate(1deg); }
          30% { transform: translate(30px, 20px) rotate(0deg); }
          40% { transform: translate(10px, -10px) rotate(1deg); }
          50% { transform: translate(-10px, 20px) rotate(-1deg); }
          60% { transform: translate(-30px, 10px) rotate(0deg); }
          70% { transform: translate(30px, 10px) rotate(-1deg); }
          80% { transform: translate(-10px, -10px) rotate(1deg); }
          90% { transform: translate(10px, 20px) rotate(0deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes screen-shake-light {
          0% { transform: translate(2px, 2px); }
          20% { transform: translate(-2px, -4px); }
          40% { transform: translate(-4px, 0px); }
          60% { transform: translate(4px, 2px); }
          80% { transform: translate(-2px, -2px); }
          100% { transform: translate(0, 0); }
        }

        .shake-severe {
          animation: screen-shake-severe 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }

        .shake-light {
          animation: screen-shake-light 0.15s ease-out both;
        }

        .juice-dmg-text {
          position: fixed;
          pointer-events: none;
          font-family: 'UnifrakturCook', cursive;
          font-size: 40px;
          font-weight: bold;
          text-shadow: 0 0 10px black, 0 0 20px black, 2px 2px 0px #000;
          z-index: 99999;
          animation: dmg-float 1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes dmg-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-40px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }

        .juice-hitstop-flash {
          position: fixed;
          inset: 0;
          background: white;
          opacity: 0;
          pointer-events: none;
          z-index: 999998;
          transition: opacity 0.05s ease-out;
        }
      `;
      document.head.appendChild(style);

      const flashDiv = document.createElement('div');
      flashDiv.id = 'juice-hitstop-flash';
      flashDiv.className = 'juice-hitstop-flash';
      document.body.appendChild(flashDiv);
    }
  },

  shake(intensity = 'light') {
    const target = document.body; // Tremer a tela toda
    target.classList.remove('shake-severe', 'shake-light');
    // Força reflow
    void target.offsetWidth;
    
    if (intensity === 'severe') {
      target.classList.add('shake-severe');
    } else {
      target.classList.add('shake-light');
    }
    
    setTimeout(() => {
      target.classList.remove('shake-severe', 'shake-light');
    }, 400);
  },

  hitStop() {
    const flash = document.getElementById('juice-hitstop-flash');
    if (flash) {
      flash.style.opacity = '0.4';
      setTimeout(() => { flash.style.opacity = '0'; }, 50);
    }
  },

  spawnDamage(amount, isCrit, isHeal, x, y) {
    const div = document.createElement('div');
    div.className = 'juice-dmg-text';
    div.innerText = isHeal ? `+${amount}` : `-${amount}`;

    if (isCrit) {
      div.innerText += '!!';
      div.style.color = '#fbbf24'; // Amarelo Dourado
      div.style.fontSize = '60px';
      this.shake('severe');
      this.hitStop();
    } else if (isHeal) {
      div.style.color = '#4ade80'; // Verde cura
    } else {
      div.style.color = '#ef4444'; // Vermelho dano normal
    }

    // Adiciona uma pequena aleatoriedade no spawn para não encavalarem
    const offsetX = (Math.random() - 0.5) * 50;
    const offsetY = (Math.random() - 0.5) * 30;
    
    div.style.left = `${x + offsetX}px`;
    div.style.top = `${y + offsetY}px`;

    document.body.appendChild(div);

    // Cleanup após a animação
    setTimeout(() => {
      div.remove();
    }, 1000);
  },

  // Wrapper prático para jogar o número no monstro (ou herói)
  spawnDamageAtElement(amount, isCrit, isHeal, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    this.spawnDamage(amount, isCrit, isHeal, centerX, centerY);
  }
};

// Inicializa ao carregar o script
window.JuiceEngine.init();
