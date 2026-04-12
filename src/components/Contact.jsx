import { useEffect, useRef } from 'react'
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
  const emailWrapRef = useRef(null)
  const emailLineRef = useRef(null)
  const linksRef     = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Set initial hidden state
      gsap.set([word1Ref.current, word2Ref.current, word3Ref.current], { opacity: 0, y: 70 })
      gsap.set(emailWrapRef.current, { opacity: 0 })
      gsap.set(emailLineRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(linksRef.current.filter(Boolean), { opacity: 0, y: 24 })

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
        .to(emailWrapRef.current, { opacity: 1, duration: 0.5 }, '-=0.2')
        .to(emailLineRef.current, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }, '-=0.4')
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
      }}
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '5rem' }}>
        <span className="section-label">05 · Contact</span>
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

      {/* Email */}
      <div ref={emailWrapRef} style={{ marginTop: '4rem', display: 'inline-block', position: 'relative' }}>
        <a
          href="mailto:ragu317317@gmail.com"
          data-mag
          style={{
            display: 'block',
            fontFamily: 'Clash Display, DM Sans, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1rem, 2.5vw, 2rem)',
            letterSpacing: '-0.01em',
            color: 'var(--cream)',
            textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--lime)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--cream)'}
        >
          ragu317317@gmail.com
        </a>
        <div
          ref={emailLineRef}
          style={{
            position: 'absolute', bottom: -4, left: 0,
            width: '100%', height: 1,
            background: 'var(--lime)',
          }}
        />
      </div>

      {/* Links row */}
      <div style={{ marginTop: '5rem', display: 'flex', flexWrap: 'wrap', gap: '3rem 4rem' }}>
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
        marginTop: '8rem', paddingTop: '2rem',
        borderTop: '1px solid var(--surface)',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.18)', fontFamily: 'DM Sans, sans-serif' }}>
          Raguram R · Full Stack Developer · 2025
        </span>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.18)', fontFamily: 'DM Sans, sans-serif' }}>
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
    </section>
  )
}
