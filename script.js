// Background Audio
const musicBtn = document.getElementById("musicBtn");

const music = document.getElementById("bgMusic");

const container = document.querySelector(".container");

const box = document.querySelector(".box");

const yesBtn = document.getElementById("yesBtn");

const yesMusic = document.getElementById("yesMusic");
const tapHint = document.querySelector(".tap-hint");

musicBtn.addEventListener("click", () => {

    // START VOLUME 0
    music.volume = 0;

    // PLAY MUSIC
    music.play();

    // SMOOTH FADE IN
    let vol = 0;

    const fade = setInterval(() => {

        if (vol < 0.5) {

            vol += 0.02;
            music.volume = vol;

        } else {

            clearInterval(fade);

        }

    }, 120);

    // HIDE MUSIC BUTTON
    musicBtn.style.display = "none";

    // SHOW COUNTDOWN
    container.style.opacity = "1";
    container.style.pointerEvents = "auto";

    /*
        TIMELINE

        3 -> 0s to 3.5s
        2 -> 3.5s to 7s
        1 -> 7s to 10.5s
        GO -> 10.5s to 14s
    */

    // SHOW READY TEXT AFTER GO FINISH
    setTimeout(() => {

        box.style.opacity = "1";
        box.style.pointerEvents = "auto";

    }, 11500);

    // SHOW YES BUTTON
    setTimeout(() => {

        yesBtn.style.opacity = "1";
        yesBtn.style.pointerEvents = "auto";

    }, 12000);

});

//counter
// Generate random particles in background
function createParticles() {
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        document.body.appendChild(particle);
    }
}

// Generate confetti for surprise effect
function createConfetti() {
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.animationDuration = (Math.random() * 1.5 + 3.5) + 's';
        document.body.appendChild(confetti);
    }
}

// Initialize
createParticles();

// Create confetti after 10.5 seconds (when surprise happens)
setTimeout(() => {
    createConfetti();
}, 11000);



//CONFETTI
class Progress {
    constructor(param = {}) {
        this.timestamp = null;
        this.duration = param.duration || Progress.CONST.DURATION;
        this.progress = 0;
        this.delta = 0;
        this.isLoop = !!param.isLoop;

        this.reset();
    }

    static get CONST() {
        return {
            DURATION: 1000
        };

    }

    reset() {
        this.timestamp = null;
    }

    start(now) {
        this.timestamp = now;
    }

    tick(now) {
        if (this.timestamp) {
            this.delta = now - this.timestamp;
            this.progress = Math.min(this.delta / this.duration, 1);

            if (this.progress >= 1 && this.isLoop) {
                this.start(now);
            }

            return this.progress;
        } else {
            return 0;
        }
    }
}


class Confetti {
    constructor(param) {
        this.parent = param.elm || document.body;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = param.width || this.parent.offsetWidth;
        this.height = param.height || this.parent.offsetHeight;
        this.length = param.length || Confetti.CONST.PAPER_LENGTH;
        this.yRange = param.yRange || this.height * 2;
        this.progress = new Progress({
            duration: param.duration,
            isLoop: true
        });

        this.rotationRange = typeof param.rotationRange === "number" ? param.rotationRange :
            10;
        this.speedRange = typeof param.speedRange === "number" ? param.speedRange :
            10;
        this.sprites = [];

        this.canvas.style.cssText = [
            "display: block",
            "position: absolute",
            "top: 0",
            "left: 0",
            "pointer-events: none"].
            join(";");

        this.render = this.render.bind(this);

        this.build();

        this.parent.appendChild(this.canvas);
        this.progress.start(performance.now());

        requestAnimationFrame(this.render);
    }

    static get CONST() {
        return {
            SPRITE_WIDTH: 9,
            SPRITE_HEIGHT: 16,
            PAPER_LENGTH: 100,
            DURATION: 8000,
            ROTATION_RATE: 50,
            COLORS: [
                "#EF5350",
                "#EC407A",
                "#AB47BC",
                "#7E57C2",
                "#5C6BC0",
                "#42A5F5",
                "#29B6F6",
                "#26C6DA",
                "#26A69A",
                "#66BB6A",
                "#9CCC65",
                "#D4E157",
                "#FFEE58",
                "#FFCA28",
                "#FFA726",
                "#FF7043",
                "#8D6E63",
                "#BDBDBD",
                "#78909C"]
        };


    }

