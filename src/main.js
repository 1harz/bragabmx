import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis'; // Keeping this version as it works
import { BMXGame } from './game.js';
import { HistoryScene } from './three/HistoryScene.js';

gsap.registerPlugin(ScrollTrigger);

// --- 1. SMOOTH SCROLL (LENIS) ---
const lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
    direction: 'vertical',
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// --- 2. ZOOM HERO EFFECT & REVEAL ---
const tlZoom = gsap.timeline({
    scrollTrigger: {
        trigger: ".zoom-wrapper",
        start: "top top",
        end: "+=200%", // Scroll distance
        scrub: true,
        pin: true,
        anticipatePin: 1
    }
});

tlZoom
    .to(".zoom-svg", {
        scale: 80,
        opacity: 0,
        duration: 2,
        ease: "power2.in"
    })
    .to(".hero-text-layer", {
        opacity: 0,
        scale: 1.5,
        duration: 1
    }, 0)
    .to(".zoom-content", {
        backgroundColor: "rgba(234, 234, 234, 0)", // Fade to the body color
        duration: 1
    }, 1);

// --- 4. HORIZONTAL SCROLL ---
const track = document.querySelector('.horizontal-track');
const container = document.querySelector('.horizontal-scroll-container');
let horizontalTween;

if (track && container) {
    horizontalTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            end: () => "+=" + track.scrollWidth
        }
    });
}

// --- 5. GAME INIT ---
window.addEventListener('load', () => {
    // Game
    const gameCanvas = document.getElementById('bmx-game');
    if (gameCanvas) {
        window.bmxGameInstance = new BMXGame('bmx-game');
    }

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        gsap.to(".loader-bar", {
            width: "100%",
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut"
                });
            }
        });
    }
    // History Scene
    const historyContainer = document.getElementById('history-canvas-container');
    if (historyContainer) {
        new HistoryScene('history-canvas-container');
    }

    // Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// --- 7. ADDITIONAL SECTIONS ANIMATIONS ---
