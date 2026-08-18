/* ==========================================================================
   Surprise Birthday Website for Puja - Interactive Logic
   Designed with ❤️ for Puja Sutra Dhar by Arnob Chandra Das
   ========================================================================== */

// 1. CONFIGURATION
// You can easily change names, texts, and settings here!
const CONFIG = {
    girlfriendName: "Puja Sutra Dhar",
    myName: "Arnob Chandra Das",
    nickname: "স্নিগ্ধা", // Girlfriend's nickname
    
    // Love Letter content (Newlines will be preserved)
    loveLetter: `My love,

Happy birthday to the girl who somehow makes ordinary days feel a little more special.

I still remember the day when we [insert a special memory here, e.g., first met, went on a specific date, or had a funny moment]. I don't think you realize how often I think about that moment and smile...

I don't know what the future has planned for us, but I know that I'm incredibly grateful that you're part of my present.

I hope this year brings you everything you've been wishing for.

More laughter.
More adventures.
More ridiculous conversations.
More beautiful memories.

And hopefully...

a lot more of us. ❤️

Happy Birthday, beautiful.

Love,
Arnob`,

    // Audio Settings
    musicPath: "birthday-song.mp3",
    
    // Game Settings
    targetScore: 5,        // Hearts she needs to catch to unlock the letter
    heartSpawnRate: 1000,  // How often to spawn hearts in ms
    
    // Easter Egg Settings
    easterEggClickCount: 7 // Number of clicks on the secret trigger to unlock easter egg
};

// 2. STATE VARIABLES
let audioContext = null;
let bgAudio = null;
let isMusicPlaying = false;
let gameScore = 0;
let gameInterval = null;
let isGameActive = false;
let isLetterTyping = false;
let letterTimeoutId = null;
let easterEggClicks = 0;
let celebrationAnimationId = null;

// 3. INITIALIZATION ON PAGE LOAD
function init() {
    // Populate configurable texts in the HTML
    document.querySelectorAll(".gf-name").forEach(el => el.textContent = CONFIG.girlfriendName);
    document.querySelectorAll(".my-name").forEach(el => el.textContent = CONFIG.myName);
    document.querySelectorAll(".gf-nickname").forEach(el => el.textContent = CONFIG.nickname);

    // Initialize decorative elements
    createStarsBackground();
    setupScrollReveal();
    setupEventListeners();
    initAudio();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// 4. MUSIC/AUDIO SYSTEM
function initAudio() {
    // Create an audio element dynamically
    bgAudio = new Audio();
    bgAudio.src = CONFIG.musicPath;
    bgAudio.loop = true;
    
    // Handle error if file does not exist or fails to load
    bgAudio.addEventListener("error", (e) => {
        console.warn("Audio file not found or couldn't be loaded. Add a song to '" + CONFIG.musicPath + "' to enable music! Error:", e);
    });

    const musicBtn = document.getElementById("music-toggle");
    
    musicBtn.addEventListener("click", () => {
        toggleMusic();
    });
}

function playMusic() {
    if (!bgAudio) return;
    
    // Resume audio context if browser suspended it
    if (window.AudioContext || window.webkitAudioContext) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    
    bgAudio.play()
        .then(() => {
            isMusicPlaying = true;
            document.getElementById("music-toggle").classList.add("playing");
            document.querySelector(".music-tooltip").textContent = "Pause Music 🎵";
        })
        .catch(err => {
            console.log("Audio autoplay prevented or missing file. Will play on interaction.", err);
        });
}

function pauseMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    isMusicPlaying = false;
    document.getElementById("music-toggle").classList.remove("playing");
    document.querySelector(".music-tooltip").textContent = "Play Music 💝";
}

