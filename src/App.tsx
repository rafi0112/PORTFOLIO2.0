import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Navigation from "./components/Navigation";
import ScrollProgress from "./components/ScrollProgress";
import Ambient from "./components/Ambient";
import Bird from "./components/Bird";
import CommandPalette from "./components/CommandPalette";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Playground from "./components/sections/Playground";
import Projects from "./components/sections/Projects";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Footer from "./components/Footer";
import { STORAGE_KEY, getTheme, initialThemeId, prefersReducedMotion } from "./themes";
import { scrollToId, startSmoothScroll } from "./lib/motion";
import { useInteractions } from "./lib/useInteractions";

function applyTheme(id: string) {
  const root = document.documentElement;
  root.setAttribute("data-theme", id);
  root.setAttribute("data-mode", getTheme(id).mode);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* storage blocked — theme still applies for this visit */
  }
}

export default function App() {
  const [themeId, setThemeId] = useState(initialThemeId);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("hero");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useInteractions();

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  /** Switch theme with an ink-spill circle growing from `origin`. */
  const pickTheme = useCallback(
    (id: string, origin?: { x: number; y: number }) => {
      if (id === themeId) return;
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };
      if (!doc.startViewTransition || prefersReducedMotion()) {
        setThemeId(id);
        return;
      }
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const vt = doc.startViewTransition(() => {
        flushSync(() => setThemeId(id));
        applyTheme(id);
      });
      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      });
    },
    [themeId],
  );

  const gotoSection = useCallback((id: string) => {
    scrollToId(id);
    setMobileMenuOpen(false);
  }, []);

  // Ctrl/Cmd + K (or "/") opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "skills", "playground", "projects", "about", "contact"];
      let current = "hero";

      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element && window.scrollY >= element.offsetTop - 120) {
          current = id;
        }
      });

      setActiveNav(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Ambient themeId={themeId} />
      <ScrollProgress />
      <Navigation
        themeId={themeId}
        pickTheme={pickTheme}
        openPalette={() => setPaletteOpen(true)}
        gotoSection={gotoSection}
        activeNav={activeNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="page">
        <Hero />
        <Skills />
        <Playground />
        <Projects />
        <About />
        <Contact />
      </div>

      <Footer gotoSection={gotoSection} />
      <Bird />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        gotoSection={gotoSection}
        pickTheme={pickTheme}
        themeId={themeId}
      />
    </>
  );
}
