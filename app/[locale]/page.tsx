import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Sismo from "@/components/sections/Sismo";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

// No params needed here because each section handles its own i18n.
// Prod will have only MVP section sto go live asap
export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Sismo />
      <Projects />
      <Contact />
    </>
  );
}
