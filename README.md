# Khandaker Rafiul Islam — Portfolio

Personal portfolio of a full-stack developer in Dhaka, built with React, TypeScript and Vite. An editorial design in warm paper and ink with one amber accent, a 3D avatar that walks you through the page, and every project shipped with its architecture and trade-offs.

## Design versions

This repository keeps every design, so any of them can be brought back at any time.

| Design | Branch | Tag | What it looks like |
|---|---|---|---|
| **Editorial** (current, on `main`) | `redesign-editorial` | — | Warm paper and ink with an amber accent: 3D avatar that docks into a "quick hello" card, terminal-style toolkit, pinned horizontal work rail, system-design playground, light/dark theme |
| **System design** (previous) | `design/system-v1` | `design-system-v1` | The portfolio drawn as a distributed system: 7 colour themes, Pip the blue-tit mascot, architecture case files, the "Scale this" playground, Ctrl+K command palette |

### Look at a design without changing anything

```bash
git checkout design/system-v1   # the previous design
npm install
npm run dev
```

Come back to the current design:

```bash
git checkout main
```

### Make a design the live site again

Point `main` at the design you want, then push. For example, to restore the previous design:

```bash
git checkout main
git reset --hard design-system-v1
git push --force-with-lease origin main
```

`git reset --hard` discards uncommitted changes on `main`, so commit or stash first. Nothing is lost: the current design stays on the `redesign-editorial` branch, and you can switch back the same way with `git reset --hard redesign-editorial`.

## Features

- 🧑 **Avatar guide** — a 3D avatar stands in the hero, then glides down and docks as a "quick hello" card as you scroll
- 🗂️ **Pinned work rail** — scrolling the page slides the project cards sideways, on desktop and phones
- 🧭 **Project stories** — each project opens a Story / Architecture / Trade-offs view with a live architecture diagram
- 🧰 **Toolkit terminal** — skill tiles with filters; picking one opens what it was used for, right in the text
- 🕹️ **System-design playground** — push traffic, add replicas, kill one and watch latency, errors and load react
- 🌗 **Light / dark theme** — remembers the visitor's choice and follows the device setting by default
- 📱 **Fully responsive** — phone layout and type sizes follow the reference design; "Menu +" navigation on phones
- ♿ **Accessible motion** — every animation respects `prefers-reduced-motion`

## Tech Stack

- **Framework**: React 18 + TypeScript, built with Vite
- **Motion**: GSAP (ScrollTrigger) for the pinned rail and reveals, Lenis for smooth scrolling
- **Styling**: one hand-written stylesheet (`src/site.css`) with CSS custom properties for both themes
- **Type**: Space Grotesk throughout, Georgia italic for accents, JetBrains Mono inside diagrams
- **Backend**: Express + Nodemailer contact API (`server/`, `api/` for Vercel)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the project directory:

```bash
cd c:\PORTFOLIO_2.0
```

2. Install dependencies:

```bash
npm install
```

### Development

Start frontend + backend together:

```bash
npm run dev:full
```

The application will be available at `http://localhost:5173`

Backend contact API runs at `http://localhost:5000`

### Contact Backend Setup (SMTP)

The contact form sends email through a backend server located at `server/index.js`.

1. Copy `server/.env.example` to `server/.env`
2. Fill in your SMTP credentials:

```bash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_app_password
CONTACT_TO_EMAIL=your_email@example.com
CONTACT_FROM_EMAIL=Portfolio Contact <your_smtp_user>
```

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── site/
│   │   ├── Nav.tsx           # Centred pill nav, theme switch, "Menu +" on phones
│   │   ├── Hero.tsx          # Name watermark, headline, avatar slot
│   │   ├── AvatarGuide.tsx   # The avatar that glides from the hero into the corner card
│   │   ├── About.tsx         # Bio, flippable ID card, quick facts
│   │   ├── Toolkit.tsx       # Skill terminal and the expanding skill details
│   │   ├── Work.tsx          # Pinned horizontal project rail and project story dialog
│   │   ├── Journey.tsx       # Project timeline and education
│   │   ├── Playground.tsx    # System-design simulator
│   │   ├── Contact.tsx       # Contact details, form and footer
│   │   └── ui.tsx            # Reveal-on-scroll and section header helpers
│   └── ArchDiagram.tsx       # Hand-placed architecture diagrams, scaled to fit
├── data/
│   ├── profile.ts            # Personal details, toolkit, journey, education
│   └── projects.ts           # Projects: story, architecture and trade-offs
├── lib/motion.ts             # GSAP + Lenis setup, scroll helpers
├── App.tsx                   # Page composition
├── main.tsx                  # React entry point
└── site.css                  # All styles, both themes, responsive rules
public/
├── avatar.webp               # 3D avatar (transparent background)
├── profile.png               # Photo on the ID card
├── oi-tesla-pool.webp        # Rickshaw illustration for Oi Tesla Pool
└── resume.pdf                # Downloadable résumé
server/
└── index.js                  # Express API for the contact form
```

To change content, edit `src/data/profile.ts` and `src/data/projects.ts` — the sections read everything from there.

## Sections

1. **Hero** — name watermark, "Full-Stack & Backend Developer.", links to work, contact and the résumé
2. **About** — bio, an ID card that tilts with the pointer and flips on click, quick facts
3. **Toolkit** — the stack as tiles in a terminal window, filterable by group
4. **Work** — five projects on a pinned rail: Oi Tesla Pool, News Autopilot, GravityCloud, NestMate, KrishiKonnect
5. **Journey** — a timeline of projects with education below
6. **Playground** — a toy model of a scaled web service
7. **Contact** — email, phone, WhatsApp, résumé and a message form

## Theme System

Both themes are CSS custom properties keyed on the `data-theme` attribute of `<html>`. A small script in `index.html` applies the saved (or system) theme before first paint, so the page never flashes.

```typescript
document.documentElement.setAttribute("data-theme", "light" | "dark");
```

| Token | Light | Dark |
|---|---|---|
| Background `--bg` | `#F4F1E8` | `#0E1322` |
| Ink / text `--ink` | `#10172A` | `#EFE9DC` |
| Accent `--acc` | `#A96212` | `#DD9A50` |
| Secondary text `--text2` | `#64665F` | `#A3A49E` |

## Responsive Breakpoints

- **Desktop**: above 1000px — centred pill nav, side-by-side hero
- **Tablet**: 1000px — stacked hero with the avatar on top, "Menu +" navigation
- **Small tablet**: 900px — single-column sections, compact project cards
- **Phone**: 600px — the reference's mobile type scale and button sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Khandaker Rafiul Islam. All rights reserved.

## Contact

- **Email**: rafiul.islam.khandaker@gmail.com
- **Phone**: +880 1311 183481
- **GitHub**: [rafi0112](https://github.com/rafi0112)
- **LinkedIn**: [Khandaker Rafiul Islam](https://linkedin.com/in/khandaker-rafiul-islam)

---

Built with ❤️ using React, TypeScript, and Vite
