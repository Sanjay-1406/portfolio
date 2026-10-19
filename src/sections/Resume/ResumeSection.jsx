import { profile } from '../../content/profile.js'

export function ResumeSection() {
  return (
    <section className="section" id="resume">
      <p className="mono">03 — Resume</p>
      <h2>Resume</h2>
      <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">
        Download PDF
      </a>
    </section>
  )
}