import { ProjectCard } from "../../components/ProjectCard";
import { projects } from "../../content/projects";

export function ProjectsSection() {
  return (
    <>
      <section className="section" id="work">
        <p className="mono">01 — Work</p>
        <h2>Projects</h2>
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </>
  );
}
