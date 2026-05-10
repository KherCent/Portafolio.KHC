class Particles {
    constructor(containerId) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.numberOfParticles = 50;
        
        if (!this.container) return;
        
        this.container.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.animate();
    }
    
    resize() {
        this.width = this.canvas.width = this.container.offsetWidth;
        this.height = this.canvas.height = this.container.offsetHeight;
    }
    
    init() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > this.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.height) p.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 243, 255, ${p.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Particles('particles-js');
});
