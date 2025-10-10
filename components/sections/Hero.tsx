import { SectionShell } from "./SectionShell";

export default async function Hero() {
  return (
    <SectionShell id="hero">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
        CÉU builds faster, stronger, and better.
      </h1>
      <p className="mt-4 text-lg text-zinc-700">
        Self-performing construction in the Algarve using innovative methods like Sismo.
      </p>
    </SectionShell>
  );
}
