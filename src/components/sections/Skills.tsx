import { useEffect, useRef } from "react";
import RevealOnScroll from "../RevealOnScroll";
import { gsap, ScrollTrigger } from "../../lib/motion";
import { prefersReducedMotion } from "../../themes";

interface Layer {
  id: string;
  name: string;
  skills: { name: string; note: string }[];
}

// The stack, drawn the way a request travels through it.
const layers: Layer[] = [
  {
    id: "L1",
    name: "Client",
    skills: [
      { name: "React", note: "web ui" },
      { name: "React Native", note: "mobile" },
      { name: "TypeScript", note: "language" },
      { name: "JavaScript ES6+", note: "language" },
    ],
  },
  {
    id: "L2",
    name: "API · Edge",
    skills: [
      { name: "Node.js", note: "runtime" },
      { name: "Express.js", note: "http" },
      { name: "RESTful APIs", note: "contracts" },
      { name: "JWT Auth", note: "identity" },
    ],
  },
  {
    id: "L3",
    name: "Services",
    skills: [
      { name: "Go", note: "concurrency" },
      { name: "Python", note: "language" },
      { name: "C++", note: "language" },
      { name: "Microservices", note: "architecture" },
    ],
  },
  {
    id: "L4",
    name: "Data",
    skills: [
      { name: "PostgreSQL", note: "relational" },
      { name: "MongoDB", note: "document" },
      { name: "Supabase", note: "postgres + auth" },
      { name: "SQL & NoSQL", note: "modelling" },
    ],
  },
  {
    id: "L5",
    name: "Platform",
    skills: [
      { name: "Docker", note: "containers" },
      { name: "CI/CD Pipelines", note: "delivery" },
      { name: "GitHub Actions", note: "automation" },
      { name: "Linux / Bash", note: "ops" },
      { name: "Git & GitHub", note: "versioning" },
    ],
  },
];

const crossCutting = [
  { name: "DSA", note: "fundamentals" },
  { name: "Unit Testing", note: "correctness" },
];

export default function Skills() {
  const stackRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);

  // A packet descends the request rail exactly in step with the scroll, and
  // the layer it is passing through lights up. Both are written straight to
  // the DOM on every scroll frame (no easing, no React re-render), so the
  // highlight never trails behind the scrollbar.
  useEffect(() => {
    const stack = stackRef.current;
    const packet = packetRef.current;
    if (!stack || !packet || prefersReducedMotion()) return;
    const lanes = Array.from(stack.querySelectorAll<HTMLElement>(".layer"));
    const setY = gsap.quickSetter(packet, "y", "px");
    let current = -1;

    const light = (idx: number) => {
      if (idx === current) return;
      lanes[current]?.classList.remove("lit");
      lanes[idx]?.classList.add("lit");
      current = idx;
    };

    const st = ScrollTrigger.create({
      trigger: stack,
      start: "top 65%",
      end: "bottom 45%",
      onUpdate: (self) => {
        const y = self.progress * (stack.offsetHeight - 14);
        setY(y);
        // The last layer the packet has reached stays lit through the gap to
        // the next one, so the highlight never blinks off mid-scroll.
        let idx = -1;
        lanes.forEach((l, i) => {
          if (y >= l.offsetTop - 6) idx = i;
        });
        light(idx);
      },
      onLeave: () => light(-1),
      onLeaveBack: () => light(-1),
    });
    return () => {
      st.kill();
      light(-1);
    };
  }, []);

  return (
    <section id="skills">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">
            <span className="sh-num">01</span> Expertise
          </div>
          <h2 className="sh-title">
            Tools, by <em>layer</em>
          </h2>
          <p className="sh-sub">My stack, drawn the way I think about it — as one request travelling down through it.</p>
        </div>
      </RevealOnScroll>

      <div className="stack-wrap">
        <div className="stack" ref={stackRef}>
          <div className="stack-rail" aria-hidden>
            <span className="stack-rail-label">↓ request</span>
            <div className="stack-packet" ref={packetRef} />
          </div>
          {layers.map((layer) => (
            <div key={layer.id} className="layer">
              <div className="layer-label">
                <span>{layer.id}</span>
                <b>{layer.name}</b>
              </div>
              <ul className="layer-chips">
                {layer.skills.map((s, si) => (
                  <li key={s.name} className="chip" style={{ ["--i" as string]: si }}>
                    <b>{s.name}</b>
                    <span>{s.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="crosscut">
          <div className="layer-label">
            <span>every layer</span>
            <b>Cross-cutting</b>
          </div>
          <ul className="layer-chips">
            {crossCutting.map((s) => (
              <li key={s.name} className="chip">
                <b>{s.name}</b>
                <span>{s.note}</span>
              </li>
            ))}
          </ul>
          <p className="crosscut-note">// applied at every layer, not bolted on at the end</p>
        </div>
      </div>
    </section>
  );
}
