// =========================================
// LANDING PAGE LOGIC (DARI INLINE HOME.HTML)
// =========================================
(function () {
    const body = document.body;
    const enterBtn = document.getElementById('enterBtn');
    const landingSection = document.getElementById('landingSection');
    const homeContent = document.getElementById('homeContent');
    const tentangLink = document.getElementById('tentangLink');
    let entered = false;

    function enterHome(scrollToEl) {
        if (entered) return;
        entered = true;

        if (landingSection) {
            landingSection.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            landingSection.style.opacity = '0';
            landingSection.style.transform = 'scale(1.04)';
        }

        setTimeout(() => {
            body.classList.remove('scroll-locked');
            body.classList.add('entered');

            if (homeContent) {
                homeContent.style.animation = 'homeFadeIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both';
            }

            requestAnimationFrame(() => {
                const target = scrollToEl || document.querySelector('.navbar');
                if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'auto' });
                if (window.AOS) setTimeout(() => AOS.refresh(), 50);
            });
        }, 550);
    }

    if (enterBtn) enterBtn.addEventListener('click', () => enterHome());
    if (tentangLink) {
        tentangLink.addEventListener('click', (e) => {
            e.preventDefault();
            enterHome(document.getElementById('tentang'));
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (entered) return;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const h = window.innerHeight;
                if (scrollY <= h && landingSection) {
                    const progress = scrollY / h;
                    landingSection.style.opacity = String(1 - progress * 1.2);
                    landingSection.style.transform = `translateY(-${scrollY * 0.35}px)`;
                    landingSection.style.pointerEvents = progress > 0.6 ? 'none' : 'auto';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();