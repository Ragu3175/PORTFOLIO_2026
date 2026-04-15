# RAGURAM R — Portfolio Project Context (REVISED MASTER PLAN)

## About Me
Name: Raguram R
Role: Full Stack Developer (MERN)
Email: ragu317317@gmail.com
Phone: 9489624436
GitHub: github.com/Ragu3175
LinkedIn: linkedin.com/in/raguram-r-92504a286
College: KIT Coimbatore — B.E. ECE — CGPA 7.8
Certifications: MERN Stack + React.js from Novi Tech
Target Roles: Entry-level MERN Developer
Target Cities: Bengaluru / Chennai / Hyderabad

---

## Tech Stack
- React + Vite
- GSAP + ScrollTrigger + SplitText + Observer
- Lenis (smooth scroll)
- Tailwind CSS
- Vercel (deploy)

---

## Design System
| Token       | Value                          |
|-------------|-------------------------------|
| Background  | #0A0A0F                        |
| Text        | #F0EDE6 (warm off-white)       |
| Accent      | #E8FF47 (electric lime)        |
| Card/Border | #3A3A3A                        |
| Display Font| Clash Display / PP Neue Montreal |
| Body Font   | DM Sans / Inter                |

---

## Project Structure
src/
├── components/
│   ├── Loader.jsx        -- Scene 00
│   ├── Hero.jsx          -- Scene 01
│   ├── IdentityBreak.jsx -- Scene 02
│   ├── About.jsx         -- Scene 03
│   ├── Skills.jsx        -- Scene 04
│   ├── Process.jsx       -- Scene 05
│   ├── Projects.jsx      -- Scene 06
│   ├── Credibility.jsx   -- Scene 07
│   └── Contact.jsx       -- Scene 08
├── App.jsx
├── main.jsx
└── index.css

---

## 9 Scenes — Revised Cinematic Plan

