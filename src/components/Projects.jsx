import { useEffect, useRef, forwardRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    num: '01', name: 'SafeDrive AI', accent: '#ff6600',
    tagline: 'Real-time driver drowsiness detection + emergency alert.',
    stack: ['IoT', 'ESP32', 'Node.js', 'MongoDB', 'OpenCV'],
    desc: 'Hardware-software system that monitors driver alertness via facial landmark detection, triggers ESP32 hardware alerts, and logs incidents to MongoDB in real time.',
    github: 'https://github.com/Ragu3175',
    svgPath: `<circle cx="80" cy="80" r="58" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="80" cy="80" r="34" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="5 4"/>
      <circle cx="80" cy="80" r="9" fill="currentColor"/>
      <line x1="80" y1="22" x2="80" y2="8" stroke="currentColor" stroke-width="1.5"/>
      <line x1="138" y1="80" x2="152" y2="80" stroke="currentColor" stroke-width="1.5"/>
      <line x1="80" y1="138" x2="80" y2="152" stroke="currentColor" stroke-width="1.5"/>
      <line x1="22" y1="80" x2="8" y2="80" stroke="currentColor" stroke-width="1.5"/>`,
  },
  {
    num: '02', name: 'CodePilot', accent: '#00f5ff',
    tagline: 'AI-powered mobile coding assistant.',
    stack: ['React Native', 'Gemini API', 'Expo', 'Node.js'],
    desc: 'Cross-platform mobile app integrating Gemini AI for real-time code suggestions, debugging help, and documentation lookup — all on the go.',
    github: 'https://github.com/Ragu3175',
    svgPath: `<polyline points="30,20 8,80 30,140" stroke="currentColor" stroke-width="2" fill="none"/>
      <polyline points="130,20 152,80 130,140" stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="55" y1="55" x2="80" y2="105" stroke="currentColor" stroke-width="1.5"/>
      <line x1="80" y1="105" x2="105" y2="55" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="80" cy="80" r="5" fill="currentColor"/>`,
  },
  {
    num: '03', name: 'Task Manager', accent: '#7c3aed',
    tagline: 'Full-featured project & task management platform.',
    stack: ['MERN', 'JWT', 'React', 'Tailwind'],
    desc: 'Production-grade task management app with role-based access, drag-and-drop boards, deadlines, and team collaboration — secured with JWT auth.',
    github: 'https://github.com/Ragu3175',
    svgPath: `<rect x="12" y="12" width="52" height="58" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="74" y="12" width="52" height="36" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="74" y="58" width="52" height="54" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="20" y1="32" x2="56" y2="32" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="44" x2="44" y2="44" stroke="currentColor" stroke-width="1" opacity="0.5"/>`,
  },
  {
    num: '04', name: 'Messaging App', accent: '#00ff88',
    tagline: 'Real-time chat powered by Socket.IO.',
    stack: ['Socket.IO', 'Node.js', 'MongoDB', 'React'],
    desc: 'Scalable real-time messaging app with rooms, private DMs, online presence indicators, and message persistence backed by MongoDB.',
    github: 'https://github.com/Ragu3175',
    svgPath: `<path d="M18,18 h104 q10,0 10,10 v44 q0,10,-10,10 H70 l-22,22 v-22 H28 q-10,0,-10,-10 V28 q0,-10,10,-10 z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="54" cy="50" r="4.5" fill="currentColor"/>
      <circle cx="80" cy="50" r="4.5" fill="currentColor"/>
      <circle cx="106" cy="50" r="4.5" fill="currentColor"/>`,
  },
  {
    num: '05', name: 'Score Predictor', accent: '#ff3366',
    tagline: 'ML-powered academic performance forecasting.',
    stack: ['Python', 'ML', 'React', 'Flask'],
    desc: 'Machine learning model trained on student data to predict exam outcomes. React frontend with interactive visualisations of prediction confidence and data trends.',
    github: 'https://github.com/Ragu3175',
    svgPath: `<polyline points="10,145 42,90 72,112 104,48 136,72 158,18" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="42" cy="90" r="4.5" fill="currentColor"/>
      <circle cx="72" cy="112" r="4.5" fill="currentColor"/>
      <circle cx="104" cy="48" r="4.5" fill="currentColor"/>
      <circle cx="136" cy="72" r="4.5" fill="currentColor"/>
      <line x1="10" y1="155" x2="158" y2="155" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="10" y1="18" x2="10" y2="155" stroke="currentColor" stroke-width="1" opacity="0.4"/>`,
  },
]

