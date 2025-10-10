export function SectionShell({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        {title ? (
          <header className="mb-8">
            <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-semibold tracking-tight">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-zinc-600">{subtitle}</p> : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}
