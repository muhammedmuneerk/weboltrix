# 🌌 MMK Websites — Premium Design & Web Development Studio

<div align="center">

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=for-the-badge)](https://github.com/darkroomengineering/lenis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **"We build premium websites that bring customers."** A cinematic, high-impact web design studio portfolio built to convert visitors into inquiries using smooth scroll motion, dynamic interactive elements, and dark-mode glassmorphic aesthetics.

[✨ Live Preview](https://github.com/muhammedmuneerk/MMKWebsites-v02) • [📁 Explore Code](file:///c:/Users/muham/Downloads/MMKWebsites/MMKWebsites-v02/src) • [💬 Get in Touch](https://wa.me/0000000000?text=Hi%2C%20I%20want%20a%20website%20for%20my%20business)

</div>

---

## 📖 Table of Contents
* [✨ Project Overview](#-project-overview)
* [🎨 Design Philosophy & Tokens](#-design-philosophy--tokens)
* [⚡ Core Features](#-core-features)
* [🛠️ Tech Stack & Dependencies](#%EF%B8%8F-tech-stack--dependencies)
* [📂 Repository Structure](#-repository-structure)
* [🧩 Architecture & Design Decisions](#-architecture--design-decisions)
* [📽️ Animation & Smooth Motion System](#%EF%B8%8F-animation--smooth-motion-system)
* [💻 Pages Walkthrough](#-pages-walkthrough)
* [💼 Case Studies & Showcase Projects](#-case-studies--showcase-projects)
* [🚀 Getting Started](#-getting-started)
* [📦 Production Deployment](#-production-deployment)
* [📄 License](#-license)

---

## ✨ Project Overview

**MMK Websites** is a conversion-focused portfolio and business platform built for local and global brands. The project showcases how refined aesthetics, robust animations, and zero-friction communication paths (like floating WhatsApp triggers) help brands establish instant authority online. 

Instead of heavy library loads or generic component builders, this platform is hand-crafted with **React 19**, **Vite**, **GSAP ScrollTrigger**, **Lenis Smooth Scroll**, and **Tailwind CSS**. It is tailored to load quickly, react gracefully, and guide user attention down key decision points.

---

## 🎨 Design Philosophy & Tokens

The website adopts a **"Dark Premium / Glassmorphic"** design system:
* **The Palette:** Built around `#050505` (`bg-ink`) for a cinematic backdrop, contrasted with `#f5f3ef` (`text-bone`) for text to maximize readability and reduce eye fatigue.
* **Glassmorphism:** Visual blocks leverage custom white-alpha backdrops (`bg-white/[0.055]`), subtle borders (`border-white/10`), and deep drop shadows (`shadow-premium`) paired with high-performance `backdrop-blur-2xl`.
* **Micro-interactions:** Interactive elements have smooth hover translation offsets (`hover:-translate-y-3` or `hover:-translate-y-1.5`), border glows, and custom scale adjustments that make the interface feel alive.

---

## ⚡ Core Features

*   🌌 **Signature Hero Moment:** Custom animated ambient spotlight fields, rotating celestial orbits (`.signature-orbit`), pulsing nodes, and drifting scanlines.
*   🖱️ **Cursor Glow System:** A customized cursor glow spotlight (`CursorGlow.jsx`) that smoothly tracks and scales according to user movement.
*   📐 **Before / After redacting tool:** An image comparative grid displaying side-by-side snapshots of old client projects versus rebuilt premium versions.
*   📜 **Why Choose Us horizontal marquee & track:** Horizontal layouts (`data-why-scroll` & `data-horizontal-scroll`) that pin the screen on desktop and translate cards on the X-axis as you scroll down.
*   📈 **Result-Oriented Copy:** Sections arranged around metrics, pricing setups, testimonials, and structured services packages.
*   💬 **WhatsApp Float integration:** Quick actions floating near the user's thumb to drive instant customer inquiries.
*   ♿ **Access and Motion Friendly:** Uses the `prefers-reduced-motion` media queries to automatically turn off performance-heavy CSS keyframe loops and GSAP timelines for users with motion sensitivities.

---

## 🛠️ Tech Stack & Dependencies

### Core Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.0.0` | Declarative UI structure and component state management. |
| **React Router DOM** | `^7.0.0` | Client-side routing, layout outlets, and parameter parsing. |
| **Vite** | `^5.4.21` | Lightning-fast HMR and bundle compiler. |
| **GSAP (GreenSock)** | `^3.15.0` | Advanced timeline animations and scroll trigger interactions. |
| **Lenis** | `^1.3.23` | High-fidelity momentum-based smooth scroll controller. |
| **Tailwind CSS** | `^3.4.0` | Utility-first styling alongside PostCSS / Autoprefixer. |

---

## 📂 Repository Structure

<details>
<summary><b>📂 Click to expand codebase directory tree</b></summary>

```bash
MMKWebsites-v02/
├── .chrome-headless-home/           # Chrome environment configs
├── dist/                            # Production build bundle
├── src/
│   ├── assets/                      # Raw image assets & previews
│   │   ├── logos/                   # Square and wide brand logo files
│   │   ├── preview/                 # Client project collages & before-afters
│   │   └── mmk-hero-studio.jpg      # Main showcase studio visual
│   │
│   ├── components/                  # Reusable UI blocks
│   │   ├── BeforeAfter.jsx          # Transformation comparison card
│   │   ├── CTASection.jsx           # Global Call-to-Action panel
│   │   ├── CursorGlow.jsx           # Custom mouse glow element
│   │   ├── Footer.jsx               # Navigation footer
│   │   ├── HeroShowcase.jsx         # Hero mockups & stats panel
│   │   ├── IconMark.jsx             # Decorative icons
│   │   ├── Layout.jsx               # Main Shell wrapping Navbar, Outlet, Footer
│   │   ├── Navbar.jsx               # Sticky header & mobile navigation modal
│   │   ├── PageHero.jsx             # Reusable hero banner for inner pages
│   │   ├── ProcessTimeline.jsx      # Process workflow stepper
│   │   ├── ProjectCard.jsx          # Showcase item with tag overlays
│   │   ├── SectionHeading.jsx       # Standard header for page blocks
│   │   ├── ServiceCard.jsx          # Price & package detail cards
│   │   ├── SignatureHeroMoment.jsx  # Hero orbits and scanlines SVG animation
│   │   └── WhatsAppFloat.jsx        # Float-triggered messaging path
│   │
│   ├── data/
│   │   └── siteData.js              # Centralized configuration & contents
│   │
│   ├── hooks/
│   │   └── useSiteMotion.js         # GSAP ScrollTrigger & Lenis initialization
│   │
│   ├── pages/                       # High-level route views
│   │   ├── About.jsx                # Studio background & team values
│   │   ├── CaseStudy.jsx            # Dynamic slug page (problem/solution/metrics)
│   │   ├── Contact.jsx              # Customer query input & WhatsApp hooks
│   │   ├── Home.jsx                 # Central landing page grid
│   │   ├── Process.jsx              # Strategic development timeline
│   │   ├── Services.jsx             # In-depth package options
│   │   └── Work.jsx                 # Portfolio directory filter page
│   │
│   ├── App.jsx                      # App router mapping
│   ├── main.jsx                     # DOM rendering anchor
│   └── styles.css                   # Custom animation layers & overrides
│
├── package.json                     # Scripts and dependencies manifests
├── tailwind.config.js               # Theme extend tokens (colors: ink, bone)
├── vite.config.js                   # Vite React plugins configuration
└── README.md                        # Documentation
```
</details>

---

## 🧩 Architecture & Design Decisions

1.  **Centralized Site Data Configuration:** Rather than hardcoding project lists, pricing, FAQs, and testimonials, everything is maintained inside [siteData.js](file:///c:/Users/muham/Downloads/MMKWebsites/MMKWebsites-v02/src/data/siteData.js). This ensures simple updates and content consistency.
2.  **Modular Motion System:** Animations are centralized inside a custom React hook: [useSiteMotion.js](file:///c:/Users/muham/Downloads/MMKWebsites/MMKWebsites-v02/src/hooks/useSiteMotion.js). This hook handles:
    *   Setup and destruction of Lenis smooth scroll on mount/unmount.
    *   Tracking route changes to automatically clean up previous `ScrollTrigger` instances, avoiding memory leaks and stale trigger targets.
    *   Mobile thresholds (`min-width: 768px`) for complex horizontal pins to prevent layout shifts on small viewports.
3.  **Layout Wrapper Architecture:** [Layout.jsx](file:///c:/Users/muham/Downloads/MMKWebsites/MMKWebsites-v02/src/components/Layout.jsx) uses React Router's `<Outlet />` wrapper to ensure persistent elements (Navbar, Footer, Cursor Glow, WhatsApp Float) do not re-render or flicker during page changes.

---

## 📽️ Animation & Smooth Motion System

The movement in **MMK Websites** is strictly driven by scroll-linked velocity and stagger thresholds.

### 🧬 ScrollTrigger Reveal Mechanics
Every main section features subtle translations (`y: 18` or `scale: 0.992`) triggered only when it enters `top 88%` of the viewport. Elements matching `.stagger-grid` cascade into place using GSAP staggers:
```javascript
gsap.from(gsap.utils.toArray(grid.children), {
  y: 18,
  scale: 0.992,
  duration: 0.72,
  ease: "power3.out",
  stagger: 0.07,
  scrollTrigger: {
    trigger: grid,
    start: "top 88%",
    once: true,
  },
});
```

### 💫 Horizontal Card Pinning (Desktop)
The "Why Choose Us" block uses horizontal pinning on desktop to create a dynamic sliding deck:
*   The track (`[data-why-track]`) shifts on the X-axis by the distance of `track.scrollWidth - viewport.clientWidth`.
*   As the scroll pins, the cards tilt and bounce slightly:
```javascript
timeline.fromTo(cards, {
  y: (i) => (i % 2 === 0 ? 18 : -10),
  rotateZ: (i) => (i % 2 === 0 ? -0.7 : 0.7)
}, {
  y: (i) => (i % 2 === 0 ? -12 : 16),
  rotateZ: (i) => (i % 2 === 0 ? 0.6 : -0.6),
  ease: "none"
}, 0);
```

---

## 💻 Pages Walkthrough

<details>
<summary><b>📂 Click to expand page details</b></summary>

### 🏠 Home Page (`/`)
*   **Signature Hero:** Dynamic title, call-to-actions, and [HeroShowcase.jsx](file:///c:/Users/muham/Downloads/MMKWebsites/MMKWebsites-v02/src/components/HeroShowcase.jsx) featuring visual mocks and statistics.
*   **Featured Work Grid:** Direct visual grid showcasing the high-value project cards.
*   **Interactive Comparison Slider:** Before/After redesign previews displaying agency-level updates.
*   **Result Indicators:** Numeric statistics highlighting inquiries, brand trust, and conversion metrics.
*   **Pricing Setup Details:** Compact summary of baseline setups and maintenance pricing ranges.

### 💼 Work Directory & Case Studies (`/work` & `/work/:slug`)
*   Displays a filterable grid of past projects with specific tags (MongoDB, Tailwind, Express, React, etc.).
*   Dynamic Case Studies fetch details from `siteData.js` mapping problem statements, engineered solutions, transformation metrics, and case notes.

### 🛠️ Services Page (`/services`)
*   Breaks down tiered services blocks: **Starter** (Lean Launch), **Business** (Growth Ready), and **Premium** (Full Cinematic Experience).
*   Details package features, targeted audiences, and features.

### 🗺️ Process Page (`/process`)
*   Displays a clear, segmented strategy timeline outlining steps: **Understand**, **Shape**, **Build**, and **Launch**.

### 👤 About Page (`/about`)
*   Walks through the agency values, mission statements, studio workflow, and focus on mobile-first clean execution.

### 📞 Contact Page (`/contact`)
*   Offers contact options, social links, FAQs, and interactive query messaging setups.
</details>

---

## 💼 Case Studies & Showcase Projects

The portfolio showcases **10 real-world projects** with details mapping out problem/solution timelines:

1.  **MMK Shop:** MERN E-Commerce platform with PayPal and custom Admin controls.
2.  **AMOR WEDDINGS:** Premium men's clothing gallery-led portfolio.
3.  **AMOR UNIFORMS:** Structured uniforms solutions division showcase.
4.  **Shazzz:** Personal portfolio capturing accomplishments and establishments.
5.  **Spicenza:** Dual dark/light mode portal for global spice import/export.
6.  **Artisan Creations:** Craft-focused business portfolio supported by AI-generated assets.
7.  **MMKflix:** Dynamic React interface using the TMDB Movie Database API.
8.  **ToDo App:** Clean, distraction-free daily tasks organizer.
9.  **Airbnb Clone:** Cloud-integrated listing booking platform (MongoDB/Cloudinary/Tailwind).
10. **Noir Cuisine:** Dark-themed atmospheric digital restaurant menu.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18+ recommended) and npm installed.

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/muhammedmuneerk/MMKWebsites-v02.git
    cd MMKWebsites-v02
    ```

2.  **Install Project Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Local Development Server:**
    ```bash
    npm run dev
    ```
    The site will start locally at `http://localhost:5173`.

4.  **Build and Bundles compilation:**
    ```bash
    npm run build
    ```

5.  **Locally Preview Production Build:**
    ```bash
    npm run preview
    ```

---

## 📦 Production Deployment

### Router Redirect Configuration
Since the app uses client-side routing (`React Router`), web hosts must redirect all incoming browser requests back to `index.html` to avoid `404 Not Found` errors on page reloads.

*   **Vercel:** A root-level `vercel.json` file handles redirects automatically.
*   **Netlify:** Requires a `_redirects` file in the build output (`dist/` folder):
    ```text
    /*   /index.html   200
    ```

---

## 📄 License

This project is licensed under the **MIT License**. Check the license records for details.

---

<div align="center">

Made with 🖤 by **MMK Websites**

</div>
