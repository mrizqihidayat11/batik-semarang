"""Ringkasan dataset berasal dari output notebook, bukan dari support data uji."""
import json


def validate_dataset_summary(data, classes=None):
    for key in ('initial_images','duplicates_removed','unique_images'):
        if type(data.get(key)) is not int or data[key] < 0:
            raise ValueError('Jumlah gambar dataset harus integer nonnegatif.')
    if data['initial_images'] - data['duplicates_removed'] != data['unique_images']:
        raise ValueError('Jumlah awal, duplikat, dan gambar unik tidak konsisten.')
    rows = data.get('per_class', [])
    if len(rows) != 10 or any(not isinstance(row,dict) or not isinstance(row.get('class_name'),str) or type(row.get('count')) is not int or row['count'] < 0 for row in rows):
        raise ValueError('Ringkasan harus memuat 10 kelas dan jumlah gambar tiap kelas.')
    names = [row['class_name'] for row in rows]
    if len(set(names)) != 10 or (classes and names != classes):
        raise ValueError('Kelas dataset tidak sesuai mapping model.')
    if sum(row['count'] for row in rows) != data['unique_images']:
        raise ValueError('Total kelas berbeda dari jumlah gambar unik.')
    if not isinstance(data.get('source'),dict) or not isinstance(data['source'].get('file'),str):
        raise ValueError('Sumber jumlah dataset harus dicantumkan.')
    return data


def read_dataset_summary(path, classes=None):
    if not path.is_file():
        return None
    return validate_dataset_summary(json.loads(path.read_text(encoding='utf-8')), classes)
