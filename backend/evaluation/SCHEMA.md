# Kontrak JSON evaluasi

Ganti metrics.json dengan object berikut menggunakan nilai penelitian asli. Jangan menyalin angka contoh menjadi hasil penelitian.

- available: true
- is_demo: false
- classes: array 10 nama kelas dalam urutan yang SAMA dengan mapping training
- accuracy, precision, recall, f1: angka 0 sampai 1, hasil pengujian
- averaging: keterangan metode agregasi (macro / weighted / micro) dari notebook
- confusion_matrix: 10 baris × 10 kolom jumlah sampel integer; baris actual, kolom predicted
- classification_report: 10 object berurutan {class_name, precision, recall, f1, support}; jumlah baris matrix harus sama dengan support
- history: array {epoch, accuracy, val_accuracy, loss, val_loss}; epoch dimulai 1, loss nonnegatif. Boleh [] bila history tidak tersedia.

Ekspor Python: json.dump(data, file, ensure_ascii=False, allow_nan=False).
Gunakan confusion_matrix(y_true, y_pred, labels=range(10)) agar dimensinya tetap 10 × 10 ketika ada kelas tanpa sampel.
Jangan menukar label angka ke urutan alfabet kecuali training memang memakai urutan tersebut.


## Impor CSV laporan pengujian

Jalankan `python backend/tools/import_classification_report.py` dari root setelah menyimpan classification_report_tflite_test.csv di folder evaluation dan labels.txt di models. Converter mengambil accuracy dari baris accuracy dan precision/recall/f1 dari macro avg, memeriksa kelas serta total support, lalu menulis metrics.json. Data tidak dianggap simulasi.

Bila hanya laporan CSV yang tersedia, confusion_matrix harus eksplisit null (bukan array kosong) dan history menjadi []. Dashboard tetap menampilkan metrik dan tabel asli, disertai keadaan belum tersedia untuk heatmap dan grafik. Jangan membuat matrix/history dari perkiraan. test_samples merupakan jumlah support data uji, bukan total dataset training. source mencatat nama file yang diimpor; ini bukan bukti independen bahwa artefak model dan laporan berasal dari run yang sama.
