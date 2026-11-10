"use client";

import { useEffect, useRef } from "react";

// A living rope around the viewport: three twisted strands following a
// rounded-rectangle path that undulates with travelling waves (like a rope
// being gently whipped). Drawn on a canvas; pauses when hidden and holds
// still for prefers-reduced-motion.
const INSET = 18; // distance of rope centreline from viewport edge
const RADIUS = 36; // corner radius of the path
const RAD = 5; // rope radius (strand orbit)
const SWAY = 7; // max lateral sway of the whole rope
const STEP = 3; // px between samples
const LAY = 0.17; // twist rate (radians per px)
const STRANDS = 3;
const CREAM = [239, 232, 216];

type Pt = { x: number; y: number; nx: number; ny: number; s: number };

function buildPath(w: number, h: number): { pts: Pt[]; total: number } {
  const x0 = INSET, y0 = INSET, x1 = w - INSET, y1 = h - INSET;
  const r = Math.min(RADIUS, (x1 - x0) / 2, (y1 - y0) / 2);
  const pts: Pt[] = [];
  let s = 0;
  const line = (ax: number, ay: number, bx: number, by: number, nx: number, ny: number) => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(len / STEP));
    for (let i = 0; i < n; i++) {
      const t = i / n;
      pts.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, nx, ny, s: s + len * t });
    }
    s += len;
  };
  const arc = (cx: number, cy: number, a0: number) => {
    const len = (Math.PI / 2) * r;
    const n = Math.max(2, Math.round(len / STEP));
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * (Math.PI / 2);
      // inward normal points back toward the corner centre
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, nx: -Math.cos(a), ny: -Math.sin(a), s: s + len * (i / n) });
    }
    s += len;
  };
  line(x0 + r, y0, x1 - r, y0, 0, 1);
  arc(x1 - r, y0 + r, -Math.PI / 2);
  line(x1, y0 + r, x1, y1 - r, -1, 0);
  arc(x1 - r, y1 - r, 0);
  line(x1 - r, y1, x0 + r, y1, 0, -1);
  arc(x0 + r, y1 - r, Math.PI / 2);
  line(x0, y1 - r, x0, y0 + r, 1, 0);
  arc(x0 + r, y0 + r, Math.PI);
  return { pts, total: s };
}

export default function AliveBorder() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0, h = 0, raf = 0;
    let path = buildPath(1, 1);
    // scratch buffers
    let cx = new Float32Array(0), cy = new Float32Array(0);
    let tx = new Float32Array(0), ty = new Float32Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      path = buildPath(w, h);
      const n = path.pts.length;
      cx = new Float32Array(n); cy = new Float32Array(n);
      tx = new Float32Array(n); ty = new Float32Array(n);
    };

    const draw = (t: number) => {
      const k = t / 1000;
      const { pts, total } = path;
      const n = pts.length;
      const u = (Math.PI * 2) / total;
      // whole number of twists around the loop so the seam is invisible
      const lay = (Math.round((total * LAY) / (Math.PI * 2)) * Math.PI * 2) / total;
      ctx.clearRect(0, 0, w, h);

      // 1. centreline: slow travelling waves push the rope sideways
      //    (normal) and make it creep along itself (tangent shimmer)
      for (let i = 0; i < n; i++) {
        const p = pts[i];
        const a = p.s * u;
        const sway =
          Math.sin(a * 5 - k * 0.9) * 0.45 +
          Math.sin(a * 11 + k * 1.3 + 1.7) * 0.3 +
          Math.sin(a * 23 - k * 2.1 + 4.0) * 0.15 +
          Math.sin(a * 2 + k * 0.4) * 0.35;
        cx[i] = p.x + p.nx * sway * SWAY;
        cy[i] = p.y + p.ny * sway * SWAY;
      }
      // 2. tangents from neighbours (closed loop)
      for (let i = 0; i < n; i++) {
        const a = (i + n - 1) % n, b = (i + 1) % n;
        const dx = cx[b] - cx[a], dy = cy[b] - cy[a];
        const l = Math.hypot(dx, dy) || 1;
        tx[i] = dx / l; ty[i] = dy / l;
      }

      // 3. strands: each orbits the centreline; depth = cos(angle)
      ctx.lineCap = "round";
      const twistPhase = k * 1.6; // rope slowly "crawls"
      const lastX = new Float32Array(STRANDS), lastY = new Float32Array(STRANDS);
      for (let i = 0; i <= n; i++) {
        const j = i % n;
        const ang0 = pts[j].s * lay - twistPhase;
        const order: { sI: number; depth: number; x: number; y: number }[] = [];
        for (let sI = 0; sI < STRANDS; sI++) {
          const th = ang0 + (sI * Math.PI * 2) / STRANDS;
          // orbit offset lies along the normal (perpendicular to tangent)
          const off = Math.cos(th) * RAD;
          const depth = Math.sin(th); // -1 (behind) .. 1 (in front)
          order.push({
            sI, depth,
            x: cx[j] + -ty[j] * off,
            y: cy[j] + tx[j] * off,
          });
        }
        order.sort((p, q) => p.depth - q.depth);
        if (i > 0) {
          for (const o of order) {
            const d = (o.depth + 1) / 2; // 0..1
            const shade = 0.35 + 0.65 * d;
            // dark underside gives the over/under illusion
            ctx.strokeStyle = "rgba(11,10,9,0.9)";
            ctx.lineWidth = 4.6 + d * 1.2;
            ctx.beginPath();
            ctx.moveTo(lastX[o.sI], lastY[o.sI]);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
            ctx.strokeStyle = `rgba(${CREAM[0]},${CREAM[1]},${CREAM[2]},${shade.toFixed(2)})`;
            ctx.lineWidth = 2.8 + d * 1.3;
            ctx.beginPath();
            ctx.moveTo(lastX[o.sI], lastY[o.sI]);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }
        for (const o of order) { lastX[o.sI] = o.x; lastY[o.sI] = o.y; }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      resize();
      if (reduce.matches) draw(0);
      else raf = requestAnimationFrame(loop);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    start();
    window.addEventListener("resize", start);
    document.addEventListener("visibilitychange", onVis);
    reduce.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", onVis);
      reduce.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
