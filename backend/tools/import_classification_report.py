"""Konversi laporan sklearn dari Colab; tidak mengarang matrix atau history.
Jalankan dari root: python backend/tools/import_classification_report.py
"""
import csv
import json
import math
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.metrics_validation import validate_metrics

BASE = Path(__file__).resolve().parents[1]


def convert_report(csv_path, classes):
    with Path(csv_path).open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle)
        name_column = reader.fieldnames[0]
        rows = {}
        for row in reader:
            name = row[name_column].strip()
            if name in rows:
                raise ValueError(f'Baris kelas duplikat: {name}')
            rows[name] = row
    expected = set(classes) | {'accuracy', 'macro avg', 'weighted avg'}
    if set(rows) != expected:
        raise ValueError('Kelas CSV tidak cocok dengan labels.txt atau ringkasan tidak lengkap.')
    report = []
    for name in classes:
        row = rows[name]
        support = float(row['support'])
        if not math.isfinite(support) or not support.is_integer() or support < 0:
            raise ValueError('Support kelas harus jumlah sampel integer nonnegatif.')
        report.append(dict(class_name=name, precision=float(row['precision']),
                           recall=float(row['recall']), f1=float(row['f1-score']), support=int(support)))
    total = sum(row['support'] for row in report)
    if total <= 0 or float(rows['macro avg']['support']) != total or float(rows['weighted avg']['support']) != total:
        raise ValueError('Total support laporan tidak konsisten.')
    macro = rows['macro avg']
    data = dict(available=True, is_demo=False, classes=classes,
                accuracy=float(rows['accuracy']['precision']), precision=float(macro['precision']),
                recall=float(macro['recall']), f1=float(macro['f1-score']), averaging='macro',
                test_samples=total, classification_report=report, confusion_matrix=None, history=[],
                source={'file': Path(csv_path).name, 'type': 'colab_classification_report_csv'})
    return validate_metrics(data)


if __name__ == '__main__':
    source = BASE / 'evaluation' / 'classification_report_tflite_test.csv'
    classes = (BASE / 'models' / 'labels.txt').read_text(encoding='utf-8-sig').splitlines()
    data = convert_report(source, classes)
    destination = BASE / 'evaluation' / 'metrics.json'
    destination.write_text(json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False)+'\n', encoding='utf-8')
    print(f'Imported {data["test_samples"]} test samples, {len(classes)} classes. Matrix/history remain unavailable.')