    build() {
        for (let i = 0; i < this.length; ++i) {
            let canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = Confetti.CONST.SPRITE_WIDTH;
            canvas.height = Confetti.CONST.SPRITE_HEIGHT;

            canvas.position = {
                initX: Math.random() * this.width,
                initY: -canvas.height - Math.random() * this.yRange
            };


            canvas.rotation = this.rotationRange / 2 - Math.random() * this.rotationRange;
            canvas.speed = this.speedRange / 2 + Math.random() * (this.speedRange / 2);

            ctx.save();
            ctx.fillStyle = Confetti.CONST.COLORS[Math.random() * Confetti.CONST.COLORS.length | 0];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            this.sprites.push(canvas);
        }
    }

    render(now) {
        let progress = this.progress.tick(now);

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        for (let i = 0; i < this.length; ++i) {
            this.ctx.save();
            this.ctx.translate(
                this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress,
                this.sprites[i].position.initY + progress * (this.height + this.yRange));

            this.ctx.rotate(this.sprites[i].rotation);
            this.ctx.drawImage(
                this.sprites[i],
                -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2,
                -Confetti.CONST.SPRITE_HEIGHT / 2,
                Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)),
                Confetti.CONST.SPRITE_HEIGHT);

            this.ctx.restore();
        }

        requestAnimationFrame(this.render);
    }
}



// confetti button

const btn = document.getElementById("yesBtn");

const message1 = document.getElementById("message1");
const message2 = document.getElementById("message2");

const nextBtn = document.getElementById("nextBtn");

btn.addEventListener("click", () => {

    // STOP FIRST MUSIC
    music.pause();
    music.currentTime = 0;

    // PLAY SECOND MUSIC
    // SMOOTH SONG START
    yesMusic.volume = 0;
    yesMusic.play();

    let volume = 0;

    const fadeInMusic = setInterval(() => {

        if (volume < 1) {

            volume += 0.05;
            yesMusic.volume = volume;

        } else {

            clearInterval(fadeInMusic);

        }

    }, 200);

    // hide yes button
    btn.style.display = "none";

    // hide ARE YOU READY text
    document.querySelector(".box").style.display = "none";

    // first message
    message1.style.display = "flex";

    // confetti
    new Confetti({
        width: window.innerWidth,
        height: window.innerHeight,
        length: 250,
        duration: 5000
    });

    // second message after 3 sec
    setTimeout(() => {

        message1.style.opacity = "0";

        setTimeout(() => {

            message1.style.display = "none";

            // show second message
            message2.style.display = "flex";

        }, 1000);

    }, 3000);

});
// NEXT PAGE BUTTON
const sceneOne = document.getElementById("sceneOne");
const sceneTwo = document.getElementById("sceneTwo");
const openLetter = document.getElementById("openLetter");
const letterMusic = document.getElementById("letterMusic");

nextBtn.addEventListener("click", () => {

    // STOP CONFETTI
    document.querySelectorAll("canvas").forEach(c => {
        c.style.display = "none";
    });

    // HIDE MESSAGE PAGE
    message2.style.display = "none";

    // SHOW ENVELOPE PAGE
    sceneOne.classList.add("show");

    // CHANGE MUSIC
    yesMusic.pause();


});


