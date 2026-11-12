export function validateImage(file) {
  if (!file || !["image/jpeg", "image/png"].includes(file.type))
    return "Gunakan gambar JPG, JPEG, atau PNG.";
  if (!file.size) return "File gambar kosong. Pilih gambar lain.";
  if (file.size > 10 * 1024 * 1024) return "Ukuran gambar maksimal 10 MB.";
  return null;
}

// Dipakai bersama oleh respons API dan data riwayat yang dibaca dari browser.
export function isValidPrediction(result) {
  const probability = (n) => Number.isFinite(n) && n >= 0 && n <= 1;
  if (
    !result ||
    typeof result.predicted_class !== "string" ||
    !probability(result.confidence) ||
    !Number.isFinite(result.processing_time) ||
    result.processing_time < 0 ||
    !Array.isArray(result.predictions) ||
    result.predictions.length < 2
  )
    return false;
  const predictions = result.predictions;
  if (
    predictions.some(
      (p) =>
        !p || typeof p.class_name !== "string" || !probability(p.confidence),
    ) ||
    new Set(predictions.map((p) => p.class_name)).size !== predictions.length
  )
    return false;
  return (
    result.predicted_class === predictions[0].class_name &&
    Math.abs(result.confidence - predictions[0].confidence) < 0.000001 &&
    predictions.every(
      (p, i) => i === 0 || p.confidence <= predictions[i - 1].confidence,
    )
  );
}
