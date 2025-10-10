import { SectionShell } from "./SectionShell";

export default async function About() {
  return (
    <SectionShell
      id="about"
      title="About CÉU"
      subtitle="North American roots, thriving in Portugal. A large, skilled team that self-performs every trade."
    >
      <p className="text-zinc-700">
        Owning equipment and employing our crews gives tighter control over quality, timelines, and safety.
      </p>
    </SectionShell>
  );
}
