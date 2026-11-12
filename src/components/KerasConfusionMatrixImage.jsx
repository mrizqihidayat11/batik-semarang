import { useState } from "react";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { API_URL } from "../services/api";

export default function KerasConfusionMatrixImage() {
  const [failed, setFailed] = useState(false);
  const imageUrl = `${API_URL}/api/evaluation/keras-confusion-matrix`;
  return (
    <div>
      <div className="mb-4 rounded-lg border border-gold/30 bg-cream p-4 text-xs leading-6">
        <p className="font-semibold text-brown">ASLI COLAB - KERAS FP32</p>
        <p className="mt-1 text-muted">
          Gambar ini berasal dari pengujian checkpoint Keras sebelum konversi ke
          TFLite. Confusion matrix numerik untuk model TFLite final belum
          tersedia. Metrik dan classification report TFLite tetap ditampilkan
          terpisah pada halaman ini.
        </p>
      </div>
      {failed ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg bg-cream p-5 text-xs text-muted"
        >
          <AlertCircle size={16} /> Gambar belum dapat dimuat. Periksa backend
          dan muat ulang halaman.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <img
            src={imageUrl}
            alt="Confusion matrix asli evaluasi Keras FP32: jumlah sampel di kiri dan normalisasi per kelas di kanan."
            className="h-auto w-full min-w-[950px]"
            onError={() => setFailed(true)}
          />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 text-[11px] leading-6 text-muted">
        <p>
          Sumber: confusion_matrix.png, evaluasi Keras pada notebook Colab.
          <span className="block sm:hidden">
            Geser gambar ke samping untuk melihat seluruh kelas.
          </span>
        </p>
        <a
          href={imageUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-brown hover:underline"
        >
          Buka confusion matrix ukuran penuh <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
