import { useEffect, useRef, useState } from 'react'
import { links } from './content'
import { LiveClock } from './Motion'

const BARCODE = (() => {
  // Deterministic bars derived from the name, so the code is "about" its owner.
  const bars = []
  'PAULOFONTES2026'.split('').forEach((char, index) => {
    const code = char.charCodeAt(0) + index * 7
    for (let bit = 0; bit < 4; bit++)
      bars.push({
        width: 1 + ((code >> bit) & 1) * 2,
        gap: 1 + ((code >> (bit + 2)) & 1),
      })
  })
  return bars
})()

const MATRIX = Array.from({ length: 13 * 13 }, (_, index) => {
  const x = index % 13
  const y = Math.floor(index / 13)
  const finder = (cx, cy) => {
    if (x < cx || x > cx + 4 || y < cy || y > cy + 4) return null
    const ring = Math.max(Math.abs(x - cx - 2), Math.abs(y - cy - 2))
    return ring !== 1
  }
  const corner = finder(0, 0) ?? finder(8, 0) ?? finder(0, 8)
  if (corner !== null) return corner
  if (x === 5 || y === 5 || x === 7 || y === 7) return (x + y) % 2 === 0
  return ((x * 31 + y * 17 + x * y * 7) % 11) % 3 === 0
})

