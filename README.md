# Batik Semarang Classification System

Aplikasi penelitian klasifikasi 10 motif Batik Semarang. Backend telah dihubungkan ke model asli `batik_final.tflite` (Dynamic Range) dari Colab. Frontend tetap dalam mode DEMO sampai `.env` frontend diubah ke mode API. Metrik agregat dan laporan per kelas sudah diimpor dari CSV pengujian Colab; confusion matrix serta history training belum tersedia.

## 1. Menjalankan frontend

Gunakan Node.js 20.19+ atau 22.12+ dan npm. Jalankan dari folder project ini:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

```powershell
npm run build     # Membuat dist/ untuk produksi
npm run preview   # Memeriksa build produksi
npm run lint
npm test
```

Frontend sengaja tetap di root untuk mempertahankan workspace Vite yang sudah ada, bukan dipindah ke folder `frontend/`. Saat hosting, gunakan fallback SPA ke `index.html` agar route seperti `/klasifikasi` dapat dibuka langsung.

### Catatan dependensi lingkungan pengerjaan

Terminal lingkungan ini tidak memiliki akses jaringan. Lucide dan React Router dipasang dari cache lokal. Dependency `react-router-dom` menggunakan alias npm ke paket resmi `react-router` v7, yang juga mengekspor `BrowserRouter`, `Routes`, `NavLink`, dan API DOM lainnya. Ini bukan router buatan sendiri. Jika ingin menggunakan paket DOM tersendiri setelah koneksi tersedia:

```powershell
npm install react-router-dom@7
```

Recharts belum tersedia di cache, sehingga didaftarkan sebagai dependency opsional. Adapter Recharts sudah dibuat. Vite otomatis memakai adapter itu ketika paket terpasang; saat ini grafik berjalan melalui fallback SVG lokal. Untuk mengaktifkan Recharts, jalankan lalu restart Vite:

```powershell
npm install recharts
npm run dev
```

Font Inter dan Playfair Display dimuat dari Google Fonts; tanpa internet tersedia fallback sans-serif/Georgia. Semua ilustrasi motif disimpan lokal sehingga tidak memerlukan layanan gambar eksternal.

## 2. Menjalankan backend

Gunakan Python 3.11+ dalam virtual environment. Versi Python untuk inference nantinya harus disesuaikan dengan dukungan framework pada notebook Anda.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Dokumentasi API interaktif: `http://localhost:8000/docs`.

Backend lokal sudah diuji melalui HTTP menggunakan TensorFlow 2.21.0 dan model asli. Endpoint health menunjukkan model terhubung; upload multipart menjalankan inference TFLite. Pengujian memakai gambar sintetis untuk memeriksa eksekusi, bukan mengukur akurasi. Jika artefak model/config tidak tersedia, backend tetap menyala tetapi predict mengembalikan 503.

| Endpoint | Fungsi |
| --- | --- |
| `GET /api/health` | Status backend dan koneksi model |
| `GET /api/classes` | Mapping kelas terverifikasi dari training; kosong bila belum tersedia |
| `POST /api/predict` | Upload multipart dengan field `file`; hasil prediksi top 3 |
| `GET /api/metrics` | Evaluasi penelitian dari JSON, atau status belum tersedia |

Error menggunakan field `detail`. Status penting: 400 gambar tidak valid, 413 terlalu besar, 415 format tidak didukung, 422 JSON evaluasi tidak valid, 503 model belum tersedia. CORS default menerima frontend port 5173; sesuaikan `CORS_ORIGINS` jika port berubah.

## 3. Struktur folder

```text
src/
  components/       Navbar, upload, hasil, riwayat, modal, grafik
  pages/            Home, About, Classification, BatikData, Evaluation
  data/             Daftar kelas galeri
  services/         Fetch API, service prediksi, validasi evaluasi
  hooks/            Alur upload dan klasifikasi
  utils/            Validasi, format, localStorage, ekspor laporan
  index.css         Entry Tailwind dan default global minimal
public/images/      Ilustrasi motif yang dapat diganti
backend/
  app/config.py     Konfigurasi dari .env
  app/main.py       Lifespan, CORS, health, classes
  app/routes/       Endpoint predict dan metrics
  app/services/     Model loader, adapter Colab, validasi gambar/evaluasi
  app/schemas/      Kontrak response prediksi
  app/data/         Mapping output model dari training
  models/           File model; tidak disertakan saat ini
  evaluation/       JSON evaluasi dan dokumentasi skema
  tests/            Pengujian validator evaluasi
docs/
  *.test.mjs        Pengujian validator frontend
  browser-check.mjs Pengujian alur browser otomatis
  screenshots/     Hasil pemeriksaan desktop/ponsel
```

Styling komponen menggunakan utility Tailwind langsung pada JSX. Tidak ada CSS per halaman. Nilai dinamis heatmap dan panjang confidence memakai atribut `style` karena bergantung pada angka hasil.

