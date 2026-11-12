import importlib
import json
import logging
import math
from .preprocessing import decode_image
from .dataset_summary import read_dataset_summary

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self, settings):
        self.settings = settings
        self.model = None
        self.adapter = None
        self.classes = []
        self.status = 'Model dan konfigurasi training belum dihubungkan.'

    @property
    def connected(self):
        return self.model is not None

    def load(self):
        # Satu kali melalui lifespan FastAPI. Tidak ada training dalam request.
        try:
            mapping = json.loads(self.settings.resolve(self.settings.class_mapping_path).read_text(encoding='utf-8'))
            classes = mapping.get('classes', [])
            if not mapping.get('verified_from_training') or len(classes) != 10 or len(set(classes)) != 10 or not all(isinstance(c, str) and c.strip() for c in classes):
                raise ValueError('Mapping 10 kelas dari training belum diverifikasi.')
            self.classes = classes
            if not self.settings.model_framework or not self.settings.model_path or not self.settings.input_size or any(n <= 0 for n in self.settings.input_size):
                raise ValueError('Framework, path model, atau ukuran input belum dikonfigurasi.')
            path = self.settings.resolve(self.settings.model_path)
            if not path.exists():
                raise ValueError('File/folder model tidak ditemukan.')
            self.adapter = importlib.import_module(self.settings.adapter_module)
            model = self.adapter.load_model(path)
            if model is None:
                raise ValueError('Loader tidak mengembalikan model.')
            if hasattr(self.adapter, 'validate_configuration'):
                self.adapter.validate_configuration(model, self.settings.input_size, self.classes)
            self.model = model
            self.status = 'Model siap melakukan inference.'
        except Exception as exc:
            self.model = None
            logger.warning('Model tidak tersedia: %s', exc)
            self.status = str(exc) if isinstance(exc, (ValueError, NotImplementedError)) else 'Model gagal dimuat. Periksa konfigurasi dan log backend.'

    def predict(self, content):
        image = decode_image(content)
        try:
            if hasattr(self.adapter, 'preprocess_bytes'):
                batch = self.adapter.preprocess_bytes(content, self.settings.input_size)
            else:
                batch = self.adapter.preprocess(image, self.settings.input_size)
        finally:
            image.close()
        probabilities = [float(x) for x in self.adapter.predict_probabilities(self.model, batch)]
        if len(probabilities) != len(self.classes) or any(not math.isfinite(p) or not 0 <= p <= 1 for p in probabilities) or not math.isclose(sum(probabilities), 1, abs_tol=0.02):
            raise RuntimeError('Output model harus berupa probabilitas valid sesuai urutan kelas training.')
        ranked = sorted(zip(self.classes, probabilities), key=lambda item: item[1], reverse=True)
        return [{'class_name': name, 'confidence': score} for name, score in ranked]

    def info(self):
        summary = None
        try:
            path = self.settings.resolve(self.settings.metrics_path).parent / 'dataset_summary.json'
            summary = read_dataset_summary(path, self.classes)
        except (ValueError, TypeError, KeyError, OSError) as exc:
            logger.warning('Ringkasan dataset tidak valid: %s', exc)
        return {'name': 'MobileNetV3', 'framework': self.settings.model_framework or None,
                'input_size': self.settings.input_size,
                'dataset_size': summary['unique_images'] if summary else self.settings.dataset_size,
                'dataset_summary': summary}
