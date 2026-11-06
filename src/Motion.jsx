import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { experience, projects, skills } from './content'
import { skillInsights } from './skillInsights'

const REDUCED = '(prefers-reduced-motion: reduce)'
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value))

export function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMedia(REDUCED)

// Aracaju shares the America/Maceio time zone (UTC−3, no DST).
const timeFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Maceio',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})
const shortTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Maceio',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function LiveClock({ seconds = true }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <time className="live-clock" dateTime={now.toISOString()}>
      {(seconds ? timeFormat : shortTimeFormat).format(now)}
    </time>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_+*#'

// Visual-only decode effect. The readable label lives in a screen-reader span,
// so assistive technology never hears the scrambled characters.
export function ScrambleText({ text, className = '' }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    ref.current.textContent = text
  }, [text])
  useEffect(() => {
    const element = ref.current
    const host = element.closest('a, button') || element
    const reduced = window.matchMedia(REDUCED)
    let frame = 0
    const run = () => {
      if (reduced.matches) return
      cancelAnimationFrame(frame)
      const start = performance.now()
      const duration = 380
      const tick = (time) => {
        const progress = Math.min(1, (time - start) / duration)
        const revealed = Math.floor(progress * text.length)
        let output = ''
        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          output +=
            i < revealed || char === ' '
              ? char
              : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        element.textContent = output
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    host.addEventListener('pointerenter', run)
    host.addEventListener('focus', run)
    return () => {
      host.removeEventListener('pointerenter', run)
      host.removeEventListener('focus', run)
      cancelAnimationFrame(frame)
      element.textContent = text
    }
  }, [text])
  return (
    <span className={`scramble ${className}`}>
      <span aria-hidden="true" ref={ref} />
      <span className="sr-only">{text}</span>
    </span>
  )
}

// Pointer-driven effects share one listener and one animation frame.
// Nothing here owns navigation or replaces the native cursor.
export function MotionEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia(REDUCED)
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        entry.target.classList.toggle('motion-active', entry.isIntersecting),
      )
    })
    document
      .querySelectorAll('.hero, .ticker, .work-viewer, .matrix')
      .forEach((element) => visibility.observe(element))

    const hero = document.querySelector('.hero')
    const light = document.querySelector('.hero-light')
    const readout = document.querySelector('[data-pointer-readout]')
    let frame = 0
    let position = null
    let tiltTarget = null
    let magnet = null

    const resetTilt = () => {
      if (!tiltTarget) return
      ;['--tilt-x', '--tilt-y', '--spot-x', '--spot-y'].forEach((name) =>
        tiltTarget.style.removeProperty(name),
      )
      tiltTarget.classList.remove('is-pointing')
      tiltTarget = null
    }
    const resetMagnet = () => {
      if (!magnet) return
      magnet.style.removeProperty('--mx')
      magnet.style.removeProperty('--my')
      magnet = null
    }

    const paint = () => {
      frame = 0
      if (!position) return
      const { x, y, target } = position

      if (hero && hero.classList.contains('motion-active')) {
        const rect = hero.getBoundingClientRect()
        if (light)
          light.style.transform = `translate3d(${x - rect.left}px, ${y - rect.top}px, 0)`
        if (readout)
          readout.textContent = `X ${String(Math.round(x)).padStart(4, '0')} · Y ${String(Math.round(y - rect.top)).padStart(4, '0')}`
      }

      const tilt = target?.closest('[data-tilt]')
      if (tilt !== tiltTarget) resetTilt()
      if (tilt) {
        tiltTarget = tilt
        const rect = tilt.getBoundingClientRect()
        const px = clamp((x - rect.left) / rect.width)
        const py = clamp((y - rect.top) / rect.height)
        const strength = Number(tilt.dataset.tilt) || 5
        tilt.style.setProperty('--tilt-x', `${(0.5 - py) * strength}deg`)
        tilt.style.setProperty('--tilt-y', `${(px - 0.5) * strength}deg`)
        tilt.style.setProperty('--spot-x', `${px * 100}%`)
        tilt.style.setProperty('--spot-y', `${py * 100}%`)
        tilt.classList.add('is-pointing')
      }

      const spotlight = target?.closest('[data-spotlight]')
      if (spotlight) {
        spotlight.querySelectorAll('.spot-cell').forEach((cell) => {
          const rect = cell.getBoundingClientRect()
          cell.style.setProperty('--cx', `${x - rect.left}px`)
          cell.style.setProperty('--cy', `${y - rect.top}px`)
        })
      }

      const magnetic = target?.closest('[data-magnetic]')
      if (magnetic !== magnet) resetMagnet()
      if (magnetic) {
        magnet = magnetic
        const rect = magnetic.getBoundingClientRect()
        const dx = x - (rect.left + rect.width / 2)
        const dy = y - (rect.top + rect.height / 2)
        magnetic.style.setProperty('--mx', `${clamp(dx * 0.22, -8, 8)}px`)
        magnetic.style.setProperty('--my', `${clamp(dy * 0.3, -6, 6)}px`)
      }
    }

    const move = (event) => {
      if (!finePointer.matches || reduced.matches) return
      position = { x: event.clientX, y: event.clientY, target: event.target }
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const leave = () => {
      position = null
      resetTilt()
      resetMagnet()
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', leave)
    return () => {
      visibility.disconnect()
      document.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', leave)
      cancelAnimationFrame(frame)
      leave()
    }
  }, [])
  return null
}

