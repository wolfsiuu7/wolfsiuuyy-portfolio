import { useEffect, useRef } from "react";
import CursorGlow from "./CursorGlow";

const TRAIL_COUNT = 4;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const cursor = useRef({ x: -100, y: -100 });
  const trail = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })));
  const hover = useRef(false);
  const visible = useRef(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const touchLike = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    if (!finePointer || touchLike || window.innerWidth < 1024) return;

    document.documentElement.classList.add("has-custom-cursor");

    const interactiveSelector =
      "a, button, input, textarea, select, label, [role='button'], [data-glow-strong]";

    const onMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      if (!visible.current) {
        visible.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
        trailRefs.current.forEach((el) => {
          if (el) el.style.opacity = "";
        });
      }
    };

    const onOver = (event: MouseEvent) => {
      hover.current = Boolean((event.target as HTMLElement).closest(interactiveSelector));
    };

    const onOut = (event: MouseEvent) => {
      const related = event.relatedTarget as HTMLElement | null;
      if (!related || !related.closest(interactiveSelector)) hover.current = false;
    };

    const onLeave = () => {
      visible.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      trailRefs.current.forEach((el) => {
        if (el) el.style.opacity = "0";
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);

    const animate = () => {
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.22;
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.22;

      if (cursorRef.current) {
        const scale = hover.current ? 1.85 : 1;
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      if (haloRef.current) {
        haloRef.current.style.opacity = hover.current ? "0.9" : "0.58";
        haloRef.current.style.transform = `translate(-50%, -50%) scale(${hover.current ? 1.4 : 1})`;
      }

      let targetX = cursor.current.x;
      let targetY = cursor.current.y;
      trail.current.forEach((point, i) => {
        point.x += (targetX - point.x) * (0.15 - i * 0.02);
        point.y += (targetY - point.y) * (0.15 - i * 0.02);
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
          el.style.opacity = visible.current ? `${[0.16, 0.11, 0.07, 0.04][i]}` : "0";
        }
        targetX = point.x;
        targetY = point.y;
      });

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <CursorGlow />
      <div
        aria-hidden="true"
        className="hidden lg:block"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10000 }}
      >
        {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: `${[12, 9, 7, 5][i]}px`,
              height: `${[12, 9, 7, 5][i]}px`,
              borderRadius: "999px",
              background: "#E9EEFC",
              filter: `blur(${[4, 3, 2.5, 2][i]}px)`,
              boxShadow: "0 0 16px rgba(157,177,255,0.45)",
              opacity: 0,
              transform: "translate3d(-100px,-100px,0) translate(-50%,-50%)",
              transition: "opacity .35s ease",
              willChange: "transform, opacity",
            }}
          />
        ))}

        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "9px",
            height: "9px",
            opacity: 0,
            transform: "translate3d(-100px,-100px,0) translate(-50%,-50%)",
            transition: "opacity .25s ease, transform .16s ease-out",
            willChange: "transform, opacity",
          }}
        >
          <div
            ref={haloRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(233,238,252,.58), rgba(157,177,255,.26) 38%, rgba(157,177,255,0) 72%)",
              filter: "blur(7px)",
              opacity: 0.58,
              transition: "opacity .3s ease, transform .3s cubic-bezier(.16,1,.3,1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "7px",
              height: "7px",
              borderRadius: "999px",
              transform: "translate(-50%, -50%)",
              background: "#F4F7FF",
              boxShadow:
                "0 0 8px rgba(244,247,255,.95), 0 0 22px rgba(157,177,255,.62), 0 0 38px rgba(30,44,134,.42)",
            }}
          />
        </div>
      </div>
    </>
  );
}