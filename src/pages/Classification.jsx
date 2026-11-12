import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanLine,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Image,
  Lightbulb,
  CheckCircle2,
  X,
} from "lucide-react";
import PageIntro from "../components/PageIntro";
import UploadBox from "../components/UploadBox";
import PredictionResult from "../components/PredictionResult";
import LoadingState from "../components/LoadingState";
import History from "../components/History";
import Button from "../components/Button";
import useClassification from "../hooks/useClassification";
import { DEMO_MODE } from "../services/api";
import { readHistory, writeHistory } from "../utils/storage";
export default function Classification() {
  const {
    file,
    preview,
    result,
    error,
    loading,
    selecting,
    selectFile,
    classify,
    reset,
  } = useClassification();
  const [history, setHistory] = useState(readHistory);
  const [savedResult, setSavedResult] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [toast, setToast] = useState("");
  function notify(text) {
    setToast(text);
    setTimeout(() => setToast(""), 4000);
  }
  function updateHistory(next) {
    try {
      writeHistory(next);
      setHistory(next);
      return true;
    } catch {
      notify(
        "Riwayat gagal disimpan. Penyimpanan browser penuh atau diblokir.",
      );
      return false;
    }
  }
  function save() {
    if (
      !result ||
      (savedResult === result && history.some((h) => h.id === savedId))
    )
      return;
    const item = {
      id: crypto.randomUUID(),
      filename: file.name,
      createdAt: new Date().toISOString(),
      result,
      status: result.is_demo ? "demo" : "model",
    };
    if (updateHistory([item, ...history])) {
      setSavedResult(result);
      setSavedId(item.id);
      notify("Hasil berhasil disimpan ke riwayat.");
    }
  }
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-12">
      <PageIntro
        eyebrow="Eksplorasi motif dengan kecerdasan buatan"
        title={
          <>
            Kenali motif <span className="italic text-brown">batik Anda.</span>
          </>
        }
        description="Unggah foto batik untuk melihat prediksi kelas, confidence, dan perbandingan tiga motif teratas."
      >
        <span
          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] ${DEMO_MODE ? "border-gold/40 bg-gold/10 text-brown" : "border-line bg-paper text-navy"}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {DEMO_MODE ? "Mode DEMO aktif" : "Mode API aktif"}
        </span>
      </PageIntro>
      <div className="mb-6 flex gap-3 rounded-lg border border-gold/25 bg-[#F0E9DA] px-4 py-3.5 text-xs leading-6 text-brown">
        <Sparkles size={18} className="mt-0.5 shrink-0" />
        <p>
          {DEMO_MODE ? (
            <>
              <strong>Ruang demonstrasi.</strong> Hasil prediksi merupakan
              simulasi tetap untuk menguji fitur. Gambar Anda belum dianalisis
              oleh model MobileNetV3 sungguhan.
            </>
          ) : (
            <>
              <strong>Mode API.</strong> Gambar dikirim ke backend yang
              dikonfigurasi. Prediksi tersedia setelah model dan preprocessing
              training dihubungkan.
            </>
          )}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-paper p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl">Unggah gambar</h2>
            <span className="text-[10px] text-muted">01 / INPUT GAMBAR</span>
          </div>
          <aside
            aria-labelledby="upload-guidance-title"
            className="mb-5 rounded-xl border border-gold/30 bg-cream p-4"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-brown"
              />
              <div>
                <h3
                  id="upload-guidance-title"
                  className="text-xs font-semibold text-navy"
                >
                  Sebelum mengunggah foto
                </h3>
                <p className="mt-2 text-xs leading-6 text-navy">
                  Gunakan foto kain yang menampilkan salah satu dari 10 motif
                  Batik Semarang yang didukung, dengan pola terlihat jelas. Foto
                  baru dari motif tersebut tetap boleh digunakan.
                </p>
                <p className="mt-2 text-[11px] leading-6 text-muted">
                  Sistem belum dapat mendeteksi gambar nonbatik atau motif di
                  luar 10 kelas. Foto orang, hewan, makanan, atau objek lain
                  tetap bisa memperoleh prediksi motif, bahkan dengan confidence
                  tinggi. Hasil tersebut tidak menunjukkan bahwa gambar adalah
                  batik yang valid.
                </p>
                <Link
                  to="/data-batik"
                  className="mt-3 inline-flex min-h-8 items-center text-xs font-semibold text-brown underline decoration-gold/60 underline-offset-4 hover:decoration-brown"
                >
                  Lihat daftar 10 motif yang didukung
                </Link>
              </div>
            </div>
          </aside>
          <UploadBox
            file={file}
            preview={preview}
            disabled={loading}
            onSelect={selectFile}
            onRemove={reset}
          />
          {error && (
            <div
              role="alert"
              className="mt-4 flex gap-2 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-800"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}
          <Button
            disabled={!file || loading || selecting}
            onClick={classify}
            className="mt-5 w-full"
          >
            <ScanLine size={16} />
            {selecting
              ? "Menyiapkan gambar…"
              : loading
                ? "Sedang menganalisis…"
                : result
                  ? "Klasifikasi Ulang"
                  : "Mulai Klasifikasi"}
          </Button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted">
            <ShieldCheck size={13} />
            {DEMO_MODE
              ? "Gambar tetap berada di perangkat Anda."
              : "Gambar diproses oleh backend tanpa disimpan permanen."}
          </p>
          <div className="mt-6 flex gap-3 border-t border-line pt-5">
            <Lightbulb size={19} className="shrink-0 text-gold" />
            <div>
              <p className="text-xs font-semibold">
                Tips untuk gambar yang baik
              </p>
              <p className="mt-2 text-[11px] leading-6 text-muted">
                Gunakan foto yang jelas dan cukup terang. Pastikan pola batik
                mendominasi gambar, tanpa objek lain yang menutupi motif.
              </p>
            </div>
          </div>
        </section>
        <section
          aria-live="polite"
          aria-busy={loading}
          className="rounded-2xl border border-line bg-paper p-5 sm:p-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl">Hasil klasifikasi</h2>
            <span className="text-[10px] text-muted">02 / ANALISIS MOTIF</span>
          </div>
          {loading ? (
            <div className="pt-10">
              <LoadingState
                label={
                  DEMO_MODE
                    ? "Menjalankan simulasi klasifikasi…"
                    : "MobileNetV3 sedang menganalisis gambar…"
                }
              />
              <p className="px-5 text-center text-xs leading-6 text-muted">
                {DEMO_MODE
                  ? "Simulasi alur preprocessing → prediksi → hasil."
                  : "Menyiapkan gambar dan menunggu prediksi dari backend."}
              </p>
            </div>
          ) : result ? (
            <PredictionResult
              result={result}
              filename={file.name}
              onSave={save}
              onReset={reset}
              saved={
                savedResult === result && history.some((h) => h.id === savedId)
              }
            />
          ) : (
            <div className="flex min-h-[390px] flex-col items-center justify-center px-6 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-cream">
                <Image size={30} className="text-gold" strokeWidth={1.2} />
              </span>
              <h3 className="mt-6 font-display text-2xl">
                Cerita motif dimulai di sini.
              </h3>
              <p className="mt-3 max-w-[280px] text-xs leading-7 text-muted">
                Unggah gambar dan mulai klasifikasi. Hasil analisis motif akan
                ditampilkan pada panel ini.
              </p>
              <span className="mt-6 flex items-center gap-1.5 text-[9px] tracking-wider text-brown">
                <ScanLine size={13} /> 10 KELAS MOTIF · MOBILENETV3
              </span>
            </div>
          )}
        </section>
      </div>
      <History
        items={history}
        onDelete={(id) => {
          if (updateHistory(history.filter((h) => h.id !== id)))
            notify("Riwayat dihapus.");
        }}
        onClear={() => {
          if (updateHistory([])) notify("Semua riwayat dihapus.");
        }}
      />
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-line bg-navy px-5 py-4 text-xs text-white shadow-xl"
        >
          <CheckCircle2 size={18} className="shrink-0 text-gold" />
          {toast}
          <button onClick={() => setToast("")} aria-label="Tutup notifikasi">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