## 4. Mode DEMO dan API

Isi `.env` frontend:

```dotenv
VITE_PREDICTION_MODE=demo
VITE_API_URL=http://localhost:8000
```

Restart Vite setelah mengubah `.env`.

- **DEMO:** tidak mengunggah gambar ke server. Service mengembalikan prediksi tetap untuk pengujian antarmuka, tanpa menganalisis isi gambar. Hasil, laporan, dan riwayat diberi label **DEMO DATA**.
- **API:** ubah menjadi `VITE_PREDICTION_MODE=api`. File dikirim ke `/api/predict`. Kegagalan backend ditampilkan sebagai error; tidak diam-diam diganti hasil simulasi.
- **Evaluasi:** hanya menggunakan data penelitian dari `/api/metrics` dan artefak Colab. Tombol serta data DEMO evaluasi sudah dihapus. Jika backend atau data tidak tersedia, halaman menampilkan status belum tersedia tanpa simulasi.

Input hanya menerima konten JPG/JPEG/PNG, maksimal 10 MB. Backend juga memvalidasi isi file dan membatasi resolusi 25 megapiksel. Ukuran dan preprocessing model tidak diasumsikan dari batas upload ini.

## 5. Model Colab yang sudah dihubungkan

Artefak pengguna berada di `backend/models/`: `batik_final.tflite`, `labels.txt`, `preprocess_spec.json`. File model diabaikan Git; salin ketiganya sebelum menjalankan project pada perangkat lain.

- Runtime teruji: TensorFlow 2.21.0, interpreter TensorFlow Lite.
- Varian ekspor: Dynamic Range; input/output float32.
- Input: satu batch `[1,224,224,3]`.
- Preprocessing sesuai notebook: TensorFlow decode RGB, resize bilinear menjadi 256 x 256 tanpa mempertahankan aspek rasio dan tanpa antialias, kemudian center crop 224 x 224.
- Pixel tetap 0 sampai 255; jangan dibagi 255 karena normalisasi berada di dalam model.
- Mapping backend disalin dari labels.txt dan diverifikasi dengan preprocess_spec.json. Loader memeriksa mapping, dimensi, dan dtype input/output saat startup.
- Inference menggunakan bytes gambar asli melalui TensorFlow, sehingga jalur ini tidak memakai koreksi EXIF atau resize Pillow. Pillow tetap digunakan untuk validasi gambar dan batas resolusi.

Konfigurasi lokal sudah dibuat di `backend/.env`. Model dimuat sekali pada startup. Tidak ada training pada request, dan gambar tidak disimpan permanen.

Untuk menjalankan dari folder backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Buka `http://localhost:8000/api/health` dan pastikan `model_connected` bernilai `true`. Frontend baru mengirim ke model asli setelah mode API diaktifkan seperti bagian 4.

Sebelum menyimpulkan kesesuaian hasil penelitian, bandingkan satu gambar batik yang sama pada Colab dan backend. Pengujian teknis yang sudah dijalankan belum menggantikan pembandingan gambar referensi tersebut. Laporan CSV pengujian sudah diimpor. Confusion matrix serta training history masih perlu diimpor terpisah.

Jika model diganti dengan ekspor baru, periksa kembali spesifikasi, preprocessing, dan mapping; jangan menganggap konfigurasi ini berlaku untuk semua model MobileNetV3.

## 6. Mengganti gambar dan deskripsi motif

Ilustrasi SVG saat ini merupakan pola dekoratif orisinal dan **bukan dokumentasi asli masing-masing kelas**. Semua kartu dan modal menjelaskan status placeholder.

1. Simpan foto motif asli di `public/images/`, misalnya `asem-arang.jpg`.
2. Edit properti `image` di `src/data/batikClasses.js` menjadi `/images/asem-arang.jpg` untuk kelas terkait. Bentuk data dapat diubah menjadi array object eksplisit jika setiap kelas memiliki deskripsi berbeda.
3. Isi `description` menggunakan sumber penelitian. Jangan mengubah mapping backend hanya untuk mengubah tampilan galeri.
4. Setelah semua foto benar, sesuaikan label “ilustrasi placeholder” di `BatikCard.jsx`, `MotifDetail.jsx`, dan catatan galeri agar mencerminkan sumber dokumentasinya.

Visual hero dapat diganti melalui elemen gambar di `Home.jsx`. Dataset training tidak perlu dan tidak boleh dimasukkan seluruhnya ke frontend.

## 7. Mengganti data evaluasi

Ganti `backend/evaluation/metrics.json` dengan hasil pengujian asli. Skema lengkap ada di [backend/evaluation/SCHEMA.md](backend/evaluation/SCHEMA.md).

