import { useEffect, useState } from "react";
import { scrollToId } from "../../lib/motion";

export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
];

type Theme = "light" | "dark";

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light",
  );
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rk-theme", next);
    } catch {
      /* storage blocked — the theme still applies for this visit */
    }
    setTheme(next);
  };
  return [theme, toggle];
}

export default function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, toggleTheme] = useTheme();

  // Highlight the section that owns the middle of the screen.
  useEffect(() => {
    const els = ["home", ...SECTIONS.map((s) => s.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === "home" ? "" : e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the phone menu on a tap outside it or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!t.closest(".nav-sheet") && !t.closest(".menu-toggle")) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <header className="nav">
        <button className="logo" onClick={() => go("home")} aria-label="Back to top">
          RK<i aria-hidden />
        </button>

        <nav className="nav-pill" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={active === s.id ? "on" : ""}
              aria-current={active === s.id ? "true" : undefined}
              onClick={() => go(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="nav-end">
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light theme" : "Dark theme"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
              </svg>
            )}
          </button>
          {/* Phones: one "Menu +" pill, like the reference. */}
          <button className="menu-toggle" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((o) => !o)}>
            <span>Menu</span>
            <span aria-hidden>{open ? "−" : "+"}</span>
          </button>
        </div>
      </header>

      <div id="nav-sheet" className={`nav-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={active === s.id ? "on" : ""}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${0.03 * i}s` : "0s" }}
            onClick={() => go(s.id)}
          >
            {s.label}
          </button>
        ))}
        {/* On phones the theme switch lives inside the menu. */}
        <button className="sheet-theme" tabIndex={open ? 0 : -1} onClick={toggleTheme}>
          {theme === "dark" ? "Light theme" : "Dark theme"}
          <span aria-hidden>{theme === "dark" ? "☀" : "☾"}</span>
        </button>
      </div>
    </>
  );
}
