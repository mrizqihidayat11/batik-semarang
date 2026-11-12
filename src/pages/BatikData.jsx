import { useState } from "react";
import { Search, SlidersHorizontal, Flower2, X } from "lucide-react";
import PageIntro from "../components/PageIntro";
import BatikCard from "../components/BatikCard";
import MotifDetail from "../components/MotifDetail";
import { batikClasses } from "../data/batikClasses";
export default function BatikData() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const list = batikClasses.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filter || b.id === filter),
  );
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-12">
      <PageIntro
        eyebrow="Arsip motif • 10 kelas penelitian"
        title={
          <>
            Ragam <span className="italic text-brown">Batik Semarang.</span>
          </>
        }
        description="Jelajahi sepuluh kelas motif yang digunakan dalam sistem klasifikasi. Sebuah langkah kecil untuk mengenal warisan budaya lebih dekat."
      />
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={18} className="absolute left-4 top-3.5 text-muted" />
          <input
            aria-label="Cari nama motif"
            placeholder="Cari nama motif batik…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-line bg-paper py-3 pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3">
          <SlidersHorizontal size={16} className="text-brown" />
          <select
            aria-label="Filter kelas motif"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-[230px] bg-transparent py-3 text-xs"
          >
            <option value="">Semua kelas motif</option>
            {batikClasses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs text-muted">
          Menampilkan{" "}
          <span className="font-semibold text-navy">{list.length}</span> dari 10
          motif
        </p>
        <span className="rounded-full border border-gold/30 px-3 py-1 text-[9px] text-brown">
          Gambar placeholder
        </span>
      </div>
      {list.length ? (
        <div className="grid gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((b) => (
            <BatikCard key={b.id} batik={b} onClick={setSelected} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line py-20 text-center">
          <Flower2 size={40} className="mx-auto mb-4 text-gold" />
          <h2 className="font-display text-2xl">Motif tidak ditemukan</h2>
          <p className="mt-3 text-sm text-muted">
            Coba nama lain atau hapus filter pencarian.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("");
            }}
            className="mx-auto mt-5 flex items-center gap-2 text-sm text-brown"
          >
            <X size={15} /> Reset pencarian
          </button>
        </div>
      )}
      <div className="mt-8 rounded-xl border border-line bg-paper p-5 text-xs leading-6 text-muted">
        <strong className="text-navy">Catatan dokumentasi.</strong> Semua gambar
        saat ini adalah ilustrasi dekoratif, bukan contoh asli kelas tersebut.
        Deskripsi dan karakteristik motif akan ditambahkan berdasarkan
        dokumentasi penelitian yang terverifikasi.
      </div>
      {selected && (
        <MotifDetail batik={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
