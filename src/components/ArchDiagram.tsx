import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../themes";

/*
  An architecture diagram drawn like a whiteboard sketch: every box is placed
  by hand on a fixed design canvas, the arrows are routed from those
  coordinates, and the whole canvas is scaled to fit its container. Packets
  travel along the solid arrows. When the container gets too narrow to read a
  scaled drawing (phones), the same boxes are shown as a top-to-bottom list.
*/

type Pt = [number, number];

export interface ArchNode {
  id: string;
  title: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: "client" | "service" | "primary" | "store" | "ext" | "note" | "soft";
  /** Makes the box a button (e.g. jump to a section). */
  onClick?: () => void;
}

export interface ArchEdge {
  from: string;
  to: string;
  dashed?: boolean;
  /** A dotted tie to an annotation: no arrow head, no packets. */
  note?: boolean;
  /** Hand-routed path in canvas coordinates, used instead of auto-routing. */
  points?: Pt[];
}

export interface ArchGroup {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export interface ArchSpec {
  w: number;
  h: number;
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups?: ArchGroup[];
}

interface Props {
  spec: ArchSpec;
  className?: string;
  label?: string;
  /** Largest scale the drawing may grow to when there is room. */
  maxScale?: number;
  /** Below this container width, show the list instead (0 = never). */
  listBelow?: number;
}

type Box = { l: number; t: number; r: number; b: number; cx: number; cy: number };

const HEAD = 3; // stop short so the arrow head touches the box edge

function box(n: ArchNode): Box {
  return { l: n.x, t: n.y, r: n.x + n.w, b: n.y + n.h, cx: n.x + n.w / 2, cy: n.y + n.h / 2 };
}

function route(s: Box, t: Box, note: boolean): { d: string; length: number } {
  const stop = note ? 0 : HEAD;
  const yOverlap = Math.min(s.b, t.b) - Math.max(s.t, t.t);
  const xOverlap = Math.min(s.r, t.r) - Math.max(s.l, t.l);
  if (yOverlap > 10) {
    const y = (Math.max(s.t, t.t) + Math.min(s.b, t.b)) / 2;
    const [x1, x2] = t.l >= s.r ? [s.r, t.l - stop] : [s.l, t.r + stop];
    return { d: `M ${x1} ${y} H ${x2}`, length: Math.abs(x2 - x1) };
  }
  if (xOverlap > 10) {
    const x = (Math.max(s.l, t.l) + Math.min(s.r, t.r)) / 2;
    const [y1, y2] = t.t >= s.b ? [s.b, t.t - stop] : [s.t, t.b + stop];
    return { d: `M ${x} ${y1} V ${y2}`, length: Math.abs(y2 - y1) };
  }
  const down = t.t >= s.b;
  const y1 = down ? s.b : s.t;
  const y2 = down ? t.t - stop : t.b + stop;
  const mid = down ? (s.b + t.t) / 2 : (s.t + t.b) / 2;
  return {
    d: `M ${s.cx} ${y1} V ${mid} H ${t.cx} V ${y2}`,
    length: Math.abs(mid - y1) + Math.abs(t.cx - s.cx) + Math.abs(y2 - mid),
  };
}

function polyline(points: Pt[]) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return { d: "M " + points.map(([x, y]) => `${x} ${y}`).join(" L "), length };
}

export default function ArchDiagram({ spec, className = "", label, maxScale = 1.15, listBelow = 520 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [asList, setAsList] = useState(false);
  const [inView, setInView] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const reduced = prefersReducedMotion();
  const headId = `arch-head-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fit = () => {
      const w = host.clientWidth;
      setAsList(listBelow > 0 && w < listBelow);
      setScale(Math.min(maxScale, w / spec.w));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [spec.w, maxScale, listBelow]);

  // Animate in the first time the diagram scrolls into view.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const drawn = spec.edges.flatMap((e, i) => {
    const s = byId.get(e.from);
    const t = byId.get(e.to);
    if (!s || !t) return [];
    const { d, length } = e.points ? polyline(e.points) : route(box(s), box(t), !!e.note);
    return [{ ...e, d, length, i, key: `${e.from}>${e.to}` }];
  });
  const touches = (e: { from: string; to: string }) => hot !== null && (e.from === hot || e.to === hot);

  const nodeBody = (n: ArchNode) => (
    <>
      <b>{n.title}</b>
      {n.sub && <span>{n.sub}</span>}
    </>
  );

  return (
    <div
      ref={hostRef}
      className={`arch ${asList ? "arch-as-list" : ""} ${inView ? "is-in" : ""} ${className}`}
      style={asList ? undefined : { height: spec.h * scale }}
      role="group"
      aria-label={label}
    >
      {asList ? (
        <ol className="arch-list">
          {spec.nodes.map((n, i) => (
            <li key={n.id} className={`arch-node k-${n.kind ?? "service"}`} style={{ ["--i" as string]: i }}>
              {n.onClick ? (
                <button className="arch-node-btn" onClick={n.onClick}>
                  {nodeBody(n)}
                </button>
              ) : (
                nodeBody(n)
              )}
            </li>
          ))}
        </ol>
      ) : (
        <div className="arch-canvas" style={{ width: spec.w, height: spec.h, transform: `scale(${scale})` }}>
          {spec.groups?.map((g) => (
            <div key={g.label} className="arch-group" style={{ left: g.x, top: g.y, width: g.w, height: g.h }}>
              <span>{g.label}</span>
            </div>
          ))}

          <svg className="arch-edges" viewBox={`0 0 ${spec.w} ${spec.h}`} width={spec.w} height={spec.h} aria-hidden>
            <defs>
              <marker
                id={headId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
              </marker>
            </defs>
            {drawn.map((e) => (
              <path
                key={e.key}
                d={e.d}
                className={`arch-edge ${e.dashed ? "dashed" : ""} ${e.note ? "note" : ""} ${touches(e) ? "hot" : ""}`}
                style={{ ["--i" as string]: e.i }}
                pathLength={e.dashed || e.note ? undefined : 1}
                markerEnd={e.note ? undefined : `url(#${headId})`}
              />
            ))}
            {!reduced &&
              inView &&
              drawn
                .filter((e) => !e.note)
                .map((e, i) => (
                  <circle key={`p-${e.key}`} r="3.5" className={`arch-packet ${touches(e) ? "hot" : ""}`}>
                    <animateMotion
                      dur={`${Math.max(1.3, e.length / 85)}s`}
                      begin={`${0.9 + i * 0.3}s`}
                      repeatCount="indefinite"
                      path={e.d}
                    />
                  </circle>
                ))}
          </svg>

          {spec.nodes.map((n, i) => {
            const style = { left: n.x, top: n.y, width: n.w, height: n.h, ["--i" as string]: i };
            const cls = `arch-node k-${n.kind ?? "service"} ${hot === n.id ? "hot" : ""}`;
            const hover = { onPointerEnter: () => setHot(n.id), onPointerLeave: () => setHot(null) };
            return n.onClick ? (
              <button key={n.id} className={cls} style={style} onClick={n.onClick} {...hover}>
                {nodeBody(n)}
              </button>
            ) : (
              <div key={n.id} className={cls} style={style} {...hover}>
                {nodeBody(n)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
