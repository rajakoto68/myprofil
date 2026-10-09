
(() => {
    'use strict';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const dprOf = () => Math.min(window.devicePixelRatio || 1, 2);

    const items = [];

    function make(el, kind) {
        const canvas = document.createElement('canvas');
        el.appendChild(canvas);
        const it = {
            el, canvas, kind, ctx: canvas.getContext('2d'),
            w: 0, h: 0, vis: false,
            speed: parseFloat(el.dataset.speed || 1),
            amp: parseFloat(el.dataset.amp || 1),
            to: el.dataset.to || '#f3f1ea',
            back: el.dataset.back || '',
            mid: el.dataset.mid || '',
            edge: el.dataset.edge || '',
            seed: Math.random() * 100
        };
        items.push(it);
        return it;
    }

    function size(it) {
        const d = dprOf();
        const w = Math.max(1, Math.round(it.el.clientWidth));
        const h = Math.max(1, Math.round(it.el.clientHeight));
        if (w === it.w && h === it.h && it.d === d)
            return;
        it.w = w;
        it.h = h;
        it.d = d;
        it.canvas.width = Math.round(w * d);
        it.canvas.height = Math.round(h * d);
        it.ctx.setTransform(d, 0, 0, d, 0, 0);
        it.dirty = true;
    }

    /* ---------- gelombang berlapis ---------- */
    // panjang gelombang dalam piksel (bukan % lebar) supaya bentuk konsisten di semua layar
    function layerY(x, H, L, A, ph) {
        const k = Math.PI * 2 / L;
        return Math.sin(x * k + ph) * A + Math.sin(x * k * 0.5 - ph * 0.6 + 1.7) * A * 0.35;
    }

    function drawWave(it, t, boost) {
        const { ctx, w: W, h: H } = it;
        ctx.clearRect(0, 0, W, H);
        const sc = clamp(W / 1440, .6, 1.25);
        const A = H * 0.17 * it.amp;
        // [warna, posisi y (0-1), amplitudo, panjang gelombang, kecepatan px/detik, fase awal]
        const layers = [];
        if (it.back)
            layers.push([it.back, .30, A * 1.00, 1180 * sc, -22, 0.0]);
        if (it.mid)
            layers.push([it.mid, .46, A * 0.92, 860 * sc, 34, 2.1]);
        layers.push([it.to, .64, A * 0.78, 640 * sc, -46, 4.0]);

        const step = W > 900 ? 4 : 3;
        layers.forEach((l, i) => {
            const [col, yy, amp, len, v, p0] = l;
            const ph = p0 + it.seed + (t * v * it.speed + boost * (i + 1) * 6) * (Math.PI * 2 / len);
            const y0 = H * yy;
            ctx.beginPath();
            ctx.moveTo(-2, H + 2);
            for (let x = -2; x <= W + step; x += step)
                ctx.lineTo(x, y0 + layerY(x, H, len, amp, ph));
            ctx.lineTo(W + 2, H + 2);
            ctx.closePath();
            ctx.fillStyle = col;
            ctx.fill();

            // garis tipis di tepi lapisan depan
            if (it.edge && i === layers.length - 1) {
                ctx.beginPath();
                for (let x = -2; x <= W + step; x += step) {
                    const y = y0 + layerY(x, H, len, amp, ph);
                    x === -2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = it.edge;
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        });
    }

    /* ---------- ECG ---------- */
    // satu denyut: bentuk P - QRS - T, dalam koordinat 0..1 sepanjang satu periode
    function beat(u) {
        const g = (c, w, a) => a * Math.exp(-Math.pow((u - c) / w, 2));
        return g(.18, .035, -.10) // gelombang P (kecil)
            + g(.385, .010, .18) // Q
            + g(.420, .012, -1.00) // R (puncak ke atas)
            + g(.455, .012, .38) // S
            + g(.70, .06, -.22); // T
    }

    function drawEcg(it, t) {
        const { ctx, w: W, h: H } = it;
        ctx.clearRect(0, 0, W, H);
        const period = clamp(W * .42, 360, 640);
        const base = H * .56, amp = H * .34;
        const off = (t * 90 * it.speed) % period;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        // gradasi pudar di kiri-kanan
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, 'rgba(246,209,0,0)');
        grad.addColorStop(.12, 'rgba(246,209,0,1)');
        grad.addColorStop(.88, 'rgba(246,209,0,1)');
        grad.addColorStop(1, 'rgba(246,209,0,0)');

        const path = () => {
            ctx.beginPath();
            for (let x = 0; x <= W; x += 2) {
                const u = (((x + off) % period) + period) % period / period;
                const y = base + beat(u) * amp;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
        };
        // cahaya
        ctx.save();
        ctx.globalAlpha = .28;
        ctx.lineWidth = 7;
        ctx.strokeStyle = grad;
        ctx.filter = 'blur(5px)';
        path();
        ctx.stroke();
        ctx.restore();
        // garis utama
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = grad;
        path();
        ctx.stroke();
    }

    /* ---------- init ---------- */
    document.querySelectorAll('.wv').forEach(el => make(el, 'wave'));
    document.querySelectorAll('.wv-ecg').forEach(el => make(el, 'ecg'));
    if (!items.length)
        return;

    let boost = 0, lastY = scrollY, running = false, t0 = performance.now();

    const io = new IntersectionObserver(es => {
        es.forEach(e => {
            const it = items.find(i => i.el === e.target);
            if (it)
                it.vis = e.isIntersecting;
        });
        kick();
    }, { rootMargin: '120px 0px' });
    items.forEach(it => io.observe(it.el));

    const ro = new ResizeObserver(() => {
        items.forEach(size);
        renderAll(performance.now());
    });
    items.forEach(it => ro.observe(it.el));
    items.forEach(size);

    function renderAll(now) {
        const t = (now - t0) / 1000;
        items.forEach(it => {
            if (!it.vis && !it.dirty)
                return;
            it.kind === 'ecg' ? drawEcg(it, t) : drawWave(it, t, boost);
            it.dirty = false;
        });
    }

    function frame(now) {
        // dorongan halus saat scroll cepat
        const y = scrollY, dv = Math.abs(y - lastY);
        lastY = y;
        boost += (clamp(dv * .05, 0, 4) - boost) * .08;
        renderAll(now);
        if (items.some(i => i.vis))
            requestAnimationFrame(frame);
        else
            running = false;
    }
    function kick() {
        if (reduce) {
            renderAll(performance.now());
            return;
        }
        if (!running && items.some(i => i.vis)) {
            running = true;
            requestAnimationFrame(frame);
        }
    }

    if (reduce) {
        items.forEach(i => {
            i.vis = true;
        });
        renderAll(performance.now());
    }
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden)
            kick();
    });
})();
