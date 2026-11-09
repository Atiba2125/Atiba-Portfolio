import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, animate } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/** Fade + slide in when scrolled into view */
export function Reveal({ children, delay = 0, y = 40, className = '', as = 'div', ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Text that rolls up on hover (parent <a>/<button> hover triggers it) */
export function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll-in" data-t={children}>{children}</span>
    </span>
  )
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

/** Pill button / link that is gently pulled toward the cursor */
export function Pill({ children, className = '', arrow = true, strength = 0.25, as = 'a', ...rest }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  const Tag = motion[as]
  return (
    <Tag
      ref={ref}
      className={`pill ${className}`}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      {...rest}
    >
      <Roll>{children}</Roll>
      {arrow && <Arrow />}
    </Tag>
  )
}

/** Counts up once visible */
export function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{val}{suffix}</span>
}

/** Words slide up out of a mask, one after another */
export function SplitWords({ text, className = '', delay = 0, tag: Tag = 'span' }) {
  // observe the wrapper, not the moving words: the clipping mask would hide them from the observer
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="sw-mask" aria-hidden="true">
            <motion.span
              className="sw-word"
              initial={{ y: '115%' }}
              animate={{ y: inView ? 0 : '115%' }}
              transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}

function ScrollWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

/** Paragraph whose words light up as you scroll through it */
export function ScrollText({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <ScrollWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</ScrollWord>{' '}
        </span>
      ))}
    </p>
  )
}

/** Giant faint word behind a section title that drifts sideways while scrolling */
export function BgWord({ text, dark = false }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-14%'])
  return (
    <div ref={ref} className={`bgword ${dark ? 'dark' : ''}`} aria-hidden="true">
      <motion.span style={{ x }}>{text}</motion.span>
    </div>
  )
}

/** Section title with a leading slash, e.g. /SELECTED WORK */
export function SlashTitle({ children, className = '' }) {
  return (
    <h2 className={`slash-title ${className}`}>
      <SplitWords text={`/${children}`} />
    </h2>
  )
}

/** Custom cursor: dot that grows over links and shows a label over [data-cursor] */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.5 })
  const [mode, setMode] = useState({ kind: 'idle', label: '' })
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setOn(true) }
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor]')
      if (t) setMode({ kind: 'label', label: t.dataset.cursor })
      else if (e.target.closest?.('a, button, input, textarea')) setMode({ kind: 'link', label: '' })
      else setMode({ kind: 'idle', label: '' })
    }
    const leave = () => setOn(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  const size = mode.kind === 'label' ? 88 : mode.kind === 'link' ? 46 : 14
  return (
    <motion.div className="cursor" aria-hidden="true" style={{ x: sx, y: sy }} animate={{ opacity: on ? 1 : 0 }}>
      <motion.div className="cursor-dot" animate={{ width: size, height: size }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}>
        <motion.span animate={{ opacity: mode.kind === 'label' ? 1 : 0, scale: mode.kind === 'label' ? 1 : 0.6 }}>{mode.label}</motion.span>
      </motion.div>
    </motion.div>
  )
}
