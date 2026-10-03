import { useEffect, useMemo, useRef, useState } from "react";
import { THEMES } from "../themes";
import { lockScroll } from "../lib/motion";

interface Command {
  id: string;
  group: "Go to" | "Projects" | "Themes" | "Actions";
  label: string;
  icon: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  gotoSection: (id: string) => void;
  pickTheme: (id: string) => void;
  themeId: string;
}

const EMAIL = "rafiul.islam.khandaker@gmail.com";

export default function CommandPalette({ open, onClose, gotoSection, pickTheme, themeId }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => gotoSection(id);
    const open = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");
    return [
      { id: "g-hero", group: "Go to", label: "Home", icon: "⌂", run: go("hero"), keywords: "top start" },
      { id: "g-skills", group: "Go to", label: "Skills", icon: "01", run: go("skills"), keywords: "stack tools" },
      { id: "g-lab", group: "Go to", label: "Playground — scale a system", icon: "↯", run: go("playground"), keywords: "lab simulator load balancer cache replicas" },
      { id: "g-projects", group: "Go to", label: "Selected work", icon: "02", run: go("projects"), keywords: "projects portfolio" },
      { id: "g-about", group: "Go to", label: "About", icon: "03", run: go("about"), keywords: "background education" },
      { id: "g-contact", group: "Go to", label: "Contact", icon: "04", run: go("contact"), keywords: "hire email message" },
      { id: "p-oi", group: "Projects", label: "Oi Tesla Pool — live demo", icon: "🛺", hint: "↗", run: open("https://oi-tesla-pool.vercel.app"), keywords: "ride pooling supabase" },
      { id: "p-nest", group: "Projects", label: "NestMate — live demo", icon: "🏠", hint: "↗", run: open("https://nestmate00.vercel.app"), keywords: "roommate" },
      { id: "p-gravity", group: "Projects", label: "GravityCloud — source", icon: "☁️", hint: "↗", run: open("https://github.com/rafi0112/Gravity-Cloud/tree/main/GravityCloud"), keywords: "ai autoscaling docker fastapi distributed" },
      { id: "p-news", group: "Projects", label: "News Autopilot — live demo", icon: "📰", hint: "↗", run: open("https://news-paper-scrap.vercel.app"), keywords: "news bangladesh palestine scraper feed shorts stories pwa facebook github actions supabase fastapi vercel" },
      { id: "p-krishi", group: "Projects", label: "KrishiKonnect — source", icon: "🌾", hint: "↗", run: open("https://github.com/rafi0112/agricultural-app"), keywords: "agri farmers mobile" },
      ...THEMES.map<Command>((t) => ({
        id: `t-${t.id}`,
        group: "Themes",
        label: `Theme: ${t.name}`,
        icon: t.id === themeId ? "●" : "○",
        hint: t.mode,
        keywords: "colour color mood palette",
        run: () => pickTheme(t.id),
      })),
      {
        id: "a-copy",
        group: "Actions",
        label: "Copy email address",
        icon: "✉",
        hint: EMAIL,
        keywords: "mail contact",
        run: () => {
          navigator.clipboard?.writeText(EMAIL).then(() => setCopied(true));
        },
      },
      {
        id: "a-resume",
        group: "Actions",
        label: "Download resume",
        icon: "↓",
        hint: "PDF",
        keywords: "cv pdf download",
        run: () => {
          const a = document.createElement("a");
          a.href = "/resume.pdf";
          a.download = "Khandaker_Rafiul_Islam_Resume.pdf";
          a.click();
        },
      },
      { id: "a-gh", group: "Actions", label: "Open GitHub", icon: "⌥", hint: "↗", run: open("https://github.com/rafi0112") },
      { id: "a-li", group: "Actions", label: "Open LinkedIn", icon: "in", hint: "↗", run: open("https://www.linkedin.com/in/khandaker-rafiul-islam-6b80882b2/") },
    ];
  }, [gotoSection, pickTheme, themeId]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    const words = q.split(/\s+/);
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    setQuery("");
    setActive(0);
    setCopied(false);
    lockScroll(true);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      lockScroll(false);
      returnFocus.current?.focus?.();
    };
  }, [open]);

  // Fit the dialog into the part of the screen the on-screen keyboard leaves
  // visible. Android Chrome also shrinks the page (see the viewport meta tag);
  // iOS Safari doesn't, so read the visual viewport directly.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!open || !vv) return;
    const fit = () => {
      const el = overlayRef.current;
      if (!el) return;
      el.style.setProperty("--vv-top", `${vv.offsetTop}px`);
      el.style.setProperty("--vv-h", `${vv.height}px`);
    };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => {
      vv.removeEventListener("resize", fit);
      vv.removeEventListener("scroll", fit);
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const run = (c: Command) => {
    if (c.id === "a-copy") return c.run();
    // Close first: smooth scroll ignores scrollTo while the page is locked.
    onClose();
    setTimeout(c.run, 40);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus in the dialog
    }
  };

  let lastGroup = "";
  return (
    // data-lenis-prevent: while the page is locked, Lenis cancels every wheel and
    // touch scroll it sees — this opts the palette out so its list can scroll.
    <div ref={overlayRef} className="cmdk-overlay" data-lenis-prevent onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Jump to a section, project or theme…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined}
        />
        <div className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
          {results.length === 0 && <div className="cmdk-empty">Nothing matches “{query}”.</div>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? <div className="cmdk-group">{c.group}</div> : null;
            lastGroup = c.group;
            return (
              <div key={c.id}>
                {header}
                <div
                  id={`cmdk-${c.id}`}
                  data-idx={i}
                  className="cmdk-item"
                  role="option"
                  aria-selected={i === active}
                  onPointerMove={() => setActive(i)}
                  onClick={() => run(c)}
                >
                  <span className="ic" aria-hidden>
                    {c.icon}
                  </span>
                  {c.id === "a-copy" && copied ? "Copied to clipboard ✓" : c.label}
                  {c.hint && <span className="hint">{c.hint}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="cmdk-foot">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