### Scene 00 — Loader
- Black screen
- "RAGURAM R" letters wipe in L→R, stagger 0.06s each
- ".R" snaps in lime (#E8FF47)
- Progress bar fills L→R
- Whole loader slides UP off screen at 1.8s
- Hero fades in beneath

### Scene 01 — Hero (100vh)
- Animated beach video loop as background (hero.mp4)
- Dark gradient overlay bottom → top
- Eyebrow: "Full Stack Developer · MERN · Bengaluru"
- Giant display font: "RAGURAM R."
- Sub: "React · Node · MongoDB · AWS · Docker"
- CTAs: "View Work" (outline) + "Hire Me" (lime fill)
- On scroll: video scale 1→1.08, title y:0→-60px

### Scene 02 — Identity Break (150vh) [NEW]
- Full-bleed typographic statement scene. No images.
- **Animation — Clip-Path Curtain Reveal:**
  - Black screen after hero.
  - "BUILDER." (center) hidden behind `clip-path: inset(0 100% 0 0)`.
  - Scroll wipes clip-path right $\to$ left, carving letters out of darkness.
  - "SHIPPER." wipes bottom $\to$ upward.
  - "PROBLEM SOLVER." — each word wipes independently (0.1s stagger).
  - Background: Faint animated grid lines pulse (CSS @keyframes).
  - The "." on each word snaps lime (#E8FF47) with scale 1.4 $\to$ 1.0 overshoot.

### Scene 03 — About (200vh) [UPGRADED]
- **Split-screen parallax layout:**
  - Left half: Sticky biographical text column.
  - Right1: Timeline (KIT $\to$ Certs $\to$ First Project) with SVG line drawing.
    - Card 2 half: 3 stacked "fact cards" scrolling past.
    - Card : Philosophy quote — "I don't just write code. I build experiences." (Editorial giant type).
    - Card 3: Stats — Animated counters (5+ Projects, 7.8 CGPA, 2 Certs, 1 deployed product).
- **Immersive zoom:** Section number "03" zooms scale: 4 $\to$ 1, opacity: 0.04 $\to$ 0.
- **Image mask:** Portrait photo revealed via `clip-path: circle(0% → 50%)` like a camera iris.

### Scene 04 — Skills (120vh) [UPGRADED]
- 3 horizontal marquee rows at different speeds/directions.
- **Entry Transition — Venetian Blinds:**
  - 8 horizontal slats cover the section.
  - Scroll reveals marquee tracks as slats flip/slide away top $\to$ bottom (0.08s stagger).
- Hover: Rows pause, chip turns lime, 3D rotateX/Y.
- Cert ticker below: "MERN Stack Certified · React.js Certified · KIT Coimbatore · B.E. ECE · CGPA 7.8"

### Scene 05 — Process (200vh) [NEW]
- **Content:** 4 phases: UNDERSTAND $\to$ ARCHITECT $\to$ BUILD $\to$ POLISH.
- **Animation — Horizontal Scroll Track (Pinned):**
  - Section pins for 200vh.
  - 4 phase cards slide horizontally L$\to$R as you scroll vertically.
  - Background: Huge step number (01–04) at opacity 0.06.
  - Active card: Number zooms scale: 0.8 $\to$ 1.0, text slides up y: 40px $\to$ 0.
  - Inactive cards: `filter: blur(2px)`, opacity: 0.4.
  - SVG connector line draws `stroke-dashoffset` on scroll.
  - 3D hover on each phase card.

### Scene 06 — Projects (500vh) [UPGRADED]
- Pinned 500vh scroll — 5 projects $\times$ 100vh each.
- **Transition — Clip-Path Wipe:**
  - Outgoing: `inset(0 0 0 0%)` $\to$ `inset(0 0 0 100%)` (wipes out right).
  - Incoming: `inset(0 100% 0 0)` $\to$ `inset(0 0% 0 0)` (wipes in from right).
- **Project Number Scrub:** Giant number (01 $\to$ 05) behind card with blur flash (0px $\to$ 8px $\to$ 0px).
- **Cursor Morph:** Custom cursor (8px dot) expands to 60px circle with "VIEW" text and 360° rotation on card hover.
- Projects: SafeDrive AI, CodePilot, Task Manager, Messaging App, Score Predictor.
- Each has: SVG illustration (stroke-draw) + Problem $\to$ Stack $\to$ Role $\to$ Result.

### Scene 07 — Testimonials / Credibility (120vh) [NEW]
- **Content:** Testimonial quotes or "What I Bring" value props in editorial cards.
- **Animation — Staggered card flip:**
  - Cards enter face-down (`rotateY: 90deg`) and flip to face you (`rotateY: 0`) one by one.
  - Subtle inner glow border in accent color.
  - Parallax z-depth for 3D layering.

### Scene 08 — Contact (100vh) [UPGRADED]
- "LET'S BUILD SOMETHING." — words stagger in, "SOMETHING." slams with back.out overshoot in lime.
- **Full-bleed terminal block:**
  - Text types itself with blinking cursor (CSS @keyframes).
  - Lines: "initializing contact protocol...", "target: ragu317317@gmail.com", "status: OPEN TO WORK...", "location: Bengaluru / Chennai / Hyderabad", "availability: IMMEDIATE".
  - 0.4s delay between lines.
- **Footer Transition — Page Fold:** Page above seems to fold up like paper (perspective + rotateX) at the very bottom.
- Links: GitHub, LinkedIn, Resume download (/public/resume.pdf), Phone.

---

## New Scene Transitions
| From               | To             | Effect                                      |
|--------------------|----------------|---------------------------------------------|
| Hero               | Identity Break | Radial clip-path collapse (hero $\to$ center, black expands) |
| Identity Break     | About          | Horizontal curtain wipe (lime bar L $\to$ R) |
| About              | Skills         | Scale + blur dissolve (scale 1 $\to$ 1.05 + fade) |
| Skills             | Process        | Venetian blind slats slam shut              |
| Process            | Projects       | Film cut (hard cut + 1-frame white flash)    |
| Projects           | Credibility    | Vertical clip wipe (floor rises upward)      |
| Credibility        | Contact        | Zoom into darkness (scale 1 $\to$ 1.2, black out) |

---

## Assets
| File                  | Status     | Notes                               |
|-----------------------|------------|-------------------------------------|
| /public/hero.mp4      | ✅ READY   | Beach animation loop                |
| /public/resume.pdf    | ⚠️ NEEDED  | Drop resume PDF here                  |
| Portrait photo        | OPTIONAL   | Dark bg, for iris-mask in Scene 03   |
| 5 project SVGs        | 🔨 IN CODE | Generated as JSX/SVG by Claude       |

---

## Animation Principles
- Immersive Zoom: scale-based depth on section entry/exit.
- Parallax Storytelling: multiple layers at different scroll speeds.
- 3D Hover: perspective + rotateX/Y on mousemove, elastic snap on leave.
- All scroll animations use GSAP ScrollTrigger with scrub:1.
- Smooth scroll via Lenis — feed Lenis time into ScrollTrigger ticker.
- GSAP plugins to register: ScrollTrigger, SplitText, Observer.

---

## Build Order
1. App.jsx + Lenis setup + global CSS variables
2. Loader.jsx
3. Hero.jsx
4. IdentityBreak.jsx
5. About.jsx
6. Skills.jsx
7. Process.jsx
8. Projects.jsx
9. Credibility.jsx
10. Contact.jsx
11. Scene transitions (wired last)
12. Final video drop + Vercel deploy
