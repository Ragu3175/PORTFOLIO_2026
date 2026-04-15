import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Ragu3175',                      sub: 'Ragu3175'        },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/raguram-r-92504a286',       sub: 'raguram-r'       },
  { label: 'Resume',   href: '/Raguram_Resume.pdf',                               sub: 'Download PDF', download: true },
  { label: 'Phone',    href: 'tel:+919489624436',                                 sub: '+91 9489 624436' },
]

export default function Contact() {
  const sectionRef   = useRef(null)
  const word1Ref     = useRef(null)
  const word2Ref     = useRef(null)
  const word3Ref     = useRef(null)
  const terminalRef  = useRef(null)
  const linksRef     = useRef([])
  const foldRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial hidden state
      gsap.set([word1Ref.current, word2Ref.current, word3Ref.current], { opacity: 0, y: 70 })
      gsap.set(terminalRef.current, { opacity: 0, y: 20 })
      gsap.set(linksRef.current.filter(Boolean), { opacity: 0, y: 24 })

      // Removed 3D Page Fold Transition since it's the final section

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      tl
        .to(word1Ref.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
        .to(word2Ref.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.5')
        .to(word3Ref.current, { opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.6)' }, '-=0.45')
        .to(terminalRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .to(linksRef.current.filter(Boolean), {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        }, '-=0.3')

    }, sectionRef)

    // Magnetic effect
    const els = sectionRef.current.querySelectorAll('[data-mag]')
    const cleanups = []
    els.forEach(el => {
      const onMove = (e) => {
        const r  = el.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3
        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' })
      }
      const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' })
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => {
      ctx.revert()
      cleanups.forEach(fn => fn())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: '8rem clamp(2rem,6vw,6rem) 5rem',
        overflow: 'hidden',
        background: '#0A0A0F',
        perspective: '1500px'
      }}
    >
      {/* The Page Fold Wrapper */}
      <div ref={foldRef} style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        willChange: 'transform'
      }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '5rem' }}>
          <span className="section-label">08 · Contact</span>
          <div style={{ width: 60, height: 1, background: 'var(--surface)' }} />
        </div>

        {/* Headline */}
        <div className="font-display" style={{
          fontSize: 'clamp(3.5rem, 10vw, 10rem)',
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: '-0.03em',
        }}>
          <div style={{ overflow: 'hidden', paddingBottom: '0.05em' }}>
            <span ref={word1Ref} style={{ display: 'inline-block', color: 'var(--cream)' }}>LET'S</span>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '0.05em' }}>
            <span ref={word2Ref} style={{ display: 'inline-block', color: 'var(--cream)' }}>BUILD</span>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '0.05em' }}>
            <span ref={word3Ref} style={{ display: 'inline-block', color: 'var(--lime)' }}>SOMETHING.</span>
          </div>
        </div>

        {/* Full-bleed Terminal Block */}
        <div ref={terminalRef} style={{ marginTop: '3rem', position: 'relative' }}>
          <TerminalBlock />
        </div>

        {/* Links row */}
        <div style={{ marginTop: '4rem', display: 'flex', flexWrap: 'wrap', gap: '2rem 4rem' }}>
          {LINKS.map((link, i) => (
            <a
              key={i}
              ref={el => linksRef.current[i] = el}
              href={link.href}
              target={link.download ? undefined : '_blank'}
              rel="noreferrer"
              download={link.download || undefined}
              data-mag
              style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                textDecoration: 'none',
                color: 'var(--cream)',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--lime)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--cream)'}
            >
              <span style={{
                fontFamily: 'Clash Display, DM Sans, sans-serif',
                fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.03em',
              }}>
                {link.label}
              </span>
              <span style={{
                fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(240,237,230,0.35)', fontFamily: 'DM Sans, sans-serif',
              }}>
                {link.sub}
              </span>
            </a>
          ))}
        </div>

        {/* Footer bar */}
        <div style={{
          marginTop: '6rem', paddingTop: '2rem',
          borderTop: '1px solid var(--surface)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
            Raguram R · Full Stack Developer · 2025
          </span>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
            Built with React + GSAP + Lenis
          </span>
        </div>

        {/* Background lime glow (bottom left) */}
        <div style={{
          position: 'absolute', bottom: -100, left: -100,
          width: 350, height: 350, borderRadius: '50%',
          background: 'var(--lime)', opacity: 0.04,
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />
      </div>
      
      {/* Blinking cursor keyframes */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}

function TerminalBlock() {
  const [typedLines, setTypedLines] = useState([])
  const containerRef = useRef(null)

  const terminalLines = [
    "initializing contact protocol...",
    "target: ragu317317@gmail.com",
    "status: OPEN TO WORK...",
    "location: Bengaluru / Chennai / Hyderabad",
    "availability: IMMEDIATE"
  ]

  useEffect(() => {
    let timeouts = []
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        let currentLineIdx = 0;
        let currentCharIdx = 0;
        let currentText = [""];

        const typeChar = () => {
          if (currentLineIdx >= terminalLines.length) return;
          
          const targetLine = terminalLines[currentLineIdx];
          
          if (currentCharIdx < targetLine.length) {
            currentText[currentLineIdx] = targetLine.substring(0, currentCharIdx + 1);
            setTypedLines([...currentText]);
            currentCharIdx++;
            // Fast typing speed (5ms - 15ms)
            timeouts.push(setTimeout(typeChar, Math.random() * 10 + 5)); 
          } else {
            // Line finished, wait a bit then start next line
            currentLineIdx++;
            currentCharIdx = 0;
            if (currentLineIdx < terminalLines.length) {
              currentText.push("");
              setTypedLines([...currentText]);
              timeouts.push(setTimeout(typeChar, 100));
            }
          }
        };

        timeouts.push(setTimeout(typeChar, 200));
      },
      once: true
    })

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [])

  return (
    <div ref={containerRef} style={{
      width: '100%',
      backgroundColor: 'rgba(20, 20, 25, 0.6)',
      border: '1px solid #3A3A3A',
      borderRadius: '8px',
      padding: '2rem',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
      color: 'rgba(240,237,230,0.6)',
      lineHeight: 1.8,
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      minHeight: '260px'
    }}>
      {/* Mac OS dot controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
      </div>

      <div>
        {typedLines.map((line, idx) => {
          const isCompleteLine = idx < typedLines.length - 1 || line.length === terminalLines[idx].length;
          const fullLineText = terminalLines[idx];
          
          return (
            <div key={idx} style={{
              color: fullLineText.includes('target:') || fullLineText.includes('status:') ? 'var(--lime)' : 'inherit',
              fontWeight: fullLineText.includes('target:') || fullLineText.includes('status:') ? 600 : 400
            }}>
              <span style={{ color: '#00ff88', marginRight: '10px' }}>&gt;</span>
              {line}
              {/* Show blinking cursor only on the very last line being typed */}
              {idx === typedLines.length - 1 && (
                <div style={{ 
                  display: 'inline-block',
                  width: '10px', 
                  height: '1.2em', 
                  backgroundColor: 'var(--lime)', 
                  verticalAlign: 'bottom',
                  marginLeft: '4px',
                  animation: 'blink 1s step-end infinite'
                }} />
              )}
            </div>
          )
        })}
        {/* Fallback cursor if typing hasn't started */}
        {typedLines.length === 0 && (
          <div>
            <span style={{ color: '#00ff88', marginRight: '10px' }}>&gt;</span>
            <div style={{ 
              display: 'inline-block',
              width: '10px', 
              height: '1.2em', 
              backgroundColor: 'var(--lime)', 
              verticalAlign: 'bottom',
              marginLeft: '4px',
              animation: 'blink 1s step-end infinite'
            }} />
          </div>
        )}
      </div>
    </div>
  )
}
