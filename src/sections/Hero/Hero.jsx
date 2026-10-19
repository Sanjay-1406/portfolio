import { SkipIntroButton } from "../../components/SkipIntroButton";
import { profile } from "../../content/profile";

export function Hero() {
  return (
    <section className="section hero" id="top">
      <p className="mono">BACKPRESSURE — interactive systems portfolio</p>
      <h1>{profile.name}</h1>
      <p style={{ fontSize: "1.25rem" }}>{profile.tagline}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <SkipIntroButton />
      </div>
    </section>
  );
}
