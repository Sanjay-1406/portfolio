// App.jsx — page layout: Nav, all sections, Footer
import { Nav } from "../components/Nav.jsx";
import { Footer } from "../components/Footer.jsx";
import { Hero } from "../sections/Hero/Hero.jsx";
import { ProjectsSection } from "../sections/Projects/ProjectsSection.jsx";
import { AboutSection } from "../sections/About/AboutSection.jsx";
import { ResumeSection } from "../sections/Resume/ResumeSection.jsx";
import { ContactSection } from "../sections/Contact/ContactSection.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
