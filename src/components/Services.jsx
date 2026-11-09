import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { services } from '../data.js'
import { BgWord, Pill, Reveal, SlashTitle } from './ui.jsx'

const ease = [0.22, 1, 0.36, 1]

function Card({ s, i, total, progress }) {
  // each card shrinks slightly as the next one slides over it
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - 1 - i) * 0.045])
  return (
    <div className="sc-wrap" style={{ '--i': i }}>
      <motion.article className={`scard t${i}`} style={{ scale }}>
        <div className="scard-top">
          <span className="scard-num">0{i + 1}</span>
          <span className="scard-ico" aria-hidden="true">{s.icon}</span>
        </div>
        <h3>{s.title}</h3>
        <p>{s.desc}</p>
        <ul className="scard-points">
          {s.points.map((pt, n) => (
            <motion.li
              key={pt}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.6, delay: 0.15 + n * 0.1, ease }}
            >
              <i aria-hidden="true">✓</i>{pt}
            </motion.li>
          ))}
        </ul>
        <div className="scard-foot">
          <div className="scard-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
          <a className="scard-link" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
        </div>
      </motion.article>
    </div>
  )
}

export default function Services() {
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start start', 'end end'] })

  return (
    <section className="panel section services" id="service">
      <BgWord text="SERVICE" />
      <div className="wrap services-grid">
        <div className="services-intro">
          <SlashTitle className="left">SERVICES</SlashTitle>
          <Reveal as="p" className="sec-sub left" delay={0.15} y={16}>
            From the database to the interface, I can take your idea all the way to a working, responsive product.
          </Reveal>
          <Reveal delay={0.25} y={16}>
            <Pill href="#contact" className="dark">Discuss your project</Pill>
          </Reveal>
          <Reveal className="intro-list" delay={0.35} y={16}>
            {services.map((s, i) => (
              <span key={s.title}><b>0{i + 1}</b>{s.title}</span>
            ))}
          </Reveal>
        </div>

        <div className="scards" ref={listRef}>
          {services.map((s, i) => (
            <Card key={s.title} s={s} i={i} total={services.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
