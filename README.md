# Panduan Deployment Website Unity Group

Berikut adalah langkah-langkah untuk mempublikasikan (hosting) website ini ke penyedia hosting Anda (seperti cPanel, Vercel, Netlify, atau Firebase Hosting).

## 0. Persiapan Awal (WAJIB DILAKUKAN PERTAMA KALI)

Jika Anda baru saja mendownload project ini, Anda **wajib** menginstall semua dependensi (paket pendukung) terlebih dahulu agar perintah lainnya bisa berjalan.

Jalankan perintah ini di terminal:

```bash
npm install
```

Tunggu hingga proses selesai. Perintah ini akan mendownload folder `node_modules`. Jika sudah selesai, baru lanjut ke langkah berikutnya.

## 1. Build Aplikasi (Membuat File Produksi)

Sebelum di-upload, aplikasi harus di-"build" terlebih dahulu agar menjadi file HTML, CSS, dan JavaScript yang siap pakai.

Jalankan perintah berikut di terminal:

```bash
npm run build
```

Setelah proses selesai, akan muncul folder baru bernama **`dist`**. Folder inilah yang berisi website Anda yang sudah jadi.

## 2. Upload ke Hosting

### Opsi A: Hosting cPanel / Shared Hosting (Niagahoster, Hostinger, dll)

1.  Buka **File Manager** di cPanel Anda.
2.  Masuk ke folder `public_html` (atau folder subdomain jika ada).
3.  **Upload** semua isi dari folder **`dist`** (yang dibuat di langkah 1) ke dalam `public_html`.
    *   Pastikan file `index.html` berada langsung di dalam `public_html`.
4.  Selesai! Website Anda sekarang sudah bisa diakses.

**Catatan Penting untuk React Router:**
Jika Anda menggunakan routing (pindah halaman tanpa reload), Anda mungkin perlu menambahkan file `.htaccess` di folder `public_html` agar halaman tidak error 404 saat di-refresh.

Buat file bernama `.htaccess` dan isi dengan kode berikut:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Opsi B: Vercel / Netlify (Gratis & Mudah)

1.  Buat akun di [Vercel](https://vercel.com) atau [Netlify](https://netlify.com).
2.  Hubungkan akun GitHub/GitLab Anda.
3.  Pilih repository project ini.
4.  Klik **Deploy**. Vercel/Netlify akan otomatis menjalankan `npm run build` dan menayangkannya.

## 3. Konfigurasi Firebase (PENTING!)

Agar database dan fitur login tetap berjalan lancar di domain baru Anda:

1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Pilih project Anda.
3.  Masuk ke menu **Authentication** -> **Settings** -> **Authorized Domains**.
4.  Klik **Add Domain**.
5.  Masukkan nama domain website Anda (contoh: `unitygroup.com` atau `namadomain.vercel.app`).

Tanpa langkah ini, fitur login atau pengambilan data mungkin akan diblokir oleh keamanan Firebase.
