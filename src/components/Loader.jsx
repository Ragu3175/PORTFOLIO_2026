import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const lettersRef = useRef([])
  const barRef = useRef(null)
  const dotRef = useRef(null)

  const letters = ['R', 'A', 'G', 'U', 'R', 'A', 'M']

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete()
        }
      })

      // Set initial state
      gsap.set(lettersRef.current, { y: 40, opacity: 0, clipPath: 'inset(0 100% 0 0)' })
      gsap.set(dotRef.current, { opacity: 0, scale: 0 })
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })

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

      // Progress bar fills
      .to(barRef.current, {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.inOut'
      }, '-=0.1')

      // Loader slides UP off screen
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 0.7,
        ease: 'power3.inOut',
        delay: 0.2
      })

    }, loaderRef)

    return () => ctx.revert()
  }, [])

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
        gap: '2rem'
      }}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        {letters.map((l, i) => (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 800,
              color: '#F0EDE6',
              letterSpacing: '0.15em',
              display: 'inline-block'
            }}
          >
            {l}
          </span>
        ))}
        <span
          ref={dotRef}
          style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 800,
            color: '#E8FF47',
            letterSpacing: '0.15em',
            display: 'inline-block',
            marginLeft: '4px'
          }}
        >
          .R
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ width: '200px', height: '1px', background: '#1a1a22' }}>
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: '#E8FF47',
            transformOrigin: 'left center'
          }}
        />
      </div>
    </div>
  )
}
