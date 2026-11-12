import {
  BrainCircuit,
  Cpu,
  Layers,
  ScanLine,
  ArrowRight,
  Code2,
  Flower2,
} from "lucide-react";
import PageIntro from "../components/PageIntro";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
export default function About() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-12">
      <PageIntro
        eyebrow="Tentang aplikasi & penelitian"
        title={
          <>
            Budaya bertemu{" "}
            <span className="italic text-brown">kecerdasan buatan.</span>
          </>
        }
        description="Platform penelitian klasifikasi motif Batik Semarang dengan pendekatan Deep Learning menggunakan MobileNetV3."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-xl border border-line bg-paper p-7">
          <Flower2 className="mb-5 text-brown" size={28} />
          <h2 className="font-display text-2xl">Mengapa Batik Semarang?</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Penelitian ini berangkat dari kebutuhan untuk mengenali dan
            mendokumentasikan ragam motif Batik Semarang. Pengenalan pola
            melalui gambar membuka kesempatan untuk membangun alat bantu yang
            mudah diakses dalam kegiatan edukasi dan penelitian.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Galeri aplikasi memuat sepuluh kelas batik cap sesuai lingkup
            penelitian. Dokumentasi budaya dan keterangan setiap motif akan
            dilengkapi dari sumber yang terverifikasi.
          </p>
        </section>
        <section className="rounded-xl bg-navy p-7 text-white">
          <p className="mb-5 text-[10px] tracking-widest text-gold">
            TUJUAN PENELITIAN
          </p>
          <h2 className="font-display text-2xl">
            Dari pola visual menuju
            <br />
            pengenalan motif.
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-white/70">
            {[
              "Menerapkan MobileNetV3 untuk klasifikasi 10 kelas motif Batik Semarang.",
              "Menyediakan antarmuka pengujian gambar yang mudah digunakan.",
              "Menyajikan hasil evaluasi model secara transparan berdasarkan data pengujian.",
            ].map((t) => (
              <li className="flex gap-3" key={t}>
                <ArrowRight size={15} className="mt-1 shrink-0 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="py-14">
        <SectionHeading
          eyebrow="Memahami teknologi"
          title={
            <>
              Mengenal <span className="italic text-brown">MobileNetV3.</span>
            </>
          }
          description="Model mempelajari ciri visual dari data training, kemudian menggunakannya untuk memperkirakan kelas gambar baru."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              BrainCircuit,
              "Apa itu CNN?",
              "Convolutional Neural Network (CNN) adalah jaringan saraf untuk mengolah gambar. Lapisan-lapisannya mempelajari ciri visual, mulai dari garis dan tekstur hingga kombinasi pola yang lebih kompleks.",
            ],
            [
              Cpu,
              "Apa itu MobileNetV3?",
              "MobileNetV3 adalah keluarga arsitektur CNN yang dirancang agar komputasi pengenalan gambar lebih efisien. Dalam penelitian ini, model dilatih untuk membedakan sepuluh kelas motif batik.",
            ],
            [
              ScanLine,
              "Bagaimana prediksi dibuat?",
              "Gambar disesuaikan dengan ukuran dan preprocessing training. Model menghasilkan skor untuk tiap kelas. Kelas dengan skor tertinggi menjadi prediksi; confidence tetap perlu dibaca bersama hasil evaluasi.",
            ],
          ].map(([Icon, title, text]) => (
            <div key={title} className="border-t border-gold/50 pt-6">
              <Icon size={24} className="mb-5 text-brown" strokeWidth={1.3} />
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-3 text-xs leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-line bg-paper p-7">
        <SectionHeading
          eyebrow="Alur sistem"
          title="Satu alur, dari gambar ke prediksi."
        />
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {[
            "Gambar pengguna",
            "Preprocessing",
            "MobileNetV3",
            "Skor setiap kelas",
            "Hasil prediksi",
          ].map((t, i) => (
            <div className="flex items-center gap-3" key={t}>
              <span className="rounded-lg border border-line bg-cream px-4 py-3">
                {t}
              </span>
              {i < 4 && <ArrowRight size={16} className="text-gold" />}
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-6 text-muted">
          Mode DEMO hanya mensimulasikan alur antarmuka. Prediksi sesungguhnya
          memerlukan model terlatih, preprocessing, dan urutan kelas dari Google
          Colab.
        </p>
      </section>
      <section className="py-14">
        <SectionHeading
          eyebrow="Fondasi aplikasi"
          title="Teknologi yang digunakan"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              Code2,
              "Frontend",
              "React, Vite, Tailwind CSS, React Router, Lucide",
            ],
            [
              Layers,
              "Visualisasi",
              "Dashboard evaluasi, heatmap, dan laporan per kelas",
            ],
            [
              Cpu,
              "Backend & model",
              "FastAPI, Pillow, adapter framework sesuai model Colab",
            ],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-lg border border-line p-5">
              <Icon size={20} className="mb-4 text-brown" />
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8">
        <p className="font-display text-2xl">
          Siap mengenali motif pertama Anda?
        </p>
        <Button to="/klasifikasi">
          Mulai Klasifikasi <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
