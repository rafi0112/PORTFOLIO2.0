import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { prefersReducedMotion } from "../themes";

/*
  Pip, a blue tit who flies down the page with you. Pip perches on the hero
  portrait and on the end of every section title, flies between them as you
  scroll, watches your cursor, blinks, looks around, hops when bored, chirps
  when clicked, and carries your contact-form letter away.

  Positions are in document coordinates inside .bird-layer (which covers
  #root), so a perched bird naturally scrolls with its heading.
*/

type Pt = { x: number; y: number };

const LINES = [
  "Hi, I'm Pip! 🐦",
  "Try Ctrl + K to jump anywhere",
  "Pick a theme up top ↗",
  "Keep scrolling — I'll follow",
  "Tweet tweet. That's all I know.",
];

const C = {
  cap: "#3d7cc9",
  capDark: "#2b5f9e",
  cheek: "#f7f5ef",
  stripe: "#1f2a3a",
  back: "#8fb86a",
  backDark: "#76a04f",
  belly: "#f5d55b",
  bellyShade: "#e4bb3a",
  wing: "#4f8fd6",
  wingDark: "#2f66a8",
  wingBar: "#e3eefa",
  tail: "#4a86cc",
  tailDark: "#2c5d9a",
  legs: "#6b7a8c",
};

// Simplified silhouette for the mini flock (static markup, wing flaps via GSAP).
const MINI_SVG = `<svg viewBox="0 0 100 80"><g class="flip">
<path fill="${C.tail}" d="M37 43 L9 58 L13 63 L40 50 Z"/>
<path fill="${C.belly}" d="M30 40 C32 28 50 24 62 28 C72 32 72 46 64 51 C56 56 40 55 34 49 Z"/>
<path fill="${C.back}" d="M30 40 C32 28 50 24 62 28 C58 33 46 37 30 40 Z"/>
<circle fill="${C.cheek}" cx="68" cy="27" r="11"/>
<path fill="${C.cap}" d="M57 25 C58 14 76 12 79 23 C72 20 63 21 57 25 Z"/>
<path fill="${C.stripe}" d="M79 27 L86 29.5 L79 31.5 Z"/>
<g class="wing"><path fill="${C.wing}" d="M53 32 C44 30 32 38 20 50 C32 48 44 46 56 40 Z"/></g>
</g></svg>`;

const smooth = (t: number) => t * t * (3 - 2 * t);

