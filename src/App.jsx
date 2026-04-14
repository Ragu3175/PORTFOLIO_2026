import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './styles/global.css'

import Loader from './components/Loader'
import Hero from './components/Hero'
import IdentityBreak from './components/IdentityBreak'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Process from './components/Process'
import Credibility from './components/Credibility'
import Contact from './components/Contact'
import SceneTransitions from './components/SceneTransitions'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const lenisRef = useRef(null)

  // ── Reveal Root after React is ready ──
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      // Small delay to ensure the browser has parsed the initial invisible state
      requestAnimationFrame(() => {
        root.classList.add('loaded')
      })
    }
  }, [])

  // ── Lenis smooth scroll ──
  useEffect(() => {
    if (!loaderDone) {
      document.body.style.overflow = 'hidden'
      return
    }
    
    document.body.style.overflow = ''

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1
    })
    lenisRef.current = lenis
    
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    
    lenis.on('scroll', () => ScrollTrigger.update())
    
    // ── Global ScrollTrigger Refresh Orchestration ──
    const refreshTrigger = () => {
      ScrollTrigger.refresh(true);
    };

    const t1 = setTimeout(refreshTrigger, 500);
    const t2 = setTimeout(refreshTrigger, 1500);
    
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [loaderDone])

  return (
    <>
      {/* ── Grain overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        pointerEvents: 'none', opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* ── Custom cursor ── */}
      <Cursor />

      {/* ── Loader ── */}
      <Loader isReady={isVideoLoaded} onComplete={() => setLoaderDone(true)} />

      {/* ── Main content ── */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        opacity: loaderDone ? 1 : 0,
        visibility: loaderDone ? 'visible' : 'hidden',
        pointerEvents: loaderDone ? 'auto' : 'none',
        background: 'var(--bg)',
        transition: 'opacity 0.8s ease, visibility 0.8s ease',
        display: 'block', // Ensuring block for clean vertical flow
        width: '100%',
        overflow: 'visible'
      }}>
        <Hero onVideoReady={() => setIsVideoLoaded(true)} />
        <IdentityBreak />
        <About />
        <Skills />
        <Process />
        <Projects />
        <Credibility />
        <Contact />
      </main>

      {/* Global Transitions */}
      {loaderDone && <SceneTransitions />}
    </>
  )
}

/* ── Cursor ── */
function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    const text = textRef.current
    if (!dot || !ring) return

    const onMove  = (e) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.32, ease: 'power3.out' })
      gsap.to(text, { x: e.clientX, y: e.clientY, duration: 0.32, ease: 'power3.out' })
    }
    const onEnter = (e) => {
      const el = e.currentTarget
      const isView = el.hasAttribute('data-cursor-text')
      
      if (isView) {
        gsap.to(ring, { scale: 3.5, borderColor: 'var(--lime)', duration: 0.4, ease: 'back.out(1.7)' })
        gsap.to(dot,  { scale: 0,   duration: 0.2 })
        gsap.to(text, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1 })
      } else {
        gsap.to(ring, { scale: 2.2, borderColor: '#E8FF47', duration: 0.3 })
        gsap.to(dot,  { scale: 0,   duration: 0.2 })
      }
    }
    const onLeave = () => {
      gsap.to(ring, { scale: 1,   borderColor: 'rgba(240,237,230,0.35)', duration: 0.3 })
      gsap.to(dot,  { scale: 1,   duration: 0.2 })
      gsap.to(text, { opacity: 0, scale: 0, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove)
    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor], [data-cursor-text]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attach()
    const obs = new MutationObserver(attach)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => { window.removeEventListener('mousemove', onMove); obs.disconnect() }
  }, [])

  const base = {
    position: 'fixed', top: 0, left: 0,
    borderRadius: '50%', pointerEvents: 'none',
    transform: 'translate(-50%,-50%)', willChange: 'transform',
  }
  return (
    <>
      <div ref={dotRef}  style={{ ...base, width: 6,  height: 6,  background: '#E8FF47', zIndex: 9997 }} />
      <div ref={ringRef} style={{ ...base, width: 36, height: 36, border: '1px solid rgba(240,237,230,0.35)', zIndex: 9996 }} />
      <div ref={textRef} style={{
        ...base,
        zIndex: 9998,
        opacity: 0,
        scale: 0,
        color: 'var(--lime)',
        fontSize: '0.65rem',
        fontWeight: 800,
        fontFamily: 'DM Sans, sans-serif',
        pointerEvents: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        textAlign: 'center'
      }}>
        VIEW
      </div>
    </>
  )
}
