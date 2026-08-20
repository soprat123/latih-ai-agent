# Lutful Store

Lutful Store adalah mini e-commerce frontend berbasis HTML, CSS, dan JavaScript vanilla. Website ini menampilkan katalog produk contoh, pencarian, filter kategori, sorting, detail produk, keranjang belanja dengan localStorage, serta simulasi checkout tanpa backend.

## Fitur

- Data produk terstruktur di JavaScript (minimal 8 produk contoh)
- Render kartu produk dinamis dari array data
- Pencarian produk berdasarkan nama (case-insensitive)
- Filter kategori yang bisa digabung dengan pencarian
- Sorting: default, harga termurah, harga termahal, nama A-Z
- Modal detail produk
- Keranjang belanja (tambah, ubah jumlah, hapus)
- Validasi stok agar quantity tidak melebihi stok
- Produk stok 0 tampil sebagai "Stok Habis"
- Badge jumlah item di tombol keranjang
- Total belanja berformat Rupiah (`Intl.NumberFormat`)
- Persistensi keranjang lewat `localStorage`
- Checkout simulasi dengan validasi form pembeli
- Tampilan responsif untuk HP, tablet, dan desktop
- Accessibility dasar: `aria-label`, `type="button"`, fokus keyboard, tutup modal dengan Escape

## Struktur File

| File | Fungsi |
|---|---|
| `index.html` | Struktur halaman, header, pencarian, kategori, grid produk, drawer keranjang, dan modal |
| `style.css` | Tema gelap biru-putih, layout grid, drawer/modal, form checkout, dan media query |
| `script.js` | Data produk, filter/sort, keranjang, localStorage, detail produk, dan checkout simulasi |
| `README.md` | Dokumentasi fitur dan cara menjalankan |

## Cara Menjalankan Website

1. Clone atau unduh repository ini.
2. Buka folder repository.
3. Buka file `index.html` langsung di browser.
4. Cari/filter/sort produk, buka detail, lalu tambahkan ke keranjang.
5. Buka keranjang untuk mengubah jumlah item atau checkout simulasi.

## Teknologi

- HTML
- CSS
- JavaScript (tanpa framework dan tanpa library eksternal)

## Catatan

- Tidak ada backend, payment gateway, atau pengiriman data ke server.
- Checkout hanya simulasi di sisi frontend.
- Data keranjang disimpan di `localStorage` browser.
- Semua produk bersifat contoh/demo.
