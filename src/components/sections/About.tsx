import { useEffect, useRef } from "react";
import RevealOnScroll from "../RevealOnScroll";
import { gsap, ScrollTrigger } from "../../lib/motion";
import { prefersReducedMotion } from "../../themes";

interface Commit {
  refs?: { label: string; head?: boolean }[];
  meta: string;
  title: string;
  detail: string;
  branch?: boolean;
  root?: boolean;
}

// Newest first, the way `git log` reads.
const log: Commit[] = [
  {
    refs: [{ label: "HEAD → main", head: true }, { label: "open-to-work" }],
    meta: "now",
    title: "Looking for backend & full-stack roles",
    detail: "internships · full-time · interesting projects",
  },
  {
    meta: "tag: shipped×5",
    title: "Oi Tesla Pool · NestMate · GravityCloud · News Autopilot · KrishiKonnect",
    detail: "release notes → see Selected work",
  },
  {
    branch: true,
    meta: "branch: competitive-programming",
    title: "LeetCode & Codeforces",
    detail: "focus: optimized algorithm design",
  },
  {
    meta: "2021 — present",
    title: "B.Sc. Computer Science & Engineering · Jagannath University",
    detail: "CGPA 3.25 / 4.00",
  },
  {
    root: true,
    meta: "2019 — 2020 · initial commit",
    title: "HSC Science · Birshrestho Munsi Abdur Rouf Public College",
    detail: "GPA 5.00 / 5.00",
  },
];

export default function About() {
  const logRef = useRef<HTMLOListElement>(null);

  // The rail draws itself as you scroll and each commit lands on it in turn.
  useEffect(() => {
    const list = logRef.current;
    if (!list || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        list,
        { "--rail": 0 },
        {
          "--rail": 1,
          ease: "none",
          scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
        },
      );
      gsap.utils.toArray<HTMLElement>(".commit", list).forEach((c) => {
        gsap.from(c, {
          opacity: 0,
          x: 18,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 85%", once: true },
        });
      });
    }, list);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section id="about">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">
            <span className="sh-num">03</span> About
          </div>
          <h2 className="sh-title">
            A bit of <em>history</em>
          </h2>
        </div>
      </RevealOnScroll>

      <div className="about-grid">
        <RevealOnScroll delay={0.08}>
          <div className="about-text">
            <p>
              Hi — I'm <strong>Khandaker Rafiul Islam</strong>, a Computer Science student at Jagannath University, Dhaka.
              My focus is <strong>backend engineering</strong> and designing systems that scale under real-world load.
            </p>
            <p>
              I'm fluent in the <strong>MERN stack</strong>, Go, and Python, and I apply rigorous
              <strong> Data Structures & Algorithms</strong> thinking to every system I build — from schema design to
              responsive UI.
            </p>
            <p>
              Outside of project work, I sharpen my problem-solving on
              <strong> LeetCode</strong> and <strong>Codeforces</strong>.
            </p>
            <div className="about-facts">
              <div className="fact">
                <div className="fact-label">Region</div>
                <div className="fact-val">Dhaka, Bangladesh</div>
              </div>
              <div className="fact">
                <div className="fact-label">Protocols</div>
                <div className="fact-val">English · Bangla</div>
              </div>
              <div className="fact">
                <div className="fact-label">Endpoint</div>
                <div className="fact-val fact-email">rafiul.islam.khandaker@gmail.com</div>
              </div>
              <div className="fact">
                <div className="fact-label">Status</div>
                <div className="fact-val" style={{ color: "var(--acc)" }}>
                  Open to work ✓
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.16}>
          <div className="term">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span>$ git log --graph rafi</span>
            </div>
            <ol className="gitlog" ref={logRef}>
              {log.map((c) => (
                <li key={c.title} className={`commit ${c.branch ? "branch" : ""} ${c.root ? "root" : ""} ${c.refs ? "head" : ""}`}>
                  {c.refs && (
                    <div className="commit-refs">
                      {c.refs.map((r) => (
                        <span key={r.label} className={r.head ? "head" : ""}>
                          {r.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {!c.refs && <span className="commit-meta">{c.meta}</span>}
                  <b className="commit-title">{c.title}</b>
                  <span className="commit-detail">{c.detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
