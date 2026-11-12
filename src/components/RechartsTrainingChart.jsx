import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
export default function RechartsTrainingChart({ data, kind }) {
  if (!data.length)
    return (
      <p className="py-16 text-center text-xs text-muted">
        Riwayat training belum tersedia.
      </p>
    );
  const accuracy = kind === "accuracy";
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 15, left: -20, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 4"
            vertical={false}
            stroke="#E6E1D7"
          />
          <XAxis
            dataKey="epoch"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={accuracy ? [0, 1] : [0, "auto"]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v) => Number(v).toFixed(4)}
            labelFormatter={(v) => `Epoch ${v}`}
            contentStyle={{
              background: "#FFFCF7",
              border: "1px solid #E6E1D7",
              borderRadius: 8,
              fontSize: 11,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey={accuracy ? "accuracy" : "loss"}
            name={`Training ${kind}`}
            stroke="#76513B"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={accuracy ? "val_accuracy" : "val_loss"}
            name={`Validation ${kind}`}
            stroke="#C49A55"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
