/**
 * AudioEngine.js
 * Sintetizador WebAudio puro (Sem dependência de MP3)
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.AudioEngine = {
  volume: 0.3,
  
  playTone(freq, type, duration, volMod = 1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(this.volume * volMod, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  },

  playNoise(duration, volMod = 1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(this.volume * volMod, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    // Filtro passa-baixa para o som de "Hit" carnudo
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
  },

  play(sfxName) {
    switch (sfxName) {
      case 'hit':
        // Dano comum (noise abafado)
        this.playNoise(0.2, 1.5);
        break;
      case 'crit':
        // Dano crítico (noise forte + tom agudo)
        this.playNoise(0.3, 2.0);
        this.playTone(800, 'square', 0.1, 0.5);
        break;
      case 'parry':
        // Som metálico (sine agudo com fade rápido)
        this.playTone(1200, 'sine', 0.3, 1.0);
        this.playTone(1500, 'triangle', 0.1, 0.5);
        break;
      case 'miss':
        // Som de vento (noise passa-baixa suave)
        this.playTone(150, 'sine', 0.3, 0.5);
        break;
      case 'heal': {
        // Som mágico subindo
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(this.volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
        break;
      }
      case 'warning':
        // Som de alerta do inimigo (grave)
        this.playTone(200, 'sawtooth', 0.4, 1.0);
        break;
      case 'click':
        // UI click
        this.playTone(600, 'sine', 0.05, 0.3);
        break;
    }
  }
};

document.addEventListener('click', (e) => {
  if (!window.AudioEngine) return;
  const isClickable = e.target.closest('button, .btn, .nav-main-item, .nav-sub-item, .item-card');
  if (isClickable) {
    window.AudioEngine.play('click');
  }
});