// ENVELOPE CLICK
openLetter.addEventListener("click", () => {

    // Hide "Open Your Birthday Letter"
    tapHint.style.opacity = "0";

    setTimeout(() => {
        tapHint.style.display = "none";
    }, 800);

    // OPEN LETTER
    openLetter.classList.add("open");

    // PLAY SONG SMOOTHLY
    letterMusic.volume = 0;
    letterMusic.play();

    // FADE IN EFFECT
    let volume = 0;

    const fadeIn = setInterval(() => {

        if (volume < 1) {

            volume += 0.05;
            letterMusic.volume = volume;

        } else {

            clearInterval(fadeIn);

        }

    }, 200);

    // NEXT PAGE AFTER 10 SEC
    setTimeout(() => {

        // HIDE LETTER PAGE
        sceneOne.classList.remove("show");
        sceneOne.classList.add("hide");

        // WAIT FOR ANIMATION
        setTimeout(() => {

            // REMOVE FIRST SCENE
            sceneOne.style.display = "none";

            // SHOW SECOND SCENE
            sceneTwo.style.display = "flex";

            // SMALL DELAY
            setTimeout(() => {

                sceneTwo.classList.add("show");

            }, 50);

        }, 1800);

    }, 4000);

    // BIG SURPRISE CONFETTI
    new Confetti({
        width: window.innerWidth,
        height: window.innerHeight,
        length: 400,
        duration: 7000,
        rotationRange: 25,
        speedRange: 18
    });

    // EXTRA BURST EFFECT
    for (let i = 0; i < 120; i++) {

        const burst = document.createElement("div");

        burst.classList.add("magic-confetti");

        burst.style.left = Math.random() * 100 + "vw";
        burst.style.top = "-20px";

        burst.style.background = `
            hsl(${Math.random() * 360},100%,60%)
        `;

        burst.style.animationDuration =
            (Math.random() * 2 + 3) + "s";

        document.body.appendChild(burst);

        setTimeout(() => {
            burst.remove();
        }, 5000);
    }

});

const aduthuBtn = document.getElementById("aduthuBtn");

aduthuBtn.addEventListener("click", () => {


    // STOP ALL CONFETTI CANVAS
    document.querySelectorAll("canvas").forEach(c => {

        if (c.id !== "global-canvas") {
            c.remove();
        }

    });

    // REMOVE MAGIC CONFETTI
    document
        .querySelectorAll(".magic-confetti")
        .forEach(el => el.remove());

    sceneTwo.classList.add("page-exit");

    setTimeout(() => {

        sceneTwo.style.display = "none";

        document
            .getElementById("scene-intro")
            .classList.add("active");

        currentSceneIndex = 0;

        // IMPORTANT
        initBalloons();

    }, 1200);

});


/**
        * Global State & Flow Variables (Fixes the undefined errors)
        */
const SCENES = [
    'scene-intro',     // 0
    'scene-balloons',  // 1
    'scene-gallery',   // 2
    'scene-cake',      // 3
    'scene-puzzle',    // 4
    'scene-gift',      // 5
    'scene-finale',    // 6
    'scene-songs'      // 7
];
let currentSceneIndex = 0;
let isTransitioning = false;

/**
 * Audio System (unchanged, robust)
 */
const AudioSys = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let ctx = null;
    function init() { if (!ctx) ctx = new AudioContext(); if (ctx.state === 'suspended') ctx.resume(); }
    function playPop() {
        if (!ctx) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        gain.gain.setValueAtTime(1, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t); osc.stop(t + 0.1);
    }
    function playChime(freq = 800) {
        if (!ctx) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.3, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
        osc.start(t); osc.stop(t + 1.5);
    }
    function playBlow() {
        if (!ctx) return;
        const t = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.8; const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource(); noise.buffer = buffer;
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(2000, t); filter.frequency.exponentialRampToValueAtTime(100, t + 0.8);
        const gain = ctx.createGain(); noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.5, t + 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        noise.start(t);
    }
    function playExplosion() {
        if (!ctx) return;
        const t = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 2.0; const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.5));
        const noise = ctx.createBufferSource(); noise.buffer = buffer;
        const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.setValueAtTime(100, t); filter.frequency.linearRampToValueAtTime(50, t + 2);
        const gain = ctx.createGain(); noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(1, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 2);
        noise.start(t);
    }
    return { init, playPop, playChime, playBlow, playExplosion };
})();

/**
 * Canvas Effects
 */
