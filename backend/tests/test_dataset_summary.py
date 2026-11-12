import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app.services.dataset_summary import validate_dataset_summary

class DatasetSummaryTests(unittest.TestCase):
    def example(self):
        return dict(initial_images=105,duplicates_removed=5,unique_images=100,
                    per_class=[dict(class_name=f'Class {i}',count=10) for i in range(10)],
                    source={'file':'notebook.ipynb','cell_index':3})
    def test_accepts_counted_unique_images(self):
        self.assertEqual(validate_dataset_summary(self.example())['unique_images'],100)
    def test_rejects_inconsistent_deduplication(self):
        data=self.example();data['initial_images']=106
        with self.assertRaises(ValueError):validate_dataset_summary(data)
    def test_rejects_mismatched_class_totals(self):
        data=self.example();data['per_class'][0]['count']=11
        with self.assertRaises(ValueError):validate_dataset_summary(data)
    def test_rejects_wrong_mapping(self):
        with self.assertRaises(ValueError):validate_dataset_summary(self.example(),['Other']*10)
