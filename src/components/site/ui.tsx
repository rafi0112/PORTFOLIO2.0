import { useEffect, useRef, type ReactNode } from "react";

/** Fades/slides its children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** "01 — The person ……… a little context", then a two-tone title. */
export function SectionHead({
  index,
  label,
  aside,
  title,
  accent,
  side,
}: {
  index: string;
  label: string;
  aside: string;
  title: ReactNode;
  accent: ReactNode;
  side?: ReactNode;
}) {
  return (
    <header className="sec-head">
      <Reveal className="sec-rule">
        <span>
          {index} — {label}
        </span>
        <span>{aside}</span>
      </Reveal>
      <div className="sec-head-row">
        <Reveal delay={0.05}>
          <h2 className="sec-title">
            {title}
            <br />
            <em>{accent}</em>
          </h2>
        </Reveal>
        {side && (
          <Reveal delay={0.12} className="sec-side">
            {side}
          </Reveal>
        )}
      </div>
    </header>
  );
}
