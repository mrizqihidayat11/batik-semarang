import { useState, useEffect } from "react";
import {
  Activity,
  Target,
  Crosshair,
  Gauge,
  PlugZap,
  Database,
  RefreshCw,
  AlertCircle,
  Cpu,
} from "lucide-react";
import PageIntro from "../components/PageIntro";
import StatCard from "../components/StatCard";
import LoadingState from "../components/LoadingState";
import ConfusionMatrix from "../components/ConfusionMatrix";
import TrainingChart from "#training-chart";
import TrainingCurvesImage from "../components/TrainingCurvesImage";
import KerasConfusionMatrixImage from "../components/KerasConfusionMatrixImage";
import DatasetSummary from "../components/DatasetSummary";
import Button from "../components/Button";
import { getMetrics } from "../services/metricsService";
import { request } from "../services/api";
import { formatConfidence } from "../utils/formatConfidence";
export default function Evaluation() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    setMetrics(null);
    setHealth(null);
    const results = await Promise.allSettled([
      getMetrics(),
      request("/health"),
    ]);
    if (results[0].status === "fulfilled") setMetrics(results[0].value);
    else setError(results[0].reason.message);
    if (results[1].status === "fulfilled") setHealth(results[1].value);
    setLoading(false);
  }
  useEffect(() => {
    let active = true;
    Promise.allSettled([getMetrics(), request("/health")]).then((results) => {
      if (!active) return;
      if (results[0].status === "fulfilled") setMetrics(results[0].value);
      else setError(results[0].reason.message);
      if (results[1].status === "fulfilled") setHealth(results[1].value);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);
  const data = metrics;
  const available = !!data?.available;
  const model = health?.model || metrics?.model;
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-12">
      <PageIntro
        eyebrow="Transparansi penelitian"
        title={
          <>
            Di balik setiap <span className="italic text-brown">prediksi.</span>
          </>
        }
        description="Jelajahi performa MobileNetV3 melalui metrik pengujian, confusion matrix, dan riwayat proses training."
      >
        <div className="flex gap-2">
          <Button
            secondary
            onClick={load}
            disabled={loading}
            className="!px-3 !py-2.5 !text-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Muat ulang
          </Button>
        </div>
      </PageIntro>
      <section className="mb-7 rounded-xl border border-line bg-paper p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Cpu size={20} className="text-brown" /> Informasi model
          </h2>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] ${health?.model_connected ? "bg-emerald-50 text-emerald-800" : "bg-cream text-muted"}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${health?.model_connected ? "bg-emerald-600" : "bg-muted"}`}
            />
            {health?.model_connected ? "Connected" : "Not Connected"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Arsitektur", "MobileNetV3"],
            ["Jumlah kelas", "10 kelas"],
            ["Framework", model?.framework || "Belum dikonfigurasi"],
            [
              "Ukuran input",
              model?.input_size?.join(" × ") || "Menunggu konfigurasi",
            ],
            [
              "Jumlah dataset (unik)",
              model?.dataset_size != null
                ? model.dataset_size.toLocaleString("id-ID")
                : "Belum tersedia",
            ],
            [
              "Sumber evaluasi",
              available ? "JSON penelitian" : "Belum tersedia",
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] text-muted">{label}</p>
              <p className="mt-2 text-xs font-medium">{value}</p>
            </div>
          ))}
        </div>
        <DatasetSummary summary={model?.dataset_summary} />
      </section>
      {loading ? (
        <LoadingState label="Memeriksa koneksi dan data evaluasi…" />
      ) : (
        <>
          {available && (
            <div className="mb-6 rounded-xl border border-emerald-800/15 bg-emerald-50/60 px-5 py-4 text-xs leading-6 text-navy">
              <p className="font-semibold text-emerald-800">
                Data pengujian asli dari Colab
              </p>
              <p className="mt-1">
                Sumber: {data.source?.file || "JSON evaluasi penelitian"}.
                {data.averaging &&
                  ` Precision, recall, dan F1-score menggunakan ${data.averaging} average.`}
                {data.test_samples != null &&
                  ` Jumlah sampel uji: ${data.test_samples}.`}
              </p>
              <p className="mt-1 text-muted">
                Angka ini berlaku untuk data uji pada laporan yang diimpor,
                bukan untuk semua gambar atau gambar di luar 10 kelas.
              </p>
            </div>
          )}
          <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [Target, "Accuracy", "accuracy"],
              [Crosshair, "Precision", "precision"],
              [Activity, "Recall", "recall"],
              [Gauge, "F1-Score", "f1"],
            ].map(([Icon, label, key]) => (
              <StatCard
                key={key}
                icon={Icon}
                label={label}
                value={available ? formatConfidence(data[key]) : "—"}
                note={
                  available
                    ? "Hasil evaluasi penelitian"
                    : "Data evaluasi belum tersedia"
                }
              />
            ))}
          </div>
          {available ? (
            <div className="space-y-6">
              <section className="rounded-xl border border-line bg-paper p-5 sm:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl">Confusion matrix</h2>
                    <p className="mt-2 text-xs text-muted">
                      Perbandingan kelas aktual dan prediksi pada 10 kelas
                      motif.
                    </p>
                  </div>
                </div>
                {data.confusion_matrix ? (
                  <ConfusionMatrix
                    data={data.confusion_matrix}
                    classes={data.classes}
                  />
                ) : data.keras_confusion_matrix_available ? (
                  <KerasConfusionMatrixImage />
                ) : (
                  <div className="rounded-lg border border-dashed border-line bg-cream/50 p-6 text-center">
                    <p className="text-sm font-medium">
                      Data confusion matrix belum tersedia
                    </p>
                    <p className="mt-2 text-xs leading-6 text-muted">
                      File classification report tidak memuat pasangan label
                      aktual dan prediksi. Unggah ekspor confusion matrix dari
                      pengujian model final untuk menampilkan heatmap asli.
                    </p>
                  </div>
                )}
              </section>
              {!data.history.length && data.training_curves_available ? (
                <TrainingCurvesImage />
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {["accuracy", "loss"].map((kind) => (
                    <section
                      key={kind}
                      className="min-w-0 rounded-xl border border-line bg-paper p-5"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-display text-xl">
                          {kind === "accuracy"
                            ? "Training & validation accuracy"
                            : "Training & validation loss"}
                        </h2>
                      </div>
                      {data.history.length ? (
                        <TrainingChart data={data.history} kind={kind} />
                      ) : (
                        <div className="rounded-lg border border-dashed border-line bg-cream/50 p-6 text-center">
                          <p className="text-sm font-medium">
                            Riwayat training belum tersedia
                          </p>
                          <p className="mt-2 text-xs leading-6 text-muted">
                            CSV laporan pengujian tidak memuat nilai tiap epoch.
                            Grafik akan ditampilkan setelah history training
                            asli diimpor.
                          </p>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
              <section className="overflow-hidden rounded-xl border border-line bg-paper">
                <div className="flex items-center justify-between p-6">
                  <h2 className="font-display text-2xl">
                    Classification report
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="border-y border-line bg-cream text-[10px] text-muted">
                      <tr>
                        {[
                          "Nama kelas",
                          "Precision",
                          "Recall",
                          "F1-Score",
                          "Support",
                        ].map((t) => (
                          <th key={t} className="px-6 py-4 font-medium">
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.classification_report.map((row) => (
                        <tr
                          key={row.class_name}
                          className="border-b border-line last:border-0"
                        >
                          <td className="px-6 py-4">{row.class_name}</td>
                          {["precision", "recall", "f1"].map((k) => (
                            <td key={k} className="px-6 py-4 text-muted">
                              {formatConfidence(row[k])}
                            </td>
                          ))}
                          <td className="px-6 py-4">{row.support}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <section className="rounded-2xl border border-dashed border-line bg-paper/60 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream">
                <Database size={28} className="text-gold" strokeWidth={1.4} />
              </div>
              <h2 className="mt-5 font-display text-2xl">
                Data evaluasi belum tersedia
              </h2>
              <p className="mx-auto mt-3 max-w-md text-xs leading-7 text-muted">
                Hubungkan JSON evaluasi dari Google Colab untuk menampilkan
                metrik, confusion matrix, grafik training, dan classification
                report yang sebenarnya.
              </p>
              {error && (
                <p className="mx-auto mt-5 flex max-w-lg items-start justify-center gap-2 text-[10px] leading-5 text-muted">
                  <PlugZap size={15} className="mt-0.5 shrink-0" />
                  Backend belum dapat diakses atau datanya belum valid. {error}
                </p>
              )}
            </section>
          )}
        </>
      )}
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-line p-4 text-[11px] leading-6 text-muted">
        <AlertCircle size={17} className="mt-0.5 shrink-0 text-brown" />
        <p>
          Evaluasi harus menggunakan data pengujian yang terpisah dari data
          training. Metrik agregat dan metode averaging mengikuti ekspor
          penelitian. Confidence per gambar berbeda dari accuracy model pada
          keseluruhan data uji.
        </p>
      </div>
    </div>
  );
}
