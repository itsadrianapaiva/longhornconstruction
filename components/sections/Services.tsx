import { SectionShell } from "./SectionShell";

export default async function Services() {
  return (
    <SectionShell
      id="services"
      title="Services"
      subtitle="Everything in-house: earthworks, concrete, masonry, finishes, and more."
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 text-zinc-700">
        <li>Design-assist & preconstruction</li>
        <li>Earthworks & foundations</li>
        <li>Structural systems (incl. Sismo)</li>
        <li>Masonry & finishes</li>
        <li>MEP coordination</li>
        <li>Turnkey delivery</li>
      </ul>
    </SectionShell>
  );
}
