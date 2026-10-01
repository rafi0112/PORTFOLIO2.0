import { useEffect } from "react";
import { gsap, SplitText } from "./motion";
import { prefersReducedMotion } from "../themes";

const MAGNETIC = ".btn-p, .btn-o, .nav-hire, .theme-trigger, .fsub";

/** Page-wide micro-interactions. Runs once; everything uses delegation. */
export function useInteractions() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // Magnetic buttons + project card spotlight (mouse users only).
    if (fine && !reduced) {
      let magnet: HTMLElement | null = null;
      const release = (el: HTMLElement) =>
        gsap.to(el, { "--tx": "0px", "--ty": "0px", duration: 0.6, ease: "elastic.out(1, 0.4)" });

      const onMove = (e: PointerEvent) => {
        const target = e.target as Element | null;
        const el = target?.closest<HTMLElement>(MAGNETIC) ?? null;
        if (magnet && magnet !== el) release(magnet);
        magnet = el;
        if (el) {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          gsap.to(el, { "--tx": `${dx * 0.22}px`, "--ty": `${dy * 0.3}px`, duration: 0.35, ease: "power3.out" });
        }

        const card = target?.closest<HTMLElement>(".proj-card");
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
      };
      const onLeaveDoc = () => {
        if (magnet) release(magnet);
        magnet = null;
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeaveDoc);
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeaveDoc);
      });
    }

    if (!reduced) {
      // Hero name: letters rise in on load.
      const heroLines = gsap.utils.toArray<HTMLElement>(".hn-1, .hn-2, .hn-3");
      const heroSplit = SplitText.create(heroLines, { type: "chars" });
      gsap.from(heroSplit.chars, {
        yPercent: 70,
        rotate: 6,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.028,
        delay: 0.25,
      });
      cleanups.push(() => heroSplit.revert());

      // Section titles: words rise as each title scrolls into view.
      gsap.utils.toArray<HTMLElement>(".sh-title").forEach((title) => {
        const split = SplitText.create(title, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 60,
              opacity: 0,
              rotate: 4,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.07,
              scrollTrigger: { trigger: title, start: "top 88%", once: true },
            }),
        });
        cleanups.push(() => split.revert());
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
