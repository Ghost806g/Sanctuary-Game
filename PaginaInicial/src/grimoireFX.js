(function() {
    let canvas, ctx, particles = [], animationFrameId = null;

    function initCanvas() {
        canvas = document.getElementById('grimoire-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        
        // Crio as brasas
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
        
        if (!animationFrameId) loop();
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: Math.random() * -1.5 - 0.5,
            color: Math.random() > 0.5 ? 'rgba(239, 68, 68, ' : 'rgba(168, 85, 247, ', // Vermelho ou Roxo
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    function resize() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    function loop() {
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.opacity -= 0.002;
            
            if (p.y < -10 || p.opacity <= 0) {
                Object.assign(p, createParticle());
                p.y = canvas.height + 10;
                p.opacity = Math.random() * 0.5 + 0.2;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.opacity + ')';
            ctx.fill();
        });
        
        animationFrameId = requestAnimationFrame(loop);
    }

    // Exporta para controle global
    window.startGrimoireCanvas = function() {
        if (!canvas) initCanvas();
        if (canvas) canvas.style.opacity = '1';
    };

    window.stopGrimoireCanvas = function() {
        if (canvas) canvas.style.opacity = '0';
    };
})();
