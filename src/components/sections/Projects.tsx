import { useState } from "react";
import RevealOnScroll from "../RevealOnScroll";
import ArchDiagram from "../ArchDiagram";
import { projects, type Project } from "../../data/projects";

type Tab = "story" | "architecture" | "tradeoffs";

const TABS: { id: Tab; label: string }[] = [
  { id: "story", label: "Story" },
  { id: "architecture", label: "Architecture" },
  { id: "tradeoffs", label: "Trade-offs" },
];

const PANEL_LABEL: Record<Tab, string> = {
  story: "Story · what it does",
  architecture: "Architecture · v1 · as deployed",
  tradeoffs: "Trade-offs · and why",
};

// On phones, long stories show the first few points behind a toggle.
const PREVIEW_POINTS = 3;

function CaseFile({ project, index, total }: { project: Project; index: number; total: number }) {
  const [tab, setTab] = useState<Tab>("architecture");
  const [expanded, setExpanded] = useState(false);
  // Hiding a single point behind a toggle isn't worth the extra tap.
  const collapsible = project.points.length > PREVIEW_POINTS + 1;
  const panelId = `${project.id}-panel`;
  const pad = (n: number) => String(n).padStart(2, "0");

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    document.getElementById(`${project.id}-tab-${next.id}`)?.focus();
  };

  return (
    <article className={`case ${project.featured ? "featured" : ""}`}>
      <div className="case-side">
        <div className="case-tabs" role="tablist" aria-label={`${project.title} details`} onKeyDown={onTabKey}>
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`${project.id}-tab-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={panelId}
              tabIndex={tab === t.id ? 0 : -1}
              className="case-tab"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="case-badges">
          {project.featured && <span className="case-badge acc">★ Featured</span>}
          <span className="case-badge">{project.status === "live" ? "● Live" : "✓ Completed"}</span>
        </div>
        <h3 className="case-title">{project.title}</h3>
        <div className="case-subtitle">{project.subtitle}</div>
        <div className="case-banner">
          {project.image ? <img src={project.image} alt="" /> : <span className="case-glyph">{project.icon}</span>}
        </div>
        <div className="proj-techs">
          {project.techs.map((t) => (
            <span key={t} className="proj-tech">
              {t}
            </span>
          ))}
        </div>
        <div className="proj-links">
          {project.links.map((l) => (
            <a key={l.url + l.label} className="proj-link" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
        <div className="case-no">
          N° {pad(index + 1)} of {pad(total)}
        </div>
      </div>

      <div className="case-main">
        <div className="case-panel-label">{PANEL_LABEL[tab]}</div>
        <div id={panelId} role="tabpanel" aria-labelledby={`${project.id}-tab-${tab}`} className="case-panel" key={tab}>
          {tab === "story" && (
            <>
              <ul className={`proj-points ${collapsible && !expanded ? "collapsed" : ""}`}>
                {project.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {collapsible && (
                <button className="proj-more" aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}>
                  {expanded ? "Show less ↑" : `Show all ${project.points.length} details ↓`}
                </button>
              )}
            </>
          )}

          {tab === "architecture" && (
            <>
              <ArchDiagram spec={project.arch} label={`${project.title} architecture`} />
              <div className="tradeoff-strip">
                {project.tradeoffs.map((t) => (
                  <div key={t.title} className="tradeoff-chip">
                    <span>{t.kind}</span>
                    <b>{t.title}</b>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "tradeoffs" && (
            <div className="tradeoffs">
              {project.tradeoffs.map((t, i) => (
                <div key={t.title} className="tradeoff" style={{ ["--i" as string]: i }}>
                  <span className="tradeoff-kind">{t.kind}</span>
                  <b>{t.title}</b>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">
            <span className="sh-num">02</span> Selected work
          </div>
          <h2 className="sh-title">
            Things I&apos;ve <em>built</em>
          </h2>
          <p className="sh-sub">Every project ships with its architecture — flip a card to see how it's wired, and why.</p>
        </div>
      </RevealOnScroll>

      <div className="cases">
        {projects.map((p, i) => (
          <RevealOnScroll key={p.id} delay={0.08}>
            <CaseFile project={p} index={i} total={projects.length} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