const canvas = document.getElementById('global-canvas');
const ctxCanvas = canvas.getContext('2d');
let width, height;
let particles = [];
let fireworks = [];
let stars = [];
let effectMode = 'ambient';

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, s: Math.random() * 1.5, a: Math.random(), speed: Math.random() * 0.1 + 0.05 });
    }
}

class Particle {
    constructor(x, y, color, isConfetti = false) {
        this.x = x; this.y = y; this.color = color; this.isConfetti = isConfetti;
        const angle = Math.random() * Math.PI * 2; const speed = Math.random() * (isConfetti ? 8 : 4) + 1;
        this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
        this.life = 1.0; this.decay = Math.random() * 0.02 + (isConfetti ? 0.005 : 0.015);
        this.gravity = isConfetti ? 0.2 : 0.05; this.size = isConfetti ? Math.random() * 6 + 4 : Math.random() * 3 + 1;
        this.angle = Math.random() * 360; this.spin = (Math.random() - 0.5) * 10;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.life -= this.decay; this.angle += this.spin; }
    draw() {
        ctxCanvas.globalAlpha = Math.max(0, this.life); ctxCanvas.fillStyle = this.color;
        if (this.isConfetti) { ctxCanvas.save(); ctxCanvas.translate(this.x, this.y); ctxCanvas.rotate(this.angle * Math.PI / 180); ctxCanvas.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); ctxCanvas.restore(); }
        else { ctxCanvas.beginPath(); ctxCanvas.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctxCanvas.fill(); }
        ctxCanvas.globalAlpha = 1.0;
    }
}

class Firework {
    constructor() {
        this.x = Math.random() * width; this.y = height; this.targetY = Math.random() * (height * 0.4) + height * 0.1;
        this.speed = Math.random() * 4 + 6; this.color = `hsl(${Math.random() * 360}, 80%, 60%)`; this.exploded = false;
    }
    update() {
        if (!this.exploded) { this.y -= this.speed; if (this.y <= this.targetY) { this.exploded = true; createExplosion(this.x, this.y, this.color); } }
    }
    draw() { if (!this.exploded) { ctxCanvas.fillStyle = '#fff'; ctxCanvas.beginPath(); ctxCanvas.arc(this.x, this.y, 2, 0, Math.PI * 2); ctxCanvas.fill(); } }
}

function createExplosion(x, y, color, count = 50, isConfetti = false) {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y, isConfetti ? `hsl(${Math.random() * 360}, 80%, 60%)` : color, isConfetti));
}

function renderCanvas() {
    ctxCanvas.clearRect(0, 0, width, height);
    ctxCanvas.fillStyle = '#fff';
    stars.forEach(star => {
        star.y -= star.speed; if (star.y < 0) { star.y = height; star.x = Math.random() * width; }
        star.a += (Math.random() - 0.5) * 0.05; star.a = Math.max(0.1, Math.min(1, star.a));
        ctxCanvas.globalAlpha = star.a; ctxCanvas.beginPath(); ctxCanvas.arc(star.x, star.y, star.s, 0, Math.PI * 2); ctxCanvas.fill();
    });
    ctxCanvas.globalAlpha = 1.0;
    for (let i = particles.length - 1; i >= 0; i--) { particles[i].update(); particles[i].draw(); if (particles[i].life <= 0) particles.splice(i, 1); }
    if (effectMode === 'fireworks') {
        if (Math.random() < 0.04) fireworks.push(new Firework());
        for (let i = fireworks.length - 1; i >= 0; i--) { fireworks[i].update(); fireworks[i].draw(); if (fireworks[i].exploded) fireworks.splice(i, 1); }
    }
    requestAnimationFrame(renderCanvas);
}
renderCanvas();

/**
 * Global Navigation Function (Fixes transition freezing)
 */
function goToScene(index) {

    if (isTransitioning) return;

    isTransitioning = true;

    const current =
        document.getElementById(
            SCENES[currentSceneIndex]
        );

    const next =
        document.getElementById(
            SCENES[index]
        );

    current.classList.add("exit");

    setTimeout(() => {

        current.classList.remove(
            "active",
            "exit"
        );

        next.classList.add("active");

        currentSceneIndex = index;

        isTransitioning = false;

    }, 800);
}

