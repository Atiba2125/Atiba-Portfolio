import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '../data.js'
import { Pill, Roll, Arrow } from './ui.jsx'

const ease = [0.22, 1, 0.36, 1]
const rise = (d) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease } })

function Letters({ text, kind, delay = 0 }) {
  return (
    <span className={`letters ${kind}`} aria-hidden="true">
      {[...text].map((c, i) => (
        <span className="lmask" key={i}>
          <motion.span className="l" initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: delay + i * 0.08, ease }}>
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

const socials = [
  { label: 'LinkedIn', href: profile.linkedin, ico: 'in' },
  { label: 'GitHub', href: profile.github, ico: 'gh' },
  { label: 'Email', href: `mailto:${profile.email}`, ico: '@' },
]

export default function Hero() {
  const { scrollY } = useScroll()
  const xLeft = useTransform(scrollY, [0, 600], [0, -140])
  const xRight = useTransform(scrollY, [0, 600], [0, 140])
  const pY = useTransform(scrollY, [0, 700], [0, -50])
  const copyY = useTransform(scrollY, [0, 600], [0, 60])

  return (
    <section className="panel hero" id="home">
      <div className="hero-inner">
        <h1 className="hero-name" aria-label={profile.name}>
          <motion.span style={{ x: xLeft }} className="name-part"><Letters text={profile.first} kind="outline" delay={0.1} /></motion.span>
          <motion.span style={{ x: xRight }} className="name-part"><Letters text={profile.last} kind="solid" delay={0.4} /></motion.span>
        </h1>

        <motion.div className="portrait" style={{ y: pY }}>
          <motion.figure
            className="portrait-frame"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.3, delay: 0.3, ease }}
          >
            <motion.img
              src={`${import.meta.env.BASE_URL}portrait.jpg?v=2`}
              alt={`Portrait of ${profile.name}`}
              width="727"
              height="960"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, delay: 0.3, ease }}
            />
          </motion.figure>
        </motion.div>

        <motion.div className="hero-left" style={{ y: copyY }}>
          <motion.h2 {...rise(0.7)}>{profile.role}</motion.h2>
          <motion.p {...rise(0.8)}>
            I build robust back-ends and modern, responsive web apps with Laravel, ASP.NET and the MERN stack.
          </motion.p>
          <motion.div className="hero-cta" {...rise(0.9)}>
            <Pill href="#work" className="dark">View my work</Pill>
            <Pill href="#contact" className="light">Get in touch</Pill>
          </motion.div>
        </motion.div>

        <div className="hero-right">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              className="social"
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease }}
              whileHover={{ x: -6 }}
            >
              <i className="ico">{s.ico}</i>
              <Roll>{s.label}</Roll>
              <Arrow />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
