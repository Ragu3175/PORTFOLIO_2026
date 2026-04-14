import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  { title: "Production Ready", desc: "Code that handles edge cases, scales smoothly, and deploys without a sweat.", delay: 0 },
  { title: "Pixel Perfect", desc: "Translating extreme high-fidelity designs into fluid code without compromise.", delay: 0.2 },
  { title: "Business Minded", desc: "Building features that solve actual problems, not just writing code for the sake of it.", delay: 0.4 }
]

export default function Credibility() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { rotateY: 90, opacity: 0, z: -200, scale: 0.8 },
          {
            rotateY: 0, opacity: 1, z: 0, scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${80 - (i * 10)}%`,
              end: `top ${40 - (i * 10)}%`,
              scrub: 1
            }
          }
        )
        
        // Deep Parallax effect for cards
        gsap.to(card, {
          y: -50 * (i + 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        })
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="credibility" style={{ 
      position: 'relative', width: '100%', minHeight: '120vh', 
      background: 'var(--bg)', padding: '10rem clamp(2rem,6vw,6rem)',
      perspective: '1500px', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '6rem' }}>
        <span className="section-label" style={{ color: 'var(--cream)' }}>07 · Credibility</span>
        <div style={{ width: 40, height: 1, background: 'var(--surface)' }} />
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem', position: 'relative', zIndex: 1
      }}>
        {CARDS.map((card, i) => (
          <div key={i} ref={el => cardsRef.current[i] = el} style={{
            background: 'var(--dim)',
            border: '1px solid rgba(232,255,71,0.1)',
            borderRadius: '16px', padding: '4rem 3rem',
            position: 'relative', transformStyle: 'preserve-3d',
            boxShadow: 'inset 0 0 20px rgba(232,255,71,0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              borderRadius: '16px',
              background: 'radial-gradient(circle at top left, rgba(232,255,71,0.1), transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            <h3 className="font-display" style={{ fontSize: '2rem', color: 'var(--cream)', marginBottom: '1rem', fontWeight: 600 }}>
              {card.title}
            </h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(240,237,230,0.6)', lineHeight: 1.6 }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
