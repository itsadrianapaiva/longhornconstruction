import { SectionShell } from "./SectionShell";

export default async function About() {
  return (
    <SectionShell
      id="about"
      title="Think beyond the sky"
      subtitle="North American roots, thriving in Portugal. A large, skilled team that self-performs every trade."
    >
      <p className="text-zinc-700">
        Owning equipment and employing our crews gives tighter control over quality, timelines, and safety.
      </p>
    </SectionShell>
  );
}
