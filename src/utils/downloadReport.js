import { formatConfidence, formatDate } from "./formatConfidence";
function escapeXml(text) {
  return String(text).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
}
export function downloadReport(result, filename) {
  const rows = result.predictions
    .slice(0, 3)
    .map(
      (p, i) =>
        `<text x="45" y="${310 + i * 34}" font-size="15" fill="#172B3A">${i + 1}. ${escapeXml(p.class_name)} — ${formatConfidence(p.confidence)}</text>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550"><rect width="800" height="550" fill="#FFFCF7"/><rect width="800" height="100" fill="#172B3A"/><text x="45" y="50" font-family="Georgia" font-size="28" fill="#F6F0E6">BatikSemarang • Laporan Klasifikasi</text><text x="45" y="78" font-size="12" fill="#C49A55">${result.is_demo ? "DEMO DATA — SIMULASI, BUKAN HASIL MODEL" : "PREDIKSI MODEL — BUKAN JAMINAN KETEPATAN"}</text><g font-family="Arial"><text x="45" y="140" font-size="12" fill="#7B7B75">${escapeXml(filename)} • ${escapeXml(formatDate(new Date()))}</text><text x="45" y="195" font-size="25" fill="#76513B">${escapeXml(result.predicted_class)}</text><text x="45" y="235" font-size="18" fill="#172B3A">Confidence: ${formatConfidence(result.confidence)} • Waktu: ${result.processing_time.toFixed(2)} detik</text>${rows}<text x="45" y="465" font-size="12" fill="#7B7B75">Confidence tidak menjamin akurasi. Interpretasikan bersama evaluasi model.</text><text x="45" y="490" font-size="12" fill="#7B7B75">${result.is_demo ? "Prediksi ini tidak didasarkan pada analisis isi gambar." : "Arsitektur: MobileNetV3 • 10 kelas motif"}</text></g></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-batik-semarang.svg";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
