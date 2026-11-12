import { useRef, useState } from "react";
import { UploadCloud, ImagePlus, X, FileImage } from "lucide-react";
export default function UploadBox({
  file,
  preview,
  disabled,
  onSelect,
  onRemove,
}) {
  const input = useRef(null);
  const [dragging, setDragging] = useState(false);
  function receive(files) {
    if (!disabled && files?.[0]) onSelect(files[0]);
  }
  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        aria-label="Pilih gambar batik"
        disabled={disabled}
        onChange={(e) => {
          receive(e.target.files);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="relative flex h-64 items-center justify-center bg-cream">
            <img
              src={preview || undefined}
              alt="Pratinjau gambar batik yang diunggah"
              className="h-full w-full object-contain p-4"
            />
            <button
              disabled={disabled}
              onClick={onRemove}
              className="absolute right-3 top-3 rounded-full border border-line bg-paper p-2 hover:text-red-700"
              aria-label="Hapus gambar"
            >
              <X size={17} />
            </button>
          </div>
          <div className="flex items-center gap-3 border-t border-line bg-paper px-4 py-3">
            <FileImage className="shrink-0 text-brown" size={18} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{file.name}</p>
              <p className="mt-1 text-[10px] text-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              disabled={disabled}
              onClick={() => input.current.click()}
              className="text-xs font-semibold text-brown"
            >
              Ganti
            </button>
          </div>
        </div>
      ) : (
        <button
          disabled={disabled}
          type="button"
          onClick={() => input.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            receive(e.dataTransfer.files);
          }}
          className={`flex min-h-72 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${dragging ? "border-brown bg-gold/15" : "border-[#D9CDBC] bg-cream/70 hover:border-gold hover:bg-cream"}`}
        >
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-paper text-brown shadow-sm">
            <UploadCloud size={29} strokeWidth={1.3} />
          </span>
          <span className="font-display text-xl">
            Tarik gambar batik ke sini
          </span>
          <span className="mt-2 text-xs text-muted">
            atau klik untuk memilih dari perangkat
          </span>
          <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brown px-4 py-2.5 text-xs font-semibold text-white">
            <ImagePlus size={15} /> Pilih Gambar
          </span>
          <span className="mt-4 text-[10px] text-muted">
            JPG, JPEG, PNG · Maksimal 10 MB
          </span>
        </button>
      )}
    </div>
  );
}
