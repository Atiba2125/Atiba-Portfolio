import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { nav } from '../data.js'
import { Pill } from './ui.jsx'
import Logo from './Logo.jsx'

export default function Navbar() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = ''
      nav.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = id
      })
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#home" className="brand" aria-label="Atiba Ayub, home">
          <Logo size={46} />
        </a>

        <nav className="nav-links desktop-only">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''}>
              <span className="nl">{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav-end">
          <Pill href="#contact" className="dark small desktop-only">Let's Talk</Pill>
          <button className={`burger mobile-only ${open ? 'open' : ''}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <i /><i />
          </button>
        </div>
        <motion.i className="nav-progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {nav.map((n, i) => (
              <motion.a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 + i * 0.07, duration: 0.7 } }}>
                {n.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