export default function Bird() {
  const layerRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLButtonElement>(null);
  const flipRef = useRef<SVGGElement>(null);
  const wingRef = useRef<SVGGElement>(null);
  const farWingRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyeRef = useRef<SVGGElement>(null);
  const legsRef = useRef<SVGGElement>(null);
  const letterRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const clicksRef = useRef(0);
  const actionsRef = useRef<{ poke: () => void } | null>(null);

  useEffect(() => {
    const bird = birdRef.current!;
    const layer = layerRef.current!;
    const reduced = prefersReducedMotion();
    const fine = window.matchMedia("(pointer: fine)").matches;

    let perches: Pt[] = [];
    let triggers: number[] = [];
    const cur: Pt = { x: -200, y: 200 };
    const vel: Pt = { x: 0, y: 0 };
    let facing = 1;
    let angle = 0;
    let wingPhase = 0;
    let flying = false;
    let wasFlying = false;
    let lastScroll = window.scrollY;
    let frameCount = 0;
    let blinkIn = 2 + Math.random() * 3;
    let idleIn = 3 + Math.random() * 3;
    let lookAway = 0; // seconds left facing away (idle "look around")
    const mouse = { x: -1, y: -1 };
    // Animated offsets layered on top of the flight model by GSAP tweens.
    const fx = { spin: 0, hop: 0, squash: 1, tail: 0, headTilt: 0, blink: 1 };
    const override = { active: false, x: 0, y: 0 };

    const measure = () => {
      const pts: Pt[] = [];
      const sy = window.scrollY;
      const narrow = window.innerWidth < 900;

      const heroTarget = narrow
        ? document.querySelector<HTMLElement>(".hn-1")
        : document.querySelector<HTMLElement>(".portrait-photo");
      if (heroTarget) {
        if (narrow) pts.push(textEnd(heroTarget, sy));
        else {
          const r = heroTarget.getBoundingClientRect();
          pts.push({ x: r.right - 46, y: r.top + sy });
        }
      }
      document.querySelectorAll<HTMLElement>("section .sh-title").forEach((el) => {
        pts.push(textEnd(el, sy));
      });

      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const trig: number[] = [];
      pts.forEach((p, i) => {
        let s = i === 0 ? 0 : Math.min(maxScroll, p.y - vh * 0.38);
        if (i > 0) s = Math.max(s, trig[i - 1] + 1);
        trig.push(s);
      });
      perches = pts;
      triggers = trig;
    };

    const target = (): { p: Pt; flying: boolean } => {
      const s = window.scrollY;
      const n = perches.length;
      if (!n) return { p: cur, flying: false };
      if (reduced || s <= triggers[0]) return { p: perches[0], flying: false };
      if (s >= triggers[n - 1]) return { p: perches[n - 1], flying: false };
      let k = 0;
      while (k < n - 2 && s >= triggers[k + 1]) k++;
      const u = (s - triggers[k]) / (triggers[k + 1] - triggers[k]);
      const a = perches[k];
      const b = perches[k + 1];
      if (u < 0.1) return { p: a, flying: false };
      if (u > 0.9) return { p: b, flying: false };
      const e = smooth((u - 0.1) / 0.8);
      const arc = Math.sin(Math.PI * e);
      // Swing out into the right-hand gutter between perches.
      const w = window.innerWidth;
      const gutter = w < 760 ? w - 40 : Math.min(w - 70, w / 2 + 640 + 20);
      const lx = a.x + (b.x - a.x) * e;
      const ly = a.y + (b.y - a.y) * e;
      return {
        p: { x: lx + (gutter - lx) * Math.pow(arc, 0.7), y: ly - arc * 70 },
        flying: true,
      };
    };

    // ---- Little behaviours -------------------------------------------------
    const blink = () => {
      gsap.timeline().to(fx, { blink: 0.1, duration: 0.07 }).to(fx, { blink: 1, duration: 0.09 });
      // Sometimes a double blink.
      if (Math.random() < 0.25) gsap.timeline({ delay: 0.25 }).to(fx, { blink: 0.1, duration: 0.07 }).to(fx, { blink: 1, duration: 0.09 });
    };
    const hop = (height = 10) => {
      gsap
        .timeline()
        .to(fx, { squash: 0.86, duration: 0.08 })
        .to(fx, { hop: -height, squash: 1.06, duration: 0.18, ease: "power2.out" })
        .to(fx, { hop: 0, squash: 0.9, duration: 0.16, ease: "power2.in" })
        .to(fx, { squash: 1, duration: 0.18, ease: "back.out(3)" });
    };
    const tailFlick = () => {
      gsap.timeline().to(fx, { tail: -16, duration: 0.09 }).to(fx, { tail: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" });
    };
    const cockHead = () => {
      gsap.to(fx, { headTilt: (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 8), duration: 0.18, yoyo: true, repeat: 1, repeatDelay: 0.7, ease: "power2.out" });
    };
    const idle = () => {
      const r = Math.random();
      if (r < 0.3) hop(8 + Math.random() * 6);
      else if (r < 0.55) cockHead();
      else if (r < 0.75) tailFlick();
      else lookAway = 1.2 + Math.random(); // glance the other way
    };

    const render = (dt: number) => {
      frameCount++;
      if (frameCount % 15 === 1) measure();

      const scroll = window.scrollY;
      const scrollDelta = scroll - lastScroll;
      lastScroll = scroll;

      let goal: Pt;
      if (override.active) {
        goal = { x: override.x, y: override.y };
        flying = true;
      } else {
        const t = target();
        goal = t.p;
        flying = t.flying || Math.hypot(goal.x - cur.x, goal.y - cur.y) > 24;
      }

      const k = override.active || reduced ? 1 : 1 - Math.pow(0.86, dt * 60);
      const nx = cur.x + (goal.x - cur.x) * k;
      const ny = cur.y + (goal.y - cur.y) * k;
      vel.x = vel.x * 0.8 + (nx - cur.x) * 0.2;
      vel.y = vel.y * 0.8 + (ny - cur.y - scrollDelta) * 0.2; // on-screen motion
      cur.x = nx;
      cur.y = ny;

      // Landing: a little bounce and a tail flick.
      if (wasFlying && !flying && !reduced) {
        hop(4);
        tailFlick();
      }
      wasFlying = flying;

      // Timers for blinking and idle fidgets (perched only).
      if (!reduced) {
        blinkIn -= dt;
        if (blinkIn <= 0) {
          blink();
          blinkIn = 2.5 + Math.random() * 3.5;
        }
        if (!flying) {
          idleIn -= dt;
          if (idleIn <= 0) {
            idle();
            idleIn = 3 + Math.random() * 4;
          }
        }
        if (lookAway > 0) lookAway -= dt;
      }

      // Face the direction of travel, or the cursor while perched.
      if (flying && Math.abs(vel.x) > 0.4) facing = vel.x > 0 ? 1 : -1;
      else if (!flying && fine && mouse.x >= 0 && lookAway <= 0) {
        const dx = mouse.x - cur.x;
        if (Math.abs(dx) > 40) facing = dx > 0 ? 1 : -1;
      }
      const shownFacing = !flying && lookAway > 0 ? -facing : facing;

      const tilt = flying ? Math.max(-22, Math.min(22, vel.y * 2.2)) * shownFacing : 0;
      angle += (tilt - angle) * 0.15;

      // Head follows the cursor's height a little while perched.
      let look = 0;
      if (!flying && fine && mouse.y >= 0) {
        look = Math.max(-14, Math.min(14, ((mouse.y - (cur.y - 30)) / 300) * 14));
      }

      // Wings rotate around the shoulder: folded at rest, beating in flight.
      let wing: number;
      let farWing: number;
      if (flying && !reduced) {
        wingPhase += dt * 60 * 0.36;
        wing = 35 + 55 * Math.cos(wingPhase);
        farWing = 30 + 50 * Math.cos(wingPhase + 0.45);
      } else {
        wingPhase += dt * 60 * 0.04;
        wing = Math.sin(wingPhase) * 1.5; // breathing
        farWing = 0;
      }
      const bob = flying ? Math.sin(wingPhase) * 3 : 0;

      bird.style.transform = `translate3d(${cur.x}px, ${cur.y + bob + fx.hop}px, 0) rotate(${angle + fx.spin}deg) scale(${2 - fx.squash}, ${fx.squash})`;
      flipRef.current!.style.transform = `scaleX(${shownFacing})`;
      wingRef.current!.style.transform = `rotate(${wing}deg)`;
      farWingRef.current!.style.transform = `rotate(${farWing}deg)`;
      tailRef.current!.style.transform = `rotate(${fx.tail + (flying ? -6 : 0)}deg)`;
      headRef.current!.style.transform = `rotate(${look + fx.headTilt}deg)`;
      eyeRef.current!.style.transform = `scaleY(${fx.blink})`;
      legsRef.current!.style.transform = flying ? "scaleY(0.35)" : "";
      shadowRef.current!.style.opacity = flying ? "0" : "";

      const bubble = bubbleRef.current!;
      bubble.style.left = `${cur.x}px`;
      bubble.style.top = `${cur.y - 52}px`;
    };

    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      render(dt);
    };

    measure();
    if (perches[0]) {
      // Fly in from off-screen left on load.
      cur.x = -120;
      cur.y = perches[0].y - 160;
    }
    if (reduced && perches[0]) Object.assign(cur, perches[0]);
    gsap.ticker.add(tick);

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX + window.scrollX;
      mouse.y = e.clientY + window.scrollY;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(measure);

    const say = (text: string) => {
      const b = bubbleRef.current!;
      b.textContent = text;
      gsap.killTweensOf(b);
      gsap
        .timeline()
        .fromTo(b, { opacity: 0, y: 8, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2)" })
        .to(b, { opacity: 0, y: -6, duration: 0.3, delay: 2.2 });
    };

    const chirp = () => {
      ["♪", "♫", "♪"].forEach((n, i) => {
        const el = document.createElement("span");
        el.className = "bird-note";
        el.textContent = n;
        layer.appendChild(el);
        const x0 = cur.x + 14 * facing;
        const y0 = cur.y - 40;
        gsap.fromTo(
          el,
          { x: x0, y: y0, opacity: 0, scale: 0.6, rotate: -10 },
          {
            keyframes: [
              { opacity: 1, scale: 1, duration: 0.2 },
              { x: x0 + (18 + i * 10) * facing, y: y0 - 50 - i * 12, rotate: 12, opacity: 0, duration: 1.1, ease: "sine.out" },
            ],
            delay: i * 0.16,
            onComplete: () => el.remove(),
          },
        );
      });
    };

    const poke = () => {
      clicksRef.current++;
      const n = clicksRef.current;
      if (!reduced) {
        chirp();
        if (n % 3 === 0) {
          gsap.fromTo(fx, { spin: 0 }, { spin: 360 * facing, duration: 0.8, ease: "power2.inOut", onComplete: () => (fx.spin = 0) });
        } else hop(14);
      }
      if (n % 5 === 0) {
        say("You found the flock! 🐦🐦🐦");
        if (!reduced) releaseFlock(layer);
      } else {
        say(LINES[(n - 1) % LINES.length]);
      }
    };
    actionsRef.current = { poke };

    // Contact form success → carry the letter away.
    const onDeliver = (e: Event) => {
      const { x, y } = (e as CustomEvent<Pt>).detail;
      const letter = letterRef.current!;
      if (reduced) {
        say("Message delivered ✉");
        return;
      }
      override.active = true;
      override.x = cur.x;
      override.y = cur.y;
      const sx = window.scrollX;
      const sy = window.scrollY;
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(letter, { opacity: 0 });
            override.active = false;
            // Re-enter from the top-right corner.
            cur.x = window.innerWidth + 80;
            cur.y = window.scrollY - 60;
            say("Delivered! ✉");
          },
        })
        .to(override, { x: x + sx, y: y + sy - 6, duration: 0.9, ease: "power2.inOut" })
        .set(letter, { opacity: 1 })
        .to(override, { y: `-=${30}`, duration: 0.25, ease: "power1.out" })
        .to(override, {
          x: sx + window.innerWidth + 160,
          y: sy - 140,
          duration: 1.3,
          ease: "power2.in",
        })
        .to({}, { duration: 0.6 });
    };
    window.addEventListener("bird:deliver", onDeliver);

    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf(fx);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("bird:deliver", onDeliver);
    };
  }, []);

  return (
    <div className="bird-layer" ref={layerRef}>
      <button
        ref={birdRef}
        className="bird"
        aria-label="Pip the blue tit — click me"
        onClick={() => actionsRef.current?.poke()}
      >
        <svg viewBox="0 0 100 80" aria-hidden>
          <ellipse ref={shadowRef} className="shadow" cx="50" cy="58.5" rx="15" ry="2.2" />
          <g ref={flipRef} className="flip">
            {/* Far wing, only visible when raised above the body. */}
            <g ref={farWingRef} className="wing">
              <path fill={C.wingDark} d="M53 32 C44 30 32 38 20 50 C32 48 44 46 56 40 Z" />
            </g>

            <g ref={tailRef} className="tail">
              <path fill={C.tail} d="M37 43 L9 58 L13 63 L40 50 Z" />
              <path fill={C.tailDark} d="M38 46.5 L11 60.5 L13 63 L40 50 Z" />
            </g>

            <g ref={legsRef} className="legs">
              <path d="M48 51 L46.5 57 M55 51 L56 57" stroke={C.legs} strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M43.5 57.2 L50 57.2 M53 57.2 L59.5 57.2" stroke={C.legs} strokeWidth="1.4" strokeLinecap="round" fill="none" />
            </g>

            {/* Body: yellow belly, green back, a shade under the belly. */}
            <path fill={C.belly} d="M30 40 C32 28 50 24 62 28 C72 32 72 46 64 51 C56 56 40 55 34 49 Z" />
            <path fill={C.bellyShade} d="M34 49 C40 55 56 56 64 51 C60 52 46 52 38 47 Z" />
            <path fill={C.back} d="M30 40 C32 28 50 24 62 28 C58 33 46 37 30 40 Z" />
            <path fill={C.backDark} d="M30 40 C36 37 46 35 54 31 C46 36 38 39 30 40 Z" />

            <g ref={headRef} className="head">
              <g transform="translate(-2 1)">
              <circle fill={C.cheek} cx="68" cy="27" r="11.2" />
              {/* Blue cap and the dark collar that rings the white cheek. */}
              <path fill={C.cap} d="M57 25 C58 13.5 76 11.5 79.5 23 C72 19.5 63 20.5 57 25 Z" />
              <path fill={C.capDark} d="M58 21 C61 15.5 69 13.5 74 15 C67 15.5 62 18 58 21 Z" />
              <path d="M57.5 27 C57 34 63 39.5 72 38.5" stroke={C.capDark} strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path fill={C.stripe} d="M80 27.6 L70.5 26.6 L57.5 29.5 L58 31.6 L70.5 29.4 L80 29.8 Z" />
              <path fill={C.stripe} d="M78.8 26.4 L86 29.2 L78.8 31.4 Z" />
              <g ref={eyeRef} className="eye">
                <circle fill={C.stripe} cx="71.6" cy="27.6" r="2" />
                <circle fill="#fff" cx="72.3" cy="27" r="0.65" />
              </g>
              </g>
            </g>

            {/* Near wing, folded along the body at rest. */}
            <g ref={wingRef} className="wing">
              <path fill={C.wing} d="M53 32 C44 30 32 38 20 50 C32 48 44 46 56 40 Z" />
              <path fill={C.wingDark} d="M32 45 C28 47 24 48.5 20 50 C25 49.5 30 48.6 35 47.6 Z" />
              <path d="M48 35.5 C42 37 36 41 30 45" stroke={C.wingBar} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>

            <g ref={letterRef} className="letter">
              <rect x="41" y="58" width="20" height="13" rx="1.5" />
              <path d="M41 58.5 L51 65 L61 58.5" fill="none" />
              <circle className="seal" cx="51" cy="65" r="2.2" />
            </g>
          </g>
        </svg>
      </button>
      <div ref={bubbleRef} className="bird-bubble" role="status" aria-live="polite" />
    </div>
  );
}

/** Where a heading's text ends, in document coordinates. */
function textEnd(el: HTMLElement, scrollY: number): Pt {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = range.getClientRects();
  const r = rects.length ? rects[rects.length - 1] : el.getBoundingClientRect();
  // line-height is ~1 on these titles; cap height starts ~12% down the box.
  return { x: r.right - 18, y: r.top + r.height * 0.12 + scrollY };
}

function releaseFlock(layer: HTMLElement) {
  const sy = window.scrollY;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < 7; i++) {
    const el = document.createElement("div");
    el.className = "bird mini-bird";
    el.innerHTML = MINI_SVG;
    layer.appendChild(el);
    const wing = el.querySelector(".wing");
    gsap.fromTo(wing, { rotate: -15 }, { rotate: 80, duration: 0.13, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.03 });
    const y0 = sy + h * (0.2 + Math.random() * 0.6);
    gsap.fromTo(
      el,
      { x: -60 - i * 40, y: y0, scale: 0.6 + Math.random() * 0.6 },
      {
        x: w + 80,
        y: y0 - 120 - Math.random() * 160,
        duration: 2.6 + Math.random() * 1.2,
        delay: i * 0.12,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.killTweensOf(wing);
          el.remove();
        },
      },
    );
  }
}
