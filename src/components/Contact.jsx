import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data.js'
import { Arrow, Reveal, SplitWords } from './ui.jsx'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const rows = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', value: 'linkedin.com/in/atiba-ayub', href: profile.linkedin, ext: true },
    { label: 'GitHub', value: 'github.com/atiba2125', href: profile.github, ext: true },
  ]

  return (
    <section className="panel section contact" id="contact">
      <i className="cloud c1" /><i className="cloud c2" /><i className="cloud c3" />
      <div className="wrap contact-grid">
        <div className="contact-left">
          <Reveal className="tag-row" y={20}>
            <span className="tag-pill white"><i className="dot" /> Available for New Project</span>
          </Reveal>

          <h2 className="contact-title">
            <SplitWords text="LET'S WORK" />
            <br />
            <SplitWords text="TOGETHER" delay={0.15} />
          </h2>

          <Reveal as="p" className="contact-sub" delay={0.2}>
            Have an idea, a project or a role in mind? Reach out through any of the channels and I'll get back to you as soon as I can.
          </Reveal>

          <Reveal delay={0.3} y={20}>
            <button className="copy-btn" onClick={copy} type="button">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? 'c' : 'e'} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {copied ? 'Email copied ✓' : 'Copy email address'}
                </motion.span>
              </AnimatePresence>
            </button>
          </Reveal>
        </div>

        <div className="cinfo">
          {rows.map((r, i) => (
            <Reveal key={r.label} delay={0.15 + i * 0.1} y={30}>
              <a className="cinfo-row" href={r.href} target={r.ext ? '_blank' : undefined} rel="noopener noreferrer">
                <span className="cinfo-label">{r.label}</span>
                <span className="cinfo-value">{r.value}</span>
                <span className="cinfo-go"><Arrow /></span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.45} y={30}>
            <div className="cinfo-row static">
              <span className="cinfo-label">Based in</span>
              <span className="cinfo-value">{profile.city.replace('PK', 'Pakistan')} · Remote friendly</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
