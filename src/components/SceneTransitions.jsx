import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SceneTransitions() {
  const containerRef = useRef(null);
  const heroCollapseRef = useRef(null);
  const limeCurtainRef = useRef(null);
  const blindSlatsRef = useRef([]);
  const filmFlashRef = useRef(null);
  const verticalWipeRef = useRef(null);

  useEffect(() => {
    // Wait a brief tick so DOM sections are fully mounted and sized
    const timer = setTimeout(() => {
      let ctx = gsap.context(() => {

        // 1. Hero -> IdentityBreak: radial clip-path collapse
        const identityEl = document.querySelector('.identity-break');
        if (identityEl) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: identityEl,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          });
          tl.fromTo(heroCollapseRef.current,
            { clipPath: 'circle(0% at 50% 50%)', opacity: 1, display: 'block' },
            {
              clipPath: 'circle(150% at 50% 50%)',
              ease: 'none',
              duration: 1
            }
          ).set(heroCollapseRef.current, { display: 'none' }); // Remove from layout instantly to stop blocking the screen
        }

        // 2. IdentityBreak -> About: lime horizontal curtain
        const aboutEl = document.getElementById('about');
        if (aboutEl) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: aboutEl,
              start: 'top bottom',
              end: 'top 30%',
              scrub: true
            }
          });
          tl.fromTo(limeCurtainRef.current,
            { scaleX: 0, transformOrigin: 'left' },
            { scaleX: 1, ease: 'power1.inOut', duration: 1 }
          ).to(limeCurtainRef.current, {
            scaleX: 0, transformOrigin: 'right', ease: 'power1.inOut', duration: 1
          });
        }

        // 3. About -> Skills: Scale + Blur Dissolve
        const skillsEl = document.getElementById('skills');
        const aboutElForScale = document.getElementById('about');
        if (skillsEl && aboutElForScale) {
          gsap.to(aboutElForScale, {
            scale: 0.95, opacity: 0, filter: 'blur(20px)',
            scrollTrigger: {
              trigger: skillsEl,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          });
        }

        // 4. Skills -> Process: Venetian Blind slam shut
        const processEl = document.getElementById('process');
        if (processEl && blindSlatsRef.current.length > 0) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: processEl,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          });
          
          tl.fromTo(blindSlatsRef.current,
            { scaleY: 0, transformOrigin: 'top' },
            { scaleY: 1, ease: 'none', stagger: 0.1 }
          ).to(blindSlatsRef.current, {
            scaleY: 0, transformOrigin: 'bottom', ease: 'none', stagger: 0.1
          });
        }

        // 4. Process -> Projects: white flash film cut
        const projectsEl = document.getElementById('projects');
        if (projectsEl) {
          ScrollTrigger.create({
            trigger: projectsEl,
            start: 'top top',
            onEnter: () => gsap.to(filmFlashRef.current, { opacity: 1, duration: 0.1, yoyo: true, repeat: 1 }),
            onEnterBack: () => gsap.to(filmFlashRef.current, { opacity: 1, duration: 0.1, yoyo: true, repeat: 1 })
          });
        }

        // 5. Projects -> Credibility: vertical clip wipe
        const credEl = document.getElementById('credibility');
        if (credEl) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: credEl,
              start: 'top bottom',
              end: 'top 30%', // Finish wiping slightly before hitting the top
              scrub: true
            }
          });
          tl.fromTo(verticalWipeRef.current,
            { clipPath: 'inset(100% 0 0 0)' },
            { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'none' }
          ).to(verticalWipeRef.current, {
            clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'none'
          });

          // Parallel Projects fade/scale
          gsap.to(projectsEl, {
            scale: 0.95, opacity: 0.5, filter: 'blur(5px)',
            scrollTrigger: {
              trigger: credEl,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          });
        }
        
        // 6. Credibility -> Contact: zoom into darkness
        const contactEl = document.getElementById('contact');
        if (credEl && contactEl) {
          // Instead of scaling credEl container (which might break its internal ScrollTriggers),
          // we apply the scale effect safely.
          gsap.to(credEl, {
            scale: 1.15, opacity: 0, ease: 'none',
            scrollTrigger: {
              trigger: contactEl,
              start: 'top bottom',
              end: 'top 20%',
              scrub: true
            }
          });
        }

      }, containerRef);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
      <div ref={heroCollapseRef} style={{ position: 'absolute', inset: 0, background: '#0A0A0F', clipPath: 'circle(0% at 50% 50%)', display: 'none' }} />
      
      {/* 2. Lime Curtain */}
      <div ref={limeCurtainRef} style={{ position: 'absolute', inset: 0, background: '#E8FF47', transformOrigin: 'left', transform: 'scaleX(0)' }} />

      {/* 3. Venetian Blinds */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} ref={el => blindSlatsRef.current[i] = el} style={{
            flex: 1, background: '#0A0A0F', transformOrigin: 'top', transform: 'scaleY(0)'
          }} />
        ))}
      </div>

      {/* 4. Film Flash */}
      <div ref={filmFlashRef} style={{ position: 'absolute', inset: 0, background: '#ffffff', opacity: 0 }} />

      {/* 5. Vertical Wipe */}
      <div ref={verticalWipeRef} style={{ position: 'absolute', inset: 0, background: '#0A0A0F', clipPath: 'inset(100% 0 0 0)' }} />
    </div>
  );
}
