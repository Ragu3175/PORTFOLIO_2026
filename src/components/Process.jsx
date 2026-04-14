import React, { useEffect, useRef, forwardRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  { num: '01', title: 'UNDERSTAND', desc: 'Deep dive into requirements, constraints, and the problem space. Establishing the architecture before writing a single line of code.' },
  { num: '02', title: 'ARCHITECT', desc: 'Designing scalable systems, choosing the right tech stack, and mapping out the database schema and API flow.' },
  { num: '03', title: 'BUILD', desc: 'Writing clean, testable, and performant code. Focusing on component reusability and keeping the state management predictable.' },
  { num: '04', title: 'POLISH', desc: 'Refining the UI/UX with smooth animations, ensuring accessibility, and optimising performance for a production-ready finish.' },
]

export default function Process() {
  const containerRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const cardsRef = useRef([])
  const numbersRef = useRef([])
  const textsRef = useRef([])
  const lineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const total = PHASES.length
      const windowWidth = window.innerWidth
      
      const scrollTween = gsap.to(trackRef.current, {
        x: () => -(windowWidth * (total - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress
            
            // Advance the line progressively
            if (lineRef.current) {
              gsap.set(lineRef.current, { scaleX: progress })
            }
            
            const raw = progress * (total - 1)
            
            cardsRef.current.forEach((card, i) => {
               if(!card) return;
               const dist = Math.abs(raw - i)
               
               const blur = Math.max(0, Math.min(dist * 6, 8)) // max 8px blur
               const opacity = Math.max(0.15, 1 - (dist * 0.45))
               const numScale = 1 - Math.min(dist * 0.2, 0.2) // 1 to 0.8
               const textY = Math.min(dist * 40, 40) // 0 to 40px
               
               gsap.set(card, { filter: `blur(${blur}px)`, opacity: opacity })
               if(numbersRef.current[i]) gsap.set(numbersRef.current[i], { scale: numScale })
               if(textsRef.current[i]) gsap.set(textsRef.current[i], { y: textY })
            })
          }
        }
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} id="process" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0A0A0F', overflow: 'visible' }}>
      <div ref={pinRef} style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        
        <div style={{
          position: 'absolute', top: 32, left: 'clamp(2rem,6vw,6rem)',
          display: 'flex', alignItems: 'center', gap: 16, zIndex: 10,
        }}>
          <span className="section-label" style={{ color: '#F0EDE6' }}>05 · Process</span>
          <div style={{ width: 40, height: 1, background: '#3A3A3A' }} />
        </div>

        <div ref={trackRef} style={{ 
          position: 'relative',
          display: 'flex', height: '100%', width: `${PHASES.length * 100}vw`, 
          willChange: 'transform' 
        }}>
          
          <div style={{ 
            position: 'absolute', top: '50%', left: '50vw', width: `${(PHASES.length - 1) * 100}vw`, 
            height: 2, background: 'rgba(240,237,230,0.06)', zIndex: 0 
          }} />
          
          <div ref={lineRef} style={{ 
            position: 'absolute', top: '50%', left: '50vw', width: `${(PHASES.length - 1) * 100}vw`, 
            height: 2, background: '#E8FF47', zIndex: 1, 
            transformOrigin: 'left center', transform: 'scaleX(0)' 
          }} />

          {PHASES.map((phase, i) => (
            <div key={i} style={{ 
              width: '100vw', height: '100%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 2
            }}>
              <ProcessCard 
                phase={phase} 
                ref={el => cardsRef.current[i] = el} 
                numRef={el => numbersRef.current[i] = el}
                textRef={el => textsRef.current[i] = el}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ProcessCard = forwardRef(({ phase, numRef, textRef }, ref) => {
  return (
    <div ref={ref} className="process-card" style={{ 
      position: 'relative', width: '100%', maxWidth: '800px', 
      padding: '0 2rem', textAlign: 'center', willChange: 'filter, opacity'
    }}
    onMouseMove={(e) => {
      const card = e.currentTarget
      const r = card.getBoundingClientRect()
      const centerX = r.left + r.width / 2
      const centerY = r.top + r.height / 2
      const mouseX = (e.clientX - centerX) * 0.05
      const mouseY = (e.clientY - centerY) * 0.05
      gsap.to(card, { rotateY: mouseX, rotateX: -mouseY, ease: "power2.out", duration: 0.5, transformPerspective: 800 })
    }}
    onMouseLeave={(e) => {
      gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, ease: "elastic.out(1, 0.3)", duration: 0.8 })
    }}
    >
      {/* Background Number */}
      <div ref={numRef} className="font-display" style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(10rem, 25vw, 25rem)', fontWeight: 900,
        color: '#F0EDE6', opacity: 0.06, pointerEvents: 'none',
        lineHeight: 1, zIndex: 0, willChange: 'transform'
      }}>
        {phase.num}
      </div>

      {/* Foreground Content */}
      <div ref={textRef} style={{ position: 'relative', zIndex: 1, willChange: 'transform' }}>
        <h3 className="font-display" style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700,
          color: '#E8FF47', letterSpacing: '0.02em', marginBottom: '1.5rem',
          textTransform: 'uppercase'
        }}>
          {phase.title}
        </h3>
        <p style={{
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', lineHeight: 1.6,
          color: '#F0EDE6', maxWidth: '500px', margin: '0 auto',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          {phase.desc}
        </p>
      </div>
    </div>
  )
})
ProcessCard.displayName = 'ProcessCard'
