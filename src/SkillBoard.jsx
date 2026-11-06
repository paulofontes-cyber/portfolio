import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects, skills } from './content'
import { skillInsights } from './skillInsights'

const REDUCED = '(prefers-reduced-motion: reduce)'

const categoryCode = [
  'await api.create(idea)',
  'connect(data, possibilities)',
  '<Experience idea={future} />',
  'prototype → test → build',
  'learn(); experiment(); repeat();',
]
const categoryProjects = [[0], [0], [1, 2, 3], [1, 3], [3]]
// Components sit slightly off-axis, like parts placed on a real board.
const shifts = [0, 22, 8, 30, 4, 18, 26]

const insightKeys = Object.keys(skillInsights)
const insightFor = (item) =>
  skillInsights[item] ||
  skillInsights[
    insightKeys.find((key) => key.toLowerCase() === item.toLowerCase())
  ]

// A tool is wired to a project only when the project content names it.
// Aliases cover tools described with other words in content.js.
const aliases = {
  'UX/UI': ['design de interface'],
  Prototipação: ['protótipo', 'prototipação'],
  'Design responsivo': ['responsiva'],
}
const projectText = projects.map((project) =>
  [
    project.summary,
    project.detail,
    ...project.developed,
    ...project.links.map((link) => link.label),
  ]
    .join(' ')
    .toLowerCase(),
)
const wiresFor = (tool) => {
  const name = tool.toLowerCase()
  return projects.reduce((linked, project, index) => {
    const exact = [...project.tags, ...project.developed].some(
      (entry) => entry.toLowerCase() === name,
    )
    const alias = (aliases[tool] || []).some((word) =>
      projectText[index].includes(word),
    )
    if (exact || alias) linked.push(index)
    return linked
  }, [])
}

// Offset of an element relative to the board, ignoring CSS transforms so
// entrance animations never skew the measured trace anchors.
const offsetWithin = (element, root) => {
  let x = 0
  let y = 0
  let node = element
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return {
    x: x + element.offsetWidth / 2,
    y: y + element.offsetHeight / 2,
  }
}

// PCB-style route: horizontal, 45° chamfer, vertical, 45° chamfer, horizontal.
const route = (a, b, lane) => {
  const dy = b.y - a.y
  if (Math.abs(dy) < 1) return `M${a.x} ${a.y}H${b.x}`
  const s = Math.sign(dy)
  const r = Math.min(10, Math.abs(dy) / 2)
  return `M${a.x} ${a.y}H${lane - r}L${lane} ${a.y + s * r}V${b.y - s * r}L${lane + r} ${b.y}H${b.x}`
}

