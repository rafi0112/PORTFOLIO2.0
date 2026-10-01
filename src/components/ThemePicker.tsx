import { useEffect, useRef, useState } from "react";
import { THEMES, getTheme } from "../themes";

interface ThemePickerProps {
  themeId: string;
  onPick: (id: string, origin: { x: number; y: number }) => void;
}

export default function ThemePicker({ themeId, onPick }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = getTheme(themeId);

  useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, THEMES.findIndex((t) => t.id === themeId));
    optionRefs.current[idx]?.focus();

    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // Focus only when the menu opens, not on every theme change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = optionRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Escape") {
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>(".theme-trigger")?.focus();
    }
  };

  return (
    <div className="theme-picker" ref={rootRef}>
      <button
        className="theme-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current.name}. Change theme`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="swatch-dots" aria-hidden>
          {current.swatch.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
        <span className="theme-name">{current.name}</span>
      </button>

      {open && (
        <div className="theme-menu" role="menu" onKeyDown={onMenuKey}>
          <div className="theme-menu-title">Pick a mood</div>
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (optionRefs.current[i] = el)}
              className="theme-option"
              role="menuitemradio"
              aria-checked={t.id === themeId}
              onClick={(e) => {
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                // Keyboard clicks report 0,0 — spill from the row instead.
                const x = e.clientX || r.left + 20;
                const y = e.clientY || r.top + r.height / 2;
                onPick(t.id, { x, y });
                setOpen(false);
              }}
            >
              <span className="swatch-dots" aria-hidden>
                {t.swatch.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span>
                {t.name}
                <br />
                <span className="mode">{t.mode}</span>
              </span>
              {t.id === themeId && (
                <span className="tick" aria-hidden>
                  ●
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
