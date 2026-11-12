import { useState } from "react";
export default function ConfusionMatrix({ data, classes }) {
  const [selected, setSelected] = useState(null);
  const max = Math.max(1, ...data.flat());
  return (
    <div>
      <p className="mb-4 text-center text-[10px] text-muted">
        Predicted Label →
      </p>
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[140px_repeat(10,minmax(0,1fr))] gap-1">
            <div className="flex items-end pb-2 text-[9px] text-muted">
              ↓ Actual Label
            </div>
            {classes.map((name, i) => (
              <div
                key={name}
                title={name}
                className="pb-2 text-center text-[9px] text-muted"
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            ))}
            {classes.map((name, i) => (
              <div key={name} className="contents">
                <div
                  className="flex items-center truncate pr-2 text-[9px] text-muted"
                  title={name}
                >
                  {String(i + 1).padStart(2, "0")} ·{" "}
                  {name.replace("Batik Cap ", "")}
                </div>
                {data[i].map((value, j) => (
                  <button
                    key={j}
                    onFocus={() => setSelected([i, j])}
                    onMouseEnter={() => setSelected([i, j])}
                    onClick={() => setSelected([i, j])}
                    aria-label={`Actual ${name}, predicted ${classes[j]}: ${value}`}
                    title={`Actual: ${name}
Predicted: ${classes[j]}
Jumlah: ${value}`}
                    style={{
                      backgroundColor: `rgba(118,81,59,${value === 0 ? 0.045 : 0.12 + (0.88 * value) / max})`,
                      color: value > max * 0.5 ? "#FFFCF7" : "#76513B",
                    }}
                    className="aspect-square rounded-sm text-[10px] transition hover:ring-2 hover:ring-gold"
                  >
                    {value}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        aria-live="polite"
        className="mt-4 min-h-10 rounded-lg bg-cream px-3 py-2 text-[10px] leading-5 text-muted"
      >
        {selected ? (
          <>
            Aktual:{" "}
            <strong className="text-navy">{classes[selected[0]]}</strong> ·
            Prediksi:{" "}
            <strong className="text-navy">{classes[selected[1]]}</strong> ·
            Jumlah:{" "}
            <strong className="text-brown">
              {data[selected[0]][selected[1]]}
            </strong>
          </>
        ) : (
          "Arahkan kursor, fokuskan, atau ketuk sel untuk melihat pasangan kelas dan jumlah sampel."
        )}
      </div>
    </div>
  );
}
