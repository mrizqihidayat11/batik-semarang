import { useState } from "react";
import { ArrowUpRight, AlertCircle, Image as ImageIcon } from "lucide-react";
import { API_URL } from "../services/api";

export default function TrainingCurvesImage() {
  const [failed, setFailed] = useState(false);
  const imageUrl = `${API_URL}/api/evaluation/training-curves`;
  return (
    <section className="min-w-0 rounded-xl border border-line bg-paper p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">
            Grafik training dan validation
          </h2>
          <p className="mt-2 text-xs leading-6 text-muted">
            Accuracy dan loss selama pelatihan model Keras, sebelum konversi ke
            TFLite.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-semibold text-emerald-800">
          <ImageIcon size={12} aria-hidden="true" /> GAMBAR ASLI COLAB
        </span>
      </div>
      {failed ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-line bg-cream p-5 text-xs leading-6 text-muted"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-brown" />
          Gambar grafik belum dapat dimuat. Pastikan backend tetap menyala, lalu
          muat ulang halaman.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <img
            src={imageUrl}
            alt="Grafik asli Colab: training dan validation accuracy di sebelah kiri, training dan validation loss di sebelah kanan; garis penanda awal fine-tuning."
            className="h-auto w-full min-w-[760px]"
            onError={() => setFailed(true)}
          />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-[11px] leading-6 text-muted">
          Sumber: training_curves.png. Grafik ditampilkan sebagai gambar ekspor
          asli, bukan data simulasi. Nilai numerik tiap epoch belum tersedia
          untuk grafik interaktif.
          <span className="block sm:hidden">
            Geser gambar ke samping untuk melihat kedua grafik.
          </span>
        </p>
        <a
          href={imageUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 text-xs font-semibold text-brown hover:underline"
        >
          Buka grafik ukuran penuh <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
