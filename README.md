# Lutful Store

Lutful Store adalah website marketplace online shop interaktif berbasis HTML, CSS, dan JavaScript biasa. Pengguna dapat mencari produk, memfilter kategori, menambah ke keranjang, dan checkout tanpa backend.

## Fitur Utama

- **Keranjang Belanja**: Ikon di header dengan badge jumlah item, drawer slide dari kanan
- **Manajemen Item**: Tambah, kurangi quantity (+/-), hapus item, subtotal otomatis
- **Total Belanja**: Jumlah barang, subtotal, total dalam format Rupiah Indonesia (Rp299.000)
- **Persistensi localStorage**: Keranjang tersimpan otomatis, tetap ada setelah refresh browser
- **Checkout Modal**: Form nama, WhatsApp, alamat, catatan + ringkasan pesanan
- **Pembuatan Pesanan**: Validasi form, nomor pesanan otomatis (format LS-YYYYMMDD-HHMMSS-XXX), kosongkan keranjang setelah sukses
- **Detail Produk Modal**: Klik kartu produk untuk lihat nama, kategori, harga, deskripsi, tombol tambah ke keranjang
- **Pencarian & Filter Kategori**: Real-time search + chip kategori (Semua, Elektronik, Fashion, Makanan, Aksesori, Olahraga)
- **UI Modern Marketplace**: Tema hitam/biru/putih, mobile-first, responsive, no horizontal scroll, drawer/modal nyaman di HP

## Struktur File

| File | Fungsi |
|---|---|
| `index.html` | Struktur utama: header (brand, nav, cart), search, kategori, product grid, footer, cart drawer, 3 modal |
| `style.css` | Tema warna, layout grid, kartu produk, cart drawer animasi, modal, responsive breakpoints, toast notification |
| `script.js` | State management, cart CRUD + localStorage, search/filter, modal handling, form validation, order generation |
| `README.md` | Dokumentasi ini |

## Cara Menjalankan

1. Clone atau unduh repository ini
2. Buka folder repository
3. Buka file `index.html` langsung di browser (double-click atau drag ke browser)
4. **Fitur yang bisa dicoba:**
   - Ketik di kotak pencarian untuk filter nama produk
   - Klik chip kategori untuk filter kategori
   - Klik nama/gambar produk → buka detail modal
   - Klik "Tambah ke Keranjang" → badge bertambah, buka drawer lihat item
   - Di drawer: tekan +/-, hapus, lihat total otomatis
   - Klik "Checkout" → isi form → "Buat Pesanan" → lihat nomor pesanan
   - Refresh halaman → keranjang tetap tersimpan

## Teknologi

- HTML5 (semantic, accessible)
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (ES6+, IIFE module pattern, localStorage API)

## Catatan

- **Tidak memerlukan** instalasi package, build tool, server, database, backend, API, payment gateway, atau framework
- Semua file saling terhubung dan langsung jalan di browser modern
- Data produk bersifat contoh (hardcoded di HTML)
- Nomor pesanan format: `LS-YYYYMMDD-HHMMSS-XXX` (contoh: `LS-20260115-143022-042`)

## Identitas Brand

- **Nama**: Lutful Store
- **Tagline**: marketplace online
- **Warna**: Hitam (#0b0f19), Biru (#2563eb), Putih (#ffffff)
- **Prioritas**: Mobile/Android first, desktop tetap rapi