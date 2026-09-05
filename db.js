/* ==========================================================================
   TRIVARA Architecture & Design Studio — JSON Data Store & DB Engine (db.js)
   ========================================================================== */

const TRIVARA_DEFAULT_DATA = {
    branding: {
        logoText: "TRIVARA",
        logoMark: "T",
        logoSub: "ARCHITECTURE & BUILD",
        studioTitle: "TRIVARA — Architecture & Construction Studio",
        studioMetaDesc: "TRIVARA Studio Arsitektur & Konstruksi Modern. Layanan Desain Rumah Luxury, Kontraktor Bangunan, Masterplan & Visualisasi 3D.",
        themeColor: "#c8a97e"
    },
    navLinks: [
        { id: "hero", label: "Beranda", url: "#hero", active: true },
        { id: "about", label: "Tentang Kami", url: "#about", active: true },
        { id: "services", label: "Sub-Unit Layanan", url: "#services", active: true },
        { id: "portfolio", label: "Portofolio", url: "#portfolio", active: true },
        { id: "pricing", label: "Estimator Biaya", url: "#pricing", active: true }
    ],
    heroSlides: [
        {
            id: "slide-1",
            badge: "TRIVARA ARCHITECTURAL STUDIO",
            title: "Refining Spaces.<br><span class=\"text-accent\">Elevating Living.</span>",
            description: "Studio perancangan arsitektur dan kontraktor luxury yang menggabungkan estetika ultra-clean, efisiensi struktur, dan kecerdasan fungsional ruangan.",
            primaryBtnText: "Jelajahi Portofolio Proyek",
            primaryBtnLink: "#portfolio",
            secondaryBtnText: "Hitung Estimasi Biaya",
            secondaryBtnLink: "#pricing",
            bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85"
        },
        {
            id: "slide-2",
            badge: "ARCHITECTURAL DESIGN & MASTERPLANNING",
            title: "Harmoni Bentuk,<br><span class=\"text-accent\">Fungsi & Material.</span>",
            description: "Kami menghadirkan ruang yang tidak sekadar indah dipandang, namun memberikan kenyamanan termal, pencahayaan alami optimal, dan daya tahan jangka panjang.",
            primaryBtnText: "Lihat Karya Arsitektur",
            primaryBtnLink: "#portfolio",
            secondaryBtnText: "Diskusi dengan Arsitek",
            secondaryBtnLink: "#contact",
            bgImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85"
        },
        {
            id: "slide-3",
            badge: "TURNKEY BUILD & CONTRACTOR",
            title: "Presisi Konstruksi,<br><span class=\"text-accent\">Garansi Mutu Bangunan.</span>",
            description: "Layanan pelaksanaan fisik terpadu dengan transparansi anggaran RAB, pengawasan ketat ahli arsitek, dan penyelesaian tepat waktu.",
            primaryBtnText: "Lihat Layanan Utama",
            primaryBtnLink: "#services",
            secondaryBtnText: "Kalkulator Biaya Proyek",
            secondaryBtnLink: "#pricing",
            bgImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1920&q=85"
        }
    ],
    stats: {
        experienceYears: 8,
        completedProjects: 145,
        clientSatisfaction: 99,
        builtArea: 12
    },
    about: {
        subtitle: "TENTANG TRIVARA STUDIO",
        title: "Dedikasi dalam Menghadirkan Arsitektur Berkelanjutan",
        paragraph: "TRIVARA lahir dari visi untuk mendefinisikan ulang standar arsitektur hunian dan komersial di Indonesia. Kami percaya bahwa desain yang baik adalah kombinasi antara kemurnian bentuk (purity of form), efisiensi ruang, dan integrasi lanskap sekitar.",
        quote: "Kami tidak sekadar menggambar cetak biru, melainkan merajut gaya hidup, pencahayaan alami, dan keindahan struktur menjadi ruang tempat tinggal bermakna.",
        characteristics: [
            {
                id: "char-1",
                icon: "fa-shield-halved",
                title: "Transparansi & Kepercayaan",
                content: "Seluruh proses perencanaan, estimasi biaya RAB, dan pemilihan spesifikasi material disampaikan secara transparan tanpa ada biaya tersembunyi."
            },
            {
                id: "char-2",
                icon: "fa-award",
                title: "Keunggulan Visual & Teknis",
                content: "Setiap cetak biru diuji ketahanannya melalui perhitungan struktur presisi dan visualisasi 3D photorealistic agar hasil jadi sesuai ekspektasi 100%."
            },
            {
                id: "char-3",
                icon: "fa-handshake",
                title: "Komitmen Garansi Pembangunan",
                content: "Kami memberikan garansi masa pemeliharaan struktur dan finishing bangunan setelah serah terima kunci untuk memberikan rasa aman penuh."
            }
        ]
    },
    services: [
        {
            id: "unit-1",
            tag: "SUB-UNIT 01",
            title: "TRIVARA Architecture",
            icon: "fa-compass-drafting",
            text: "Perancangan arsitektur hunian privat, villa, komersial & masterplan dengan filosofi bentuk modern, pencahayaan alami, dan sirkulasi ideal.",
            features: [
                "Konsep Schematic Design",
                "Gambar Kerja Teknis (DED)",
                "3D Photorealistic Render"
            ],
            linkText: "Konsultasi Desain",
            linkUrl: "#contact"
        },
        {
            id: "unit-2",
            tag: "SUB-UNIT 02",
            title: "TRIVARA Build",
            icon: "fa-helmet-safety",
            text: "Jasa pelaksanaan konstruksi & kontraktor fisik terpadu. Pengawasan ketat oleh site engineer berpengalaman dan garansi pemeliharaan.",
            features: [
                "Pembangunan dari Nol",
                "Renovasi Total & Struktur",
                "Pengawasan Berkala & QC"
            ],
            linkText: "Konsultasi Kontraktor",
            linkUrl: "#contact"
        }
    ],
    portfolio: [
        {
            id: "port-1",
            category: "architecture",
            title: "Modern Tropical Cliff Villa",
            subtitle: "Seminyak, Bali — Arsitektur & Landscape",
            location: "Bali, Indonesia",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
            categoryLabel: "Arsitektur Hunian"
        },
        {
            id: "port-2",
            category: "architecture",
            title: "Monochrome Concrete Residence",
            subtitle: "Bandung, Jawa Barat — Arsitektur & Kontraktor",
            location: "Bandung",
            image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
            categoryLabel: "Arsitektur Hunian"
        },
        {
            id: "port-3",
            category: "commercial",
            title: "Komorebi Artisan Cafe & Lounge",
            subtitle: "Surabaya — Commercial Architecture",
            location: "Surabaya",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
            categoryLabel: "Komersial & Resto"
        },
        {
            id: "port-4",
            category: "landscape",
            title: "Ubud Sanctuary Hill Estate",
            subtitle: "Ubud — Masterplan & Villa Complex",
            location: "Ubud, Bali",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
            categoryLabel: "Villa & Lanskap"
        }
    ],
    pricing: {
        rates: {
            basic: 75000,
            complete: 135000,
            turnkey: 210000
        },
        packageTitle: "Paket Eksklusif 3D + DED",
        packageBadge: "POPULER",
        packagePriceLabel: "Rp 135k",
        packagePriceSub: "/ m²",
        packageDesc: "Sangat cocok untuk pembangunan rumah tinggal pribadi modern yang membutuhkan ketelitian gambar kerja teknis.",
        features: [
            "Konsep Denah Layout 2D",
            "3D Render Photorealistic Exterior",
            "Gambar Kerja Arsitektur (DED Lengkap)",
            "Rencana MEP (Listrik, Air & Sanitasi)",
            "Revisi hingga 3x Tahapan",
            "Konsultasi Langsung Arsitek"
        ]
    },
    contact: {
        address: "Jl. Utama Boulevard No. 88, Studio Tower Lt. 4, Jakarta Selatan",
        phones: "+62 812-8899-7700 / +62 811-3344-5566",
        emails: "hello@trivara.design / project@trivara.design",
        workingHours: "Senin – Sabtu: 08:30 – 17:30 WIB",
        waNumber: "6281288997700",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        linkedin: "https://linkedin.com"
    },
    inquiries: [
        {
            id: "inq-1",
            date: "2026-09-02 14:20",
            name: "Hendra Wijaya",
            phone: "081298765432",
            city: "Jakarta Selatan",
            serviceType: "Desain Arsitektur Rumah Tinggal",
            message: "Saya berencana membangun rumah tinggal 2 lantai dengan luas tanah 200m2. Mohon info estimasi dan jadwal konsultasi.",
            status: "unread"
        }
    ]
};

