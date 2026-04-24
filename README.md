# Khandaker Rafiul Islam — Portfolio (React)

A modern, responsive portfolio web application built with React, Vite, and TypeScript. Features smooth animations, dark/light theme toggle, interactive skills carousel, and a contact form.

## Features

- 🌙 **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- ✨ **Smooth Animations** - Scroll reveal animations, typing effect, and floating elements
- 📱 **Fully Responsive** - Mobile-first design with hamburger menu
- 🎨 **Modern UI** - Custom CSS with CSS variables for easy theming
- ⚡ **Fast Performance** - Built with Vite for optimal build times
- 🎯 **Interactive Components** - Marquee skills carousel, hover effects, and smooth transitions

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with Custom Properties (CSS Variables)
- **Canvas**: Interactive star background with mouse gravity

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
│   ├── Navigation.tsx          # Top navbar with theme toggle
│   ├── ScrollProgress.tsx      # Scroll progress bar
│   ├── StarsBackground.tsx     # Canvas-based star animation
│   ├── Footer.tsx              # Footer component
│   ├── RevealOnScroll.tsx      # Scroll reveal animation wrapper
│   └── sections/
│       ├── Hero.tsx            # Hero section with typing effect
│       ├── Skills.tsx          # Skills marquee carousel
│       ├── Projects.tsx        # Featured projects grid
│       ├── About.tsx           # About section with education
│       └── Contact.tsx         # Contact form and social links
├── App.tsx                     # Main app component
├── main.tsx                    # React entry point
└── index.css                   # Global styles and theme system
server/
├── index.js                    # Express API for contact form
└── .env.example                # Backend environment template
```

## Features Overview

### Hero Section

- Animated name display
- Typing effect for role description
- CTA buttons (Email, GitHub, LinkedIn)
- Info chips (location, stack, status)

### Skills Section

- Dual marquee scrolling carousels
- Color-coded skill cards
- Category labels
- Hover animations

### Projects Section

- Project cards with banners
- Status badges (Live, Completed)
- Tech stack labels
- Project links

### About Section

- Personal bio
- Education details with GPA
- Achievements section
- Key facts cards

### Contact Section

- Contact information cards
- Contact form with validation
- Social media links
- Form submission feedback

## Theme System

The portfolio uses CSS custom properties for theming. Change theme by updating the `data-theme` attribute on the `<html>` element:

```typescript
document.documentElement.setAttribute("data-theme", "light" | "dark");
```

### Color Palette

**Dark Theme**:

- Primary: `#00E396` (Green accent)
- Background: `#050A08`
- Surface: `#101A15`
- Text: `#EDF7F2`

**Light Theme**:

- Primary: `#00965C` (Dark Green)
- Background: `#F2FAF6`
- Surface: `#FFFFFF`
- Text: `#081A10`

## Responsive Breakpoints

- **Desktop**: 1280px+ (full layout)
- **Tablet**: 900px (2-column → 1-column)
- **Mobile**: 700px (hide nav center, show hamburger)
- **Small Mobile**: 480px (optimized padding and button sizes)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Khandaker Rafiul Islam. All rights reserved.

## Contact

- **Email**: rafi011235@gmail.com
- **Phone**: +880 1311 183481
- **GitHub**: [rafi0112](https://github.com/rafi0112)
- **LinkedIn**: [Khandaker Rafiul Islam](https://linkedin.com/in/khandaker-rafiul-islam)

---

Built with ❤️ using React, TypeScript, and Vite
