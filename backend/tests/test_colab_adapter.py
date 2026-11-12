import sys
import unittest
from io import BytesIO
from pathlib import Path
import numpy as np
import tensorflow as tf
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services import colab_adapter as adapter

MODEL_PATH = Path(__file__).resolve().parents[1] / 'models' / 'batik_final.tflite'

class ColabAdapterTests(unittest.TestCase):
    def test_preprocessing_matches_notebook_and_keeps_raw_pixels(self):
        pixels = np.arange(310 * 270 * 3, dtype=np.uint32).reshape(310,270,3).astype(np.uint8)
        stream = BytesIO()
        Image.fromarray(pixels).save(stream, format='PNG')
        content = stream.getvalue()
        image = tf.io.decode_image(content, channels=3, expand_animations=False)
        image = tf.cast(tf.image.resize(image, (256,256)), tf.float32)
        expected = tf.keras.layers.CenterCrop(224,224)(tf.expand_dims(image,0)).numpy()
        actual = adapter.preprocess_bytes(content, (224,224))
        np.testing.assert_array_equal(actual, expected)
        self.assertEqual(actual.shape, (1,224,224,3))
        self.assertEqual(actual.dtype, np.float32)
        self.assertGreater(float(actual.max()), 1.0)

    def test_wrong_input_size_is_rejected(self):
        with self.assertRaises(ValueError):
            adapter.preprocess_bytes(b'invalid', (192,192))

    def test_uploaded_model_produces_ten_probabilities(self):
        model = adapter.load_model(MODEL_PATH)
        result = adapter.predict_probabilities(model, np.full((1,224,224,3),128,dtype=np.float32))
        self.assertEqual(len(result),10)
        self.assertTrue(all(np.isfinite(p) and 0 <= p <= 1 for p in result))
        self.assertAlmostEqual(float(sum(result)), 1.0, places=4)
        # Synthetic input tests inference execution, not classification accuracy.

if __name__ == '__main__':
    unittest.main()