export default function Projects() {
  const wrapperRef = useRef(null)
  const stickyRef  = useRef(null)
  const cardsRef   = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      const total = PROJECTS.length

      // Initial state: first card visible, rest off-right
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.set(card, { x: i === 0 ? '0%' : '100%', opacity: i === 0 ? 1 : 0 })
      })

      // Pin + drive carousel
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: '+=500%', // 100vh per project
        pin: true,
        anticipatePin: 1,
        scrub: true,
        onUpdate: (self) => {
          const raw     = self.progress * (total - 1)
          const current = Math.floor(raw)
          const next    = Math.min(current + 1, total - 1)
          const between = raw - current

          cardsRef.current.forEach((card, i) => {
            if (!card) return
            if (i < current) {
              card.style.transform = `translateX(-100%)`
              card.style.opacity = 0
              card.style.visibility = 'hidden'
            } else if (i === current) {
              card.style.transform = `translateX(${-between * 100}%)`
              card.style.opacity = 1 - between
              card.style.visibility = 'visible'
            } else if (i === next) {
              card.style.transform = `translateX(${(1 - between) * 100}%)`
              card.style.opacity = between
              card.style.visibility = 'visible'
            } else {
              card.style.transform = `translateX(100%)`
              card.style.opacity = 0
              card.style.visibility = 'hidden'
            }
          })

          // Update dots
          const dots = stickyRef.current.querySelectorAll('.proj-dot')
          const active = Math.round(raw)
          dots.forEach((dot, i) => {
            dot.style.background  = i === active ? 'var(--cream)' : 'var(--surface)'
            dot.style.transform   = i === active ? 'scale(1.4)' : 'scale(1)'
          })
        },
      })

    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} id="projects" style={{ 
      position: 'relative', width: '100%', minHeight: '100vh', 
      background: 'var(--bg)', overflow: 'visible', zIndex: 10
    }}>
      <div ref={stickyRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>

        {/* Section label */}
        <div style={{
          position: 'absolute', top: 32, left: 'clamp(2rem,6vw,6rem)',
          display: 'flex', alignItems: 'center', gap: 16, zIndex: 10,
        }}>
          <span className="section-label">06 · Projects</span>
          <div style={{ width: 40, height: 1, background: 'var(--surface)' }} />
        </div>

        {/* Progress dots */}
        <div style={{
          position: 'absolute', top: 36, right: 'clamp(2rem,4vw,4rem)',
          display: 'flex', gap: 8, zIndex: 10,
        }}>
          {PROJECTS.map((_, i) => (
            <div key={i} className="proj-dot" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i === 0 ? 'var(--cream)' : 'var(--surface)',
              transition: 'background 0.3s, transform 0.3s',
            }} />
          ))}
        </div>

        {/* Cards */}
        {PROJECTS.map((proj, i) => (
          <ProjectCard
            key={i}
            ref={el => cardsRef.current[i] = el}
            project={proj}
          />
        ))}
      </div>
    </div>
  )
}

const ProjectCard = forwardRef(({ project: p }, ref) => (
  <div ref={ref} data-cursor-text="VIEW" style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center',
    padding: '0 clamp(2rem,6vw,6rem)',
    willChange: 'transform, opacity',
  }}>
    <div style={{
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '4rem', alignItems: 'center',
    }}>

      {/* Left: text */}
      <div>
        <span className="font-display" style={{
          fontSize: 'clamp(4rem, 10vw, 7rem)', fontWeight: 700,
          lineHeight: 1, color: p.accent, opacity: 0.12, display: 'block',
        }}>
          {p.num}
        </span>

        <h3 className="font-display" style={{
          fontSize: 'clamp(2rem, 4.5vw, 4rem)', fontWeight: 700,
          lineHeight: 1.05, letterSpacing: '-0.02em',
          color: 'var(--cream)', marginTop: '0.5rem',
        }}>
          {p.name}
        </h3>

        <p style={{
          marginTop: '1.25rem', fontSize: '0.95rem', lineHeight: 1.75,
          color: 'rgba(240,237,230,0.52)', maxWidth: '46ch',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {p.desc}
        </p>

        {/* Stack */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {p.stack.map(s => (
            <span key={s} style={{
              fontSize: '0.68rem', padding: '6px 14px',
              border: `1px solid ${p.accent}33`,
              color: p.accent,
              background: `${p.accent}0d`,
              fontFamily: 'Clash Display, sans-serif',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{s}</span>
          ))}
        </div>

        {/* Link */}
        <div style={{ marginTop: '2.5rem' }}>
          <a href={p.github} target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: 'Clash Display, sans-serif',
            color: 'rgba(240,237,230,0.45)', textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--lime)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,230,0.45)'}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Right: SVG illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: p.accent, opacity: 0.12,
            filter: 'blur(60px)', borderRadius: '50%',
            transform: 'scale(0.8)',
          }} />
          <svg
            viewBox="0 0 160 160"
            width="240" height="240"
            style={{ color: p.accent, position: 'relative', zIndex: 1 }}
            dangerouslySetInnerHTML={{ __html: p.svgPath }}
          />
          {/* Corner border */}
          <div style={{
            position: 'absolute', inset: -16,
            border: `1px solid ${p.accent}1a`,
          }} />
        </div>
      </div>
    </div>

    {/* Bottom accent line */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
      background: `linear-gradient(to right, transparent, ${p.accent}33, transparent)`,
    }} />
  </div>
))
ProjectCard.displayName = 'ProjectCard'
