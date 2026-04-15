import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Credibility.module.css'

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
    <section ref={sectionRef} id="credibility" className={styles.container}>
      <div className={styles.header}>
        <span className="section-label">07 · Credibility</span>
        <div className={styles.labelLine} />
      </div>

      <div className={styles.grid}>
        {CARDS.map((card, i) => (
          <div key={i} ref={el => cardsRef.current[i] = el} className={styles.card} style={{ background: 'var(--dim)' }}>
            <div className={styles.cardGradient} />
            <h3 className={`font-display ${styles.title}`}>
              {card.title}
            </h3>
            <p className={styles.desc}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
