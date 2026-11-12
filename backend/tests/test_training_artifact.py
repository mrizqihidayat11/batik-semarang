import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from fastapi import HTTPException
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.routes.metrics import training_curves, keras_confusion_matrix

class TrainingArtifactTests(unittest.TestCase):
    def request(self, folder):
        settings=SimpleNamespace(metrics_path='metrics.json',resolve=lambda _: Path(folder)/'metrics.json')
        return SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(model_service=SimpleNamespace(settings=settings))))

    def test_returns_only_training_export(self):
        with TemporaryDirectory() as folder:
            path=Path(folder)/'training_curves.png';path.write_bytes(b'PNG fixture')
            response=training_curves(self.request(folder))
            self.assertEqual(Path(response.path),path)
            self.assertEqual(response.media_type,'image/png')

    def test_missing_file_is_not_replaced_with_demo(self):
        with TemporaryDirectory() as folder:
            with self.assertRaises(HTTPException) as result:
                training_curves(self.request(folder))
            self.assertEqual(result.exception.status_code,404)


class KerasConfusionArtifactTests(TrainingArtifactTests):
    def test_keras_matrix_has_separate_image_endpoint(self):
        with TemporaryDirectory() as folder:
            path=Path(folder)/'confusion_matrix.png';path.write_bytes(b'PNG fixture')
            response=keras_confusion_matrix(self.request(folder))
            self.assertEqual(Path(response.path),path)
            self.assertEqual(response.media_type,'image/png')
    def test_missing_keras_matrix_is_not_invented(self):
        with TemporaryDirectory() as folder:
            with self.assertRaises(HTTPException) as result:
                keras_confusion_matrix(self.request(folder))
            self.assertEqual(result.exception.status_code,404)
