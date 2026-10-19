export function ProjectCard({ project }) {
  return (
    <article className="card">
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <p className="mono">{project.stack.join(" · ")}</p>
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      )}
    </article>
  );
}
