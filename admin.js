/* ==========================================================================
   TRIVARA Architecture & Design Studio — Admin Backoffice Logic (admin.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. AUTH GUARD & SESSION MANAGEMENT
    const loginScreen = document.getElementById('loginScreen');
    const dashboardLayout = document.getElementById('dashboardLayout');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    function checkAuth() {
        const isAuth = sessionStorage.getItem('trivara_admin_auth') === 'true';
        if (isAuth) {
            if (loginScreen) loginScreen.classList.add('hidden');
            if (dashboardLayout) dashboardLayout.classList.remove('hidden');
            initAdminDashboard();
        } else {
            if (loginScreen) loginScreen.classList.remove('hidden');
            if (dashboardLayout) dashboardLayout.classList.add('hidden');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('adminUsername').value.trim();
            const pass = document.getElementById('adminPassword').value.trim();

            // Default credentials: admin / trivara2026
            if (user === 'admin' && pass === 'trivara2026') {
                sessionStorage.setItem('trivara_admin_auth', 'true');
                // Used to authenticate save requests to /api/db — must match
                // the ADMIN_API_TOKEN environment variable set on Vercel.
                sessionStorage.setItem('trivara_admin_token', pass);
                if (loginError) loginError.style.display = 'none';
                checkAuth();
                showToast('Login berhasil! Selamat datang di Backoffice TRIVARA.');
            } else {
                if (loginError) loginError.style.display = 'block';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('trivara_admin_auth');
            sessionStorage.removeItem('trivara_admin_token');
            checkAuth();
        });
    }

    checkAuth();

    // Warn if a save didn't actually reach the server (e.g. wrong/missing
    // ADMIN_API_TOKEN, or the Upstash Redis integration isn't connected).
    window.addEventListener('trivara_db_save_error', () => {
        showToast('⚠️ Perubahan tersimpan di browser ini saja — GAGAL menyimpan ke server. Cek konfigurasi API.');
    });

    // 2. DASHBOARD TABS NAVIGATION
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTitle = document.getElementById('tabTitle');
    const tabDesc = document.getElementById('tabDesc');

    const tabMeta = {
        tabBranding: { title: "Branding & Logo Studio", desc: "Kelola nama studio, teks logo, warna aksen, dan navigasi" },
        tabHero: { title: "Hero Slides Banner", desc: "Kelola gambar utama, judul headline, dan tombol aksi beranda" },
        tabAbout: { title: "Profil & Angka Statistik", desc: "Kelola deskripsi studio, filosofi, dan angka pencapaian" },
        tabServices: { title: "Sub-Unit Layanan", desc: "Kelola sub-unit spesialisasi dan daftar fitur layanan" },
        tabPortfolio: { title: "Portofolio Karya", desc: "Kelola proyek arsitektur, foto HD, dan filter kategori" },
        tabPricing: { title: "Tarif & Kalkulator Estimasi", desc: "Kelola harga per m² dan rincian paket populer" },
        tabContact: { title: "Informasi Kontak & Sosmed", desc: "Kelola alamat studio, telepon, WhatsApp, dan sosial media" },
        tabInquiries: { title: "Inbox Pesan Konsultasi", desc: "Daftar pesan konsultasi proyek yang masuk dari calon klien" }
    };

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            item.classList.add('active');
            const targetTab = item.getAttribute('data-tab');
            const targetElem = document.getElementById(targetTab);
            if (targetElem) targetElem.classList.add('active');

            if (tabMeta[targetTab]) {
                if (tabTitle) tabTitle.textContent = tabMeta[targetTab].title;
                if (tabDesc) tabDesc.textContent = tabMeta[targetTab].desc;
            }
        });
    });

    // Reset DB Action
    const resetDbBtn = document.getElementById('resetDbBtn');
    if (resetDbBtn) {
        resetDbBtn.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin mengembalikan seluruh data ke pengaturan awal (Default)? Data baru akan terhapus.")) {
                DB.reset();
                initAdminDashboard();
                showToast("Seluruh data telah berhasil di-reset ke default!");
            }
        });
    }

    // 3. ADMIN DASHBOARD CONTENT LOADER & FORM HANDLERS
    function initAdminDashboard() {
        const db = DB.get();

        // A. Tab Branding
        const brandLogoText = document.getElementById('brandLogoText');
        const brandLogoMark = document.getElementById('brandLogoMark');
        const brandLogoSub = document.getElementById('brandLogoSub');
        const brandThemeColor = document.getElementById('brandThemeColor');
        const brandStudioTitle = document.getElementById('brandStudioTitle');
        const brandMetaDesc = document.getElementById('brandMetaDesc');

        if (brandLogoText && db.branding) {
            brandLogoText.value = db.branding.logoText || "TRIVARA";
            brandLogoMark.value = db.branding.logoMark || "T";
            brandLogoSub.value = db.branding.logoSub || "ARCHITECTURE & BUILD";
            brandThemeColor.value = db.branding.themeColor || "#c8a97e";
            brandStudioTitle.value = db.branding.studioTitle || "";
            brandMetaDesc.value = db.branding.studioMetaDesc || "";
        }

        // B. Tab Hero Slides Table
        renderHeroTable(db.heroSlides || []);

        // C. Tab About & Stats
        if (db.about && db.stats) {
            document.getElementById('aboutTitle').value = db.about.title || "";
            document.getElementById('aboutParagraph').value = db.about.paragraph || "";
            document.getElementById('aboutQuote').value = db.about.quote || "";

            document.getElementById('statYears').value = db.stats.experienceYears || 8;
            document.getElementById('statProjects').value = db.stats.completedProjects || 145;
            document.getElementById('statSatisfaction').value = db.stats.clientSatisfaction || 99;
            document.getElementById('statArea').value = db.stats.builtArea || 12;
        }

        // D. Tab Sub-Unit Services Table
        renderServicesTable(db.services || []);

        // E. Tab Portfolio Table
        renderPortfolioTable(db.portfolio || []);

        // F. Tab Pricing
        if (db.pricing) {
            document.getElementById('rateBasic').value = db.pricing.rates?.basic || 75000;
            document.getElementById('rateComplete').value = db.pricing.rates?.complete || 135000;
            document.getElementById('rateTurnkey').value = db.pricing.rates?.turnkey || 210000;

            document.getElementById('pkgTitle').value = db.pricing.packageTitle || "";
            document.getElementById('pkgBadge').value = db.pricing.packageBadge || "";
            document.getElementById('pkgDesc').value = db.pricing.packageDesc || "";
            document.getElementById('pkgFeatures').value = (db.pricing.features || []).join('\n');
        }

        // G. Tab Contact
        if (db.contact) {
            document.getElementById('contactAddress').value = db.contact.address || "";
            document.getElementById('contactPhones').value = db.contact.phones || "";
            document.getElementById('contactWaNumber').value = db.contact.waNumber || "";
            document.getElementById('contactEmails').value = db.contact.emails || "";
            document.getElementById('contactWorkingHours').value = db.contact.workingHours || "";
            document.getElementById('socialInstagram').value = db.contact.instagram || "";
            document.getElementById('socialYoutube').value = db.contact.youtube || "";
            document.getElementById('socialLinkedin').value = db.contact.linkedin || "";
        }

        // H. Tab Inquiries Table
        renderInquiriesTable(db.inquiries || []);
    }

    // FORM SAVE HANDLERS
    // 1. Save Branding
    const formBranding = document.getElementById('formBranding');
    if (formBranding) {
        formBranding.addEventListener('submit', (e) => {
            e.preventDefault();
            const db = DB.get();
            db.branding = {
                logoText: document.getElementById('brandLogoText').value,
                logoMark: document.getElementById('brandLogoMark').value,
                logoSub: document.getElementById('brandLogoSub').value,
                themeColor: document.getElementById('brandThemeColor').value,
                studioTitle: document.getElementById('brandStudioTitle').value,
                studioMetaDesc: document.getElementById('brandMetaDesc').value
            };
            DB.set(db);
            showToast('Pengaturan Branding & Logo berhasil disimpan!');
        });
    }

    // 2. Save About & Stats
    const formAbout = document.getElementById('formAbout');
    if (formAbout) {
        formAbout.addEventListener('submit', (e) => {
            e.preventDefault();
            const db = DB.get();
            db.about.title = document.getElementById('aboutTitle').value;
            db.about.paragraph = document.getElementById('aboutParagraph').value;
            db.about.quote = document.getElementById('aboutQuote').value;

            db.stats.experienceYears = parseInt(document.getElementById('statYears').value, 10);
            db.stats.completedProjects = parseInt(document.getElementById('statProjects').value, 10);
            db.stats.clientSatisfaction = parseInt(document.getElementById('statSatisfaction').value, 10);
            db.stats.builtArea = parseInt(document.getElementById('statArea').value, 10);

            DB.set(db);
            showToast('Profil & Angka Statistik berhasil disimpan!');
        });
    }

    // 3. Save Pricing
    const formPricing = document.getElementById('formPricing');
    if (formPricing) {
        formPricing.addEventListener('submit', (e) => {
            e.preventDefault();
            const db = DB.get();
            db.pricing.rates = {
                basic: parseInt(document.getElementById('rateBasic').value, 10),
                complete: parseInt(document.getElementById('rateComplete').value, 10),
                turnkey: parseInt(document.getElementById('rateTurnkey').value, 10)
            };
            db.pricing.packageTitle = document.getElementById('pkgTitle').value;
            db.pricing.packageBadge = document.getElementById('pkgBadge').value;
            db.pricing.packageDesc = document.getElementById('pkgDesc').value;
            db.pricing.features = document.getElementById('pkgFeatures').value.split('\n').map(f => f.trim()).filter(f => f);

            DB.set(db);
            showToast('Tarif & Paket Estimator berhasil disimpan!');
        });
    }

    // 4. Save Contact
    const formContact = document.getElementById('formContact');
    if (formContact) {
        formContact.addEventListener('submit', (e) => {
            e.preventDefault();
            const db = DB.get();
            db.contact = {
                address: document.getElementById('contactAddress').value,
                phones: document.getElementById('contactPhones').value,
                waNumber: document.getElementById('contactWaNumber').value,
                emails: document.getElementById('contactEmails').value,
                workingHours: document.getElementById('contactWorkingHours').value,
                instagram: document.getElementById('socialInstagram').value,
                youtube: document.getElementById('socialYoutube').value,
                linkedin: document.getElementById('socialLinkedin').value
            };
            DB.set(db);
            showToast('Informasi Kontak & Sosmed berhasil disimpan!');
        });
    }

    // 4. CRUD TABLES RENDERERS & MODAL HANDLERS
    const crudModal = document.getElementById('crudModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalFormContent = document.getElementById('modalFormContent');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const crudForm = document.getElementById('crudForm');
    let currentCrudAction = null;

    function openModal(title, htmlContent, onSave) {
        if (modalTitle) modalTitle.textContent = title;
        if (modalFormContent) modalFormContent.innerHTML = htmlContent;
        currentCrudAction = onSave;
        if (crudModal) crudModal.classList.add('active');
    }

    function closeModal() {
        if (crudModal) crudModal.classList.remove('active');
        currentCrudAction = null;
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);

    if (crudForm) {
        crudForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (currentCrudAction) {
                currentCrudAction();
                closeModal();
            }
        });
    }

    // HERO SLIDES CRUD
    function renderHeroTable(slides) {
        const tbody = document.querySelector('#tableHero tbody');
        if (!tbody) return;
        tbody.innerHTML = slides.map(slide => `
            <tr>
                <td><img src="${slide.bgImage}" class="table-thumb" alt="Thumb"></td>
                <td><span class="badge-count">${slide.badge}</span></td>
                <td><strong>${slide.title}</strong></td>
                <td>${slide.description.substring(0, 60)}...</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="editHeroSlide('${slide.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon btn-danger" onclick="deleteHeroSlide('${slide.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.editHeroSlide = function (slideId) {
        const db = DB.get();
        const slide = db.heroSlides.find(s => s.id === slideId);
        if (!slide) return;

        openModal("Edit Slide Hero", `
            <div class="form-group">
                <label>Badge Text</label>
                <input type="text" id="mHeroBadge" class="form-control" value="${slide.badge}" required>
            </div>
            <div class="form-group">
                <label>Judul Headline</label>
                <input type="text" id="mHeroTitle" class="form-control" value="${slide.title.replace(/"/g, '&quot;')}" required>
            </div>
            <div class="form-group">
                <label>Deskripsi Singkat</label>
                <textarea id="mHeroDesc" class="form-control" rows="3" required>${slide.description}</textarea>
            </div>
            <div class="form-group">
                <label>URL Gambar Latar HD</label>
                <input type="url" id="mHeroBg" class="form-control" value="${slide.bgImage}" required>
            </div>
        `, () => {
            slide.badge = document.getElementById('mHeroBadge').value;
            slide.title = document.getElementById('mHeroTitle').value;
            slide.description = document.getElementById('mHeroDesc').value;
            slide.bgImage = document.getElementById('mHeroBg').value;
            DB.set(db);
            renderHeroTable(db.heroSlides);
            showToast("Slide Hero berhasil diperbarui!");
        });
    };

    window.deleteHeroSlide = function (slideId) {
        const db = DB.get();
        if (db.heroSlides.length <= 1) {
            alert("Minimal harus ada 1 Slide Hero!");
            return;
        }
        if (confirm("Hapus slide hero ini?")) {
            db.heroSlides = db.heroSlides.filter(s => s.id !== slideId);
            DB.set(db);
            renderHeroTable(db.heroSlides);
            showToast("Slide Hero berhasil dihapus!");
        }
    };

    const addHeroBtn = document.getElementById('addHeroBtn');
    if (addHeroBtn) {
        addHeroBtn.addEventListener('click', () => {
            openModal("Tambah Slide Hero Baru", `
                <div class="form-group">
                    <label>Badge Text</label>
                    <input type="text" id="mHeroBadge" class="form-control" placeholder="Contoh: LUXURY DESIGN" required>
                </div>
                <div class="form-group">
                    <label>Judul Headline</label>
                    <input type="text" id="mHeroTitle" class="form-control" placeholder="Judul utama slide..." required>
                </div>
                <div class="form-group">
                    <label>Deskripsi Singkat</label>
                    <textarea id="mHeroDesc" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>URL Gambar Latar HD</label>
                    <input type="url" id="mHeroBg" class="form-control" placeholder="https://..." required>
                </div>
            `, () => {
                const db = DB.get();
                db.heroSlides.push({
                    id: 'slide-' + Date.now(),
                    badge: document.getElementById('mHeroBadge').value,
                    title: document.getElementById('mHeroTitle').value,
                    description: document.getElementById('mHeroDesc').value,
                    bgImage: document.getElementById('mHeroBg').value,
                    primaryBtnText: "Jelajahi Portofolio",
                    primaryBtnLink: "#portfolio",
                    secondaryBtnText: "Konsultasi",
                    secondaryBtnLink: "#contact"
                });
                DB.set(db);
                renderHeroTable(db.heroSlides);
                showToast("Slide Hero baru berhasil ditambahkan!");
            });
        });
    }

    // SUB-UNITS SERVICES CRUD
    function renderServicesTable(services) {
        const tbody = document.querySelector('#tableServices tbody');
        if (!tbody) return;
        tbody.innerHTML = services.map(service => `
            <tr>
                <td><span class="badge-count">${service.tag}</span></td>
                <td><i class="fa-solid ${service.icon} text-accent"></i></td>
                <td><strong>${service.title}</strong></td>
                <td>${service.text.substring(0, 50)}...</td>
                <td>${(service.features || []).join(', ')}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="editServiceUnit('${service.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon btn-danger" onclick="deleteServiceUnit('${service.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.editServiceUnit = function (serviceId) {
        const db = DB.get();
        const s = db.services.find(item => item.id === serviceId);
        if (!s) return;

        openModal("Edit Sub-Unit Layanan", `
            <div class="form-group">
                <label>Tag Sub-Unit</label>
                <input type="text" id="mServiceTag" class="form-control" value="${s.tag}" required>
            </div>
            <div class="form-group">
                <label>Nama Sub-Unit</label>
                <input type="text" id="mServiceTitle" class="form-control" value="${s.title}" required>
            </div>
            <div class="form-group">
                <label>Ikon FontAwesome (Misal: fa-compass-drafting, fa-helmet-safety)</label>
                <input type="text" id="mServiceIcon" class="form-control" value="${s.icon}" required>
            </div>
            <div class="form-group">
                <label>Deskripsi Layanan</label>
                <textarea id="mServiceText" class="form-control" rows="3" required>${s.text}</textarea>
            </div>
            <div class="form-group">
                <label>Daftar Fitur (Pisahkan dengan baris baru / Enter)</label>
                <textarea id="mServiceFeatures" class="form-control" rows="3" required>${(s.features || []).join('\n')}</textarea>
            </div>
        `, () => {
            s.tag = document.getElementById('mServiceTag').value;
            s.title = document.getElementById('mServiceTitle').value;
            s.icon = document.getElementById('mServiceIcon').value;
            s.text = document.getElementById('mServiceText').value;
            s.features = document.getElementById('mServiceFeatures').value.split('\n').map(f => f.trim()).filter(f => f);
            DB.set(db);
            renderServicesTable(db.services);
            showToast("Sub-Unit Layanan berhasil diperbarui!");
        });
    };

    window.deleteServiceUnit = function (serviceId) {
        const db = DB.get();
        if (confirm("Hapus Sub-Unit Layanan ini?")) {
            db.services = db.services.filter(s => s.id !== serviceId);
            DB.set(db);
            renderServicesTable(db.services);
            showToast("Sub-Unit Layanan berhasil dihapus!");
        }
    };

    const addServiceBtn = document.getElementById('addServiceBtn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            openModal("Tambah Sub-Unit Layanan Baru", `
                <div class="form-group">
                    <label>Tag Sub-Unit</label>
                    <input type="text" id="mServiceTag" class="form-control" placeholder="SUB-UNIT 03" required>
                </div>
                <div class="form-group">
                    <label>Nama Sub-Unit</label>
                    <input type="text" id="mServiceTitle" class="form-control" placeholder="TRIVARA Interiors" required>
                </div>
                <div class="form-group">
                    <label>Ikon FontAwesome (Misal: fa-couch, fa-ruler-combined)</label>
                    <input type="text" id="mServiceIcon" class="form-control" value="fa-compass-drafting" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi Layanan</label>
                    <textarea id="mServiceText" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Daftar Fitur (Pisahkan dengan baris baru / Enter)</label>
                    <textarea id="mServiceFeatures" class="form-control" rows="3" required></textarea>
                </div>
            `, () => {
                const db = DB.get();
                db.services.push({
                    id: 'unit-' + Date.now(),
                    tag: document.getElementById('mServiceTag').value,
                    title: document.getElementById('mServiceTitle').value,
                    icon: document.getElementById('mServiceIcon').value,
                    text: document.getElementById('mServiceText').value,
                    features: document.getElementById('mServiceFeatures').value.split('\n').map(f => f.trim()).filter(f => f),
                    linkText: "Konsultasi",
                    linkUrl: "#contact"
                });
                DB.set(db);
                renderServicesTable(db.services);
                showToast("Sub-Unit Layanan baru berhasil ditambahkan!");
            });
        });
    }

    // PORTFOLIO CRUD
    function renderPortfolioTable(projects) {
        const tbody = document.querySelector('#tablePortfolio tbody');
        if (!tbody) return;
        tbody.innerHTML = projects.map(p => `
            <tr>
                <td><img src="${p.image}" class="table-thumb" alt="Project"></td>
                <td><strong>${p.title}</strong></td>
                <td><span class="badge-count">${p.categoryLabel || p.category}</span></td>
                <td>${p.subtitle}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="editPortfolioProject('${p.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon btn-danger" onclick="deletePortfolioProject('${p.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.editPortfolioProject = function (portId) {
        const db = DB.get();
        const p = db.portfolio.find(item => item.id === portId);
        if (!p) return;

        openModal("Edit Proyek Portofolio", `
            <div class="form-group">
                <label>Judul Proyek</label>
                <input type="text" id="mPortTitle" class="form-control" value="${p.title}" required>
            </div>
            <div class="form-group">
                <label>Kategori Filter</label>
                <select id="mPortCategory" class="form-control">
                    <option value="architecture" ${p.category === 'architecture' ? 'selected' : ''}>Arsitektur Hunian</option>
                    <option value="commercial" ${p.category === 'commercial' ? 'selected' : ''}>Komersial & Resto</option>
                    <option value="landscape" ${p.category === 'landscape' ? 'selected' : ''}>Villa & Lanskap</option>
                    <option value="interior" ${p.category === 'interior' ? 'selected' : ''}>Interior Kustom</option>
                </select>
            </div>
            <div class="form-group">
                <label>Sub-title / Keterangan Singkat</label>
                <input type="text" id="mPortSub" class="form-control" value="${p.subtitle}" required>
            </div>
            <div class="form-group">
                <label>Lokasi Proyek</label>
                <input type="text" id="mPortLoc" class="form-control" value="${p.location || ''}" required>
            </div>
            <div class="form-group">
                <label>URL Foto Proyek HD</label>
                <input type="url" id="mPortImg" class="form-control" value="${p.image}" required>
            </div>
        `, () => {
            const catSelect = document.getElementById('mPortCategory');
            p.title = document.getElementById('mPortTitle').value;
            p.category = catSelect.value;
            p.categoryLabel = catSelect.options[catSelect.selectedIndex].text;
            p.subtitle = document.getElementById('mPortSub').value;
            p.location = document.getElementById('mPortLoc').value;
            p.image = document.getElementById('mPortImg').value;
            DB.set(db);
            renderPortfolioTable(db.portfolio);
            showToast("Proyek Portofolio berhasil diperbarui!");
        });
    };

    window.deletePortfolioProject = function (portId) {
        const db = DB.get();
        if (confirm("Hapus proyek portofolio ini?")) {
            db.portfolio = db.portfolio.filter(p => p.id !== portId);
            DB.set(db);
            renderPortfolioTable(db.portfolio);
            showToast("Proyek Portofolio berhasil dihapus!");
        }
    };

    const addPortBtn = document.getElementById('addPortBtn');
    if (addPortBtn) {
        addPortBtn.addEventListener('click', () => {
            openModal("Tambah Proyek Portofolio Baru", `
                <div class="form-group">
                    <label>Judul Proyek</label>
                    <input type="text" id="mPortTitle" class="form-control" placeholder="Contoh: Modern Glass Villa" required>
                </div>
                <div class="form-group">
                    <label>Kategori Filter</label>
                    <select id="mPortCategory" class="form-control">
                        <option value="architecture">Arsitektur Hunian</option>
                        <option value="commercial">Komersial & Resto</option>
                        <option value="landscape">Villa & Lanskap</option>
                        <option value="interior">Interior Kustom</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Sub-title / Keterangan Singkat</label>
                    <input type="text" id="mPortSub" class="form-control" placeholder="Jakarta — Arsitektur & Structure" required>
                </div>
                <div class="form-group">
                    <label>Lokasi Proyek</label>
                    <input type="text" id="mPortLoc" class="form-control" placeholder="Jakarta Selatan" required>
                </div>
                <div class="form-group">
                    <label>URL Foto Proyek HD</label>
                    <input type="url" id="mPortImg" class="form-control" placeholder="https://..." required>
                </div>
            `, () => {
                const db = DB.get();
                const catSelect = document.getElementById('mPortCategory');
                db.portfolio.push({
                    id: 'port-' + Date.now(),
                    title: document.getElementById('mPortTitle').value,
                    category: catSelect.value,
                    categoryLabel: catSelect.options[catSelect.selectedIndex].text,
                    subtitle: document.getElementById('mPortSub').value,
                    location: document.getElementById('mPortLoc').value,
                    image: document.getElementById('mPortImg').value
                });
                DB.set(db);
                renderPortfolioTable(db.portfolio);
                showToast("Proyek Portofolio baru berhasil ditambahkan!");
            });
        });
    }

    // INQUIRIES CLIENT MESSAGES TABLE
    function renderInquiriesTable(inquiries) {
        const tbody = document.querySelector('#tableInquiries tbody');
        const unreadBadge = document.getElementById('unreadBadge');
        if (!tbody) return;

        const unreadCount = inquiries.filter(i => i.status === 'unread').length;
        if (unreadBadge) unreadBadge.textContent = unreadCount;

        tbody.innerHTML = inquiries.map(inq => `
            <tr style="${inq.status === 'unread' ? 'background: rgba(200, 169, 126, 0.06);' : ''}">
                <td><small>${inq.date}</small></td>
                <td><strong>${inq.name}</strong></td>
                <td>${inq.phone}</td>
                <td>${inq.city || '-'}</td>
                <td><span class="badge-count">${inq.serviceType}</span></td>
                <td>${inq.message}</td>
                <td>
                    <div class="table-actions">
                        <a href="https://wa.me/${(inq.phone || '').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(inq.name)},%20kami%20dari%20TRIVARA%20Studio..." target="_blank" class="btn-icon" title="Chat WA Direct"><i class="fa-brands fa-whatsapp text-accent"></i></a>
                        <button class="btn-icon btn-danger" onclick="deleteInquiry('${inq.id}')" title="Hapus Pesan"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.deleteInquiry = function (inqId) {
        const db = DB.get();
        if (confirm("Hapus pesan ini dari inbox?")) {
            db.inquiries = db.inquiries.filter(i => i.id !== inqId);
            DB.set(db);
            renderInquiriesTable(db.inquiries);
            showToast("Pesan berhasil dihapus!");
        }
    };

    // TOAST UTILITY
    function showToast(message) {
        const toast = document.getElementById('adminToast');
        const toastMsg = document.getElementById('toastMsg');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('active');
            setTimeout(() => toast.classList.remove('active'), 3500);
        }
    }
});
