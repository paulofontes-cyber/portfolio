import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Code2, MoveUpRight, Orbit, Rocket } from 'lucide-react'
import { experience, projects, skills } from './content'
import { skillInsights } from './skillInsights'

// Decorative motion never owns navigation or blocks the native pointer.
export function MotionEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        entry.target.classList.toggle('motion-active', entry.isIntersecting),
      )
    })
    document
      .querySelectorAll(
        '.hero, .code-marquee, .skill-universe, .contact, .project-chapter',
      )
      .forEach((element) => motionObserver.observe(element))
    let frame = 0
    let current = null
    let position = null
    const reset = () => {
      if (current) {
        current.style.removeProperty('--pointer-x')
        current.style.removeProperty('--pointer-y')
        current.style.removeProperty('--tilt-x')
        current.style.removeProperty('--tilt-y')
        current.style.removeProperty('--spot-x')
        current.style.removeProperty('--spot-y')
      }
      current = null
    }
    const move = (event) => {
      if (!finePointer.matches || reduced.matches) return
      const target = event.target.closest(
        '.hero-art, .project-portal, .galaxy-map',
      )
      if (target !== current) reset()
      if (!target) return
      current = target
      position = { x: event.clientX, y: event.clientY }
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          if (!current || !position) return
          const rect = current.getBoundingClientRect()
          const x = (position.x - rect.left) / rect.width - 0.5
          const y = (position.y - rect.top) / rect.height - 0.5
          current.style.setProperty('--pointer-x', `${x * 24}px`)
          current.style.setProperty('--pointer-y', `${y * 24}px`)
          current.style.setProperty('--tilt-x', `${-y * 5}deg`)
          current.style.setProperty('--tilt-y', `${x * 5}deg`)
          current.style.setProperty('--spot-x', `${(x + 0.5) * 100}%`)
          current.style.setProperty('--spot-y', `${(y + 0.5) * 100}%`)
        })
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', reset)
    reduced.addEventListener('change', reset)
    return () => {
      motionObserver.disconnect()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', reset)
      reduced.removeEventListener('change', reset)
      cancelAnimationFrame(frame)
      reset()
    }
  }, [])
  return null
}

export function StarField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: -1000, y: -1000 }
    let width = 0
    let height = 0
    let stars = []
    let frame = 0
    let visible = false
    let lastTime = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      stars = Array.from(
        { length: Math.min(90, Math.floor(width / 15)) },
        (_, i) => ({
          x: (((i * 137.508 + 29) % 1000) / 1000) * width,
          y: (((i * 271.31 + 53) % 1000) / 1000) * height,
          size: i % 4 === 0 ? 1.6 : 0.7,
          speed: 0.3 + (i % 5) * 0.12,
        }),
      )
      if (reduced.matches) draw(0)
    }
    const draw = (time) => {
      const step = reduced.matches ? 0 : Math.min((time - lastTime) / 16.67, 2)
      lastTime = time
      context.clearRect(0, 0, width, height)
      stars.forEach((star, i) => {
        star.y = (star.y - star.speed * step + height) % height
        const distance = Math.hypot(star.x - pointer.x, star.y - pointer.y)
        context.fillStyle =
          distance < 150
            ? '#c7fff1'
            : `rgba(156,229,223,${0.25 + (i % 4) * 0.12})`
        context.beginPath()
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        context.fill()
        if (distance < 150 && !reduced.matches) {
          context.strokeStyle = `rgba(156,229,223,${(1 - distance / 150) * 0.25})`
          context.beginPath()
          context.moveTo(star.x, star.y)
          context.lineTo(pointer.x, pointer.y)
          context.stroke()
        }
      })
      if (visible && !reduced.matches && !document.hidden)
        frame = requestAnimationFrame(draw)
    }
    const start = () => {
      cancelAnimationFrame(frame)
      lastTime = performance.now()
      draw(lastTime)
    }
    const move = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }
    const leave = () => {
      pointer.x = -1000
      pointer.y = -1000
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    const resizeObserver = new ResizeObserver(resize)
    resize()
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    canvas.parentElement.addEventListener('pointermove', move, {
      passive: true,
    })
    canvas.parentElement.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', start)
    document.addEventListener('visibilitychange', start)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      canvas.parentElement.removeEventListener('pointermove', move)
      canvas.parentElement.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', start)
      document.removeEventListener('visibilitychange', start)
    }
  }, [])
  return (
    <canvas className="interactive-stars" ref={canvasRef} aria-hidden="true" />
  )
}

