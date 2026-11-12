"""Validasi ekspor evaluasi tanpa dependensi framework ML."""
import math

def validate_metrics(data):
    if not isinstance(data, dict):
        raise ValueError('Root evaluasi harus object JSON.')
    if not data.get('available'):
        return data
    if data.get('is_demo'):
        raise ValueError('Backend penelitian tidak menerima data DEMO.')
    classes = data.get('classes', [])
    if len(classes) != 10 or not all(isinstance(c, str) and c.strip() for c in classes) or len(set(classes)) != 10:
        raise ValueError('Evaluasi harus memiliki 10 nama kelas unik sesuai urutan training.')
    def probability(value):
        return type(value) in (int, float) and math.isfinite(value) and 0 <= value <= 1
    def count(value):
        return type(value) is int and value >= 0
    if not all(probability(data.get(k)) for k in ('accuracy', 'precision', 'recall', 'f1')):
        raise ValueError('Metrik agregat harus berada dalam rentang 0–1.')
    matrix = data.get('confusion_matrix', [])
    if matrix is not None and (not isinstance(matrix, list) or len(matrix) != 10 or any(not isinstance(row, list) or len(row) != 10 or any(not count(n) for n in row) for row in matrix)):
        raise ValueError('Confusion matrix harus 10 × 10 dengan jumlah sampel integer nonnegatif.')
    report = data.get('classification_report', [])
    if len(report) != 10 or any(row.get('class_name') != classes[i] or not all(probability(row.get(k)) for k in ('precision', 'recall', 'f1')) or not count(row.get('support')) for i, row in enumerate(report)):
        raise ValueError('Classification report harus mengikuti urutan kelas dan berisi metrik 0–1 serta support.')
    if matrix is not None and any(sum(matrix[i]) != report[i]['support'] for i in range(10)):
        raise ValueError('Jumlah baris confusion matrix harus sama dengan support kelas.')
    history = data.get('history')
    if not isinstance(history, list):
        raise ValueError('history harus array (boleh kosong jika training history tidak tersedia).')
    for row in history:
        if type(row.get('epoch')) is not int or row['epoch'] < 1 or not all(probability(row.get(k)) for k in ('accuracy', 'val_accuracy')) or any(type(row.get(k)) not in (int, float) or not math.isfinite(row[k]) or row[k] < 0 for k in ('loss', 'val_loss')):
            raise ValueError('Riwayat training tidak valid.')
    return data
