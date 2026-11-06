import { useEffect, useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { projects } from './content'
import { useMedia } from './Motion'

const files = {
  reports: 'reports.flow',
  jotanunes: 'jotanunes.fig',
  svo: 'svo.html',
  research: 'pesquisa.dash',
}

function ReportsVisual() {
  const stages = [
    ['Interface', 'React'],
    ['API', 'Node.js'],
    ['Fila', 'BullMQ · Redis'],
    ['Workers', '× 3'],
    ['Storage', 'MinIO'],
  ]
  return (
    <div className="visual-reports">
      <div className="flow">
        <span className="flow-packet">
          <i />
        </span>
        {stages.map(([name, tech], index) => (
          <div className="flow-stage" key={name} style={{ '--i': index }}>
            <span className="flow-index">0{index + 1}</span>
            <strong>{name}</strong>
            <small>{tech}</small>
            {index === 3 && (
              <span className="flow-workers">
                <i />
                <i />
                <i />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flow-log">
        <span>
          <b>POST</b> /reports <em>202 Accepted</em>
        </span>
        <span>
          <b>job</b> report:export <em>processing</em>
        </span>
        <span>
          <b>GET</b> /reports/:id/download <em>200 OK</em>
        </span>
      </div>
    </div>
  )
}

function ScreenVisual({ type }) {
  return (
    <div className="visual-screen">
      <div className="screen-bar">
        <span />
        <span />
        <span />
        <i>
          {type === 'jotanunes' ? 'jotanunes / carreiras' : 'fsph / portal svo'}
        </i>
      </div>
      <div className="screen-image">
        <img
          src={`./${type}-preview.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
    </div>
  )
}

function ResearchVisual() {
  return (
    <div className="visual-research">
      <div className="research-tabs">
        <span className="is-on">Aluno</span>
        <span>Professor</span>
        <span>Coordenação</span>
      </div>
      <div className="research-body">
        <div className="research-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" />
            <circle cx="60" cy="60" r="48" className="ring-value" />
          </svg>
          <span>
            <b>72</b>% autoavaliação
          </span>
        </div>
        <div className="research-bars">
          {[64, 82, 45, 90, 58, 74].map((value, index) => (
            <span key={index} style={{ '--v': `${value}%`, '--i': index }}>
              <i />
            </span>
          ))}
        </div>
        <div className="research-rows">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

export function ProjectVisual({ type }) {
  return (
    <div className={`project-visual visual-${type}-wrap`} aria-hidden="true">
      {type === 'reports' && <ReportsVisual />}
      {(type === 'jotanunes' || type === 'svo') && <ScreenVisual type={type} />}
      {type === 'research' && <ResearchVisual />}
    </div>
  )
}

function Viewer({ project }) {
  return (
    <div className="work-viewer" data-tilt="4">
      <div className="viewer-frame">
        <div className="viewer-top">
          <span>
            <i className="status-dot" /> PREVIEW / {project.number}
          </span>
          <span>{files[project.visual]}</span>
        </div>
        <div className="viewer-stage" key={project.number}>
          <ProjectVisual type={project.visual} />
          <span className="viewer-wipe" aria-hidden="true" />
        </div>
        <div className="viewer-bottom">
          <span>{project.category}</span>
          <a
            href={project.links[0].url}
            target="_blank"
            rel="noreferrer"
            data-magnetic
          >
            Abrir <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <span className="viewer-glare" aria-hidden="true" />
      </div>
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />
    </div>
  )
}

export function WorkIndex() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(0)
  const wide = useMedia('(min-width: 961px)')

  // Deep links such as #projeto-03 (used by the stack section) open that entry.
  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(/^#projeto-(\d{2})$/)
      if (!match) return
      const index = projects.findIndex((p) => p.number === match[1])
      if (index >= 0) {
        setActive(index)
        setOpen(index)
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return (
    <div className="work">
      <ol className="work-list">
        {projects.map((project, index) => {
          const isOpen = open === index
          return (
            <li
              className={`work-item ${active === index ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}
              id={`projeto-${project.number}`}
              key={project.number}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <h3>
                <button
                  type="button"
                  className="work-row"
                  aria-expanded={isOpen}
                  aria-controls={`project-notes-${project.number}`}
                  onClick={() => {
                    setActive(index)
                    setOpen(isOpen ? -1 : index)
                  }}
                >
                  <span className="work-number">{project.number}</span>
                  <span className="work-title">{project.title}</span>
                  <span className="work-category">{project.category}</span>
                  <span className="work-toggle" aria-hidden="true">
                    <Plus size={18} />
                  </span>
                </button>
              </h3>
              <div
                className="work-notes"
                id={`project-notes-${project.number}`}
                inert={!isOpen}
              >
                <div className="work-notes-inner">
                  {!wide && (
                    <div className="work-inline-visual">
                      <ProjectVisual type={project.visual} />
                    </div>
                  )}
                  <p className="work-summary">{project.summary}</p>
                  <p className="work-detail">{project.detail}</p>
                  <ul className="tag-list" aria-label="Tecnologias">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="work-links">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {wide && (
        <div className="work-aside">
          <Viewer project={projects[active]} />
        </div>
      )}
    </div>
  )
}
