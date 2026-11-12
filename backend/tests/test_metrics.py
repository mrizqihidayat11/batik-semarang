import sys
import unittest
from pathlib import Path
from copy import deepcopy
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.metrics_validation import validate_metrics

def example():
    classes = [f'Class {i}' for i in range(10)]
    return dict(available=True, is_demo=False, classes=classes, accuracy=.8, precision=.8,
                recall=.8, f1=.8, confusion_matrix=[[8 if i == j else 0 for j in range(10)] for i in range(10)],
                classification_report=[dict(class_name=c, precision=.8, recall=.8, f1=.8, support=8) for c in classes], history=[])

class MetricsValidationTests(unittest.TestCase):
    def test_unavailable_has_no_fabricated_values(self):
        self.assertEqual(validate_metrics({'available': False}), {'available': False})
    def test_accepts_complete_metrics(self):
        self.assertIsNotNone(validate_metrics(example()))
    def test_accepts_report_without_fabricating_matrix(self):
        data=example(); data['confusion_matrix']=None
        self.assertIsNone(validate_metrics(data)['confusion_matrix'])
    def test_rejects_empty_matrix_instead_of_unavailable_marker(self):
        data=example(); data['confusion_matrix']=[]
        with self.assertRaises(ValueError): validate_metrics(data)
    def test_rejects_demo_on_research_backend(self):
        data=example(); data['is_demo']=True
        with self.assertRaises(ValueError): validate_metrics(data)
    def test_rejects_matrix_and_support_mismatch(self):
        data=example(); data['confusion_matrix'][0][0]=4
        with self.assertRaises(ValueError): validate_metrics(data)
    def test_rejects_percentage_units(self):
        data=example(); data['accuracy']=80
        with self.assertRaises(ValueError): validate_metrics(data)
    def test_rejects_invalid_history(self):
        data=example(); data['history']=[dict(epoch=1,accuracy=.8,val_accuracy=.7,loss=float('nan'),val_loss=.4)]
        with self.assertRaises(ValueError): validate_metrics(data)
    def test_rejects_reordered_report(self):
        data=deepcopy(example()); data['classification_report'].reverse()
        with self.assertRaises(ValueError): validate_metrics(data)

if __name__ == '__main__': unittest.main()
