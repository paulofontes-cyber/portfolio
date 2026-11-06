import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { links, projects } from './content'
import {
  CodeMarquee,
  ExperienceJourney,
  LiveClock,
  MotionEffects,
  ScrambleText,
} from './Motion'
import { SkillBoard } from './SkillBoard'
import Badge from './Badge'
import { WorkIndex } from './Projects'

const navigation = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Ferramentas', href: '#stack' },
]

const email = links.email.replace('mailto:', '')

function SectionHeading({ index, label, title, description, children }) {
  return (
    <header className="section-head">
      <div className="section-tag reveal">
        <span className="section-index">§{index}</span>
        <span className="section-label">{label}</span>
      </div>
      <h2 className="reveal">{title}</h2>
      {description && (
        <p className="section-description reveal">{description}</p>
      )}
      {children}
    </header>
  )
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 34 34" fill="none" focusable="false">
        <path d="m4 10 6 7-6 7" />
        <path d="M14 24V10h5a4 4 0 0 1 0 8h-5" className="brand-initial" />
        <path d="M24 24h6" className="brand-cursor" />
      </svg>
    </span>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(id)
  }, [copied])
  if (!navigator.clipboard) return null
  return (
    <button
      type="button"
      className="copy-email"
      onClick={() =>
        navigator.clipboard.writeText(email).then(
          () => setCopied(true),
          () => setCopied(false),
        )
      }
    >
      {copied ? (
        <Check size={15} aria-hidden="true" />
      ) : (
        <Copy size={15} aria-hidden="true" />
      )}
      <span aria-live="polite">
        {copied ? 'E-mail copiado' : 'Copiar e-mail'}
      </span>
    </button>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [hasScrolled, setHasScrolled] = useState(false)
  const [selectedProject, setSelectedProject] = useState(0)
  const featuredProject = projects[selectedProject]

  useEffect(() => {
    const preventAction = (event) => event.preventDefault()
    const blockInspectorShortcut = (event) => {
      const key = event.key.toLowerCase()
      const inspectorShortcut =
        (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key)) ||
        (event.ctrlKey && key === 'u')

      if (key === 'f12' || inspectorShortcut) event.preventDefault()
    }

    document.addEventListener('copy', preventAction)
    document.addEventListener('contextmenu', preventAction)
    document.addEventListener('keydown', blockInspectorShortcut)

    return () => {
      document.removeEventListener('copy', preventAction)
      document.removeEventListener('contextmenu', preventAction)
      document.removeEventListener('keydown', blockInspectorShortcut)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    const observeAll = () =>
      document
        .querySelectorAll('.reveal:not(.is-visible)')
        .forEach((element) => observer.observe(element))
    observeAll()
    // Sections that re-render (stack tabs, project notes) can add new nodes.
    const mutations = new MutationObserver(observeAll)
    mutations.observe(document.getElementById('conteudo'), {
      childList: true,
      subtree: true,
    })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    if (!menuOpen) return () => document.body.classList.remove('menu-open')
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const sectionIds = [
      'inicio',
      'sobre',
      'projetos',
      'experiencia',
      'stack',
      'contato',
    ]
    const sections = sectionIds.map((id) => document.getElementById(id))
    const hero = document.querySelector('.hero')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      const viewportHeight = window.innerHeight
      const scrollMax = Math.max(
        1,
        document.documentElement.scrollHeight - viewportHeight,
      )
      document.documentElement.style.setProperty(
        '--scroll-progress',
        `${Math.min(1, window.scrollY / scrollMax)}`,
      )
      setHasScrolled((current) => {
        const next = window.scrollY > 24
        return current === next ? current : next
      })

      let currentSection = 'inicio'
      sections.forEach((section) => {
        if (
          section &&
          section.getBoundingClientRect().top <= viewportHeight * 0.38
        )
          currentSection = section.id
      })
      setActiveSection((current) =>
        current === currentSection ? current : currentSection,
      )

      const heroProgress = reduced.matches
        ? 0
        : Math.max(
            0,
            Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight)),
          )
      hero.style.setProperty('--hero-progress', heroProgress.toFixed(3))
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <MotionEffects />
      <div className="page-grain" aria-hidden="true" />
      <div className="page-columns" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header
        className={`site-header ${hasScrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-menu-open' : ''}`}
      >
        <a
          className="brand"
          href="#inicio"
          aria-label="Paulo Fontes, voltar ao início"
        >
          <BrandMark />
          <span className="brand-text">
            PAULO FONTES
            <span className="brand-subtitle">SOFTWARE ENGINEER</span>
          </span>
        </a>
        <nav
          className={menuOpen ? 'nav is-open' : 'nav'}
          aria-label="Navegação principal"
        >
          {navigation.map((item, index) => {
            const active = activeSection === item.href.slice(1)
            return (
              <a
                key={item.href}
                href={item.href}
                className={active ? 'is-active' : undefined}
                aria-current={active ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <ScrambleText text={item.label} />
              </a>
            )
          })}
          <a
            className={
              activeSection === 'contato'
                ? 'nav-contact is-active'
                : 'nav-contact'
            }
            href="#contato"
            aria-current={activeSection === 'contato' ? 'location' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-index" aria-hidden="true">
              05
            </span>
            Vamos conversar <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <span className="nav-footer" aria-hidden="true">
            ARACAJU, BR · <LiveClock seconds={false} />
          </span>
        </nav>
        <div className="header-meta" aria-hidden="true">
          <span className="status-dot" /> ARACAJU <LiveClock seconds={false} />
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="scroll-progress" aria-hidden="true" />
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-meta">
                <span>§00 — PORTFÓLIO / 2026</span>
                <span className="hero-meta-tags">
                  <i className="status-dot" /> DESENVOLVIMENTO · PESQUISA ·
                  INOVAÇÃO
                </span>
              </div>
              <p className="hero-kicker">Olá, eu sou Paulo Fontes</p>
              <h1 aria-label="Construindo soluções que vão mais longe.">
                <span className="line" aria-hidden="true">
                  <span>Construindo</span>
                </span>
                <span className="line" aria-hidden="true">
                  <span>
                    <em>soluções</em> que
                  </span>
                </span>
                <span className="line" aria-hidden="true">
                  <span>
                    vão mais longe<b className="h1-cursor">.</b>
                  </span>
                </span>
              </h1>
              <p className="hero-description">
                Desenvolvedor de software com foco em back-end e full stack.
                Transformo problemas complexos em experiências digitais claras,
                escaláveis e bem pensadas.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href="#projetos"
                  data-magnetic
                >
                  <span>Explorar projetos</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a className="button button-ghost" href="#sobre">
                  Conheça minha trajetória{' '}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="hero-badge">
              <Badge />
              <p className="badge-hint" aria-hidden="true">
                <span className="hint-fine">ARRASTE · CLIQUE PARA VIRAR</span>
                <span className="hint-touch">
                  ARRASTE PARA OS LADOS · TOQUE PARA VIRAR
                </span>
              </p>
            </div>
          </div>
          <div className="hero-readout">
            <div>
              <span>FOCO</span>
              <b>Back-end · Full stack · IA</b>
            </div>
            <div>
              <span>BASE</span>
              <b>10°55′S 37°04′W — Aracaju, BR</b>
            </div>
            <div className="readout-clock">
              <span>HORA LOCAL</span>
              <b>
                <LiveClock /> <small>UTC−3</small>
              </b>
            </div>
            <div className="readout-pointer" aria-hidden="true">
              <span>CURSOR</span>
              <b data-pointer-readout>X 0000 · Y 0000</b>
            </div>
            <div className="readout-social">
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github size={17} />
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
              <a href={links.email} aria-label="Enviar e-mail">
                <Mail size={17} />
              </a>
            </div>
          </div>
          <a
            className="scroll-cue"
            href="#sobre"
            aria-label="Rolar para a seção Sobre"
          >
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </section>

        <CodeMarquee />

        <section className="about section-shell" id="sobre">
          <div className="section-container">
            <SectionHeading
              index="01"
              label="Sobre mim"
              title={
                <>
                  Curiosidade para explorar. <em>Técnica para construir.</em>
                </>
              }
            />
            <div className="about-grid">
              <figure className="about-figure reveal" data-tilt="3">
                <div className="about-photo">
                  <img
                    src="./paulo-fontes.png"
                    alt="Retrato de Paulo Fontes"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <img
                    className="about-photo-color"
                    src="./paulo-fontes.png"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </div>
                <figcaption>
                  <span>FIG.02</span>
                  <span>Paulo Fontes — Aracaju, BR</span>
                </figcaption>
                <span className="crop crop-tl" aria-hidden="true" />
                <span className="crop crop-tr" aria-hidden="true" />
                <span className="crop crop-bl" aria-hidden="true" />
                <span className="crop crop-br" aria-hidden="true" />
              </figure>
              <div className="about-content">
                <p className="about-lead reveal">
                  Sou estudante de Análise e Desenvolvimento de Sistemas na
                  Universidade Tiradentes e bolsista de iniciação científica
                  pelo CNPq, com pesquisa focada em inteligência artificial.
                </p>
                <p className="about-secondary reveal">
                  Meu trabalho cruza desenvolvimento de software, dados e
                  produto. Gosto de desenhar soluções completas: da arquitetura
                  de uma API ao cuidado com a experiência de quem usa a
                  interface.
                </p>
                <dl className="spec-table reveal">
                  <div>
                    <dt>
                      <span>A</span> Back-end
                    </dt>
                    <dd>APIs & processamento assíncrono</dd>
                  </div>
                  <div>
                    <dt>
                      <span>B</span> Full stack
                    </dt>
                    <dd>Do banco de dados à interface</dd>
                  </div>
                  <div>
                    <dt>
                      <span>C</span> Pesquisa
                    </dt>
                    <dd>IA aplicada ao desenvolvimento</dd>
                  </div>
                </dl>
                <a
                  className="text-link reveal"
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  Mais sobre minha trajetória{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="projects section-shell" id="projetos">
          <div className="section-container">
            <SectionHeading
              index="02"
              label="Projetos selecionados"
              title={
                <>
                  Trabalho que sai <em>do papel.</em>
                </>
              }
              description="Cada projeto, um problema diferente. Abra cada entrada para ver o contexto, as decisões e a stack por trás da entrega."
            >
              <a
                href={links.github}
                className="text-link section-head-link reveal"
                target="_blank"
                rel="noreferrer"
              >
                Explorar GitHub <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </SectionHeading>
            <div className="work-topline reveal" aria-hidden="true">
              <span>ÍNDICE</span>
              <span>TÍTULO</span>
              <span>ÁREA</span>
              <span>0{projects.length} ENTRADAS</span>
            </div>
            <WorkIndex />
          </div>
        </section>

        <section className="experience section-shell" id="experiencia">
          <div className="section-container experience-grid">
            <div className="experience-aside">
              <SectionHeading
                index="03"
                label="Experiência"
                title={
                  <>
                    Uma trajetória em <em>construção constante.</em>
                  </>
                }
                description="Tecnologia, pesquisa e colaboração em equipes diversas moldaram minha forma de resolver problemas."
              />
              <span className="aside-hint" aria-hidden="true">
                <ArrowDown size={13} /> git log --reverse
              </span>
            </div>
            <ExperienceJourney />
          </div>
        </section>

        <section className="skills section-shell" id="stack">
          <div className="section-container">
            <SectionHeading
              index="04"
              label="Ferramentas & tecnologias"
              title={
                <>
                  Meu universo <em>de possibilidades.</em>
                </>
              }
              description="Nenhuma tecnologia vive sozinha. Escolha uma área no controlador, passe pelos componentes e siga as trilhas até os projetos onde cada ferramenta foi usada."
            />
            <SkillBoard onProjectSelect={setSelectedProject} />

            <div className="practice reveal" id="skill-projects">
              <div className="practice-topline">
                <span>NA PRÁTICA / CONEXÕES REAIS</span>
                <span>
                  {featuredProject.number} — 0{projects.length}
                </span>
              </div>
              <div
                className="practice-picker"
                aria-label="Explorar competências por projeto"
              >
                {projects.map((project, index) => (
                  <button
                    className={
                      selectedProject === index ? 'is-selected' : undefined
                    }
                    type="button"
                    key={project.number}
                    aria-pressed={selectedProject === index}
                    onClick={() => setSelectedProject(index)}
                  >
                    <span>{project.number}</span>
                    {project.title}
                  </button>
                ))}
              </div>
              <div className="practice-detail" key={featuredProject.number}>
                <div className="practice-story">
                  <span className="practice-label">
                    PROJETO {featuredProject.number} /{' '}
                    {featuredProject.category}
                  </span>
                  <h3>{featuredProject.title}</h3>
                  <p>{featuredProject.capability}</p>
                  <a
                    className="text-link"
                    href={`#projeto-${featuredProject.number}`}
                  >
                    Ver no índice de projetos{' '}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
                <div className="practice-proof">
                  <div>
                    <h4>Habilidades desenvolvidas</h4>
                    <ul className="developed-list">
                      {featuredProject.developed.map((item, index) => (
                        <li key={item}>
                          <span>0{index + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Stack utilizada</h4>
                    <ul className="tag-list">
                      {featuredProject.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="education reveal">
              <span className="education-label">FORMAÇÃO & PESQUISA</span>
              <ul>
                <li>
                  <b>Análise e Desenvolvimento de Sistemas</b>
                  <span>Universidade Tiradentes</span>
                </li>
                <li>
                  <b>Iniciação Científica CNPq</b>
                  <span>Inteligência Artificial</span>
                </li>
                <li>
                  <b>Idiomas</b>
                  <span>
                    Português nativo · Inglês avançado · Espanhol básico
                  </span>
                </li>
              </ul>
              <span className="education-status">
                <i className="status-dot" /> EM ANDAMENTO
              </span>
            </div>
          </div>
        </section>

        <section className="contact section-shell" id="contato">
          <div className="section-container contact-inner">
            <div className="section-tag reveal">
              <span className="section-index">§05</span>
              <span className="section-label">Próxima missão</span>
            </div>
            <h2 className="contact-title reveal">
              Vamos criar algo <em>extraordinário?</em>
            </h2>
            <div className="contact-grid">
              <p className="reveal">
                Tem uma ideia, um desafio técnico ou uma oportunidade em mente?
                Vamos conversar.
              </p>
              <div className="contact-actions reveal">
                <a className="contact-email" href={links.email} data-magnetic>
                  <span className="contact-email-label">
                    Enviar uma mensagem
                  </span>
                  <span className="contact-email-address">{email}</span>
                  <ArrowUpRight size={28} aria-hidden="true" />
                </a>
                <CopyEmail />
              </div>
            </div>
            <ul className="contact-channels reveal">
              <li>
                <a href={links.github} target="_blank" rel="noreferrer">
                  <span>01</span> GitHub
                  <small>{links.github.replace('https://', '')}</small>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={links.linkedin} target="_blank" rel="noreferrer">
                  <span>02</span> LinkedIn
                  <small>
                    {links.linkedin
                      .replace('https://www.', '')
                      .replace(/\/$/, '')}
                  </small>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={links.email}>
                  <span>03</span> E-mail
                  <small>{email}</small>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-container footer-inner">
          <a className="footer-brand" href="#inicio">
            <BrandMark /> PAULO FONTES
          </a>
          <span>
            © {new Date().getFullYear()} · DESENVOLVIMENTO DE SOFTWARE ·
            ARACAJU, BR
          </span>
          <a className="footer-top" href="#inicio">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </>
  )
}

export default App