function Barcode() {
  let x = 0
  const rects = BARCODE.map((bar, index) => {
    const rect = <rect key={index} x={x} y="0" width={bar.width} height="28" />
    x += bar.width + bar.gap
    return rect
  })
  return (
    <svg
      className="badge-barcode"
      viewBox={`0 0 ${x} 28`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {rects}
    </svg>
  )
}

const STIFFNESS = 30
const DAMPING = 3.4
const DRAG_STIFFNESS = 260
const DRAG_DAMPING = 26

export default function Badge() {
  const rigRef = useRef(null)
  const swingRef = useRef(null)
  const cardRef = useRef(null)
  const flipRef = useRef(false)
  const kickRef = useRef(() => {})
  const toggleRef = useRef(() => {})
  const [flipped, setFlipped] = useState(false)

  const toggleFlip = () => {
    flipRef.current = !flipRef.current
    setFlipped(flipRef.current)
    kickRef.current()
  }
  toggleRef.current = toggleFlip

  useEffect(() => {
    const rig = rigRef.current
    const swing = swingRef.current
    const card = cardRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')

    // Pendulum state. Angles in radians unless noted.
    const s = {
      angle: 0.32,
      velocity: 0,
      drop: -1,
      dropVelocity: 0,
      stretch: 0,
      stretchVelocity: 0,
      tiltX: 0,
      tiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      flip: 0,
      flipVelocity: 0,
      glareX: 50,
      glareY: 30,
      drag: null,
    }
    let frame = 0
    let last = 0
    let lastScroll = window.scrollY
    let visible = true

    const render = () => {
      const angleDeg = (s.angle * 180) / Math.PI
      swing.style.transform = `translate3d(0, ${s.drop * 110}%, 0) rotate(${angleDeg}deg)`
      swing.style.setProperty('--stretch', `${s.stretch}px`)
      card.style.transform = `translateY(${s.stretch}px) rotateX(${s.tiltX}deg) rotateY(${s.tiltY + s.flip}deg)`
      card.style.setProperty('--glare-x', `${s.glareX}%`)
      card.style.setProperty('--glare-y', `${s.glareY}%`)
      card.style.setProperty(
        '--foil',
        `${(s.tiltY * 3 + s.tiltX * 2 + 180) % 360}deg`,
      )
      card.style.setProperty('--shade', `${Math.abs(s.tiltY) / 40}`)
      swing.style.setProperty(
        '--shadow-x',
        `${-s.tiltY * 1.6 - angleDeg * 2}px`,
      )
      swing.style.setProperty('--shadow-y', `${28 + s.tiltX * 1.2}px`)
    }

    const renderStatic = () => {
      Object.assign(s, {
        angle: 0,
        velocity: 0,
        drop: 0,
        stretch: 0,
        tiltX: 0,
        tiltY: 0,
      })
      s.flip = flipRef.current ? 180 : 0
      render()
    }

    const step = (time) => {
      frame = 0
      const dt = Math.min(0.032, (time - last) / 1000 || 0.016)
      last = time

      if (s.drag) {
        const target = s.drag.targetAngle
        s.velocity +=
          (DRAG_STIFFNESS * (target - s.angle) - DRAG_DAMPING * s.velocity) * dt
        s.stretchVelocity +=
          (300 * (s.drag.targetStretch - s.stretch) - 28 * s.stretchVelocity) *
          dt
      } else {
        s.velocity +=
          (-STIFFNESS * Math.sin(s.angle) - DAMPING * s.velocity) * dt
        s.stretchVelocity += (-320 * s.stretch - 14 * s.stretchVelocity) * dt
      }
      s.angle += s.velocity * dt
      s.stretch += s.stretchVelocity * dt

      s.dropVelocity += (-120 * s.drop - 16 * s.dropVelocity) * dt
      s.drop += s.dropVelocity * dt

      const flipTarget = flipRef.current ? 180 : 0
      s.flipVelocity += (90 * (flipTarget - s.flip) - 11 * s.flipVelocity) * dt
      s.flip += s.flipVelocity * dt

      // Swinging couples into a slight yaw, like a real card on a strap.
      const swingYaw = s.velocity * -9
      const ease = 1 - Math.exp(-dt * 9)
      s.tiltX += (s.targetTiltX - s.tiltX) * ease
      s.tiltY += (s.targetTiltY + swingYaw - s.tiltY) * ease
      s.glareX += (50 + s.tiltY * 2.4 - s.glareX) * ease
      s.glareY += (34 - s.tiltX * 3 - s.glareY) * ease

      render()

      const settled =
        !s.drag &&
        Math.abs(s.angle) < 0.0008 &&
        Math.abs(s.velocity) < 0.002 &&
        Math.abs(s.drop) < 0.001 &&
        Math.abs(s.dropVelocity) < 0.002 &&
        Math.abs(s.stretch) < 0.05 &&
        Math.abs(flipTarget - s.flip) < 0.05 &&
        Math.abs(s.flipVelocity) < 0.05 &&
        Math.abs(s.targetTiltX - s.tiltX) < 0.02 &&
        Math.abs(s.targetTiltY + swingYaw - s.tiltY) < 0.02
      if (!settled && visible) frame = requestAnimationFrame(step)
    }

    const kick = () => {
      if (reduced.matches) return renderStatic()
      if (!frame && visible) {
        last = performance.now()
        frame = requestAnimationFrame(step)
      }
    }
    kickRef.current = kick

    const pivot = () => {
      const rect = rig.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top }
    }

    const onPointerMove = (event) => {
      if (reduced.matches) return
      if (s.drag && event.pointerId === s.drag.id) {
        const p = pivot()
        const dx = event.clientX - p.x
        const dy = Math.max(40, event.clientY - p.y)
        s.drag.targetAngle = Math.max(
          -1.1,
          Math.min(1.1, -Math.atan2(dx, dy) + s.drag.offset),
        )
        const distance = Math.hypot(dx, dy)
        s.drag.targetStretch = Math.max(
          0,
          Math.min(46, (distance - s.drag.restDistance) * 0.35),
        )
        if (
          Math.hypot(
            event.clientX - s.drag.startX,
            event.clientY - s.drag.startY,
          ) > 6
        )
          s.drag.moved = true
        s.targetTiltX = 0
        s.targetTiltY = 0
        kick()
        return
      }
      if (!finePointer.matches || event.pointerType !== 'mouse') return
      const rect = card.getBoundingClientRect()
      const over =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      if (over) {
        // Hovering: the card leans under the pointer.
        const nx = (event.clientX - rect.left) / rect.width - 0.5
        const ny = (event.clientY - rect.top) / rect.height - 0.5
        s.targetTiltX = -ny * 22
        s.targetTiltY = nx * 26
      } else {
        // Elsewhere: it turns gently toward the pointer.
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        s.targetTiltX = Math.max(
          -8,
          Math.min(8, ((event.clientY - cy) / window.innerHeight) * -14),
        )
        s.targetTiltY = Math.max(
          -12,
          Math.min(12, ((event.clientX - cx) / window.innerWidth) * 22),
        )
      }
      kick()
    }

    const onPointerDown = (event) => {
      if (event.button !== 0) return
      const p = pivot()
      const dx = event.clientX - p.x
      const dy = Math.max(40, event.clientY - p.y)
      s.drag = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        // Keep the grabbed point under the pointer instead of snapping.
        offset: s.angle + Math.atan2(dx, dy),
        restDistance: Math.hypot(dx, dy),
        targetAngle: s.angle,
        targetStretch: 0,
      }
      if (reduced.matches) return
      card.setPointerCapture?.(event.pointerId)
      card.classList.add('is-grabbed')
    }

    const release = (event) => {
      if (!s.drag || event.pointerId !== s.drag.id) return
      const wasClick = !s.drag.moved && event.type === 'pointerup'
      s.drag = null
      card.classList.remove('is-grabbed')
      if (wasClick) toggleRef.current()
      kick()
    }

    const onLeave = () => {
      s.targetTiltX = 0
      s.targetTiltY = 0
      kick()
    }

    const onScroll = () => {
      const delta = window.scrollY - lastScroll
      lastScroll = window.scrollY
      if (reduced.matches || !visible) return
      s.velocity += Math.max(-0.6, Math.min(0.6, delta * 0.0028))
      kick()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) kick()
    })
    observer.observe(rig)

    const onReducedChange = () => (reduced.matches ? renderStatic() : kick())

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    card.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('scroll', onScroll, { passive: true })
    reduced.addEventListener('change', onReducedChange)

    if (reduced.matches) renderStatic()
    else {
      render()
      kick()
    }

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      card.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('scroll', onScroll)
      reduced.removeEventListener('change', onReducedChange)
    }
  }, [])

  return (
    <div className="badge-rig" ref={rigRef}>
      <div className="badge-swing" ref={swingRef}>
        <span className="badge-strap" aria-hidden="true">
          <span>PAULO FONTES · SOFTWARE ENGINEER · ARACAJU · </span>
        </span>
        <span className="badge-clip" aria-hidden="true">
          <i />
        </span>
        <span className="badge-shadow" aria-hidden="true" />
        <div
          className={`badge-card ${flipped ? 'is-flipped' : ''}`}
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? 'Crachá de Paulo Fontes, verso. Pressione para ver a frente.'
              : 'Crachá de Paulo Fontes, Software Engineer em Aracaju. Pressione para virar.'
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggleFlip()
            }
          }}
        >
          <div className="badge-face badge-front" aria-hidden={flipped}>
            <span className="badge-slot" aria-hidden="true" />
            <div className="badge-top">
              <span className="badge-logo" aria-hidden="true">
                <svg viewBox="0 0 34 34" fill="none">
                  <path d="m4 10 6 7-6 7" />
                  <path d="M14 24V10h5a4 4 0 0 1 0 8h-5" />
                  <path d="M24 24h6" />
                </svg>
              </span>
              <span>
                ID / PF—2026
                <b>ACESSO · ENGENHARIA</b>
              </span>
            </div>
            <div className="badge-photo">
              <img
                src="./paulo-fontes.png"
                alt=""
                draggable="false"
                decoding="async"
              />
              <span className="badge-photo-tag">FIG.01</span>
              <span className="badge-scan" aria-hidden="true" />
            </div>
            <div className="badge-identity">
              <strong>
                Paulo
                <br />
                Fontes
              </strong>
              <span>Software Engineer</span>
            </div>
            <dl className="badge-fields">
              <div>
                <dt>Foco</dt>
                <dd>Back-end · Full stack</dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>Aracaju, BR</dd>
              </div>
              <div>
                <dt>Pesquisa</dt>
                <dd>IA · CNPq</dd>
              </div>
            </dl>
            <div className="badge-bottom">
              <Barcode />
              <span className="badge-seal" aria-hidden="true">
                <span>PF</span>
              </span>
            </div>
          </div>

          <div className="badge-face badge-back" aria-hidden={!flipped}>
            <span className="badge-slot" aria-hidden="true" />
            <span className="badge-back-label">PROPRIEDADE DE</span>
            <strong className="badge-back-name">Paulo Fontes</strong>
            <div className="badge-matrix" aria-hidden="true">
              {MATRIX.map((on, index) => (
                <i key={index} className={on ? 'on' : undefined} />
              ))}
            </div>
            <span className="badge-back-url">
              {links.github.replace('https://', '')}
            </span>
            <div className="badge-back-row">
              <span>Se encontrado, envie para</span>
              <b>{links.email.replace('mailto:', '')}</b>
            </div>
            <div className="badge-back-row">
              <span>Hora local · Aracaju</span>
              <b>
                <LiveClock />
              </b>
            </div>
            <span className="badge-back-hint">TOQUE PARA VIRAR</span>
          </div>
          <span className="badge-glare" aria-hidden="true" />
          <span className="badge-edge" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
