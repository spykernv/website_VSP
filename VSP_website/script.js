// ===========================
// THREE.JS SCENE SETUP
// ===========================

let scene, camera, renderer, house;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThree() {
    const canvas = document.getElementById('hero-canvas');

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xe8b86d, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4a9eff, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create 3D house structure
    createHouse();

    // Handle mouse movement
    document.addEventListener('mousemove', onMouseMove);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createHouse() {
    const houseGroup = new THREE.Group();

    // Main house body
    const bodyGeometry = new THREE.BoxGeometry(2, 2, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a2a2a,
        emissive: 0x0a0a0a,
        wireframe: false,
        transparent: true,
        opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    houseGroup.add(body);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(1.7, 1.2, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({
        color: 0xe8b86d,
        emissive: 0x3a2a1a,
        transparent: true,
        opacity: 0.95
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.6;
    roof.rotation.y = Math.PI / 4;
    houseGroup.add(roof);

    // Windows
    const windowGeometry = new THREE.PlaneGeometry(0.4, 0.5);
    const windowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a9eff,
        transparent: true,
        opacity: 0.8
    });

    // Front windows
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-0.5, 0.3, 1.01);
    houseGroup.add(window1);

    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(0.5, 0.3, 1.01);
    houseGroup.add(window2);

    // Door
    const doorGeometry = new THREE.PlaneGeometry(0.5, 0.9);
    const doorMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        emissive: 0x0a0a0a
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, -0.55, 1.01);
    houseGroup.add(door);

    // Wireframe overlay
    const wireframeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xe8b86d,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    houseGroup.add(wireframe);

    // Add floating particles around the house
    createParticles(houseGroup);

    house = houseGroup;
    scene.add(house);
}

function createParticles(group) {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xe8b86d,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (house) {
        // Continuous rotation
        house.rotation.y += 0.003;

        // Mouse-based rotation
        house.rotation.x += (mouseY * 0.05 - house.rotation.x) * 0.05;
        house.rotation.y += (mouseX * 0.05 - house.rotation.y) * 0.05;

        // Subtle floating animation
        house.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    renderer.render(scene, camera);
}

// ===========================
// GSAP ANIMATIONS
// ===========================

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero title animation
    gsap.to('.title-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
    });

    // Hero description animation
    gsap.to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
    });

    // Hero CTA animation
    gsap.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.5
    });

    // Scroll indicator animation
    gsap.to('.scroll-indicator', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 2
    });

    // Service cards animation
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Stats counter animation
    gsap.utils.toArray('.stat-item').forEach((stat, index) => {
        const numberElement = stat.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-target'));

        gsap.to(stat, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    animateCounter(numberElement, 0, target, 2000);
                }
            }
        });
    });

    // Portfolio items animation
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
        gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Process steps animation
    gsap.utils.toArray('.process-step').forEach((step, index) => {
        gsap.to(step, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: step,
                start: 'top 75%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Parallax effect for sections
    gsap.utils.toArray('.section').forEach((section) => {
        const speed = section.dataset.speed || 0.5;
        gsap.to(section, {
            yPercent: -10 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Navbar scroll effect
    ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {
            className: 'scrolled',
            targets: '.navbar'
        }
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function animateCounter(element, start, end, duration) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// ===========================
// NAVIGATION
// ===========================

function initNavigation() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// ===========================
// CONTACT FORM
// ===========================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Here you would normally send the data to a server
            console.log('Form submitted:', data);

            // Show success message
            alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');

            // Reset form
            contactForm.reset();
        });
    }
}

// ===========================
// INITIALIZATION
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    initScrollAnimations();
    initNavigation();
    initContactForm();
});

// Performance optimization: Pause Three.js animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations if needed
    } else {
        // Resume animations if needed
    }
});
