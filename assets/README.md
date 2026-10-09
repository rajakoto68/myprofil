# Rideradian Motor

Website statis (HTML, CSS, JavaScript) tanpa build step. Buka `index.html` langsung,
atau jalankan server lokal:

```
python3 -m http.server 8080
```

lalu buka `http://localhost:8080`. Saat hosting, upload seluruh isi folder
(termasuk `assets/images/hero-sequence/`).

## Struktur

```
index.html, tentang.html, produk.html, galeri.html,
artikel.html, artikel-detail.html, kontak.html

css/
  style.css       stylesheet utama (layout, komponen, navbar, galeri)
  theme.css       logo, gelombang, bento, kartu, footer (dimuat setelah style.css)
  hero.css        hero scroll di beranda
  manifesto.css   section "Kami percaya motor yang hebat"

js/
  data.js         katalog produk dan artikel
  script.js       navbar, reveal, produk, galeri, form kontak
  hero.js         animasi hero (120 frame, scroll)
  manifesto.js    animasi teks + video manifesto
  waves.js        gelombang canvas

assets/
  images/         foto produk, artikel, logo, hero-sequence
  gallery/        foto dan video halaman galeri
  video/          video manifesto
```

## Mengubah isi

- **Produk dan artikel** (nama, harga, spesifikasi): `js/data.js`.
- **Galeri**: item ada di `galeri.html` (`.gallery-item`). Tata letak grid diatur di
  `css/style.css` bagian "gallery bento". Video otomatis diputar tanpa suara saat terlihat,
  dan dengan kontrol di lightbox.
- **Hero**: daftar fitur dan gambar kartu ada di `.sc-list` dan `.sc-card` pada `index.html`,
  caption di array `captions` pada `js/hero.js`. Panjang animasi diatur lewat `height`
  pada `.hero-scroll` di `css/hero.css`.
- **Manifesto**: ganti `assets/video/manifesto.mp4` dan `manifesto-poster.jpg`. Panjang
  animasi diatur lewat `height` pada `.mf` di `css/manifesto.css`.
- **Gelombang**: elemen `.wv` dengan atribut `data-*`, penjelasan di kepala `js/waves.js`.

## Catatan

- Navbar desktop berupa pill mengambang. Di layar ≤ 900px berubah menjadi dock di bawah
  layar (aman untuk notch).
- Perangkat dengan "reduce motion" mendapat versi statis dari hero, manifesto, dan gelombang.
- Form kontak membuka WhatsApp dengan pesan terisi. Ubah nomor di `js/script.js`
  (bagian form kontak).
