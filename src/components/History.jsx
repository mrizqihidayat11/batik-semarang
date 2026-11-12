import { useState } from "react";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Eye,
  HardDrive,
  X,
} from "lucide-react";
import { batikClasses } from "../data/batikClasses";
import { formatConfidence, formatDate } from "../utils/formatConfidence";
import Modal from "./Modal";
import PredictionResult from "./PredictionResult";
import Button from "./Button";
export default function History({ items, onDelete, onClear }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const filtered = items.filter(
    (h) =>
      `${h.filename} ${h.result.predicted_class}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!filter || h.result.predicted_class === filter),
  );
  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <HistoryIcon size={20} className="text-brown" /> Riwayat klasifikasi{" "}
          <span className="ml-1 rounded-full bg-line px-2 py-1 font-sans text-[10px]">
            {items.length}
          </span>
        </h2>
        {items.length > 0 && (
          <button
            onClick={() => setConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-red-700"
          >
            <Trash2 size={14} /> Hapus semua
          </button>
        )}
      </div>
      <p className="mb-5 flex items-start gap-2 text-[11px] leading-5 text-muted">
        <HardDrive size={14} className="mt-0.5 shrink-0" />
        Riwayat disimpan di localStorage pada browser dan perangkat ini. Gambar
        tidak disimpan.
      </p>
      {items.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-3 text-muted" />
            <input
              aria-label="Cari riwayat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama file atau motif…"
              className="w-full rounded-lg border border-line bg-paper py-2.5 pl-9 pr-3 text-xs"
            />
          </div>
          <select
            aria-label="Filter kelas riwayat"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-xs"
          >
            <option value="">Semua kelas</option>
            {batikClasses.map((b) => (
              <option key={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}
      {filtered.length ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-line bg-cream/60 text-[10px] text-muted">
              <tr>
                {[
                  "Nama file",
                  "Tanggal & waktu",
                  "Hasil prediksi",
                  "Confidence",
                  "Status",
                  "Aksi",
                ].map((t) => (
                  <th key={t} className="px-5 py-4 font-medium">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} className="border-b border-line last:border-0">
                  <td className="max-w-[180px] truncate px-5 py-4">
                    {h.filename}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[10px] text-muted">
                    {formatDate(h.createdAt)}
                  </td>
                  <td className="px-5 py-4">{h.result.predicted_class}</td>
                  <td className="px-5 py-4 text-brown">
                    {formatConfidence(h.result.confidence)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded px-2 py-1 text-[9px] ${h.result.is_demo ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}
                    >
                      {h.result.is_demo ? "DEMO DATA" : "Prediksi model"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <button
                        aria-label={`Lihat hasil ${h.filename}`}
                        onClick={() => setSelected(h)}
                        className="rounded p-2 hover:bg-cream"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        aria-label={`Hapus ${h.filename}`}
                        onClick={() => onDelete(h.id)}
                        className="rounded p-2 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-paper/40 py-12 text-center">
          <HistoryIcon size={28} className="mx-auto text-gold" />
          <p className="mt-3 text-sm">
            {items.length
              ? "Riwayat tidak ditemukan"
              : "Belum ada riwayat klasifikasi"}
          </p>
          <p className="mt-2 text-xs text-muted">
            {items.length
              ? "Coba kata kunci atau filter lain."
              : "Hasil yang Anda simpan akan muncul di sini."}
          </p>
          {items.length > 0 && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("");
              }}
              className="mx-auto mt-4 flex gap-1 text-xs text-brown"
            >
              <X size={13} /> Reset filter
            </button>
          )}
        </div>
      )}
      {selected && (
        <Modal title="Detail hasil tersimpan" onClose={() => setSelected(null)}>
          <p className="mb-5 break-words text-xs text-muted">
            {selected.filename} · {formatDate(selected.createdAt)}
          </p>
          <PredictionResult
            result={selected.result}
            filename={selected.filename}
          />
        </Modal>
      )}
      {confirm && (
        <Modal title="Hapus semua riwayat?" onClose={() => setConfirm(false)}>
          <p className="text-sm leading-7 text-muted">
            Semua {items.length} hasil tersimpan pada browser ini akan dihapus.
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button secondary onClick={() => setConfirm(false)}>
              Batal
            </Button>
            <Button
              className="!border-red-700 !bg-red-700"
              onClick={() => {
                onClear();
                setConfirm(false);
              }}
            >
              Hapus semua
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
