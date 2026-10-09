import { useRef, useState } from "react";
import { Reveal, SectionHead } from "./ui";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";

function IdCard() {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  // Lean towards the pointer a little, like a badge on a lanyard.
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  };

  return (
    <div className="badge-wrap">
      <button
        ref={ref}
        className={`badge ${flipped ? "flipped" : ""}`}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)` }}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Flip back to the ID card" : "Flip to the short version"}
      >
        <span className="badge-face badge-front">
          <span className="badge-top">
            <b>JnU</b>
            <span>Computer Science</span>
          </span>
          <span className="badge-photo">
            <img src="/profile.png" alt="" />
          </span>
          <span className="badge-name">{profile.name}</span>
          <span className="badge-role">Full-Stack Developer</span>
          <span className="badge-code" aria-hidden />
          <span className="badge-id">RK · Portfolio ID</span>
        </span>

        <span className="badge-face badge-back">
          <span className="eyebrow">The short version</span>
          <span className="badge-big">
            Made of
            <br />
            <em>curiosity.</em>
          </span>
          <span className="badge-stats">
            <span>
              <b>{String(projects.length).padStart(2, "0")}</b>
              <small>Projects shipped</small>
            </span>
            <span>
              <b>30+</b>
              <small>Technologies</small>
            </span>
          </span>
          <span className="badge-foot">Live on Vercel · Render · Supabase</span>
          <span className="badge-quote">From the schema to the ship.</span>
        </span>
      </button>
      <p className="badge-hint">↔ Tilt it a little. Click to flip.</p>
    </div>
  );
}

const FACTS = [
  { k: "Based in", v: profile.city, href: profile.maps },
  { k: "Currently", v: "B.Sc. CSE · Jagannath University" },
  { k: "Focus", v: "Backend. Systems. Correctness." },
  { k: "Languages", v: "English (fluent), Bangla (native)" },
];

export default function About() {
  return (
    <section id="about" className="sec">
      <SectionHead index="01" label="The person" aside="A little context" title="Hi, I'm" accent="Rafiul." />

      <div className="about-grid">
        <div className="about-copy">
          <Reveal>
            <p>
              I&apos;m {profile.name}, a Computer Science undergraduate at Jagannath University and a full-stack developer
              who builds and ships products end to end — with a particular love for the backend.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <p>
              Most recently I designed and deployed <b>Oi Tesla Pool</b>, a ride-pooling platform whose booking logic stays
              correct under concurrent requests through atomic SQL, row-level locking and a finite-state machine. I&apos;m
              comfortable across the stack, from PostgreSQL schema design and REST APIs to responsive React interfaces —
              and driven by the unglamorous details that keep a system correct in production.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="btn-row">
            <a className="btn-ghost" href={profile.resume} download={profile.resumeName}>
              Résumé ↓
            </a>
            <a className="btn-ghost" href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a className="btn-ghost" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <IdCard />
        </Reveal>
      </div>

      <div className="facts">
        <Reveal className="facts-quote">
          <p className="eyebrow">A few quick facts</p>
          <blockquote>
            “From the schema
            <br />
            to the ship.”
          </blockquote>
          <p className="eyebrow muted">One developer. The whole stack.</p>
        </Reveal>
        <div className="facts-grid">
          {FACTS.map((f, i) => (
            <Reveal key={f.k} delay={0.05 * i} className="fact">
              <span>{f.k}</span>
              {f.href ? (
                <a href={f.href} target="_blank" rel="noopener noreferrer">
                  {f.v} <i aria-hidden>↗</i>
                </a>
              ) : (
                <b>{f.v}</b>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
