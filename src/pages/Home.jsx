import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ScanLine,
  Cpu,
  Layers,
  Sparkles,
  Upload,
  Image,
  ChartNoAxesCombined,
  ShieldCheck,
  Flower2,
  MoveDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import BatikCard from "../components/BatikCard";
import MotifDetail from "../components/MotifDetail";
import { batikClasses } from "../data/batikClasses";
import { request } from "../services/api";
const steps = [
  [Upload, "Unggah gambar", "Pilih foto motif batik dari perangkat Anda."],
  [Image, "Preprocessing", "Gambar disesuaikan dengan konfigurasi model."],
  [Cpu, "Analisis AI", "MobileNetV3 mengenali pola pada gambar."],
  [
    ChartNoAxesCombined,
    "Hasil klasifikasi",
    "Lihat prediksi motif dan tingkat confidence.",
  ],
];
export default function Home() {
  const [selected, setSelected] = useState(null);
  const [datasetSize, setDatasetSize] = useState(null);
  useEffect(() => {
    let active = true;
    request("/health")
      .then((data) => {
        if (active && Number.isInteger(data.model?.dataset_size))
          setDatasetSize(data.model.dataset_size);
      })
      .catch(() => {
        /* Tetap tampilkan belum tersedia bila backend tidak terhubung. */
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <section className="relative mx-auto max-w-[1320px] px-5 pb-12 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-9">
          <div className="relative z-10 pb-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-[#EEE8DC] px-3 py-1.5 text-[10px] font-medium tracking-wide text-brown">
              <Sparkles size={12} /> WARISAN BUDAYA, SENTUHAN TEKNOLOGI
            </span>
            <h1 className="mt-6 max-w-xl font-display text-[43px] font-medium leading-[1.17] tracking-[-1.8px] sm:text-[58px] xl:text-[64px]">
              Mengenal dan
              <br className="hidden sm:block" /> Mengklasifikasikan
              <br className="hidden sm:block" /> Motif{" "}
              <span className="italic text-brown">
                Batik
                <br className="hidden sm:block" /> Semarang.
              </span>
            </h1>
            <p className="mt-6 max-w-[445px] text-[13px] leading-[1.9] text-muted">
              Warisan budaya dalam setiap pola. Jelajahi dan identifikasi 10
              motif Batik Semarang melalui kecerdasan buatan berbasis{" "}
              <span className="font-semibold text-navy">MobileNetV3.</span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/klasifikasi">
                <ScanLine size={16} /> Mulai Klasifikasi{" "}
                <ArrowUpRight size={16} />
              </Button>
              <Button to="/tentang" secondary>
                Pelajari Sistem <ArrowRight size={16} />
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-brown" /> Berbasis
                penelitian
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu size={13} className="text-brown" /> Powered by MobileNetV3
              </span>
            </div>
          </div>
          <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[490px] lg:h-[510px]">
            <div className="absolute right-0 top-2 h-[90%] w-[87%] rounded-[100px_18px_100px_18px] border border-gold/35" />
            <div className="absolute bottom-2 left-4 h-[88%] w-[83%] rotate-[-5deg] rounded-[100px_16px_90px_16px] bg-[#DFD6C6]" />
            <div className="absolute bottom-5 left-6 right-5 top-5 overflow-hidden rounded-[100px_16px_90px_16px] shadow-soft">
              <img
                src="/images/motif-1.svg"
                alt="Ilustrasi dekoratif pola batik berwarna cokelat dan emas"
                className="h-full w-full scale-110 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[8px] tracking-[.25em] text-white/70">
                  THE BEAUTY IN EVERY PATTERN
                </p>
                <p className="mt-2 font-display text-2xl">
                  Cerita dalam sehelai kain.
                </p>
              </div>
              <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-cream">
                <Flower2 size={23} strokeWidth={1} />
              </span>
            </div>
            <div className="absolute left-0 top-[29%] w-[54%] rounded-xl border border-white/70 bg-paper/95 p-4 shadow-xl backdrop-blur sm:left-[-12px]">
              <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold tracking-wider text-brown">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-gold/50" />
                  <span className="relative h-2 w-2 rounded-full bg-gold" />
                </span>{" "}
                MOTIF RECOGNITION
              </div>
              <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                  <img
                    src="/images/motif-1.svg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <ScanLine
                    size={45}
                    strokeWidth={1}
                    className="absolute inset-1 text-cream/80"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted">
                    Kenali kekayaan motif
                  </p>
                  <p className="mt-1 font-display text-sm font-medium">
                    Batik Semarang
                  </p>
                  <div className="mt-2 h-1 w-full rounded bg-line">
                    <div className="h-1 w-4/5 rounded bg-gold" />
                  </div>
                  <p className="mt-1.5 text-[8px] text-muted">
                    Pratinjau antarmuka · ilustrasi
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFE8DB] text-brown">
                <Layers size={21} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-semibold">10 Motif Batik</p>
                <p className="mt-0.5 text-[9px] text-muted">
                  Satu identitas. Beragam cerita.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 divide-x divide-line rounded-xl border border-line bg-paper/60 py-6 sm:grid-cols-4 lg:mt-14">
          {[
            [Layers, "10", "Kelas motif batik"],
            [Cpu, "MobileNetV3", "Arsitektur model"],
            [Sparkles, "Deep Learning", "Teknologi klasifikasi"],
            [
              Image,
              datasetSize != null
                ? datasetSize.toLocaleString("id-ID")
                : "Belum tersedia",
              "Gambar unik setelah pembersihan",
            ],
          ].map(([Icon, value, label]) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 px-3 py-3 sm:py-1"
            >
              <Icon
                className="hidden text-brown sm:block"
                size={23}
                strokeWidth={1.25}
              />
              <div>
                <p
                  className={`font-display ${value === "Belum tersedia" ? "text-lg" : "text-xl"}`}
                >
                  {value}
                </p>
                <p className="mt-1 text-[9px] text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-line bg-[#EEEAE1]/70">
        <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-[.85fr_1.15fr] lg:px-12">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[.2em] text-brown">
              TENTANG INISIATIF INI
            </p>
            <h2 className="font-display text-3xl leading-snug">
              Merawat budaya.
              <br />
              <span className="italic text-brown">Membuka kemungkinan.</span>
            </h2>
          </div>
          <div>
            <p className="text-[13px] leading-7 text-muted">
              Batik bukan sekadar kain, melainkan bagian dari identitas kita.
              Aplikasi ini dikembangkan sebagai sarana penelitian untuk
              mengenali motif Batik Semarang melalui pendekatan Deep Learning,
              sekaligus menghadirkan ruang untuk mengenal kekayaan ragamnya.
            </p>
            <Link
              to="/tentang"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brown"
            >
              Lebih dekat dengan penelitian ini <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Ragam warisan Semarang"
          title={
            <>
              Setiap motif,{" "}
              <span className="italic text-brown">sebuah identitas.</span>
            </>
          }
          description="Kenali ragam motif yang menjadi bagian dari penelitian ini."
        >
          <Link
            to="/data-batik"
            className="flex items-center gap-2 text-xs font-semibold text-brown"
          >
            Jelajahi semua motif <ArrowRight size={16} />
          </Link>
        </SectionHeading>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {[0, 3, 6, 8].map((i) => (
            <BatikCard key={i} batik={batikClasses[i]} onClick={setSelected} />
          ))}
        </div>
        <p className="mt-4 text-[10px] text-muted">
          Gambar merupakan ilustrasi dekoratif sementara, bukan dokumentasi
          motif penelitian.
        </p>
      </section>
      <section className="border-y border-line bg-paper/60">
        <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Dari gambar menjadi informasi"
            title={
              <>
                Empat langkah{" "}
                <span className="italic text-brown">mengenali motif.</span>
              </>
            }
            description="Alur sederhana yang menghubungkan foto batik dengan teknologi pengenalan pola."
          />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([Icon, title, description], i) => (
              <div key={title} className="relative border-t border-line pt-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-cream text-brown">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>
                  <span className="font-display text-3xl text-gold/50">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="relative flex flex-col items-start justify-between gap-7 overflow-hidden rounded-2xl bg-navy px-7 py-10 text-white sm:px-10 md:flex-row md:items-center">
          <Flower2
            className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rotate-12 text-gold/[.07]"
            strokeWidth={0.5}
          />
          <div className="relative">
            <p className="mb-3 text-[9px] font-medium tracking-[.25em] text-gold">
              MULAI EKSPLORASI ANDA
            </p>
            <h2 className="font-display text-3xl">
              Motif apa yang ada di kain Anda?
            </h2>
            <p className="mt-3 text-xs text-white/60">
              Unggah gambar, jelajahi prediksi, dan kenali Batik Semarang lebih
              dekat.
            </p>
          </div>
          <Button
            to="/klasifikasi"
            className="relative shrink-0 !border-gold !bg-gold !text-navy"
          >
            Coba Klasifikasi <ArrowUpRight size={16} />
          </Button>
        </div>
        <a
          href="#top"
          className="mx-auto mt-8 flex w-fit items-center gap-2 text-[9px] tracking-widest text-muted"
        >
          <MoveDown className="rotate-180" size={12} /> KEMBALI KE ATAS
        </a>
      </section>
      {selected && (
        <MotifDetail batik={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
