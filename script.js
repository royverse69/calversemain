document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    const openMenu = () => {
        mobileMenu.classList.add('open');
        menuOverlay.classList.remove('invisible', 'opacity-0');
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.add('invisible', 'opacity-0');
    };

    mobileMenuButton.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('nextBtn');
        const prevButton = document.getElementById('prevBtn');
        const dotsContainer = document.getElementById('pagination-dots');
        let currentIndex = 0;
        
        if(dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('pagination-dot', 'w-3', 'h-3', 'bg-gray-600', 'rounded-full');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }
        const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

        const updateCarousel = () => {
            if (!track || slides.length === 0) return;
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
            
            if(dots.length > 0){
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            }

            prevButton.disabled = currentIndex === 0;
            const visibleSlides = window.innerWidth < 640 ? 1 : (window.innerWidth < 1024 ? 2 : 3);
            nextButton.disabled = currentIndex >= slides.length - visibleSlides;
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        };

        if(nextButton && prevButton) {
            nextButton.addEventListener('click', () => { currentIndex++; updateCarousel(); });
            prevButton.addEventListener('click', () => { currentIndex--; updateCarousel(); });
        }
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // --- On-Scroll Fade-In Animation ---
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
    
    // --- Form Validation ---
    const validateForm = (form) => {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            const errorSpan = input.nextElementSibling;
            if (!input.value.trim() || (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value))) {
                isValid = false;
                if(errorSpan) errorSpan.classList.remove('hidden');
                input.classList.add('border-red-500');
            } else {
                if(errorSpan) errorSpan.classList.add('hidden');
                input.classList.remove('border-red-500');
            }
        });
        return isValid;
    };
    
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateForm(e.target)) {
                alert('Form submitted successfully!'); // Placeholder for actual submission
                e.target.reset();
            }
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if(newsletterForm){
         newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateForm(e.target)) {
                alert('Thank you for subscribing!'); // Placeholder
                e.target.reset();
            }
        });
    }

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // --- APK Download Modal Logic ---
    const apkBtn = document.getElementById('apk-download-btn');
    const modal = document.getElementById('popup-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    apkBtn.addEventListener('click', () => {
        modal.classList.remove('invisible', 'opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('invisible', 'opacity-0');
        modal.querySelector('div').classList.add('scale-95');
    });

    // --- Three.js background animation ---
    const container = document.getElementById('three-canvas');
    if(typeof THREE !== 'undefined' && container) {
        let scene, camera, renderer, particles, clock;
        
        function init() {
            scene = new THREE.Scene();
            clock = new THREE.Clock();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            const particleCount = 2500;
            const particlesGeometry = new THREE.BufferGeometry();
            const posArray = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 20;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.018,
                color: 0xFFD300,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending
            });
            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);

            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onMouseMove, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        let mouseX = 0, mouseY = 0;
        function onMouseMove(event) {
            mouseX = event.clientX - window.innerWidth / 2;
            mouseY = event.clientY - window.innerHeight / 2;
        }

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Continuous floating animation
            particles.rotation.y = elapsedTime * 0.05;
            
            // Mouse-based interaction
            particles.rotation.x += (mouseY * 0.00002 - particles.rotation.x) * 0.02;
            
            camera.position.x += (mouseX * 0.00002 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 0.00002 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        init();
        animate();
    }
});
