import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// About sits over shot1→shot2 transition (frames ~120-480)
// Canvas is global — this section just provides text + its own overlay

const HEADLINE_WORDS = ['I', 'BUILD', 'FAST.', 'I', 'SHIP', 'CLEAN.', 'I', 'MAKE', 'IT', 'WORK.']
const STATS = [
  { value: 5,   suffix: '+', label: 'Projects Shipped' },
  { value: 7.8, suffix: '',  label: 'CGPA · KIT CBE'   },
  { value: 2,   suffix: '+', label: 'Certifications'   },
]

export default function About() {
  const sectionRef  = useRef(null)
  const wordsRef    = useRef([])
  const bioRef      = useRef(null)
  const statsRef    = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Word-by-word scrub as section scrolls through
      gsap.set(wordsRef.current.filter(Boolean), { color: '#3A3A3A', opacity: 0.2 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'center 20%',
        scrub: 1,
        onUpdate: (self) => {
          const total = wordsRef.current.length
          wordsRef.current.forEach((word, i) => {
            if (!word) return
            const wp = Math.max(0, Math.min(1, (self.progress - i / total) * total))
            word.style.color   = wp > 0.5 ? '#F0EDE6' : `rgba(90,90,90,${0.2 + wp * 0.6})`
            word.style.opacity = String(0.2 + wp * 0.8)
          })
        },
      })

      // Bio slide up
      gsap.fromTo(bioRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: bioRef.current, start: 'top 82%', toggleActions: 'play none none reverse' } }
      )

      // Stats — each counts up on enter
      statsRef.current.forEach((el, i) => {
        if (!el) return
        const numEl = el.querySelector('.stat-num')
        const target = STATS[i].value
        const isFloat = !Number.isInteger(target)
        ScrollTrigger.create({
          trigger: el, start: 'top 85%', once: true,
          onEnter: () => {
            const obj = { val: 0 }
            gsap.to(obj, {
              val: target, duration: 1.6, ease: 'power2.out',
              onUpdate() { numEl.textContent = isFloat ? obj.val.toFixed(1) : Math.round(obj.val) },
            })
          },
        })
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" style={{
      position: 'relative', width: '100%',
      minHeight: '160vh',
      padding: '10rem clamp(1.5rem,6vw,6rem)',
    }}>
      {/* Per-section overlay — slightly darker than hero for readability */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(10,10,15,0.82) 0%, rgba(10,10,15,0.4) 60%, rgba(10,10,15,0.1) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '4rem' }}>
          <span className="section-label">02 · About</span>
          <div style={{ width: 50, height: 1, background: '#3A3A3A' }} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'Clash Display,DM Sans,sans-serif',
          fontSize: 'clamp(2.2rem,5.5vw,5.5rem)', fontWeight: 700,
          lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '18ch',
        }}>
          {HEADLINE_WORDS.map((word, i) => (
            <span key={i} ref={el => wordsRef.current[i] = el}
              style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'color,opacity' }}
            >{word}</span>
          ))}
        </h2>

        {/* Bio + stats */}
        <div ref={bioRef} style={{
          marginTop: '5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: '4rem', alignItems: 'start',
        }}>
          <div>
            <p style={{ color: 'rgba(240,237,230,0.65)', fontSize: 'clamp(0.88rem,1.2vw,1.05rem)', lineHeight: 1.8, fontFamily: 'DM Sans,sans-serif' }}>
              Full-stack developer from Coimbatore, specialising in the MERN stack.
              I build performant web apps that ship on time, scale when needed, and hold up in production.
            </p>
            <p style={{ marginTop: '1rem', color: 'rgba(240,237,230,0.38)', fontSize: 'clamp(0.82rem,1.1vw,0.95rem)', lineHeight: 1.75, fontFamily: 'DM Sans,sans-serif' }}>
              Certified in MERN Stack &amp; React.js via Novi Tech.
              Targeting full-stack roles in Bengaluru, Chennai &amp; Hyderabad.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'ragu317317@gmail.com', href: 'mailto:ragu317317@gmail.com' },
                { label: 'github.com/Ragu3175',  href: 'https://github.com/Ragu3175'  },
              ].map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer"
                  style={{ fontSize: '0.8rem', fontFamily: 'Clash Display,sans-serif', letterSpacing: '0.04em', color: 'rgba(240,237,230,0.38)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => e.target.style.color = '#E8FF47'}
                  onMouseLeave={e => e.target.style.color = 'rgba(240,237,230,0.38)'}
                >{link.label} ↗</a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {STATS.map((stat, i) => (
              <div key={i} ref={el => statsRef.current[i] = el}
                style={{ borderTop: '1px solid #3A3A3A', paddingTop: '1.5rem' }}>
                <span style={{ fontFamily: 'Clash Display,DM Sans,sans-serif', fontSize: 'clamp(3rem,8vw,5.5rem)', fontWeight: 700, lineHeight: 1, color: '#F0EDE6', display: 'block' }}>
                  <span className="stat-num">0</span>
                  <span style={{ color: '#E8FF47' }}>{stat.suffix}</span>
                </span>
                <p style={{ marginTop: 6, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.32)', fontFamily: 'DM Sans,sans-serif' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right lime edge */}
      <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 1, height: '35%', background: 'linear-gradient(to bottom,transparent,#E8FF47,transparent)', pointerEvents: 'none' }} />
    </section>
  )
}
