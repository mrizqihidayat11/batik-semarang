import { Flower2 } from "lucide-react";
export default function Brand({ light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${light ? "bg-white/10 text-gold" : "bg-brown text-cream"}`}
      >
        <Flower2 size={26} strokeWidth={1.4} />
      </span>
      <span>
        <span className="block font-display text-[21px] font-semibold leading-6 tracking-tight">
          Batik
          <span className={light ? "text-gold" : "text-brown"}>Semarang</span>
          <span className="ml-1 text-gold">.</span>
        </span>
        <span
          className={`block text-[8px] font-semibold tracking-[.24em] ${light ? "text-white/50" : "text-muted"}`}
        >
          CULTURE MEETS INTELLIGENCE
        </span>
      </span>
    </span>
  );
}
