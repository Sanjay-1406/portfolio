import { profile } from "../../content/profile.js";

export function AboutSection() {
  return (
    <section className="section" id="about">
      <p className="mono">02 — About</p>
      <h2>About</h2>
      <p style={{ whiteSpace: "pre-line" }}>{profile.bio}</p>
    </section>
  );
}
