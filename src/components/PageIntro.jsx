export default function PageIntro({ eyebrow, title, description, children }) {
  return (
    <div className="mb-9 border-b border-line pb-8">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.22em] text-brown">
        {eyebrow}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