/* ==========================================================================
   Database Engine
   ----------------------------------------------------------------------
   Public API stays exactly the same as before (DB.get() / DB.set() / DB.reset(),
   all synchronous) so admin.js and app.js don't need to change.

   Under the hood:
   - localStorage is now just a fast local CACHE, not the source of truth.
   - The real source of truth is the server (/api/db -> Upstash Redis),
     shared by every visitor and device.
   - On page load, DB.syncFromServer() fetches the latest data and, once it
     arrives, updates the cache and fires 'trivara_db_updated' so the page
     re-renders with fresh data.
   - DB.set()/DB.reset() update the local cache immediately (instant UI
     feedback) and push the change to the server in the background.
   ========================================================================== */

const DB_STORAGE_KEY = 'trivara_db';
const DB_API_URL = '/api/db';

let _dbCache = null;

function loadLocalCache() {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) return TRIVARA_DEFAULT_DATA;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse cached trivara_db, using default', e);
        return TRIVARA_DEFAULT_DATA;
    }
}

_dbCache = loadLocalCache();

const DB = {
    get() {
        return _dbCache;
    },
    set(data) {
        _dbCache = data;
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('trivara_db_updated'));
        this._pushToServer(data);
    },
    reset() {
        _dbCache = TRIVARA_DEFAULT_DATA;
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(TRIVARA_DEFAULT_DATA));
        window.dispatchEvent(new Event('trivara_db_updated'));
        this._pushToServer(TRIVARA_DEFAULT_DATA);
        return TRIVARA_DEFAULT_DATA;
    },

    // Push local data to the server. Fire-and-forget from callers' point of
    // view, but emits 'trivara_db_save_error' if it fails so the UI can warn
    // the admin that the change did NOT reach other visitors.
    async _pushToServer(data) {
        try {
            const token = sessionStorage.getItem('trivara_admin_token') || '';
            const res = await fetch(DB_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const info = await res.json().catch(() => ({}));
                console.error('Gagal menyimpan ke server:', res.status, info);
                window.dispatchEvent(new CustomEvent('trivara_db_save_error', { detail: info }));
            }
        } catch (e) {
            console.error('Gagal menyimpan ke server (jaringan):', e);
            window.dispatchEvent(new CustomEvent('trivara_db_save_error', { detail: { error: String(e) } }));
        }
    },

    // Pull the latest data from the server. Called once automatically below.
    // Safe to call again any time (e.g. after re-focusing the admin tab).
    async syncFromServer() {
        try {
            const res = await fetch(DB_API_URL);
            if (!res.ok) return;
            const json = await res.json();
            if (json && json.data) {
                _dbCache = json.data;
                localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(json.data));
                window.dispatchEvent(new Event('trivara_db_updated'));
            } else {
                // Server has no data yet (first deploy) — seed it with what
                // we have locally so it becomes the shared source of truth.
                this._pushToServer(_dbCache);
            }
        } catch (e) {
            console.warn('Tidak bisa mengambil data terbaru dari server, memakai cache lokal.', e);
        }
    }
};

// Ensure a usable cache exists immediately (sync), then refresh from the
// server in the background as soon as the script runs.
DB.syncFromServer();