export function SkillBoard({ onProjectSelect }) {
  const boardRef = useRef(null)
  const [category, setCategory] = useState(0)
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [hoveredPort, setHoveredPort] = useState(null)
  const [traces, setTraces] = useState({ size: [0, 0], feed: [], wires: [] })

  const group = skills[category]
  const tools = group.items
  const wires = tools.map(wiresFor)
  const active = hovered ?? selected
  const activeIndex = active ? tools.indexOf(active) : -1
  const insight = active ? insightFor(active) : null
  const code = insight?.[1] || categoryCode[category]
  const activePorts = activeIndex >= 0 ? wires[activeIndex] : []

  const measure = useCallback(() => {
    const board = boardRef.current
    if (!board || window.matchMedia('(max-width: 900px)').matches) {
      setTraces((current) =>
        current.feed.length ? { size: [0, 0], feed: [], wires: [] } : current,
      )
      return
    }
    const pin = board.querySelector('.pin.is-selected .pin-leg')
    const parts = [...board.querySelectorAll('.part')]
    const ports = [...board.querySelectorAll('.port-pad')]
    if (!pin || !parts.length) return
    const start = offsetWithin(pin, board)
    start.x += pin.offsetWidth / 2
    const inputs = parts.map((part) =>
      offsetWithin(part.querySelector('.part-pad.in'), board),
    )
    const outputs = parts.map((part) =>
      offsetWithin(part.querySelector('.part-pad.out'), board),
    )
    const targets = ports.map((port) => offsetWithin(port, board))

    // Feed traces: the farther a part sits from the pin, the earlier it turns,
    // so branches peel off a shared bus without crossing.
    const gap = Math.max(1, inputs[0].x - start.x)
    const maxDistance = Math.max(
      1,
      ...inputs.map((p) => Math.abs(p.y - start.y)),
    )
    const feed = inputs.map((point) => {
      const closeness = 1 - Math.abs(point.y - start.y) / maxDistance
      return route(start, point, start.x + gap * (0.22 + 0.56 * closeness))
    })

    const outGap = targets.length ? targets[0].x - outputs[0].x : 0
    const wiresOut = []
    tools.forEach((tool, index) => {
      wiresFor(tool).forEach((portIndex, order) => {
        const from = outputs[index]
        const to = targets[portIndex]
        const lane =
          from.x +
          outGap * (0.2 + ((index * 3 + order * 2 + portIndex) % 7) * 0.09)
        wiresOut.push({
          tool: index,
          port: portIndex,
          d: route(from, to, lane),
        })
      })
    })
    setTraces({
      size: [board.offsetWidth, board.offsetHeight],
      feed,
      wires: wiresOut,
    })
  }, [tools])

  useLayoutEffect(() => {
    measure()
  }, [measure, category])

  useEffect(() => {
    const board = boardRef.current
    const observer = new ResizeObserver(() => measure())
    observer.observe(board)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [measure])

  const selectCategory = (index) => {
    setCategory(index)
    setSelected(null)
    setHovered(null)
  }

  const openProject = (index) => {
    onProjectSelect(index)
    document.getElementById('skill-projects').scrollIntoView({
      behavior: window.matchMedia(REDUCED).matches ? 'instant' : 'smooth',
      block: 'start',
    })
  }

  const [width, height] = traces.size

  return (
    <div className="board reveal" ref={boardRef}>
      <span className="board-hole hole-tl" aria-hidden="true" />
      <span className="board-hole hole-bl" aria-hidden="true" />
      <span className="board-hole hole-br" aria-hidden="true" />
      <div className="board-silk board-silk-top" aria-hidden="true">
        <span>PF—STACK / REV.2026</span>
        <span>NENHUMA TECNOLOGIA VIVE SOZINHA</span>
      </div>

      {width > 0 && (
        <svg
          className="traces"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          aria-hidden="true"
        >
          <g key={`feed-${category}`}>
            {traces.feed.map((d, index) => (
              <path
                key={index}
                d={d}
                pathLength="1"
                className={`trace trace-feed ${index === activeIndex ? 'is-hot' : ''}`}
                style={{ '--i': index }}
              />
            ))}
          </g>
          <g key={`wires-${category}`}>
            {traces.wires.map((wire) => {
              const hot =
                wire.tool === activeIndex ||
                (activeIndex < 0 && hoveredPort === wire.port)
              return (
                <path
                  key={`${wire.tool}-${wire.port}`}
                  d={wire.d}
                  pathLength="1"
                  className={`trace trace-wire ${hot ? 'is-hot' : ''}`}
                  style={{ '--i': wire.tool }}
                />
              )
            })}
          </g>
          {traces.feed[activeIndex] && (
            <path
              key={`pulse-${category}-${activeIndex}`}
              d={traces.feed[activeIndex]}
              pathLength="1"
              className="trace-pulse"
            />
          )}
          {traces.wires
            .filter((wire) => wire.tool === activeIndex)
            .map((wire) => (
              <path
                key={`pulse-${category}-${wire.tool}-${wire.port}`}
                d={wire.d}
                pathLength="1"
                className="trace-pulse trace-pulse-late"
              />
            ))}
        </svg>
      )}

      <div className="board-layout">
        <div className="chip">
          <span className="chip-notch" aria-hidden="true" />
          <div className="chip-silk" aria-hidden="true">
            <b>PF-01</b>
            <span>STACK CONTROLLER</span>
          </div>
          <div
            className="chip-pins"
            role="group"
            aria-label="Áreas de conhecimento"
          >
            {skills.map((skill, index) => (
              <button
                type="button"
                key={skill.title}
                className={`pin ${category === index ? 'is-selected' : ''}`}
                aria-pressed={category === index}
                onClick={() => selectCategory(index)}
              >
                <span className="pin-index" aria-hidden="true">
                  P{index + 1}
                </span>
                <span className="pin-title">{skill.title}</span>
                <span className="pin-count" aria-hidden="true">
                  {String(skill.items.length).padStart(2, '0')}
                </span>
                <span className="pin-leg" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="chip-foot" aria-hidden="true">
            <span>PAULO.DEV</span>
            <span>ARACAJU · BR</span>
          </div>
          <span className="chip-legs" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>

        <div
          className="parts"
          role="group"
          aria-label={`Ferramentas de ${group.title}`}
          key={category}
        >
          <span className="board-col-label" aria-hidden="true">
            U2 — {group.title.toUpperCase()}
          </span>
          {tools.map((tool, index) => {
            const linked =
              hoveredPort !== null && wires[index].includes(hoveredPort)
            return (
              <button
                type="button"
                key={tool}
                className={`part ${selected === tool ? 'is-selected' : ''} ${active === tool ? 'is-active' : ''} ${linked ? 'is-linked' : ''}`}
                style={{
                  '--i': index,
                  '--shift': `${shifts[index % shifts.length]}px`,
                }}
                aria-pressed={selected === tool}
                onClick={() => setSelected(selected === tool ? null : tool)}
                onPointerEnter={(event) =>
                  event.pointerType === 'mouse' && setHovered(tool)
                }
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(tool)}
                onBlur={() => setHovered(null)}
              >
                <span className="part-pad in" aria-hidden="true" />
                <span className="part-ref" aria-hidden="true">
                  R{String(index + 1).padStart(2, '0')}
                </span>
                <span className="part-name">{tool}</span>
                <span className="part-ports" aria-hidden="true">
                  {wires[index].length
                    ? wires[index].map((port) => `J${port + 1}`).join(' ')
                    : '—'}
                </span>
                <span className="part-pad out" aria-hidden="true" />
              </button>
            )
          })}
        </div>

        <div className="ports" role="group" aria-label="Projetos conectados">
          <span className="board-col-label" aria-hidden="true">
            J1—J{projects.length} / SAÍDAS
          </span>
          {projects.map((project, index) => {
            const hot = activePorts.includes(index)
            const area = categoryProjects[category].includes(index)
            return (
              <button
                type="button"
                key={project.number}
                className={`port ${hot ? 'is-hot' : ''} ${area ? 'is-area' : ''}`}
                onClick={() => openProject(index)}
                onPointerEnter={() => setHoveredPort(index)}
                onPointerLeave={() => setHoveredPort(null)}
                onFocus={() => setHoveredPort(index)}
                onBlur={() => setHoveredPort(null)}
              >
                <span className="port-pad" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="port-ref" aria-hidden="true">
                  J{index + 1}
                </span>
                <span className="port-title">{project.title}</span>
                <span className="port-meta">{project.category}</span>
                <span className="port-led" aria-hidden="true" />
                <ArrowUpRight
                  className="port-arrow"
                  size={15}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="probe" aria-live="polite">
        <div className="probe-head" aria-hidden="true">
          <span>
            <i /> PROBE
          </span>
          <span>
            {active
              ? `U2.R${String(activeIndex + 1).padStart(2, '0')}`
              : `PF-01.P${category + 1}`}
          </span>
        </div>
        <div className="probe-body" key={`${category}-${active}`}>
          <strong className="probe-name">{active || group.title}</strong>
          <code style={{ '--chars': code.length }}>
            <span aria-hidden="true">$ </span>
            {code}
          </code>
          <p>{insight?.[0] || group.description}</p>
          <span className="probe-links">
            {active
              ? activePorts.length
                ? `Conectado a ${activePorts.map((port) => projects[port].title).join(' · ')}`
                : 'Repertório de estudo e experimentação'
              : `Na prática: ${categoryProjects[category].map((port) => projects[port].title).join(' · ')}`}
          </span>
        </div>
      </div>

      <div className="board-silk board-silk-bottom" aria-hidden="true">
        <span>
          SELECIONE UM PINO · PASSE PELOS COMPONENTES · CONECTORES ABREM O
          PROJETO
        </span>
        <span>{tools.length} COMPONENTES</span>
      </div>
    </div>
  )
}
