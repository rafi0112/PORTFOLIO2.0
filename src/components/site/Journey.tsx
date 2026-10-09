import { useEffect, useRef } from "react";
import { Reveal, SectionHead } from "./ui";
import { education, journey } from "../../data/profile";
import { gsap } from "../../lib/motion";
import { prefersReducedMotion } from "../../themes";

export default function Journey() {
  const listRef = useRef<HTMLOListElement>(null);

  // The timeline's line fills in as you scroll through it.
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      list,
      { "--fill": 0 },
      { "--fill": 1, ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: 0.4 } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="journey" className="sec">
      <SectionHead
        index="04"
        label="The journey"
        aside="Always moving forward"
        title="Every project,"
        accent="a step forward."
        side={
          <p>
            From my first mobile app
            <br />
            to systems that scale themselves.
          </p>
        }
      />

      <ol className="timeline" ref={listRef}>
        {journey.map((m, i) => (
          <li key={m.title} className="tl-item">
            <Reveal className="tl-when">
              <span>{m.when}</span>
              <b>{m.year}</b>
            </Reveal>
            <span className="tl-dot" aria-hidden />
            <Reveal delay={0.06} className={`tl-card ${i === 0 ? "first" : ""}`}>
              <span className="eyebrow accent">{m.tag}</span>
              <h3>{m.title}</h3>
              <p className="tl-org">{m.org}</p>
              <p>{m.body}</p>
              <div className="tags">
                {m.techs.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="edu">
        {education.map((e, i) => (
          <Reveal key={e.title} delay={0.06 * i} className="edu-item">
            <span className="eyebrow">Education · {e.when}</span>
            <h3>{e.title}</h3>
            <p className="edu-school">
              {e.school}
              <br />
              <span>{e.place}</span>
            </p>
            <p className="edu-detail">{e.detail}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
