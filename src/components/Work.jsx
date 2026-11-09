import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data.js'
import { Arrow, BgWord, Pill, Reveal, SlashTitle } from './ui.jsx'

const filters = ['All', 'Full Stack', 'Front End', 'Live']
const ease = [0.22, 1, 0.36, 1]
const two = (n) => String(n).padStart(2, '0')
const isDesktop = () => window.matchMedia('(min-width: 901px)').matches
const hostOf = (link) => {
  try { return new URL(link).host } catch { return link }
}

function Visual({ p, big = false }) {
  // real screenshot when the project has one, otherwise a generated mock
  if (p.image) {
    return (
      <div className={`visual shot ${big ? 'big' : ''}`} style={p.bg ? { background: p.bg } : undefined}>
        <img
          src={`${import.meta.env.BASE_URL}${p.image}`}
          alt={`${p.title} screenshot`}
          loading="lazy"
          draggable="false"
          style={{ ...(p.focus && { objectPosition: p.focus }), ...(p.fit && { objectFit: p.fit }) }}
        />
      </div>
    )
  }
  return (
    <div className={`visual ${big ? 'big' : ''}`} style={{ '--c1': p.colors[0], '--c2': p.colors[1] }}>
      <i className="glow g1" /><i className="glow g2" />
      <div className="vmock">
        <div className="vbar"><i /><i /><i /></div>
        <div className="vtitle"><b>{p.title[0]}</b>{p.title.split(' — ')[0]}</div>
        <div className="vgrid">{Array.from({ length: 6 }).map((_, n) => <i key={n} style={{ '--n': n }} />)}</div>
      </div>
    </div>
  )
}

function Modal({ p, onClose }) {
  useEffect(() => {
    const key = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = prev }
  }, [onClose])

  return createPortal(
    <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-top">
          <div>
            <div className="pills">
              <span>{p.cat}</span>
              <span>{p.link ? 'Live' : 'Coming soon'}</span>
            </div>
            <h3>{p.title.split(' — ')[0]} <small>/{p.cat === 'Front End' ? 'Front End Project' : 'Full Stack Project'}</small></h3>
            <p>{p.desc}</p>
            <div className="modal-btns">
              {p.link ? (
                <Pill href={p.link} className="dark" target="_blank" rel="noopener noreferrer">Live Preview</Pill>
              ) : (
                <span className="pill ghost soon">In progress</span>
              )}
              <Pill href="#contact" className="light" onClick={onClose}>Contact Me</Pill>
            </div>
          </div>
          <dl className="meta">
            <div><dt>Service</dt><dd>{p.cat === 'Front End' ? 'Frontend Development' : 'Full Stack Development'}</dd></div>
            <div><dt>Status</dt><dd>{p.link ? 'Live' : 'Coming soon'}</dd></div>
            <div><dt>Tools</dt><dd className="tools">{p.tech.map((t) => <span key={t}>{t}</span>)}</dd></div>
          </dl>
        </div>
        <Visual p={p} big />
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export default function Work() {
  const [filter, setFilter] = useState('All')
  const [activeTitle, setActiveTitle] = useState(projects[0].title)
  const [open, setOpen] = useState(null)
  const previewRef = useRef(null)

  const list = projects.filter((p) => filter === 'All' || (filter === 'Live' ? p.link : p.cat === filter))
  const active = list.find((p) => p.title === activeTitle) || list[0]
  const idx = list.indexOf(active)

  const choose = (p) => {
    if (p.title !== active.title) {
      setActiveTitle(p.title)
      // on phones the preview sits above the list, so bring it into view
      if (!isDesktop()) previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setOpen(p)
    }
  }

  return (
    <section className="panel section work" id="work">
      <BgWord text="PORTFOLIO" />
      <div className="wrap">
        <div className="center-title">
          <SlashTitle>SELECTED WORK</SlashTitle>
          <Reveal as="p" className="sec-sub" delay={0.15} y={16}>
            Hover or tap a project to preview it. Select it again for the full details.
          </Reveal>
        </div>

        <div className="work-bar">
          <div className="tabs" role="tablist">
            {filters.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                <span>{f}</span>
                {filter === f && <motion.i className="tab-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, ease }} />}
              </button>
            ))}
          </div>
          <span className="work-count">{two(list.length)} {list.length === 1 ? 'project' : 'projects'}</span>
        </div>

        <div className="work-layout">
          {/* project index */}
          <ul className="wlist" key={filter}>
            {list.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.7, delay: i * 0.05, ease }}
              >
                <button
                  className={`wrow ${p.title === active.title ? 'active' : ''}`}
                  aria-pressed={p.title === active.title}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setActiveTitle(p.title)}
                  onFocus={() => setActiveTitle(p.title)}
                  onClick={() => choose(p)}
                >
                  <span className="wnum">{two(i + 1)}</span>
                  <span className="wmain">
                    <span className="wtitle">{p.title}</span>
                    <span className="wmeta">{p.cat} · {p.tech.slice(0, 2).join(', ')}</span>
                  </span>
                  <span className={`wstat ${p.link ? 'live' : ''}`}>
                    {p.link ? <><i className="dot" /> Live</> : 'In progress'}
                  </span>
                  <span className="wgo" aria-hidden="true"><Arrow /></span>
                </button>
              </motion.li>
            ))}
          </ul>

          {/* live preview */}
          <div className="wpreview" ref={previewRef}>
            <div className="bframe">
              <div className="bbar">
                <i /><i /><i />
                <span className="burl">{active.link ? hostOf(active.link) : 'Not deployed yet'}</span>
                <span className="bcount">{two(idx + 1)} / {two(list.length)}</span>
              </div>
              <div className="bbody">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.title}
                    className="bshot"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <Visual p={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.title}-detail`}
                className="wdetail"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="pills">
                  <span>{active.cat}</span>
                  {active.link ? <span className="live"><i className="dot" /> Live</span> : <span>Coming soon</span>}
                </div>
                <h3>{active.title}</h3>
                <p>{active.desc}</p>
                <div className="wchips">{active.tech.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="wbtns">
                  {active.link && <Pill href={active.link} className="dark" target="_blank" rel="noopener noreferrer">Live Preview</Pill>}
                  <Pill as="button" className="light" onClick={() => setOpen(active)}>View details</Pill>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>{open && <Modal key="modal" p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}
