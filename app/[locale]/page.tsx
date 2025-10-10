import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Sismo from "@/components/sections/Sismo";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default async function Page() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Sismo />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