export function FloatingCode() {
  return (
    <div className="floating-code" aria-hidden="true">
      <div className="code-fragment fragment-api">
        <span className="fragment-title">
          <i /> api.ts
        </span>
        <code>
          <b>const</b> future = <b>await</b>
          <br /> build({'{'}
          <em> ideas </em>
          {'}'});
        </code>
        <span className="fragment-foot">
          200 OK <i /> mission ready
        </span>
      </div>
      <span className="code-symbol symbol-braces">{'{ }'}</span>
      <span className="code-symbol symbol-tag">{'</>'}</span>
      <div className="code-fragment fragment-terminal">
        <span className="fragment-title">
          ~/universe <i />
        </span>
        <code>
          <em>❯</em> npm run explore
          <br />
          <span>✓ possibilities: infinite</span>
        </code>
      </div>
      <span className="mini-planet mini-planet-one" />
      <span className="mini-planet mini-planet-two" />
    </div>
  )
}

export function CodeMarquee() {
  const words = [
    '<code />',
    'IDEIAS EM ÓRBITA',
    'const curiosity = true;',
    'DO CONCEITO AO DEPLOY',
    '{ explore(); }',
  ]
  return (
    <div className="code-marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-copy" key={copy}>
            {words.map((word) => (
              <span key={word}>
                {word}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExperienceJourney() {
  const journeyRef = useRef(null)
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const shipRef = useRef(null)
  const [route, setRoute] = useState('')
  useEffect(() => {
    const journey = journeyRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const path = pathRef.current
      if (!path || !path.getAttribute('d')) return
      const rect = journey.getBoundingClientRect()
      const length = path.getTotalLength()
      // The luminous route follows the viewport through the actual node positions.
      const visibleY = Math.max(
        0,
        Math.min(rect.height, window.innerHeight * 0.68 - rect.top),
      )
      let low = 0
      let high = length
      for (let i = 0; i < 14; i++) {
        const middle = (low + high) / 2
        if (path.getPointAtLength(middle).y < visibleY) low = middle
        else high = middle
      }
      const traveled = reduced.matches ? length : (low + high) / 2
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length - traveled}`
      const point = path.getPointAtLength(traveled)
      const ahead = path.getPointAtLength(Math.min(length, traveled + 2))
      const angle =
        (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI + 45
      shipRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angle}deg)`
      shipRef.current.style.opacity =
        reduced.matches || visibleY === 0 ? '0' : '1'
      journey.querySelectorAll('.mission-node').forEach((node) => {
        node
          .closest('article')
          .classList.toggle(
            'is-reached',
            reduced.matches ||
              node.offsetTop + node.closest('article').offsetTop <= visibleY,
          )
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const measure = () => {
      const rect = journey.getBoundingClientRect()
      const points = [...journey.querySelectorAll('.mission-node')].map(
        (node) => {
          const nodeRect = node.getBoundingClientRect()
          return {
            x: nodeRect.left + nodeRect.width / 2 - rect.left,
            y: nodeRect.top + nodeRect.height / 2 - rect.top,
          }
        },
      )
      svgRef.current.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
      const d = points
        .map((point, i) => {
          if (!i) return `M ${point.x} ${point.y}`
          const previous = points[i - 1]
          const middle = (previous.y + point.y) / 2
          return `C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`
        })
        .join(' ')
      setRoute(d)
      schedule()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(journey)
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
    }
  }, [])
  return (
    <div className="timeline mission-route" ref={journeyRef}>
      <svg className="journey-line" ref={svgRef} fill="none" aria-hidden="true">
        <path className="journey-track" d={route} />
        <path className="journey-progress" d={route} ref={pathRef} />
      </svg>
      <span className="journey-ship" ref={shipRef} aria-hidden="true">
        <Rocket size={21} />
      </span>
      {experience.map((item, index) => (
        <article className="mission-stop" key={item.company}>
          <span className="mission-node" aria-hidden="true">
            <span>{String(index + 1).padStart(2, '0')}</span>
          </span>
          <div className="mission-story reveal">
            <span className="mission-coordinate">
              LOG / {String(index + 1).padStart(2, '0')}{' '}
              <span>{item.period}</span>
            </span>
            <h3>{item.role}</h3>
            <p className="timeline-company">{item.company}</p>
            {item.highlight && (
              <span className="timeline-highlight">{item.highlight}</span>
            )}
            <p className="timeline-description">{item.description}</p>
          </div>
        </article>
      ))}
      <span className="journey-end">
        <span className="pulse-dot" /> A PRÓXIMA JORNADA ESTÁ POR VIR
      </span>
    </div>
  )
}

const categorySymbols = ['{}', 'db', '</>', '>_', '++1']
const categoryCode = [
  'await api.create(idea)',
  'connect(data, possibilities)',
  '<Experience idea={future} />',
  'prototype → test → build',
  'learn(); experiment(); repeat();',
]
const categoryProjects = [[0], [0], [1, 2, 3], [1, 3], [3]]

export function SkillGalaxy({ onProjectSelect }) {
  const [category, setCategory] = useState(0)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const group = skills[category]
  const insight = selectedSkill ? skillInsights[selectedSkill] : null
  const selectCategory = (index) => {
    setCategory(index)
    setSelectedSkill(null)
  }
  return (
    <div className="skill-universe reveal">
      <div className="galaxy-navigation" aria-label="Áreas de conhecimento">
        {skills.map((skill, index) => (
          <button
            type="button"
            className={category === index ? 'is-selected' : ''}
            key={skill.title}
            aria-pressed={category === index}
            onClick={() => selectCategory(index)}
          >
            <span aria-hidden="true">{categorySymbols[index]}</span>
            {skill.title}
            <small aria-hidden="true">0{index + 1}</small>
          </button>
        ))}
      </div>
      <div className="galaxy-stage">
        <div
          className="galaxy-map"
          aria-label={`Constelação de ${group.title}`}
        >
          <div className="galaxy-grid" aria-hidden="true" />
          <div className="galaxy-ring ring-a" aria-hidden="true">
            <i />
          </div>
          <div className="galaxy-ring ring-b" aria-hidden="true">
            <i />
          </div>
          <div className="galaxy-ring ring-c" aria-hidden="true" />
          <svg
            className="constellation-lines"
            viewBox="0 0 600 540"
            aria-hidden="true"
          >
            {group.items.map((item, i) => {
              const angle = (i / group.items.length) * Math.PI * 2 - Math.PI / 2
              return (
                <line
                  key={item}
                  x1="300"
                  y1="270"
                  x2={300 + Math.cos(angle) * 212}
                  y2={270 + Math.sin(angle) * 189}
                  className={selectedSkill === item ? 'is-active' : ''}
                />
              )
            })}
          </svg>
          <div className="galaxy-core" aria-hidden="true">
            <div className="core-sphere">
              <Code2 size={46} strokeWidth={1} />
            </div>
            <span>PAULO.DEV</span>
          </div>
          <div className="galaxy-nodes" key={category}>
            {group.items.map((item, i) => {
              const angle = (i / group.items.length) * Math.PI * 2 - Math.PI / 2
              return (
                <button
                  type="button"
                  key={item}
                  className={`tech-node ${selectedSkill === item ? 'is-selected' : ''}`}
                  style={{
                    '--node-x': `${50 + Math.cos(angle) * 35.3}%`,
                    '--node-y': `${50 + Math.sin(angle) * 35}%`,
                    '--float-delay': `${-i * 1.3}s`,
                  }}
                  aria-pressed={selectedSkill === item}
                  onClick={() =>
                    setSelectedSkill(selectedSkill === item ? null : item)
                  }
                >
                  <span className="tech-node-orb" aria-hidden="true">
                    {item === 'TypeScript'
                      ? 'TS'
                      : item === 'JavaScript'
                        ? 'JS'
                        : item === 'Node.js'
                          ? 'N'
                          : item === 'React'
                            ? '⚛'
                            : item.slice(0, 2)}
                  </span>
                  <span className="tech-node-label">{item}</span>
                </button>
              )
            })}
          </div>
          <span className="galaxy-map-label">
            <Orbit size={13} /> CLIQUE PARA EXPLORAR
          </span>
          <span className="galaxy-map-coordinate" aria-hidden="true">
            SYS.0{category + 1} / CONNECTED
          </span>
        </div>
        <div className="galaxy-insight" key={`${category}-${selectedSkill}`}>
          <span className="eyebrow">
            <span className="pulse-dot" /> CONSTELAÇÃO 0{category + 1}
          </span>
          <h3>
            {selectedSkill || group.title}
            <span>.</span>
          </h3>
          <p>{insight?.[0] || group.description}</p>
          <code className="galaxy-code">
            <span>❯</span> {insight?.[1] || categoryCode[category]}
            <i />
          </code>
          <div
            className="galaxy-tool-list"
            aria-label={`Ferramentas de ${group.title}`}
          >
            {group.items.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={selectedSkill === item}
                className={selectedSkill === item ? 'is-selected' : ''}
                onClick={() =>
                  setSelectedSkill(selectedSkill === item ? null : item)
                }
              >
                {item}
              </button>
            ))}
          </div>
          <div className="galaxy-connections">
            <span>ESSA ÁREA NA PRÁTICA</span>
            {categoryProjects[category].map((index) => (
              <button
                type="button"
                key={index}
                onClick={() => {
                  onProjectSelect(index)
                  document.getElementById('skill-projects').scrollIntoView({
                    behavior: window.matchMedia(
                      '(prefers-reduced-motion: reduce)',
                    ).matches
                      ? 'instant'
                      : 'smooth',
                    block: 'start',
                  })
                }}
              >
                {projects[index].title}
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="galaxy-footer">
        <span>
          <MoveUpRight size={13} /> DIFERENTES TECNOLOGIAS. SOLUÇÕES CONECTADAS.
        </span>
        <span>{group.items.length} FERRAMENTAS EM ÓRBITA</span>
      </div>
    </div>
  )
}
