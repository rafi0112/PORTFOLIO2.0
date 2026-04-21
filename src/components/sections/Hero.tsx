import { useEffect, useState, useRef } from "react";
import RevealOnScroll from "../RevealOnScroll";

const roles = [
  "Backend Engineer",
  "Full-Stack Developer",
  "MERN Stack Developer",
  "Go & Python Programmer",
  "Competitive Programmer",
];

export default function Hero() {
  const [typedText, setTypedText] = useState("");
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
          timeoutRef.current = setTimeout(typeLoop, 100);
        } else {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            typeLoop();
          }, 3000);
        }
      } else {
        if (typeIndexRef.current > 0) {
          typeIndexRef.current--;
          setTypedText(currentRole.slice(0, typeIndexRef.current));
          timeoutRef.current = setTimeout(typeLoop, 80);
        } else {
          isDeletingRef.current = false;
          roleIndexRef.current = (roleIndexRef.current + 1) % roles.length;
          typeIndexRef.current = 0;
          timeoutRef.current = setTimeout(typeLoop, 500);
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
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>

      <RevealOnScroll delay={0.1}>
        <div className="hero-available">
          <div className="avail-dot"></div>
          Available for opportunities
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.18}>
        <h1 className="hero-name">
          Khandaker
          <br />
          <em>Rafiul</em>
          <br />
          Islam
        </h1>
      </RevealOnScroll>

      <RevealOnScroll delay={0.26}>
        <div className="hero-role">
          <span id="typedText">{typedText}</span>
          <span className="typing-cursor"></span>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.34}>
        <p className="hero-desc">
          Aspiring Software Engineer focused on backend development and scalable
          systems. Proficient in the MERN stack, Go, and Python — passionate
          about solving complex problems through efficient algorithms.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.42}>
        <div className="hero-ctas">
          <a className="btn-p" href="mailto:rafi011235@gmail.com">
            ✉ Get in Touch
          </a>
          <a
            className="btn-o"
            href="https://github.com/rafi0112"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⌥ GitHub
          </a>
          <a
            className="btn-o"
            href="https://linkedin.com/in/khandaker-rafiul-islam"
            target="_blank"
            rel="noopener noreferrer"
          >
            ↗ LinkedIn
          </a>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.5}>
        <div className="hero-chips">
          <span className="hero-chip">Dhaka, Bangladesh</span>
          <span className="hero-chip">MERN Stack</span>
          <span className="hero-chip">Go · Python · C++</span>
          <span className="hero-chip">LeetCode · Codeforces</span>
          <span className="hero-chip">CGPA 3.25 / 4.00</span>
          <span className="hero-chip">Open to Full-time</span>
        </div>
      </RevealOnScroll>
    </section>
  );
}
