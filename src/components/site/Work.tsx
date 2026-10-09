import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHead } from "./ui";
import ArchDiagram from "../ArchDiagram";
import { projects, type Project } from "../../data/projects";
import { gsap, lockScroll, ScrollTrigger } from "../../lib/motion";

// Flagship first, then newest first.
const ORDER = ["oi-tesla-pool", "news-scraper", "gravity-cloud", "nestmate", "krishikonnect"];
const ordered = ORDER.map((id) => projects.find((p) => p.id === id)!).filter(Boolean);

const isCode = (l: { label: string }) => l.label.includes("⌥");
const cleanLabel = (l: { label: string }) => l.label.replace(/^[⌥↗]\s*/, "");

function ProjectIcon({ project }: { project: Project }) {
  return project.image ? (
    <span className="project-icon img">
      <img src={project.image} alt="" />
    </span>
  ) : (
    <span className="project-icon" aria-hidden>
      {project.icon}
    </span>
  );
}

function Card({ project, index, onStory }: { project: Project; index: number; onStory: () => void }) {
  const flagship = index === 0;
  return (
    <article className={`project-card ${flagship ? "featured" : ""}`}>
      <div className="project-top">
        <span className="tiny-label">
          {String(index + 1).padStart(2, "0")} / {flagship ? "Flagship" : project.status === "live" ? "Live project" : "Completed"} · {project.when}
        </span>
        <button className="project-corner" onClick={onStory} aria-label={`Open the ${project.title} story`}>
          ↗
        </button>
      </div>

      <div className="project-visual">
        <span className="project-orbit" aria-hidden />
        {flagship && (
          <span className="project-stamp" aria-hidden>
            Built for
            <em>the real world.</em>
          </span>
        )}
        <div className="project-art" aria-hidden>
          <ArchDiagram spec={project.arch} listBelow={0} maxScale={1} label={`${project.title} architecture`} />
        </div>
        <span className="interface-label">System study</span>
        {/* One transparent button over the whole visual keeps the markup valid. */}
        <button className="project-hit" onClick={onStory} aria-label={`Open the ${project.title} story`} />
      </div>

      <div className="project-copy">
        <div className="project-title">
          <ProjectIcon project={project} />
          <h3>{project.title}</h3>
        </div>
        <p>{project.summary}</p>
        <div className="tags">
          {project.techs.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="store-links">
          {project.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
              {isCode(l) ? `${cleanLabel(l)} ↗` : "Live ↗"}
            </a>
          ))}
          <button onClick={onStory}>Project story ↗</button>
        </div>
      </div>
    </article>
  );
}

type Tab = "story" | "architecture" | "tradeoffs";
const TABS: { id: Tab; label: string }[] = [
  { id: "story", label: "Story" },
  { id: "architecture", label: "Architecture" },
  { id: "tradeoffs", label: "Trade-offs" },
];

function Story({ project, onClose }: { project: Project; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("story");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="story-overlay" data-lenis-prevent onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="story" role="dialog" aria-modal="true" aria-labelledby="story-title">
        <div className="story-head">
          <div>
            <p className="eyebrow">Project story · {project.when}</p>
            <h3 id="story-title">
              <ProjectIcon project={project} /> {project.title}
            </h3>
            <p className="story-sub">{project.subtitle.replace(/^\/\/\s*/, "")}</p>
          </div>
          <button ref={closeRef} className="story-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="story-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="story-body" key={tab}>
          {tab === "story" && (
            <ul className="story-points">
              {project.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {tab === "architecture" && <ArchDiagram spec={project.arch} label={`${project.title} architecture`} maxScale={1.05} />}
          {tab === "tradeoffs" && (
            <div className="story-tradeoffs">
              {project.tradeoffs.map((t) => (
                <div key={t.title}>
                  <span className="eyebrow accent">{t.kind}</span>
                  <b>{t.title}</b>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="story-foot">
          {project.links.map((l) => (
            <a key={l.url} className="btn-ghost" href={l.url} target="_blank" rel="noopener noreferrer">
              {isCode(l) ? `${cleanLabel(l)} ↗` : "Live demo ↗"}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Work({ openId, setOpenId }: { openId: string | null; setOpenId: (id: string | null) => void }) {
  const open = projects.find((p) => p.id === openId) ?? null;
  // Stable, so the dialog's open/close effect runs once per opening.
  const close = useCallback(() => setOpenId(null), [setOpenId]);
  const stageRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);

  /*
    On every screen size the stage pins under the nav and vertical scrolling
    slides the rail sideways, card by card. With reduced motion it falls
    back to a plain swipeable row that snaps to each card.
  */
  useEffect(() => {
    const stage = stageRef.current;
    const win = windowRef.current;
    const rail = railRef.current;
    const bar = barRef.current;
    if (!stage || !win || !rail || !bar) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      setPinned(true);
      const distance = () => Math.max(0, rail.scrollWidth - win.clientWidth);
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          // Pin just under the nav; if the stage is shorter than the space
          // left, centre it in the viewport instead.
          start: () => {
            const top = window.innerWidth < 1001 ? 76 : 96;
            return stage.offsetHeight + top + 16 < window.innerHeight ? "center center" : `top ${top}px`;
          },
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => {
        setPinned(false);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(rail, { clearProps: "transform" });
      };
    });

    // Swipe mode: the bar follows the native horizontal scroll.
    const onSwipe = () => {
      const max = win.scrollWidth - win.clientWidth;
      bar.style.transform = `scaleX(${max > 0 ? win.scrollLeft / max : 0})`;
    };
    win.addEventListener("scroll", onSwipe, { passive: true });

    // Fonts, images and diagrams settle after the first paint and move this
    // section down the page, so re-measure the pin when anything above it
    // (or the rail itself) changes size. Watching the whole page would loop:
    // every refresh briefly removes the pin spacer and changes its height.
    let t = 0;
    const refresh = () => {
      clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const ro = new ResizeObserver(refresh);
    const section = stage.closest("section");
    let el = section?.previousElementSibling;
    while (el) {
      ro.observe(el);
      el = el.previousElementSibling;
    }
    section?.querySelectorAll(".sec-head").forEach((h) => ro.observe(h));
    ro.observe(rail);
    document.fonts?.ready.then(refresh);

    return () => {
      mm.revert();
      win.removeEventListener("scroll", onSwipe);
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <section id="work" className="sec work-sec">
      <SectionHead
        index="03"
        label="Selected work"
        aside="Ideas, out in the world"
        title="Things I've"
        accent="built."
        side={
          <p>
            Real products, wired with care.
            <br />
            Each one ships with its architecture — and the trade-offs behind it.
          </p>
        }
      />

      <div className={`work-stage ${pinned ? "is-pinned" : ""}`} ref={stageRef}>
        <div className="work-window" ref={windowRef} tabIndex={pinned ? -1 : 0} aria-label="Projects">
          <div className="work-rail" ref={railRef}>
            {ordered.map((p, i) => (
              <Card key={p.id} project={p} index={i} onStory={() => setOpenId(p.id)} />
            ))}
          </div>
        </div>
        <div className="work-meter">
          <span className="work-track">
            <span ref={barRef} />
          </span>
          <span className="tiny-label">{pinned ? "Keep scrolling to explore →" : "Swipe to explore →"}</span>
        </div>
      </div>

      {open && <Story project={open} onClose={close} />}
    </section>
  );
}
