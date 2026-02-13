export class BMXGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.isPlaying = false;
        this.score = 0;
        this.highScore = localStorage.getItem('bmxHighScore') || 0;
        this.gameSpeed = 5;
        this.obstacles = [];
        this.particles = [];

        // Player setup (BMX)
        this.player = {
            x: 50,
            y: 0, // Will be set in resize
            width: 40,
            height: 40,
            dy: 0,
            jumpForce: 12,
            gravity: 0.6,
            grounded: true,
            rotation: 0
        };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Controls
        const jump = () => {
            if (this.player.grounded && this.isPlaying) {
                this.player.dy = -this.player.jumpForce;
                this.player.grounded = false;
                this.createParticles(this.player.x + 10, this.player.y + 40);
            } else if (!this.isPlaying) {
                this.startGame();
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        });

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
        }, { passive: false });

        this.canvas.addEventListener('click', () => jump());

        // Draw initial state
        this.draw();
        this.drawStartScreen();
    }

    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.gameSpeed = 5;
        this.obstacles = [];
        this.lastObstacleTime = 0;
        this.animate();

        // Hide overlay if any
        const overlay = document.getElementById('game-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    gameOver() {
        this.isPlaying = false;
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('bmxHighScore', this.highScore);
        }
        this.drawGameOver();

        const overlay = document.getElementById('game-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.innerHTML = `<h3>GAME OVER</h3><p>Score: ${Math.floor(this.score)}</p><p class="blink">Pressione Espaço para Tentar Novamente</p>`;
        }
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.groundHeight = this.canvas.height - 50;
        this.player.y = this.groundHeight - this.player.height;
    }

    spawnObstacle() {
        const type = Math.random() > 0.5 ? 'cone' : 'box';
        this.obstacles.push({
            x: this.canvas.width,
            y: type === 'cone' ? this.groundHeight - 30 : this.groundHeight - 40,
            width: 30,
            height: type === 'cone' ? 30 : 40,
            type: type
        });
    }

    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * -2,
                color: '#333'
            });
        }
    }

    update() {
        // Player Physics
        if (this.isPlaying) {
            this.player.dy += this.player.gravity;
            this.player.y += this.player.dy;

            // Ground collision
            if (this.player.y + this.player.height > this.groundHeight) {
                this.player.y = this.groundHeight - this.player.height;
                this.player.dy = 0;
                this.player.grounded = true;
                this.player.rotation = 0;
            } else {
                // Rotate while jumping
                this.player.rotation += 0.1;
            }

            // Obstacles
            this.gameSpeed += 0.003;
            this.score += 0.1;

            if (Date.now() - this.lastObstacleTime > 1500 + Math.random() * 1000) {
                this.spawnObstacle();
                this.lastObstacleTime = Date.now();
            }

            this.obstacles.forEach((obs, index) => {
                obs.x -= this.gameSpeed;

                // Collision Detection (Simple AABB)
                if (
                    this.player.x < obs.x + obs.width &&
                    this.player.x + this.player.width > obs.x &&
                    this.player.y < obs.y + obs.height &&
                    this.player.y + this.player.height > obs.y
                ) {
                    this.gameOver();
                }

                // Remove off-screen
                if (obs.x + obs.width < 0) {
                    this.obstacles.splice(index, 1);
                }
            });

            // Particles
            this.particles.forEach((p, index) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.size *= 0.95;
                if (p.size < 0.1) this.particles.splice(index, 1);
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Ground Line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundHeight);
        this.ctx.lineTo(this.canvas.width, this.groundHeight);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Player (Simple BMX shape or Icon)
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.ctx.rotate(this.player.rotation);

        // Draw Bike Body (Conceptual)
        // Helper to draw circle
        const circle = (x, y, r, fill = true) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            if (fill) this.ctx.fill();
            else this.ctx.stroke();
        };

        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2; // Sleeker lines

        // 1. Wheels
        circle(-15, 15, 9, false); // Back Wheel
        circle(15, 15, 9, false);  // Front Wheel

        // 2. Frame
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 15); // Back axle
        this.ctx.lineTo(-5, 5);   // Seat tube bottom
        this.ctx.lineTo(10, 5);   // Top tube front
        this.ctx.lineTo(15, 15);  // Front Fork drop
        this.ctx.moveTo(-5, 5);
        this.ctx.lineTo(-5, -5);  // Seat post
        this.ctx.lineTo(10, 5);   // Down tube join
        this.ctx.stroke();

        // 3. Handlebars
        this.ctx.beginPath();
        this.ctx.moveTo(10, 5);
        this.ctx.lineTo(8, -8);   // Head tube top
        this.ctx.lineTo(12, -10); // Bars
        this.ctx.stroke();

        // 4. Seat
        this.ctx.fillRect(-8, -5, 6, 2);

        // 5. Rider (Simplified Stickman)
        this.ctx.strokeStyle = '#ff3333'; // Red Accent for Rider
        this.ctx.beginPath();
        this.ctx.moveTo(-5, -5);  // Hips on seat
        this.ctx.lineTo(0, -15);  // Back
        this.ctx.lineTo(8, -8);   // Hands on bars
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(-5, -25); // Head position approx
        this.ctx.stroke();

        // Head
        this.ctx.fillStyle = '#ff3333';
        circle(0, -20, 3, true);

        // Legs
        this.ctx.strokeStyle = '#ff3333';
        this.ctx.beginPath();
        this.ctx.moveTo(-5, -5); // Hips
        this.ctx.lineTo(0, 10);  // Pedals approx
        this.ctx.stroke();

        this.ctx.restore();

        // Obstacles
        this.obstacles.forEach(obs => {
            this.ctx.fillStyle = '#ff0055'; // Danger color
            if (obs.type === 'cone') {
                this.ctx.beginPath();
                this.ctx.moveTo(obs.x, obs.y + obs.height);
                this.ctx.lineTo(obs.x + obs.width / 2, obs.y);
                this.ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }
        });

        // Particles
        this.obstacles.forEach(obs => {
            // ... existing code ...
        });

        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Score
        this.ctx.fillStyle = '#333';
        this.ctx.font = '20px "Space Grotesk"';
        this.ctx.fillText(`Score: ${Math.floor(this.score)}`, 20, 30);
        this.ctx.fillText(`HI: ${this.highScore}`, 20, 60);
    }

    drawStartScreen() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Text is now handled by the HTML overlay to prevent blurry/cut-off text
    }

    drawGameOver() {
        // Handled by DOM overlay mostly, but fallback here
    }

    animate() {
        if (!this.isPlaying) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
