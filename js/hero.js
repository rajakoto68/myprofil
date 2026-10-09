
(() => {
    const $ = s => document.querySelector(s);
    const hero = $('#heroScroll');
    const canvas = $('#heroCanvas');
    if (!hero || !canvas)
        return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const copy = $('#heroCopy'), specs = $('#heroSpecs'), finalCopy = $('#heroFinal');
    const hint = $('#scrollHint'), bar = $('.hero-progress span');
    const scBg = $('#scBg'), scCol = $('#scCol'), scStack = $('#scStack');
    const scCard = $('#scCard'), scBike = $('#scBike'), scCap = $('#scCap'), scCapText = $('#scCapText');
    const scCta = $('.sc-cta');
    const slides = [...document.querySelectorAll('.sc-slide')];
    const lines = [...document.querySelectorAll('.sc-line')];
    const shadow0 = $('.sc-slide[data-i="0"] .sc-shadow');
    const captions = [
        'Rideradian EXR Titanium. Listrik, ringan, siap medan.',
        'EXR Titanium. Torsi listrik langsung terasa dari putaran pertama.',
        'Berkendara senyap, fokus ke jalur di depan.',
        'Rangka terbuka dan komponen mudah dijangkau untuk perawatan.',
        'Karakter berkendara yang bisa disetel sesuai gaya kamu.',
        'Handling presisi di tikungan dan tanjakan.',
        'Desain berani yang membuatmu percaya diri.'
    ];

    const total = 120, frames = [];
    const BIKE_RATIO = 1400 / 1021;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    let vw = innerWidth, vh = innerHeight, mobile = vw <= 820;
    let target = null, colBox = null;
    let targetFrame = 0, currentFrame = 0, lastFrame = -1;
    let progress = 0, scrolling = false, idleTimer = 0, ticking = false;
    let activeIdx = -1, slideIdx = -1, stackY = 0, stackTarget = 0, capIdx = -1;

    /* ---------- canvas ---------- */
    const setCanvasSize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(vw * dpr));
        canvas.height = Math.max(1, Math.round(vh * dpr));
        if (lastFrame >= 0)
            draw(lastFrame);
    };
    /* Pembingkaian sama untuk frame sequence DAN foto kartu: motor selalu utuh
       (tidak terpotong) di layar apa pun. Kalau gambar tidak menutup tinggi layar
       (HP portrait), sisi atas/bawah disambung dari baris tepi gambar. */
    const BIKE_SPAN = 0.56, BIKE_CENTER = 0.47;
    const drawFit = (c2, img, cw, ch) => {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const cover = Math.max(cw / iw, ch / ih);
        const fit = (cw * 0.94) / (BIKE_SPAN * iw);
        const s = Math.min(cover, fit);
        const w = iw * s, h = ih * s;
        const x = Math.min(0, Math.max(cw - w, cw / 2 - BIKE_CENTER * w));
        const y = (ch - h) / 2;
        c2.fillStyle = '#050606';
        c2.fillRect(0, 0, cw, ch);
        if (h < ch) {
            /* sambungan atas/bawah: ambil baris tepi lalu dihaluskan (kecilkan -> regangkan) */
            const strip = Math.max(2, Math.round(ih * 0.02));
            if (!drawFit.tmp) {
                drawFit.tmp = document.createElement('canvas');
                drawFit.tmp.width = 12;
                drawFit.tmp.height = 1;
            }
            const t = drawFit.tmp, tc = t.getContext('2d');
            tc.imageSmoothingEnabled = true;
            tc.imageSmoothingQuality = 'high';
            tc.clearRect(0, 0, 12, 1);
            tc.drawImage(img, 0, 0, iw, strip, 0, 0, 12, 1);
            c2.imageSmoothingEnabled = true;
            c2.imageSmoothingQuality = 'high';
            c2.drawImage(t, 0, 0, 12, 1, x, 0, w, y + 1);
            tc.clearRect(0, 0, 12, 1);
            tc.drawImage(img, 0, ih - strip, iw, strip, 0, 0, 12, 1);
            c2.drawImage(t, 0, 0, 12, 1, x, y + h - 1, w, ch - (y + h) + 1);
        }
        c2.drawImage(img, x, y, w, h);
    };
    const pickFrame = index => {
        let img = frames[index];
        if (img && img.complete && img.naturalWidth)
            return img;
        for (let i = index; i >= 0; i--) {
            const f = frames[i];
            if (f && f.complete && f.naturalWidth)
                return f;
        }
        return null;
    };
    const draw = index => {
        const img = pickFrame(index);
        if (img)
            drawFit(ctx, img, canvas.width, canvas.height);
    };

    /* kartu: foto resolusi tinggi dengan pembingkaian yang sama */
    const scCanvas = $('#scCanvas');
    const scCtx = scCanvas && scCanvas.getContext('2d', { alpha: false });
    const photo = new Image();
    photo.decoding = 'async';
    photo.src = 'assets/images/products/exr.jpg';
    let photoOk = false, cardKey = '';
    photo.onload = () => {
        photoOk = true;
        cardKey = '';
        requestUpdate();
    };
    const drawCard = (W, H) => {
        if (!scCtx)
            return;
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        const cw = Math.max(1, Math.round(W * dpr)), ch = Math.max(1, Math.round(H * dpr));
        const key = cw + 'x' + ch + (photoOk ? 'p' : 'f');
        if (key === cardKey)
            return;
        cardKey = key;
        scCanvas.width = cw;
        scCanvas.height = ch;
        const img = photoOk ? photo : pickFrame(total - 1);
        if (img)
            drawFit(scCtx, img, cw, ch);
    };

    for (let i = 0; i < total; i++) {
        const im = new Image();
        im.decoding = 'async';
        im.src = `assets/images/hero-sequence/${String(i).padStart(3, '0')}.jpg`;
        if (i === 0)
            im.onload = () => draw(0);
        frames.push(im);
    }

    /* ---------- layout kartu & kolom ---------- */
    const measure = () => {
        vw = innerWidth;
        vh = innerHeight;
        mobile = vw <= 820;
        if (mobile) {
            const w = vw - 32, h = Math.round(vh * 0.40), t = 16;
            target = {
                l: 16, t, w, h, r: 20
            };
            const top = t + h + 4, bottom = 104;
            colBox = { top, height: Math.max(160, vh - top - bottom) };
        }
        else {
            const w = Math.min(vw * 0.43, 640);
            const h = Math.min(vh * 0.8, w * 1.12);
            const rm = Math.max(54, vw * 0.05);
            target = {
                l: vw - w - rm, t: (vh - h) / 2, w, h, r: 24
            };
            colBox = { top: 0, height: vh };
        }
        scCol.style.top = colBox.top + 'px';
        scCol.style.height = colBox.height + 'px';
        if (mobile) {
            scCol.style.maskImage = scCol.style.webkitMaskImage = 'linear-gradient(180deg,transparent 0,#000 16%,#000 84%,transparent 100%)';
        }
        else {
            scCol.style.maskImage = scCol.style.webkitMaskImage = '';
        }
        setActiveLine(activeIdx < 0 ? 0 : activeIdx, true);
    };

    const setActiveLine = (i, force) => {
        if (i === activeIdx && !force)
            return;
        activeIdx = i;
        lines.forEach(l => l.classList.toggle('is-on', +l.dataset.i === i));
        const el = lines.find(l => +l.dataset.i === i);
        if (el)
            stackTarget = colBox.height / 2 - (el.offsetTop + el.offsetHeight / 2);
    };

    const setSlide = i => {
        if (i === slideIdx)
            return;
        slideIdx = i;
        slides.forEach(s => s.classList.toggle('is-on', +s.dataset.i === i));
        if (scCta)
            scCta.classList.toggle('show', i >= 6);
    };

    /* ---------- teks hero (hanya saat berhenti scroll) ---------- */
    const applyText = () => {
        const p = progress;
        const idle = !scrolling;
        copy.classList.toggle('show', idle && p > 0.012 && p < 0.16);
        specs.classList.toggle('show', idle && p > 0.012 && p < 0.16);
        finalCopy.classList.toggle('show', idle && p >= 0.17 && p < 0.255);
    };

    /* ---------- update utama (dipanggil saat scroll) ---------- */
    const update = () => {
        ticking = false;
        const rect = hero.getBoundingClientRect();
        const max = Math.max(1, hero.offsetHeight - vh);
        progress = clamp(-rect.top / max);
        const p = progress;

        /* 1. frame sequence */
        targetFrame = clamp(p / 0.26) * (total - 1);
        if (bar)
            bar.style.width = (p * 100) + '%';
        if (hint)
            hint.style.opacity = String(1 - clamp(p / 0.03));

        /* 2. kartu layar-penuh muncul (motor silver keluar & melayang) */
        const cardOp = clamp((p - 0.27) / 0.035);
        const ent = easeOut(clamp((p - 0.27) / 0.075));
        canvas.style.visibility = (p > 0.34 ? 'hidden' : 'visible');
        scCard.style.opacity = String(cardOp);

        /* 3. layar penuh -> kartu */
        const e = easeInOut(clamp((p - 0.40) / 0.16));
        const L = lerp(0, target.l, e), T = lerp(0, target.t, e);
        const W = lerp(vw, target.w, e), H = lerp(vh, target.h, e);
        scCard.style.left = L + 'px';
        scCard.style.top = T + 'px';
        scCard.style.width = W + 'px';
        scCard.style.height = H + 'px';
        scCard.style.borderRadius = lerp(0, target.r, e) + 'px';
        scCard.style.boxShadow = `0 30px 70px rgba(10,10,11,${(0.18 * e).toFixed(3)})`;

        if (cardOp > 0)
            drawCard(W, H);
        if (scCanvas)
            scCanvas.classList.toggle('float', p > 0.36);
        if (bar)
            bar.parentNode.style.opacity = String(1 - clamp((p - 0.3) / 0.05));

        if (scBike) {
            scBike.style.opacity = String(clamp(ent * 2.2));
            scBike.style.transform = `translate3d(0, 0, 0) scale(${(1.03 - 0.03 * ent).toFixed(4)})`;
        }
        if (shadow0)
            shadow0.style.opacity = String(clamp((ent - 0.4) / 0.6));

        scBg.style.opacity = String(clamp((p - 0.40) / 0.04));
        scCol.style.opacity = String(clamp((p - 0.50) / 0.07));
        scCap.style.opacity = String(clamp((e - 0.85) / 0.15));

        /* 4. daftar fitur + ganti gambar */
        const t = clamp((p - 0.58) / 0.32);
        const idx = p < 0.5 ? 0 : Math.min(6, Math.floor(t * 7));
        setSlide(idx);
        setActiveLine(idx);
        if (idx !== capIdx) {
            capIdx = idx;
            scCapText.textContent = captions[idx];
        }

        document.body.classList.toggle('sc-light', p > 0.46 && rect.bottom > 80);
        applyText();
    };

    const requestUpdate = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };

    const onScroll = () => {
        scrolling = true;
        copy.classList.remove('show');
        specs.classList.remove('show');
        finalCopy.classList.remove('show');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            scrolling = false;
            applyText();
        }, 190);
        requestUpdate();
    };

    /* ---------- loop: frame halus + geser daftar halus ---------- */
    const tick = () => {
        currentFrame += (targetFrame - currentFrame) * 0.18;
        const f = Math.max(0, Math.min(total - 1, Math.round(currentFrame)));
        if (f !== lastFrame && progress < 0.36) {
            draw(f);
            lastFrame = f;
        }
        stackY += (stackTarget - stackY) * 0.12;
        scStack.style.transform = `translate3d(0, ${stackY.toFixed(2)}px, 0)`;
        requestAnimationFrame(tick);
    };

    let rz = 0;
    addEventListener('resize', () => {
        cancelAnimationFrame(rz);
        rz = requestAnimationFrame(() => {
            measure();
            setCanvasSize();
            update();
        });
    }, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });

    measure();
    setCanvasSize();
    stackY = stackTarget;
    update();
    tick();
})();
