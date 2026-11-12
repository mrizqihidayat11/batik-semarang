"""Inference model final dari notebook Klasifikasi_Batik_Semarang_MobileNetV3_Final.

Pipeline evaluasi: decode RGB -> resize bilinear 256 -> center crop 224.
Pixel tetap float32 0..255; normalisasi sudah ada di dalam model.
"""
from dataclasses import dataclass
import json
from pathlib import Path
import numpy as np
import tensorflow as tf


@dataclass
class LoadedModel:
    interpreter: object
    input_details: dict
    output_details: dict
    classes: list[str]


def load_model(path):
    path = Path(path)
    spec = json.loads(path.with_name('preprocess_spec.json').read_text(encoding='utf-8-sig'))
    labels = path.with_name('labels.txt').read_text(encoding='utf-8-sig').splitlines()
    if len(labels) != 10 or len(set(labels)) != 10 or labels != spec.get('labels'):
        raise ValueError('labels.txt harus berisi 10 kelas yang sama dengan preprocess_spec.json.')
    if spec.get('input_shape') != [1, 224, 224, 3] or spec.get('input_dtype') != 'float32' or spec.get('color_order') != 'RGB':
        raise ValueError('Spesifikasi model berbeda dari pipeline notebook yang diintegrasikan.')
    interpreter = tf.lite.Interpreter(model_path=str(path))
    interpreter.allocate_tensors()
    inputs = interpreter.get_input_details()
    outputs = interpreter.get_output_details()
    if len(inputs) != 1 or len(outputs) != 1:
        raise ValueError('Adapter ini memerlukan satu input gambar dan satu output probabilitas.')
    inp, out = inputs[0], outputs[0]
    if list(inp['shape']) != [1, 224, 224, 3] or inp['dtype'] != np.float32:
        raise ValueError('Input file TFLite tidak sesuai spesifikasi float32 224 x 224 RGB.')
    if list(out['shape']) != [1, 10] or out['dtype'] != np.float32:
        raise ValueError('Output file TFLite harus float32 dengan 10 probabilitas kelas.')
    return LoadedModel(interpreter, inp, out, labels)


def validate_configuration(model, input_size, classes):
    if tuple(input_size) != (224, 224) or classes != model.classes:
        raise ValueError('Ukuran input atau mapping backend berbeda dari artefak ekspor Colab.')


def preprocess_bytes(content, input_size):
    if tuple(input_size) != (224, 224):
        raise ValueError('Ukuran input harus 224 x 224 sesuai notebook ini.')
    # Decode dari bytes memakai TensorFlow agar sama dengan tf.io.read_file di Colab.
    # Tidak memakai EXIF transpose/Pillow resize yang dapat mengubah hasil pipeline.
    image = tf.io.decode_image(content, channels=3, expand_animations=False)
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, (256, 256), method='bilinear', antialias=False)
    image = tf.cast(image, tf.float32)
    batch = tf.keras.layers.CenterCrop(224, 224)(tf.expand_dims(image, 0))
    return batch.numpy()


def predict_probabilities(model, batch):
    model.interpreter.set_tensor(model.input_details['index'], batch)
    model.interpreter.invoke()
    return model.interpreter.get_tensor(model.output_details['index'])[0].tolist()
