import { profile } from "../content/profile.js";

export function Nav() {
  return (
    <>
      <header className="nav">
        <a className="nav__brand mono" href="#top">
          {profile.name}
        </a>
        <nav aria-label="Primary">
          <ul className="nav__list">
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href={profile.resume} target="_blank" rel="noreferrer">
                Resume
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
