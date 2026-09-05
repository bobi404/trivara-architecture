/* ==========================================================================
   TRIVARA Architecture & Design Studio — Application Logic & Dynamic Renderer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DYNAMIC RENDER ENGINE FROM DB
    function renderPublicSite() {
        if (typeof DB === 'undefined') return;
        const db = DB.get();

        // 1. Branding & Logo
        if (db.branding) {
            document.title = db.branding.studioTitle || "TRIVARA — Architecture Studio";
            document.querySelectorAll('.logo-mark').forEach(el => el.textContent = db.branding.logoMark || "T");
            document.querySelectorAll('.brand-name').forEach(el => el.textContent = db.branding.logoText || "TRIVARA");
            document.querySelectorAll('.brand-sub').forEach(el => el.textContent = db.branding.logoSub || "ARCHITECTURE & BUILD");
            if (db.branding.themeColor) {
                document.documentElement.style.setProperty('--accent-gold', db.branding.themeColor);
            }
        }

        // 2. Hero Slides Slider
        if (db.heroSlides && db.heroSlides.length > 0) {
            const heroSlider = document.querySelector('.hero-slider');
            const sliderIndicators = document.querySelector('.slider-indicators');
            if (heroSlider) {
                heroSlider.innerHTML = db.heroSlides.map((slide, idx) => `
                    <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: linear-gradient(to bottom, rgba(15, 16, 18, 0.4), rgba(15, 16, 18, 0.9)), url('${slide.bgImage}');">
                        <div class="container hero-content">
                            <div class="hero-badge">${slide.badge}</div>
                            <h1 class="hero-title">${slide.title}</h1>
                            <p class="hero-desc">${slide.description}</p>
                            <div class="hero-cta-group">
                                <a href="${slide.primaryBtnLink || '#portfolio'}" class="btn btn-primary btn-lg">${slide.primaryBtnText || 'Jelajahi Portofolio'}</a>
                                <a href="${slide.secondaryBtnLink || '#pricing'}" class="btn btn-secondary btn-lg">${slide.secondaryBtnText || 'Hitung Biaya'}</a>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            if (sliderIndicators) {
                sliderIndicators.innerHTML = db.heroSlides.map((_, idx) => `
                    <span class="dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>
                `).join('');
            }
            initHeroSlider();
        }

        // 3. Stats Targets
        if (db.stats) {
            const statNums = document.querySelectorAll('.stat-num');
            if (statNums.length >= 4) {
                statNums[0].setAttribute('data-target', db.stats.experienceYears || 8);
                statNums[1].setAttribute('data-target', db.stats.completedProjects || 145);
                statNums[2].setAttribute('data-target', db.stats.clientSatisfaction || 99);
                statNums[3].setAttribute('data-target', db.stats.builtArea || 12);
            }
        }

        // 4. About Section
        if (db.about) {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                const titleElem = aboutSection.querySelector('.section-title');
                const paraElem = aboutSection.querySelector('.about-paragraph');
                const philoElem = aboutSection.querySelector('.philo-text');
                if (titleElem) titleElem.textContent = db.about.title;
                if (paraElem) paraElem.textContent = db.about.paragraph;
                if (philoElem) philoElem.textContent = `"${db.about.quote}"`;

                if (db.about.characteristics && db.about.characteristics.length > 0) {
                    const accGroup = aboutSection.querySelector('.accordion-group');
                    if (accGroup) {
                        accGroup.innerHTML = `
                            <h3 class="accordion-title">Karakteristik Kunci TRIVARA</h3>
                            ${db.about.characteristics.map((char, idx) => `
                                <div class="accordion-item ${idx === 0 ? 'active' : ''}">
                                    <button class="accordion-header">
                                        <span><i class="fa-solid ${char.icon}"></i> ${char.title}</span>
                                        <i class="fa-solid fa-chevron-down acc-icon"></i>
                                    </button>
                                    <div class="accordion-content">
                                        <p>${char.content}</p>
                                    </div>
                                </div>
                            `).join('')}
                        `;
                        initAccordions();
                    }
                }
            }
        }

        // 5. Sub-Units Services Grid
        if (db.services && db.services.length > 0) {
            const servicesGrid = document.querySelector('.services-grid');
            if (servicesGrid) {
                servicesGrid.innerHTML = db.services.map(s => `
                    <div class="service-card glass-card">
                        <div class="service-icon">
                            <i class="fa-solid ${s.icon}"></i>
                        </div>
                        <div class="service-tag">${s.tag}</div>
                        <h3 class="service-title">${s.title}</h3>
                        <p class="service-text">${s.text}</p>
                        <ul class="service-features">
                            ${(s.features || []).map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
                        </ul>
                        <a href="${s.linkUrl || '#contact'}" class="service-link">${s.linkText || 'Konsultasi'} <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                `).join('');
            }
        }

        // 6. Portfolio Showcase
        if (db.portfolio && db.portfolio.length > 0) {
            const portfolioGrid = document.getElementById('portfolioGrid');
            if (portfolioGrid) {
                portfolioGrid.innerHTML = db.portfolio.map(p => `
                    <div class="portfolio-card" data-category="${p.category}" data-img="${p.image}" data-title="${p.title}" data-sub="${p.subtitle}">
                        <img src="${p.image}" alt="${p.title}" class="port-img">
                        <div class="port-overlay">
                            <span class="port-cat">${p.categoryLabel || p.category}</span>
                            <h3 class="port-title">${p.title}</h3>
                            <p class="port-loc"><i class="fa-solid fa-location-dot"></i> ${p.location || ''}</p>
                            <button class="port-zoom-btn"><i class="fa-solid fa-expand"></i> Lihat Detail Proyek</button>
                        </div>
                    </div>
                `).join('');
                initPortfolioListeners();
            }
        }

        // 7. Pricing & Tariff Estimator
        if (db.pricing) {
            const pkgCard = document.querySelector('.package-card');
            if (pkgCard) {
                const titleEl = pkgCard.querySelector('.pkg-title');
                const badgeEl = pkgCard.querySelector('.pkg-badge');
                const priceEl = pkgCard.querySelector('.pkg-price');
                const descEl = pkgCard.querySelector('.pkg-desc');
                const featEl = pkgCard.querySelector('.pkg-features');

                if (titleEl) titleEl.textContent = db.pricing.packageTitle;
                if (badgeEl) badgeEl.textContent = db.pricing.packageBadge;
                if (priceEl) priceEl.innerHTML = `${db.pricing.packagePriceLabel || 'Rp 135k'} <span>${db.pricing.packagePriceSub || '/ m²'}</span>`;
                if (descEl) descEl.textContent = db.pricing.packageDesc;
                if (featEl) featEl.innerHTML = (db.pricing.features || []).map(f => `<li><i class="fa-solid fa-check text-accent"></i> ${f}</li>`).join('');
            }
            updatePriceEstimate();
        }

        // 8. Contact Info
        if (db.contact) {
            const contactItems = document.querySelectorAll('.contact-item');
            if (contactItems.length >= 4) {
                contactItems[0].querySelector('p').textContent = db.contact.address;
                contactItems[1].querySelector('p').textContent = db.contact.phones;
                contactItems[2].querySelector('p').textContent = db.contact.emails;
                contactItems[3].querySelector('p').textContent = db.contact.workingHours;
            }
            const waBtn = document.querySelector('.social-btn.wa-btn');
            if (waBtn && db.contact.waNumber) {
                waBtn.href = `https://wa.me/${db.contact.waNumber}`;
            }
        }
    }

    // Listen for live database updates (same-tab, e.g. after a form submit on this page)
    window.addEventListener('trivara_db_updated', renderPublicSite);

    // Listen for updates coming from OTHER tabs/windows (e.g. admin.html saving changes).
    // The native 'storage' event only fires in tabs OTHER than the one that made the change,
    // which is exactly what we need for admin -> public page live sync.
    window.addEventListener('storage', (e) => {
        if (e.key === 'trivara_db') {
            renderPublicSite();
        }
    });

    renderPublicSite();

    // 1. Header Navigation, Mobile Toggle, & Dynamic ScrollSpy
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const navBackdrop = document.getElementById('navBackdrop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

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

    if (mobileToggle) mobileToggle.addEventListener('click', () => toggleMobileMenu());
    if (navBackdrop) navBackdrop.addEventListener('click', () => toggleMobileMenu(true));

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 180;
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
        if (window.scrollY > 40) {
            if (header) header.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    updateActiveNavLink();

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
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

    // HERO SLIDER LOGIC
    let currentSlide = 0;
    let slideInterval;

    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-indicators .dot');
        const heroPrev = document.getElementById('heroPrev');
        const heroNext = document.getElementById('heroNext');

        if (slides.length === 0) return;

        function goToSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;
            if (slides[currentSlide]) slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetSlideTimer();
            });
        });

        if (heroNext) heroNext.addEventListener('click', () => { nextSlide(); resetSlideTimer(); });
        if (heroPrev) heroPrev.addEventListener('click', () => { prevSlide(); resetSlideTimer(); });

        function startSlideTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        startSlideTimer();
    }

    // STATS COUNTER ANIMATION
    let statsAnimated = false;
    function animateStats() {
        const statNums = document.querySelectorAll('.stat-num');
        statNums.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
            let count = 0;
            const speed = Math.max(1, target / 50);

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

    // PORTFOLIO FILTER & LIGHTBOX LISTENERS
    function initPortfolioListeners() {
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

        if (lightboxClose) lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('active'));
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', () => lightboxModal.classList.remove('active'));
    }

    // ACCORDION HANDLERS
    function initAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');

                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // PRICING CALCULATOR
    const buildingAreaInput = document.getElementById('buildingArea');
    const areaValueDisplay = document.getElementById('areaValue');
    const totalEstimateDisplay = document.getElementById('totalEstimate');
    const packageRadios = document.querySelectorAll('input[name="packageType"]');
    const packageRadioLabels = document.querySelectorAll('.package-radio');

    function updatePriceEstimate() {
        if (!buildingAreaInput) return;
        const db = typeof DB !== 'undefined' ? DB.get() : null;
        const rates = db?.pricing?.rates || { basic: 75000, complete: 135000, turnkey: 210000 };

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

    // CONTACT FORM & WHATSAPP / INBOX STORE HANDLER
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const city = document.getElementById('projectCity').value;
            const type = document.getElementById('projectType').value;
            const message = document.getElementById('projectMessage').value;

            // Save inquiry to Backoffice Inbox DB
            if (typeof DB !== 'undefined') {
                const db = DB.get();
                if (!db.inquiries) db.inquiries = [];
                const now = new Date();
                const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

                db.inquiries.unshift({
                    id: 'inq-' + Date.now(),
                    date: dateStr,
                    name: name,
                    phone: phone,
                    city: city,
                    serviceType: type,
                    message: message,
                    status: 'unread'
                });
                DB.set(db);
            }

            const dbContact = typeof DB !== 'undefined' ? DB.get().contact : null;
            const targetWa = dbContact?.waNumber || "6281288997700";

            const waText = `Halo Studio TRIVARA Architecture,%0A%0ASaya ingin berkonsultasi mengenai proyek arsitektur:%0A- *Nama*: ${encodeURIComponent(name)}%0A- *No. Telepon*: ${encodeURIComponent(phone)}%0A- *Kota*: ${encodeURIComponent(city)}%0A- *Layanan Proyek*: ${encodeURIComponent(type)}%0A- *Catatan Proyek*: ${encodeURIComponent(message)}%0A%0AMohon info jadwal diskusi dan survei lokasi. Terima kasih!`;

            window.open(`https://wa.me/${targetWa}?text=${waText}`, '_blank');
        });
    }
});
