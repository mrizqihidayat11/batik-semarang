import { isValidPrediction } from "../utils/validation";
import { request, DEMO_MODE } from "./api";
import { batikClasses } from "../data/batikClasses";
export async function predictImage(file) {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    // Angka tetap untuk demonstrasi UI. Tidak menganalisis isi gambar.
    const predictions = [0, 1, 7].map((index, rank) => ({
      class_name: batikClasses[index].name,
      confidence: [0.784, 0.142, 0.074][rank],
    }));
    return {
      success: true,
      predicted_class: predictions[0].class_name,
      confidence: predictions[0].confidence,
      predictions,
      processing_time: 1.8,
      is_demo: true,
    };
  }
  const body = new FormData();
  body.append("file", file);
  const result = await request("/predict", { method: "POST", body });
  if (!result.success || !isValidPrediction(result))
    throw new Error("Format respons prediksi backend tidak valid.");
  return { ...result, is_demo: false };
}
