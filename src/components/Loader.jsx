import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ isReady, onComplete }) {
  const loaderRef = useRef(null)
  const lettersRef = useRef([])
  const barRef = useRef(null)
  const dotRef = useRef(null)
  const statusRef = useRef(null)
  const tlRef = useRef(null)
  const [showStatus, setShowStatus] = useState(false)

  const letters = ['R', 'A', 'G', 'U', 'R', 'A', 'M']

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete()
        }
      })
      tlRef.current = tl

      // Set initial state
      gsap.set(lettersRef.current, { y: 40, opacity: 0, clipPath: 'inset(0 100% 0 0)' })
      gsap.set(dotRef.current, { opacity: 0, scale: 0 })
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(statusRef.current, { opacity: 0 })

      // Letters wipe in L→R
      tl.to(lettersRef.current, {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out'
      })

      // .R snaps in lime
      .to(dotRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(2)'
      }, '-=0.1')

      // Progress bar fills to 90%
      .to(barRef.current, {
        scaleX: 0.9,
        duration: 2.5,
        ease: 'power2.out'
      }, '-=0.1')
      
      .addLabel('optimized')

      // Waiting logic will happen in the other useEffect
      tl.pause()

    }, loaderRef)

    // Show status message if it takes too long
    const timer = setTimeout(() => setShowStatus(true), 3000)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (isReady && tlRef.current) {
      const tl = tlRef.current
      
      // If we are at the pause point, finish it
      tl.to(barRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power4.inOut'
      })
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      })
      .play()
    }
  }, [isReady])

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0F',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem'
      }}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        {letters.map((l, i) => (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              color: '#F0EDE6',
              letterSpacing: '0.15em',
              display: 'inline-block',
              fontFamily: 'Clash Display, DM Sans, sans-serif'
            }}
          >
            {l}
          </span>
        ))}
        <span
          ref={dotRef}
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 800,
            color: '#E8FF47',
            letterSpacing: '0.15em',
            display: 'inline-block',
            marginLeft: '4px',
            fontFamily: 'Clash Display, DM Sans, sans-serif'
          }}
        >
          .R
        </span>
      </div>

      {/* Progress container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '260px', height: '1px', background: 'rgba(232,255,71,0.1)' }}>
          <div
            ref={barRef}
            style={{
              width: '100%',
              height: '100%',
              background: '#E8FF47',
              transformOrigin: 'left center',
              boxShadow: '0 0 15px rgba(232,255,71,0.3)'
            }}
          />
        </div>
        
        {/* Status message */}
        <div 
          style={{ 
            height: '12px',
            opacity: showStatus ? 1 : 0,
            transition: 'opacity 0.5s ease',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(240,237,230,0.3)',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          {isReady ? 'System Ready' : 'Optimizing Assets...'}
        </div>
      </div>
    </div>
  )
}
