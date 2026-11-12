import test from "node:test";
import assert from "node:assert/strict";
import { validateMetrics } from "../src/services/metricsService.js";
const names = Array.from({ length: 10 }, (_, i) => `Kelas ${i}`);
const valid = () => ({
  available: true,
  classes: names,
  accuracy: 0.8,
  precision: 0.8,
  recall: 0.8,
  f1: 0.8,
  confusion_matrix: names.map((_, i) =>
    names.map((__, j) => (i === j ? 8 : 0)),
  ),
  history: [],
  classification_report: names.map((class_name) => ({
    class_name,
    precision: 0.8,
    recall: 0.8,
    f1: 0.8,
    support: 8,
  })),
});
test("missing evaluation does not become invented metrics", () =>
  assert.deepEqual(validateMetrics({ available: false }), {
    available: false,
  }));
test("accepts complete ten-class evaluation", () =>
  assert.equal(validateMetrics(valid()).accuracy, 0.8));
test("rejects percentage units instead of fractions", () => {
  const data = valid();
  data.accuracy = 80;
  assert.throws(() => validateMetrics(data));
});
test("rejects malformed matrix and class ordering", () => {
  const data = valid();
  data.confusion_matrix[0] = [1];
  assert.throws(() => validateMetrics(data));
  const other = valid();
  other.classification_report.reverse();
  assert.throws(() => validateMetrics(other));
});
test("rejects nonfinite loss", () => {
  const data = valid();
  data.history = [
    { epoch: 1, accuracy: 0.8, val_accuracy: 0.8, loss: NaN, val_loss: 0.3 },
  ];
  assert.throws(() => validateMetrics(data));
});

test("accepts report-only export with explicit unavailable matrix", () => {
  const data = valid();
  data.confusion_matrix = null;
  assert.equal(validateMetrics(data).confusion_matrix, null);
});
test("rejects empty or missing matrix instead of explicit null", () => {
  const data = valid();
  data.confusion_matrix = [];
  assert.throws(() => validateMetrics(data));
  delete data.confusion_matrix;
  assert.throws(() => validateMetrics(data));
});
