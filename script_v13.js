// script_v13.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('ChronoEcho website v13 loaded.');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Reveal Animation
    const scrollElements = document.querySelectorAll('.scroll-reveal');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('active');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Initial check on load
    handleScrollAnimation();

    // Parallax Effect for Hero Section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = -scrollPosition * 0.3 + 'px';
        });
    }

    // Interactive Timeline Functionality
    const eraItems = document.querySelectorAll('.era-item');
    const timelineEvents = document.querySelectorAll('.timeline-event');
    const timelineEventsInner = document.querySelector('.timeline-events-inner');

    let currentEraIndex = 0;

    const updateEraContent = (eraIndex) => {
        eraItems.forEach((item, index) => {
            if (index === eraIndex) {
                item.style.display = 'block';
                item.classList.add('reveal-effect');
            } else {
                item.style.display = 'none';
                item.classList.remove('reveal-effect');
            }
        });

        timelineEvents.forEach((event, index) => {
            if (index === eraIndex) {
                event.classList.add('active');
            } else {
                event.classList.remove('active');
            }
        });

        // Scroll the timeline to center the active event
        if (timelineEventsInner && timelineEvents[eraIndex]) {
            const activeEvent = timelineEvents[eraIndex];
            const scrollLeft = activeEvent.offsetLeft - (timelineEventsInner.offsetWidth / 2) + (activeEvent.offsetWidth / 2);
            timelineEventsInner.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }

        playEraSound(eraIndex); // Play sound based on era
        updateEraVisuals(eraIndex); // Update visual based on era
        currentEraIndex = eraIndex; // Update current era index
    };

    if (eraItems.length > 0) {
        timelineEvents.forEach(event => {
            event.addEventListener('click', () => {
                const eraIndex = parseInt(event.dataset.era);
                updateEraContent(eraIndex);
            });
        });

        // Set initial display and sound for the first era
        updateEraContent(currentEraIndex);
    }

    // Historical Artifact Click-and-Reveal
    document.querySelectorAll('.artifact-image').forEach(image => {
        image.addEventListener('click', (e) => {
            const altText = e.target.alt;
            alert(`AIが紡ぐ物語：\n\nこの「${altText}」は、当時の人々の生活や文化を物語る貴重な手がかりです。ChronoEchoでは、AIがこの手がかりから、あなただけの詳細な物語を生成します。`);
            console.log(`Artifact clicked: ${altText}`);
        });
    });

    // Create Your Echo Button
    const createEchoBtn = document.getElementById('create-echo-btn');
    if (createEchoBtn) {
        createEchoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('あなたの物語を創造する旅へようこそ！\n(これはデモンストレーションです。実際の機能はChronoEchoアプリで体験できます。)');
            console.log('Create Echo button clicked.');
        });
    }

    // Subtle Background Soundscape (Conceptual - using Web Audio API for simple tones)
    let audioContext;
    let primaryOscillator;
    let secondaryOscillator;
    let ambientNoise;

    const initAudio = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            primaryOscillator = audioContext.createOscillator();
            primaryOscillator.type = 'sine';
            primaryOscillator.frequency.setValueAtTime(0, audioContext.currentTime);
            primaryOscillator.connect(audioContext.destination);
            primaryOscillator.start();

            secondaryOscillator = audioContext.createOscillator();
            secondaryOscillator.type = 'triangle';
            secondaryOscillator.frequency.setValueAtTime(0, audioContext.currentTime);
            secondaryOscillator.connect(audioContext.destination);
            secondaryOscillator.start();

            // Conceptual ambient noise (white noise)
            ambientNoise = audioContext.createBufferSource();
            const bufferSize = audioContext.sampleRate * 2; // 2 seconds of noise
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1; // White noise
            }
            ambientNoise.buffer = buffer;
            ambientNoise.loop = true;
            ambientNoise.start();
            ambientNoise.connect(audioContext.destination);
            ambientNoise.gain.setValueAtTime(0.01, audioContext.currentTime); // Very subtle
        }
    };

    const playEraSound = (eraIndex) => {
        initAudio();
        let primaryFreq = 0;
        let secondaryFreq = 0;
        let ambientGain = 0.01;

        switch (eraIndex) {
            case 0: // Ancient
                primaryFreq = 80; // Deep hum
                secondaryFreq = 120; // Subtle higher tone
                ambientGain = 0.02; // Slightly more noticeable
                break;
            case 1: // Medieval
                primaryFreq = 130; // Slightly higher
                secondaryFreq = 180; // More complex
                ambientGain = 0.015;
                break;
            case 2: // Early Modern
                primaryFreq = 190; // Mid-range
                secondaryFreq = 240; // Brighter
                ambientGain = 0.01;
                break;
            case 3: // Modern
                primaryFreq = 260; // Higher
                secondaryFreq = 320; // More distinct
                ambientGain = 0.008;
                break;
            case 4: // Contemporary
                primaryFreq = 350; // Even higher
                secondaryFreq = 400; // Complex and active
                ambientGain = 0.005;
                break;
            default:
                primaryFreq = 0;
                secondaryFreq = 0;
                ambientGain = 0.01;
        }
        primaryOscillator.frequency.setValueAtTime(primaryFreq, audioContext.currentTime);
        secondaryOscillator.frequency.setValueAtTime(secondaryFreq, audioContext.currentTime);
        ambientNoise.gain.setValueAtTime(ambientGain, audioContext.currentTime);
        console.log(`Playing sound for era ${eraIndex} with primary ${primaryFreq}Hz, secondary ${secondaryFreq}Hz, ambient gain ${ambientGain}`);
    };

    // Update visual based on era (conceptual)
    const updateEraVisuals = (eraIndex) => {
        const body = document.body;
        body.className = '';
        body.classList.add(`era-${eraIndex}-active`);
        // Dynamically change CSS variables for color themes
        const root = document.documentElement;
        const colors = [
            { main: '#77aaff', accent: '#aaffff' }, // Ancient
            { main: '#8B4513', accent: '#A0522D' }, // Medieval
            { main: '#DAA520', accent: '#FFD700' }, // Renaissance Gold
            { main: '#5F9EA0', accent: '#87CEEB' }, // Industrial Teal
            { main: '#4682B4', accent: '#6A5ACD' }  // Modern Steel Blue
        ];
        root.style.setProperty('--main-accent-color', colors[eraIndex].main);
        root.style.setProperty('--light-accent-color', colors[eraIndex].accent);
        console.log(`Visuals updated for era ${eraIndex}`);
    };

    // Memory Fragment Interaction (Conceptual)
    document.querySelectorAll('.memory-fragment').forEach(fragment => {
        fragment.addEventListener('mouseover', () => {
            if (audioContext) {
                const shortOscillator = audioContext.createOscillator();
                shortOscillator.type = 'triangle';
                shortOscillator.frequency.setValueAtTime(Math.random() * 500 + 200, audioContext.currentTime);
                shortOscillator.connect(audioContext.destination);
                shortOscillator.start();
                shortOscillator.stop(audioContext.currentTime + 0.1); // Play for 0.1 seconds
            }
            fragment.classList.add('flicker');
        });
        fragment.addEventListener('animationend', () => {
            fragment.classList.remove('flicker');
        });
    });

    // To start audio, a user gesture is usually required by browsers.
    document.body.addEventListener('click', () => {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
            console.log('AudioContext resumed.');
        }
    }, { once: true });
});
