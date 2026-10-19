import { profile } from "../content/profile";

export function Footer() {
  return (
    <footer
      className="section mono"
      style={{ borderTop: "1px solid var(--gunmetal)" }}
    >
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        {" · "}
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        {" · "}
        <a href={`mailto:${profile.email}`}>Email</a>
      </p>
    </footer>
  );
}