const historySection = document.getElementById('history');
if (historySection) {
    gsap.from(".history-title", {
        scrollTrigger: {
            trigger: "#history",
            start: "top 80%",
            end: "top 20%",
            scrub: 1
        },
        y: 100,
        opacity: 0
    });

    gsap.from(".history-text p", {
        scrollTrigger: {
            trigger: "#history",
            start: "top 60%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1
    });
}

// Resume Stagger
const resumeSection = document.getElementById('resume');
if (resumeSection) {
    gsap.from(".resume-col", {
        scrollTrigger: {
            trigger: "#resume",
            start: "top 70%"
        },
        y: 50,
        opacity: 0,
        stagger: 0.3,
        duration: 0.8
    });
}

// Sponsors animation removed to ensure basic visibility
const matchSponsors = document.querySelectorAll(".sponsor-item");

// --- 6. PARALLAX IMAGES ---
if (horizontalTween) {
    gsap.utils.toArray('.h-img img').forEach(img => {
        gsap.to(img, {
            scale: 1.1, // Subtle scale instead of objectPosition which can be jarring
            ease: "none",
            scrollTrigger: {
                trigger: img,
                containerAnimation: horizontalTween,
                start: "left center",
                toggleActions: "play none none reverse",
                scrub: true
            }
        });
    });
}

// --- 8. INTERNATIONALIZATION (I18N) ---
const resumeData = {
    pt: [
        {
            year: "2025",
            items: [
                "2º lugar no Campeonato Gaúcho de BMX Freestyle",
                "4º lugar na 1ª etapa do circuito Compact BMX (Campo Bom)",
                "9º lugar no Cresol Base Fest (Maringá)",
                "11º lugar no C1 (Taubaté)",
                "22º lugar no Cresol Base Fest (Taubaté)"
            ]
        },
        {
            year: "2024",
            items: [
                "1º lugar Elite Júnior - Campeonato Brasileiro (Maringá - PR)",
                "10º lugar Ranking Brasileiro Elite Geral",
                "13º lugar Campeonato Internacional C1 (Maringá - PR)",
                "Participação: Classificatórias Pan Americano (Santiago - Chile)",
                "Participação: Classificatórias Internacional (Córdoba - Argentina)"
            ]
        },
        {
            year: "2023",
            items: [
                "1º lugar Ranking Brasileiro Junior (CBC)",
                "2º colocado Campeonato Brasileiro (SBC - SP)",
                "20º lugar Copa Internacional (Taubaté - SP)",
                "Participação: Sul Americano Open (Lima - Peru)",
                "Participação: Pan Americano (Asunción - Paraguai)"
            ]
        },
        {
            year: "2022",
            items: [
                "3º lugar Campeonato Brasileiro (Maringá - PR)"
            ]
        },
        {
            year: "2021",
            items: [
                "3º lugar Campeonato Brasileiro (SBC - SP)"
            ]
        }
    ],
    en: { // Simplified English data structure mostly mirroring PT for now or translating basic terms
        // In a real scenario I would translate all, but here I'll do a quick pass
    }
};

// Populate English data as mirror of PT for now with basic substitutions if needed, 
// or I can define it fully. Let's define it fully to be safe.
resumeData.en = [
    {
        year: "2025",
        items: [
            "2nd place Gaucho Championship BMX Freestyle",
            "4th place Compact BMX Circuit 1st Stage (Campo Bom)",
            "9th place Cresol Base Fest (Maringá)",
            "11th place C1 (Taubaté)",
            "22nd place Cresol Base Fest (Taubaté)"
        ]
    },
    {
        year: "2024",
        items: [
            "1st place Elite Junior - Brazilian Championship (Maringá - PR)",
            "10th place Brazilian Elite General Ranking",
            "13th place International C1 (Maringá - PR)",
            "Participation: Pan American Qualifiers (Santiago - Chile)",
            "Participation: International Qualifiers (Córdoba - Argentina)"
        ]
    },
    {
        year: "2023",
        items: [
            "1st place Brazilian Junior Ranking (CBC)",
            "2nd place Brazilian Championship (SBC - SP)",
            "20th place International Cup (Taubaté - SP)",
            "Participation: South American Open (Lima - Peru)",
            "Participation: Pan American (Asunción - Paraguay)"
        ]
    },
    {
        year: "2022",
        items: [
            "3rd place Brazilian Championship (Maringá - PR)"
        ]
    },
    {
        year: "2021",
        items: [
            "3rd place Brazilian Championship (SBC - SP)"
        ]
    }
];

const translations = {
    pt: {
        loaderTitle: "LUCAS BRAGA",
        heroTitle: "BMX<br>FREESTYLE",
        heroSubtitle: "SCROLL PARA DESCOBRIR",
        historyTitle: "A HISTÓRIA DO <span class='outline-text'>BMX</span>",
        historyText1: "O BMX (Bicycle Motocross) nasceu no final da década de 1960 na Califórnia, inspirado no motocross. O que começou como crianças imitando seus ícones nas pistas de terra, evoluiu para um fenômeno global.",
        historyText2: "Nos anos 80, o <strong>Freestyle</strong> explodiu, trazendo criatividade e manobras radicais. Hoje, é esporte olímpico, símbolo de liberdade e superação.",
        journeyOriginTitle: "A Origem",
        journeyOriginText: "Natural de São Sebastião do Caí – RS. O que era apenas uma brincadeira na rua se transformou em uma busca incessante pela perfeição sobre duas rodas. Hoje, aos 19 anos, residindo em São Bernardo do Campo – SP para treinos de alto rendimento.",
        journeyEvoTitle: "Evolução",
        journeyEvoText: "Do Rio Grande do Sul para o mundo. Integrado ao CT BMX Freestyle SBC, treinando ao lado de ícones como Gustavo Bala Loka. Uma jornada de disciplina, saindo de um estado sem pistas adequadas para competir na elite global.",
        journeyHighTitle: "Destaques",
        journeyHigh1: "🏆 1º no Ranking Brasileiro Junior (2023)",
        journeyHigh2: "🥈 2º no Campeonato Brasileiro (2023)",
        journeyHigh3: "🌍 Presença em Sul-Americano e Pan-Americano",
        journeyHigh4: "✨ Top 10 Ranking Brasileiro Elite (2024)",
        journeyHighNote: "(Veja lista completa abaixo)",
        resumeTitle1: "TRAJETÓRIA &",
        resumeTitle2: "RESULTADOS",
        resumeBioTitle: "Bio",
        resumeBioDOB: "Data Nasc.: 03/01/2006",
        resumeBioRole: "Atleta BMX Freestyle Park",
        resumeBioAffiliation: "Filiado à CBC e FGC. Treina desde 2019.",
        resumeBioText1: "Devido à disciplina, determinação e rotina constante de treinos, tem alcançado excelentes resultados em competições regionais, nacionais e internacionais (Argentina, Chile, Peru, Paraguai).",
        resumeBioText2: "Treinos realizados no CT de SBC com companheiros como Gustavo Bala Loka, Duda Penso, Caio Rabisco e Paulo Saçaki.",
        resumeMentalSupport: "Suporte Mental:",
        resumeResultsTitle: "Principais Participações",
        gameTitle: "RIDE OR DIE",
        gameSubtitle: "Pressione ESPAÇO para pular os obstáculos.",
        gameStartTitle: "START GAME",
        gameStartBtn: "PLAY NOW",
        sponsorsTitle1: "PARCEIROS &",
        sponsorsTitle2: "BRANDS",
        sponsorsSubtitle: "Marcas que confiam no meu potencial.",
        contactTitle: "VAMOS<br>TRABALHAR<br>JUNTOS",
        contactSendBtn: "ENVIAR",
        contactNamePlaceholder: "Nome",
        contactEmailPlaceholder: "Email",
        contactMessagePlaceholder: "Mensagem"
    },
    en: {
        loaderTitle: "LUCAS BRAGA",
        heroTitle: "BMX<br>FREESTYLE",
        heroSubtitle: "SCROLL TO RIDE",
        historyTitle: "THE HISTORY OF <span class='outline-text'>BMX</span>",
        historyText1: "BMX (Bicycle Motocross) was born in the late 1960s in California, inspired by motocross. What started as kids mimicking their icons on dirt tracks evolved into a global phenomenon.",
        historyText2: "In the 80s, <strong>Freestyle</strong> exploded, bringing creativity and radical tricks. Today, it is an Olympic sport, a symbol of freedom and overcoming limits.",
        journeyOriginTitle: "The Origin",
        journeyOriginText: "Born in São Sebastião do Caí – RS. What was just street play transformed into a relentless pursuit of perfection on two wheels. Today, at 19, residing in São Bernardo do Campo – SP for high-performance training.",
        journeyEvoTitle: "Evolution",
        journeyEvoText: "From Rio Grande do Sul to the world. Integrated into the BMX Freestyle SBC Training Center, training alongside icons like Gustavo Bala Loka. A journey of discipline, moving from a state without adequate tracks to competing in the global elite.",
        journeyHighTitle: "Highlights",
        journeyHigh1: "🏆 1st in Brazilian Junior Ranking (2023)",
        journeyHigh2: "🥈 2nd in Brazilian Championship (2023)",
        journeyHigh3: "🌍 Performance in South American and Pan American Games",
        journeyHigh4: "✨ Top 10 Brazilian Elite Ranking (2024)",
        journeyHighNote: "(See full list below)",
        resumeTitle1: "CAREER &",
        resumeTitle2: "RESULTS",
        resumeBioTitle: "Bio",
        resumeBioDOB: "DOB: 01/03/2006",
        resumeBioRole: "BMX Freestyle Park Athlete",
        resumeBioAffiliation: "Affiliated with CBC and FGC. Training since 2019.",
        resumeBioText1: "Due to discipline, determination, and a constant training routine, excellent results have been achieved in regional, national, and international competitions (Argentina, Chile, Peru, Paraguay).",
        resumeBioText2: "Training at the SBC Training Center with teammates like Gustavo Bala Loka, Duda Penso, Caio Rabisco, and Paulo Saçaki.",
        resumeMentalSupport: "Mental Support:",
        resumeResultsTitle: "Main Participations",
        gameTitle: "RIDE OR DIE",
        gameSubtitle: "Press SPACE to jump over obstacles.",
        gameStartTitle: "START GAME",
        gameStartBtn: "PLAY NOW",
        sponsorsTitle1: "PARTNERS &",
        sponsorsTitle2: "BRANDS",
        sponsorsSubtitle: "Brands that trust my potential.",
        contactTitle: "LET'S<br>WORK<br>TOGETHER",
        contactSendBtn: "SEND",
        contactNamePlaceholder: "Name",
        contactEmailPlaceholder: "Email",
        contactMessagePlaceholder: "Message"
    }
};

let currentLang = 'pt';
const langToggle = document.getElementById('lang-toggle');

function renderTimeline(lang) {
    const container = document.getElementById('timeline-results');
    if (!container) return;

    const data = resumeData[lang] || resumeData.pt;

    let html = '';

    data.forEach(group => {
        html += `
            <div class="timeline-group">
                <div class="timeline-year">${group.year}</div>
        `;

        group.items.forEach(item => {
            html += `
                <div class="timeline-item">
                    <h4>${item}</h4>
                </div>
            `;
        });

        html += `</div>`;
    });

    container.innerHTML = html;

    // Trigger animation for new items
    if (window.ScrollTrigger) {
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
}

function updateLanguage(lang) {
    currentLang = lang;
    langToggle.textContent = lang === 'pt' ? 'EN' : 'PT'; // Show option to switch to

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key]; // innerHTML to support HTML tags like <br> or <strong>
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // Render timeline
    renderTimeline(lang);
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        updateLanguage(newLang);
    });
}

// Initialize language on load
updateLanguage(currentLang);

// Toggle video audio and indicator
const contactVideo = document.querySelector('.contact-video');
const videoContainer = document.querySelector('.video-container');
const muteIndicator = document.querySelector('.mute-indicator');

function updateMuteUI() {
    if (contactVideo.muted) {
        muteIndicator.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteIndicator.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

if (contactVideo && videoContainer) {
    videoContainer.addEventListener('click', () => {
        contactVideo.muted = !contactVideo.muted;
        updateMuteUI();
    });

    // Auto unmute on reach
    ScrollTrigger.create({
        trigger: "#contact",
        start: "top 60%",
        onEnter: () => {
            contactVideo.muted = false;
            // Force play in case autoplay was blocked or paused
            contactVideo.play().catch(e => console.log("Video play was blocked:", e));
            updateMuteUI();
        },
        onLeaveBack: () => {
            contactVideo.muted = true;
            updateMuteUI();
        }
    });
}

// Animation cycle removed as per user request to maintain fundo.jpg as static base.