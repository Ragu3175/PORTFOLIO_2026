import { useEffect, useRef, forwardRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

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
  const bgNumRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      const total = PROJECTS.length

      // Initial state: first card visible, rest clipped out
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.set(card, { clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)', zIndex: total - i })
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

          // Handle the giant background number scrub with blur
          if (bgNumRef.current) {
            // Number changes strictly half way through the transition
            bgNumRef.current.innerText = PROJECTS[Math.round(raw)].num
            
            // Blur peaks right in the middle of a transition
            const blurAmount = Math.sin(between * Math.PI) * 12; // peaks at 12px blur
            gsap.set(bgNumRef.current, { 
              filter: `blur(${blurAmount}px)`,
              opacity: 0.05 - (Math.sin(between * Math.PI) * 0.02)
            })
          }

          cardsRef.current.forEach((card, i) => {
            if (!card) return
            
            if (i < current) {
              // Past cards should be fully wiped out
              card.style.clipPath = `inset(0% 0% 0% 100%)`
            } else if (i === current) {
              // Current card wiping out (inset left edge moving to right)
              // We map between to a percentage: 0 to 1 -> 0% to 100%
              card.style.clipPath = `inset(0% 0% 0% ${between * 100}%)`
            } else if (i === next) {
              // Next card wiping in (inset right edge moving to right)
              // between: 0 to 1 -> 100% to 0%
              card.style.clipPath = `inset(0% ${(1 - between) * 100}% 0% 0%)`
            } else {
              // Future cards clipped out completely to the left (waiting to wipe in)
              card.style.clipPath = `inset(0% 100% 0% 0%)`
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
    <div ref={wrapperRef} id="projects" className={styles.wrapper}>
      <div ref={stickyRef} className={styles.sticky}>

        {/* Giant Background Number Scrub */}
        <div ref={bgNumRef} className={`${styles.bgNumber} font-display`}>
          01
        </div>

        {/* Section label */}
        <div className={styles.sectionLabel}>
          <span className="section-label">06 · Projects</span>
          <div className={styles.labelLine} />
        </div>

        {/* Progress dots */}
        <div className={styles.dotsContainer}>
          {PROJECTS.map((_, i) => (
            <div key={i} className={`${styles.dot} proj-dot`} style={{
              background: i === 0 ? 'var(--cream)' : 'var(--surface)',
            }} />
          ))}
        </div>

        {/* Cards container */}
        <div className={styles.cardsContainer}>
          {PROJECTS.map((proj, i) => (
            <ProjectCard
              key={i}
              ref={el => cardsRef.current[i] = el}
              project={proj}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const ProjectCard = forwardRef(({ project: p }, ref) => (
  <div ref={ref} data-cursor-text="VIEW" className={styles.card}>
    <div className={styles.grid}>

      {/* Left: text */}
      <div>
        <h3 className={`${styles.title} font-display`}>
          {p.name}
        </h3>

        <p className={styles.desc}>
          {p.desc}
        </p>

        {/* Stack */}
        <div className={styles.stackContainer}>
          {p.stack.map(s => (
            <span key={s} className={styles.stackItem} style={{
              border: `1px solid ${p.accent}33`,
              color: p.accent,
              background: `${p.accent}0d`,
            }}>{s}</span>
          ))}
        </div>

        {/* Link */}
        <div className={styles.linkContainer}>
          <a href={p.github} target="_blank" rel="noreferrer" className={styles.githubLink}>
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Right: SVG illustration */}
      <div className={styles.visualContainer}>
        <div className={styles.visualWrapper}>
          {/* Glow */}
          <div className={styles.glow} style={{ background: p.accent }} />
          <svg
            viewBox="0 0 160 160"
            width="240" height="240"
            className={styles.svgIcon}
            style={{ color: p.accent }}
            dangerouslySetInnerHTML={{ __html: p.svgPath }}
          />
          {/* Corner border */}
          <div className={styles.cornerBorder} style={{ border: `1px solid ${p.accent}1a` }} />
        </div>
      </div>
    </div>

    {/* Bottom accent line */}
    <div className={styles.bottomLine} style={{
      background: `linear-gradient(to right, transparent, ${p.accent}33, transparent)`,
    }} />
  </div>
))
ProjectCard.displayName = 'ProjectCard'