- Metrik menggunakan pecahan **0–1**, bukan angka persen 0–100.
- Confusion matrix 10 × 10: baris kelas aktual, kolom prediksi, nilai jumlah sampel integer.
- Urutan `classes`, baris/kolom matrix, dan `classification_report` harus sama dengan training.
- Jumlah tiap baris matrix harus sama dengan support kelas.
- `history` berisi epoch, accuracy, val_accuracy, loss, val_loss; boleh kosong jika tidak diekspor.
- Sertakan metode averaging metrik agregat dalam ekspor penelitian.
- Backend menolak evaluasi berlabel `is_demo: true`; dashboard evaluasi hanya menampilkan data penelitian.

Gunakan hasil data uji yang terpisah dari training. Confidence satu gambar bukan accuracy seluruh model. Ambang peringatan confidence 70% pada UI adalah aturan antarmuka, bukan ambang yang telah divalidasi secara ilmiah.

## 8. Riwayat dan unduhan

Klik **Simpan Riwayat** setelah klasifikasi untuk menyimpan nama file, tanggal, hasil, confidence, dan status ke browser. Gambar tidak disimpan; detail riwayat berisi data hasil. Riwayat mendukung pencarian, filter kelas, detail, hapus satu entri, dan hapus semua dengan konfirmasi.

Riwayat hanya tersedia pada browser/perangkat yang sama dan dapat hilang saat data browser dihapus. Data rusak disaring agar tidak merusak halaman. **Unduh Laporan** menghasilkan gambar laporan SVG yang dapat dibuka di browser atau dicetak menjadi PDF menggunakan fasilitas browser.

## 9. Verifikasi pengembangan

```powershell
npm run lint
npm test
npm run build
python -m unittest discover -s backend/tests -v
python -m compileall -q backend/app
```

Pengujian browser membutuhkan Chrome dan frontend yang sedang berjalan pada port 5173:

```powershell
npm run test:browser
```

Untuk lokasi Chrome berbeda, set `$env:CHROME_PATH` ke executable browser Chromium. Skrip mencakup upload tidak valid, simulasi prediksi, penguncian upload, ekspor laporan, riwayat, galeri, evaluasi, menu mobile, serta lima route pada lebar 375, 768, dan 1440 pixel. Screenshot tersedia pada `docs/screenshots/`.

Pengujian ini memeriksa fungsi aplikasi, bukan kualitas model. Akurasi dan metrik penelitian di dashboard tetap menunggu ekspor evaluasi yang sesuai dengan model final.


### Pembaruan evaluasi dari CSV Colab

classification_report_tflite_test.csv sudah disalin ke backend/evaluation dan dikonversi ke metrics.json menggunakan backend/tools/import_classification_report.py. Sumber memuat 303 sampel uji dan semua metrik tercatat 1.0. Precision, recall, dan F1 menggunakan macro average. Nilai ditampilkan sebagaimana file sumber; ini bukan jaminan akurasi pada gambar lain. Confusion matrix bernilai null dan history kosong karena tidak tersedia dalam CSV. Dashboard menampilkan keadaan kosong pada bagian tersebut tanpa mencampurkan data DEMO. Pastikan laporan dan model berasal dari run penelitian yang sama.


### Grafik training asli dalam bentuk gambar

Simpan training_curves.png di backend/evaluation. Backend menyediakan GET /api/evaluation/training-curves dan mengirim flag training_curves_available pada /api/metrics. Jika data history per epoch kosong, dashboard menampilkan gambar asli beserta sumber, penjelasan bahwa grafik berasal dari pelatihan Keras sebelum konversi TFLite, dan tautan ukuran penuh. Pada ponsel gambar dapat digeser horizontal. Tidak ada angka epoch yang direkonstruksi dari gambar. Jika history numerik kemudian tersedia, grafik interaktif diprioritaskan. Gambar ini terpisah dari tampilan DEMO.

confusion_matrix.png yang tersedia berasal dari evaluasi Keras pada notebook. File tersebut tidak otomatis dipakai sebagai confusion matrix TFLite final.


### Sumber jumlah dataset dan confusion matrix Keras

Jumlah dataset diekstrak dari output sel indeks 3 notebook Klasifikasi_Batik_Semarang_MobileNetV3_Final.ipynb: 3.021 gambar awal, 28 duplikat diabaikan, 2.993 gambar unik. Rincian tiap kelas dan sumber disimpan di backend/evaluation/dataset_summary.json. Backend memvalidasi aritmetika pembersihan, jumlah per kelas, dan mapping sebelum menampilkan total di health/metrics. Total gambar unik ditampilkan di beranda dan informasi evaluasi; 303 sampel uji tetap dicatat terpisah.

Gambar confusion_matrix.png ditampilkan melalui /api/evaluation/keras-confusion-matrix dengan label Keras FP32, sesuai kode sel confusion matrix notebook yang memakai y_pred dari checkpoint Keras. Gambar ini bukan confusion matrix numerik TFLite final. Field confusion_matrix tetap null sampai hasil numerik TFLite diekspor; data Keras tidak disalin untuk mengisi field tersebut. Tampilan menyediakan sumber, penjelasan, dan tautan gambar ukuran penuh.
