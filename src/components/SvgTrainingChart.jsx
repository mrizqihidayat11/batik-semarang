// Fallback offline ketika paket Recharts belum tersedia di lingkungan instalasi.
export default function SvgTrainingChart({ data, kind }) {
  const keys =
    kind === "accuracy" ? ["accuracy", "val_accuracy"] : ["loss", "val_loss"];
  const max =
    kind === "accuracy"
      ? 1
      : Math.max(1, ...data.flatMap((d) => keys.map((k) => d[k]))) * 1.1;
  if (!data.length)
    return (
      <p className="py-16 text-center text-xs text-muted">
        Riwayat training belum tersedia.
      </p>
    );
  const x = (i) => 42 + (i / Math.max(1, data.length - 1)) * 480;
  const y = (v) => 188 - (v / max) * 160;
  return (
    <div>
      <svg
        viewBox="0 0 550 225"
        role="img"
        aria-label={`Grafik training dan validation ${kind}`}
        className="w-full"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1="42"
              x2="522"
              y1={y(t * max)}
              y2={y(t * max)}
              stroke="#E6E1D7"
              strokeDasharray="3 4"
            />
            <text
              x="32"
              y={y(t * max) + 4}
              textAnchor="end"
              fontSize="9"
              fill="#7B7B75"
            >
              {(t * max).toFixed(2)}
            </text>
          </g>
        ))}
        {keys.map((key, j) => (
          <g key={key}>
            <polyline
              points={data.map((d, i) => `${x(i)},${y(d[key])}`).join(" ")}
              fill="none"
              stroke={j ? "#C49A55" : "#76513B"}
              strokeWidth="2.3"
              strokeDasharray={j ? "5 3" : undefined}
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(d[key])}
                r="4"
                fill="transparent"
                stroke="transparent"
              >
                <title>{`Epoch ${d.epoch} · ${key}: ${d[key].toFixed(4)}`}</title>
              </circle>
            ))}
          </g>
        ))}
        {data
          .filter((_, i) => i % 4 === 0 || i === data.length - 1)
          .map((d) => (
            <text
              key={d.epoch}
              x={x(data.indexOf(d))}
              y="207"
              textAnchor="middle"
              fontSize="9"
              fill="#7B7B75"
            >
              {d.epoch}
            </text>
          ))}
        <text x="280" y="223" fontSize="9" textAnchor="middle" fill="#7B7B75">
          Epoch
        </text>
      </svg>
      <div className="mt-3 flex justify-center gap-5 text-[10px] text-muted">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-brown" />
          Training {kind}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-gold" />
          Validation {kind}
        </span>
      </div>
    </div>
  );
}
