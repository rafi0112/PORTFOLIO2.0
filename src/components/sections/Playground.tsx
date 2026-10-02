import { useEffect, useMemo, useRef, useState } from "react";
import RevealOnScroll from "../RevealOnScroll";
import { prefersReducedMotion } from "../../themes";

/*
  A toy model of a scaled web service. The numbers come from a deliberately
  simple formula (capacity per replica, cache hit rate, DB capacity); the
  packets are drawn at a rate proportional to the traffic slider.
*/

type Pt = [number, number];
type Rect = { x: number; y: number; w: number; h: number };

interface Layout {
  view: [number, number];
  clients: Rect;
  lb: Rect;
  replicas: Rect[];
  cache: Rect;
  db: Rect;
  queue: Rect;
  c2lb: Pt[];
  lb2r: (i: number) => Pt[];
  r2cache: (i: number) => Pt[];
  r2db: (i: number) => Pt[];
  cache2db: Pt[];
  r2queue: (i: number) => Pt[];
  queue2db: Pt[];
}

const WIDE: Layout = (() => {
  const ry = [60, 160, 260, 360];
  const cy = (i: number) => ry[i] + 26;
  return {
    view: [800, 480],
    clients: { x: 20, y: 208, w: 110, h: 64 },
    lb: { x: 170, y: 208, w: 140, h: 64 },
    replicas: ry.map((y) => ({ x: 380, y, w: 150, h: 52 })),
    cache: { x: 600, y: 110, w: 180, h: 60 },
    db: { x: 600, y: 300, w: 180, h: 60 },
    queue: { x: 600, y: 410, w: 180, h: 50 },
    c2lb: [[130, 240], [170, 240]],
    lb2r: (i) => [[310, 240], [345, 240], [345, cy(i)], [380, cy(i)]],
    r2cache: (i) => [[530, cy(i)], [565, cy(i)], [565, 140], [600, 140]],
    r2db: (i) => [[530, cy(i)], [565, cy(i)], [565, 330], [600, 330]],
    cache2db: [[690, 170], [690, 300]],
    r2queue: (i) => [[530, cy(i)], [565, cy(i)], [565, 435], [600, 435]],
    queue2db: [[690, 410], [690, 360]],
  };
})();

const TALL: Layout = (() => {
  const rx = [14, 100, 186, 272];
  const cx = (i: number) => rx[i] + 37;
  return {
    view: [360, 540],
    clients: { x: 125, y: 10, w: 110, h: 46 },
    lb: { x: 105, y: 96, w: 150, h: 50 },
    replicas: rx.map((x) => ({ x, y: 196, w: 74, h: 50 })),
    cache: { x: 20, y: 340, w: 140, h: 50 },
    db: { x: 200, y: 340, w: 140, h: 50 },
    queue: { x: 200, y: 470, w: 140, h: 46 },
    c2lb: [[180, 56], [180, 96]],
    lb2r: (i) => [[180, 146], [180, 171], [cx(i), 171], [cx(i), 196]],
    r2cache: (i) => [[cx(i), 246], [cx(i), 290], [90, 290], [90, 340]],
    r2db: (i) => [[cx(i), 246], [cx(i), 290], [270, 290], [270, 340]],
    cache2db: [[160, 365], [200, 365]],
    r2queue: (i) => [[cx(i), 246], [cx(i), 290], [350, 290], [350, 493], [340, 493]],
    queue2db: [[270, 470], [270, 390]],
  };
})();

const REPLICA_CAPACITY = 500; // rps one replica can serve
const DB_CAPACITY = 1200; // rps the primary can absorb
const HIT_RATE = 0.8;
const WRITE_SHARE = 0.2;

function model(rps: number, replicas: number, cache: boolean, queue: boolean, killed: boolean) {
  const dead = killed && replicas >= 2 ? 1 : -1; // index of the killed replica
  const alive = Math.max(0, replicas - (dead >= 0 ? 1 : 0));
  const util = alive > 0 ? rps / (alive * REPLICA_CAPACITY) : 9;
  const hit = cache ? HIT_RATE : 0;
  const dbPct = Math.round(((rps * (1 - hit) * (queue ? 0.7 : 1)) / DB_CAPACITY) * 100);
  let err = util > 1 ? (1 - 1 / util) * 100 : 0;
  if (dbPct > 100) err = Math.max(err, (1 - 100 / dbPct) * 100);
  const p95 = Math.round(
    28 + 22 * (1 - hit) + 160 * Math.pow(Math.min(util, 1.6), 4) + (dbPct > 80 ? (dbPct - 80) * 3 : 0),
  );
  const level = err > 5 ? "bad" : util > 0.8 || dbPct > 80 ? "warn" : "ok";
  return { dead, alive, util, hit, dbPct, err, p95, level };
}

