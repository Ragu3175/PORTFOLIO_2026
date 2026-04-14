import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = [
  { items: ['React.js','Next.js','JavaScript','TypeScript','Tailwind CSS','Three.js','GSAP','React.js','Next.js','JavaScript','TypeScript','Tailwind CSS','Three.js','GSAP'], speed: 35, dir: -1 },
  { items: ['Node.js','Express','MongoDB','PostgreSQL','JWT','Socket.IO','REST APIs','Node.js','Express','MongoDB','PostgreSQL','JWT','Socket.IO','REST APIs'], speed: 28, dir: 1 },
  { items: ['Docker','AWS','GitHub Actions','CI/CD','Java','Git','Linux','Docker','AWS','GitHub Actions','CI/CD','Java','Git','Linux'], speed: 20, dir: -1 },
]
const CERT_TEXT = 'MERN Stack Certified · React.js Certified · KIT Coimbatore · B.E. ECE · CGPA 7.8 · Novi Tech · '

export default function Skills() {
  const sectionRef = useRef(null)
  const rowRefs    = useRef([])
  const tweensRef  = useRef([])
  const tickerRef  = useRef(null)
  const slatsRef   = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Venetian Blinds Animation
      const slats = slatsRef.current.filter(Boolean);
      gsap.set(slats, { rotateX: 0, opacity: 1 });

      gsap.to(slats, {
        rotateX: -90,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });

      rowRefs.current.forEach((rowEl, i) => {
        if (!rowEl) return
        const inner = rowEl.querySelector('.mq-inner')
        if (!inner) return
        const cfg = ROWS[i]
        const halfW = inner.scrollWidth / 2
        const dur = halfW / cfg.speed
        gsap.set(inner, { x: cfg.dir === -1 ? 0 : -halfW })
        const tween = gsap.to(inner, {
          x: cfg.dir === -1 ? -halfW : 0,
          duration: dur, ease: 'none', repeat: -1,
          modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % halfW) },
        })
        tweensRef.current[i] = tween
      })

      if (tickerRef.current) {
        const inner = tickerRef.current.querySelector('.tk-inner')
        if (inner) {
          const w = inner.scrollWidth / 2
          gsap.to(inner, { x: -w, duration: w / 22, ease: 'none', repeat: -1 })
        }
      }

      // Scroll speed boost
      ScrollTrigger.create({
        trigger: sectionRef.current, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const mult = 1 + Math.min(Math.abs(self.getVelocity()) / 1000, 4)
          tweensRef.current.forEach(t => t && gsap.to(t, { timeScale: mult, duration: 0.3 }))
        },
        onLeave:     () => tweensRef.current.forEach(t => t && gsap.to(t, { timeScale: 1, duration: 0.6 })),
        onLeaveBack: () => tweensRef.current.forEach(t => t && gsap.to(t, { timeScale: 1, duration: 0.6 })),
      })

      // Header entrance
      const hdr = sectionRef.current.querySelector('.skills-hdr')
      gsap.fromTo(hdr, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: hdr, start: 'top 85%', toggleActions: 'play none none reverse' }
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const pauseAll = () => tweensRef.current.forEach(t => t?.pause())
  const playAll  = () => tweensRef.current.forEach(t => t?.play())

  return (
    <section ref={sectionRef} id="skills" style={{
      position: 'relative', width: '100%', minHeight: '120vh', paddingBottom: '6rem', overflow: 'hidden',
      perspective: '1000px'
    }}>
      {/* Venetian Blinds Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        pointerEvents: 'none', display: 'flex', flexDirection: 'column'
      }}>
        {Array(8).fill(0).map((_, i) => (
          <div
            key={i}
            ref={el => slatsRef.current[i] = el}
            style={{
              flex: 1,
              background: 'var(--bg)',
              borderBottom: '1px solid rgba(232,255,71,0.1)',
              transformOrigin: 'top center',
              willChange: 'transform'
            }}
          />
        ))}
      </div>

      {/* Overlay — darker centre for text, lighter edges so canvas breathes */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.7) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="skills-hdr" style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '8rem clamp(1.5rem,6vw,6rem) 5rem',
        }}>
          <span className="section-label">04 · Skills</span>
          <div style={{ width: 50, height: 1, background: '#3A3A3A' }} />
        </div>

        {/* Marquee rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROWS.map((row, ri) => (
            <div key={ri} ref={el => rowRefs.current[ri] = el}
              style={{ overflow: 'hidden' }}
              onMouseEnter={pauseAll} onMouseLeave={playAll}
            >
              <div className="mq-inner" style={{ display: 'flex', gap: 10, width: 'max-content', willChange: 'transform' }}>
                {[...row.items, ...row.items, ...row.items].map((item, i) => (
                  <Chip key={i} label={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cert ticker */}
        <div ref={tickerRef} style={{
          marginTop: '5rem', overflow: 'hidden',
          borderTop: '1px solid #3A3A3A', borderBottom: '1px solid #3A3A3A', padding: '14px 0',
        }}>
          <div className="tk-inner" style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
            {Array(6).fill(CERT_TEXT).map((t, i) => (
              <span key={i} style={{ fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'rgba(240,237,230,0.28)', fontFamily: 'DM Sans,sans-serif' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Chip({ label }) {
  const ref = useRef(null)
  return (
    <span ref={ref} data-cursor
      onMouseEnter={() => gsap.to(ref.current, { backgroundColor: '#E8FF47', color: '#0A0A0F', borderColor: '#E8FF47', duration: 0.25 })}
      onMouseLeave={() => gsap.to(ref.current, { backgroundColor: 'rgba(10,10,15,0.4)', color: 'rgba(240,237,230,0.55)', borderColor: '#3A3A3A', duration: 0.25 })}
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '10px 20px',
        border: '1px solid #3A3A3A', color: 'rgba(240,237,230,0.55)',
        backgroundColor: 'rgba(10,10,15,0.4)',
        fontFamily: 'Clash Display,DM Sans,sans-serif', fontSize: '0.8rem',
        fontWeight: 500, letterSpacing: '0.06em', whiteSpace: 'nowrap', cursor: 'none',
        backdropFilter: 'blur(4px)',
      }}
    >{label}</span>
  )
}
