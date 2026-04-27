const cursor = document.getElementById('heart-cursor');

document.addEventListener('mousemove', (e) => {
    // Moves the heart with the mouse
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // 3D Tilt for Photos
    const frames = document.querySelectorAll('.photo-frame');
    const x = (window.innerWidth / 2 - e.clientX) / 20;
    const y = (window.innerHeight / 2 - e.clientY) / 20;

    frames.forEach(frame => {
        frame.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
});

// Click Animations
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'rotate(45deg) scale(0.7)';
});
document.addEventListener('mouseup', () => {
    cursor.style.transform = 'rotate(45deg) scale(1)';
});

// --- Sakura Animation ---
const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let petals = [];
class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speed = Math.random() * 1 + 0.5;
        this.angle = Math.random() * 360;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#ffb6c1';
        ctx.ellipse(this.x, this.y, this.size, this.size/2, this.angle, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) this.y = -10;
    }
}
for (let i = 0; i < 50; i++) petals.push(new Petal());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// --- Music Logic ---
const player = document.getElementById('player-toggle');
const music = document.getElementById('bg-music');
if(player) {
    player.addEventListener('click', () => {
        if (music.paused) { music.play(); player.classList.add('playing'); }
        else { music.pause(); player.classList.remove('playing'); }
    });
}

// --- Scrolling Background Text ---
window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    document.querySelectorAll('.bg-text').forEach((text, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        text.style.transform = `translateX(${scroll * (i + 1) * 0.15 * direction}px)`;
    });
});