import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IdentityBreak() {
  const containerRef = useRef(null);
  const builderRef = useRef(null);
  const builderDot = useRef(null);
  const shipperRef = useRef(null);
  const shipperDot = useRef(null);
  const psWord1 = useRef(null);
  const psWord2 = useRef(null);
  const psDot = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: 'top top',
          end: '+=150%', // 150vh locked scroll depth
          scrub: 1,
        }
      });

      // 1. BUILDER Wipe right -> left (carving out of darkness)
      // Spec: hidden behind clip-path: inset(0 100% 0 0)
      gsap.set([builderRef.current, shipperRef.current, psWord1.current, psWord2.current], { filter: 'blur(20px)' });

      tl.to(builderRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 2
      })
      // 2. BUILDER DOT snap
      .to(builderDot.current, {
        scale: 1,
        color: '#E8FF47',
        ease: 'back.out(1.7)',
        duration: 0.5
      }, "-=0.2")

      // 3. SHIPPER Wipe bottom -> upward
      .to(shipperRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 2
      })
      // 4. SHIPPER DOT snap
      .to(shipperDot.current, {
        scale: 1,
        color: '#E8FF47',
        ease: 'back.out(1.7)',
        duration: 0.5
      }, "-=0.2")

      // 5. PROBLEM SOLVER Words (0.1s stagger)
      .to(psWord1.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 1.5
      })
      .to(psWord2.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 1.5
      }, "-=1.4") // exactly 0.1s stagger for duration 1.5
      // 6. PROBLEM SOLVER DOT snap
      .to(psDot.current, {
        scale: 1,
        color: '#E8FF47',
        ease: 'back.out(1.7)',
        duration: 0.5
      }, "-=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="identity-break"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Inline styles for guaranteed keyframe application */}
      <style>{`
        @keyframes identityGridPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.2; }
        }
        @keyframes drift1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15vw, 15vh) scale(1.2); }
          100% { transform: translate(-10vw, 5vh) scale(0.9); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15vw, -15vh) scale(1.1); }
          100% { transform: translate(5vw, -20vh) scale(1); }
        }
      `}</style>

      {/* Cool Background Motion Drifting Orbs */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 60%)',
          top: '-10%', left: '-10%', borderRadius: '50%', filter: 'blur(80px)', mixBlendMode: 'screen',
          animation: 'drift1 20s ease-in-out infinite alternate'
        }} />
        <div style={{
          position: 'absolute', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(240,237,230,0.03) 0%, transparent 60%)',
          bottom: '-10%', right: '-10%', borderRadius: '50%', filter: 'blur(60px)', mixBlendMode: 'screen',
          animation: 'drift2 25s ease-in-out infinite alternate-reverse'
        }} />
      </div>

      {/* Faint animated grid lines pulse */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundImage: 'linear-gradient(rgba(240, 237, 230, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 237, 230, 0.15) 1px, transparent 1px)',
        backgroundSize: '5vw 5vw',
        pointerEvents: 'none',
        animation: 'identityGridPulse 4s ease-in-out infinite'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        fontSize: 'clamp(3rem, 8vw, 8rem)',
        fontWeight: 'bold',
        lineHeight: '1.1',
        fontFamily: 'var(--font-display)',
        letterSpacing: '-0.02em'
      }}>
        {/* BUILDER. */}
        <div style={{ marginBottom: '1rem' }}>
          <span ref={builderRef} style={{ display: 'inline-block', clipPath: 'inset(0% 100% 0% 0%)', color: 'var(--cream)' }}>
            BUILDER
          </span>
          <span ref={builderDot} style={{ display: 'inline-block', color: 'var(--surface)', transform: 'scale(1.4)' }}>.</span>
        </div>

        {/* SHIPPER. */}
        <div style={{ marginBottom: '1rem' }}>
          <span ref={shipperRef} style={{ display: 'inline-block', clipPath: 'inset(100% 0% 0% 0%)', color: 'var(--cream)' }}>
            SHIPPER
          </span>
          <span ref={shipperDot} style={{ display: 'inline-block', color: 'var(--surface)', transform: 'scale(1.4)' }}>.</span>
        </div>

        {/* PROBLEM SOLVER. */}
        <div style={{ display: 'flex', gap: '0.4em', justifyContent: 'center' }}>
          <span ref={psWord1} style={{ display: 'inline-block', clipPath: 'inset(0% 100% 0% 0%)', color: 'var(--cream)' }}>
            PROBLEM
          </span>
          <span ref={psWord2} style={{ display: 'inline-block', clipPath: 'inset(0% 100% 0% 0%)', color: 'var(--cream)' }}>
            SOLVER
          </span>
          <span ref={psDot} style={{ display: 'inline-block', color: 'var(--surface)', transform: 'scale(1.4)' }}>.</span>
        </div>
      </div>
    </section>
  );
}
