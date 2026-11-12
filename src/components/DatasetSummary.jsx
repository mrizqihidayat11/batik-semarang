export default function DatasetSummary({ summary }) {
  if (!summary) return null;
  const number = (value) => value.toLocaleString("id-ID");
  return (
    <div className="mt-6 border-t border-line pt-5">
      <h3 className="text-xs font-semibold">Jumlah dataset sesuai notebook</h3>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ["Gambar awal", summary.initial_images],
          ["Duplikat diabaikan", summary.duplicates_removed],
          ["Gambar unik", summary.unique_images],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-cream px-3 py-3">
            <p className="text-[10px] leading-5 text-muted">{label}</p>
            <p className="mt-1 font-display text-xl sm:text-2xl">
              {number(value)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-6 text-muted">
        Jumlah dataset adalah gambar unik setelah pembersihan duplikat. Angka
        ini berbeda dari 303 sampel uji pada laporan evaluasi.
      </p>
      <details className="mt-3 rounded-lg border border-line px-4 py-3">
        <summary className="cursor-pointer text-xs font-medium text-brown">
          Lihat jumlah gambar unik per motif dan sumber
        </summary>
        <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {summary.per_class.map((row) => (
            <div
              key={row.class_name}
              className="flex items-start justify-between gap-3 border-b border-line py-2 text-[11px]"
            >
              <span>{row.class_name}</span>
              <span className="font-semibold">{number(row.count)}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 break-words text-[10px] leading-6 text-muted">
          Sumber: {summary.source.file}, sel daftar kelas dan pembersihan
          duplikat.
        </p>
      </details>
    </div>
  );
}
