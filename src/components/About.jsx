import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 5,   suffix: '+', label: 'Projects Shipped' },
  { value: 7.8, suffix: '',  label: 'CGPA · KIT CBE'   },
  { value: 2,   suffix: '+', label: 'Certifications'   },
  { value: 1,   suffix: '',  label: 'Deployed Product' }
];

export default function About() {
  const sectionRef = useRef(null);
  const zoomNumRef = useRef(null);
  const photoRef   = useRef(null);
  const rightColRef = useRef(null);
  const svgPathRef = useRef(null);
  
  const card1Ref = useRef(null); // Journey Card
  const card2Ref = useRef(null); // Philosophy Card
  const card3Ref = useRef(null); // Metrics Card
  const statsRefs = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Immersive Zoom "03"
      gsap.fromTo(zoomNumRef.current,
        { scale: 4, opacity: 0.06 },
        {
          scale: 1,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          }
        }
      );

      // 2. Image Mask Camera Iris Reveal
      gsap.fromTo(photoRef.current,
        { clipPath: 'circle(0% at 50% 50%)', filter: 'brightness(0) grayscale(1)' },
        {
          clipPath: 'circle(50% at 50% 50%)',
          filter: 'brightness(1) grayscale(0)',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top top',
            scrub: true,
          }
        }
      );

      // 3. Pinning and the Sequenced Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%', // 400vh for 3 cards mapping
          pin: true,
          scrub: true,
          anticipatePin: 1
        }
      });

      // SVG Line initial state
      if (svgPathRef.current) {
        const length = svgPathRef.current.getTotalLength() || 1000;
        gsap.set(svgPathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      }
      
      const statsObj = { val: 0 };
      
      // ====== MASTER SCRUB TIMELINE ====== //

      // Card 1 (Journey Log) Enters (Now first card)
      tl.fromTo(card1Ref.current, 
        { opacity: 0, scale: 0.9, y: 80 }, 
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'power2.out' }
      )
      // SVG Draws while Card 1 is visible
      if (svgPathRef.current) {
        tl.to(svgPathRef.current, { strokeDashoffset: 0, duration: 4, ease: 'none' });
      } else {
        tl.to({}, { duration: 4 });
      }
      // Card 1 Exits
      tl.to(card1Ref.current, { opacity: 0, y: -80, scale: 0.95, duration: 1.8, ease: 'power2.in' })
      
      // Card 2 (Philosophy) Enters
      tl.fromTo(card2Ref.current, 
        { opacity: 0, scale: 0.85, rotateX: -15, y: 80 },
        { opacity: 1, scale: 1, rotateX: 0, y: 0, duration: 2, ease: 'power3.out' }
      )
      .to({}, { duration: 3 })
      .to(card2Ref.current, { opacity: 0, y: -80, scale: 0.95, duration: 1.8, ease: 'power2.in' })

      // Card 3 (Metrics) Enters
      tl.fromTo(card3Ref.current,
        { opacity: 0, scale: 0.9, y: 80 },
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'power2.out' }
      )
      tl.to(statsObj, {
        val: 1,
        duration: 4,
        ease: 'none',
        onUpdate: () => {
          statsRefs.current.forEach((el, i) => {
            if (!el) return;
            const numEl = el.querySelector('.stat-num');
            if (numEl) {
              const target = STATS[i].value;
              const isFloat = !Number.isInteger(target);
              const currentVal = target * statsObj.val;
              numEl.textContent = isFloat ? currentVal.toFixed(1) : Math.round(currentVal);
            }
          });
        }
      });
      tl.to({}, { duration: 1.5 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cardStyle = {
    position: 'absolute',
    top: 0, left: 0, width: '100%',
    opacity: 0,
    willChange: 'transform, opacity'
  };

  return (
    <section ref={sectionRef} id="about" style={{
      position: 'relative', width: '100%', height: '100vh',
      background: 'var(--bg)', color: 'var(--cream)',
      padding: '0 clamp(1.5rem,6vw,6rem)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }}>
      {/* Immersive Zoom Number */}
      <div ref={zoomNumRef} style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(25rem, 50vw, 50rem)', fontWeight: 900, color: 'var(--surface)',
        zIndex: 0, pointerEvents: 'none', fontFamily: 'var(--font-display)', lineHeight: 0.8,
        transformOrigin: 'center center'
      }}>
        03
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)', gap: '6rem',
        position: 'relative', zIndex: 2, alignItems: 'center'
      }}>
        {/* =========================================
            LEFT COLUMN: Sticky Biographical Section
            ========================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <span className="section-label">03 · About</span>
            <div style={{ width: 80, height: 1, background: 'var(--lime)' }} />
          </div>

          <div style={{
            position: 'relative', width: '100%', maxWidth: '280px', aspectRatio: '1/1',
            borderRadius: '50%', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
          }}>
            <div ref={photoRef} style={{
              width: '100%', height: '100%', background: '#0A0A0F',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img src="/Profile.png" alt="Raguram R" style={{
                width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)'
              }} />
            </div>
            <div style={{
              position: 'absolute', bottom: '10%', width: '100%', textAlign: 'center',
              fontSize: '0.65rem', color: 'var(--lime)', fontWeight: 700, letterSpacing: '0.3em',
              zIndex: 10, textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              RAGURAM R / CBE
            </div>
          </div>

          <div style={{ maxWidth: '440px' }}>
            <p style={{
              color: 'var(--cream)', fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', lineHeight: 1.25,
              fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.5rem'
            }}>
              Full-stack developer specialising in the MERN stack and high-fidelity interfaces.
            </p>
            <p style={{
              color: 'rgba(240,237,230,0.6)', fontSize: '1.05rem', lineHeight: 1.8,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              I build performant web apps that ship on time, scale when needed, and hold up in production. Focus is on robust architecture wrapped in cinematic UI.
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: Sequenced Absolute Cards
            ========================================= */}
        <div ref={rightColRef} style={{ position: 'relative', minHeight: '650px', width: '100%', perspective: '1200px' }}>

          {/* Card 1: Timeline Log */}
          <div ref={card1Ref} style={{ ...cardStyle }}>
            <div style={{
              background: 'rgba(26,26,34,0.4)', padding: '5rem 4rem', borderRadius: '24px',
              border: '1px solid rgba(232,255,71,0.08)', backdropFilter: 'blur(12px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3rem', color: 'var(--lime)' }}>
                Journey Log
              </h3>
              <div style={{ position: 'relative', paddingLeft: '3.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                <svg width="4" height="100%" style={{ position: 'absolute', left: '0', top: 0 }} fill="none">
                   <path d="M 2 0 L 2 1000" stroke="var(--surface)" strokeWidth="2" opacity="0.3" />
                   <path ref={svgPathRef} d="M 2 0 L 2 1000" stroke="var(--lime)" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {[
                  { year: '2020', title: 'B.E. Electronics & Comm.', desc: 'KIT Coimbatore. Foundation in systems thinking and engineering principles.' },
                  { year: '2023', title: 'MERN Stack Certification', desc: 'Heavy transition into full-stack web architecture with Novi Tech.' },
                  { year: '2024', title: 'First Deployed Product', desc: 'Shipped and scaled initial application architecture to live users.' }
                ].map((item, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-3.8rem', top: 4, width: 14, height: 14, borderRadius: '50%', background: 'var(--bg)', border: '3px solid var(--lime)', boxShadow: '0 0 15px rgba(232,255,71,0.4)' }} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--lime)', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '0.5rem' }}>{item.year}</div>
                    <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--cream)', marginBottom: '0.5rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(240,237,230,0.5)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Philosophy Quote */}
          <div ref={card2Ref} style={{ ...cardStyle }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(232,255,71,0.1) 0%, rgba(10,10,15,0.9) 100%)',
              padding: '7rem 5rem', borderRadius: '24px', border: '1px solid rgba(232,255,71,0.2)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -30, left: -20, fontSize: '18rem', color: 'rgba(232,255,71,0.06)', fontFamily: 'var(--font-display)', lineHeight: 0.7 }}>"</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 3.5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, position: 'relative', zIndex: 2 }}>
                I don't just write code.<br />
                <span style={{ color: 'var(--lime)' }}>I build experiences.</span>
              </h2>
            </div>
          </div>

          {/* Card 3: Performance Metrics */}
          <div ref={card3Ref} style={{ ...cardStyle }}>
            <div style={{
              background: 'rgba(26,26,34,0.4)', padding: '5rem 4rem', borderRadius: '24px',
              border: '1px solid var(--surface)', backdropFilter: 'blur(12px)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4rem', color: 'var(--lime)' }}>
                Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                {STATS.map((stat, i) => (
                  <div key={i} ref={el => statsRefs.current[i] = el}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 5vw, 5.5rem)', fontWeight: 700, color: 'var(--cream)', display: 'block', lineHeight: 1, marginBottom: '0.5rem' }}>
                      <span className="stat-num">0</span>
                      <span style={{ color: 'var(--lime)', fontSize: '0.7em' }}>{stat.suffix}</span>
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(240,237,230,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
