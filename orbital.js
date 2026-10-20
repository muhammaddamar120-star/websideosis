// =========================================
// ORBITAL TIMELINE — Bidang OSIS
// =========================================
(function () {
    const root = document.getElementById("orbitalRoot");
    if (!root) return;

    // ============ DATA BIDANG ============
    const DATA = [
        {
            id: 1,
            title: "BUMS",
            short: "Badan Usaha Milik Sekolah",
            desc: "BUMS adalah bagian OSIS yang mengelola unit usaha dan kegiatan kewirausahaan sekolah untuk melatih jiwa bisnis siswa.",
            energy: 70,
            iconUrl: "logo-bums.png",
            href: "pengurus.html#bums"
        },
        {
            id: 2,
            title: "KEMENDIKBUD",
            short: "Kementerian Pendidikan & Budaya",
            desc: "KEMENDIKBUD adalah bagian OSIS yang menangani bidang pendidikan, literasi, dan pengembangan budaya akademik siswa.",
            energy: 85,
            iconUrl: "logo-kemendikbud.png",
            href: "pengurus.html#kemendikbud"
        },
        {
            id: 3,
            title: "BPH",
            short: "Badan Pengurus Harian",
            desc: "BPH adalah inti kepengurusan OSIS yang mengoordinasikan seluruh bidang dan menjalankan fungsi manajerial harian organisasi.",
            energy: 95,
            iconUrl: "logo-bph.png",
            href: "pengurus.html#bph"
        },
        {
            id: 4,
            title: "KEMENAG",
            short: "Kementerian Agama",
            desc: "KEMENAG adalah bagian OSIS yang menangani peribadahan dan kegiatan keagamaan bagi seluruh murid di sekolah.",
            energy: 90,
            iconUrl: "logo-kemenag.png",
            href: "pengurus.html#kemenag"
        },
        {
            id: 5,
            title: "KOMINFO",
            short: "Komunikasi & Informasi",
            desc: "KOMINFO adalah bagian OSIS yang mengelola media sosial, publikasi, dan dokumentasi seluruh kegiatan sekolah.",
            energy: 80,
            iconUrl: "logo-kominfo.png",
            href: "pengurus.html#kominfo"
        },
        {
            id: 6,
            title: "KEMENFORA",
            short: "Kementerian Olahraga",
            desc: "KEMENFORA adalah bagian OSIS yang mengelola kegiatan olahraga, turnamen, dan pembinaan bakat atletik siswa.",
            energy: 75,
            iconUrl: "logo-kemenfora.png",
            href: "pengurus.html#kemenfora"
        }
    ];

    const N = DATA.length;
    
    // PERUBAHAN: Perbesar radius agar sesuai dengan ring-outer (560px / 2 = 280)
    const RADIUS = 280; 
    const RADIUS_MOBILE = 160; // Sesuaikan dengan ring-outer mobile (320px / 2)

    // ============ BUILD DOM ============
    root.innerHTML = "";

    const orbit = document.createElement("div");
    orbit.className = "orbital-orbit";

    // Center core
    const center = document.createElement("div");
    center.className = "orbital-center";
    center.innerHTML = '<div class="orbital-center-dot"></div>';
    orbit.appendChild(center);

    // MEMBUAT 3 GARIS EDAR (RINGS)
    const ringOuter = document.createElement("div");
    ringOuter.className = "orbital-ring ring-outer";
    orbit.appendChild(ringOuter);

    const ringMiddle = document.createElement("div");
    ringMiddle.className = "orbital-ring ring-middle";
    orbit.appendChild(ringMiddle);

    const ringInner = document.createElement("div");
    ringInner.className = "orbital-ring ring-inner";
    orbit.appendChild(ringInner);

    // Nodes
    const nodes = [];
    DATA.forEach((item) => {
        const node = document.createElement("div");
        node.className = "orbital-node";
        node.dataset.id = item.id;

        const pulse = document.createElement("div");
        pulse.className = "orbital-node-pulse";
        pulse.style.width = (item.energy * 0.5 + 40) + "px";
        pulse.style.height = (item.energy * 0.5 + 40) + "px";
        node.appendChild(pulse);

        const icon = document.createElement("div");
        icon.className = "orbital-node-icon";
        
        const img = document.createElement("img");
        img.src = item.iconUrl;
        img.alt = item.title;
        
        img.onerror = function() {
            this.style.display = 'none';
            icon.textContent = item.title.charAt(0);
            icon.style.color = '#C58A52';
            icon.style.fontWeight = 'bold';
            icon.style.fontSize = '18px';
            icon.style.display = 'grid';
            icon.style.placeItems = 'center';
        };
        
        icon.appendChild(img);
        node.appendChild(icon);

        const title = document.createElement("div");
        title.className = "orbital-node-title";
        title.textContent = item.title;
        node.appendChild(title);

        node.addEventListener("click", (e) => {
            e.stopPropagation();
            toggle(item.id);
        });

        orbit.appendChild(node);
        nodes.push(node);
    });

    root.appendChild(orbit);

    // ============ STATE ============
    let rotation = 0;
    let autoRotate = true;
    let activeId = null;
    let cardEl = null;
    let rafId = null;

    const getRadius = () => window.innerWidth < 768 ? RADIUS_MOBILE : RADIUS;

    const getNodePos = (index) => {
        const r = getRadius();
        const angle = ((index / N) * 360 + rotation) % 360;
        const rad = (angle * Math.PI) / 180;
        const x = r * Math.cos(rad);
        const y = r * Math.sin(rad);
        const z = Math.round(100 + 50 * Math.cos(rad));
        const op = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2)));
        return { x, y, z, op };
    };

    // ============ RENDER ============
    const render = () => {
        nodes.forEach((node, i) => {
            const pos = getNodePos(i);
            node.style.transform =
                "translate(calc(-50% + " + pos.x.toFixed(1) + "px), calc(-50% + " + pos.y.toFixed(1) + "px))";
            node.style.zIndex = activeId === DATA[i].id ? 200 : pos.z;
            node.style.opacity = activeId === DATA[i].id ? 1 : pos.op;
            node.classList.toggle("active", activeId === DATA[i].id);
        });
    };

    // ============ ANIMATION LOOP ============
    const loop = () => {
        if (autoRotate && activeId === null) {
            rotation = (rotation + 0.25) % 360;
            render();
        }
        rafId = requestAnimationFrame(loop);
    };
    loop();

    // ============ CARD ============
    const showCard = (item, nodeIndex) => {
        hideCard();

        const card = document.createElement("div");
        card.className = "orbital-card";
        card.innerHTML = `
            <div class="orbital-card-arrow"></div>
            <div class="orbital-card-header">
                <span class="orbital-badge">${item.title}</span>
                <span class="orbital-card-date">2026</span>
            </div>
            <h3>${item.short}</h3>
            <p>${item.desc}</p>
            <div class="orbital-energy">
                <div class="orbital-energy-label">
                    <span>⚡ Tingkat Kesiapan</span>
                    <span>${item.energy}%</span>
                </div>
                <div class="orbital-energy-bar">
                    <div class="orbital-energy-fill" style="width: ${item.energy}%"></div>
                </div>
            </div>
            <div class="orbital-card-footer">
                <a href="${item.href}" class="orbital-more-btn">Selengkapnya →</a>
            </div>
        `;
        card.addEventListener("click", (e) => e.stopPropagation());

        const pos = getNodePos(nodeIndex);
        const cardLeft = `calc(50% + ${pos.x}px)`;
        let cardTop = `calc(50% + ${pos.y + 80}px)`;

        if (pos.y > 60) {
            cardTop = `calc(50% + ${pos.y - 40}px)`;
            card.style.transform = "translate(-50%, -100%)";
            card.querySelector(".orbital-card-arrow").style.top = "auto";
            card.querySelector(".orbital-card-arrow").style.bottom = "-7px";
            card.querySelector(".orbital-card-arrow").style.transform =
                "translateX(-50%) rotate(225deg)";
        } else {
            card.style.transform = "translateX(-50%)";
        }

        card.style.left = cardLeft;
        card.style.top = cardTop;

        root.appendChild(card);
        cardEl = card;
    };

    const hideCard = () => {
        if (cardEl) {
            cardEl.remove();
            cardEl = null;
        }
    };

    // ============ TOGGLE ============
    const toggle = (id) => {
        if (activeId === id) {
            activeId = null;
            autoRotate = true;
            hideCard();
            render();
        } else {
            activeId = id;
            autoRotate = false;

            const idx = DATA.findIndex((d) => d.id === id);
            const targetAngle = (idx / N) * 360;
            rotation = (270 - targetAngle + 360) % 360;
            render();

            const item = DATA.find((d) => d.id === id);
            setTimeout(() => showCard(item, idx), 100);
        }
    };

    // ============ CLICK OUTSIDE ============
    root.addEventListener("click", () => {
        if (activeId !== null) {
            activeId = null;
            autoRotate = true;
            hideCard();
            render();
        }
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && activeId !== null) {
            activeId = null;
            autoRotate = true;
            hideCard();
            render();
        }
    });

    // Resize
    window.addEventListener("resize", render);

    // Initial
    render();
})();