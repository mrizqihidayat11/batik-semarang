import {
  BadgeCheck,
  AlertTriangle,
  Download,
  Bookmark,
  RotateCcw,
  Timer,
  Info,
} from "lucide-react";
import { formatConfidence } from "../utils/formatConfidence";
import { downloadReport } from "../utils/downloadReport";
import Button from "./Button";
export default function PredictionResult({
  result,
  filename,
  onSave,
  onReset,
  saved,
}) {
  const difference =
    result.predictions[0].confidence - result.predictions[1].confidence;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-emerald-700">
          <BadgeCheck size={14} /> ANALISIS SELESAI
        </span>
        {result.is_demo && (
          <span className="rounded bg-amber-100 px-2 py-1 text-[9px] font-bold text-amber-800">
            DEMO DATA
          </span>
        )}
      </div>
      <p className="mt-6 text-xs text-muted">
        Prediksi dengan confidence tertinggi
      </p>
      <h3 className="mt-2 font-display text-[27px] leading-snug text-brown">
        {result.predicted_class}
      </h3>
      <div className="mb-2 mt-5 flex items-end justify-between">
        <span className="text-xs text-muted">Confidence score</span>
        <span className="font-display text-3xl">
          {formatConfidence(result.confidence)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gold transition-all duration-700"
          style={{ width: formatConfidence(result.confidence) }}
        />
      </div>
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold">Top 3 prediksi</p>
        {result.predictions.slice(0, 3).map((p, i) => (
          <div
            key={p.class_name}
            className="flex justify-between gap-4 border-b border-line py-3 text-[11px]"
          >
            <span
              className={i === 0 ? "font-semibold text-navy" : "text-muted"}
            >
              <span className="mr-2 text-gold">0{i + 1}</span>
              {p.class_name}
            </span>
            <span className="shrink-0 font-medium">
              {formatConfidence(p.confidence)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[10px] text-muted">
        <Timer size={12} /> Waktu proses {result.processing_time.toFixed(2)}{" "}
        detik <span className="mx-1">·</span> Selisih top 1–2:{" "}
        {formatConfidence(difference)}
      </p>
      <div className="mt-5 flex gap-2 rounded-lg bg-cream p-3 text-[10px] leading-5 text-muted">
        <Info size={15} className="mt-0.5 shrink-0 text-brown" />
        <p>
          {result.is_demo &&
            "Hasil ini adalah simulasi tetap untuk pengujian antarmuka, bukan analisis gambar. "}
          Confidence bukan jaminan akurasi prediksi.
        </p>
      </div>
      {result.confidence < 0.7 && (
        <div
          role="alert"
          className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800"
        >
          <AlertTriangle size={17} className="shrink-0" />
          Confidence rendah (&lt;70%, ambang antarmuka). Coba foto dengan
          pencahayaan dan fokus lebih baik; verifikasi hasil secara manual.
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {onSave && (
          <Button
            onClick={onSave}
            disabled={saved}
            className="!px-3 !py-2.5 !text-[11px]"
          >
            <Bookmark size={14} />
            {saved ? "Tersimpan" : "Simpan Riwayat"}
          </Button>
        )}
        <Button
          secondary
          onClick={() => downloadReport(result, filename)}
          className="!px-3 !py-2.5 !text-[11px]"
        >
          <Download size={14} /> Unduh Laporan
        </Button>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2 text-[11px] text-muted hover:text-brown"
          >
            <RotateCcw size={13} /> Ulangi
          </button>
        )}
      </div>
    </div>
  );
}
