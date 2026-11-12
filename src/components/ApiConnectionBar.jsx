import {
  CheckCircle2,
  AlertCircle,
  WifiOff,
  LoaderCircle,
  RefreshCw,
  FlaskConical,
} from "lucide-react";

const appearances = {
  connected: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  offline: { icon: WifiOff, classes: "border-red-200 bg-red-50 text-red-800" },
  model_unavailable: {
    icon: AlertCircle,
    classes: "border-amber-200 bg-amber-50 text-amber-800",
  },
  demo: { icon: FlaskConical, classes: "border-gold/40 bg-gold/10 text-brown" },
  checking: { icon: LoaderCircle, classes: "border-line bg-paper text-muted" },
};

export function ApiStatusBadge({ connection }) {
  const appearance = appearances[connection.state] || appearances.checking;
  const Icon = appearance.icon;
  return (
    <span
      title={connection.message}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${appearance.classes}`}
    >
      <Icon
        size={13}
        aria-hidden="true"
        className={connection.state === "checking" ? "animate-spin" : ""}
      />
      {connection.label}
    </span>
  );
}

export default function ApiConnectionBar({ connection }) {
  return (
    <div className="border-t border-line/70 bg-paper/70">
      <div className="mx-auto flex min-h-11 max-w-[1320px] items-center justify-between gap-3 px-5 py-2 sm:px-8 lg:px-12">
        <div
          role="status"
          aria-live="polite"
          className="flex min-w-0 items-center gap-3"
        >
          <ApiStatusBadge connection={connection} />
          <span className="hidden text-[10px] leading-5 text-muted md:block">
            {connection.message}
          </span>
        </div>
        {connection.state !== "demo" && (
          <button
            onClick={connection.refresh}
            disabled={connection.checking}
            className="inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded px-1 text-[10px] font-medium text-brown transition hover:text-navy"
          >
            <RefreshCw
              size={12}
              aria-hidden="true"
              className={connection.checking ? "animate-spin" : ""}
            />
            {connection.checking ? "Memeriksa..." : "Cek koneksi"}
          </button>
        )}
      </div>
    </div>
  );
}
