import { SectionShell } from "./SectionShell";

export default async function Projects() {
  return (
    <SectionShell
      id="projects"
      title="Projects"
      subtitle="Curated case studies with high-quality photos and time-lapses."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="aspect-video rounded-lg bg-zinc-100" />
        <div className="aspect-video rounded-lg bg-zinc-100" />
        <div className="aspect-video rounded-lg bg-zinc-100" />
      </div>
    </SectionShell>
  );
}
