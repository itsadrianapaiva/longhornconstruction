import { SectionShell } from "./SectionShell";

export default async function Testimonials() {
  return (
    <SectionShell
      id="testimonials"
      title="Testimonials"
      subtitle="Real feedback from clients and partners."
    >
      <blockquote className="rounded-lg border border-zinc-200 p-4 text-zinc-700">
        “CÉU delivered ahead of schedule with outstanding craftsmanship.”
        <footer className="mt-2 text-sm text-zinc-500">— Project Owner, Lagos</footer>
      </blockquote>
    </SectionShell>
  );
}
