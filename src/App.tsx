import { useState, useEffect, useRef, type SyntheticEvent, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import CustomCursor from './components/CustomCursor';
import {
  Play,
  X,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Copy,
  Aperture,
  AtSign,
  Clapperboard,
  Eye,
  Clock,
  ChevronRight,
  ChevronDown,
  Star,
  MessageSquare,
  Film,
  Zap,
  Sparkles,
} from 'lucide-react';

// Fixed profile artwork - not editable by visitors
const AVATAR_SOURCES = [
  "https://i.imgur.com/IKYWdfl.jpg",
  "https://i.imgur.com/IKYWdflh.jpg",
  "https://pbs.twimg.com/profile_images/2092731245830557696/xxw48mGY_400x400.jpg",
  "https://images.weserv.nl/?url=" + encodeURIComponent("https://i.imgur.com/IKYWdfl.jpg"),
  "/profile.jpg",
];
const DEFAULT_AVATAR = AVATAR_SOURCES[0];

type Work = {
  id: number;
  title: string;
  tag: string;
  ytId: string;
  thumb: string;
  meta: string;
  desc: string;
  tools: string[];
  duration: string;
  year: string;
};

const WORKS: Work[] = [
  {
    id: 1,
    title: "iPhone 17 Pro Motion Graphics",
    tag: "MOTION GRAPHICS",
    ytId: "l3wlOTp81I8",
    thumb: "https://i.ytimg.com/vi/l3wlOTp81I8/maxresdefault.jpg",
    meta: "YOUTUBE • @Wolfsiuu7 • 4K",
    desc: "High-end product reveal — kinetic type, glass reflections, seamless camera moves that sell the device before a word is said.",
    tools: ["After Effects", "Premiere Pro", "Motion Blur"],
    duration: "00:18",
    year: "2025",
  },
  {
    id: 2,
    title: "What Is The Truth After Effects Motion Graphics",
    tag: "MOTION GRAPHICS",
    ytId: "VuRGrPCTBgk",
    thumb: "https://i.ytimg.com/vi/VuRGrPCTBgk/maxresdefault.jpg",
    meta: "YOUTUBE • @Wolfsiuu7 • 4K",
    desc: "Editorial title sequence with stark typography, light leaks and rhythmic cuts — built for retention in the first 3 seconds.",
    tools: ["After Effects", "Typography", "Sound Design"],
    duration: "00:24",
    year: "2025",
  },
  {
    id: 3,
    title: "Spotify Top Artists Motion Graphics",
    tag: "MOTION GRAPHICS",
    ytId: "8F7ePXPvbwQ",
    thumb: "https://i.ytimg.com/vi/8F7ePXPvbwQ/maxresdefault.jpg",
    meta: "YOUTUBE • @Wolfsiuu7 • 4K",
    desc: "Data-driven lyric visual — animated charts, smooth morphs and beat-synced transitions that turn stats into story.",
    tools: ["After Effects", "Data Viz", "Beat Sync"],
    duration: "00:31",
    year: "2025",
  },
];

const SERVICES = [
  { n: "01", title: "Cinematic Long-Form", desc: "YouTube videos, documentaries & podcasts that keep viewers watching. Story-first structure, J-cuts, sound design.", tags: ["Retention Editing", "Storytelling"] },
  { n: "02", title: "Viral Short-Form", desc: "Reels, TikToks, Shorts engineered for hook-rate. Punchy cuts, auto-captions, SFX that hits.", tags: ["0-3s Hooks", "Captions & SFX"] },
  { n: "03", title: "Commercial & Promo", desc: "Ads that don't feel like ads. Clean motion graphics, brand-aligned pacing, conversion-focused.", tags: ["Motion Graphics", "Color Grade"] },
  { n: "04", title: "Color & Sound Polish", desc: "DaVinci-grade color, audio cleanup, mix & master. Makes amateur footage look $10k.", tags: ["DaVinci Resolve", "Audio Mix"] },
];

const EDITING_STATES = [
  { project: "024", status: "IN PROGRESS", color: "bg-emerald-400", dot: "shadow-[0_0_10px_rgba(52,211,153,0.8)]" },
  { project: "031", status: "RENDERING", color: "bg-[#9DB1FF]", dot: "shadow-[0_0_10px_rgba(157,177,255,0.8)]" },
  { project: "017", status: "REVIEW", color: "bg-amber-300", dot: "shadow-[0_0_10px_rgba(252,211,77,0.8)]" },
  { project: "029", status: "COLOR GRADE", color: "bg-violet-400", dot: "shadow-[0_0_10px_rgba(167,139,250,0.8)]" },
];

// Magnetic wrapper - subtle move toward cursor
function Magnetic({
  children,
  strength = 0.18,
  radius = 240,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse || window.innerWidth < 1024) return;

    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const factor = 1 - dist / radius;
        target.current.x = dx * strength * factor;
        target.current.y = dy * strength * factor;
      } else {
        target.current.x = 0;
        target.current.y = 0;
      }
    };
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 1400,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setVal(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
            else {
              el.classList.add("stat-flicker");
              setTimeout(() => el.classList.remove("stat-flicker"), 340);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="bebas text-4xl leading-none tabular-nums">
      {val}
      {suffix}
    </div>
  );
}

function CurrentlyEditing() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % EDITING_STATES.length), 3200);
    return () => clearInterval(id);
  }, []);
  const s = EDITING_STATES[idx];
  return (
    <div className="mono text-[10px] tracking-widest flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0A1128]/80 border border-[#E9EEFC]/10 backdrop-blur-md shadow-[0_0_20px_rgba(30,44,134,0.15)]">
      <span className={`w-2 h-2 rounded-full ${s.color} ${s.dot} animate-pulse`} />
      <span className="opacity-60">PROJECT // {s.project}</span>
      <span className="w-px h-3 bg-[#E9EEFC]/15" />
      <span className="flex items-center gap-1.5">
        STATUS // {s.status}
        <span className="inline-block w-[3px] h-[3px] rounded-full bg-[#E9EEFC]/40 animate-[blink_1.2s_steps(2)_infinite]" />
      </span>
    </div>
  );
}

