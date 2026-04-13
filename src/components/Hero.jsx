import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ onVideoReady }) {
  const [isMobile, setIsMobile] = useState(false)
  
  const sectionRef   = useRef(null)
  const videoRef     = useRef(null)
  const overlayRef   = useRef(null)
  const eyebrowRef   = useRef(null)
  const titleRef     = useRef(null)
  const subRef       = useRef(null)
  const ctaRef       = useRef(null)
  const scrollIndRef = useRef(null)
  
  // Also handle video readiness if it's already loaded or cached
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      if (onVideoReady) onVideoReady()
    }
  }, [onVideoReady])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Text entrance after loader ──
      gsap.set([eyebrowRef.current, titleRef.current, subRef.current, ctaRef.current], {
        opacity: 0, y: 40,
      })
      gsap.timeline({ delay: 0.2 })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        .to(titleRef.current,   { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.65')
        .to(subRef.current,     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to(ctaRef.current,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')

      // ── Scroll: video scales, text drifts up, overlay darkens ──
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          if (overlayRef.current) overlayRef.current.style.opacity = String(0.45 + p * 0.3)
          if (videoRef.current) gsap.set(videoRef.current, { scale: 1 + p * 0.08 })
          gsap.set(titleRef.current,   { y: p * -70 })
          gsap.set(eyebrowRef.current, { y: p * -45 })
          gsap.set(subRef.current,     { y: p * -35 })
          gsap.set(ctaRef.current,     { y: p * -25, opacity: 1 - p * 0.8 })
        },
      })

      // ── Scroll indicator bounce ──
      gsap.to(scrollIndRef.current, {
        opacity: 0.08, y: 10,
        repeat: -1, yoyo: true, duration: 1.5, ease: 'power1.inOut',
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" style={{
      position: 'relative', width: '100%', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(circle at center, #1A1A22 0%, #0A0A0F 100%)', // Fallback
    }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        key={isMobile ? 'mobile' : 'desktop'}
        src={isMobile ? "/Mobile_view.mp4" : "/Hero.mp4"}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => onVideoReady && onVideoReady()}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* Watermark Cover */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 120,
        height: 40,
        background: '#0A0A0F',
        zIndex: 1,
      }} />

      {/* Dark Overlay */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none',
        background: 'linear-gradient(to top, #0A0A0F 0%, #0A0A0F 8%, rgba(10,10,15,0.45) 50%, rgba(10,10,15,0.1) 100%)',
        zIndex: 2,
      }} />

      {/* Subtle grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        backgroundImage: `linear-gradient(rgba(232,255,71,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,255,71,0.02) 1px,transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'absolute', top: 32, right: 'clamp(1.5rem,4vw,4rem)', zIndex: 10, display: 'flex', gap: 28,
      }}>
        {['Work', 'About', 'Contact'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`}
            style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.38)', textDecoration: 'none', fontFamily: 'DM Sans,sans-serif', transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = '#E8FF47'}
            onMouseLeave={e => e.target.style.color = 'rgba(240,237,230,0.38)'}
          >{item}</a>
        ))}
      </nav>

      {/* Logo */}
      <div style={{ position: 'absolute', top: 28, left: 'clamp(1.5rem,4vw,4rem)', zIndex: 10 }}>
        <span style={{ fontFamily: 'Clash Display,DM Sans,sans-serif', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#F0EDE6' }}>
          RR<span style={{ color: '#E8FF47' }}>.</span>
        </span>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 clamp(1.5rem,6vw,6rem) 5rem',
      }}>
        <p ref={eyebrowRef} style={{ fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)', marginBottom: '1.25rem', fontFamily: 'DM Sans,sans-serif' }}>
          Full Stack Developer · MERN · Bengaluru
        </p>
        <h1 ref={titleRef} style={{
          fontFamily: 'Clash Display,DM Sans,sans-serif',
          fontSize: 'clamp(4rem,13vw,12rem)', fontWeight: 700,
          lineHeight: 0.88, letterSpacing: '-0.03em', color: '#F0EDE6',
          willChange: 'transform,opacity',
        }}>
          RAGURAM <span style={{ color: '#E8FF47' }}>R.</span>
        </h1>
        <p ref={subRef} style={{ marginTop: '1.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)', fontFamily: 'DM Sans,sans-serif' }}>
          React · Node · MongoDB · AWS · Docker
        </p>
        <div ref={ctaRef} style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <HoverBtn onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} outline>View Work</HoverBtn>
          <HoverBtn onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Hire Me</HoverBtn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndRef} style={{
        position: 'absolute', right: 'clamp(1rem,2.5vw,2rem)', bottom: 40, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(240,237,230,0.3)',
      }}>
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: 'rgba(240,237,230,0.15)' }} />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 0v10M0 5l5 5 5-5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </section>
  )
}

function HoverBtn({ children, onClick, outline }) {
  const btnRef  = useRef(null)
  const fillRef = useRef(null)
  return (
    <button ref={btnRef} onClick={onClick}
      onMouseEnter={() => outline ? gsap.to(fillRef.current, { yPercent: 0, duration: 0.28, ease: 'power3.out' }) : gsap.to(btnRef.current, { filter: 'brightness(0.85)', duration: 0.2 })}
      onMouseLeave={() => outline ? gsap.to(fillRef.current, { yPercent: 101, duration: 0.32, ease: 'power3.out' }) : gsap.to(btnRef.current, { filter: 'brightness(1)', duration: 0.2 })}
      style={{
        position: 'relative', overflow: 'hidden', padding: '0.85rem 1.75rem', cursor: 'none',
        fontFamily: 'Clash Display,DM Sans,sans-serif', fontWeight: 600, fontSize: '0.7rem',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        border: outline ? '1px solid rgba(240,237,230,0.6)' : 'none',
        background: outline ? 'transparent' : '#E8FF47',
        color: outline ? '#F0EDE6' : '#0A0A0F',
      }}>
      {outline && <span ref={fillRef} style={{ position: 'absolute', inset: 0, background: '#E8FF47', transform: 'translateY(101%)', zIndex: 0 }} />}
      <span style={{ position: 'relative', zIndex: 1, color: outline ? undefined : '#0A0A0F' }}>{children}</span>
    </button>
  )
}
