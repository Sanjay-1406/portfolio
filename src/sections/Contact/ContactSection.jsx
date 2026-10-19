import { useState } from 'react'
import { profile } from '../../content/profile.js'

export function ContactSection() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="section" id="contact">
      <p className="mono">04 — Contact</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
      <button type="button" className="btn" onClick={copy}>
        {copied ? 'Copied ✓' : 'Copy email'}
      </button>
    </section>
  )
}