/**
 * 0. Intro Loader
 */
window.onload = () => {
    gsap.to("#loading-bar", {
        width: "100%", duration: 2.0, ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('loading-area').style.display = 'none';
            const btn = document.getElementById('btn-start');
            btn.classList.remove('hidden');
            gsap.fromTo(btn, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
        }
    });
};

document.getElementById('btn-start').addEventListener('click', () => {

    AudioSys.init();
    goToScene(1);

    setTimeout(() => {
        initBalloons();
    }, 900);

});

/**
 * 1. Balloons Scene (Continuous & Nav Fix)
 */
let balloonInterval;
let hasStartedPopping = false;
const balloonColors = [
    { bg: 'radial-gradient(circle at 30% 30%, #ff4579, #b0003a, #4a0018)', base: '#ff4579' },
    { bg: 'radial-gradient(circle at 30% 30%, #00f0ff, #007bb5, #002d4a)', base: '#00f0ff' },
    { bg: 'radial-gradient(circle at 30% 30%, #e0aaff, #7b2cbf, #240046)', base: '#e0aaff' },
    { bg: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b, #4a3600)', base: '#ffd700' }
];

function initBalloons() {
    const stage = document.getElementById('balloon-stage');
    stage.innerHTML = '';
    hasStartedPopping = false;

    const continueBtn = document.getElementById('btn-continue-balloons');
    gsap.set(continueBtn, { opacity: 0, y: 20, pointerEvents: 'none' });

    // Attach event listener ONLY ONCE by replacing node to clear old listeners if re-initialized
    const newBtn = continueBtn.cloneNode(true);
    continueBtn.parentNode.replaceChild(newBtn, continueBtn);

    newBtn.addEventListener('click', () => {
        clearInterval(balloonInterval);
        goToScene(2);
        setTimeout(() => {
            initGallery();
        }, 1000);
    });

    for (let i = 0; i < 6; i++) setTimeout(spawnBalloon, i * 300);
    if (balloonInterval) clearInterval(balloonInterval);
    balloonInterval = setInterval(spawnBalloon, 500);
}

function spawnBalloon() {
    if (currentSceneIndex !== 1) return;
    const stage = document.getElementById('balloon-stage');
    const wrapper = document.createElement('div');
    wrapper.className = 'balloon-wrapper';

    const colorObj = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const sizeScale = 0.6 + Math.random() * 0.7;
    const startX = Math.random() * 90 + 5;
    const floatDuration = 8 + Math.random() * 7;

    wrapper.style.left = `${startX}%`;
    wrapper.style.bottom = '-250px';
    wrapper.style.transform = `scale(${sizeScale})`;

    const body = document.createElement('div'); body.className = 'balloon-body'; body.style.background = colorObj.bg;
    const knot = document.createElement('div'); knot.className = 'balloon-knot'; knot.style.borderBottomColor = colorObj.base;
    const string = document.createElement('div'); string.className = 'balloon-string';

    body.appendChild(knot); wrapper.appendChild(body); wrapper.appendChild(string); stage.appendChild(wrapper);

    const tl = gsap.to(wrapper, {
        y: -(window.innerHeight + 500), x: `+=${(Math.random() - 0.5) * 150}`, rotationZ: (Math.random() - 0.5) * 20,
        duration: floatDuration, ease: "none",
        onComplete: () => { if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); }
    });

    gsap.to(wrapper, {
        x: `+=${(Math.random() - 0.5) * 60}`, rotationZ: (Math.random() - 0.5) * 15,
        duration: Math.random() * 2 + 2, yoyo: true, repeat: -1, ease: "sine.inOut"
    });

    const popHandler = (e) => {
        e.preventDefault();
        if (wrapper.style.pointerEvents === 'none') return;
        wrapper.style.pointerEvents = 'none';
        tl.kill();
        AudioSys.playPop();

        const rect = body.getBoundingClientRect();
        createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, colorObj.base, 120, true);

        gsap.to(wrapper, {
            scale: 1.3, opacity: 0, duration: 0.1,
            onComplete: () => { if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); }
        });

        if (!hasStartedPopping) {
            hasStartedPopping = true;
            setTimeout(() => {
                const btn = document.getElementById('btn-continue-balloons');
                gsap.to(btn, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", pointerEvents: 'auto' });
            }, 3000);
        }
    };
    wrapper.addEventListener('click', popHandler);

    wrapper.addEventListener(
        'touchstart',
        popHandler,
        { passive: false }
    );
}

