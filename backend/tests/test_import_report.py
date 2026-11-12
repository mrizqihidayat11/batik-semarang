import csv
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tools.import_classification_report import convert_report

class ImportReportTests(unittest.TestCase):
    def fixture(self, path, bad_support=False, missing_class=False):
        classes=[f'Class {i}' for i in range(10)]
        with path.open('w',newline='',encoding='utf-8') as handle:
            writer=csv.writer(handle)
            writer.writerow(['','precision','recall','f1-score','support'])
            for name in classes[:-1] if missing_class else classes:
                writer.writerow([name,.8,.7,.75,2.5 if bad_support else 20.0])
            writer.writerow(['accuracy',.76,.76,.76,.76])
            writer.writerow(['macro avg',.8,.7,.75,200.0])
            writer.writerow(['weighted avg',.8,.7,.75,200.0])
        return classes

    def test_imports_aggregates_without_inventing_missing_data(self):
        with TemporaryDirectory() as directory:
            path=Path(directory)/'report.csv';classes=self.fixture(path)
            data=convert_report(path,classes)
            self.assertEqual((data['accuracy'],data['precision'],data['recall'],data['f1']),(.76,.8,.7,.75))
            self.assertEqual(data['test_samples'],200)
            self.assertIsNone(data['confusion_matrix'])
            self.assertEqual(data['history'],[])
            self.assertFalse(data['is_demo'])

    def test_rejects_missing_class(self):
        with TemporaryDirectory() as directory:
            path=Path(directory)/'report.csv';classes=self.fixture(path,missing_class=True)
            with self.assertRaises(ValueError):convert_report(path,classes)

    def test_rejects_fractional_support(self):
        with TemporaryDirectory() as directory:
            path=Path(directory)/'report.csv';classes=self.fixture(path,bad_support=True)
            with self.assertRaises(ValueError):convert_report(path,classes)
