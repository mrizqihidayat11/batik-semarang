import { LoaderCircle } from "lucide-react";
export default function LoadingState({ label = "Memuat data…" }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 py-12 text-center"
    >
      <LoaderCircle className="animate-spin text-brown" size={30} />
      <p className="text-sm text-muted">{label}</p>
      <div className="h-1.5 w-44 overflow-hidden rounded-full bg-line">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gold" />
      </div>
    </div>
  );
}
