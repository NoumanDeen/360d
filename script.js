// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Tell ScrollTrigger to use Lenis's scroll position
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Navigation scroll effect
const navbar = document.querySelector('.navbar');

lenis.on('scroll', ({ scroll }) => {
    if (scroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero title animation - word by word fade in (Zoox style)
const words = document.querySelectorAll('.hero-title .split-word');

gsap.to(words, {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.08,
    ease: 'power3.out',
    delay: 0.3
});

// Hero video section - smooth reveal and scale animation
gsap.fromTo('.hero-video',
    {
        scale: 0.8,
        borderRadius: '80px',
        opacity: 0
    },
    {
        scale: 1,
        borderRadius: '48px',
        opacity: 1,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.hero-video-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.5,
            toggleActions: 'play none none reverse'
        }
    }
);

// Hide navbar in hero video section (desktop only)
if (window.innerWidth > 768) {
    ScrollTrigger.create({
        trigger: '.hero-video-section',
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
            gsap.to('.navbar', { y: -200, duration: 0.4, ease: 'power2.out' });
        },
        onLeaveBack: () => {
            gsap.to('.navbar', { y: 0, duration: 0.4, ease: 'power2.out' });
        },
        onLeave: () => {
            gsap.to('.navbar', { y: 0, duration: 0.4, ease: 'power2.out' });
        }
    });
}

// Hero title scroll fade out
gsap.to('.hero-title', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
    },
    opacity: 0,
    y: -80,
    scale: 0.95,
    ease: 'power2.inOut'
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                lenis.scrollTo(targetSection, {
                    offset: -100,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        }
    });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuClose = document.querySelector('.menu-close');
const menuLinks = document.querySelectorAll('.menu-link');

hamburger.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

menuClose.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                setTimeout(() => {
                    lenis.scrollTo(targetSection, {
                        offset: -100,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }, 300);
            }
        }
    });
});


// Content Section 2 - Zoox-style: White panel with text slides right to reveal image
// Disable on mobile for better experience
if (window.innerWidth > 768) {
    const contentSection = gsap.timeline({
        scrollTrigger: {
            trigger: '.content-section',
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 2,
            anticipatePin: 1,
            onEnter: () => {
                gsap.to('.navbar', { y: -200, duration: 0.4, ease: 'power2.out' });
            },
            onLeaveBack: () => {
                gsap.to('.navbar', { y: 0, duration: 0.4, ease: 'power2.out' });
            },
            onLeave: () => {
                gsap.to('.navbar', { y: 0, duration: 0.4, ease: 'power2.out' });
            }
        }
    });

    contentSection
        .to('.content-text-wrapper', {
            x: '100%',
            opacity: 0,
            ease: 'power1.inOut'
        }, 0)
        .fromTo('.content-image',
            { scale: 1.1, x: '-2%' },
            { scale: 1, x: '0%', ease: 'power1.inOut' },
            0
        );
} else {
    // Mobile animations for Section 2
    gsap.from('.content-image-wrapper', {
        scrollTrigger: {
            trigger: '.content-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
        },
        scale: 0.9,
        opacity: 0,
        ease: 'power2.out'
    });
    
    // Section 2 image zoom effect on mobile
    gsap.fromTo('.content-image img',
        { scale: 1.2 },
        {
            scale: 1,
            scrollTrigger: {
                trigger: '.content-image-wrapper',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1.5
            },
            ease: 'none'
        }
    );
    
    gsap.from('.content-text-wrapper', {
        scrollTrigger: {
            trigger: '.content-text-wrapper',
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1
        },
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    });
}

// Mobile animations for other sections
if (window.innerWidth <= 768) {
    // Features Section animations
    gsap.from('.features-video-wrapper', {
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
        },
        scale: 0.9,
        opacity: 0,
        ease: 'power2.out'
    });
    
    gsap.from('.features-content', {
        scrollTrigger: {
            trigger: '.features-content',
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1
        },
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    });
    
    // Survey Section animations
    gsap.from('.survey-left', {
        scrollTrigger: {
            trigger: '.survey-section',
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1
        },
        x: -50,
        opacity: 0,
        ease: 'power2.out'
    });
    
    gsap.from('.survey-right', {
        scrollTrigger: {
            trigger: '.survey-right',
            start: 'top 85%',
            end: 'top 45%',
            scrub: 1
        },
        x: 50,
        opacity: 0,
        ease: 'power2.out'
    });
    
    // Split Section animations
    gsap.from('.split-image-wrapper', {
        scrollTrigger: {
            trigger: '.split-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
        },
        scale: 0.9,
        opacity: 0,
        ease: 'power2.out'
    });
    
    gsap.from('.split-content', {
        scrollTrigger: {
            trigger: '.split-content',
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1
        },
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    });
    
    // Press items stagger animation
    gsap.from('.press-item', {
        scrollTrigger: {
            trigger: '.press-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });
}


// Footer Section Animation
gsap.from('.footer-column', {
    scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
    },
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
});

gsap.from('.footer-bottom-links a, .footer-socials', {
    scrollTrigger: {
        trigger: '.footer-bottom-links',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power2.out'
});

gsap.from('.footer-branding', {
    scrollTrigger: {
        trigger: '.footer-image',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

// Footer image parallax effect
gsap.to('.footer-image-wrapper', {
    scrollTrigger: {
        trigger: '.footer-image',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
    },
    y: '-10%',
    ease: 'none'
});

// Video sound toggle
const videoSoundToggle = document.querySelector('.video-sound-toggle');
const heroVideo = document.getElementById('heroVideo');

if (videoSoundToggle && heroVideo) {
    videoSoundToggle.addEventListener('click', () => {
        if (heroVideo.muted) {
            heroVideo.muted = false;
            videoSoundToggle.classList.add('unmuted');
        } else {
            heroVideo.muted = true;
            videoSoundToggle.classList.remove('unmuted');
        }
    });
}
