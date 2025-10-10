import { SectionShell } from "./SectionShell";

export default async function Stats() {
  return (
    <SectionShell
      id="stats"
      title="By the numbers"
      subtitle="Early proof points. We will wire real JSON content next."
    >
      <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div>
          <dt className="text-sm text-zinc-600">Years operating</dt>
          <dd className="mt-1 text-2xl font-semibold">10+</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-600">Projects delivered</dt>
          <dd className="mt-1 text-2xl font-semibold">150+</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-600">Team members</dt>
          <dd className="mt-1 text-2xl font-semibold">60+</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-600">Owned machines</dt>
          <dd className="mt-1 text-2xl font-semibold">25+</dd>
        </div>
      </dl>
    </SectionShell>
  );
}
