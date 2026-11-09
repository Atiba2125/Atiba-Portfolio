import { motion } from 'framer-motion'
import { aboutDetails, aboutText, stats } from '../data.js'
import { Counter, Reveal, ScrollText } from './ui.jsx'

/** Renders **bold** markers as <strong> */
function Rich({ text }) {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <Reveal className="tag-row" y={20}>
          <span className="tag-pill"><i className="dot" /> About</span>
        </Reveal>
        <ScrollText text={aboutText} className="about-text" />
        <div className="about-details">
          {aboutDetails.map((d, i) => (
            <Reveal key={d.label} delay={i * 0.12} y={30} className="about-detail">
              <h3>{d.label}</h3>
              <p><Rich text={d.text} /></p>
            </Reveal>
          ))}
        </div>
        <div className="about-stats">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="about-stat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <b><Counter to={s.value} suffix={s.suffix} /></b>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
