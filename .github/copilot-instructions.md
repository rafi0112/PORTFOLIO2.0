# Portfolio React App — Development Guide

This is a modern, responsive portfolio web application built with React, Vite, and TypeScript.

## Project Overview

The portfolio showcases a software engineer's skills, projects, and background with smooth animations, dark/light theme toggle, and an interactive contact form.

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **CSS3 Variables** - Dynamic theming
- **Canvas API** - Interactive star background

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx       - Top navbar
│   ├── ScrollProgress.tsx   - Scroll indicator
│   ├── StarsBackground.tsx  - Canvas animations
│   ├── Footer.tsx           - Footer
│   ├── RevealOnScroll.tsx   - Scroll reveal wrapper
│   └── sections/
│       ├── Hero.tsx         - Landing section
│       ├── Skills.tsx       - Marquee carousel
│       ├── Projects.tsx     - Project showcase
│       ├── About.tsx        - Background info
│       └── Contact.tsx      - Contact form
├── App.tsx                  - Main component
├── main.tsx                 - Entry point
└── index.css                - Global styles
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Development Workflow

### Theme System

Theme is controlled via the `data-theme` attribute on the `<html>` element:

```typescript
// Dark theme (default)
document.documentElement.setAttribute("data-theme", "dark");

// Light theme
document.documentElement.setAttribute("data-theme", "light");
```

Theme preference is toggled via the button in the navigation bar.

### Adding New Sections

To add a new section:

1. Create a component in `src/components/sections/`
2. Import it in `App.tsx`
3. Add the section element with an `id`
4. Update the `sections` array in `App.tsx` for nav highlighting

### Customizing Content

All portfolio content is stored in component data structures:

- **Skills** → `src/components/sections/Skills.tsx`
- **Projects** → `src/components/sections/Projects.tsx`
- **Education** → `src/components/sections/About.tsx`
- **Contact Info** → `src/components/sections/Contact.tsx`

### Styling

Global styles are in `src/index.css`. CSS custom properties enable theme switching:

```css
:root {
  --bg: #050a08; /* Background */
  --text: #edf7f2; /* Text color */
  --acc: #00e396; /* Accent (green) */
}
```

Update these variables to customize colors globally.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimization

- Lazy loading with Intersection Observer
- Canvas-based background (GPU accelerated)
- CSS animations for smooth performance
- Minimal JavaScript runtime

## Common Tasks

### Update Portfolio Content

1. **Skills**: Edit `skills1` and `skills2` arrays in `Skills.tsx`
2. **Projects**: Edit `projects` array in `Projects.tsx`
3. **Contact Info**: Update links in `Contact.tsx` and `Footer.tsx`
4. **Education**: Edit education items in `About.tsx`

### Modify Theme Colors

Edit the CSS custom properties in `index.css` for dark and light themes:

```css
[data-theme="dark"] {
  --bg: #050a08;
  --acc: #00e396;
  /* ... more colors */
}
```

### Add External Links

Update links in components that reference social media or projects:

```typescript
<a href="https://github.com/username" target="_blank">GitHub</a>
```

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### CSS Not Loading

- Ensure `index.css` is imported in `main.tsx`
- Check that CSS variables are defined in `index.css`

### TypeScript Errors

- Run `npm run build` to check for type errors
- VS Code should show inline errors with proper setup

## Deployment

### Build for Production

```bash
npm run build
```

Output files are in `dist/`. Deploy these to your hosting platform:

- **Vercel**: Connect GitHub repo, auto-deploys on push
- **Netlify**: Drag `dist` folder or connect GitHub
- **GitHub Pages**: Build and push `dist` to `gh-pages` branch

### Environment Variables

Currently no environment variables needed. If adding API calls:

1. Create `.env` file
2. Add variables prefixed with `VITE_`
3. Access via `import.meta.env.VITE_*`

## Browser DevTools

Enable React Developer Tools extension for debugging components and state.

## Future Enhancements

- Blog section with markdown rendering
- Dark mode auto-detection
- Internationalization (i18n)
- Backend contact form integration
- Analytics integration
- Service worker for offline support

## Support & Questions

For development questions, refer to:

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

Last Updated: 2026
