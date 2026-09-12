import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const visible = useRef(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || isCoarse;
    if (!isFine || isTouch) return;
    if (window.innerWidth < 1024) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        if (glowRef.current) glowRef.current.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible.current = false;
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };

    const onEnter = () => {
      visible.current = true;
      if (glowRef.current) glowRef.current.style.opacity = "1";
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [role='button'], [data-glow-strong]")) {
        hovering.current = true;
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const rel = e.relatedTarget as HTMLElement | null;
      if (t.closest("a, button, [role='button'], [data-glow-strong]")) {
        if (!rel || !rel.closest("a, button, [role='button'], [data-glow-strong]")) {
          hovering.current = false;
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const animate = () => {
      // premium easing - slower lag
      pos.current.x += (mouse.current.x - pos.current.x) * 0.075;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.075;

      if (glowRef.current) {
        // stronger on interactive hover
        const strength = hovering.current ? 1.22 : 1;
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${strength})`;
        glowRef.current.style.opacity = visible.current ? (hovering.current ? "0.95" : "0.72") : "0";
      }

      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="cursor-glow-root hidden lg:block"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "min(48vw, 520px)",
          height: "min(48vw, 520px)",
          borderRadius: "50%",
          opacity: 0,
          willChange: "transform, opacity",
          transform: "translate3d(-100px,-100px,0) translate(-50%,-50%)",
          transition: "opacity 0.7s ease",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(157,177,255,0.18) 0%, rgba(157,177,255,0.10) 16%, rgba(157,177,255,0.045) 30%, rgba(233,238,252,0.02) 48%, rgba(157,177,255,0) 70%)",
          filter: "blur(26px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "22%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,238,252,0.20) 0%, rgba(233,238,252,0.06) 38%, rgba(233,238,252,0) 72%)",
            filter: "blur(16px)",
          }}
        />
      </div>
      <style>{`
        @media (hover: none), (pointer: coarse) {
          .cursor-glow-root { display: none !important; }
        }
      `}</style>
    </div>
  );
}
