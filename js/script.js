/**
 * Main JavaScript File for Portfolio Website
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Loading Screen
    const loader = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                // Trigger initial scroll reveal after load
                reveal();
            }, 500);
        }, 800); // Minimum display time
    });

    // 2. Sticky Navbar & Active Menu
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 4. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon'); // When light mode is on, show moon to switch to dark
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun'); // Show sun to switch to light
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 5. Typing Animation
    const typingText = document.querySelector('.typing-text');
    const words = ['Full Stack Developer', 'Mobile Developer', 'Backend Specialist'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typingText) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    if (typingText) {
        setTimeout(type, 1000); // Start delay
    }

    // 6. Scroll Reveal Animation
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');

                // Trigger Progress Bar animation if it's in a revealed skill card
                if (reveals[i].classList.contains('skill-card')) {
                    const progressBars = reveals[i].querySelectorAll('.progress-line span');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });
                }

                // Trigger Counter animation if it's in a revealed stats section
                if (reveals[i].classList.contains('about-stats')) {
                    const counters = reveals[i].querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const speed = 200; // lower is faster

                        const updateCount = () => {
                            const count = +counter.innerText;
                            const inc = target / speed;

                            if (count < target) {
                                counter.innerText = Math.ceil(count + inc);
                                setTimeout(updateCount, 10);
                            } else {
                                counter.innerText = target;
                            }
                        };

                        if (counter.innerText == '0') {
                            updateCount();
                        }
                    });
                }
            }
        }
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check

    // 7. Ripple Effect on Buttons
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 8. Scroll To Top Button
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

});

document.addEventListener('DOMContentLoaded', () => {
    // ==========================
    // Project Modal Logic
    // ==========================
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('projectModal');
    const closeModal = document.getElementById('closeModal');
    const projectModalBody = document.getElementById('projectModalBody');

    if (!projectCards.length || !projectModal || !closeModal || !projectModalBody) {
        return;
    }

    // Function Open Modal
    function openModal(card) {
        const img = card.querySelector('.project-img img');
        const title = card.querySelector('.project-content h3');
        const desc =
            card.querySelector('.project-content p') ||
            card.querySelector('.project-content > div:not(.project-tech)');
        const tech = card.querySelector('.project-tech');

        const imgSrc = img ? img.src : "";
        const titleText = title ? title.innerHTML : "";
        const descText = desc ? desc.innerHTML : "";
        const techText = tech ? tech.innerHTML : "";

        projectModalBody.innerHTML = `
            <img src="${imgSrc}" alt="${titleText}" class="modal-project-image">

            <h3 class="modal-project-title">
                ${titleText}
            </h3>

            <div class="project-desc">
                ${descText}
            </div>

            <div class="project-tech">
                ${techText}
            </div>
        `;

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function Close Modal
    function closeProjectModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click Project Card
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });

    // Close Button
    closeModal.addEventListener('click', closeProjectModal);

    // Click Outside Modal
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    // ESC Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
});
