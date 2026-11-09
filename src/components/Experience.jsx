import { motion } from 'framer-motion'
import { experience } from '../data.js'
import { BgWord, Reveal, SlashTitle } from './ui.jsx'

export default function Experience() {
  return (
    <section className="panel section experience dark" id="experience">
      <BgWord text="EXPERIENCE" dark />
      <div className="wrap">
        <div className="exp-head">
          <SlashTitle>EXPERIENCE</SlashTitle>
          <Reveal as="span" className="exp-note" delay={0.2} y={16}>8+ projects built</Reveal>
        </div>

        <div className="exp-rows">
          {experience.map((e, i) => (
            <Reveal className="exp-row" key={e.company} delay={i * 0.1} y={30}>
              <motion.i className="rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
              <div className="exp-main">
                <h3>{e.company}</h3>
                <p>{e.role}</p>
              </div>
              <div className="exp-side">
                <span className="exp-date">{e.date}</span>
                <span className="exp-note2">{e.note}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
