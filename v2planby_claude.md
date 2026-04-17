# RAGURAM R — Portfolio v2 Plan (April 17, 2026)

## What's Already Working (Don't Touch)
- Loader: letter wipe + progress bar ✅
- Hero: video bg, layout, CTAs ✅
- About: split-screen sticky left + right cards ✅
- Process: horizontal pinned 4-phase ✅
- Contact: terminal + magnetic links ✅

---

## Global Background Decision
**Choice: Per-section animated canvas, NOT a global always-on Vanta**
Reason: Hero has its own video. Loader is black. Process/Contact need no bg distractions.
Only 4 sections need a background: IdentityBreak, About, Skills, Projects.

**Background tech: React Bits `Particles` (WebGL, ultra-light) + CSS per section**
- IdentityBreak: Sparse white particle field, low velocity
- About: Same particles, even sparser — bg recedes so text is king
- Skills: Particles pause/dim, marquee is the visual star
- Projects: NO particles — per-project accent color on the dark bg is enough (CSS radial gradient)

---

## Fix 1 — Hero → IdentityBreak Transition (the black circle bug)
**Problem:** The loader's radial clip-path circle is persisting / colliding with the hero.
**Root cause:** The loader exit animation (`clip-path: circle(100%)` expanding then the loader `y: -100vh` slide) is leaving a ghost element OR the IdentityBreak's `clip-path: inset(0 100% 0 0)` initial state is rendering black too early.

**Fix:**
```jsx
// Loader.jsx — ensure complete cleanup
gsap.to(loaderRef.current, {
  y: '-100%',
  duration: 0.8,
  ease: 'power2.inOut',
  delay: 1.8,
  onComplete: () => {
    loaderRef.current.style.display = 'none' // hard hide after exit
  }
})
```
**Transition animation (Hero → IdentityBreak):**
Replace the current radial circle with a **horizontal scanline wipe**:
- A full-width `div` with `background: #0A0A0F`, height 100vh, `scaleY: 0` (transform-origin: top)
- On scroll past hero 80%, `scaleY: 0 → 1` fast (0.4s, power3.in) covering the hero
- Then IdentityBreak clip-path words start wiping in simultaneously

---

## Fix 2 — IdentityBreak Background (replace dead grid lines)
**Current:** CSS `@keyframes` pulsing grid — feels flat and generic.

**New: React Bits `Aurora` component** (CSS-only, zero JS overhead)
- Subtle green/lime aurora blobs drifting in background at low opacity (0.15)
- Clip-path words wipe in OVER the aurora
- The aurora's color palette: `#E8FF47` (lime) + `#1a1a2e` (deep blue) at very low saturation
- On word reveal complete, aurora slowly fades opacity 0.15 → 0.05 (bg recedes)

```jsx
// IdentityBreak.jsx
<div className="identity-break">
  <Aurora colorStops={["#E8FF47", "#0A0A0F", "#1a3040"]} opacity={0.15} />
  <div className="words-container">
    {/* BUILDER. SHIPPER. PROBLEM SOLVER. clip-path wipes */}
  </div>
</div>
```

---

## Fix 3 — IdentityBreak → About Transition
**Current:** Yellow/lime curtain wipe left-to-right, then camera iris. Works but bg bugs.

**About background fix:**
- Left sticky panel: pure `#0A0A0F` — no bg effect needed, text is everything
- Right cards: subtle `background: #0D0D14` (1 shade lighter) with `border: 1px solid #1a1a2e`
- No particle system here — the SVG timeline drawing + stat counters ARE the motion

**Transition improvement:**
Keep the lime curtain wipe but fix the timing:
```js
// SceneTransitions.jsx
// The lime bar should be 3px tall, not full screen
// It wipes as a LINE across, not a full curtain
gsap.fromTo('.transition-lime-line', 
  { scaleX: 0, transformOrigin: 'left' },
  { scaleX: 1, duration: 0.6, ease: 'power3.inOut',
    scrollTrigger: { trigger: '#about', start: 'top 90%' }
  }
)
```

---

## Fix 4 — Skills Section End-State Bug (Images 2 & 3)
**Problem:** The section currently shows a static card grid (old implementation) + collapses at end.

**Full rework — back to the marquee plan:**

### Skills.jsx — Marquee implementation (3 rows)
```jsx
// Row directions + speeds
const rows = [
  { items: frontendSkills, speed: 35, direction: 'left' },
  { items: backendSkills, speed: 28, direction: 'right' },
  { items: devopsSkills, speed: 20, direction: 'left' },
]
```

### Entry: Venetian blinds (8 horizontal slats)
```js
gsap.from('.slat', {
  scaleY: 0,
  stagger: 0.08,
  transformOrigin: 'top',
  duration: 0.4,
  scrollTrigger: { trigger: '#skills', start: 'top 80%' }
})
```

### End-state fix (Antigravity was right):
```css
/* Skills section exit — NO collapse */
#skills {
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}
```
With a `gsap.to('#skills', { y: -30, opacity: 0 })` scrubbed on scroll-out. The section gently slides away behind the Process section instead of collapsing.

---

## Fix 5 — Process → Projects Transition
**Current:** Hard cut / white flash. Described but not implemented cleanly.

