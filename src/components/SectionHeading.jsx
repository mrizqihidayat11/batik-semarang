export default function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow && (
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.22em] text-brown">
            <span className="h-px w-6 bg-gold" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl tracking-tight sm:text-[36px]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