/**
 * 2. Gallery Scene (Buttons & Nav Fix)
 */
const galleryImages = [
    'Photo-1.jpg',
    'Photo-2.jpg',
    'Photo-3.jpg',
    'Photo-4.jpg',
    'Photo-5.jpg',
    'Photo-6.jpg',
    'Photo-8.jpg',
    'Photo-9.jpg',
    'Photo-10.jpg',
    'Photo-11.jpg'
];
let currentGalleryIndex = 0;
let cards = [];

function initGallery() {
    const track = document.getElementById('gallery-track');

    // Setup buttons robustly
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnContinue = document.getElementById('btn-gallery-continue');

    // Avoid adding elements and listeners multiple times
    if (track.children.length === 0) {
        galleryImages.forEach((src) => {
            const card = document.createElement('div'); card.className = 'gallery-card';
            const img = document.createElement('img'); img.src = src; img.crossOrigin = "anonymous";
            card.appendChild(img); track.appendChild(card); cards.push(card);
        });

        btnPrev.addEventListener('click', () => {
            currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
            updateGallery();
        });
        btnNext.addEventListener('click', () => {
            currentGalleryIndex = Math.min(cards.length - 1, currentGalleryIndex + 1);
            updateGallery();
        });
        btnContinue.addEventListener('click', () => {
            goToScene(3);
            setTimeout(() => {
                initCakeScene();
            }, 1000);
        });
    }

    currentGalleryIndex = 0;
    gsap.set(btnContinue, { opacity: 0, y: 20, pointerEvents: 'none' });
    updateGallery();

    // Reveal Continue button smoothly
    setTimeout(() => {
        gsap.to(btnContinue, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", pointerEvents: 'auto' });
    }, 3000);
}

function updateGallery() {

    cards.forEach((card, i) => {
        let offset = i - currentGalleryIndex;
        let tx = offset * 60; // Spread
        let tz = Math.abs(offset) * -120;
        let rx = offset * -2;
        let scale = offset === 0 ? 1 : 0.85;
        let opacity = offset === 0 ? 1 : (Math.abs(offset) === 1 ? 0.6 : 0);
        let zIndex = 20 - Math.abs(offset);
        let filter = offset === 0 ? 'blur(0px) brightness(1)' : 'blur(4px) brightness(0.4)';

        gsap.to(card, {
            x: `${tx}%`, z: tz, rotateY: rx, scale: scale,
            opacity: opacity, zIndex: zIndex, filter: filter,
            duration: 0.8, ease: "power3.out"
        });
    });

    document.getElementById('btn-prev').style.opacity = currentGalleryIndex === 0 ? '0.2' : '1';
    document.getElementById('btn-prev').style.pointerEvents = currentGalleryIndex === 0 ? 'none' : 'auto';
    document.getElementById('btn-next').style.opacity = currentGalleryIndex === cards.length - 1 ? '0.2' : '1';
    document.getElementById('btn-next').style.pointerEvents = currentGalleryIndex === cards.length - 1 ? 'none' : 'auto';
}

/**
 * 3. 3D Cake Scene (Complete & working)
 */
function initCakeScene() {
    const container = document.getElementById('cake-canvas-container');
    if (container.children.length > 0) return; // Prevent double init

    // Bind continue button
    const continueBtn = document.getElementById('btn-cake-continue');
    continueBtn.addEventListener('click', () => {
        goToScene(4);
        setTimeout(() => {
            initPuzzle();
        }, 500);
    });

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x222233, 1);
    scene.add(ambient);
    const spotLight = new THREE.SpotLight(0xfff0dd, 2);
    spotLight.position.set(5, 15, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    // Cake Elements
    const cakeGroup = new THREE.Group();

    // Plate
    const plateGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.2, 64);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.8, roughness: 0.2 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    // Cake Tier 1
    const t1Geo = new THREE.CylinderGeometry(3.5, 3.5, 2, 64);
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.9, bumpScale: 0.02 });
    const t1 = new THREE.Mesh(t1Geo, creamMat);
    t1.position.y = 1.1;
    t1.castShadow = true; t1.receiveShadow = true;
    cakeGroup.add(t1);

    // Cake Tier 2
    const t2Geo = new THREE.CylinderGeometry(2.5, 2.5, 1.8, 64);
    const t2 = new THREE.Mesh(t2Geo, creamMat);
    t2.position.y = 3;
    t2.castShadow = true; t2.receiveShadow = true;
    cakeGroup.add(t2);

    // Gold Ribbon
    const ribbonGeo = new THREE.CylinderGeometry(2.52, 2.52, 0.2, 64);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.3 });
    const ribbon = new THREE.Mesh(ribbonGeo, goldMat);
    ribbon.position.y = 2.2;
    cakeGroup.add(ribbon);

    scene.add(cakeGroup);

    // Candles
    const flames = [];
    let activeFlames = 3;
    const candleOffsets = [[0, 0], [-1.2, 0.8], [1.2, 0.8]];

    candleOffsets.forEach((pos, i) => {
        const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
        const cMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const candle = new THREE.Mesh(cGeo, cMat);
        candle.position.set(pos[0], 4.3, pos[1]);
        candle.castShadow = true;
        scene.add(candle);

        // Flame
        const fGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const fMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const flame = new THREE.Mesh(fGeo, fMat);
        flame.position.set(pos[0], 4.8, pos[1]);
        flame.userData = { active: true, index: i };
        scene.add(flame);
        flames.push(flame);

        // Flame Light
        const pLight = new THREE.PointLight(0xffaa00, 1.5, 6);
        pLight.position.set(pos[0], 4.9, pos[1]);
        scene.add(pLight);
        flame.userData.light = pLight;
    });

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(flames);

        if (intersects.length > 0) {
            const f = intersects[0].object;
            if (f.userData.active) {
                f.userData.active = false;
                gsap.to(f.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
                gsap.to(f.userData.light, { intensity: 0, duration: 0.5 });
                AudioSys.playBlow();
                createExplosion(event.clientX, event.clientY, '#aaaaaa', 10); // fake smoke

                activeFlames--;
                if (activeFlames === 0) {
                    setTimeout(() => {
                        AudioSys.playChime(1500);
                        createExplosion(window.innerWidth / 2, window.innerHeight / 2, '#D4AF37', 30);
                        gsap.to(continueBtn, { opacity: 1, y: 0, duration: 1, pointerEvents: 'auto' });
                    }, 1000);
                }
            }
        }
    });

    // Animation Loop
    let time = 0;
    function animateCake() {
        if (currentSceneIndex !== 3) return requestAnimationFrame(animateCake);

        time += 0.05;
        cakeGroup.rotation.y = Math.sin(time * 0.2) * 0.1;

        flames.forEach(f => {
            if (f.userData.active) {
                const s = 1 + Math.random() * 0.2;
                f.scale.set(s, s + Math.random() * 0.4, s);
                f.userData.light.intensity = 1.2 + Math.random() * 0.4;
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animateCake);
    }
    animateCake();

    window.addEventListener('resize', () => {
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

/**
 * 4. Puzzle Scene
 */
const PUZZLE_IMG = 'img/puzzle.jpg';
let puzzlePieces = [];
let selectedPiece = null;

function initPuzzle() {
    const grid = document.getElementById('puzzle-grid');
    const btnContinue = document.getElementById('btn-puzzle-continue');

    // Wire up button immediately to prevent multiple listener issues later
    btnContinue.onclick = () => { goToScene(5); };

    if (puzzlePieces.length > 0) return;

    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    grid.innerHTML = '';
    puzzlePieces = [];

    indices.forEach((val, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url(${PUZZLE_IMG})`;

        const row = Math.floor(val / 3);
        const col = val % 3;
        piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
        piece.dataset.index = index;
        piece.dataset.correct = val;

        piece.addEventListener('click', () => handlePieceClick(piece));
        puzzlePieces.push({ el: piece, currentPos: index });
        grid.appendChild(piece);
    });
}

function handlePieceClick(piece) {
    if (!selectedPiece) {
        selectedPiece = piece;
        piece.classList.add('selected');
    } else {
        if (selectedPiece === piece) {
            piece.classList.remove('selected');
            selectedPiece = null;
            return;
        }

        const tempPos = selectedPiece.style.backgroundPosition;
        const tempCorrect = selectedPiece.dataset.correct;

        selectedPiece.style.backgroundPosition = piece.style.backgroundPosition;
        selectedPiece.dataset.correct = piece.dataset.correct;

        piece.style.backgroundPosition = tempPos;
        piece.dataset.correct = tempCorrect;

        selectedPiece.classList.remove('selected');
        selectedPiece = null;

        AudioSys.playPop();
        checkPuzzleWin();
    }
}

function checkPuzzleWin() {
    let win = true;
    puzzlePieces.forEach((p, i) => { if (parseInt(p.el.dataset.correct) !== i) win = false; });

    if (win) {
        puzzlePieces.forEach(p => p.el.style.pointerEvents = 'none');
        AudioSys.playExplosion();
        createExplosion(window.innerWidth / 2, window.innerHeight / 2, null, 100, true);

        gsap.to('.puzzle-piece', { borderColor: 'transparent', gap: 0, duration: 1, ease: "power2.inOut" });
        document.getElementById('puzzle-grid').style.gap = '0';

        const btn = document.getElementById('btn-puzzle-continue');
        gsap.to(btn, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", pointerEvents: 'auto', delay: 0.5 });
    }
}

/**
 * 5. Gift Reveal
 */
const giftBox = document.getElementById('gift-box');
const giftLid = document.getElementById('gift-lid');
const giftMsg = document.getElementById('gift-message');
let giftOpened = false;

giftBox.addEventListener('click', () => {
    if (giftOpened || currentSceneIndex !== 5) return;
    giftOpened = true;

    AudioSys.playChime(800);
    setTimeout(() => AudioSys.playChime(1200), 200);

    const rect = giftBox.getBoundingClientRect();
    createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, '#D4AF37', 50);

    gsap.to(giftLid, { y: -120, rotateX: 45, rotateZ: 15, opacity: 0, duration: 1.5, ease: "power3.out" });

    gsap.to(giftMsg, {
        opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "back.out(1.2)",
        onComplete: () => { setTimeout(() => goToScene(6), 5000); }
    });
});

function startFireworks() {

    setInterval(() => {

        confetti({
            particleCount: 150,
            spread: 120,
            origin: {
                x: Math.random(),
                y: Math.random() * 0.5
            }
        });

    }, 800);

}
/**
 * Mouse Parallax
 */
document.addEventListener('mousemove', (e) => {
    if (isTransitioning) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    gsap.to('.scene-container.active .content-wrapper', { x: -x, y: -y, duration: 1, ease: "power2.out" });
    gsap.to('.ambient-aurora', { x: x * 2, y: y * 2, duration: 2, ease: "power2.out" });
});

document.getElementById("btn-finale").addEventListener("click", () => {

    document.querySelectorAll("audio").forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    function goToSongsPage() {

    // Letter music stop
    if (typeof letterMusic !== "undefined") {
        letterMusic.pause();
        letterMusic.currentTime = 0;
    }

    // Yes music stop
    if (typeof yesMusic !== "undefined") {
        yesMusic.pause();
        yesMusic.currentTime = 0;
    }

    // Background music stop
    if (typeof music !== "undefined") {
        music.pause();
        music.currentTime = 0;
    }

    // Smooth fade out
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "songsPage.html";
    }, 800);
}
    goToSongsPage();

});



