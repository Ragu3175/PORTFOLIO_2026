import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

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
    <section ref={sectionRef} id="about" className={styles.container}>
      {/* Immersive Zoom Number */}
      <div ref={zoomNumRef} className={styles.zoomNumber}>
        03
      </div>

      <div className={styles.mainGrid}>
        {/* =========================================
            LEFT COLUMN: Sticky Biographical Section
            ========================================= */}
        <div className={styles.leftCol}>
          <div className={styles.labelWrapper}>
            <span className="section-label">03 · About</span>
            <div className={styles.labelLine} />
          </div>

          <div className={styles.photoWrapper}>
            <div ref={photoRef} className={styles.photoFilter}>
              <img src="/Profile.png" alt="Raguram R" className={styles.profileImg} />
            </div>
            <div className={styles.photoOverlayText}>
              RAGURAM R / CBE
            </div>
          </div>

          <div className={styles.bioTextWrapper}>
            <p className={styles.headline}>
              Full-stack developer specialising in the MERN stack and high-fidelity interfaces.
            </p>
            <p className={styles.subtext}>
              I build performant web apps that ship on time, scale when needed, and hold up in production. Focus is on robust architecture wrapped in cinematic UI.
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: Sequenced Absolute Cards
            ========================================= */}
        <div ref={rightColRef} className={styles.rightCol}>

          {/* Card 1: Timeline Log */}
          <div ref={card1Ref} className={styles.card}>
            <div className={styles.bentoContent}>
              <h3 className={styles.bentoTitle}>
                Journey Log
              </h3>
              <div className={styles.timelineWrapper}>
                <svg width="4" height="100%" className={styles.timelinePath} fill="none">
                   <path d="M 2 0 L 2 1000" stroke="var(--surface)" strokeWidth="2" opacity="0.3" />
                   <path ref={svgPathRef} d="M 2 0 L 2 1000" stroke="var(--lime)" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {[
                  { year: '2020', title: 'B.E. Electronics & Comm.', desc: 'KIT Coimbatore. Foundation in systems thinking and engineering principles.' },
                  { year: '2023', title: 'MERN Stack Certification', desc: 'Heavy transition into full-stack web architecture with Novi Tech.' },
                  { year: '2024', title: 'First Deployed Product', desc: 'Shipped and scaled initial application architecture to live users.' }
                ].map((item, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.yearText}>{item.year}</div>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemDesc}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Philosophy Quote */}
          <div ref={card2Ref} className={styles.card}>
            <div className={styles.philosophyContent}>
              <div className={styles.quoteMark}>"</div>
              <h2 className={styles.quoteText}>
                I don't just write code.<br />
                <span style={{ color: 'var(--lime)' }}>I build experiences.</span>
              </h2>
            </div>
          </div>

          {/* Card 3: Performance Metrics */}
          <div ref={card3Ref} className={styles.card}>
            <div className={styles.metricsContent}>
              <h3 className={styles.bentoTitle}>
                Metrics
              </h3>
              <div className={styles.metricsGrid}>
                {STATS.map((stat, i) => (
                  <div key={i} ref={el => statsRefs.current[i] = el}>
                    <span className={styles.metricValue}>
                      <span className="stat-num">0</span>
                      <span className={styles.metricSuffix}>{stat.suffix}</span>
                    </span>
                    <p className={styles.metricLabel}>
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
  )
}
