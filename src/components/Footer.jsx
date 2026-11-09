import { useEffect, useState } from 'react'
import { nav, profile } from '../data.js'
import { Arrow, Reveal, Roll } from './ui.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { timeZone: profile.tz, hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 30000)
    return () => clearInterval(t)
  }, [])

  const connect = [
    { label: 'LinkedIn', href: profile.linkedin, ext: true },
    { label: 'GitHub', href: profile.github, ext: true },
    { label: 'Email', href: `mailto:${profile.email}` },
  ]

  return (
    <footer className="footer">
      <div className="foot-grid">
        <Reveal className="foot-brand" y={24}>
          <a href="#home" className="foot-logo" aria-label="Back to top"><Logo size={52} animate={false} /></a>
          <p>Full-stack developer building robust back-ends and modern, responsive web experiences.</p>
          <a className="foot-mail" href={`mailto:${profile.email}`}>
            <Roll>{profile.email}</Roll>
            <Arrow />
          </a>
        </Reveal>

        <Reveal as="nav" className="foot-col" aria-label="Footer navigation" delay={0.1} y={24}>
          <h4>Navigate</h4>
          <a href="#home"><Roll>Home</Roll></a>
          {nav.map((n) => <a key={n.id} href={`#${n.id}`}><Roll>{n.label}</Roll></a>)}
        </Reveal>

        <Reveal className="foot-col" delay={0.2} y={24}>
          <h4>Connect</h4>
          {connect.map((c) => (
            <a key={c.label} href={c.href} target={c.ext ? '_blank' : undefined} rel="noopener noreferrer">
              <Roll>{c.label}</Roll>
            </a>
          ))}
        </Reveal>
      </div>

      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <span className="foot-time"><i className="dot" /> {profile.city.replace('PK', 'Pakistan')} · {time}</span>
        <a className="to-top" href="#home">
          Back to top
          <i aria-hidden="true"><Arrow /></i>
        </a>
      </div>
    </footer>
  )
}