function toggleMusic() {
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// 5. DECORATIVE BACKGROUNDS (Stars & Background Floating Hearts)
function createStarsBackground() {
    const container = document.getElementById("particle-container");
    const starCount = 45;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        
        // Random positions
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3 + 1; // 1px to 4px
        const delay = Math.random() * 5;
        const duration = Math.random() * 4 + 3; // 3s to 7s
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Apply inline styles for animations
        star.style.position = "absolute";
        star.style.backgroundColor = "rgba(255, 255, 255, " + (Math.random() * 0.5 + 0.3) + ")";
        star.style.borderRadius = "50%";
        star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`;
        star.style.animation = `starTwinkle ${duration}s ease-in-out infinite`;
        star.style.animationDelay = `${delay}s`;
        
        container.appendChild(star);
    }

    // Inject temporary star keyframe dynamic rule in document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes starTwinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(styleSheet);
}

function spawnFloatingBgHeart() {
    const container = document.getElementById("floating-hearts-container");
    if (!container) return;
    
    const heart = document.createElement("div");
    heart.className = "bg-floating-heart";
    heart.innerHTML = Math.random() > 0.5 ? "❤️" : "🌸";
    
    const size = Math.random() * 15 + 10; // 10px to 25px
    const left = Math.random() * 100;
    const duration = Math.random() * 6 + 6; // 6s to 12s
    const startRotate = Math.random() * 360;
    
    heart.style.position = "absolute";
    heart.style.bottom = "-30px";
    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.opacity = Math.random() * 0.4 + 0.1;
    heart.style.pointerEvents = "none";
    heart.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-out`;
    
    container.appendChild(heart);
    
    // Animate up and rotate using requestAnimationFrame
    setTimeout(() => {
        heart.style.transform = `translateY(-110vh) rotate(${startRotate + (Math.random() * 180 - 90)}deg)`;
        heart.style.opacity = "0";
    }, 50);
    
    // Remove element after it floats away
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Start continuous floating background hearts
setInterval(spawnFloatingBgHeart, 2500);

// 6. EVENT LISTENERS SETUP
function setupEventListeners() {
    // Screen 1: Surpise entry button
    const btnOpenSurprise = document.getElementById("btn-open-surprise");
    btnOpenSurprise.addEventListener("click", (e) => {
        handleSurpriseStart(e);
    });

    // Screen 5: Reveal Letter Button
    const btnRevealLetter = document.getElementById("btn-reveal-letter");
    btnRevealLetter.addEventListener("click", () => {
        revealLetterSection();
    });

    // Envelope Click to open
    const envelope = document.getElementById("envelope");
    envelope.addEventListener("click", () => {
        if (!envelope.classList.contains("open")) {
            openEnvelopeAndType();
        }
    });
    
    // Optional click on letter card during typing to complete it instantly
    const letterCard = document.getElementById("letter-card");
    letterCard.addEventListener("click", (e) => {
        if (isLetterTyping) {
            e.stopPropagation(); // Prevent duplicate triggers
            skipTypewriter();
        }
    });

    // Screen 6: Transition to final surprise button
    const btnGotoFinal = document.getElementById("btn-goto-final");
    btnGotoFinal.addEventListener("click", () => {
        revealFinalSurprise();
    });

    // Easter egg trigger
    const secretTrigger = document.getElementById("secret-trigger");
    secretTrigger.addEventListener("click", () => {
        handleEasterEggClick();
    });

    // Close Easter Egg Modal
    const closeModal = document.getElementById("close-modal");
    closeModal.addEventListener("click", () => {
        document.getElementById("easter-egg-modal").classList.add("hidden");
    });
    
    // Close modal clicking outside
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("easter-egg-modal");
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
}

// 7. SURPRISE START TRANSITION (SCREEN 1 -> MAIN CONTENT)
function handleSurpriseStart(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    
    // Create button heart burst
    createHeartBurst(btnX, btnY, 25);
    
    // Play background music immediately (user interaction achieved)
    playMusic();
    
    // Transition screen entry out
    const screenEntry = document.getElementById("screen-entry");
    screenEntry.classList.add("fade-out");
    
    // Reveal main content
    const mainContent = document.getElementById("main-content");
    mainContent.classList.add("reveal");
    
    setTimeout(() => {
        screenEntry.style.display = "none";
        // Start scroll reveal triggers
        triggerScrollReveal();
    }, 1000);
}

// Heart explosion burst utility
function createHeartBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "game-pop-particle";
        particle.innerHTML = Math.random() > 0.5 ? "❤️" : "💖";
        
        // Random angles and distances
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 120 + 60;
        const destX = Math.cos(angle) * speed;
        const destY = Math.sin(angle) * speed;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty("--x", `${destX}px`);
        particle.style.setProperty("--y", `${destY}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// 8. SCROLL REVEAL SYSTEM
function setupScrollReveal() {
    const revealElements = document.querySelectorAll(".animate-scroll-reveal");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                
                // If it's the game section, start the game
                if (entry.target.classList.contains("game-container")) {
                    startGame();
                }
                
                // Stop observing once visible
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    
    // Also observe the game container specifically to start spawning hearts
    const gameContainer = document.querySelector(".game-container");
    if (gameContainer) {
        observer.observe(gameContainer);
    }
}

function triggerScrollReveal() {
    // Force a scroll check to trigger items currently visible
    window.dispatchEvent(new Event("scroll"));
}

// 9. PLAYFUL HEART CATCHING GAME
function startGame() {
    if (isGameActive || gameScore >= CONFIG.targetScore) return;
    
    isGameActive = true;
    gameScore = 0;
    document.getElementById("score-val").textContent = "0";
    
    // Start game loop to spawn hearts
    gameInterval = setInterval(spawnGameHeart, CONFIG.heartSpawnRate);
}

function stopGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    // Clear any floating hearts left on the board
    const board = document.getElementById("game-board");
    const activeHearts = board.querySelectorAll(".game-heart-target");
    activeHearts.forEach(h => h.remove());
}

function spawnGameHeart() {
    if (!isGameActive) return;
    
    const board = document.getElementById("game-board");
    const heart = document.createElement("div");
    heart.className = "game-heart-target";
    heart.innerHTML = "❤️";
    
    // Calculate random dimensions inside the board container
    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;
    
    // Heart size is ~50px
    const xPos = Math.random() * (boardWidth - 60) + 5;
    const startY = boardHeight;
    const speed = Math.random() * 2.2 + 1.2; // vertical floating speed
    
    heart.style.left = `${xPos}px`;
    heart.style.top = `${startY}px`;
    
    board.appendChild(heart);
    
    // Animate the heart moving upwards
    let currentY = startY;
    let swayAngle = 0;
    const swaySpeed = Math.random() * 0.05 + 0.02;
    const swayWidth = Math.random() * 1.5 + 0.5;
    
    function floatUp() {
        if (!heart.parentNode || !isGameActive) return;
        
        currentY -= speed;
        swayAngle += swaySpeed;
        
        // Side to side sway effect
        const swayX = Math.sin(swayAngle) * swayWidth;
        const currentLeft = parseFloat(heart.style.left);
        heart.style.left = `${currentLeft + swayX}px`;
        heart.style.top = `${currentY}px`;
        
        // If it floats out of top bounds, remove and spawn replacement
        if (currentY < -50) {
            heart.remove();
        } else {
            requestAnimationFrame(floatUp);
        }
    }
    
    requestAnimationFrame(floatUp);
    
    // Heart Tap/Click Handler (Works on both touch and mouse)
    const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isGameActive) return;
        
        // Increase score
        gameScore++;
        document.getElementById("score-val").textContent = gameScore;
        
        // Visual pop effect
        const rect = heart.getBoundingClientRect();
        createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
        
        heart.remove();
        
        // Check win condition
        if (gameScore >= CONFIG.targetScore) {
            handleGameWin();
        }
    };
    
    heart.addEventListener("mousedown", handleTap);
    heart.addEventListener("touchstart", handleTap, { passive: false });
}

function handleGameWin() {
    stopGame();
    
    // Show confetti inside game board
    const successOverlay = document.getElementById("game-success");
    successOverlay.classList.remove("hidden");
    
    // Trigger local screen celebration particles in game box
    const rect = successOverlay.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
}

// 10. LOVE LETTER & ENVELOPE OPENING
function revealLetterSection() {
    const letterSection = document.getElementById("screen-letter");
    letterSection.scrollIntoView({ behavior: "smooth" });
}

function openEnvelopeAndType() {
    const envelope = document.getElementById("envelope");
    envelope.classList.add("open");
    
    // Wait for envelope open flap rotation + slide up card animation (1.2s total delay)
    setTimeout(() => {
        startTypewriter();
    }, 1100);
}

function startTypewriter() {
    if (isLetterTyping) return;
    
    isLetterTyping = true;
    const txtContainer = document.getElementById("letter-text");
    txtContainer.textContent = "";
    
    let index = 0;
    const text = CONFIG.loveLetter;
    
    // Audio feedback if active (subtle typing click sound can go here if needed)
    
    function typeChar() {
        if (index < text.length) {
            txtContainer.textContent += text.charAt(index);
            index++;
            
            // Auto scroll down in the letter card as text typing populates it
            const scrollable = txtContainer.closest(".letter-scrollable");
            if (scrollable) {
                scrollable.scrollTop = scrollable.scrollHeight;
            }
            
            // Vary typing speed slightly for handwritten feeling
            const typingSpeed = text.charAt(index - 1) === '\n' ? 180 : (Math.random() * 30 + 35);
            letterTimeoutId = setTimeout(typeChar, typingSpeed);
        } else {
            finishLetterTyping();
        }
    }
    
    typeChar();
}

function skipTypewriter() {
    if (!isLetterTyping) return;
    
    clearTimeout(letterTimeoutId);
    const txtContainer = document.getElementById("letter-text");
    txtContainer.textContent = CONFIG.loveLetter;
    
    // Scroll to bottom
    const scrollable = txtContainer.closest(".letter-scrollable");
    if (scrollable) {
        scrollable.scrollTop = scrollable.scrollHeight;
    }
    
    finishLetterTyping();
}

function finishLetterTyping() {
    isLetterTyping = false;
    
    // Unveil proceed button underneath the letter
    const hint = document.getElementById("after-letter-hint");
    hint.classList.remove("hidden");
    
    // Smooth scroll down to focus on the newly appeared button
    setTimeout(() => {
        hint.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
}

// 11. SCREEN 6: ONE LAST SURPRISE & CELEBRATION
function revealFinalSurprise() {
    // Hide main scroll area to prevent scrolling
    document.getElementById("main-content").style.display = "none";
    document.getElementById("music-toggle").style.zIndex = "105"; // ensure music toggle floats on top
    
    // Show surprise screen
    const screenSurprise = document.getElementById("screen-surprise");
    screenSurprise.classList.remove("hidden");
    
    // Start canvas celebration rendering
    initCelebrationCanvas();
    
    // Continuously spawn celebration balloons
    setInterval(spawnCelebrationBalloon, 900);
}

function initCelebrationCanvas() {
    const canvas = document.getElementById("celebration-canvas");
    const ctx = canvas.getContext("2d");
    
    // Resize canvas to fullscreen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Particle class for fireworks & confetti
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 3.5 + 1.5;
            
            // Random direction vectors
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 6 + 2;
            this.dx = Math.cos(angle) * velocity;
            this.dy = Math.sin(angle) * velocity;
            
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.gravity = 0.08;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        
        update() {
            this.x += this.dx;
            this.y += this.dy;
            this.dy += this.gravity; // Gravity pull downwards
            this.alpha -= this.decay;
        }
    }
    
    // Confetti square piece class
    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 8 + 6;
            this.color = ["#ff7597", "#ffb3c6", "#e2caff", "#ffeb3b", "#00e676", "#29b6f6"][Math.floor(Math.random() * 6)];
            this.speed = Math.random() * 3 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 3 - 1.5;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
        
        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            
            // If it falls off bottom, reset to top
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
    }
    
    // Petal class for falling romantic rose/cherry blossom petals
    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 8 + 8; // 8px to 16px
            this.color = ["#ffb3c6", "#ff85a1", "#f8bbd0", "#ffc0cb"][Math.floor(Math.random() * 4)]; // Pink shades
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1.2 + 0.8;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 1.8 - 0.9;
            this.swayAmplitude = Math.random() * 0.8 + 0.4;
            this.swayAngle = Math.random() * Math.PI;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Draw a cute organic curved petal
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
            ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
        
        update() {
            this.y += this.speedY;
            this.swayAngle += 0.02;
            this.x += this.speedX + Math.sin(this.swayAngle) * this.swayAmplitude;
            this.rotation += this.rotationSpeed;
            
            // Loop around if it goes off bottom or sides
            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
    }
    
    let particles = [];
    const confettiCount = 65;
    let confettiList = [];
    
    // Populate confetti list
    for (let i = 0; i < confettiCount; i++) {
        confettiList.push(new ConfettiPiece());
    }

    // Populate petal list (Romantic addition)
    const petalCount = 35;
    let petalList = [];
    for (let i = 0; i < petalCount; i++) {
        petalList.push(new Petal());
    }
    
    // Spawns firework explosion at specific coordinates
    function triggerFireworkAt(x, y, color) {
        const colors = ["#ff7597", "#f50057", "#d500f9", "#651fff", "#00e5ff", "#00e676", "#ffea00", "#ff3d00"];
        const selectedColor = color || colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < 45; i++) {
            particles.push(new Particle(x, y, selectedColor));
        }
    }
    
    function triggerFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.1);
        triggerFireworkAt(x, y);
    }

    // Add click/tap listener to spawn custom fireworks anywhere (handles both mobile and desktop)
    const surpriseSection = document.getElementById("screen-surprise");
    surpriseSection.addEventListener("click", (e) => {
        triggerFireworkAt(e.clientX, e.clientY);
    });
    
    // Trigger firework periodically
    let fireworkTimer = 0;
    
    // Animation Loop
    function animate() {
        // Clear with slight alpha to leave tail trails
        ctx.fillStyle = "rgba(13, 2, 19, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update & Draw Confetti
        confettiList.forEach(c => {
            c.update();
            c.draw();
        });

        // Update & Draw Petals (Cherry blossoms)
        petalList.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Update & Draw Fireworks Particles
        particles = particles.filter(p => {
            if (p.alpha <= 0) {
                return false;
            }
            p.update();
            p.draw();
            return true;
        });
        
        // Spawn fireworks randomly
        fireworkTimer++;
        if (fireworkTimer % 90 === 0) {
            triggerFirework();
        }
        
        celebrationAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Force a starting firework explosion
    setTimeout(triggerFirework, 500);
    setTimeout(triggerFirework, 1500);
}

function spawnCelebrationBalloon() {
    // Maximum of 15 simultaneous balloons to avoid lag
    const existingBalloons = document.querySelectorAll(".balloon");
    if (existingBalloons.length > 15) return;
    
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    
    // Set random color
    const colors = ["#ff7597", "#ffb3c6", "#e2caff", "#ff85a1", "#ab47bc", "#ec407a", "#ffeb3b"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.color = color;
    balloon.style.backgroundColor = color;
    
    // Set random left starting position
    const left = Math.random() * 85 + 5; // bounds in viewport 5% to 90%
    balloon.style.left = `${left}%`;
    
    // String element
    const string = document.createElement("div");
    string.className = "balloon-string";
    balloon.appendChild(string);
    
    // Floating duration speed
    const duration = Math.random() * 5 + 7; // 7s to 12s
    balloon.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(balloon);
    
    // Remove element after it floats away
    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

// 12. SECRET EASTER EGG LOGIC
function handleEasterEggClick() {
    easterEggClicks++;
    
    // Tiny heartbeat burst on secret trigger click
    const trigger = document.getElementById("secret-trigger");
    const rect = trigger.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 4);
    
    if (easterEggClicks >= CONFIG.easterEggClickCount) {
        easterEggClicks = 0; // reset
        
        // Show easter egg modal
        const modal = document.getElementById("easter-egg-modal");
        modal.classList.remove("hidden");
        
        // Trigger extra sparkles
        createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
    }
}
