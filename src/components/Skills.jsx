import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GROUPS = [
  {
    title: 'FRONTEND',
    skills: ['React.js', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GSAP'],
    color: '#E8FF47'
  },
  {
    title: 'BACKEND',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'JWT', 'Socket.IO', 'REST APIs'],
    color: '#00F0FF' // Electric Blue for contrast
  },
  {
    title: 'DEVOPS & TOOLS',
    skills: ['Docker', 'AWS', 'GitHub Actions', 'CI/CD', 'Java', 'Git', 'Linux'],
    color: '#FF3D00' // High-vis Orange
  }
]

const CERT_TEXT = 'MERN Stack Certified · React.js Certified · KIT Coimbatore · B.E. ECE · CGPA 7.8 · Novi Tech · '

export default function Skills() {
  const sectionRef = useRef(null)
  const masterPinRef = useRef(null)
  const bentoRefs = useRef([])
  const slatsRef = useRef([])
  const laserRef = useRef(null)
  const chipsRef = useRef([]) // Flattened refs for all chips
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Venetian Blinds (Entry)
      const slats = slatsRef.current.filter(Boolean);
      gsap.to(slats, {
        rotateX: -90,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });

      // 2. The Master Timeline (Assembly & Activation)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%', // Long pin for assembly + scan + hold
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => setScrollProgress(self.progress)
        }
      });

      // Card Assembly - Flying in from 3D space
      bentoRefs.current.forEach((card, i) => {
        if (!card) return;
        const startX = i === 0 ? '-100vw' : i === 1 ? '100vw' : '0';
        const startY = i === 2 ? '100vh' : '0';
        const startZ = -1000;

        tl.fromTo(card, {
          x: startX,
          y: startY,
          z: startZ,
          rotateY: i === 0 ? 45 : i === 1 ? -45 : 0,
          opacity: 0,
          filter: 'blur(20px)'
        }, {
          x: 0,
          y: 0,
          z: 0,
          rotateY: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'expo.out'
        }, 0); // All fly together at start
      });

      // 3. Laser Sweep Animation
      tl.fromTo(laserRef.current, {
        top: '-10%',
        opacity: 0
      }, {
        top: '120%',
        opacity: 0,
        duration: 3,
        ease: 'none'
      }, 1.2); // Start sweep after cards settle

      tl.to(bentoRefs.current, {
        y: 0,
        x: 0,
        height: '2px',
        padding: 0,
        borderRadius: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power4.inOut'
      }, '+=0.2');

      // Hide Slats and Labels for a clean handover
      tl.to(sectionRef.current.querySelector('div[style*="z-index: 100"]'), {
        opacity: 0,
        duration: 0.5
      }, '<');

      tl.to(sectionRef.current.querySelector('.section-label')?.parentElement, {
        opacity: 0,
        duration: 0.5
      }, '<');

      tl.to(masterPinRef.current, {
        y: -50,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.8,
      }, '+=0.2');

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="skills" style={{
      position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden',
      background: '#0A0A0F', perspective: '1500px'
    }}>
      {/* Structural Slats */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
        {Array(10).fill(0).map((_, i) => (
          <div key={i} ref={el => slatsRef.current[i] = el} style={{
            flex: 1, background: 'var(--bg)', borderBottom: '1px solid rgba(232,255,71,0.05)',
            transformOrigin: 'top center'
          }} />
        ))}
      </div>

      <div ref={masterPinRef} style={{ position: 'relative', height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* The Scanning Laser Line */}
        <div ref={laserRef} style={{
          position: 'absolute', left: 0, width: '100%', height: '4px',
          background: 'linear-gradient(90deg, transparent, var(--lime), transparent)',
          boxShadow: '0 0 40px var(--lime), 0 0 80px var(--lime)',
          zIndex: 50, pointerEvents: 'none', transform: 'translateY(-50%)',
          willChange: 'top'
        }} />

        {/* Bento Grid Layout */}
        <div style={{
          position: 'relative', width: '90%', maxWidth: '1200px',
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(180px, auto)',
          gap: '20px', padding: '20px', zIndex: 10, transformStyle: 'preserve-3d'
        }}>
          {GROUPS.map((group, i) => (
            <BentoCard 
              key={i}
              i={i}
              group={group}
              ref={el => bentoRefs.current[i] = el}
              laserRef={laserRef}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>

        {/* Section label */}
        <div style={{ position: 'absolute', top: '4rem', left: 'clamp(2rem,6vw,6rem)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="section-label">04 · Skills</span>
          <div style={{ width: 40, height: 1, background: '#3A3A3A' }} />
        </div>
      </div>
    </section>
  )
}

const BentoCard = React.forwardRef(({ group, i, laserRef, scrollProgress }, ref) => {
  // Grid placements for the asymmetry
  const gridStyles = [
    { gridColumn: 'span 7', gridRow: 'span 2' }, // Frontend (Big)
    { gridColumn: 'span 5', gridRow: 'span 1' }, // Backend
    { gridColumn: 'span 5', gridRow: 'span 1' }, // DevOps
  ];

  return (
    <div 
      ref={ref} 
      style={{
        ...gridStyles[i],
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(240, 237, 230, 0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        willChange: 'transform, opacity'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="font-display" style={{ 
          fontSize: '0.9rem', color: group.color, letterSpacing: '0.2em', fontWeight: 700 
        }}>{group.title}</h3>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.color, opacity: 0.5 }} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {group.skills.map((skill, idx) => (
          <SkillChip 
            key={idx} 
            label={skill} 
            parentProgress={scrollProgress} 
            color={group.color}
          />
        ))}
      </div>
    </div>
  )
})

function SkillChip({ label, parentProgress, color }) {
  const chipRef = useRef(null)
  const [isLit, setIsLit] = useState(false)

  // Use the parent's scroll progress to ignite the chip
  useEffect(() => {
    if (!chipRef.current) return
    const rect = chipRef.current.getBoundingClientRect()
    const viewportH = window.innerHeight
    
    // The laser sweep corresponds to the middle phase of the scroll (approx 0.3 to 0.8)
    // We check if the chip's center is near the scan line
    const center = rect.top + rect.height / 2
    // The laser is roughly at: (Progress * Range) - Offset
    // However, since we want the chip to STAY lit once scanned:
    const scanLinePosition = (viewportH * 1.5 * parentProgress) - (viewportH * 0.2)
    
    if (center < scanLinePosition) {
      setIsLit(true)
    }
  }, [parentProgress])

  return (
    <span 
      ref={chipRef}
      style={{
        padding: '10px 20px',
        background: isLit ? `${color}15` : 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: `1px solid ${isLit ? color : 'rgba(240,237,230,0.1)'}`,
        color: isLit ? '#F0EDE6' : 'rgba(240,237,230,0.35)',
        fontFamily: 'Clash Display, DM Sans, sans-serif',
        fontSize: '0.85rem',
        fontWeight: isLit ? 600 : 500,
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: isLit ? `0 0 15px ${color}30` : 'none',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </span>
  )
}
