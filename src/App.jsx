import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { experience, links, projects, skills } from './content'

const navigation = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Stack', href: '#stack' },
]

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading reveal">
      <span className="eyebrow">
        <span className="eyebrow-line" />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function ProjectVisual({ type }) {
  if (type === 'jotanunes' || type === 'svo') {
    return (
      <div
        className={`project-visual showcase-visual ${type}-visual`}
        aria-hidden="true"
      >
        <img
          src={`./${type}-preview.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="showcase-shade" />
        <div className="showcase-caption">
          <span>
            {type === 'jotanunes'
              ? 'JOTANUNES / CARREIRAS'
              : 'FSPH / PORTAL SVO'}
          </span>
          <span>INTERFACE ↗</span>
        </div>
      </div>
    )
  }

  if (type === 'reports') {
    return (
      <div className="project-visual reports-visual" aria-hidden="true">
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <div className="visual-window">
          <div className="window-top">
            <span />
            <span />
            <span />
            <i>reports / overview</i>
          </div>
          <div className="window-content">
            <div className="window-sidebar">
              <b />
              <b />
              <b />
              <b />
            </div>
            <div className="window-data">
              <div className="chart-heading">
                <em />
                <small />
              </div>
              <div className="chart-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="chart-footer">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
        <div className="visual-badge">
          <span className="pulse-dot" /> JOB COMPLETED
        </div>
      </div>
    )
  }

  return (
    <div className="project-visual research-visual" aria-hidden="true">
      <div className="research-grid" />
      <div className="research-card back-card">
        <div className="research-card-head" />
        <i />
        <i />
        <i />
      </div>
      <div className="research-card front-card">
        <div className="research-card-head">
          <span />
          <span />
        </div>
        <div className="research-donut">
          <span />
        </div>
        <div className="research-lines">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="research-cross cross-one">+</div>
      <div className="research-cross cross-two">+</div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="project-card reveal">
      <ProjectVisual type={project.visual} />
      <div className="project-body">
        <div className="project-meta">
          <span>{project.number} / SELECTED WORK</span>
          <span>{project.category}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <p className="project-detail">{project.detail}</p>
        <div className="tag-list">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="project-links">
          {project.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

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
      { threshold: 0.12 },
    )

    document
      .querySelectorAll('.reveal')
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#inicio"
          aria-label="Paulo Fontes, voltar ao início"
        >
          <span className="brand-mark">
            P<span>.</span>
          </span>
          <span>
            PAULO FONTES
            <span className="brand-subtitle">/ SOFTWARE DEVELOPER</span>
          </span>
        </a>
        <nav
          className={menuOpen ? 'nav is-open' : 'nav'}
          aria-label="Navegação principal"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contato"
            onClick={() => setMenuOpen(false)}
          >
            Vamos conversar <ArrowUpRight size={15} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-stars" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-container">
            <div className="hero-copy">
              <div className="availability">
                <span className="pulse-dot" /> DESENVOLVIMENTO · PESQUISA ·
                INOVAÇÃO <span className="availability-arrow">↗</span>
              </div>
              <p className="hero-kicker">
                OLÁ, EU SOU PAULO FONTES <span>✦</span>
              </p>
              <h1>
                Construindo <em>soluções</em> que vão mais longe.
              </h1>
              <p className="hero-description">
                Desenvolvedor de software com foco em back-end e full stack.
                Transformo problemas complexos em experiências digitais claras,
                escaláveis e bem pensadas.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projetos">
                  Explorar projetos <ArrowUpRight size={18} />
                </a>
                <a className="button button-text" href="#sobre">
                  Conheça minha trajetória <ArrowRight size={18} />
                </a>
              </div>
              <div className="hero-social">
                <span>CONECTE-SE</span>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github size={19} />
                </a>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={19} />
                </a>
                <a href={links.email} aria-label="Enviar e-mail">
                  <Mail size={19} />
                </a>
              </div>
            </div>
            <div
              className="hero-art"
              role="img"
              aria-label="Ilustração abstrata de um planeta com órbitas"
            >
              <div className="orbit orbit-outer">
                <span className="orbit-satellite" />
              </div>
              <div className="orbit orbit-mid" />
              <div className="orbit orbit-inner" />
              <div className="planet-halo" />
              <div className="planet">
                <div className="planet-shine" />
                <div className="planet-texture" />
              </div>
              <div className="art-spark art-spark-one">✦</div>
              <div className="art-spark art-spark-two">✧</div>
              <div className="art-coordinates">
                10°55′S &nbsp; 37°04′W <span>— ARACAJU, BR</span>
              </div>
              <div className="art-label">
                <span>01 / 03</span>
                <i /> EXPLORANDO NOVAS POSSIBILIDADES
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#sobre">
            <ArrowDown size={15} /> SCROLL TO EXPLORE
          </a>
          <span className="hero-side-label">PORTFOLIO / 2026</span>
        </section>

        <section className="about section-shell" id="sobre">
          <div className="section-container about-grid">
            <div className="about-photo-wrap reveal">
              <img
                src="./paulo-fontes.webp"
                alt="Retrato de Paulo Fontes"
                className="about-photo"
                loading="lazy"
                decoding="async"
              />
              <div className="photo-corner photo-corner-top" />
              <div className="photo-corner photo-corner-bottom" />
              <span className="photo-label">BEYOND THE CODE ↗</span>
            </div>
            <div className="about-content">
              <SectionHeading
                eyebrow="01 / SOBRE MIM"
                title={
                  <>
                    Curiosidade para explorar. <em>Técnica para construir.</em>
                  </>
                }
              />
              <p className="about-lead reveal">
                Sou estudante de Análise e Desenvolvimento de Sistemas na
                Universidade Tiradentes e bolsista de iniciação científica pelo
                CNPq, com pesquisa focada em inteligência artificial.
              </p>
              <p className="about-secondary reveal">
                Meu trabalho cruza desenvolvimento de software, dados e produto.
                Gosto de desenhar soluções completas: da arquitetura de uma API
                ao cuidado com a experiência de quem usa a interface.
              </p>
              <div className="about-facts reveal">
                <div>
                  <strong>BACK-END</strong>
                  <span>APIs & processamento assíncrono</span>
                </div>
                <div>
                  <strong>FULL STACK</strong>
                  <span>Do banco de dados à interface</span>
                </div>
                <div>
                  <strong>PESQUISA</strong>
                  <span>IA aplicada ao desenvolvimento</span>
                </div>
              </div>
              <a
                className="inline-link reveal"
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                Mais sobre minha trajetória <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="projects section-shell" id="projetos">
          <div className="section-container">
            <div className="projects-intro">
              <SectionHeading
                eyebrow="02 / PROJETOS SELECIONADOS"
                title={
                  <>
                    Trabalho que sai <em>do papel.</em>
                  </>
                }
                description="Uma seleção enxuta de projetos que mostram como penso, construo e resolvo problemas reais."
              />
              <a
                href={links.github}
                className="all-projects reveal"
                target="_blank"
                rel="noreferrer"
              >
                Explorar GitHub <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard key={project.number} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section className="experience section-shell" id="experiencia">
          <div className="section-container experience-grid">
            <div className="experience-aside">
              <SectionHeading
                eyebrow="03 / EXPERIÊNCIA"
                title={
                  <>
                    Uma trajetória em <em>construção constante.</em>
                  </>
                }
              />
              <p className="reveal">
                Tecnologia, pesquisa e colaboração em equipes diversas moldaram
                minha forma de resolver problemas.
              </p>
              <div className="experience-decoration" aria-hidden="true">
                <span>✦</span>
                <i />
                <i />
              </div>
            </div>
            <div className="timeline">
              {experience.map((item, index) => (
                <article className="timeline-item reveal" key={item.company}>
                  <div className="timeline-top">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="timeline-period">{item.period}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.company}</p>
                  {item.highlight && (
                    <span className="timeline-highlight">
                      ✦ {item.highlight}
                    </span>
                  )}
                  <p className="timeline-description">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="skills section-shell" id="stack">
          <div className="section-container">
            <SectionHeading
              eyebrow="04 / FERRAMENTAS & TECNOLOGIAS"
              title={
                <>
                  Ferramentas a serviço <em>das ideias.</em>
                </>
              }
              description="Tecnologias que uso para tirar projetos do conceito e levá-los até uma solução funcional."
            />
            <div className="skills-grid">
              {skills.map((group, index) => (
                <article className="skill-card reveal" key={group.title}>
                  <div className="skill-card-header">
                    <span>0{index + 1}</span>
                    <span>✳</span>
                  </div>
                  <h3>{group.title}</h3>
                  <div className="skill-items">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="education-strip reveal">
              <div>
                <span className="education-icon">✦</span>
                <div>
                  <strong>FORMAÇÃO & PESQUISA</strong>
                  <p>
                    Análise e Desenvolvimento de Sistemas · Universidade
                    Tiradentes
                    <br />
                    Iniciação Científica CNPq em Inteligência Artificial
                    <br />
                    Português nativo · Inglês avançado · Espanhol básico
                  </p>
                </div>
              </div>
              <span className="education-status">
                EM ANDAMENTO <span className="pulse-dot" />
              </span>
            </div>
          </div>
        </section>

        <section className="contact section-shell" id="contato">
          <div className="contact-stars" aria-hidden="true" />
          <div className="section-container contact-inner">
            <span className="eyebrow reveal">
              <span className="eyebrow-line" />
              05 / PRÓXIMA MISSÃO
            </span>
            <h2 className="reveal">
              Vamos criar algo <em>extraordinário?</em>
            </h2>
            <p className="reveal">
              Tem uma ideia, um desafio técnico ou uma oportunidade em mente?
              Vamos conversar.
            </p>
            <a className="contact-button reveal" href={links.email}>
              Enviar uma mensagem <ArrowUpRight size={23} />
            </a>
            <a className="contact-email reveal" href={links.email}>
              prof.paulo.e@gmail.com
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-container footer-inner">
          <a className="footer-brand" href="#inicio">
            PAULO FONTES<span>✦</span>
          </a>
          <span>
            © {new Date().getFullYear()} · Feito com intenção, de Aracaju para o
            universo.
          </span>
          <div>
            <a href={links.github} target="_blank" rel="noreferrer">
              GITHUB <ArrowUpRight size={13} />
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LINKEDIN <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
