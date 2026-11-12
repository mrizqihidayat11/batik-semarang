export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <div className="flex items-center justify-between text-muted">
        <p className="text-xs">{label}</p>
        {Icon && <Icon size={17} className="text-gold" />}
      </div>
      <p className="mt-4 font-display text-3xl">{value}</p>
      {note && <p className="mt-2 text-[10px] text-muted">{note}</p>}
    </div>
  );
}
