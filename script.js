/**
 * 1. CURSOR LOGIC
 * Replaces the default pointer with a following heart
 */
const cursor = document.getElementById('heart-cursor');

document.addEventListener('mousemove', (e) => {
    // -10px centers the heart on the mouse tip
    cursor.style.left = (e.clientX - 10) + 'px';
    cursor.style.top = (e.clientY - 10) + 'px';
});

// Scale effect when clicking
document.addEventListener('mousedown', () => cursor.style.transform = 'rotate(45deg) scale(0.8)');
document.addEventListener('mouseup', () => cursor.style.transform = 'rotate(45deg) scale(1)');


/**
 * 2. SAKURA PETAL ANIMATION
 * Draws falling petals on the background canvas
 */
const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let petals = [];

class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 7 + 3;
        this.speed = Math.random() * 1.5 + 0.5;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.2 - 0.1;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#ffb6c1';
        // Draw petal shape
        ctx.ellipse(this.x, this.y, this.size, this.size / 2, this.angle, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.5;
        this.angle += this.spin;
        // Reset petal to top once it leaves screen
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
}

// Create 50 petal instances
for (let i = 0; i < 50; i++) {
    petals.push(new Petal());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();


/**
 * 3. LOVE LETTER LOGIC
 * Toggles the "open" state of the little reminder notes
 */
document.querySelectorAll('.note-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('open');
        // Changes background to white when opened for a "paper" look
        card.style.background = card.classList.contains('open') 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(255, 255, 255, 0.25)';
    });
});


/**
 * 4. SCROLL REVEAL LOGIC
 * Makes elements slide into view as she scrolls down
 */
const observerOptions = {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once it's visible
            // revealObserver.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Target both song cards and note cards
document.querySelectorAll('.song-card, .note-card, .glass-box').forEach(el => {
    revealObserver.observe(el);
});

const audioPlayer = document.getElementById('main-audio-player');
const songCards = document.querySelectorAll('.song-card');

songCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevent click if she's clicking the Spotify icon itself
        if (e.target.closest('.spotify-link')) return;

        const audioSrc = this.getAttribute('data-audio');

        if (audioPlayer.src.includes(audioSrc) && !audioPlayer.paused) {
            audioPlayer.pause();
            this.classList.remove('playing-song');
        } else {
            audioPlayer.src = audioSrc;
            audioPlayer.play();

            songCards.forEach(c => c.classList.remove('playing-song'));
            this.classList.add('playing-song');
        }
    });
});

// Update Progress Bar
audioPlayer.addEventListener('timeupdate', () => {
    const activeCard = document.querySelector('.song-card.playing-song');
    if (activeCard) {
        const progressBar = activeCard.querySelector('.progress-bar');
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = percentage + '%';
    }
});

// Handle end of song
audioPlayer.addEventListener('ended', () => {
    songCards.forEach(c => c.classList.remove('playing-song'));
});