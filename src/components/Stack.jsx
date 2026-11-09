import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { marquee, stack } from '../data.js'
import { BgWord, Reveal, SlashTitle } from './ui.jsx'

function Strip() {
  // the strip leans into the scroll direction based on scroll velocity
  const { scrollY } = useScroll()
  const v = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const skew = useTransform(v, [-2500, 2500], [-7, 7], { clamp: true })
  const set = (hidden) => (
    <div className="mq-set" aria-hidden={hidden}>
      {marquee.map((t, i) => (
        <span key={t} className={i % 2 ? 'solid' : 'outline'}>{t}<i>✦</i></span>
      ))}
    </div>
  )
  return (
    <motion.div className="strip" style={{ skewX: skew }}>
      <div className="mq-track">{set(false)}{set(true)}</div>
    </motion.div>
  )
}

export default function Stack() {
  return (
    <section className="panel section stack" id="stack">
      <BgWord text="STACK" />
      <div className="wrap">
        <SlashTitle className="left">STACK</SlashTitle>
        <Reveal as="p" className="sec-sub left" delay={0.15} y={16}>The languages, frameworks and tools I work with every day.</Reveal>
      </div>
      <Strip />
      <div className="wrap">
        <div className="stack-rows">
          {stack.map((g, i) => (
            <Reveal className="stack-row" key={g.group} delay={i * 0.06} y={30}>
              <motion.i className="rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
              <h3>{g.group}</h3>
              <div className="chips">
                {g.items.map((it, n) => (
                  <motion.span
                    key={it}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + n * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    {it}
                  </motion.span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
