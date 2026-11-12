import { ArrowUpRight } from "lucide-react";
export default function BatikCard({ batik, onClick }) {
  return (
    <button
      onClick={() => onClick(batik)}
      className="group overflow-hidden rounded-xl border border-line bg-paper text-left transition duration-300 hover:-translate-y-1 hover:border-brown/30 hover:shadow-soft"
    >
      <div className="relative h-48 overflow-hidden sm:h-52">
        <img
          src={batik.image}
          alt={`Ilustrasi placeholder untuk ${batik.name}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded bg-black/30 px-2 py-1 text-[9px] tracking-wider text-white backdrop-blur">
          ILUSTRASI MOTIF
        </span>
        <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/95 text-brown">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="p-5">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-[.15em] text-muted">
          Koleksi {batik.id} <span className="mx-1">/</span> Batik cap
        </p>
        <h3 className="font-display text-xl">{batik.shortName}</h3>
        <p className="mt-2 text-[11px] text-muted">
          Batik Semarang{" "}
          <span className="float-right text-brown">Lihat detail →</span>
        </p>
      </div>
    </button>
  );
}
