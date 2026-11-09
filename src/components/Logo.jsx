import { useId } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/**
 * Atiba Ayub monogram: two "A"s that share their middle foot (one continuous zigzag).
 * viewBox 70 x 48 — `size` is the height in px.
 */
export default function Logo({ size = 44, animate = true, className = '' }) {
  const clipId = `lc${useId().replace(/:/g, '')}`

  const draw = (delay, duration = 1.1) => ({
    initial: animate ? { pathLength: 0 } : false,
    animate: { pathLength: 1 },
    transition: { duration, delay, ease },
  })

  const stroke = { fill: 'none', strokeWidth: 5.5, strokeLinejoin: 'miter', strokeMiterlimit: 10 }

  return (
    <svg className={`logo ${className}`} width={(size * 70) / 48} height={size} viewBox="0 0 70 48" role="img" aria-label="Atiba Ayub logo">
      <defs>
        {/* flat feet: legs run past the baseline and are cut off at y = 43 */}
        <clipPath id={clipId}><rect x="0" y="0" width="70" height="43" /></clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`} className="logo-ink">
        <motion.path d="M1.73 48 L19 10 L34 43 L49 10 L66.27 48" {...stroke} {...draw(0.15)} />
        <motion.path d="M8.55 33 H29.45" {...stroke} {...draw(1.0, 0.5)} />
        <motion.path d="M38.55 33 H59.45" {...stroke} {...draw(1.15, 0.5)} />
      </g>
    </svg>
  )
}
