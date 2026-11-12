import { isValidPrediction } from "./validation.js";
const KEY = "batik-semarang-history-v1";
export function readHistory() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.filename === "string" &&
        Number.isFinite(Date.parse(item.createdAt)) &&
        typeof item.result?.is_demo === "boolean" &&
        isValidPrediction(item.result),
    );
  } catch {
    return [];
  }
}
export function writeHistory(items) {
  // Tidak menyimpan gambar agar localStorage tidak cepat penuh.
  localStorage.setItem(KEY, JSON.stringify(items));
}
