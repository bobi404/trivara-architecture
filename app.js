/* ==========================================================================
   TRIVARA Architecture & Design Studio — Application Logic (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Navigation, Mobile Toggle, & Dynamic ScrollSpy
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const navBackdrop = document.getElementById('navBackdrop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle Mobile Navigation Function
    function toggleMobileMenu(forceClose = false) {
        if (!mainNav) return;
        const isOpen = mainNav.classList.contains('active');

        if (forceClose || isOpen) {
            mainNav.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (navBackdrop) navBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mainNav.classList.add('active');
            if (mobileToggle) mobileToggle.classList.add('active');
            if (navBackdrop) navBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => toggleMobileMenu());
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', () => toggleMobileMenu(true));
    }

    // ScrollSpy: Garis bawah navbar otomatis mengikuti seksi yang sedang aktif
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 180; // offset untuk navbar melayang

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Navbar ScrollSpy update
        updateActiveNavLink();
    });

    // Run ScrollSpy once on load
    updateActiveNavLink();

    // Smooth click nav link handling
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            toggleMobileMenu(true);
        });
    });

    // Theme Toggle (Dark / Light)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }

    // 2. Hero Carousel Slider
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-indicators .dot');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (slides.length > 0) {
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetSlideTimer();
            });
        });

        if (heroNext) heroNext.addEventListener('click', () => { nextSlide(); resetSlideTimer(); });
        if (heroPrev) heroPrev.addEventListener('click', () => { prevSlide(); resetSlideTimer(); });

        function startSlideTimer() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        startSlideTimer();
    }

    // 3. Stats Counter Animation on Scroll
    const statNums = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    function animateStats() {
        statNums.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const speed = target / 50;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    stat.innerText = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    }

    const statsSection = document.querySelector('.hero-stats-bar');
    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    } else {
        animateStats();
    }

    // 4. Portfolio Filter & Lightbox
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxSub = document.getElementById('lightboxSub');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox triggers
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-img');
            const title = card.getAttribute('data-title');
            const sub = card.getAttribute('data-sub');

            if (lightboxImg && lightboxModal) {
                lightboxImg.src = imgSrc;
                lightboxTitle.textContent = title;
                lightboxSub.textContent = sub;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('active'));
    }
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', () => lightboxModal.classList.remove('active'));
    }

    // 5. Accordion Items Toggle
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close siblings
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 6. Interactive Pricing & Project Cost Estimator Calculator
    const buildingAreaInput = document.getElementById('buildingArea');
    const areaValueDisplay = document.getElementById('areaValue');
    const totalEstimateDisplay = document.getElementById('totalEstimate');
    const packageRadios = document.querySelectorAll('input[name="packageType"]');
    const packageRadioLabels = document.querySelectorAll('.package-radio');

    const rates = {
        basic: 75000,
        complete: 135000,
        turnkey: 210000
    };

    function updatePriceEstimate() {
        if (!buildingAreaInput) return;

        const area = parseInt(buildingAreaInput.value, 10);
        let selectedRate = rates.complete;

        packageRadios.forEach(radio => {
            if (radio.checked) {
                selectedRate = rates[radio.value] || rates.complete;
            }
        });

        const totalCost = area * selectedRate;

        if (areaValueDisplay) {
            areaValueDisplay.innerText = `${area} m²`;
        }

        if (totalEstimateDisplay) {
            totalEstimateDisplay.innerText = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(totalCost);
        }
    }

    if (buildingAreaInput) {
        buildingAreaInput.addEventListener('input', updatePriceEstimate);
        packageRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                packageRadioLabels.forEach(label => label.classList.remove('active'));
                radio.closest('.package-radio').classList.add('active');
                updatePriceEstimate();
            });
        });
        updatePriceEstimate();
    }

    // 7. Contact Form & WhatsApp Handler
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const city = document.getElementById('projectCity').value;
            const type = document.getElementById('projectType').value;
            const message = document.getElementById('projectMessage').value;

            const waText = `Halo Studio TRIVARA Architecture,%0A%0ASaya ingin berkonsultasi mengenai proyek arsitektur:%0A- *Nama*: ${encodeURIComponent(name)}%0A- *No. Telepon*: ${encodeURIComponent(phone)}%0A- *Kota*: ${encodeURIComponent(city)}%0A- *Layanan Proyek*: ${encodeURIComponent(type)}%0A- *Catatan Proyek*: ${encodeURIComponent(message)}%0A%0AMohon info jadwal diskusi dan survei lokasi. Terima kasih!`;

            window.open(`https://wa.me/6281288997700?text=${waText}`, '_blank');
        });
    }
});
