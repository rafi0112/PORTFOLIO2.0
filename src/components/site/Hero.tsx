import { useEffect, useRef } from "react";
import { profile } from "../../data/profile";
import { gsap, scrollToId } from "../../lib/motion";
import { prefersReducedMotion } from "../../themes";

export default function Hero({ onHello }: { onHello: () => void }) {
  const root = useRef<HTMLElement>(null);

  // Entrance: the watermark settles, the headline rises line by line, and
  // the watermark drifts slowly as the page scrolls.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-mark", { yPercent: 12, opacity: 0, duration: 1.4, ease: "power3.out" });
      gsap.from(".hero-line", { yPercent: 105, duration: 1, ease: "power4.out", stagger: 0.09, delay: 0.15 });
      gsap.from(".hero-fade", { y: 18, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, delay: 0.5 });
      gsap.to(".hero-mark", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={root}>
      <div className="hero-mark" aria-hidden>
        RAFIUL
      </div>

      <p className="hero-tag hero-fade">
        <i aria-hidden /> Backend-minded. Product-driven.
      </p>

      <div className="hero-copy">
        <p className="eyebrow hero-fade">{profile.name} · Full-Stack Developer · Dhaka</p>
        <h1 className="hero-title">
          <span className="line-mask">
            <span className="hero-line">Full-Stack</span>
          </span>
          <span className="line-mask">
            <span className="hero-line">&amp; Backend</span>
          </span>
          <span className="line-mask">
            <span className="hero-line">
              <em>Developer.</em>
            </span>
          </span>
        </h1>
        <p className="hero-sub hero-fade">
          Solid backends. Clean interfaces.{" "}
          {/* Line break on wide screens only; on phones the line runs full width. */}
          <br className="br-wide" />
          <b>Systems that stay correct.</b>
        </p>
        <div className="hero-ctas hero-fade">
          <button className="btn-dark" onClick={() => scrollToId("work")}>
            Explore work <span aria-hidden>→</span>
          </button>
          <button className="link-arrow" onClick={() => scrollToId("contact")}>
            Let&apos;s talk ↗
          </button>
          <a className="link-arrow" href={profile.resume} download={profile.resumeName}>
            Résumé ↓
          </a>
        </div>
      </div>

      <div className="hero-avatar">
        {/* The floating AvatarGuide stands here at the top of the page. */}
        <div className="hero-avatar-slot" aria-hidden />
        <button className="chip-hello" onClick={onHello}>
          A quick hello ↗
        </button>
      </div>

      <div className="hero-foot hero-fade">
        <span>React / Node / PostgreSQL</span>
        <span className="hide-sm">Based in Dhaka. Building for the web.</span>
        <button className="hero-down" onClick={() => scrollToId("about")} aria-label="Scroll to about">
          <span className="hide-sm">Scroll to meet me</span>
          <i aria-hidden>↓</i>
        </button>
      </div>
    </section>
  );
}