**New: "Aperture" transition**
- A radial gradient mask on the Projects section: `radial-gradient(circle at 50% 50%, black 0%, transparent 60%)`
- Circle starts small (0% radius), expands to full viewport as scroll crosses boundary
- Simultaneous: the large project number "01" fades in from scale 2 → 1 opacity 0 → 0.06

```js
gsap.fromTo('#projects', 
  { clipPath: 'circle(0% at 50% 50%)' },
  { clipPath: 'circle(150% at 50% 50%)', 
    duration: 0.6,
    scrollTrigger: { trigger: '#projects', start: 'top 95%', once: true }
  }
)
```

---

## Fix 6 — Projects Section Upgrade
**Current:** Card is flat, SVG crosshair is minimal, no clip-path wipe between projects.

### Per-project accent: CSS variable morph
```js
// On each project enter:
gsap.to('body', {
  '--project-accent': project.accent, // #ff6600 etc.
  duration: 0.4
})
// Background radial glow:
// background: radial-gradient(ellipse at 60% 50%, color-mix(in srgb, var(--project-accent) 8%, transparent), transparent 70%)
```

### Card transition: Clip-path wipe (implement the CLAUDE.md spec)
```js
// Outgoing: inset(0 0 0 0%) → inset(0 0 0 100%)
// Incoming: inset(0 100% 0 0) → inset(0 0% 0 0)
// Timeline scrubbed in the pin's ScrollTrigger
```

### Project number scrub: Giant "01" → "05" behind card
```js
// gsap.to '.project-number': innerText changes, blur flashes 0→8→0px
```

### Cursor morph on card hover:
```js
// cursor dot (8px) → circle with "VIEW" text (60px) on card mouseenter
// CSS: transition width/height + opacity of "VIEW" label
```

---

## Fix 7 — Projects → Credibility Transition
**Current:** Vertical clip wipe (floor rises). May not be implemented.

**Plan: "Stage curtain" — two panels**
```js
// Left panel: clip-path inset(0 50% 0 0) → inset(0 0 0 0) [wipes from left]
// Right panel: clip-path inset(0 0 0 50%) → inset(0 0 0 0) [wipes from right]
// Both animate simultaneously, 0.5s, power2.inOut
// Credibility section revealed behind the opening curtain
```

---

## Fix 8 — Credibility Cards (Image 5 — stagger depth issue)
**Problem:** Cards are at different Y levels (stagger offset too large), card 3 is off-screen, backgrounds are flat grey gradients.

**Fix:**
```js
// Flip cards: rotateY 90 → 0, stagger 0.15s (not 0.4s)
// All 3 cards start at same Y baseline
gsap.from('.credibility-card', {
  rotateY: 90,
  opacity: 0,
  stagger: 0.15,
  duration: 0.6,
  ease: 'back.out(1.4)',
  scrollTrigger: { trigger: '#credibility', start: 'top 70%' }
})
```

**Card visual upgrade:**
- Remove gradient bg on cards
- Use `border: 1px solid #E8FF47` (lime border) instead
- Title in `#F0EDE6`, body in `#888`
- Accent dot in lime top-right (already in image, keep it)

---

## Fix 9 — Credibility → Contact Transition
**Current:** "Zoom into darkness" — not yet implemented.

**Plan:**
```js
// Contact section starts with scale: 1.15, opacity: 0, filter: blur(8px)
// On scroll: scale 1.15→1.0, opacity 0→1, blur 8→0px, duration scrubbed
gsap.fromTo('#contact',
  { scale: 1.15, opacity: 0, filter: 'blur(8px)' },
  { scale: 1, opacity: 1, filter: 'blur(0px)',
    scrollTrigger: { trigger: '#contact', start: 'top 90%', scrub: 1 }
  }
)
```

---

## Background Summary — Per Section
| Section | Background |
|---|---|
| Loader | Pure #0A0A0F |
| Hero | hero.mp4 video + dark gradient |
| IdentityBreak | React Bits Aurora (lime/dark, opacity 0.15) |
| About | Pure #0A0A0F — text is the hero |
| Skills | Pure #0A0A0F — marquee is the hero |
| Process | Pure #0A0A0F — numbered steps |
| Projects | Radial glow morphing per accent color |
| Credibility | Pure #0A0A0F + lime card borders |
| Contact | Pure #0A0A0F |

---

## New Dependencies to Add
```bash
npm install # nothing new for backgrounds — Aurora is copy-paste from React Bits
# All transitions: pure GSAP (already installed)
# Marquee: pure CSS animation (no framer motion)
```

---

## Build Order for v2 Fixes
1. Fix Loader exit → Hero entry (kill the black circle)
2. Replace Skills card grid → 3 marquee rows + venetian entry + mask-image exit
3. Wire IdentityBreak Aurora background
4. Implement all 7 transitions in SceneTransitions.jsx
5. Projects: accent color morph + clip-path wipe + cursor
6. Credibility: fix stagger timing + card border style
7. Final pass: scroll through all 9 scenes, verify no bg flash/glitch

---

## Smooth Scroll Note
Lenis + GSAP ScrollTrigger integration must use:
```js
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```
All clip-path transitions must use `scrub: false, once: true` (not scrubbed) to avoid partial wipe states mid-scroll.