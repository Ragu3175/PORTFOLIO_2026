import React, { useEffect, useRef, forwardRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  { 
    num: '01', 
    title: 'DISCOVERY', 
    desc: 'Deep architecture analysis and requirement mapping. We bridge the gap between vision and technical feasibility.',
    accent: '#E8FF47',
    tags: ['Architecture', 'Logic Flow', 'UX Auditing']
  },
  { 
    num: '02', 
    title: 'DESIGN', 
    desc: 'High-fidelity visual systems that emphasize motion and depth. Every pixel is engineered for interaction.',
    accent: '#00F0FF',
    tags: ['Visual ID', 'Motion Design', 'Prototyping']
  },
  { 
    num: '03', 
    title: 'ENGINEER', 
    desc: 'Bespoke development using cutting-edge stacks. We focus on performance, scalability, and clean code.',
    accent: '#FF007A',
    tags: ['Full Stack', '3D WebGL', 'Optimization']
  },
  { 
    num: '04', 
    title: 'EVOLVE', 
    desc: 'Deployment is just the beginning. Continuous monitoring and iterative updates to ensure long-term stability.',
    accent: '#6A00FF',
    tags: ['Deployment', 'Analytics', 'Iteration']
  },
]

export default function Process() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const svgLineRef = useRef(null)
  const entryShieldRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const total = PHASES.length
      const windowWidth = window.innerWidth
      
      if (svgLineRef.current) {
        const pathLength = svgLineRef.current.getTotalLength()
        gsap.set(svgLineRef.current, { 
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: "+=600%",
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const x = gsap.getProperty(trackRef.current, "x")
            const active = Math.min(total - 1, Math.round(Math.abs(x) / windowWidth))
            setActiveIdx(active)

            // Dynamic background shift for depth
            gsap.to(containerRef.current, {
              backgroundColor: active > 0 ? '#050508' : '#0A0A0F',
              duration: 0.6
            })
          }
        }
      });

      // 1. Entry Shield Dissolve
      tl.to(entryShieldRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power3.inOut'
      });

      // 2. Initial Revelation
      tl.fromTo(trackRef.current, 
        { autoAlpha: 0, scale: 0.98 }, 
        { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        '0.1'
      );

      // 3. Horizontal Scroll & Neural Wire Growth
      // The line grows at the exact same time the cards move
      tl.to(trackRef.current, {
        x: () => -(windowWidth * (total - 1)),
        ease: "none",
        duration: 8,
      }, '0.8');

      tl.to(svgLineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        duration: 8,
      }, '0.8');

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} id="process" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0A0A0F', overflow: 'hidden' }}>
      
      {/* Entry Shield (Prevents transition mismatch) */}
      <div 
        ref={entryShieldRef}
        style={{
          position: 'absolute', inset: 0, background: '#0A0A0F', zIndex: 1000, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div style={{ width: '40px', height: '1px', background: '#E8FF47', boxShadow: '0 0 15px #E8FF47' }} />
      </div>

      {/* Background Neural Grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #F0EDE6 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Floating Section Label */}
      <div style={{ position: 'absolute', top: '4rem', left: 'clamp(2rem,6vw,6rem)', display: 'flex', alignItems: 'center', gap: 16, zIndex: 10 }}>
        <span className="section-label" style={{ color: 'rgba(240,237,230,0.6)', fontWeight: 600, letterSpacing: '0.1em' }}>05 · Methodology</span>
        <div style={{ width: 40, height: 1, background: 'rgba(240,237,230,0.2)' }} />
      </div>

      <div ref={trackRef} style={{ 
        position: 'relative', display: 'flex', height: '100vh', width: `${PHASES.length * 100}vw`, willChange: 'transform' 
      }}>
        
        {/* The Connection Line (Neural Wire) - Pure Background Layer */}
        <div style={{ 
          position: 'absolute', top: '50%', left: '50vw', width: `${(PHASES.length - 1) * 100}vw`, 
          height: 1, background: 'rgba(255,255,255,0.02)', zIndex: 0 
        }} />
        
        <svg style={{ 
          position: 'absolute', top: 'calc(50% - 2px)', left: '50vw', width: `${(PHASES.length - 1) * 100}vw`, 
          height: '4px', zIndex: 0, pointerEvents: 'none', overflow: 'visible',
          maskImage: 'linear-gradient(to right, transparent, black 150px)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 150px)'
        }}>
           <line 
            id="neural-wire-line"
            ref={svgLineRef} 
            x1="0" y1="2" x2="100%" y2="2" 
            stroke={PHASES[activeIdx].accent} 
            strokeWidth="3" 
            strokeDasharray="2000" 
            strokeDashoffset="2000"
            strokeLinecap="round" 
            style={{ transition: 'stroke 0.8s ease', filter: 'drop-shadow(0 0 12px currentColor)' }}
           />
        </svg>

        {PHASES.map((phase, i) => (
          <div key={i} style={{ 
            width: '100vw', height: '100vh', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10
          }}>
            <BentoProcessCard 
              phase={phase} 
              isActive={activeIdx === i} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function BentoProcessCard({ phase, isActive }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!isActive || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const moveX = (x - 0.5) * 25
    const moveY = (y - 0.5) * 25
    gsap.to(cardRef.current, { rotateY: moveX, rotateX: -moveY, duration: 0.5, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 1, ease: 'power3.out' })
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '90%',
        maxWidth: '1000px',
        height: '60vh',
        background: isActive ? '#07070A' : 'rgba(255, 255, 255, 0.02)',
        backdropFilter: isActive ? 'blur(40px)' : 'blur(5px)',
        border: `1px solid ${isActive ? phase.accent + '80' : 'rgba(255, 255, 255, 0.05)'}`,
        borderRadius: '32px',
        padding: '3.5rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr',
        gap: '4rem',
        transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transform: `scale(${isActive ? 1 : 0.85})`,
        opacity: isActive ? 1 : 0.1,
        position: 'relative',
        boxShadow: isActive ? `0 0 70px ${phase.accent}15` : 'none',
        overflow: 'hidden',
        perspective: '1200px',
        willChange: 'transform, opacity, filter'
      }}
    >
      {/* Decorative Corner Trace */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderTop: `2px solid ${phase.accent}`, borderRight: `2px solid ${phase.accent}`, opacity: isActive ? 0.6 : 0, transition: '0.8s', borderRadius: '0 32px 0 0' }} />

      {/* Left: Identity */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ 
          color: phase.accent, 
          fontSize: '0.9rem', 
          fontWeight: 800, 
          letterSpacing: '0.3em',
          opacity: isActive ? 1 : 0,
          transform: `translateY(${isActive ? 0 : 20}px)`,
          transition: '0.6s 0.2s'
        }}>
          STEP {phase.num}
        </span>
        <h3 style={{ 
          fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
          margin: '1.5rem 0', 
          color: '#F0EDE6', 
          fontWeight: 900,
          lineHeight: 1,
          opacity: isActive ? 1 : 0.5,
          filter: isActive ? 'none' : 'blur(3px)',
          transition: '0.6s'
        }}>
          {phase.title}
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {phase.tags.map((tag, i) => (
            <span key={tag} style={{ 
              padding: '0.6rem 1.4rem', 
              border: `1px solid ${phase.accent}33`, 
              borderRadius: '100px', 
              fontSize: '0.8rem', 
              color: '#F0EDE6',
              background: isActive ? `${phase.accent}08` : 'transparent',
              opacity: isActive ? 1 : 0,
              transform: `translateY(${isActive ? 0 : 20}px)`,
              transition: `all 0.6s ${0.3 + i * 0.1}s`
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Narrative & Logic */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        opacity: isActive ? 1 : 0,
        transform: `translateX(${isActive ? 0 : 40}px)`,
        transition: '0.9s 0.4s'
      }}>
        <p style={{ color: '#F0EDE6', opacity: 0.85, fontSize: '1.25rem', lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 400 }}>
          {phase.desc}
        </p>

        {/* Logic Visualization Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', height: '180px' }}>
          <div style={{ 
            background: isActive ? `${phase.accent}08` : 'rgba(255,255,255,0.01)', 
            border: `1px solid ${isActive ? phase.accent + '20' : 'rgba(255,255,255,0.03)'}`, 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: '0.8s'
          }}>
             <div style={{ width: '40px', height: '2px', background: phase.accent, boxShadow: `0 0 20px ${phase.accent}` }} />
          </div>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
             <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }} />
             <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
