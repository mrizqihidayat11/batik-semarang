import { request } from "./api.js";
export function validateMetrics(data) {
  if (!data.available) return data;
  const probability = (n) => Number.isFinite(n) && n >= 0 && n <= 1;
  const count = (n) => Number.isInteger(n) && n >= 0;
  if (
    !Array.isArray(data.classes) ||
    data.classes.length !== 10 ||
    new Set(data.classes).size !== 10 ||
    data.classes.some((c) => typeof c !== "string") ||
    !["accuracy", "precision", "recall", "f1"].every((k) =>
      probability(data[k]),
    ) ||
    (data.confusion_matrix !== null &&
      (!Array.isArray(data.confusion_matrix) ||
        data.confusion_matrix.length !== 10 ||
        data.confusion_matrix.some(
          (row) =>
            !Array.isArray(row) ||
            row.length !== 10 ||
            row.some((v) => !count(v)),
        ))) ||
    !Array.isArray(data.classification_report) ||
    data.classification_report.length !== 10 ||
    data.classification_report.some(
      (r, i) =>
        r.class_name !== data.classes[i] ||
        !["precision", "recall", "f1"].every((k) => probability(r[k])) ||
        !count(r.support),
    ) ||
    !Array.isArray(data.history) ||
    data.history.some(
      (r) =>
        !Number.isInteger(r.epoch) ||
        r.epoch < 1 ||
        !probability(r.accuracy) ||
        !probability(r.val_accuracy) ||
        !Number.isFinite(r.loss) ||
        r.loss < 0 ||
        !Number.isFinite(r.val_loss) ||
        r.val_loss < 0,
    )
  )
    throw new Error(
      "Struktur data evaluasi tidak valid. Periksa JSON, urutan kelas, dan dimensi confusion matrix.",
    );
  return data;
}
export async function getMetrics() {
  return validateMetrics(await request("/metrics"));
}
