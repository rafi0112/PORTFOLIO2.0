import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import { scrollToId } from "../../lib/motion";
import { prefersReducedMotion } from "../../themes";

const DISMISSED = "rk-guide-dismissed";
const ASPECT = 1.5; // avatar.webp is 1024 × 1536

/*
  One avatar for the whole page. At the top it stands in the hero (it takes
  the place of `.hero-avatar-slot`); as the first screen scrolls away it
  glides and shrinks into the bottom-right corner, where it docks as a small
  "a quick hello" card. Position and size are interpolated from the scroll
  position on every frame, so the move is perfectly smooth in both
  directions.
*/
export default function AvatarGuide({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISSED) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const el = ref.current;
    const slot = document.querySelector<HTMLElement>(".hero-avatar-slot");
    if (!el || !slot) return;
    const reduced = prefersReducedMotion();
    let raf = 0;
    let lastDocked = false;

    const frame = () => {
      raf = 0;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const small = W < 640;
      const pad = small ? 14 : 24;
      const dockW = small ? 104 : 130;
      const dockH = dockW * ASPECT;

      // The hero slot, in page coordinates.
      const r = slot.getBoundingClientRect();
      const slotTop = r.top + window.scrollY;
      const startX = r.left;
      const startW = r.width;
      const startH = startW * ASPECT;

      // Don't leave until the visitor has seen the whole avatar: until then
      // it scrolls with the page like any other content, then it glides
      // down into the corner over three-quarters of a screen.
      const leave = Math.max(0, slotTop + startH - H + 24);
      const end = H * 0.75;
      const raw = Math.min(1, Math.max(0, (window.scrollY - leave) / end));
      const p = reduced ? (raw < 0.5 ? 0 : 1) : raw;
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic

      const fromY = slotTop - Math.min(window.scrollY, leave);
      const x = startX + (W - dockW - pad - startX) * e;
      const y = fromY + (H - dockH - pad - fromY) * e;
      const s = (startW + (dockW - startW) * e) / startW;

      el.style.width = `${startW}px`;
      el.style.height = `${startH}px`;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      el.style.setProperty("--dock", String(Math.max(0, (e - 0.7) / 0.3)));
      // Counter-scale the docked chrome so the chip and × stay a constant size.
      el.style.setProperty("--inv", String(1 / s));

      const isDocked = e > 0.98;
      if (isDocked !== lastDocked) {
        lastDocked = isDocked;
        setDocked(isDocked);
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const ro = new ResizeObserver(request);
    ro.observe(slot);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const dismiss = () => {
    setOpen(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED, "1");
    } catch {
      /* storage blocked — it simply returns next visit */
    }
  };

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  // Once dismissed it still stands in the hero, but no longer follows you down.
  const hideDocked = dismissed && docked && !open;

  return (
    <>
      <div
        ref={ref}
        className={`guide ${docked ? "docked" : ""} ${hideDocked ? "gone" : ""}`}
        aria-hidden={!docked}
      >
        <span className="guide-panel" aria-hidden />
        <button
          className="guide-figure"
          onClick={() => setOpen(!open)}
          tabIndex={docked ? 0 : -1}
          aria-label="Open a quick hello from Rafiul"
          aria-expanded={open}
        >
          <img src="/avatar.webp" alt="" draggable={false} />
        </button>
        <div className="guide-chrome">
          <button className="guide-x" onClick={open ? () => setOpen(false) : dismiss} tabIndex={docked ? 0 : -1} aria-label={open ? "Close greeting" : "Hide"}>
            ×
          </button>
          <button className="chip-hello" onClick={() => setOpen(!open)} tabIndex={docked ? 0 : -1}>
            A quick hello ↗
          </button>
        </div>
      </div>

      {open && (
        <div className="hello-card" role="dialog" aria-label="Hello from Rafiul">
          <p className="eyebrow accent">A quick hello</p>
          <p className="hello-text">
            Hi, I&apos;m <b>{profile.first}</b> 👋 I build full-stack products with a soft spot for the backend — the parts
            that keep data correct when real people use them at once.
          </p>
          <div className="hello-actions">
            <button onClick={() => go("work")}>See my work →</button>
            <a href={profile.resume} download={profile.resumeName}>
              Download résumé ↓
            </a>
            <button onClick={() => go("contact")}>Say hello ↗</button>
          </div>
        </div>
      )}
    </>
  );
}