const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

function Box({ r, title, sub, cls = "" }: { r: Rect; title: string; sub?: string; cls?: string }) {
  return (
    <g className={`pg-box ${cls}`}>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={cls.includes("store") ? 14 : 6} />
      <text x={r.x + r.w / 2} y={r.y + r.h / 2 - (sub ? 4 : -4)} textAnchor="middle" className="pg-t">
        {title}
      </text>
      {sub && (
        <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 13} textAnchor="middle" className="pg-s">
          {sub}
        </text>
      )}
    </g>
  );
}

export default function Playground() {
  const [rps, setRps] = useState(1200);
  const [replicas, setReplicas] = useState(3);
  const [cache, setCache] = useState(true);
  const [queue, setQueue] = useState(true);
  const [killed, setKilled] = useState(false);
  const [narrow, setNarrow] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  const svgRef = useRef<SVGSVGElement>(null);
  const packetsRef = useRef<SVGGElement>(null);

  const m = model(rps, replicas, cache, queue, killed);
  const L = narrow ? TALL : WIDE;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Latest settings for the animation loop, without restarting it.
  const live = useRef({ rps, replicas, cache, queue, m, L });
  live.current = { rps, replicas, cache, queue, m, L };

  useEffect(() => {
    const svg = svgRef.current;
    const layer = packetsRef.current;
    if (!svg || !layer || prefersReducedMotion()) return;

    type Packet = { el: SVGCircleElement; path: Pt[]; seg: number; t: number; drop: boolean; fading: number };
    const packets: Packet[] = [];
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;
    let rr = 0;
    let visible = false;
    const SPEED = 260; // viewBox units per second

    const spawn = () => {
      const { replicas, cache, queue, m, L } = live.current;
      const alive = Array.from({ length: replicas }, (_, i) => i).filter((i) => i !== m.dead);
      if (!alive.length) return;
      const r = alive[rr++ % alive.length];
      const drop = Math.random() * 100 < m.err;
      let path: Pt[] = [...L.c2lb, ...L.lb2r(r)];
      if (!drop) {
        const write = Math.random() < WRITE_SHARE;
        if (write && queue) path = [...path, ...L.r2queue(r), ...L.queue2db];
        else if (!write && cache && Math.random() < m.hit) path = [...path, ...L.r2cache(r)];
        else if (!write && cache) path = [...path, ...L.r2cache(r), ...L.cache2db];
        else path = [...path, ...L.r2db(r)];
      }
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("r", narrow ? "3" : "4");
      el.setAttribute("class", "pg-packet");
      layer.appendChild(el);
      packets.push({ el, path, seg: 0, t: 0, drop, fading: 0 });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Packets per second scale with traffic, capped to stay readable.
      spawnAcc += dt * Math.min(28, Math.max(2, live.current.rps / 70));
      while (spawnAcc >= 1) {
        spawn();
        spawnAcc -= 1;
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (p.fading > 0) {
          p.fading -= dt;
          p.el.style.opacity = String(Math.max(0, p.fading / 0.5));
          if (p.fading <= 0) {
            p.el.remove();
            packets.splice(i, 1);
          }
          continue;
        }
        let move = SPEED * dt;
        while (move > 0 && p.seg < p.path.length - 1) {
          const [x1, y1] = p.path[p.seg];
          const [x2, y2] = p.path[p.seg + 1];
          const len = Math.hypot(x2 - x1, y2 - y1) || 1;
          const left = len * (1 - p.t);
          if (move < left) {
            p.t += move / len;
            move = 0;
          } else {
            move -= left;
            p.seg++;
            p.t = 0;
          }
        }
        const a = p.path[Math.min(p.seg, p.path.length - 1)];
        const b = p.path[Math.min(p.seg + 1, p.path.length - 1)];
        p.el.setAttribute("cx", String(a[0] + (b[0] - a[0]) * p.t));
        p.el.setAttribute("cy", String(a[1] + (b[1] - a[1]) * p.t));
        if (p.seg >= p.path.length - 1) {
          if (p.drop) p.el.classList.add("dropped");
          p.fading = 0.5;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      packets.forEach((p) => p.el.remove());
    };
  }, [narrow]);

  // All the wires, drawn once from the same routes the packets follow.
  const wires = useMemo(() => {
    const out: { key: string; p: Pt[]; dashed?: boolean }[] = [{ key: "c2lb", p: L.c2lb }];
    L.replicas.forEach((_, i) => {
      out.push({ key: `lb${i}`, p: L.lb2r(i) });
      out.push({ key: `rc${i}`, p: L.r2cache(i) });
      out.push({ key: `rd${i}`, p: L.r2db(i) });
    });
    out.push({ key: "c2d", p: L.cache2db, dashed: true });
    return out;
  }, [L]);

  const statusText = m.level === "bad" ? "overloaded — shedding requests" : m.level === "warn" ? "degraded — running hot" : "healthy";

  return (
    <section id="playground">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">
            <span className="sh-num">↯</span> Playground
          </div>
          <h2 className="sh-title">
            Scale <em>this</em>
          </h2>
          <p className="sh-sub">A toy model of the systems I like to build. Push the traffic, add replicas, kill one — and watch what happens.</p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.08}>
        <div className="pg">
          <div className="pg-panel">
            <span className="pg-eyebrow">// control plane</span>

            <label className="pg-range">
              <span>
                <span>Traffic</span>
                <b>{rps.toLocaleString()} rps</b>
              </span>
              <input type="range" min={100} max={3000} step={100} value={rps} onChange={(e) => setRps(Number(e.target.value))} />
            </label>

            <div className="pg-row">
              <span>Replicas</span>
              <span className="pg-stepper">
                <button aria-label="Remove a replica" onClick={() => setReplicas((r) => Math.max(1, r - 1))} disabled={replicas <= 1}>
                  −
                </button>
                <b aria-live="polite">{replicas}</b>
                <button aria-label="Add a replica" onClick={() => setReplicas((r) => Math.min(4, r + 1))} disabled={replicas >= 4}>
                  +
                </button>
              </span>
            </div>

            <label className="pg-toggle">
              Cache layer
              <input type="checkbox" checked={cache} onChange={() => setCache((c) => !c)} />
            </label>
            <label className="pg-toggle">
              Async queue for writes
              <input type="checkbox" checked={queue} onChange={() => setQueue((q) => !q)} />
            </label>

            <button className={`pg-kill ${killed ? "on" : ""}`} onClick={() => setKilled((k) => !k)} disabled={replicas < 2 && !killed}>
              {killed ? "↺ Restore api-2" : "☠ Kill a replica"}
            </button>

            <div className="pg-metrics" aria-live="polite">
              <div>
                <span>p95 latency</span>
                <b>{m.p95}</b>
                <span>ms</span>
              </div>
              <div className={m.err > 0 ? "bad" : ""}>
                <span>errors</span>
                <b>{m.err.toFixed(1)}</b>
                <span>% of requests</span>
              </div>
              <div>
                <span>db load</span>
                <b>{Math.min(m.dbPct, 100)}</b>
                <span>% capacity</span>
              </div>
            </div>
            <span className={`pg-status ${m.level}`}>● {statusText}</span>
            <span className="pg-fine">simulated — a toy model, not real traffic</span>
          </div>

          <div className="pg-stage">
            <svg ref={svgRef} viewBox={`0 0 ${L.view[0]} ${L.view[1]}`} role="img" aria-label={`Simulated system: ${statusText}`}>
              <g className="pg-wires">
                {wires.map((w) => (
                  <polyline key={w.key} points={pts(w.p)} className={w.dashed ? "dashed" : ""} />
                ))}
                <g opacity={queue ? 1 : 0.25}>
                  <polyline points={pts(L.r2queue(3))} className="dashed" />
                  <polyline points={pts(L.queue2db)} className="dashed" />
                </g>
              </g>
              <Box r={L.clients} title="clients" sub={`${rps} rps`} />
              <Box r={L.lb} title={narrow ? "load bal." : "load balancer"} sub="round-robin" cls="primary" />
              {L.replicas.map((r, i) => {
                const active = i < replicas;
                const dead = i === m.dead;
                const sub = !active ? "standby" : dead ? "✕ killed" : `${Math.round(Math.min(m.util, 1) * 100)}% cpu`;
                return <Box key={i} r={r} title={`api-${i + 1}`} sub={sub} cls={`${!active ? "off" : ""} ${dead ? "dead" : ""}`} />;
              })}
              <Box r={L.cache} title="cache" sub={cache ? "80% hit rate" : "disabled"} cls={cache ? "" : "off"} />
              <Box r={L.db} title="primary db" sub={`${Math.min(m.dbPct, 100)}% load`} cls={`store ${m.dbPct > 100 ? "dead" : ""}`} />
              <Box r={L.queue} title="write queue" sub="smooths spikes" cls={queue ? "" : "off"} />
              <g ref={packetsRef} />
            </svg>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