function WorkCard({
  work,
  index,
  onOpen,
}: {
  work: Work;
  index: number;
  onOpen: (w: Work) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [hovered, setHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!hovered) {
      setShowVideo(false);
      return;
    }
    const t = setTimeout(() => setShowVideo(true), 380);
    return () => clearTimeout(t);
  }, [hovered]);

  const onCardMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!cardRef.current || !imgRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    imgRef.current.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0) scale(${hovered ? 1.08 : 1})`;
    const overlay = cardRef.current.querySelector(".card-parallax") as HTMLElement;
    if (overlay) {
      overlay.style.transform = `translate3d(${x * -8}px, ${y * -6}px, 0)`;
    }
  };

  const onLeave = () => {
    setHovered(false);
    if (imgRef.current) imgRef.current.style.transform = "translate3d(0,0,0) scale(1)";
    const overlay = cardRef.current?.querySelector(".card-parallax") as HTMLElement;
    if (overlay) overlay.style.transform = "translate3d(0,0,0)";
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onMouseMove={onCardMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={() => onOpen(work)}
      data-glow-strong
      className={`group relative bg-[#0A1128] p-3 text-left cursor-pointer overflow-hidden rounded-[20px] border border-transparent hover:border-[#9DB1FF]/20 hover:shadow-[0_0_40px_rgba(30,44,134,0.18),0_0_0_1px_rgba(157,177,255,0.12)] transition-all duration-500 ${index === 0 ? "md:col-span-2" : ""}`}
    >
      <div className={`relative overflow-hidden rounded-[16px] bg-[#04060C] ${index === 0 ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {/* thumb */}
        <img
          ref={imgRef}
          src={work.thumb}
          alt={`${work.title} — video thumbnail`}
          loading="lazy"
          onError={(e) => {
            const t = e.currentTarget;
            if (t.src.includes("maxresdefault")) t.src = t.src.replace("maxresdefault", "hqdefault");
            else t.style.display = "none";
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{ transform: "translate3d(0,0,0) scale(1)" }}
        />

        {/* video preview on hover */}
        {showVideo && hovered && (
          <iframe
            src={`https://www.youtube.com/embed/${work.ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${work.ytId}&rel=0&modestbranding=1`}
            title={`${work.title} preview`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        )}

        {/* cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060C]/95 via-[#04060C]/25 to-[#04060C]/40 group-hover:from-[#04060C]/90 group-hover:via-[#04060C]/10 transition-colors duration-500" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(157,177,255,0.18),transparent_70%)]" />

        {/* top meta */}
        <div className="card-parallax absolute top-3 left-3 right-3 flex items-center justify-between will-change-transform transition-transform duration-500">
          <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#04060C]/70 text-[#E9EEFC] backdrop-blur border border-[#E9EEFC]/10">
            {String(index + 1).padStart(2, "0")} / 03 • {work.duration}
          </span>
          <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#E9EEFC] text-[#0A1128] flex items-center gap-1.5 font-medium">
            <Film size={11} aria-hidden="true" /> {work.year}
          </span>
        </div>

        {/* center play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#E9EEFC]/10 backdrop-blur-md border border-[#E9EEFC]/20 text-[#E9EEFC] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_30px_rgba(157,177,255,0.25)]">
            <Play size={18} fill="currentColor" className="translate-x-px" aria-hidden="true" />
          </div>
        </div>

        {/* bottom */}
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h4 className="bebas text-[26px] md:text-[30px] leading-[0.9] tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-500 delay-75">
                {work.title}
              </h4>
              <p className="mt-2 mono text-[11px] leading-[1.5] text-[#E9EEFC]/0 group-hover:text-[#E9EEFC]/65 max-w-[46ch] line-clamp-2 transition-colors duration-500 delay-100">
                {work.desc}
              </p>
            </div>
            <div className="hidden sm:flex mono text-[10px] px-3 py-1.5 rounded-full bg-[#1E2C86] text-[#E9EEFC] items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-150 shrink-0">
              WATCH <ArrowUpRight size={12} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2 px-2 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="bebas text-2xl md:text-[26px] leading-none tracking-wide truncate">{work.title}</h4>
            <span className="w-1 h-1 rounded-full bg-[#9DB1FF]/60 hidden sm:block" />
            <span className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 hidden sm:block">{work.duration}</span>
          </div>
          <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/50 mt-1.5 truncate">{work.meta}</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {work.tools.map((t) => (
              <span key={t} className="mono text-[9px] tracking-widest px-2 py-1 rounded-full border border-[#E9EEFC]/10 bg-[#E9EEFC]/[0.03] text-[#E9EEFC]/60 group-hover:border-[#9DB1FF]/20 group-hover:text-[#E9EEFC]/80 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
        <span className="mono text-[10px] px-2.5 py-1 rounded-full border border-[#E9EEFC]/15 shrink-0 group-hover:border-[#9DB1FF]/30 group-hover:text-[#9DB1FF] transition-colors">
          {work.tag}
        </span>
      </div>
    </button>
  );
}

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [heroArtHover, setHeroArtHover] = useState(false);
  const [transition, setTransition] = useState<{ active: boolean; label: string; target: string | null }>({ active: false, label: "", target: null });

  const handleAvatarError = (e: SyntheticEvent<HTMLImageElement>) => {
    const t = e.currentTarget;
    const idx = AVATAR_SOURCES.findIndex((s) => t.src.startsWith(s));
    if (idx === -1) {
      t.src = DEFAULT_AVATAR;
      return;
    }
    const next = AVATAR_SOURCES[idx + 1];
    if (next) t.src = next;
  };

  const flash = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2600);
  };

  const onHeroMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("adam.elfidh7@gmail.com");
    flash("EMAIL COPIED — adam.elfidh7@gmail.com");
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    const subject = encodeURIComponent(`Portfolio Review from ${reviewName.trim()}`);
    const body = encodeURIComponent(
      `Name: ${reviewName.trim()}\nRole / company: ${reviewRole.trim() || "Not provided"}\nRating: ${reviewRating}/5\n\nReview:\n${reviewText.trim()}`
    );
    setReviewSent(true);
    flash("THANK YOU — OPENING YOUR MAIL APP TO SEND THE REVIEW");
    window.setTimeout(() => {
      window.location.href = `mailto:adam.elfidh7@gmail.com?subject=${subject}&body=${body}`;
    }, 450);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, label: string) => {
    e.preventDefault();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setTransition({ active: true, label, target: targetId });
    setTimeout(() => {
      document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
    }, 320);
    setTimeout(() => {
      setTransition({ active: false, label: "", target: null });
    }, 760);
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveWork(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            // stagger children
            const stagger = e.target.querySelectorAll("[data-stagger]");
            stagger.forEach((child, i) => {
              (child as HTMLElement).style.transitionDelay = `${i * 70}ms`;
              child.classList.add("is-visible");
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[#04060C] text-[#E9EEFC] selection:bg-[#1E2C86] selection:text-[#E9EEFC] antialiased overflow-x-hidden">
      <CustomCursor />

      {/* Subtle global atmosphere - visual layer only, no layout or interaction changes */}
      <div className="cinematic-atmosphere fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="atmos-grid absolute inset-[-80px]" />
        <div className="atmos-orb atmos-orb-primary" />
        <div className="atmos-orb atmos-orb-secondary" />
        <div className="atmos-noise absolute inset-0" />
      </div>

      {/* Section transition overlay - editing software inspired */}
      <div
        className={`fixed inset-0 z-[90] pointer-events-none transition-opacity duration-300 ${transition.active ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#04060C]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(30,44,134,0.22),transparent_70%)]" />
        <div className={`absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#9DB1FF] to-transparent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${transition.active ? "translate-y-[50vh]" : "-translate-y-2"}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mono text-[10px] tracking-[0.4em] text-[#9DB1FF] mb-3">CUT → {transition.label}</div>
            <div className="bebas text-6xl md:text-7xl tracking-wide">{transition.label}</div>
          </div>
        </div>
        <div className="absolute bottom-8 left-6 right-6 flex justify-between mono text-[10px] tracking-widest text-[#E9EEFC]/30">
          <span>00:00:00:00</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#9DB1FF] animate-pulse" /> PLAYBACK</span>
          <span>REC ●</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        *{font-family: 'Syne', sans-serif;}
        .mono{font-family: 'JetBrains Mono', monospace;}
        .bebas{font-family: 'Bebas Neue', sans-serif;}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#1E2C86;border-radius:10px}
        ::-webkit-scrollbar-track{background:#04060C}
        .grain:after{
          content:"";position:absolute;inset:0;pointer-events:none;opacity:0.045;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        .cinematic-atmosphere{opacity:.72;mix-blend-mode:screen}
        .atmos-grid{
          opacity:.12;
          background-image:linear-gradient(to right,rgba(157,177,255,.16) 1px,transparent 1px),linear-gradient(to bottom,rgba(157,177,255,.12) 1px,transparent 1px);
          background-size:72px 72px;
          animation:atmosGridDrift 70s linear infinite;
        }
        .atmos-orb{position:absolute;border-radius:9999px;filter:blur(70px);will-change:transform,opacity;background:radial-gradient(circle,rgba(233,238,252,.24) 0%,rgba(157,177,255,.13) 18%,rgba(100,120,220,.052) 42%,rgba(157,177,255,0) 72%)}
        .atmos-orb-primary{width:34vw;height:34vw;min-width:280px;min-height:280px;top:12%;right:13%;opacity:.34;animation:atmosBreathe 12s ease-in-out infinite,atmosFloat 18s ease-in-out infinite}
        .atmos-orb-secondary{width:48vw;height:48vw;min-width:360px;min-height:360px;left:-12%;bottom:8%;opacity:.16;filter:blur(96px);background:radial-gradient(circle,rgba(160,170,255,.16) 0%,rgba(30,44,134,.09) 35%,rgba(30,44,134,0) 74%);animation:atmosBreatheSoft 16s ease-in-out infinite reverse,atmosFloatSoft 24s ease-in-out infinite}
        .atmos-noise{opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")}
        [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
        [data-reveal].is-visible{opacity:1;transform:none}
        [data-stagger]{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
        [data-stagger].is-visible{opacity:1;transform:none}
        @media (prefers-reduced-motion: reduce){
          [data-reveal],[data-stagger]{opacity:1;transform:none;transition:none}
          .hero-up{opacity:1;animation:none}
          .float-y{animation:none}
          .grid-shift{animation:none}
          .atmos-grid,.atmos-orb{animation:none}
        }
        @keyframes heroUp{from{opacity:0;transform:translateY(42px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes spinSlow{to{transform:rotate(360deg)}}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes gridShift{0%{transform:translate(0,0)}100%{transform:translate(72px,72px)}}
        @keyframes shine{0%{transform:translateX(-120%) skewX(-18deg)}100%{transform:translateX(220%) skewX(-18deg)}}
        @keyframes statFlicker{0%,100%{filter:none;transform:none}20%{filter:brightness(1.4) contrast(1.1);transform:translateX(0.5px)}40%{filter:brightness(0.9);transform:translateX(-0.5px)}60%{filter:brightness(1.2);transform:translateX(0.3px)}}
        @keyframes particleDrift{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:0.18}90%{opacity:0.18}100%{transform:translateY(-120px) translateX(18px);opacity:0}}
        @keyframes rgbShift{0%{text-shadow:0 0 0 transparent}50%{text-shadow:1.2px 0 0 rgba(255,60,110,0.18), -1.2px 0 0 rgba(60,255,255,0.18)}100%{text-shadow:0 0 0 transparent}}
        @keyframes atmosGridDrift{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(72px,72px,0)}}
        @keyframes atmosBreathe{0%,100%{opacity:.26;transform:translate3d(0,0,0) scale(.98)}50%{opacity:.38;transform:translate3d(-10px,8px,0) scale(1.04)}}
        @keyframes atmosBreatheSoft{0%,100%{opacity:.12;transform:translate3d(0,0,0) scale(1)}50%{opacity:.2;transform:translate3d(8px,-10px,0) scale(1.05)}}
        @keyframes atmosFloat{0%,100%{margin-top:0;margin-right:0}50%{margin-top:10px;margin-right:-8px}}
        @keyframes atmosFloatSoft{0%,100%{margin-bottom:0;margin-left:0}50%{margin-bottom:-12px;margin-left:10px}}
        .hero-up{opacity:0;animation:heroUp .95s cubic-bezier(.16,1,0.3,1) forwards}
        .float-y{animation:floatY 6s ease-in-out infinite}
        .grid-shift{animation:gridShift 90s linear infinite}
        .stat-flicker{animation:statFlicker 0.32s ease}
        .shine{position:relative;overflow:hidden}
        .shine:after{content:"";position:absolute;top:0;left:0;width:42%;height:100%;background:linear-gradient(100deg, transparent, rgba(233,238,252,0.22), transparent);transform:translateX(-120%) skewX(-18deg);pointer-events:none}
        .shine:hover:after{animation:shine 0.9s ease}
        .nav-link{position:relative}
        .nav-link:after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:1px;background:#9DB1FF;transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.16,1,.3,1)}
        .nav-link:hover:after,.nav-link:focus-visible:after{transform:scaleX(1)}
        .hero-chroma:hover{animation:rgbShift 0.42s ease}
      `}</style>

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] mono text-xs tracking-widest px-4 py-2 bg-[#E9EEFC] text-[#0A1128] rounded-full transition-all duration-500 max-w-[92vw] text-center shadow-[0_0_30px_rgba(157,177,255,0.25)] ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {toastMsg}
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#E9EEFC]/[0.08] bg-[#04060C]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <a href="#top" aria-label="Wolf Siuu - back to top" className="relative shrink-0 rounded-full group">
                <img
                  src={DEFAULT_AVATAR}
                  alt="Wolf Siuu profile picture"
                  onError={handleAvatarError}
                  className="w-10 h-10 object-cover ring-1 ring-[#E9EEFC]/20 group-hover:ring-[#9DB1FF]/50 transition duration-300"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#9DB1FF] border-2 border-[#04060C] animate-pulse" title="Online" />
              </a>
              <a href="#top" className="mono text-[11px] tracking-[0.2em] hover:text-[#9DB1FF] transition nav-link">WOLF SIUU ©2026</a>
            </div>
            <div className="hidden md:flex items-center gap-7 mono text-[11px] tracking-widest text-[#E9EEFC]/60">
              <a href="#work" onClick={(e) => handleNavClick(e, "#work", "WORK")} className="hover:text-[#E9EEFC] transition nav-link">WORK</a>
              <a href="#services" onClick={(e) => handleNavClick(e, "#services", "SERVICES")} className="hover:text-[#E9EEFC] transition nav-link">SERVICES</a>
              <a href="#about" onClick={(e) => handleNavClick(e, "#about", "ABOUT")} className="hover:text-[#E9EEFC] transition nav-link">ABOUT</a>
              <a href="#process" onClick={(e) => handleNavClick(e, "#process", "PROCESS")} className="hover:text-[#E9EEFC] transition nav-link">PROCESS</a>
              <a href="#reviews" onClick={(e) => handleNavClick(e, "#reviews", "LEAVE REVIEW")} className="hover:text-[#E9EEFC] transition nav-link">LEAVE REVIEW</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center mr-2">
              <CurrentlyEditing />
            </div>
            <Magnetic strength={0.18} radius={200}>
              <a href="#contact" onClick={(e) => handleNavClick(e, "#contact", "CONTACT")} data-glow-strong className="mono text-[11px] tracking-widest px-5 py-2.5 rounded-full bg-[#E9EEFC] text-[#0A1128] hover:bg-[#9DB1FF] transition font-medium flex items-center gap-2 group shine">
                HIRE ME <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </a>
            </Magnetic>
            <button onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu" className="md:hidden w-9 h-9 rounded-full border border-[#E9EEFC]/15 flex flex-col items-center justify-center gap-[5px]">
              <span className="block w-4 h-px bg-[#E9EEFC]" />
              <span className="block w-4 h-px bg-[#E9EEFC]" />
              <span className="block w-4 h-px bg-[#E9EEFC]" />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-[#E9EEFC]/10 bg-[#0A1128] px-6 py-6 flex flex-col gap-4 mono text-sm">
            <a onClick={(e) => { setMobileMenu(false); handleNavClick(e, "#work", "WORK"); }} href="#work">WORK</a>
            <a onClick={(e) => { setMobileMenu(false); handleNavClick(e, "#services", "SERVICES"); }} href="#services">SERVICES</a>
            <a onClick={(e) => { setMobileMenu(false); handleNavClick(e, "#about", "ABOUT"); }} href="#about">ABOUT</a>
            <a onClick={(e) => { setMobileMenu(false); handleNavClick(e, "#reviews", "LEAVE REVIEW"); }} href="#reviews">LEAVE REVIEW</a>
            <a onClick={(e) => { setMobileMenu(false); handleNavClick(e, "#contact", "CONTACT"); }} href="#contact">CONTACT</a>
            <div className="pt-4">
              <CurrentlyEditing />
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative pt-[64px] min-h-[100svh] flex flex-col overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid-shift absolute inset-[-72px] bg-[linear-gradient(to_right,#E9EEFC07_1px,transparent_1px),linear-gradient(to_bottom,#E9EEFC07_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div
            className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full blur-[130px] bg-[#1E2C86]/25"
            style={{ transform: `translate3d(${tilt.x * -26}px, ${tilt.y * -20}px, 0)`, transition: "transform .6s cubic-bezier(0.16,1,0.3,1)" }}
          />
          <div
            className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-[140px] bg-[#16226B]/30"
            style={{ transform: `translate3d(${tilt.x * 18}px, ${tilt.y * 14}px, 0)`, transition: "transform .7s cubic-bezier(0.16,1,0.3,1)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[90px] bg-[radial-gradient(circle,rgba(157,177,255,0.08),transparent_60%)]"
            style={{ transform: `translate3d(-50%,-50%,0) translate(${tilt.x * 10}px, ${tilt.y * 8}px)`, transition: "transform .8s cubic-bezier(0.16,1,0.3,1)" }}
          />
          {/* particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#9DB1FF]/30"
                style={{
                  left: `${12 + i * 11}%`,
                  top: `${20 + (i % 3) * 22}%`,
                  animation: `particleDrift ${14 + i * 2}s linear infinite`,
                  animationDelay: `${i * 1.3}s`,
                }}
              />
            ))}
          </div>
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 md:px-10 flex-1 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-8 items-center py-14 md:py-16">
          {/* Left */}
          <div className="order-2 lg:order-1">
            <div className="hero-up mono text-[11px] tracking-[0.35em] text-[#9DB1FF] flex items-center gap-3 mb-6" style={{ animationDelay: "0.05s" }}>
              <span className="w-10 h-px bg-[#9DB1FF]/50" />
              HELLO, I AM
              <span className="w-[7px] h-[14px] bg-[#9DB1FF] animate-[blink_1.1s_linear_infinite]" />
            </div>

            <h1 className="bebas leading-[0.82] tracking-[-0.015em]">
              <span className="hero-up block text-[19vw] lg:text-[10.5vw]" style={{ animationDelay: "0.12s" }}>WOLF</span>
              <span className="hero-up block text-[19vw] lg:text-[10.5vw] text-transparent" style={{ WebkitTextStroke: "1.5px #E9EEFC", animationDelay: "0.24s" }}>SIUU</span>
            </h1>

            <div className="hero-up mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.36s" }}>
              <span className="mono text-[11px] md:text-[13px] tracking-[0.18em] px-4 py-2 rounded-full bg-[#1E2C86] text-[#E9EEFC]">VIDEO EDITOR</span>
              <span className="mono text-[11px] md:text-[13px] tracking-[0.18em] px-4 py-2 rounded-full border border-[#E9EEFC]/20 text-[#E9EEFC]/80">MOTION GRAPHICS</span>
              <span className="mono text-[11px] md:text-[13px] tracking-[0.18em] px-4 py-2 rounded-full border border-[#E9EEFC]/20 text-[#E9EEFC]/80">COLORIST</span>
            </div>

            <p className="hero-up mt-7 text-[16px] md:text-[18px] leading-[1.55] text-[#E9EEFC]/70 max-w-[46ch] font-light" style={{ animationDelay: "0.48s" }}>
              I turn raw, boring footage into <span className="text-[#E9EEFC] font-semibold">scroll-stopping, binge-worthy</span> stories.
              No templates. No fluff. Just ruthless cuts, cinematic sound, and edits that make people stay.
            </p>

            <div className="hero-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.60s" }}>
              <Magnetic strength={0.22} radius={260}>
                <a href="#work" onClick={(e) => handleNavClick(e, "#work", "WORK")} data-glow-strong className="group mono text-[12px] tracking-widest px-7 py-4 rounded-full bg-[#1E2C86] text-[#E9EEFC] hover:bg-[#2A3CA8] transition flex items-center gap-2 shine">
                  VIEW MY WORK <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic strength={0.18} radius={220}>
                <button onClick={() => setActiveWork(WORKS[0])} data-glow-strong className="mono text-[12px] tracking-widest px-7 py-4 rounded-full border border-[#E9EEFC]/20 hover:border-[#9DB1FF] hover:text-[#9DB1FF] transition flex items-center gap-2 cursor-pointer group">
                  <Play size={13} fill="currentColor" className="group-hover:scale-110 transition-transform" aria-hidden="true" /> PLAY SHOWREEL
                </button>
              </Magnetic>
            </div>

            <div className="hero-up mt-8 flex flex-wrap gap-2.5" style={{ animationDelay: "0.72s" }}>
              <Magnetic strength={0.14} radius={180}>
                <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" data-glow-strong className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/60 hover:text-[#9DB1FF] hover:shadow-[0_0_20px_rgba(225,48,108,0.18)] transition flex items-center gap-2 group">
                  <Aperture size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" /> INSTAGRAM
                </a>
              </Magnetic>
              <Magnetic strength={0.14} radius={180}>
                <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" data-glow-strong className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#E9EEFC]/30 hover:text-white transition flex items-center gap-2 group">
                  <AtSign size={12} className="group-hover:rotate-12 transition-transform" aria-hidden="true" /> X / TWITTER
                </a>
              </Magnetic>
              <Magnetic strength={0.14} radius={180}>
                <a href="https://www.youtube.com/@Wolfsiuu7" target="_blank" rel="noopener noreferrer" data-glow-strong className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#FF0000]/30 hover:text-[#FF8A8A] transition flex items-center gap-2 group">
                  <span className="relative flex items-center justify-center">
                    <Play size={12} fill="currentColor" className="group-hover:animate-pulse" aria-hidden="true" />
                    <span className="absolute inset-0 rounded-full bg-[#FF0000]/20 blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  YOUTUBE
                </a>
              </Magnetic>
              <Magnetic strength={0.14} radius={180}>
                <a href="mailto:adam.elfidh7@gmail.com" data-glow-strong className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/60 hover:text-[#9DB1FF] transition flex items-center gap-2 group">
                  <Mail size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" /> EMAIL
                </a>
              </Magnetic>
            </div>

            <div className="hero-up mt-12 grid grid-cols-3 gap-6 border-t border-[#E9EEFC]/10 pt-6 max-w-[560px]" style={{ animationDelay: "0.84s" }}>
              <div data-stagger>
                <Clapperboard size={14} className="text-[#9DB1FF] mb-2" aria-hidden="true" />
                <AnimatedCounter target={200} suffix="+" />
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mt-1">VIDEOS DELIVERED</div>
              </div>
              <div data-stagger>
                <Eye size={14} className="text-[#9DB1FF] mb-2" aria-hidden="true" />
                <AnimatedCounter target={5} suffix="M+" />
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mt-1">VIEWS GENERATED</div>
              </div>
              <div data-stagger>
                <Clock size={14} className="text-[#9DB1FF] mb-2" aria-hidden="true" />
                <AnimatedCounter target={48} suffix="H" />
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mt-1">AVG TURNAROUND</div>
              </div>
            </div>

            <div className="hero-up mt-8 lg:hidden" style={{ animationDelay: "0.96s" }}>
              <CurrentlyEditing />
            </div>
          </div>

          {/* Right — profile showcase */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:pr-6">
            <div className="hero-up relative" style={{ animationDelay: "0.25s" }}>
              <div
                className="relative w-[240px] sm:w-[300px] md:w-[360px] lg:w-[380px] xl:w-[430px] aspect-square"
                style={{ transform: `translate3d(${tilt.x * 10}px, ${tilt.y * 8}px, 0)`, transition: "transform .45s cubic-bezier(0.16,1,0.3,1)" }}
                onMouseEnter={() => setHeroArtHover(true)}
                onMouseLeave={() => setHeroArtHover(false)}
              >
                <div className="absolute inset-0 rounded-full bg-[#1E2C86]/40 blur-[70px] scale-110" />
                <div
                  className="absolute -inset-4 rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0deg, #1E2C86 60deg, #9DB1FF 110deg, transparent 170deg, transparent 360deg)",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))",
                    transform: `rotate(${tilt.x * -18}deg)`,
                    transition: "transform .8s cubic-bezier(0.16,1,0.3,1)",
                    animation: "spinSlow 14s linear infinite",
                  }}
                />
                <div
                  className="absolute -inset-9 rounded-full border border-dashed border-[#9DB1FF]/25"
                  style={{
                    transform: `translate3d(${tilt.x * -12}px, ${tilt.y * -10}px, 0) rotate(${tilt.y * 10}deg)`,
                    transition: "transform .9s cubic-bezier(0.16,1,0.3,1)",
                    animation: "spinSlow 46s linear infinite reverse",
                  }}
                />
                <div
                  className="absolute -inset-9"
                  style={{
                    transform: `translate3d(${tilt.x * 8}px, ${tilt.y * 6}px, 0)`,
                    transition: "transform .7s cubic-bezier(0.16,1,0.3,1)",
                    animation: "spinSlow 30s linear infinite",
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                    <defs>
                      <path id="wolf-circ" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" fill="none" />
                    </defs>
                    <text fill="#9DB1FF" fontSize="9" letterSpacing="3.2" className="mono" opacity="0.85">
                      <textPath href="#wolf-circ">WOLF SIUU • VIDEO EDITOR • MOTION GRAPHICS • COLOR • SOUND • </textPath>
                    </text>
                  </svg>
                </div>
                <div className={`relative block w-full h-full rounded-full overflow-hidden ring-1 ring-[#E9EEFC]/20 hero-chroma transition-all duration-500 ${heroArtHover ? "ring-[#9DB1FF]/40 shadow-[0_0_60px_rgba(30,44,134,0.35)]" : ""}`}>
                  <img
                    src={DEFAULT_AVATAR}
                    alt="Wolf Siuu — video editor portrait"
                    onError={handleAvatarError}
                    className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroArtHover ? "scale-[1.04] [filter:contrast(1.05)_brightness(1.05)]" : ""}`}
                  />
                  <div className={`absolute inset-0 rounded-full bg-[#04060C]/0 transition-colors duration-500 ${heroArtHover ? "bg-[#04060C]/10" : ""}`} />
                  {/* chromatic subtle */}
                  <div className={`absolute inset-0 rounded-full pointer-events-none mix-blend-screen opacity-0 transition-opacity duration-500 ${heroArtHover ? "opacity-100" : ""}`} style={{ background: "linear-gradient(90deg, rgba(255,60,110,0.06), transparent 22%, transparent 78%, rgba(60,255,255,0.06))" }} />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
                </div>
                <div className="absolute -right-3 top-8 float-y mono text-[10px] tracking-widest px-3.5 py-2 rounded-full bg-[#0A1128]/90 border border-[#9DB1FF]/30 text-[#9DB1FF] flex items-center gap-2 backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> AVAILABLE FOR WORK
                </div>
                <a
                  href="https://www.youtube.com/@Wolfsiuu7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -left-5 bottom-12 float-y [animation-delay:1.4s] mono text-[10px] tracking-widest px-3.5 py-2 rounded-full bg-[#1E2C86] text-[#E9EEFC] flex items-center gap-2 hover:bg-[#2A3CA8] transition group"
                >
                  <span className="relative">
                    <Play size={10} fill="currentColor" aria-hidden="true" />
                    <span className="absolute inset-0 rounded-full bg-white/20 blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  @WOLFSIUU7
                </a>
                <div className="absolute -left-2 -top-3 float-y [animation-delay:0.7s] mono text-[10px] tracking-widest px-3.5 py-2 rounded-full bg-[#0A1128]/90 border border-[#E9EEFC]/15 text-[#E9EEFC]/80 flex items-center gap-2 backdrop-blur">
                  <Clock size={10} aria-hidden="true" /> GMT+1 • MOROCCO
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-6 flex flex-col items-center gap-1.5 mono text-[10px] tracking-[0.3em] text-[#E9EEFC]/40">
          SCROLL
          <ChevronDown size={14} className="animate-bounce text-[#9DB1FF]" aria-hidden="true" />
        </div>

        <div className="relative border-y border-[#E9EEFC]/10 bg-[#1E2C86] text-[#E9EEFC] overflow-hidden py-3">
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap mono text-[13px] tracking-[0.2em] font-medium will-change-transform">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6 mx-6">
                CINEMATIC EDITS • VIRAL REELS • YOUTUBE GROWTH • COLOR GRADING • MOTION DESIGN • SOUND DESIGN • <span className="w-2 h-2 rounded-full bg-[#E9EEFC]" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" data-reveal className="mx-auto max-w-[1600px] px-6 md:px-10 py-20 md:py-28 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 border-t border-[#E9EEFC]/10">
        <div>
          <div className="mono text-[11px] tracking-[0.3em] text-[#E9EEFC]/40 mb-6">ABOUT ME — [02]</div>
          <h2 className="bebas text-[14vw] lg:text-[7vw] leading-[0.85]">NOT A<br />TEMPLATE<br />GUY.</h2>
          <div className="mt-8 flex gap-4">
            <div className="shrink-0 rounded-full">
              <img src={DEFAULT_AVATAR} alt="Wolf Siuu" onError={handleAvatarError} className="w-20 h-20 object-cover ring-2 ring-[#1E2C86] ring-offset-2 ring-offset-[#04060C]" />
            </div>
            <div className="mono text-[11px] leading-[1.6] text-[#E9EEFC]/60 max-w-[28ch]">
              WOLF SIUU — Video editor obsessed with pacing. Based in Morocco, working with creators & brands worldwide.
              <br /><br />
              <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" className="underline text-[#E9EEFC] hover:text-[#9DB1FF] transition">IG: @wolf.siuu7</a> • <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" className="underline text-[#E9EEFC] hover:text-[#9DB1FF] transition">X: @wolfsiuu7</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <p className="text-[22px] md:text-[28px] leading-[1.25] tracking-tight">
            Most editors just cut clips. I build <span className="bg-[#1E2C86] text-[#E9EEFC] px-2">retention machines</span>. Every frame has a job — hook, hold, or convert. If it doesn't, it's gone.
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-[#E9EEFC]/10">
            <div data-stagger>
              <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/30 mb-3">WHAT MAKES ME DIFFERENT</div>
              <ul className="space-y-3 mono text-[13px] leading-[1.6] text-[#E9EEFC]/70">
                <li className="flex gap-2 group"><ChevronRight size={14} className="text-[#9DB1FF] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /> Story &gt; Effects. I fix pacing before adding flair.</li>
                <li className="flex gap-2 group"><ChevronRight size={14} className="text-[#9DB1FF] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /> I edit for the algorithm &amp; the human.</li>
                <li className="flex gap-2 group"><ChevronRight size={14} className="text-[#9DB1FF] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /> Unlimited revisions? No. Right the first time? Yes.</li>
              </ul>
            </div>
            <div data-stagger className="rounded-2xl bg-[#0A1128] border border-[#E9EEFC]/10 p-6 hover:border-[#9DB1FF]/20 transition-colors">
              <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/30 mb-4">TOOLS I BREATHE</div>
              <div className="flex flex-wrap gap-2">
                {["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut", "Motion Graphics", "Sound Design", "Auto Captions", "Color Science"].map(t => (
                  <span key={t} className="mono text-[11px] px-3 py-1.5 rounded-full border border-[#E9EEFC]/10 bg-[#E9EEFC]/[0.03] hover:border-[#9DB1FF]/20 hover:bg-[#9DB1FF]/10 transition-colors">{t}</span>
                ))}
              </div>
              <div className="mt-6 mono text-[11px] text-[#E9EEFC]/40 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Available in GMT+1 • Fast comms on IG & Email
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-[#0A1128] text-[#E9EEFC] rounded-t-[32px] md:rounded-t-[48px] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(50%_40%_at_20%_10%,rgba(30,44,134,0.14),transparent_60%)]" />
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <h2 data-reveal className="bebas text-[16vw] lg:text-[9vw] leading-[0.85] tracking-tight">SERVICES</h2>
            <div data-reveal className="mono text-[12px] max-w-[36ch] leading-[1.6] opacity-70">Pick what you need. I don't sell packages — I solve retention problems.</div>
          </div>
          <div data-reveal className="grid md:grid-cols-2 gap-[1px] bg-[#E9EEFC]/10 border border-[#E9EEFC]/10 rounded-[24px] overflow-hidden">
            {SERVICES.map(s => (
              <div key={s.n} data-stagger className="bg-[#0A1128] p-8 md:p-10 group hover:bg-[#04060C] transition duration-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(40%_50%_at_70%_20%,rgba(157,177,255,0.08),transparent_60%)]" />
                <div className="relative flex items-start justify-between">
                  <span className="mono text-[12px] tracking-widest opacity-40 group-hover:opacity-70 group-hover:text-[#9DB1FF] transition">{s.n}</span>
                  <span className="w-8 h-8 rounded-full border border-[#E9EEFC]/15 group-hover:border-[#9DB1FF] flex items-center justify-center group-hover:rotate-45 transition duration-500">
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="relative mt-8 bebas text-4xl md:text-5xl leading-[0.9]">{s.title}</h3>
                <p className="relative mt-4 text-[15px] leading-[1.6] opacity-70 max-w-[36ch]">{s.desc}</p>
                <div className="relative mt-8 flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="mono text-[10px] tracking-widest px-3 py-1 rounded-full border border-[#E9EEFC]/15 group-hover:border-[#9DB1FF]/40 transition-colors">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="bg-[#060B1C] text-[#E9EEFC] pb-20 md:pb-28 relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_30%_at_80%_0%,rgba(30,44,134,0.16),transparent_60%)]" />
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative">
          <div className="flex flex-wrap items-center justify-between gap-6 py-10 border-y border-[#E9EEFC]/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#9DB1FF] animate-pulse shadow-[0_0_8px_rgba(157,177,255,0.7)]" />
              <span className="mono text-[12px] tracking-[0.2em]">SELECTED WORK — 03 EDITS • STREAMED FROM YOUTUBE</span>
            </div>
            <div className="flex items-center gap-3">
              <CurrentlyEditing />
              <span className="hidden sm:flex mono text-[11px] tracking-widest px-4 py-2 rounded-full border border-[#E9EEFC]/15 items-center gap-2">
                <Play size={10} fill="currentColor" aria-hidden="true" />
                CLICK ANY CARD TO PLAY
              </span>
            </div>
          </div>

          <div data-reveal className="grid md:grid-cols-2 gap-[1px] bg-[#E9EEFC]/10 border-x border-b border-[#E9EEFC]/10 rounded-b-[24px] overflow-hidden">
            {WORKS.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} onOpen={setActiveWork} />
            ))}
          </div>

          <div className="mt-8 mono text-[11px] text-center opacity-50 tracking-wide flex items-center justify-center gap-2">
            <Zap size={12} className="text-[#9DB1FF]" aria-hidden="true" /> Videos stream from Wolf Siuu's YouTube channel — hover for preview, click for cinematic player.
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-[1600px] px-6 md:px-10 py-20 md:py-28 border-t border-[#E9EEFC]/10">
        <div className="grid lg:grid-cols-[0.6fr_1.4fr] gap-12">
          <div className="sticky top-24 h-fit">
            <div className="mono text-[11px] tracking-[0.3em] text-[#E9EEFC]/40 mb-6">PROCESS — [03]</div>
            <h2 data-reveal className="bebas text-[12vw] lg:text-[6vw] leading-[0.85]">HOW<br />I WORK</h2>
            <div data-reveal className="mt-6 mono text-[12px] leading-[1.6] text-[#E9EEFC]/50 max-w-[32ch]">No endless back-and-forth. Clear steps, fast delivery, zero BS. You send, I cut, we ship.</div>
            <div data-reveal className="mt-10 hidden lg:block">
              <div className="rounded-2xl border border-[#E9EEFC]/10 bg-[#0A1128] p-5">
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mb-3 flex items-center gap-2">
                  <Sparkles size={12} className="text-[#9DB1FF]" /> TIMELINE PREVIEW
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-[#1E2C86]/40 w-[88%]" />
                  <div className="h-2 rounded-full bg-[#9DB1FF]/30 w-[64%]" />
                  <div className="h-2 rounded-full bg-[#E9EEFC]/10 w-[92%]" />
                </div>
              </div>
            </div>
          </div>
          <div data-reveal className="space-y-[1px] bg-[#E9EEFC]/10 rounded-[24px] overflow-hidden border border-[#E9EEFC]/10">
            {[
              { n: "01", t: "Brief & Raw Footage", d: "You send files + 5-min loom about vibe, refs, must-haves. I ask sharp questions, not 20 forms.", time: "2H" },
              { n: "02", t: "Rough Cut & Story", d: "I build story first — structure, pacing, hooks. No color, no effects yet. Just pure retention.", time: "24H" },
              { n: "03", t: "Polish & Sauce", d: "Color, SFX, captions, motion, sound design. This is where it goes from good to viral.", time: "24H" },
              { n: "04", t: "Delivery & Files", d: "Master + platform crops (16:9, 9:16, 1:1) + project file if needed. Done.", time: "FINAL" },
            ].map(step => (
              <div key={step.n} data-stagger className="bg-[#0A1128] p-8 md:p-10 flex gap-8 group hover:bg-[#0E1745] transition-colors duration-500">
                <div className="bebas text-5xl text-[#E9EEFC]/20 group-hover:text-[#9DB1FF] transition-colors">{step.n}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-xl md:text-2xl font-bold tracking-tight group-hover:tracking-wide transition-all duration-500">{step.t}</h4>
                    <span className="mono text-[10px] px-2.5 py-1 rounded-full border border-[#E9EEFC]/10 flex items-center gap-1.5 group-hover:border-[#9DB1FF]/30 transition-colors">
                      <Clock size={10} aria-hidden="true" /> {step.time}
                    </span>
                  </div>
                  <p className="mt-3 mono text-[13px] leading-[1.6] text-[#E9EEFC]/60 max-w-[48ch]">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a review */}
      <section id="reviews" className="bg-[#060B1C] border-t border-[#E9EEFC]/10 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(40%_50%_at_20%_20%,rgba(30,44,134,0.12),transparent_60%)]" />
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start relative">
          <div data-reveal>
            <div className="mono text-[11px] tracking-[0.3em] text-[#9DB1FF] mb-6">CLIENT FEEDBACK - [04]</div>
            <h2 className="bebas text-[14vw] lg:text-[7vw] leading-[0.85]">LEAVE A<br />REVIEW.</h2>
            <p className="mt-7 max-w-[34ch] text-[16px] leading-[1.6] text-[#E9EEFC]/65">
              Worked with Wolf Siuu? Your honest feedback helps future clients understand what it is like to create together.
            </p>
            <div className="mt-8 flex items-center gap-3 mono text-[11px] tracking-wide text-[#E9EEFC]/45">
              <MessageSquare size={16} className="text-[#9DB1FF]" aria-hidden="true" />
              REVIEWS ARE SENT DIRECTLY TO WOLF FOR APPROVAL.
            </div>
          </div>

          <form onSubmit={submitReview} data-reveal className="rounded-[24px] border border-[#E9EEFC]/10 bg-[#0A1128] p-6 sm:p-8 md:p-10 hover:border-[#9DB1FF]/15 transition-colors">
            {reviewSent ? (
              <div className="min-h-[310px] flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1E2C86] flex items-center justify-center mb-6 animate-pulse">
                  <MessageSquare size={20} aria-hidden="true" />
                </div>
                <h3 className="bebas text-5xl leading-none">THANK YOU.</h3>
                <p className="mt-4 max-w-[38ch] text-[15px] leading-[1.6] text-[#E9EEFC]/65">
                  Your review has been prepared in your email app and will be sent directly to Wolf Siuu for approval.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReviewSent(false);
                    setReviewName("");
                    setReviewRole("");
                    setReviewText("");
                    setReviewRating(5);
                  }}
                  className="mt-7 mono text-[11px] tracking-widest self-start px-5 py-3 rounded-full border border-[#E9EEFC]/20 hover:border-[#9DB1FF] hover:text-[#9DB1FF] transition cursor-pointer"
                >
                  WRITE ANOTHER REVIEW
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-between gap-5 pb-7 border-b border-[#E9EEFC]/10">
                  <div>
                    <div className="mono text-[10px] tracking-[0.22em] text-[#E9EEFC]/40">YOUR EXPERIENCE</div>
                    <h3 className="mt-2 text-xl font-bold tracking-tight">How was it working together?</h3>
                  </div>
                  <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewRating(value)}
                        aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        aria-pressed={reviewRating === value}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star size={22} className={value <= reviewRating ? "fill-[#9DB1FF] text-[#9DB1FF]" : "text-[#E9EEFC]/20 hover:text-[#E9EEFC]/40"} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 grid sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="mono text-[10px] tracking-widest text-[#E9EEFC]/45">YOUR NAME *</span>
                    <input
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className="mt-2 w-full bg-[#04060C] border border-[#E9EEFC]/10 focus:border-[#9DB1FF] outline-none rounded-xl px-4 py-3.5 text-sm placeholder:text-[#E9EEFC]/25 transition"
                    />
                  </label>
                  <label className="block">
                    <span className="mono text-[10px] tracking-widest text-[#E9EEFC]/45">ROLE / COMPANY</span>
                    <input
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      placeholder="e.g. Content creator"
                      className="mt-2 w-full bg-[#04060C] border border-[#E9EEFC]/10 focus:border-[#9DB1FF] outline-none rounded-xl px-4 py-3.5 text-sm placeholder:text-[#E9EEFC]/25 transition"
                    />
                  </label>
                </div>

                <label className="block mt-5">
                  <span className="mono text-[10px] tracking-widest text-[#E9EEFC]/45">YOUR REVIEW *</span>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell others about your experience..."
                    className="mt-2 w-full resize-y bg-[#04060C] border border-[#E9EEFC]/10 focus:border-[#9DB1FF] outline-none rounded-xl px-4 py-3.5 text-sm leading-[1.6] placeholder:text-[#E9EEFC]/25 transition"
                  />
                </label>

                <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="mono text-[10px] leading-[1.6] tracking-wide text-[#E9EEFC]/35 max-w-[38ch]">
                    Submitting opens your email app with the review addressed to Wolf Siuu.
                  </p>
                  <Magnetic strength={0.2} radius={220}>
                    <button type="submit" data-glow-strong className="group mono text-[11px] tracking-widest px-6 py-3.5 rounded-full bg-[#E9EEFC] text-[#0A1128] hover:bg-[#9DB1FF] transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shine">
                      SEND REVIEW <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                    </button>
                  </Magnetic>
                </div>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative overflow-hidden bg-[#0E1745] text-[#E9EEFC] rounded-t-[32px] md:rounded-t-[56px]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_50%_at_20%_0%,#1E2C8655,transparent),radial-gradient(50%_40%_at_90%_100%,#1E2C8644,transparent)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-24">
          <div data-reveal className="flex flex-col lg:flex-row justify-between gap-12">
            <div className="flex-1">
              <div className="mono text-[11px] tracking-[0.3em] opacity-60 mb-6">CONTACT — LET'S WORK</div>
              <h2 className="bebas text-[18vw] lg:text-[10vw] leading-[0.82] tracking-[-0.02em]">LET'S MAKE<br />SOMETHING<br />VIRAL.</h2>
              <div className="mt-10 flex flex-wrap gap-3">
                <Magnetic strength={0.22} radius={260}>
                  <a href="mailto:adam.elfidh7@gmail.com" data-glow-strong className="bebas text-xl tracking-wide px-8 py-4 rounded-full bg-[#E9EEFC] text-[#0A1128] hover:bg-white transition flex items-center gap-3 group shine">
                    <Mail size={16} className="group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" /> EMAIL ME <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.16} radius={200}>
                  <button onClick={copyEmail} data-glow-strong className="mono text-[11px] tracking-widest px-6 py-4 rounded-full border border-[#E9EEFC]/25 hover:bg-[#E9EEFC] hover:text-[#0A1128] transition flex items-center gap-2 cursor-pointer group">
                    <Copy size={13} className="group-hover:scale-110 transition-transform" aria-hidden="true" /> COPY EMAIL
                  </button>
                </Magnetic>
              </div>
            </div>

            <div className="lg:w-[420px] space-y-6">
              <div className="rounded-[20px] bg-[#04060C] text-[#E9EEFC] p-8 border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/20 transition-colors">
                <div className="mono text-[11px] tracking-widest opacity-50 mb-6">CONTACT INFO</div>
                <div className="space-y-5">
                  <div>
                    <div className="mono text-[10px] tracking-widest opacity-40 flex items-center gap-1.5"><Mail size={11} aria-hidden="true" /> EMAIL</div>
                    <div className="text-[16px] font-medium mt-1 break-all">adam.elfidh7@gmail.com</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="mono text-[10px] tracking-widest opacity-40 flex items-center gap-1.5"><Aperture size={11} aria-hidden="true" /> INSTAGRAM</div>
                      <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium mt-1 inline-block hover:text-[#9DB1FF] transition"> @wolf.siuu7</a>
                    </div>
                    <div>
                      <div className="mono text-[10px] tracking-widest opacity-40 flex items-center gap-1.5"><AtSign size={11} aria-hidden="true" /> X / TWITTER</div>
                      <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium mt-1 inline-block hover:text-[#9DB1FF] transition"> @wolfsiuu7</a>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E9EEFC]/10 mono text-[11px] leading-[1.6] opacity-60">
                    Response time: under 3 hours (9AM-11PM GMT+1). Prefer IG DM for quick chat.
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#E9EEFC]/15 p-6 mono text-[12px] leading-[1.6] bg-[#E9EEFC]/[0.02] hover:bg-[#E9EEFC]/[0.04] transition-colors">
                <div className="font-bold tracking-widest text-[11px] mb-3 text-[#9DB1FF] flex items-center gap-2">
                  <Zap size={12} aria-hidden="true" /> FOR NEW CLIENTS:
                </div>
                Send me: 1) Raw link (Drive/Dropbox) 2) 1-2 ref videos 3) Deadline. I'll reply with price + timeline in 60 mins.
              </div>

              <div className="flex gap-2">
                <Magnetic strength={0.14} radius={180} className="flex-1">
                  <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" data-glow-strong className="w-full mono text-[11px] tracking-widest py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center justify-center gap-2 group">
                    <Aperture size={13} className="group-hover:rotate-12 transition-transform" aria-hidden="true" /> IG
                  </a>
                </Magnetic>
                <Magnetic strength={0.14} radius={180} className="flex-1">
                  <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" data-glow-strong className="w-full mono text-[11px] tracking-widest py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center justify-center gap-2 group">
                    <AtSign size={13} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" /> X
                  </a>
                </Magnetic>
                <Magnetic strength={0.14} radius={180} className="flex-1">
                  <a href="mailto:adam.elfidh7@gmail.com" data-glow-strong className="w-full mono text-[11px] tracking-widest py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center justify-center gap-2 group">
                    <Mail size={13} className="group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" /> EMAIL
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-[#E9EEFC]/15 flex flex-wrap items-center justify-between gap-4 mono text-[10px] tracking-widest opacity-60">
            <span>©2026 WOLF SIUU — VIDEO EDITOR. ALL RIGHTS RESERVED. BUILT FOR SPEED.</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#9DB1FF] animate-pulse" /> MADE IN MOROCCO, WATCHED WORLDWIDE</span>
          </div>
        </div>
      </section>

      {/* Video Modal - cinematic */}
      {activeWork && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#04060C]/92 backdrop-blur-[18px]" onClick={() => setActiveWork(null)} />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(70%_60%_at_50%_40%,rgba(30,44,134,0.28),transparent_70%)]" />
          <div className="relative w-full max-w-5xl bg-[#0A1128] rounded-[22px] overflow-hidden border border-[#9DB1FF]/20 shadow-[0_0_80px_rgba(30,44,134,0.35),0_0_0_1px_rgba(157,177,255,0.12)] animate-[modalIn_0.55s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E9EEFC]/10 mono text-[11px] tracking-widest bg-[#060B1C]/80 backdrop-blur">
              <span className="truncate pr-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {activeWork.title} • {activeWork.tag} • REC
              </span>
              <button onClick={() => setActiveWork(null)} aria-label="Close player" className="w-8 h-8 rounded-full bg-[#E9EEFC] text-[#0A1128] flex items-center justify-center hover:bg-[#9DB1FF] hover:rotate-90 transition-all duration-300 cursor-pointer">
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-video bg-[#04060C] relative">
              <iframe
                key={activeWork.id}
                src={`https://www.youtube.com/embed/${activeWork.ytId}?rel=0&autoplay=1`}
                title={`${activeWork.title} — video player`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="p-6 grid md:grid-cols-[1fr_auto] gap-6 items-center bg-[#060B1C]">
              <div className="mono text-[12px] leading-[1.6] text-[#E9EEFC]/60">
                <span className="text-[#E9EEFC] font-medium">{activeWork.title}</span> — {activeWork.desc}
                <br />
                <span className="text-[10px] opacity-60">{activeWork.meta} • {activeWork.tools.join(" • ")}</span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${activeWork.ytId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[11px] tracking-widest px-5 py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center gap-2 justify-center group shine"
              >
                WATCH ON YOUTUBE <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} @keyframes modalIn{0%{opacity:0;transform:scale(0.96) translateY(18px)}100%{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}
