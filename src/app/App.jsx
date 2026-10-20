// App.jsx — page layout: Nav, all sections, Footer
import { Nav } from "../components/Nav.jsx";
import { Footer } from "../components/Footer.jsx";
import { Hero } from "../sections/Hero/Hero.jsx";
import { ProjectsSection } from "../sections/Projects/ProjectsSection.jsx";
import { AboutSection } from "../sections/About/AboutSection.jsx";
import { ResumeSection } from "../sections/Resume/ResumeSection.jsx";
import { ContactSection } from "../sections/Contact/ContactSection.jsx";
import { DebugSim2D } from "../sections/Backpressure/DebugSim2D.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section className="section" id="backpressure-debug">
          <p className="mono">DEBUG — THROWAWAY</p>
          <h2>Simulation</h2>
          <DebugSim2D />
        </section>
        <ProjectsSection />
        <AboutSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
