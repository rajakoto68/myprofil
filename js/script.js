(() => {
    'use strict';
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    const D = window.RM_DATA || { products: [], articles: [] };
    let vw = innerWidth, vh = innerHeight, uid = 0;

    // ---- Visual generator (SVG) ----
    function scene(n, w = 800, h = 600) {
        const id = 'sc' + (++uid), keys = ['exr', 'r1', 'xtr', 'rs'];
        const bg = (a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
        const cx = w / 2, cy = h / 2;
        const open = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">`;
        let c = '';
        switch (n % 12) {
            case 0:
            case 7:
            case 9:
            case 11: {
                const P = {
                    0: ['exr-silver-sm', 900, 656, '#2a2d33', .88], 7: ['exr-silver-sm', 900, 656, '#2a2d33', .88], 9: ['helm-kuning-sm', 700, 591, '#4a4310', .62], 11: ['helm-hitam-sm', 700, 590, '#26262b', .62]
                }[n % 12];
                const iw = w * P[4], ih = iw * P[2] / P[1];
                c = bg('#121214', P[3]) + `<circle cx="${cx}" cy="${cy}" r="${h * .42}" fill="none" stroke="rgba(255,255,255,.08)"/><circle cx="${cx}" cy="${cy}" r="${h * .3}" fill="none" stroke="rgba(246,209,0,.2)" stroke-dasharray="4 10"/>
      <ellipse cx="${cx}" cy="${cy + ih / 2 - 4}" rx="${iw * .42}" ry="${h * .022}" fill="rgba(0,0,0,.55)"/><image href="assets/images/${P[0]}.webp" x="${cx - iw / 2}" y="${cy - ih / 2 - 6}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`;
                break;
            }
            case 1: {
                let sp = '';
                for (let i = 0; i < 16; i++) {
                    const a = i * Math.PI / 8;
                    sp += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * h * .34}" y2="${cy + Math.sin(a) * h * .34}" stroke="#aaa" stroke-width="2"/>`;
                }
                c = bg('#0b0b0d', '#25252b') + `<circle cx="${cx}" cy="${cy}" r="${h * .4}" fill="none" stroke="#111" stroke-width="${h * .09}"/><circle cx="${cx}" cy="${cy}" r="${h * .4}" fill="none" stroke="#2a2a31" stroke-width="${h * .09}" stroke-dasharray="6 14"/><circle cx="${cx}" cy="${cy}" r="${h * .34}" fill="none" stroke="#8d8d96" stroke-width="6"/>${sp}<circle cx="${cx}" cy="${cy}" r="${h * .14}" fill="none" stroke="#f6d100" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${h * .04}" fill="#f6d100"/>`;
                break;
            }
            case 2: {
                let rings = '';
                for (let i = 1; i < 8; i++)
                    rings += `<circle cx="${cx}" cy="${cy}" r="${i * h * .055}" fill="none" stroke="rgba(246,209,0,${.7 - i * .08})" stroke-width="${i % 2 ? 2 : 6}" stroke-dasharray="${i * 3} ${i * 4 + 6}"/>`;
                c = bg('#08080a', '#17171b') + `<circle cx="${cx}" cy="${cy}" r="${h * .46}" fill="rgba(246,209,0,.07)"/>${rings}<circle cx="${cx}" cy="${cy}" r="${h * .05}" fill="#f6d100"><animate attributeName="r" values="${h * .05};${h * .07};${h * .05}" dur="2s" repeatCount="indefinite"/></circle>`;
                break;
            }
            case 3: {
                let t = '';
                for (let i = 0; i <= 28; i++) {
                    const a = Math.PI * (.78 + i / 28 * 1.44), R = h * .36, long = i % 4 === 0;
                    t += `<line x1="${cx + Math.cos(a) * R}" y1="${cy + Math.sin(a) * R}" x2="${cx + Math.cos(a) * (R - (long ? 28 : 14))}" y2="${cy + Math.sin(a) * (R - (long ? 28 : 14))}" stroke="${i > 20 ? '#ff5a1f' : '#fff'}" stroke-width="${long ? 4 : 2}"/>`;
                }
                c = bg('#0c0c0f', '#1d1d22') + t + `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(Math.PI * 1.9) * h * .3}" y2="${cy + Math.sin(Math.PI * 1.9) * h * .3}" stroke="#f6d100" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="16" fill="#f6d100"/><text x="${cx}" y="${cy + h * .24}" text-anchor="middle" fill="#fff" font-family="Unbounded,sans-serif" font-weight="800" font-size="${h * .1}">70 HP</text>`;
                break;
            }
            case 4: {
                let g = '';
                for (let x = 0; x < w; x += 40)
                    g += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="rgba(120,170,255,.18)"/>`;
                for (let y = 0; y < h; y += 40)
                    g += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="rgba(120,170,255,.18)"/>`;
                c = bg('#0b1630', '#10244d') + g + `<g transform="translate(${cx - w * .42} ${cy - w * .42 * .55}) scale(${w * .84 / 600})" fill="none" stroke="#9fc4ff" stroke-width="3"><circle cx="140" cy="262" r="64"/><circle cx="478" cy="262" r="64"/><path d="M140 262L262 238L300 172L392 152L440 168L478 262M262 238L384 230L398 164M170 168C200 156 260 154 304 158"/></g><text x="30" y="${h - 30}" fill="#9fc4ff" font-family="Unbounded,sans-serif" font-size="14" letter-spacing="3">RIDERADIAN / BLUEPRINT EXR</text>`;
                break;
            }
            case 5: {
                let p = '';
                for (let i = 0; i < 14; i++) {
                    const o = i * 22;
                    p += `<path d="M-20 ${h * .3 + o}C${w * .2} ${h * .05 + o} ${w * .4} ${h * .6 + o} ${w * .6} ${h * .3 + o}S${w * .9} ${h * .1 + o} ${w + 20} ${h * .4 + o}" fill="none" stroke="rgba(246,209,0,${.8 - i * .05})" stroke-width="2"/>`;
                }
                c = bg('#0d0d0f', '#1c1a0a') + p;
                break;
            }
            case 6: {
                c = bg('#050506', '#0f0f12') + `<defs><radialGradient id="${id}r" cx=".5" cy=".5"><stop offset="0" stop-color="#fff7c4"/><stop offset=".3" stop-color="#f6d100" stop-opacity=".6"/><stop offset="1" stop-color="#f6d100" stop-opacity="0"/></radialGradient></defs><path d="M${cx} ${cy}L${w} ${cy - h * .3}L${w} ${cy + h * .3}Z" fill="url(#${id}r)" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="${h * .26}" fill="url(#${id}r)"/><circle cx="${cx}" cy="${cy}" r="${h * .13}" fill="#fffbe0"/><circle cx="${cx}" cy="${cy}" r="${h * .19}" fill="none" stroke="#2a2a30" stroke-width="12"/>`;
                break;
            }
            case 8: {
                let wv = '';
                ['#f6d100', '#ff5a1f', '#fff', '#2d6bff'].forEach((col, i) => {
                    let d = `M0 ${h}L0 ${h * (.4 + i * .1)}`;
                    for (let x = 0; x <= w; x += 10)
                        d += `L${x} ${h * (.4 + i * .1) + Math.sin(x / 70 + i) * 26}`;
                    wv += `<path d="${d}L${w} ${h}Z" fill="${col}" opacity="${.9 - i * .16}"/>`;
                });
                c = bg('#0a0a0b', '#1b1b20') + wv;
                break;
            }
            default: {
                c = bg('#f6d100', '#ffb300') + `<text x="${cx}" y="${cy + h * .12}" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="800" font-size="${h * .36}" fill="#0a0a0b" letter-spacing="-8">RM</text>`;
            }
        }
        return open + c + '</svg>';
    }
    // inject visuals
    $$('[data-scene]').forEach(el => {
        const [n, w, h] = el.dataset.scene.split(',').map(Number);
        el.innerHTML = scene(n, w || 800, h || 600);
    });

    // ---- Render produk dari js/data.js ----
    const rp = n => 'Rp ' + Number(n).toLocaleString('id-ID');
    const waLink = p => `https://wa.me/${D.wa || '62812345678'}?text=` + encodeURIComponent(`Halo Rideradian Motor, saya tertarik dengan ${p.name} (${p.color}) seharga ${rp(p.price)}. Apakah stoknya tersedia?`);
    const grpLabel = g => g === 'motor' ? 'MOTOR' : 'HELM';
    $$('[data-render="lineup"]').forEach(el => {
        el.innerHTML = D.products.map(p => `<a class="pcard" href="produk.html#${p.id}" data-cursor>
    <div class="pimg ${p.group === 'helm' ? 'pimg-helm' : ''}" style="--tint:${p.tint}"><img src="${p.img}-sm.webp" alt="${p.name}" loading="lazy"></div>
    <span class="tagn">${grpLabel(p.group)}</span>
    <div class="pbody"><small>${p.cat.toUpperCase()} / ${p.color.toUpperCase()}</small><h3>${p.name}</h3>
    <div class="specs">${p.mini.map(m => `<span><b>${m[0]}</b>${m[1]}</span>`).join('')}</div>
    <div class="price-row"><span>Harga</span><b>${rp(p.price)}</b></div></div></a>`).join('');
    });
    $$('[data-render="products"]').forEach(el => {
        const label = p => p.group === 'helm' ? 'Helm Motocross' : 'Electric Enduro';
        el.innerHTML = D.products.map(p => `<article class="product-card" id="${p.id}" data-category="${p.group}" style="--tint:${p.tint}">
    <button class="fav" type="button" aria-label="Favorit ${p.name}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.7 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.3 0 5.4 3.1 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z"/></svg></button>
    <button type="button" class="pc-hit product-detail" data-product="${p.id}" aria-label="Lihat detail ${p.name}">
      <span class="pc-img ${p.group === 'helm' ? 'is-helm' : ''}"><img src="${p.img}-sm.webp" alt="${p.name}" loading="lazy"></span>
      <span class="pc-cat">${label(p)}</span>
      <span class="pc-name">${p.name}</span>
      <span class="pc-price">${rp(p.price)}</span>
    </button></article>`).join('');
        const bn = $('#shopBanner');
        if (bn && D.products[0]) {
            const f = D.products[0];
            bn.innerHTML = `<button type="button" class="product-detail" data-product="${f.id}" aria-label="Lihat detail ${f.name}"><img src="${f.img}-sm.webp" alt="${f.name}"><span class="bn-tag">NEW</span><span class="bn-text"><small>${f.cat.toUpperCase()} / ${f.color.toUpperCase()}</small><b>${f.name}</b><em>${rp(f.price)}</em></span></button>`;
        }
        $$('.fav', el).forEach(b => b.addEventListener('click', () => {
            const on = b.classList.toggle('on');
            b.setAttribute('aria-pressed', on);
        }));
    });
    $$('[data-render="pricetable"]').forEach(el => {
        el.innerHTML = D.products.map(p => `<tr><td>${p.name}</td><td>${p.cat}</td><td>${p.color}</td><td class="num">${rp(p.price)}</td></tr>`).join('');
    });

    // ---- Split text ----
    let wi = 0;
    function splitNode(node) {
        [...node.childNodes].forEach(ch => {
            if (ch.nodeType === 3) {
                const frag = document.createDocumentFragment();
                ch.textContent.split(/(\s+)/).forEach(tok => {
                    if (!tok)
                        return;
                    if (/^\s+$/.test(tok)) {
                        frag.appendChild(document.createTextNode(' '));
                        return;
                    }
                    const w = document.createElement('span');
                    w.className = 'w';
                    const s = document.createElement('span');
                    s.textContent = tok;
                    s.style.setProperty('--i', wi++);
                    w.appendChild(s);
                    frag.appendChild(w);
                });
                ch.replaceWith(frag);
            }
            else if (ch.nodeType === 1 && ch.tagName !== 'BR')
                splitNode(ch);
        });
    }
    $$('.split').forEach(el => {
        wi = 0;
        el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
        splitNode(el);
    });

    // ---- Loader ----
    const loader = $('.loader'), loaderBar = $('.loader-bar i');
    let ready = false;
    function startPage() {
        if (ready)
            return;
        ready = true;
        loaderBar && (loaderBar.style.width = '100%');
        setTimeout(() => {
            loader && loader.classList.add('done');
            document.body.classList.add('ready');
            $$('.hero .split, .page-hero .split, .hero .reveal, .page-hero .reveal').forEach((e, i) => setTimeout(() => e.classList.add('in'), 350 + i * 120));
            setTimeout(() => loader && loader.remove(), 1400);
        }, 350);
    }
    let lp = 0;
    const lt = setInterval(() => {
        lp = Math.min(90, lp + Math.random() * 18);
        loaderBar && (loaderBar.style.width = lp + '%');
    }, 120);
    addEventListener('load', () => {
        clearInterval(lt);
        startPage();
        measure();
    });
    setTimeout(() => {
        clearInterval(lt);
        startPage();
    }, 3500);
    if (!loader)
        startPage();

    // ---- Navbar ----
    const nav = $('.site-nav'), links = $('.nav-links'), ind = $('.nav-indicator');
    const page = document.body.dataset.page;
    $$('[data-page]', document).forEach(a => {
        if (a.tagName === 'A' && a.dataset.page === (page === 'artikel-detail' ? 'artikel' : page))
            a.classList.add('active');
    });
    function moveInd(a) {
        if (!ind || !a) {
            ind && (ind.style.opacity = 0);
            return;
        }
        ind.style.opacity = 1;
        ind.style.width = a.offsetWidth + 'px';
        ind.style.transform = `translateX(${a.offsetLeft}px)`;
    }
    if (links) {
        const act = () => $('a.active', links);
        $$('a', links).forEach(a => a.addEventListener('mouseenter', () => moveInd(a)));
        links.addEventListener('mouseleave', () => moveInd(act()));
        addEventListener('load', () => moveInd(act()));
        addEventListener('resize', () => moveInd(act()));
        setTimeout(() => moveInd(act()), 100);
    }
    const toggle = $('#menuToggle');
    function setMenu(open) {
        document.body.classList.toggle('menu-open', open);
        toggle && toggle.setAttribute('aria-expanded', open);
        document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    toggle && toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('.mobile-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('resize', () => {
        if (innerWidth > 900)
            setMenu(false);
    });
    addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            setMenu(false);
            closeModal();
            closeLb();
        }
    });

    // ---- Scroll engine (nilai scroll yang di-lerp untuk parallax) ----
    let target = scrollY, cur = scrollY, vel = 0, lastY = scrollY;
    const progressBar = $('.scroll-progress'), toTop = $('.to-top');
    const lightSecs = $$('[data-nav="light"]');
    const parallax = $$('[data-speed]').map(el => ({
        el, s: +el.dataset.speed, base: 0, h: 0
    }));
    const xmove = $$('[data-xspeed]').map(el => ({
        el, s: +el.dataset.xspeed, base: 0, h: 0
    }));
    const pins = $$('.pin-wrap').map(w => ({
        w, track: $('.pin-track', w), bar: $('.pin-progress i', w), top: 0, total: 0, dist: 0
    }));
    const statements = $$('[data-words]').map(el => {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map(w => `<span class="wd">${w}</span>`).join(' ');
        return {
            el, sp: $$('.wd', el), top: 0, h: 0
        };
    });
    const tls = $$('.timeline').map(el => ({
        el, line: $('.tl-line i', el), top: 0, h: 0
    }));
    const abs = el => {
        let t = 0;
        while (el) {
            t += el.offsetTop;
            el = el.offsetParent;
        }
        return t;
    };

    // ---- Hero ----
    const hx = $('#hx');
    const hxo = hx && {
        bike: $('#hxBike'), yel: $('.hx-yellow', hx), scan: $('.hx-scan', hx), word: $('.hx-word span', hx), streaks: $('.hx-streaks', hx),
        c1: $('.hx-c1', hx), c2: $('.hx-c2', hx), c3: $('.hx-c3', hx), c4: $('.hx-c4', hx), co: $$('.hx-co', hx), sw: $$('[data-sw]', hx),
        specs: $('.hx-specs', hx), hint: $('.hx-hint', hx), bar: $('.hx-progress i', hx), top: 0, total: 1
    };
    const seg = (p, a, b) => clamp((p - a) / (b - a));
    const eio = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const eout = t => 1 - Math.pow(1 - t, 3);
    if (hxo)
        hxo.co.forEach(c => {
            const dx = parseFloat(c.style.getPropertyValue('--dx')), dy = parseFloat(c.style.getPropertyValue('--dy'));
            c.style.setProperty('--len', Math.hypot(dx, dy) + 'px');
            c.style.setProperty('--ang', Math.atan2(dy, dx) + 'rad');
        });
    function hxMeasure() {
        if (!hxo)
            return;
        hxo.top = abs(hx);
        hxo.total = Math.max(1, hx.offsetHeight - vh);
    }
    function hxTick(y) {
        if (!hxo || hx.classList.contains('hx-static'))
            return;
        const p = clamp((y - hxo.top) / hxo.total), o = hxo;
        const w = eio(seg(p, .17, .40));
        o.yel.style.clipPath = `inset(0 ${((1 - w) * 100).toFixed(2)}% 0 0)`;
        o.scan.style.left = (w * 100).toFixed(2) + '%';
        const sOn = w > .005 && w < .995;
        o.scan.style.opacity = sOn ? 1 : 0;
        o.scan.style.visibility = sOn ? 'visible' : 'hidden';
        o.sw.forEach((s, i) => s.classList.toggle('on', i === (w > .5 ? 1 : 0)));
        const z = eio(seg(p, .46, .60)) - eio(seg(p, .78, .86)), sc = 1 + .13 * z;
        const ex = eio(seg(p, .86, 1));
        o.bike.style.setProperty('--inv', (1 / sc).toFixed(4));
        o.bike.style.transform = `translate3d(${(ex * 125).toFixed(2)}vw,0,0) scale(${sc.toFixed(4)}) skewX(${(-ex * 9).toFixed(2)}deg)`;
        o.word.style.transform = `translate3d(${(-p * 14 + 7).toFixed(2)}vw,0,0)`;
        o.streaks.style.opacity = (Math.sin(Math.PI * clamp(ex * 1.15)) * .9).toFixed(3);
        const fade = (el, a, b, c, d, dy = 28) => {
            const v = seg(p, a, b) * (1 - seg(p, c, d));
            el.style.opacity = v.toFixed(3);
            el.style.transform = `translate3d(0,${((1 - v) * dy).toFixed(1)}px,0)`;
            el.style.visibility = v < .01 ? 'hidden' : 'visible';
        };
        const v1 = 1 - seg(p, .08, .20);
        o.c1.style.opacity = v1.toFixed(3);
        o.c1.style.transform = `translate3d(0,${(-(1 - v1) * 40).toFixed(1)}px,0)`;
        o.c1.style.visibility = v1 < .01 ? 'hidden' : 'visible';
        o.c1.style.pointerEvents = v1 < .5 ? 'none' : '';
        fade(o.c2, .26, .36, .44, .52);
        fade(o.c3, .56, .64, .76, .82);
        fade(o.c4, .90, .97, 1.01, 1.02);
        o.co.forEach((c, i) => c.classList.toggle('on', p > .54 + i * .04 && p < .78));
        o.specs.style.opacity = (seg(p, .56, .64) * (1 - seg(p, .76, .82))).toFixed(3);
        o.hint.style.opacity = (1 - seg(p, .02, .08)).toFixed(3);
        o.bar.style.transform = `scaleX(${p.toFixed(4)})`;
    }
    if (hx && reduce) {
        hx.classList.add('hx-static');
        $('.hx-yellow', hx).style.clipPath = 'none';
        $$('.hx-co', hx).forEach(c => c.classList.add('on'));
    }

    function measure() {
        vw = innerWidth;
        vh = innerHeight;
        parallax.forEach(p => {
            p.el.style.transform = '';
            p.base = abs(p.el);
            p.h = p.el.offsetHeight;
        });
        xmove.forEach(p => {
            p.el.style.transform = '';
            p.base = abs(p.el);
            p.h = p.el.offsetHeight;
        });
        hxMeasure();
        pins.forEach(p => {
            p.top = abs(p.w);
            p.total = p.w.offsetHeight - vh;
            p.dist = p.track.scrollWidth - vw + 40;
        });
        statements.forEach(s => {
            s.top = abs(s.el);
            s.h = s.el.offsetHeight;
        });
        tls.forEach(t => {
            t.top = abs(t.el);
            t.h = t.el.offsetHeight;
        });
    }
    measure();
    addEventListener('resize', () => {
        measure();
        sizeCanvases();
    });
    addEventListener('scroll', () => {
        target = scrollY;
    }, { passive: true });

    let lastNavY = 0;
    function onScroll(y) {
        const max = document.documentElement.scrollHeight - vh;
        progressBar && (progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`);
        toTop && toTop.classList.toggle('show', y > 700);
        if (nav) {
            nav.classList.toggle('scrolled', y > 40);
            if (!document.body.classList.contains('menu-open'))
                nav.classList.toggle('hide', y > 400 && y > lastNavY + 4 ? true : (y < lastNavY - 4 ? false : nav.classList.contains('hide')));
            lastNavY = y;
            let light = false;
            const probe = y + 44;
            for (const s of lightSecs) {
                const t = abs(s);
                if (probe >= t && probe <= t + s.offsetHeight) {
                    light = true;
                    break;
                }
            }
            if (document.body.classList.contains('sc-light'))
                light = true;
            nav.classList.toggle('on-light', light);
        }
    }
    function frame(t) {
        const ease = reduce ? 1 : .09;
        cur = lerp(cur, target, ease);
        if (Math.abs(target - cur) < .1)
            cur = target;
        vel = lerp(vel, target - lastY, .2);
        lastY = target;
        onScroll(target);
        parallax.forEach(p => {
            const c = (cur + vh / 2) - (p.base + p.h / 2);
            if (Math.abs(c) < vh * 2)
                p.el.style.transform = `translate3d(0,${(-c * p.s).toFixed(1)}px,0)`;
        });
        xmove.forEach(p => {
            const c = (cur + vh / 2) - (p.base + p.h / 2);
            if (Math.abs(c) < vh * 2)
                p.el.style.transform = `translate3d(${(c * p.s).toFixed(1)}px,0,0)`;
        });
        pins.forEach(p => {
            if (vw <= 760 || reduce)
                return;
            const pr = clamp((cur - p.top) / p.total);
            p.track.style.transform = `translate3d(${-pr * p.dist}px,0,0)`;
            p.bar && (p.bar.style.transform = `scaleX(${pr})`);
        });
        statements.forEach(s => {
            const pr = clamp((cur + vh * .8 - s.top) / (s.h + vh * .3)), n = Math.floor(pr * s.sp.length * 1.08);
            s.sp.forEach((w, i) => w.classList.toggle('lit', i < n));
        });
        tls.forEach(t => {
            const pr = clamp((cur + vh * .6 - t.top) / t.h);
            t.line.style.transform = `scaleY(${pr})`;
        });
        hxTick(cur);
        drawWaves(reduce ? 0 : t / 1000);
        drawParticles();
        cursorTick();
        requestAnimationFrame(frame);
    }

    // Anchor halus dan tombol ke atas
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const el = $(a.getAttribute('href'));
        if (!el)
            return;
        e.preventDefault();
        scrollTo({ top: abs(el) - 90, behavior: reduce ? 'auto' : 'smooth' });
    }));
    toTop && toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

    // ---- Reveal saat scroll ----
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting)
            return;
        const el = e.target;
        el.classList.add('in');
        io.unobserve(el);
        if (el.dataset.count !== undefined)
            countUp(el);
        $$('[data-count]', el).forEach(countUp);
    }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal,.reveal-l,.reveal-r,.stagger,.clip-reveal,.tl-item,.bar-list,.split:not(.hero .split):not(.page-hero .split)').forEach(el => io.observe(el));
    $$('.stagger').forEach(s => [...s.children].forEach((c, i) => c.style.setProperty('--i', i)));
    $$('[data-count]').forEach(el => io.observe(el));
    function countUp(el) {
        if (el._done)
            return;
        el._done = true;
        const end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now(), dur = 1800;
        (function step(t) {
            const p = clamp((t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
            el.textContent = (end * e).toFixed(dec) + suf;
            if (p < 1)
                requestAnimationFrame(step);
        })(t0);
    }

    // ---- Interaksi: magnetic, tilt, spotlight, kursor ----
    if (fine && !reduce) {
        $$('.btn,.nav-cta,.to-top,.lb-btn').filter(b => !b.closest('.legacy-motion')).forEach(b => {
            b.addEventListener('mousemove', e => {
                const r = b.getBoundingClientRect();
                b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
            });
            b.addEventListener('mouseleave', () => {
                b.style.transform = '';
            });
        });
        const hb = $('.hero-bike'), st = $('.bike-stage');
        if (hb && st) {
            let tx = 0, ty = 0, cx = 0, cy = 0;
            addEventListener('mousemove', e => {
                tx = (e.clientX / vw - .5);
                ty = (e.clientY / vh - .5);
            });
            (function tl() {
                cx = lerp(cx, tx, .06);
                cy = lerp(cy, ty, .06);
                st.style.transform = `rotateY(${cx * 14}deg) rotateX(${-cy * 10}deg) translate3d(${cx * -16}px,${cy * -10}px,0)`;
                requestAnimationFrame(tl);
            })();
        }
    }
    $$('.feature').forEach(f => f.addEventListener('mousemove', e => {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        f.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
    const cur1 = $('.cursor'), cur2 = $('.cursor-dot');
    let mx = -100, my = -100, rx = -100, ry = -100;
    if (fine && cur1) {
        addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            document.body.classList.add('has-cursor');
        });
        document.addEventListener('mouseover', e => {
            cur1.classList.toggle('big', !!e.target.closest('[data-cursor]'));
        });
    }
    function cursorTick() {
        if (!cur1)
            return;
        rx = lerp(rx, mx, .18);
        ry = lerp(ry, my, .18);
        cur1.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        cur2.style.transform = `translate3d(${mx}px,${my}px,0)`;
    }

    // ---- Canvas: partikel dan gelombang ----
    const pc = $('#particles');
    let pctx, parts = [], pvis = true, pmx = -999, pmy = -999;
    function initParticles() {
        if (!pc)
            return;
        pctx = pc.getContext('2d');
        const dpr = Math.min(devicePixelRatio, 2);
        pc.width = pc.clientWidth * dpr;
        pc.height = pc.clientHeight * dpr;
        pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.round(clamp(pc.clientWidth / 18, 24, 80));
        parts = Array.from({ length: n }, () => ({
            x: Math.random() * pc.clientWidth, y: Math.random() * pc.clientHeight, r: Math.random() * 2 + .6, vx: (Math.random() - .5) * .25, vy: -Math.random() * .5 - .15, a: Math.random() * .6 + .2
        }));
        new IntersectionObserver(es => pvis = es[0].isIntersecting).observe(pc);
        pc.parentElement.addEventListener('mousemove', e => {
            const r = pc.getBoundingClientRect();
            pmx = e.clientX - r.left;
            pmy = e.clientY - r.top;
        });
    }
    function drawParticles() {
        if (!pctx || !pvis)
            return;
        const W = pc.clientWidth, H = pc.clientHeight;
        pctx.clearRect(0, 0, W, H);
        for (const p of parts) {
            const dx = p.x - pmx, dy = p.y - pmy, d = Math.hypot(dx, dy);
            if (d < 120) {
                p.x += dx / d * 1.6;
                p.y += dy / d * 1.6;
            }
            p.x += p.vx;
            p.y += p.vy + vel * -.02;
            if (p.y < -10) {
                p.y = H + 10;
                p.x = Math.random() * W;
            }
            if (p.x < -10)
                p.x = W + 10;
            if (p.x > W + 10)
                p.x = -10;
            pctx.beginPath();
            pctx.arc(p.x, p.y, p.r, 0, 7);
            pctx.fillStyle = `rgba(246,209,0,${p.a})`;
            pctx.fill();
        }
        for (let i = 0; i < parts.length; i++)
            for (let j = i + 1; j < parts.length; j++) {
                const a = parts[i], b = parts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 90) {
                    pctx.strokeStyle = `rgba(246,209,0,${(1 - d / 90) * .16})`;
                    pctx.beginPath();
                    pctx.moveTo(a.x, a.y);
                    pctx.lineTo(b.x, b.y);
                    pctx.stroke();
                }
            }
    }
    initParticles();
    addEventListener('resize', initParticles);

    const waves = $$('canvas[data-layers]').map(c => ({
        c, ctx: c.getContext('2d'), cols: c.dataset.layers.split('|'), vis: true, w: 0, h: 0, speed: +(c.dataset.speed || 1)
    }));
    function sizeCanvases() {
        waves.forEach(w => {
            const dpr = Math.min(devicePixelRatio, 2);
            w.w = w.c.clientWidth;
            w.h = w.c.clientHeight;
            w.c.width = w.w * dpr;
            w.c.height = w.h * dpr;
            w.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        });
    }
    sizeCanvases();
    waves.forEach(w => new IntersectionObserver(es => w.vis = es[0].isIntersecting).observe(w.c));
    function drawWaves(t) {
        const boost = clamp(Math.abs(vel) * .012, 0, 1.4);
        waves.forEach(w => {
            if (!w.vis)
                return;
            const { ctx, W = w.w, H = w.h } = w;
            ctx.clearRect(0, 0, W, H);
            w.cols.forEach((col, i) => {
                const n = w.cols.length, amp = H * (.16 + i * .035) * (1 + boost), f = (1.3 + i * .55) * Math.PI * 2 / W, ph = t * (.8 + i * .35) * w.speed * (i % 2 ? 1 : -1) + i * 1.9, y0 = H * (.38 + i * (.5 / n));
                ctx.beginPath();
                ctx.moveTo(0, H);
                for (let x = 0; x <= W; x += 6)
                    ctx.lineTo(x, y0 + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.1 + ph * 1.5) * amp * .32);
                ctx.lineTo(W, H);
                ctx.closePath();
                ctx.fillStyle = col;
                ctx.fill();
            });
        });
    }

    // ---- Produk: filter dan modal ----
    const modal = $('#productModal');
    let modalTrigger = null;
    function openModal(key) {
        const p = D.products.find(x => x.id === key);
        if (!p || !modal)
            return;
        $('#modalTitle').textContent = p.name;
        $('#modalText').textContent = p.long;
        $('#modalCat').textContent = p.cat.toUpperCase() + ' / ' + p.color.toUpperCase();
        $('#modalPrice').textContent = rp(p.price);
        $('#modalWA').href = waLink(p);
        const mi = $('#modalImg');
        mi.src = p.img + '.webp';
        mi.alt = p.name;
        mi.parentElement.style.setProperty('--tint', p.tint);
        mi.parentElement.classList.toggle('is-helm', p.group === 'helm');
        $('#modalSpecs').innerHTML = p.specs.map(s => `<div>${s[0]}<b>${s[1]}</b></div>`).join('');
        modalTrigger = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        $('#modalClose').focus({ preventScroll: true });
    }
    function closeModal() {
        if (!modal || !modal.classList.contains('open'))
            return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.documentElement.style.overflow = '';
        modalTrigger?.focus({ preventScroll: true });
    }
    modal?.addEventListener('keydown', e => {
        if (e.key !== 'Tab')
            return;
        const items = $$('button,a[href]', modal), first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
    $$('.product-detail').forEach(b => b.addEventListener('click', () => openModal(b.dataset.product)));
    $('#modalClose') && $('#modalClose').addEventListener('click', closeModal);
    modal && modal.addEventListener('click', e => {
        if (e.target === modal)
            closeModal();
    });
    $$('.filter').forEach(f => f.addEventListener('click', () => {
        $$('.filter').forEach(x => x.classList.toggle('active', x === f));
        $$('.product-card').forEach(c => {
            const show = f.dataset.filter === 'all' || c.dataset.category === f.dataset.filter;
            if (show) {
                c.classList.remove('hide');
                c.animate([{ opacity: 0, transform: 'translateY(30px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
            }
            else
                c.classList.add('hide');
        });
        const cnt = $('#shopCount');
        if (cnt) {
            const n = $$('.product-card:not(.hide)').length;
            cnt.textContent = n + ' produk';
        }
        measure();
    }));
    if (location.hash && $(location.hash) && $(location.hash).classList.contains('product-card'))
        setTimeout(() => scrollTo({ top: abs($(location.hash)) - 110 }), 900);

    // ---- Galeri: lightbox ----
    const lb = $('#lightbox');
    let lbIdx = 0;
    const gItems = $$('.gallery-item');
    function showLb(i) {
        lbIdx = (i + gItems.length) % gItems.length;
        const g = gItems[lbIdx];
        const st = $('#lbStage');
        st.innerHTML = $('.gfig', g).innerHTML;
        const v = $('video', st);
        if (v) {
            v.muted = false;
            v.controls = true;
            v.loop = true;
            v.setAttribute('playsinline', '');
            v.play().catch(() => {
                v.muted = true;
                v.play().catch(() => { });
            });
        }
        $('#lbCap').textContent = g.dataset.title + '  —  ' + String(lbIdx + 1).padStart(2, '0') + ' / ' + String(gItems.length).padStart(2, '0');
    }
    function openLb(i) {
        if (!lb)
            return;
        showLb(i);
        lb.classList.add('open');
        document.documentElement.style.overflow = 'hidden';
    }
    function closeLb() {
        if (!lb)
            return;
        lb.classList.remove('open');
        document.documentElement.style.overflow = '';
        $$('video', $('#lbStage')).forEach(v => v.pause());
        setTimeout(() => {
            if (!lb.classList.contains('open'))
                $('#lbStage').innerHTML = '';
        }, 500);
    }
    gItems.forEach((g, i) => g.addEventListener('click', () => openLb(i)));
    if ('IntersectionObserver' in window) {
        const vio = new IntersectionObserver(es => es.forEach(e => {
            const v = e.target;
            if (e.isIntersecting)
                v.play().catch(() => { });
            else
                v.pause();
        }), { threshold: .35 });
        $$('.gallery-item video').forEach(v => vio.observe(v));
    }
    $('.lb-close') && $('.lb-close').addEventListener('click', closeLb);
    $('.lb-prev') && $('.lb-prev').addEventListener('click', () => showLb(lbIdx - 1));
    $('.lb-next') && $('.lb-next').addEventListener('click', () => showLb(lbIdx + 1));
    lb && lb.addEventListener('click', e => {
        if (e.target === lb)
            closeLb();
    });
    addEventListener('keydown', e => {
        if (!lb || !lb.classList.contains('open'))
            return;
        if (e.key === 'ArrowRight')
            showLb(lbIdx + 1);
        if (e.key === 'ArrowLeft')
            showLb(lbIdx - 1);
    });

    // ---- Detail artikel ----
    if (page === 'artikel-detail') {
        const id = new URLSearchParams(location.search).get('id'), a = D.articles.find(x => x.id === id) || D.articles[0];
        if (a) {
            document.title = a.title + ' — Rideradian Motor';
            $('#detailMeta').textContent = a.meta;
            $('#detailTitle').textContent = a.title;
            $('#detailIntro').textContent = a.intro;
            $('#detailImage').innerHTML = a.img ? `<img src="${a.img}" alt="${a.title}" draggable="false">` : scene(a.art, 1200, 675);
            $('#detailContent').innerHTML = a.body.map(b => b.h ? `<h2>${b.h}</h2>` : b.q ? `<blockquote>${b.q}</blockquote>` : `<p>${b.p}</p>`).join('');
            const i = D.articles.indexOf(a), nx = D.articles[(i + 1) % D.articles.length];
            $('#nextArticle').href = 'artikel-detail.html?id=' + nx.id;
            $('#nextTitle').textContent = nx.title;
        }
    }

    // ---- Form kontak (kirim ke WhatsApp) ----
    const form = $('#contactForm');
    form && form.addEventListener('submit', e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(form)), st = $('#formStatus');
        const txt = `Halo Rideradian Motor,%0A%0ANama: ${encodeURIComponent(d.name)}%0AEmail: ${encodeURIComponent(d.email)}%0AWhatsApp: ${encodeURIComponent(d.phone || '-')}%0ASubjek: ${encodeURIComponent(d.subject)}%0A%0A${encodeURIComponent(d.message)}`;
        st.textContent = 'Pesan siap. Membuka WhatsApp…';
        window.open(`https://wa.me/62812345678?text=${txt}`, '_blank', 'noopener');
        form.reset();
    });

    // ---- Mulai ----
    $$('.year').forEach(y => y.textContent = new Date().getFullYear());
    requestAnimationFrame(frame);
})();
