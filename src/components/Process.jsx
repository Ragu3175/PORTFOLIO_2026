import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Process.module.css'

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

            gsap.to(containerRef.current, {
              backgroundColor: active > 0 ? '#050508' : '#0A0A0F',
              duration: 0.6
            })
          }
        }
      });

      tl.to(entryShieldRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power3.inOut'
      });

      tl.fromTo(trackRef.current, 
        { autoAlpha: 0, scale: 0.98 }, 
        { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        '0.1'
      );

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
    <section ref={containerRef} id="process" className={styles.container}>
      
      <div ref={entryShieldRef} className={styles.entryShield}>
        <div className={styles.shieldLine} />
      </div>

      <div className={styles.neuralGrid} />

      <div className={styles.sectionLabel}>
        <span className={styles.labelCircle}>05 · Methodology</span>
        <div className={styles.labelLine} />
      </div>

      <div ref={trackRef} className={styles.track} style={{ width: `${PHASES.length * 100}vw` }}>
        
        <div className={styles.connectionLineBg} style={{ width: `${(PHASES.length - 1) * 100}vw` }} />
        
        <svg className={styles.svgContainer} style={{ width: `${(PHASES.length - 1) * 100}vw` }}>
           <line 
            id="neural-wire-line"
            ref={svgLineRef} 
            x1="0" y1="2" x2="100%" y2="2" 
            stroke={PHASES[activeIdx].accent} 
            strokeWidth="3" 
            strokeDasharray="2000" 
            strokeDashoffset="2000"
            strokeLinecap="round" 
            className={styles.neuralWireLine}
           />
        </svg>

        {PHASES.map((phase, i) => (
          <div key={i} className={styles.cardWrapper}>
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
      className={styles.card}
      style={{
        background: isActive ? '#07070A' : 'rgba(255, 255, 255, 0.02)',
        backdropFilter: isActive ? 'blur(40px)' : 'blur(5px)',
        border: `1px solid ${isActive ? phase.accent + '80' : 'rgba(255, 255, 255, 0.05)'}`,
        transform: `scale(${isActive ? 1 : 0.85})`,
        opacity: isActive ? 1 : 0.1,
        boxShadow: isActive ? `0 0 70px ${phase.accent}15` : 'none',
      }}
    >
      <div className={styles.cardCorner} style={{ borderTop: `2px solid ${phase.accent}`, borderRight: `2px solid ${phase.accent}`, opacity: isActive ? 0.6 : 0 }} />

      <div className={styles.leftContent}>
        <span className={styles.stepNum} style={{ 
          color: phase.accent, 
          opacity: isActive ? 1 : 0,
          transform: `translateY(${isActive ? 0 : 20}px)`,
        }}>
          STEP {phase.num}
        </span>
        <h3 className={styles.title} style={{ 
          opacity: isActive ? 1 : 0.5,
          filter: isActive ? 'none' : 'blur(3px)',
        }}>
          {phase.title}
        </h3>
        
        <div className={styles.tagsContainer}>
          {phase.tags.map((tag, i) => (
            <span key={tag} className={styles.tag} style={{ 
              border: `1px solid ${phase.accent}33`, 
              background: isActive ? `${phase.accent}08` : 'transparent',
              opacity: isActive ? 1 : 0,
              transform: `translateY(${isActive ? 0 : 20}px)`,
              transitionDelay: `${0.3 + i * 0.1}s`
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.rightContent} style={{ 
        opacity: isActive ? 1 : 0,
        transform: `translateX(${isActive ? 0 : 40}px)`,
      }}>
        <p className={styles.desc}>
          {phase.desc}
        </p>

        <div className={styles.logicGrid}>
          <div className={styles.logicVisual} style={{ 
            background: isActive ? `${phase.accent}08` : 'rgba(255,255,255,0.01)', 
            border: `1px solid ${isActive ? phase.accent + '20' : 'rgba(255,255,255,0.03)'}`, 
          }}>
             <div className={styles.pulseLine} style={{ background: phase.accent, boxShadow: `0 0 20px ${phase.accent}` }} />
          </div>
          <div className={styles.logicSubGrid}>
             <div className={styles.subGridItem} />
             <div className={styles.subGridItem} />
          </div>
        </div>
      </div>
    </div>
  )
}
