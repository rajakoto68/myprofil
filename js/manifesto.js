
(() => {
    const root = document.getElementById('manifesto');
    if (!root)
        return;
    const $ = (s) => root.querySelector(s);
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const seg = (p, a, b) => clamp((p - a) / (b - a));
    const eio = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const NS = 'http://www.w3.org/2000/svg';

    const media = $('.mf-media'), vidWrap = $('.mf-video'), vid = $('video'), plate = $('.mf-plate');
    const kicker = $('.mf-kicker'), hint = $('.mf-hint'), panelIn = $('.mf-panel-in'), sub = $('.mf-sub'), ghost = $('.mf-ghost');
    const title = $('.mf-title');
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words.map(w => `<span class="wd">${w}</span>`).join(' ');
    const wd = [...title.querySelectorAll('.wd')];

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playVid = () => {
        const p = vid.play();
        if (p && p.catch)
            p.catch(() => { });
    };
    if (reduce) {
        root.classList.add('mf-static');
        playVid();
        return;
    }

    const mask = plate.querySelector('#mfMask'), maskBg = mask.querySelector('rect'), maskG = mask.querySelector('g');
    const plateRect = plate.querySelector('#mfPlate'), outG = plate.querySelector('#mfOut');
    let W = 0, H = 0, fs = 0, fx = 0, fy = 0, Smax = 40, lines = [];

    function mk(parent, txt, x, y, size, len, extra) {
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', x);
        t.setAttribute('y', y);
        t.setAttribute('font-size', size);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('textLength', len);
        t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        if (extra)
            for (const k in extra)
                t.setAttribute(k, extra[k]);
        t.textContent = txt;
        parent.appendChild(t);
        return t;
    }

    function layout() {
        W = media.clientWidth;
        H = media.clientHeight;
        maskBg.setAttribute('width', W);
        maskBg.setAttribute('height', H);
        plateRect.setAttribute('width', W);
        plateRect.setAttribute('height', H);
        mask.setAttribute('x', 0);
        mask.setAttribute('y', 0);
        mask.setAttribute('width', W);
        mask.setAttribute('height', H);
        plate.setAttribute('viewBox', `0 0 ${W} ${H}`);
        maskG.innerHTML = '';
        outG.innerHTML = '';
        const portrait = W / H < .8;
        const rows = portrait ? ['RIDER', 'ADIAN'] : ['RIDERADIAN'];
        const len = W * (portrait ? .86 : .92);
        fs = portrait ? Math.min(len / 3.7, H * .2) : Math.min(len / 7.9, H * .4);
        const lh = fs * 1.05, cy = H / 2, cap = fs * .7;
        lines = rows.map((r, i) => {
            const base = cy + (i - (rows.length - 1) / 2) * lh + cap / 2;
            const a = mk(maskG, r, W / 2, base, fs, len, { fill: '#000' });
            mk(outG, r, W / 2, base, fs, len, { fill: 'none', stroke: 'rgba(255,255,255,.38)', 'stroke-width': 1.2 });
            return { a, base };
        });
        // titik fokus zoom: batang kiri huruf "D" (indeks 2 di baris pertama)
        try {
            const ext = lines[0].a.getExtentOfChar(2);
            fx = ext.x + ext.width * .2;
            fy = lines[0].base - cap / 2;
        }
        catch (e) {
            fx = W / 2;
            fy = H / 2;
        }
        Smax = Math.max(24, (W * 1.1) / (fs * .16));
    }

    function setZoom(t) {
        const e = eio(t), s = Math.exp(Math.log(Smax) * e), tp = e * e * (3 - 2 * e);
        const px = lerp(fx, W / 2, tp), py = lerp(fy, H / 2, tp);
        const tr = `translate(${(px - s * fx).toFixed(2)} ${(py - s * fy).toFixed(2)}) scale(${s.toFixed(4)})`;
        maskG.setAttribute('transform', tr);
        outG.setAttribute('transform', tr);
        outG.setAttribute('stroke-width', (1.2 / s).toFixed(4));
        outG.querySelectorAll('text').forEach(n => n.setAttribute('stroke-width', (1.2 / s).toFixed(4)));
        return e;
    }

    let cur = -1, goal = 0, active = false, vidOn = false;
    function progress() {
        const r = root.getBoundingClientRect(), total = Math.max(1, r.height - innerHeight);
        return clamp(-r.top / total);
    }

    function render(p) {
        const t = seg(p, .02, .42);
        const e = setZoom(t);
        const plateOp = 1 - seg(t, .55, .97);
        plate.style.opacity = plateOp.toFixed(3);
        plate.style.visibility = plateOp < .005 ? 'hidden' : 'visible';
        vidWrap.style.transform = `scale(${(1.35 - .35 * e).toFixed(4)})`;
        const k = 1 - seg(p, .0, .07);
        kicker.style.opacity = k.toFixed(3);
        kicker.style.transform = `translate3d(0,${((1 - k) * -24).toFixed(1)}px,0)`;
        hint.style.opacity = (1 - seg(p, .01, .06)).toFixed(3);

        const u = eio(seg(p, .6, .82));
        media.style.transform = `translate3d(0,${(-u * 101).toFixed(3)}%,0)`;
        media.style.visibility = u >= 1 ? 'hidden' : 'visible';
        const wantVid = u < 1 && active;
        if (wantVid !== vidOn) {
            vidOn = wantVid;
            wantVid ? playVid() : vid.pause();
        }
        panelIn.style.transform = `translate3d(0,${((1 - u) * 14).toFixed(2)}vh,0)`;
        ghost.style.transform = `translate3d(${(-seg(p, .6, 1) * 22).toFixed(2)}vw,0,0)`;

        const wp = seg(p, .72, .95) * wd.length;
        wd.forEach((w, i) => w.classList.toggle('lit', i < wp));
        const sv = seg(p, .9, .99);
        sub.style.opacity = sv.toFixed(3);
        sub.style.transform = `translate3d(0,${((1 - sv) * 18).toFixed(1)}px,0)`;
    }

    function frame() {
        if (active || cur < 0) {
            goal = progress();
            cur = cur < 0 ? goal : lerp(cur, goal, .14);
            if (Math.abs(cur - goal) < .0004)
                cur = goal;
            render(cur);
        }
        requestAnimationFrame(frame);
    }

    new IntersectionObserver(([en]) => {
        active = en.isIntersecting;
        if (!active) {
            vid.pause();
            vidOn = false;
        }
    }, { rootMargin: '200px 0px' }).observe(root);
    addEventListener('resize', () => {
        layout();
        cur = -1;
    });
    layout();
    if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(() => {
            layout();
            cur = -1;
        });
    addEventListener('load', () => {
        layout();
        cur = -1;
    });
    playVid();
    requestAnimationFrame(frame);
})();
