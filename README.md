# CyberSchool Academy — Landing Page Redesign (UI Demo)

A standalone, responsive landing page concept for [CyberSchool Academy](https://cyberschoolacademy.com/), built with **HTML5, Tailwind CSS v4 and vanilla JavaScript**. It's a front-end demo only, with no backend, authentication, payments or enrollment.

## Run it

```bash
npm install        # installs the Tailwind CSS v4 CLI (dev only)
npm run build      # compiles src/input.css -> css/tailwind.css (minified)
npm run serve      # serves the folder at http://localhost:5173
```

While editing, run `npm run dev` to rebuild Tailwind automatically when files change.

The compiled `css/tailwind.css` is committed, so you can also open the folder with any static server (for example `npx serve .` or VS Code Live Server) without running the build first. Opening `index.html` straight from disk works too. The only external request is Google Fonts, and the page falls back to system fonts when offline.

## Structure

```
cyberschool-redesign/
├── index.html                 # the page (semantic sections + icon sprite)
├── src/input.css              # Tailwind v4 entry: @theme tokens, base + component classes
├── css/tailwind.css           # build output (generated)
├── css/styles.css             # custom effects: hero bg, artwork panels, cards, carousel, dialog
├── js/main.js                 # mobile menu, dropdowns, search dialog, carousel, demo notices
├── assets/images/hero-shield.svg  # animated hero illustration (self-contained SVG)
├── assets/icons/logo-mark.svg     # temporary logo mark + favicon
└── package.json
```

## Content sources

Copy comes from the live site where it could be verified (checked on 27 Oct 2026):

- **Homepage:**
  - The six departments with their descriptions, level ranges and links, plus "9 professional courses"
  - The featured course: Cyber Law & Compliance, 6 weeks, Intermediate, 35 seats, $399
  - The hero body text, the "Industry-Proven Excellence" points, the CTA copy and the footer tagline
  - The three testimonials, quoted word for word. Initials avatars are used because the live site uses them too. Star ratings are left out.
  - The topic ticker
- **/pages/about:** "Founded in 2015…10,000 professionals", the Mission and Vision text, and the Real-World Labs and Lifetime Access points
- **Stats band:** the site's own published figures (2015, 10,000+, 50+ instructors, 50+ partner companies), labelled as such
- **/pages/events:** three listed sessions and three past recordings. They are dated early 2025, so the section shows the dates and points to the live page for current events instead of calling them "upcoming".
- **/pages/blog:** three posts with their categories, dates and excerpts
- All footer, resource and quick-link destinations

Demo-only content:

- The headline, the eyebrow, the three hero feature highlights and the announcement text
- The hero dashboard labels (Network Security, Threat Analysis and so on), which are decorative
- The logo, a stand-in SVG shield. To use the real one, put the official `logo.png` in `assets/icons/` and update the two `<img>` tags.

Some content from the live site is deliberately left out:

- Outcome claims: the 95% success rate, "70% placement / job guarantee" and salary figures
- The leadership team, because the live pages show conflicting names
- The contact details, which look like placeholders (for example +91 080 4000 0000)
- Hiring-partner names

## Behaviour notes

- **Search** (the icon, or the `/` and `Ctrl/⌘+K` shortcuts) filters the departments and sections on this page and jumps to them. It is labelled as a demo.
- **Log in** shows a notice that sign-in isn't part of the demo.
- Department cards and footer and resource links open the matching page on cyberschoolacademy.com in a new tab.
- **Motion:**
  - Hero: an animated SVG shield, floating panels, a slight pointer parallax on desktop, and a staggered entrance.
  - Sections fade or slide in as they scroll into view, staggered across sibling cards. Elements already on screen at load are left alone, and nothing is hidden if JavaScript doesn't run.
  - "Why CyberSchool" is drawn as a circuit tree. A glowing trunk grows as you scroll, from a shield at the top down to a "Security First, Always." base. As it reaches each node, the node lights up, its branch draws out and the card slides in, alternating left and right on desktop. On mobile the trunk is a rail down the left side. The tree only grows, so cards stay visible when you scroll back up.
  - Testimonials are a spotlight: learner tabs on one side, one large quote on the other.
    - The quote card's accent colour changes with each learner.
    - It auto-advances every 7 seconds, with a progress bar on the active tab.
    - Auto-advance pauses while you hover or focus the section, or while it's off screen. It is off entirely for reduced motion.
    - You can switch quotes with the tabs, the prev/next buttons or the arrow, Home and End keys.
  - Figures count up when they appear.
  - Cards get a cursor-following spotlight.
  - The featured course has an animated border beam.
  - Section panels have a light sweeping along their top edge, the CTA has a drifting grid and a shine, the blog covers have a drifting grid, and past-event recordings have a pulsing dot.
  - The nav highlights the section in view.
- All motion stops under `prefers-reduced-motion`. That covers the SVG shield, the panels, the ticker, scroll reveals, count-ups, parallax and smooth scrolling.

## Tested

The page was checked in Chromium at 320, 375, 390, 430, 768, 1024, 1280 and 1440 px wide:

- No horizontal overflow at any width
- No console errors and no broken images
- The mobile menu, dropdowns, carousel, search dialog and demo notice all work
- Scroll reveals finish for every element and counters reach their final values

Reduced-motion mode was not emulated in the browser. It was checked in the code only.