export function CodeMarquee() {
  const words = [
    'DO CONCEITO AO DEPLOY',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'const curiosity = true;',
    'React',
    'Docker',
    'Figma',
    'IA APLICADA',
  ]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-copy" key={copy}>
            {words.map((word) => (
              <span key={word}>
                {word}
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// A changelog whose rail fills as the reader scrolls through it.
export function ExperienceJourney() {
  const listRef = useRef(null)
  const fillRef = useRef(null)
  useEffect(() => {
    const list = listRef.current
    const entries = [...list.querySelectorAll('.log-entry')]
    const reduced = window.matchMedia(REDUCED)
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.62
      const rect = list.getBoundingClientRect()
      const progress = reduced.matches
        ? 1
        : clamp((line - rect.top) / Math.max(1, rect.height))
      fillRef.current.style.transform = `scaleY(${progress})`
      entries.forEach((entry) => {
        const node = entry.querySelector('.log-node')
        entry.classList.toggle(
          'is-reached',
          reduced.matches || node.getBoundingClientRect().top < line,
        )
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
    }
  }, [])
  return (
    <ol className="log" ref={listRef}>
      <span className="log-rail" aria-hidden="true">
        <span ref={fillRef} />
      </span>
      {experience.map((item, index) => (
        <li className="log-entry" key={item.company}>
          <div className="log-meta">
            <span>LOG/{String(index + 1).padStart(2, '0')}</span>
            <span>{item.period}</span>
          </div>
          <span className="log-node" aria-hidden="true" />
          <div className="log-body reveal">
            <h3>{item.role}</h3>
            <p className="log-company">{item.company}</p>
            {item.highlight && (
              <span className="log-highlight">{item.highlight}</span>
            )}
            <p className="log-description">{item.description}</p>
          </div>
        </li>
      ))}
      <li className="log-entry log-next">
        <div className="log-meta">
          <span>LOG/{String(experience.length + 1).padStart(2, '0')}</span>
          <span>EM ABERTO</span>
        </div>
        <span className="log-node" aria-hidden="true" />
        <div className="log-body">
          <p className="log-next-label">A próxima jornada está por vir.</p>
        </div>
      </li>
    </ol>
  )
}

const categorySlugs = ['back-end', 'dados', 'front-end', 'design', 'ia']
const categoryCode = [
  'await api.create(idea)',
  'connect(data, possibilities)',
  '<Experience idea={future} />',
  'prototype → test → build',
  'learn(); experiment(); repeat();',
]
const categoryProjects = [[0], [0], [1, 2, 3], [1, 3], [3]]
const glyphs = {
  TypeScript: 'TS',
  JavaScript: 'JS',
  'Node.js': 'Nd',
  'APIs REST': '{}',
  PostgreSQL: 'Pg',
  'UX/UI': 'Ux',
  'Design responsivo': 'Rs',
  'Fluxos de usuário': 'Fx',
  'IA Aplicada ao Desenvolvimento': 'Ai',
  'OpenAI Codex': 'Cx',
  'Google Cloud': 'Gc',
}
const insightKeys = Object.keys(skillInsights)
const insightFor = (item) =>
  skillInsights[item] ||
  skillInsights[
    insightKeys.find((key) => key.toLowerCase() === item.toLowerCase())
  ]

export function SkillMatrix({ onProjectSelect }) {
  const [category, setCategory] = useState(0)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const group = skills[category]
  const insight = selectedSkill ? insightFor(selectedSkill) : null
  const code = insight?.[1] || categoryCode[category]
  const selectCategory = (index) => {
    setCategory(index)
    setSelectedSkill(null)
  }
  return (
    <div className="matrix reveal">
      <div className="matrix-tabs" aria-label="Áreas de conhecimento">
        <span className="matrix-tabs-label">~/stack</span>
        {skills.map((skill, index) => (
          <button
            type="button"
            className={category === index ? 'is-selected' : ''}
            key={skill.title}
            aria-pressed={category === index}
            onClick={() => selectCategory(index)}
          >
            <span className="matrix-tab-index" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="matrix-tab-title">{skill.title}</span>
            <span className="matrix-tab-count" aria-hidden="true">
              {String(skill.items.length).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>

      <div className="matrix-panel">
        <div className="matrix-head">
          <span>
            ~/stack/{categorySlugs[category]}
            <i aria-hidden="true" />
          </span>
          <p>{group.description}</p>
        </div>
        <div
          className="matrix-grid"
          data-spotlight
          key={category}
          aria-label={`Ferramentas de ${group.title}`}
        >
          {group.items.map((item, index) => (
            <button
              type="button"
              key={item}
              className={`matrix-cell spot-cell ${selectedSkill === item ? 'is-selected' : ''}`}
              style={{ '--i': index }}
              aria-pressed={selectedSkill === item}
              onClick={() =>
                setSelectedSkill(selectedSkill === item ? null : item)
              }
            >
              <span className="matrix-cell-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="matrix-cell-glyph" aria-hidden="true">
                {glyphs[item] || item.slice(0, 2)}
              </span>
              <span className="matrix-cell-name">{item}</span>
            </button>
          ))}
        </div>
        <div
          className="matrix-terminal"
          key={`${category}-${selectedSkill}`}
          aria-live="polite"
        >
          <div className="matrix-terminal-bar" aria-hidden="true">
            <span>stdout</span>
            <span>{selectedSkill || group.title}</span>
          </div>
          <code style={{ '--chars': code.length }}>
            <span aria-hidden="true">$ </span>
            {code}
          </code>
          <p>{insight?.[0] || group.description}</p>
        </div>
        <div className="matrix-links">
          <span>ESSA ÁREA NA PRÁTICA</span>
          {categoryProjects[category].map((index) => (
            <button
              type="button"
              key={index}
              onClick={() => {
                onProjectSelect(index)
                document.getElementById('skill-projects').scrollIntoView({
                  behavior: window.matchMedia(REDUCED).matches
                    ? 'instant'
                    : 'smooth',
                  block: 'start',
                })
              }}
            >
              {projects[index].title}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
