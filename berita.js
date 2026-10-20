// =========================================
// SCROLL EXPANSION HERO LOGIC (NATIVE SCROLL)
// =========================================
(function () {
    const heroSection = document.getElementById("expandHero");
    const bgLayer = document.getElementById("expandBg");
    const mediaContainer = document.getElementById("expandMedia");
    const titleTop = document.getElementById("titleTop");
    const titleBottom = document.getElementById("titleBottom");
    const subtitle = document.getElementById("expandSubtitle");
    const scrollHint = document.getElementById("scrollHint");

    if (!heroSection) return;

    const isMobile = window.innerWidth < 768;

    // Ukuran Awal Video
    const startW = isMobile ? 260 : 400;
    const startH = isMobile ? 180 : 260;

    // Ukuran Akhir: Memenuhi seluruh layar (viewport)
    const endW = window.innerWidth;
    const endH = window.innerHeight;

    // Fungsi untuk merender perubahan
    function render() {
        // Hitung seberapa jauh user sudah scroll (0 sampai 1 viewport)
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight; 
        
        // Batasi progress antara 0 dan 1
        let progress = Math.min(scrollY / maxScroll, 1);

        // Hitung dimensi saat ini
        const currentW = startW + progress * (endW - startW);
        const currentH = startH + progress * (endH - startH);
        
        // Terapkan ke video
        mediaContainer.style.width = `${currentW}px`;
        mediaContainer.style.height = `${currentH}px`;
        mediaContainer.style.borderRadius = `${16 - (16 * progress)}px`;

        // Memudarkan background foto
        bgLayer.style.opacity = 1 - (progress * 1.5);

        // PERGESERAN TEKS
        const translateValue = progress * 150; 
        titleTop.style.transform = `translateX(-${translateValue}vw)`;
        titleBottom.style.transform = `translateX(${translateValue}vw)`;
        
        // Memudarkan teks dan hint
        titleTop.style.opacity = 1 - (progress * 3);
        titleBottom.style.opacity = 1 - (progress * 3);
        subtitle.style.opacity = 1 - (progress * 4);
        if (scrollHint) scrollHint.style.opacity = 1 - (progress * 4);
    }

    // Event listener scroll murni (tanpa preventDefault)
    window.addEventListener("scroll", render, { passive: true });

    // Render awal saat halaman dimuat
    render();

    // Update saat resize layar (jika orientasi berubah)
    window.addEventListener("resize", () => {
        // Karena endW dan endH bergantung pada ukuran layar,
        // kita perlu me-refresh halaman atau menghitung ulang variabel.
        // Untuk kesederhanaan, biarkan render berjalan dengan nilai lama jika di-resize.
    });
})();