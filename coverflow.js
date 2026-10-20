(function () {
    const root = document.getElementById("coverflowRoot");
    if (!root) return;

    // FIX: Ekstensi diseragamkan jadi .jpg (huruf kecil)
    const SLIDES = [
        { src: "foto-1.jpg", title: "Rapat Pengurus", subtitle: "Diskusi program kerja OSIS dan perencanaan kegiatan tahunan." },
        { src: "foto-2.jpg", title: "Anggota Baru", subtitle: "Semangat kebersamaan angkatan baru yang penuh energi." },
        { src: "foto-3.jpg", title: "Petugas Acara", subtitle: "Siap mengawal rangkaian acara sekolah dengan tanggung jawab." },
        { src: "foto-4.jpg", title: "Senyum Ceria", subtitle: "Kebersamaan pengurus OSIS dalam setiap momen." },
        { src: "foto-5.jpg", title: "Kegiatan Sosial", subtitle: "Bakti sosial OSIS untuk masyarakat sekitar sekolah." },
        { src: "foto-6.jpg", title: "Persiapan Lomba", subtitle: "Latihan intensif menjelang kompetisi antar sekolah." },
        { src: "foto-7.jpg", title: "Diskusi Divisi", subtitle: "Koordinasi antar divisi untuk kelancaran program kerja." },
        { src: "foto-8.jpg", title: "Foto Bersama", subtitle: "Momen kebersamaan seluruh pengurus OSIS." }
    ];

    const CONFIG = { rotate: 44, depth: 0.6, falloff: 0.56, fade: 0.1, gap: 0.05, loop: true };
    const count = SLIDES.length;
    let pos = 0, target = 0, cardWidth = 0, rafId = null, isDragging = false;
    let startX = 0, startPos = 0, startTime = 0, velocity = 0;

    root.innerHTML = `
        <div class="cf-container">
            <div class="cf-frame" id="cfFrame" tabindex="0">
                <div class="cf-stage" id="cfStage"></div>
            </div>
            <button class="cf-nav-btn prev" id="cfPrev" aria-label="Sebelumnya">&#10094;</button>
            <button class="cf-nav-btn next" id="cfNext" aria-label="Berikutnya">&#10095;</button>
            <div class="cf-caption" id="cfCaption">
                <h3 id="cfTitle"></h3>
                <p id="cfSubtitle"></p>
            </div>
            <div class="cf-pagination" id="cfPagination"></div>
        </div>
    `;

    const frame = document.getElementById("cfFrame");
    const stage = document.getElementById("cfStage");
    const btnPrev = document.getElementById("cfPrev");
    const btnNext = document.getElementById("cfNext");
    const capTitle = document.getElementById("cfTitle");
    const capSubtitle = document.getElementById("cfSubtitle");
    const pagination = document.getElementById("cfPagination");
    const cardRefs = [];
    let activeIndex = 0;

    SLIDES.forEach((slide, i) => {
        const card = document.createElement("div");
        card.className = "cf-card";
        card.dataset.index = i;
        // Menambahkan loading="lazy"
        card.innerHTML = `<img src="${slide.src}" alt="${slide.title}" draggable="false" loading="lazy">`;
        
        card.addEventListener("click", () => {
            if (isDragging) return;
            const idx = parseInt(card.dataset.index);
            if (idx === activeIndex) openModal(slide);
        });

        stage.appendChild(card);
        cardRefs.push(card);

        const dot = document.createElement("button");
        dot.className = "cf-dot";
        dot.addEventListener("click", () => goTo(i));
        pagination.appendChild(dot);
    });

    function indexAt(p) { return ((Math.round(p) % count) + count) % count; }

    function paint() {
        if (!cardWidth) return;
        const pitch = cardWidth * (1 + CONFIG.gap);
        cardRefs.forEach((card, i) => {
            let offset = i - pos;
            if (CONFIG.loop) {
                offset = ((offset % count) + count) % count;
                if (offset > count / 2) offset -= count;
            }
            const distance = Math.abs(offset);
            const ramp = Math.pow(distance, CONFIG.falloff);
            const tilt = Math.min(CONFIG.rotate * ramp, 82) * Math.sign(offset);

            card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-CONFIG.depth * cardWidth * ramp}px) rotateY(${-tilt}deg)`;
            const edge = CONFIG.loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
            card.style.opacity = String(Math.max(0, 1 - CONFIG.fade * distance) * edge);
            card.style.zIndex = String(100 - Math.round(distance));
        });
    }

    function settle(t) {
        if (rafId) cancelAnimationFrame(rafId);
        target = t;
        const newIndex = indexAt(target);
        if (newIndex !== activeIndex) {
            activeIndex = newIndex;
            updateUI(activeIndex);
        }
        function step() {
            const remaining = target - pos;
            if (Math.abs(remaining) < 0.0004) { pos = target; paint(); rafId = null; return; }
            pos += remaining * 0.16;
            paint();
            rafId = requestAnimationFrame(step);
        }
        rafId = requestAnimationFrame(step);
    }

    function goTo(index) { settle(CONFIG.loop ? index + Math.round((target - index) / count) * count : index); }
    function nudge(by) { settle(Math.round(target) + by); }

    function updateUI(index) {
        capTitle.textContent = SLIDES[index].title;
        capSubtitle.textContent = SLIDES[index].subtitle;
        pagination.querySelectorAll(".cf-dot").forEach((dot, i) => dot.classList.toggle("is-active", i === index));
        const cap = document.getElementById("cfCaption");
        cap.style.animation = 'none';
        cap.offsetHeight; 
        cap.style.animation = null;
    }

    const ro = new ResizeObserver(([entry]) => {
        cardWidth = Math.max(148, Math.min(260, entry.contentRect.width * 0.22));
        root.style.setProperty('--cf-card', `${cardWidth}px`);
        paint();
    });
    ro.observe(frame);

    // Touch & Mouse Events
    frame.addEventListener("pointerdown", (e) => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        isDragging = false;
        startX = e.clientX;
        startPos = pos;
        startTime = performance.now();
        frame.setPointerCapture(e.pointerId);
    });

    frame.addEventListener("pointermove", (e) => {
        if (!frame.hasPointerCapture(e.pointerId)) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) isDragging = true;
        if (!isDragging) return;
        
        const pitch = cardWidth * (1 + CONFIG.gap);
        const newPos = startPos - dx / pitch;
        const now = performance.now();
        velocity = (newPos - pos) / Math.max(now - startTime, 1) * 1000;
        startTime = now;
        pos = CONFIG.loop ? newPos : Math.max(0, Math.min(count - 1, newPos));
        paint();
    });

    frame.addEventListener("pointerup", (e) => {
        frame.releasePointerCapture(e.pointerId);
        if (!isDragging) return;
        settle(Math.round(pos + Math.max(-2, Math.min(2, velocity * 0.18))));
        setTimeout(() => { isDragging = false; }, 50);
    });

    frame.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); nudge(1); }
    });

    btnPrev.addEventListener("click", () => nudge(-1));
    btnNext.addEventListener("click", () => nudge(1));

    function openModal(slide) {
        const modal = document.getElementById("galeriModal");
        if (!modal) return;
        document.getElementById("galeriModalImg").src = slide.src;
        document.getElementById("galeriModalTitle").textContent = slide.title;
        document.getElementById("galeriModalDesc").textContent = slide.subtitle;
        modal.classList.add("is-open");
    }

    updateUI(0);
    setTimeout(() => { 
        cardWidth = Math.max(148, Math.min(260, frame.getBoundingClientRect().width * 0.22));
        root.style.setProperty('--cf-card', `${cardWidth}px`);
        paint(); 
    }, 100);
})();