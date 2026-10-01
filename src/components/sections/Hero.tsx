import { useEffect, useState, useRef } from "react";
import RevealOnScroll from "../RevealOnScroll";

const roles = [
  "backend engineer",
  "full-stack developer",
  "MERN stack developer",
  "Go & Python programmer",
  "competitive programmer",
];

const stats = [
  { value: "04", label: "Shipped projects" },
  { value: "3.25", label: "CGPA · JnU CSE" },
  { value: "5.00", label: "HSC GPA" },
];

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [photoOk, setPhotoOk] = useState(true);
  const typeIndexRef = useRef(0);
  const roleIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const typeLoop = () => {
      const currentRole = roles[roleIndexRef.current];

      if (!isDeletingRef.current) {
        if (typeIndexRef.current < currentRole.length) {
          typeIndexRef.current++;
          setTypedText(currentRole.slice(0, typeIndexRef.current));
          timeoutRef.current = setTimeout(typeLoop, 90);
        } else {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            typeLoop();
          }, 2600);
        }
      } else {
        if (typeIndexRef.current > 0) {
          typeIndexRef.current--;
          setTypedText(currentRole.slice(0, typeIndexRef.current));
          timeoutRef.current = setTimeout(typeLoop, 45);
        } else {
          isDeletingRef.current = false;
          roleIndexRef.current = (roleIndexRef.current + 1) % roles.length;
          typeIndexRef.current = 0;
          timeoutRef.current = setTimeout(typeLoop, 400);
        }
      }
    };

    timeoutRef.current = setTimeout(typeLoop, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section id="hero">
      <div className="hero-copy">
        <RevealOnScroll delay={0.1}>
          <div className="hero-kicker">
            <span className="avail-dot"></span>
            <span className="kicker-part">Available for work</span>
            <span className="kicker-sep">/</span>
            <span className="kicker-part">Dhaka, Bangladesh</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.18}>
          <h1 className="hero-name">
            <span className="hn-1">Khandaker</span>
            <span className="hn-2">Rafiul</span>
            <span className="hn-3">Islam</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={0.26}>
          <div className="hero-role">
            <span className="role-prefix">currently a</span>
            <span className="role-line">
              <span className="role-typed">{typedText}</span>
              <span className="typing-cursor"></span>
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.34}>
          <p className="hero-desc">
            Aspiring software engineer focused on backend development and
            scalable systems. I work across the MERN stack, Go and Python, and I
            care most about the <em>unglamorous, important</em> parts — data
            models, concurrency and correctness.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.42}>
          <div className="hero-ctas">
            <a
              className="btn-p"
              href="mailto:rafiul.islam.khandaker@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Rafiul%2C"
            >
              Get in touch <span aria-hidden>→</span>
            </a>
            <a
              className="btn-o"
              href="https://github.com/rafi0112"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn-o"
              href="https://www.linkedin.com/in/khandaker-rafiul-islam-6b80882b2/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn-o btn-resume"
              href="/resume.pdf"
              download="Khandaker_Rafiul_Islam_Resume.pdf"
            >
              Resume <span aria-hidden>↓</span>
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.5}>
          <dl className="hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={0.3}>
        <figure className="portrait">
          <div className="portrait-block" aria-hidden></div>
          <div className="portrait-photo">
            {photoOk ? (
              <img
                src="/profile.png"
                alt="Khandaker Rafiul Islam"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <span className="photo-fallback">KR</span>
            )}
          </div>
          <span className="portrait-tape" aria-hidden></span>

          <svg className="stamp" viewBox="0 0 120 120" aria-hidden>
            <defs>
              <path
                id="stamp-circle"
                d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
              />
            </defs>
            <circle cx="60" cy="60" r="58" className="stamp-bg" />
            <text className="stamp-text">
              <textPath href="#stamp-circle">
                OPEN TO WORK • BACKEND • FULL-STACK •
              </textPath>
            </text>
            <text x="60" y="68" textAnchor="middle" className="stamp-star">
              ★
            </text>
          </svg>

          <div className="sticker">
            <span className="sticker-label">Now shipping</span>
            Oi Tesla Pool
          </div>

          <figcaption>Fig. 01 — the engineer, in his interview suit</figcaption>
        </figure>
      </RevealOnScroll>
    </section>
  );
}
