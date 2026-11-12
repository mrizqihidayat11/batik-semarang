# Rencana implementasi Batik Semarang

Spesifikasi pengguna menjadi acuan implementasi langsung di workspace ini.

1. Pertahankan frontend Vite di root, tambahkan React Router, Lucide, Recharts. Tailwind adalah satu-satunya sistem styling; index.css hanya entry dan default global.
2. Buat sistem visual krem/navy/cokelat, heading Playfair Display, body Inter. Hero menampilkan kolase tekstil dan bingkai analisis sebagai identitas aplikasi.
3. Lima route: beranda, tentang, klasifikasi, data-batik, evaluasi. Komponen navigasi, footer, kartu, modal aksesibel, notifikasi dipakai bersama.
4. Klasifikasi: validasi JPG/PNG 10 MB, decode gambar, object URL dibersihkan; DEMO eksplisit terpisah service API; upload dikunci saat proses; top-3, confidence, durasi, laporan SVG, riwayat browser.
5. Galeri 10 kelas dengan ilustrasi placeholder berlabel, pencarian, filter, detail. Tidak mengarang dokumentasi motif.
6. Evaluasi default tanpa angka; toggle simulasi hanya development. JSON schema bersama memastikan label/urutan/dimensi valid, heatmap interaktif, grafik Recharts dan laporan per kelas.
7. Backend FastAPI modular: health/classes/predict/metrics, konfigurasi belum terisi, model adapter dimuat sekali di lifespan. Tolak prediksi sampai mapping, preprocessing dan loader disediakan. Tidak menebak framework.
8. Dokumentasi instalasi, konfigurasi Colab dan mode. Verifikasi build/lint, validasi service, endpoint backend, dan alur browser bila alat tersedia.
