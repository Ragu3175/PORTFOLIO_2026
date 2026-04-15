import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ onVideoReady }) {
  const [isMobile, setIsMobile] = useState(false)
  const [framesLoaded, setFramesLoaded] = useState(false)
  
  const sectionRef   = useRef(null)
  const videoRef     = useRef(null)
  const canvasRef    = useRef(null)
  const contextRef   = useRef(null)
  const framesRef    = useRef([])
  const overlayRef   = useRef(null)
  const eyebrowRef   = useRef(null)
  const titleRef     = useRef(null)
  const subRef       = useRef(null)
  const ctaRef       = useRef(null)
  const scrollIndRef = useRef(null)

  const TOTAL_FRAMES = 240
  const loopRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return

    let loadedCount = 0
    const frames = []

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/hero_frames/frame_${String(i).padStart(4, '0')}.webp`
      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) {
          setFramesLoaded(true)
          if (onVideoReady) onVideoReady()
        }
      }
      img.onerror = () => {
        console.error(`Failed to load frame ${i}`)
        loadedCount++
      }
      frames.push(img)
    }
    framesRef.current = frames
  }, [isMobile, onVideoReady])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, titleRef.current, subRef.current, ctaRef.current], {
        opacity: 0, y: 40,
      })
      gsap.timeline({ delay: 0 })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        .to(titleRef.current,   { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.65')
        .to(subRef.current,     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to(ctaRef.current,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          if (overlayRef.current) overlayRef.current.style.opacity = String(0.45 + p * 0.3)

          const target = isMobile ? videoRef.current : canvasRef.current
          if (target) {
            let scale = 1;
            if (p < 0.7) {
              scale = 1 + (p / 0.7) * 0.08;
            } else {
              const collapseProgress = (p - 0.7) / 0.3;
              scale = 1.08 * (1 - collapseProgress);
            }
            gsap.set(target, { scale: scale });
          }

          const contentOpacity = p > 0.8 ? 1 - ((p - 0.8) / 0.2) : 1;
          gsap.set([titleRef.current, eyebrowRef.current, subRef.current, ctaRef.current], {
            opacity: contentOpacity
          });

          gsap.set(titleRef.current,   { y: p * -70 })
          gsap.set(eyebrowRef.current, { y: p * -45 })
          gsap.set(subRef.current,     { y: p * -35 })
          gsap.set(ctaRef.current,     { y: p * -25 })
        },
      })

      if (!isMobile && canvasRef.current) {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        contextRef.current = context

        const updateCanvasSize = () => {
          const dpr = window.devicePixelRatio || 1
          canvas.width = window.innerWidth * dpr
          canvas.height = window.innerHeight * dpr
        }
        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)

        const render = (index) => {
          const img = framesRef.current[index]
          if (!img || !img.complete) return

          const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
          const x = (canvas.width / 2) - (img.width / 2) * scale
          const y = (canvas.height / 2) - (img.height / 2) * scale
          
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, x, y, img.width * scale, img.height * scale)
        }

        render(0)
        gsap.to(canvas, { opacity: 1, duration: 0.4, ease: 'power2.out' })

        const playHead = { frame: 0 }
        loopRef.current = gsap.to(playHead, {
          frame: TOTAL_FRAMES - 1,
          duration: 8,
          repeat: -1,
          ease: 'none',
          onUpdate: () => render(Math.round(playHead.frame))
        })

        return () => window.removeEventListener('resize', updateCanvasSize)
      }

      gsap.to(scrollIndRef.current, {
        opacity: 0.08, y: 10,
        repeat: -1, yoyo: true, duration: 1.5, ease: 'power1.inOut',
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile, framesLoaded])

  const mediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
    willChange: 'transform',
  }

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
      {isMobile ? (
        <video
          ref={videoRef}
          src="/Mobile_view.mp4"
          autoPlay muted loop playsInline preload="auto"
          onCanPlayThrough={() => onVideoReady && onVideoReady()}
          style={mediaStyle}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className={mediaStyle}
          style={{ objectFit: 'cover', opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, willChange: 'transform' }}
        />
      )}

      <div className={styles.watermarkCover} />

      <div ref={overlayRef} className={styles.overlay} />

      <div className={styles.gridLines} />

      <nav className={styles.nav}>
        {['Work', 'About', 'Contact'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className={styles.navLink}>{item}</a>
        ))}
      </nav>

      <div className={styles.logoContainer}>
        <span className={styles.logo}>
          RR<span className={styles.logoDot}>.</span>
        </span>
      </div>

      <div className={styles.content}>
        <p ref={eyebrowRef} className={styles.eyebrow} style={{ opacity: 0 }}>
          Full Stack Developer · MERN · Bengaluru
        </p>
        <h1 ref={titleRef} className={styles.title} style={{ opacity: 0 }}>
          RAGURAM <span className={styles.titleDot}>R.</span>
        </h1>
        <p ref={subRef} className={styles.subtitle} style={{ opacity: 0 }}>
          React · Node · MongoDB · AWS · Docker
        </p>
        <div ref={ctaRef} className={styles.ctaContainer} style={{ opacity: 0 }}>
          <HoverBtn onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} outline>View Work</HoverBtn>
          <HoverBtn onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Hire Me</HoverBtn>
        </div>
      </div>

      <div ref={scrollIndRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
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
      className={`${styles.hoverBtn} ${outline ? styles.hoverBtnOutline : styles.hoverBtnSolid}`}
    >
      {outline && <span ref={fillRef} className={styles.btnFill} />}
      <span className={styles.btnText}>{children}</span>
    </button>
  )
}
