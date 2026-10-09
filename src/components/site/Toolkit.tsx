import { useState } from "react";
import { Reveal } from "./ui";
import { alsoInToolkit, tools, type Tool, type ToolGroup } from "../../data/profile";
import { projects } from "../../data/projects";
import { scrollToId } from "../../lib/motion";

const FILTERS: ("All" | ToolGroup)[] = ["All", "Languages", "Frontend", "Backend", "Data", "DevOps", "AI"];

// Each group gets its own tile tone, like app icons on a home screen.
const TONE: Record<ToolGroup, string> = {
  Languages: "tone-ink",
  Frontend: "tone-slate",
  Backend: "tone-amber",
  Data: "tone-olive",
  DevOps: "tone-steel",
  AI: "tone-amber",
};

export default function Toolkit({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [picked, setPickedRaw] = useState<Tool | null>(null);
  // The last tool stays rendered while the panel closes, so it collapses smoothly.
  const [last, setLast] = useState<Tool | null>(null);
  const setPicked = (next: Tool | null | ((p: Tool | null) => Tool | null)) =>
    setPickedRaw((prev) => {
      const t = typeof next === "function" ? next(prev) : next;
      if (t) setLast(t);
      return t;
    });

  const shown = tools.filter((t) => filter === "All" || t.group === filter);
  const usedIn = last?.used?.map((id) => projects.find((p) => p.id === id)).filter(Boolean) ?? [];

  return (
    <section id="skills" className="sec sec-band">
      <Reveal className="sec-rule">
        <span>02 — The toolkit</span>
        <span>Made to work together</span>
      </Reveal>

      <div className="kit">
        <div className="kit-left">
          <Reveal>
            <p className="eyebrow strong">Backend depth. Full-stack reach.</p>
            <h2 className="sec-title kit-title">
              The stack,
              <br />
              <em>in one terminal.</em>
            </h2>
            <p className="kit-para">
              The tools change. The intention doesn&apos;t: build something useful, dependable, and correct under load.
            </p>
            <div className="kit-hint">
              <span className="kit-hint-arrow" aria-hidden>
                ↗
              </span>
              <p>
                Every tile has a story.
                <br />
                <strong>Open one to see the work behind it.</strong>
              </p>
            </div>
          </Reveal>

          {/* Empty until a tile is picked; then it opens and pushes the text apart. */}
          <div className={`kit-detail ${picked ? "open" : ""}`} aria-live="polite">
            <div className="kit-detail-inner">
              {last && (
                <div className="kit-detail-body" key={last.name}>
                  <span className={`kit-detail-mark ${TONE[last.group]}`} aria-hidden>
                    {last.mark}
                  </span>
                  <div>
                    <span className="eyebrow">{last.group}</span>
                    <b>{last.name}</b>
                    {usedIn.length > 0 ? (
                      <>
                        <p>
                          Used in {usedIn.length === 1 ? "this project" : `${usedIn.length} projects`}:
                        </p>
                        <div className="kit-links">
                          {usedIn.map((p) => (
                            <button
                              key={p!.id}
                              onClick={() => {
                                scrollToId("work");
                                setTimeout(() => onOpenProject(p!.id), 900);
                              }}
                            >
                              {p!.title} ↗
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p>{last.note}</p>
                    )}
                  </div>
                  <button className="kit-detail-x" onClick={() => setPicked(null)} aria-label="Close" tabIndex={picked ? 0 : -1}>
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <Reveal delay={0.06} className="kit-also">
            <p className="eyebrow">Also in the toolkit</p>
            <ul>
              {alsoInToolkit.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="kit-device">
          <div className="kit-filters" role="tablist" aria-label="Filter tools">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>

          <div className="term">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span>rafi@stack:~$ ls ./toolkit</span>
            </div>
            <div className="term-body">
              <p className="eyebrow">Built for the real world.</p>
              <p className="term-title">
                A stack of
                <br />
                possibilities.
              </p>
              <p className="term-sub">My engineering toolkit</p>
              <div className="tiles">
                {shown.map((t, i) => (
                  <button
                    key={t.name}
                    className={`tile ${picked?.name === t.name ? "on" : ""}`}
                    style={{ ["--i" as string]: i }}
                    onClick={() => setPicked((p) => (p?.name === t.name ? null : t))}
                    aria-pressed={picked?.name === t.name}
                  >
                    <span className={`tile-mark ${TONE[t.group]}`}>{t.mark}</span>
                    <span className="tile-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
