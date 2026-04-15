import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Skills.module.css'

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
    <section ref={sectionRef} id="skills" className={styles.container}>
      {/* Structural Slats */}
      <div className={styles.slatsContainer}>
        {Array(10).fill(0).map((_, i) => (
          <div key={i} ref={el => slatsRef.current[i] = el} className={styles.slat} />
        ))}
      </div>

      <div ref={masterPinRef} className={styles.masterPin}>
        
        {/* The Scanning Laser Line */}
        <div ref={laserRef} className={styles.laser} />

        {/* Bento Grid Layout */}
        <div className={styles.bentoGrid}>
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
        <div className={styles.sectionLabel}>
          <span className="section-label">04 · Skills</span>
          <div className={styles.labelLine} />
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
      className={styles.card}
      style={{
        ...gridStyles[i]
      }}
    >
      <div className={styles.cardHeader}>
        <h3 className={`${styles.cardTitle} font-display`} style={{ color: group.color }}>{group.title}</h3>
        <div className={styles.cardDot} style={{ background: group.color }} />
      </div>

      <div className={styles.chipsContainer}>
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
}
)

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
      className={styles.chip}
      style={{
        background: isLit ? `${color}15` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isLit ? color : 'rgba(240,237,230,0.1)'}`,
        color: isLit ? '#F0EDE6' : 'rgba(240,237,230,0.35)',
        fontWeight: isLit ? 600 : 500,
        boxShadow: isLit ? `0 0 15px ${color}30` : 'none',
      }}
    >
      {label}
    </span>
  )
}
