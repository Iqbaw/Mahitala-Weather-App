# Product Requirements Document (PRD) - Mahitala

## 1. Pendahuluan
**Nama Produk:** Mahitala  
**Platform:** Web Application (Responsive/PWA)  
**Visi Produk:** Menjadi platform agrikultur berbasis teknologi terdepan di Indonesia yang membantu petani dan pemangku kepentingan pertanian dalam mengambil keputusan berdasar data cuaca, rekomendasi AI, dan kolaborasi komunitas.

## 2. Latar Belakang & Masalah
Petani di Indonesia sering menghadapi ketidakpastian cuaca ekstrem dan kurangnya akses terhadap informasi presisi mengenai kecocokan lahan, prediksi cuaca, serta harga komoditas. Kurangnya wadah berbagi pengetahuan antar petani juga menghambat produktivitas. Mahitala hadir untuk memecahkan masalah ini dengan menyediakan dashboard terpadu yang menyajikan data cuaca real-time, rekomendasi AI untuk penanaman, serta forum diskusi komunitas.

## 3. Target Pengguna
1. **Petani Tradisional & Modern:** Membutuhkan info cuaca harian dan rekomendasi tanaman.
2. **Penyuluh Pertanian:** Memanfaatkan data lapangan dan forum untuk edukasi.
3. **Pelaku Agribisnis:** Memantau harga komoditas dan tren cuaca untuk keputusan bisnis.
4. **Admin (Super User):** Mengelola platform, moderasi forum, dan manajemen data.

## 4. Fitur Utama & Kebutuhan Fungsional (Functional Requirements)

### 4.1. Autentikasi & Manajemen Pengguna
- **Login/Register:** Pengguna dapat mendaftar dan masuk menggunakan Email & Password (terintegrasi dengan Firebase Auth).
- **Profil Pengguna:** Menyimpan nama lengkap (displayName) dan email pengguna.
- **Role Management:** Sistem membedakan pengguna biasa dan Admin (Super User) berdasarkan daftar email yang diizinkan (misal: `iqbawawbatmee@gmail.com`).

### 4.2. Dashboard Cuaca (Weather Dashboard)
- **Deteksi Lokasi (Geolocation):** Mendeteksi lokasi pengguna secara otomatis atau menggunakan default (Jakarta) jika ditolak/timeout (10 detik).
- **Cuaca Hari Ini (Real-time):** Menampilkan suhu, kelembaban, kecepatan angin, tutupan awan, dan deskripsi cuaca. Mengambil data dari API Publik BMKG (`cuaca.bmkg.go.id`).
- **Perkiraan Cuaca Mingguan:** Menampilkan ringkasan cuaca rata-rata selama 7 hari ke depan.
- **Peringatan Cuaca (Waspada Cuaca):** Menampilkan peringatan dini jika ada potensi cuaca ekstrem di wilayah terkait.

### 4.3. Peta Interaktif (Geographic Information System)
- Menampilkan peta interaktif (menggunakan Leaflet/React-Leaflet) untuk melihat informasi spasial terkait kondisi pertanian.
- Visualisasi data cuaca di atas peta untuk berbagai wilayah di Indonesia (tidak lagi dibatasi hanya di Yogyakarta).

### 4.4. Rekomendasi Cerdas (AI / Machine Learning)
- **Rekomendasi Tanaman:** Menampilkan rekomendasi komoditas yang cocok ditanam berdasarkan suhu, curah hujan, dan kelembaban rata-rata 3 bulan ke depan.
- **Indikator Ideal:** Memberikan sinyal visual (warna/ikon) apakah kondisi cuaca saat ini "Ideal" atau "Tidak Ideal" untuk parameter tertentu.
- *Catatan: Fitur ini membutuhkan integrasi dengan backend Machine Learning khusus.*

### 4.5. Manajemen Lahan (Dashboard Pengguna / Data Field)
- Pengguna yang sudah login dapat menambah, mengedit, dan menghapus data lahan pertanian mereka (CRUD Lahan).
- Menyimpan detail lahan seperti luas, jenis tanah, komoditas yang sedang ditanam, dan titik koordinat.

### 4.6. Forum Diskusi (Komunitas)
- **Kategori Topik:** Diskusi dikelompokkan berdasarkan kategori (misal: Hama, Pemupukan, dll).
- **Buat Diskusi Baru:** Pengguna dapat membuat thread pertanyaan atau berbagi informasi.
- **Balasan (Replies/Comments):** Pengguna dapat membalas diskusi (mendukung balasan bertingkat/nested replies).
- **Pencarian:** Mencari diskusi berdasarkan kata kunci.
- **Moderasi:** Pengguna dapat menghapus diskusi/balasan milik sendiri. Admin dapat memoderasi semua diskusi.

### 4.7. Harga Komoditas Produsen
- Menampilkan update harga rata-rata komoditas pertanian di pasaran untuk membantu petani menentukan waktu jual yang tepat.

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **Ketersediaan (Availability):** Sistem harus tetap bisa diakses dan merender UI (Graceful Degradation) meskipun salah satu API (contoh: ML backend atau Harga Komoditas) sedang down.
- **Performa:** Loading time halaman utama diusahakan di bawah 3 detik. Menggunakan mekanisme `Promise.allSettled` untuk *data fetching* agar pemuatan lebih cepat dan paralel.
- **Responsivitas:** UI/UX harus responsif, nyaman digunakan baik di Desktop (Monitor lebar) maupun Mobile (Smartphone layar kecil).
- **Keamanan:** Endpoint privat harus dilindungi oleh Firebase ID Token (JWT). Data lahan milik pengguna hanya bisa diakses oleh pengguna bersangkutan atau Admin.

## 6. Arsitektur Teknis
- **Frontend Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS + Framer Motion (untuk animasi UI)
- **Map Library:** Leaflet, React-Leaflet
- **Authentication & Database (Migrasi):** Firebase Authentication (Email/Password), Cloud Firestore (NoSQL)
- **External APIs:**
  - BMKG API (`cuaca.bmkg.go.id`) -> Data prakiraan cuaca
  - Nominatim OpenStreetMap -> Reverse Geocoding (mengubah koordinat menjadi nama kota/provinsi)
  - Custom ML Backend -> Rekomendasi Tanaman (Opsional/Tahap selanjutnya)

## 7. Fase Pengembangan (Roadmap)
- **Fase 1 (Selesai):** Refactoring arsitektur UI agar lebih *resilient* (tahan error), migrasi sistem autentikasi dari *Custom Token* ke Firebase Auth, dan integrasi API BMKG Publik yang mencakup seluruh Indonesia.
- **Fase 2 (Berjalan):** Migrasi backend lama (Node.js/SQL) ke Firebase Cloud Firestore sepenuhnya untuk fitur Forum dan Data Lahan.
- **Fase 3 (Mendatang):** Deployment ulang model Machine Learning (AI) ke cloud function/endpoint baru untuk mengaktifkan kembali fitur Rekomendasi AI dan Waspada Cuaca. Rilis versi Mobile App (PWA teroptimasi).
