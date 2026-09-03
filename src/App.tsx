import { useState, useEffect, useRef, type SyntheticEvent, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
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
} from 'lucide-react';

// The exact, unedited profile picture — hosted by Wolf Siuu on Imgur (album tCUomZe).
// Mirrors are tried in order at runtime so the profile spot is never empty.
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
};

// Wolf Siuu's real edits — streamed from his YouTube channel (@Wolfsiuu7).
const WORKS: Work[] = [
  {
    id: 1,
    title: "iPhone 17 Pro Motion Graphics",
    tag: "MOTION GRAPHICS",
    ytId: "l3wlOTp81I8",
    thumb: "https://i.ytimg.com/vi/l3wlOTp81I8/maxresdefault.jpg",
    meta: "YOUTUBE • WOLF SIUU | VIDEO EDITOR • @Wolfsiuu7",
  },
  {
    id: 2,
    title: "What Is The Truth After Effects Motion Graphics",
    tag: "MOTION GRAPHICS",
    ytId: "VuRGrPCTBgk",
    thumb: "https://i.ytimg.com/vi/VuRGrPCTBgk/maxresdefault.jpg",
    meta: "YOUTUBE • WOLF SIUU | VIDEO EDITOR • @Wolfsiuu7",
  },
  {
    id: 3,
    title: "Spotify Top Artists Motion Graphics",
    tag: "MOTION GRAPHICS",
    ytId: "8F7ePXPvbwQ",
    thumb: "https://i.ytimg.com/vi/8F7ePXPvbwQ/maxresdefault.jpg",
    meta: "YOUTUBE • WOLF SIUU | VIDEO EDITOR • @Wolfsiuu7",
  },
];

const SERVICES = [
  { n: "01", title: "Cinematic Long-Form", desc: "YouTube videos, documentaries & podcasts that keep viewers watching. Story-first structure, J-cuts, sound design.", tags: ["Retention Editing", "Storytelling"] },
  { n: "02", title: "Viral Short-Form", desc: "Reels, TikToks, Shorts engineered for hook-rate. Punchy cuts, auto-captions, SFX that hits.", tags: ["0-3s Hooks", "Captions & SFX"] },
  { n: "03", title: "Commercial & Promo", desc: "Ads that don't feel like ads. Clean motion graphics, brand-aligned pacing, conversion-focused.", tags: ["Motion Graphics", "Color Grade"] },
  { n: "04", title: "Color & Sound Polish", desc: "DaVinci-grade color, audio cleanup, mix & master. Makes amateur footage look $10k.", tags: ["DaVinci Resolve", "Audio Mix"] },
];

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeWork, setActiveWork] = useState<(typeof WORKS)[0] | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);

  // Cascade through mirrors until one loads: Imgur -> Imgur (hi-res) -> X CDN -> proxy -> bundled.
  const handleAvatarError = (e: SyntheticEvent<HTMLImageElement>) => {
    const t = e.currentTarget;
    const idx = AVATAR_SOURCES.findIndex(s => t.src.startsWith(s));
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

  // Pointer parallax for the hero showcase.
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onHeroMove = (e: ReactMouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };


  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("adam.elfidh7@gmail.com");
    flash("EMAIL COPIED — adam.elfidh7@gmail.com");
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const subject = encodeURIComponent(`Portfolio Review from ${reviewName.trim()}`);
    const body = encodeURIComponent(
      `Name: ${reviewName.trim()}\n` +
      `Role / company: ${reviewRole.trim() || "Not provided"}\n` +
      `Rating: ${reviewRating}/5\n\n` +
      `Review:\n${reviewText.trim()}`
    );

    setReviewSent(true);
    flash("THANK YOU — OPENING YOUR MAIL APP TO SEND THE REVIEW");
    window.setTimeout(() => {
      window.location.href = `mailto:adam.elfidh7@gmail.com?subject=${subject}&body=${body}`;
    }, 450);
  };

  return (
    <div id="top" className="min-h-screen bg-[#04060C] text-[#E9EEFC] selection:bg-[#1E2C86] selection:text-[#E9EEFC] antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        *{font-family: 'Syne', sans-serif;}
        .mono{font-family: 'JetBrains Mono', monospace;}
        .bebas{font-family: 'Bebas Neue', sans-serif;}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#1E2C86;border-radius:10px}
        ::-webkit-scrollbar-track{background:#04060C}
        .grain:after{
          content:"";position:absolute;inset:0;pointer-events:none;opacity:0.05;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
        [data-reveal].is-visible{opacity:1;transform:none}
        @media (prefers-reduced-motion: reduce){
          [data-reveal]{opacity:1;transform:none;transition:none}
          .hero-up{opacity:1;animation:none}
          .float-y{animation:none}
        }
        @keyframes heroUp{from{opacity:0;transform:translateY(42px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes spinSlow{to{transform:rotate(360deg)}}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        .hero-up{opacity:0;animation:heroUp .95s cubic-bezier(.16,1,.3,1) forwards}
        .float-y{animation:floatY 6s ease-in-out infinite}
      `}</style>

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] mono text-xs tracking-widest px-4 py-2 bg-[#E9EEFC] text-[#0A1128] rounded-full transition-all duration-500 max-w-[92vw] text-center ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {toastMsg}
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#E9EEFC]/[0.08] bg-[#04060C]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <a href="#top" aria-label="Wolf Siuu - back to top" className="relative shrink-0 rounded-full">
                <img
                  src={DEFAULT_AVATAR}
                  alt="Wolf Siuu profile picture"
                  onError={handleAvatarError}
                  className="w-10 h-10 object-cover ring-1 ring-[#E9EEFC]/25"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#9DB1FF] border-2 border-[#04060C]" title="Online" />
              </a>
              <a href="#top" className="mono text-[11px] tracking-[0.2em] hover:text-[#9DB1FF] transition">WOLF SIUU ©2026</a>
            </div>
            <div className="hidden md:flex items-center gap-6 mono text-[11px] tracking-widest text-[#E9EEFC]/60">
              <a href="#work" className="hover:text-[#E9EEFC] transition">WORK</a>
              <a href="#services" className="hover:text-[#E9EEFC] transition">SERVICES</a>
              <a href="#about" className="hover:text-[#E9EEFC] transition">ABOUT</a>
              <a href="#process" className="hover:text-[#E9EEFC] transition">PROCESS</a>
              <a href="#reviews" className="hover:text-[#E9EEFC] transition">LEAVE REVIEW</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mono text-[10px] text-[#E9EEFC]/40 mr-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE FOR NEW PROJECTS
            </div>
            <a href="#contact" className="mono text-[11px] tracking-widest px-5 py-2.5 rounded-full bg-[#E9EEFC] text-[#0A1128] hover:bg-[#1E2C86] hover:text-[#E9EEFC] transition font-medium flex items-center gap-2">
              HIRE ME <ArrowRight size={12} aria-hidden="true" />
            </a>
            <button onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu" className="md:hidden w-9 h-9 rounded-full border border-[#E9EEFC]/15 flex flex-col items-center justify-center gap-[5px]">
              <span className="block w-4 h-px bg-[#E9EEFC]" />
              <span className="block w-4 h-px bg-[#E9EEFC]" />
              <span className="block w-4 h-px bg-[#E9EEFC]" />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-[#E9EEFC]/10 bg-[#0A1128] px-6 py-6 flex flex-col gap-4 mono text-sm">
            <a onClick={() => setMobileMenu(false)} href="#work">WORK</a>
            <a onClick={() => setMobileMenu(false)} href="#services">SERVICES</a>
            <a onClick={() => setMobileMenu(false)} href="#about">ABOUT</a>
             <a onClick={() => setMobileMenu(false)} href="#reviews">LEAVE REVIEW</a>
            <a onClick={() => setMobileMenu(false)} href="#contact">CONTACT</a>
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
        {/* Ambient layered background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#E9EEFC07_1px,transparent_1px),linear-gradient(to_bottom,#E9EEFC07_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div
            className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full blur-[130px] bg-[#1E2C86]/25"
            style={{ transform: `translate3d(${tilt.x * -26}px, ${tilt.y * -20}px, 0)`, transition: "transform .45s ease-out" }}
          />
          <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-[140px] bg-[#16226B]/30" />
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 md:px-10 flex-1 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-8 items-center py-14 md:py-16">
          {/* Left — intro */}
          <div className="order-2 lg:order-1">
            <div className="hero-up mono text-[11px] tracking-[0.35em] text-[#9DB1FF] flex items-center gap-3 mb-6" style={{ animationDelay: "0.05s" }}>
              <span className="w-10 h-px bg-[#9DB1FF]/50" />
              HELLO, I AM
              <span className="w-[7px] h-[14px] bg-[#9DB1FF] animate-[blink_1.1s_linear_infinite]" />
            </div>

            <h1 className="bebas leading-[0.82] tracking-[-0.015em]">
              <span className="hero-up block text-[19vw] lg:text-[10.5vw]" style={{ animationDelay: "0.12s" }}>WOLF</span>
              <span className="hero-up block text-[19vw] lg:text-[10.5vw] text-transparent" style={{ WebkitTextStroke: "1.5px #E9EEFC", animationDelay: "0.2s" }}>SIUU</span>
            </h1>

            <div className="hero-up mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.3s" }}>
              <span className="mono text-[11px] md:text-[13px] tracking-[0.18em] px-4 py-2 rounded-full bg-[#1E2C86] text-[#E9EEFC]">VIDEO EDITOR</span>
              <span className="mono text-[11px] md:text-[13px] tracking-[0.18em] px-4 py-2 rounded-full border border-[#E9EEFC]/20 text-[#E9EEFC]/80">MOTION GRAPHICS</span>
              <span className="mono text-[11px] md:text-[13px] tracking-[0.18em] px-4 py-2 rounded-full border border-[#E9EEFC]/20 text-[#E9EEFC]/80">COLORIST</span>
            </div>

            <p className="hero-up mt-7 text-[16px] md:text-[18px] leading-[1.55] text-[#E9EEFC]/70 max-w-[46ch] font-light" style={{ animationDelay: "0.38s" }}>
              I turn raw, boring footage into <span className="text-[#E9EEFC] font-semibold">scroll-stopping, binge-worthy</span> stories.
              No templates. No fluff. Just ruthless cuts, cinematic sound, and edits that make people stay.
            </p>

            <div className="hero-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.46s" }}>
              <a href="#work" className="group mono text-[12px] tracking-widest px-7 py-4 rounded-full bg-[#1E2C86] text-[#E9EEFC] hover:bg-[#2A3CA8] transition flex items-center gap-2">
                VIEW MY WORK <ArrowRight size={14} className="group-hover:translate-x-1 transition" aria-hidden="true" />
              </a>
              <button onClick={() => setActiveWork(WORKS[0])} className="mono text-[12px] tracking-widest px-7 py-4 rounded-full border border-[#E9EEFC]/20 hover:border-[#9DB1FF] hover:text-[#9DB1FF] transition flex items-center gap-2 cursor-pointer">
                <Play size={13} fill="currentColor" aria-hidden="true" /> PLAY SHOWREEL
              </button>
            </div>

            <div className="hero-up mt-8 flex flex-wrap gap-2.5" style={{ animationDelay: "0.54s" }}>
              <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/60 hover:text-[#9DB1FF] transition flex items-center gap-2">
                <Aperture size={12} aria-hidden="true" /> INSTAGRAM
              </a>
              <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/60 hover:text-[#9DB1FF] transition flex items-center gap-2">
                <AtSign size={12} aria-hidden="true" /> X / TWITTER
              </a>
              <a href="https://www.youtube.com/@Wolfsiuu7" target="_blank" rel="noopener noreferrer" className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/60 hover:text-[#9DB1FF] transition flex items-center gap-2">
                <Play size={12} fill="currentColor" aria-hidden="true" /> YOUTUBE
              </a>
              <a href="mailto:adam.elfidh7@gmail.com" className="mono text-[10px] tracking-widest px-4 py-2.5 rounded-full bg-[#0A1128] border border-[#E9EEFC]/10 hover:border-[#9DB1FF]/60 hover:text-[#9DB1FF] transition flex items-center gap-2">
                <Mail size={12} aria-hidden="true" /> EMAIL
              </a>
            </div>

            <div className="hero-up mt-12 grid grid-cols-3 gap-6 border-t border-[#E9EEFC]/10 pt-6 max-w-[520px]" style={{ animationDelay: "0.62s" }}>
              <div>
                <Clapperboard size={14} className="text-[#9DB1FF] mb-2" aria-hidden="true" />
                <div className="bebas text-4xl leading-none">200+</div>
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mt-1">VIDEOS DELIVERED</div>
              </div>
              <div>
                <Eye size={14} className="text-[#9DB1FF] mb-2" aria-hidden="true" />
                <div className="bebas text-4xl leading-none">5M+</div>
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mt-1">VIEWS GENERATED</div>
              </div>
              <div>
                <Clock size={14} className="text-[#9DB1FF] mb-2" aria-hidden="true" />
                <div className="bebas text-4xl leading-none">48H</div>
                <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/40 mt-1">AVG TURNAROUND</div>
              </div>
            </div>
          </div>

          {/* Right — profile showcase */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:pr-6">
            <div className="hero-up relative" style={{ animationDelay: "0.25s" }}>
              <div
                className="relative w-[240px] sm:w-[300px] md:w-[360px] lg:w-[380px] xl:w-[430px] aspect-square"
                style={{ transform: `translate3d(${tilt.x * 14}px, ${tilt.y * 10}px, 0)`, transition: "transform .35s ease-out" }}
              >
                {/* soft glow behind */}
                <div className="absolute inset-0 rounded-full bg-[#1E2C86]/40 blur-[70px] scale-110" />
                {/* rotating conic ring */}
                <div
                  className="absolute -inset-4 rounded-full animate-[spinSlow_12s_linear_infinite]"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0deg, #1E2C86 60deg, #9DB1FF 110deg, transparent 170deg, transparent 360deg)",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))",
                  }}
                />
                {/* dashed orbit */}
                <div className="absolute -inset-9 rounded-full border border-dashed border-[#9DB1FF]/25 animate-[spinSlow_46s_linear_infinite_reverse]" />
                {/* rotating circular text */}
                <div className="absolute -inset-9 animate-[spinSlow_30s_linear_infinite]">
                  <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                    <defs>
                      <path id="wolf-circ" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" fill="none" />
                    </defs>
                    <text fill="#9DB1FF" fontSize="9" letterSpacing="3.2" className="mono" opacity="0.85">
                      <textPath href="#wolf-circ">WOLF SIUU • VIDEO EDITOR • MOTION GRAPHICS • COLOR • SOUND • </textPath>
                    </text>
                  </svg>
                </div>
                {/* the photo */}
                <div className="relative block w-full h-full rounded-full overflow-hidden ring-1 ring-[#E9EEFC]/20">
                  <img
                    src={DEFAULT_AVATAR}
                    alt="Wolf Siuu — video editor portrait"
                    onError={handleAvatarError}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* floating chips */}
                <div className="absolute -right-3 top-8 float-y mono text-[10px] tracking-widest px-3.5 py-2 rounded-full bg-[#0A1128]/90 border border-[#9DB1FF]/30 text-[#9DB1FF] flex items-center gap-2 backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AVAILABLE FOR WORK
                </div>
                <a
                  href="https://www.youtube.com/@Wolfsiuu7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -left-5 bottom-12 float-y [animation-delay:1.4s] mono text-[10px] tracking-widest px-3.5 py-2 rounded-full bg-[#1E2C86] text-[#E9EEFC] flex items-center gap-2 hover:bg-[#2A3CA8] transition"
                >
                  <Play size={10} fill="currentColor" aria-hidden="true" /> @WOLFSIUU7
                </a>
                <div className="absolute -left-2 -top-3 float-y [animation-delay:0.7s] mono text-[10px] tracking-widest px-3.5 py-2 rounded-full bg-[#0A1128]/90 border border-[#E9EEFC]/15 text-[#E9EEFC]/80 flex items-center gap-2 backdrop-blur">
                  <Clock size={10} aria-hidden="true" /> GMT+1 • MOROCCO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 pb-6 flex flex-col items-center gap-1.5 mono text-[10px] tracking-[0.3em] text-[#E9EEFC]/40">
          SCROLL
          <ChevronDown size={14} className="animate-bounce text-[#9DB1FF]" aria-hidden="true" />
        </div>

        {/* Marquee */}
        <div className="relative border-y border-[#E9EEFC]/10 bg-[#1E2C86] text-[#E9EEFC] overflow-hidden py-3">
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap mono text-[13px] tracking-[0.2em] font-medium">
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
              <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" className="underline text-[#E9EEFC] hover:text-[#9DB1FF]">IG: @wolf.siuu7</a> • <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" className="underline text-[#E9EEFC] hover:text-[#9DB1FF]">X: @wolfsiuu7</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <p className="text-[22px] md:text-[28px] leading-[1.25] tracking-tight">
            Most editors just cut clips. I build <span className="bg-[#1E2C86] text-[#E9EEFC] px-2">retention machines</span>. Every frame has a job — hook, hold, or convert. If it doesn't, it's gone.
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-[#E9EEFC]/10">
            <div>
              <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/30 mb-3">WHAT MAKES ME DIFFERENT</div>
              <ul className="space-y-3 mono text-[13px] leading-[1.6] text-[#E9EEFC]/70">
                <li className="flex gap-2"><ChevronRight size={14} className="text-[#9DB1FF] shrink-0 mt-0.5" aria-hidden="true" /> Story &gt; Effects. I fix pacing before adding flair.</li>
                <li className="flex gap-2"><ChevronRight size={14} className="text-[#9DB1FF] shrink-0 mt-0.5" aria-hidden="true" /> I edit for the algorithm &amp; the human.</li>
                <li className="flex gap-2"><ChevronRight size={14} className="text-[#9DB1FF] shrink-0 mt-0.5" aria-hidden="true" /> Unlimited revisions? No. Right the first time? Yes.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-[#0A1128] border border-[#E9EEFC]/10 p-6">
              <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/30 mb-4">TOOLS I BREATHE</div>
              <div className="flex flex-wrap gap-2">
                {["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut", "Motion Graphics", "Sound Design", "Auto Captions", "Color Science"].map(t => (
                  <span key={t} className="mono text-[11px] px-3 py-1.5 rounded-full border border-[#E9EEFC]/10 bg-[#E9EEFC]/[0.03]">{t}</span>
                ))}
              </div>
              <div className="mt-6 mono text-[11px] text-[#E9EEFC]/40">Available in GMT+1 • Fast comms on IG & Email</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-[#0A1128] text-[#E9EEFC] rounded-t-[32px] md:rounded-t-[48px] py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <h2 className="bebas text-[16vw] lg:text-[9vw] leading-[0.85] tracking-tight">SERVICES</h2>
            <div className="mono text-[12px] max-w-[36ch] leading-[1.6] opacity-70">Pick what you need. I don't sell packages — I solve retention problems.</div>
          </div>
          <div data-reveal className="grid md:grid-cols-2 gap-[1px] bg-[#E9EEFC]/10 border border-[#E9EEFC]/10 rounded-[24px] overflow-hidden">
            {SERVICES.map(s => (
              <div key={s.n} className="bg-[#0A1128] p-8 md:p-10 group hover:bg-[#04060C] transition duration-500">
                <div className="flex items-start justify-between">
                  <span className="mono text-[12px] tracking-widest opacity-40 group-hover:opacity-70 group-hover:text-[#9DB1FF] transition">{s.n}</span>
                  <span className="w-8 h-8 rounded-full border border-[#E9EEFC]/15 group-hover:border-[#9DB1FF] flex items-center justify-center group-hover:rotate-45 transition">
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 bebas text-4xl md:text-5xl leading-[0.9]">{s.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.6] opacity-70 max-w-[36ch]">{s.desc}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="mono text-[10px] tracking-widest px-3 py-1 rounded-full border border-[#E9EEFC]/15 group-hover:border-[#9DB1FF]/40 transition">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="bg-[#060B1C] text-[#E9EEFC] pb-20 md:pb-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-6 py-10 border-y border-[#E9EEFC]/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#9DB1FF] animate-pulse" />
              <span className="mono text-[12px] tracking-[0.2em]">SELECTED WORK — 03 EDITS • STREAMED FROM YOUTUBE</span>
            </div>
            <span className="mono text-[11px] tracking-widest px-4 py-2 rounded-full border border-[#E9EEFC]/15 flex items-center gap-2">
              <Play size={10} fill="currentColor" aria-hidden="true" />
              CLICK ANY CARD TO PLAY
            </span>
          </div>

          <div data-reveal className="grid md:grid-cols-2 gap-[1px] bg-[#E9EEFC]/10 border-x border-b border-[#E9EEFC]/10 rounded-b-[24px] overflow-hidden">
            {WORKS.map((work, i) => (
              <button
                key={work.id}
                type="button"
                onClick={() => setActiveWork(work)}
                className={`group relative bg-[#0A1128] p-3 text-left cursor-pointer ${i === 0 ? "md:col-span-2" : ""}`}
              >
                <div className={`relative overflow-hidden rounded-[16px] bg-[#04060C] ${i === 0 ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#16226B] via-[#0A1128] to-[#04060C] flex items-center justify-center">
                    <span className="bebas text-[#9DB1FF]/30 text-5xl tracking-wide px-6 text-center">{work.title}</span>
                  </div>
                  <img
                    src={work.thumb}
                    alt={`${work.title} — video thumbnail`}
                    loading="lazy"
                    onError={e => {
                      const t = e.currentTarget;
                      if (t.src.includes("maxresdefault")) t.src = t.src.replace("maxresdefault", "hqdefault");
                      else t.style.display = "none";
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060C]/90 via-[#04060C]/10 to-[#04060C]/40" />
                  <div className="absolute top-3 left-3 mono text-[10px] px-2.5 py-1 rounded-full bg-[#04060C]/70 text-[#E9EEFC] backdrop-blur">
                    {String(i + 1).padStart(2, "0")} / 03
                  </div>
                  <div className="absolute top-3 right-3 mono text-[10px] px-2.5 py-1 rounded-full bg-[#E9EEFC] text-[#0A1128] flex items-center gap-1.5">
                    <Play size={12} fill="currentColor" aria-hidden="true" />
                    YOUTUBE • HD
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1E2C86] text-[#E9EEFC] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2A3CA8] transition shrink-0">
                      <Play size={16} fill="currentColor" aria-hidden="true" />
                    </div>
                    <div className="mono text-[10px] px-3 py-1 rounded-full bg-[#04060C]/70 text-[#E9EEFC] backdrop-blur truncate">STREAM VIA YOUTUBE</div>
                  </div>
                </div>
                <div className="pt-4 pb-2 px-2 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="bebas text-3xl leading-none tracking-wide">{work.title}</h4>
                    <div className="mono text-[10px] tracking-widest text-[#E9EEFC]/50 mt-2">{work.meta}</div>
                  </div>
                  <span className="mono text-[10px] px-2 py-1 rounded-full border border-[#E9EEFC]/15 shrink-0">{work.tag}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 mono text-[11px] text-center opacity-60 tracking-wide">
            Videos stream from Wolf Siuu's YouTube channel — click a card to play in-page, or watch it on YouTube.
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-[1600px] px-6 md:px-10 py-20 md:py-28 border-t border-[#E9EEFC]/10">
        <div className="grid lg:grid-cols-[0.6fr_1.4fr] gap-12">
          <div className="sticky top-24 h-fit">
            <div className="mono text-[11px] tracking-[0.3em] text-[#E9EEFC]/40 mb-6">PROCESS — [03]</div>
            <h2 className="bebas text-[12vw] lg:text-[6vw] leading-[0.85]">HOW<br />I WORK</h2>
            <div className="mt-6 mono text-[12px] leading-[1.6] text-[#E9EEFC]/50 max-w-[32ch]">No endless back-and-forth. Clear steps, fast delivery, zero BS. You send, I cut, we ship.</div>
          </div>
          <div data-reveal className="space-y-[1px] bg-[#E9EEFC]/10 rounded-[24px] overflow-hidden border border-[#E9EEFC]/10">
            {[
              { n: "01", t: "Brief & Raw Footage", d: "You send files + 5-min loom about vibe, refs, must-haves. I ask sharp questions, not 20 forms.", time: "2H" },
              { n: "02", t: "Rough Cut & Story", d: "I build story first — structure, pacing, hooks. No color, no effects yet. Just pure retention.", time: "24H" },
              { n: "03", t: "Polish & Sauce", d: "Color, SFX, captions, motion, sound design. This is where it goes from good to viral.", time: "24H" },
              { n: "04", t: "Delivery & Files", d: "Master + platform crops (16:9, 9:16, 1:1) + project file if needed. Done.", time: "FINAL" },
            ].map(step => (
              <div key={step.n} className="bg-[#0A1128] p-8 md:p-10 flex gap-8 group hover:bg-[#0E1745] transition">
                <div className="bebas text-5xl text-[#E9EEFC]/20 group-hover:text-[#9DB1FF] transition">{step.n}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-xl md:text-2xl font-bold tracking-tight">{step.t}</h4>
                    <span className="mono text-[10px] px-2.5 py-1 rounded-full border border-[#E9EEFC]/10 flex items-center gap-1.5">
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
      <section id="reviews" className="bg-[#060B1C] border-t border-[#E9EEFC]/10 py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
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

          <form onSubmit={submitReview} data-reveal className="rounded-[24px] border border-[#E9EEFC]/10 bg-[#0A1128] p-6 sm:p-8 md:p-10">
            {reviewSent ? (
              <div className="min-h-[310px] flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1E2C86] flex items-center justify-center mb-6">
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
                        className="p-1 cursor-pointer"
                      >
                        <Star size={22} className={value <= reviewRating ? "fill-[#9DB1FF] text-[#9DB1FF]" : "text-[#E9EEFC]/20"} aria-hidden="true" />
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
                  <button type="submit" className="group mono text-[11px] tracking-widest px-6 py-3.5 rounded-full bg-[#E9EEFC] text-[#0A1128] hover:bg-[#9DB1FF] transition flex items-center justify-center gap-2 cursor-pointer shrink-0">
                    SEND REVIEW <ArrowRight size={13} className="group-hover:translate-x-1 transition" aria-hidden="true" />
                  </button>
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
                <a href="mailto:adam.elfidh7@gmail.com" className="bebas text-xl tracking-wide px-8 py-4 rounded-full bg-[#E9EEFC] text-[#0A1128] hover:bg-white transition flex items-center gap-3">
                  <Mail size={16} aria-hidden="true" /> EMAIL ME <ArrowRight size={15} aria-hidden="true" />
                </a>
                <button onClick={copyEmail} className="mono text-[11px] tracking-widest px-6 py-4 rounded-full border border-[#E9EEFC]/25 hover:bg-[#E9EEFC] hover:text-[#0A1128] transition flex items-center gap-2 cursor-pointer">
                  <Copy size={13} aria-hidden="true" /> COPY EMAIL
                </button>
              </div>
            </div>

            <div className="lg:w-[420px] space-y-6">
              <div className="rounded-[20px] bg-[#04060C] text-[#E9EEFC] p-8 border border-[#E9EEFC]/10">
                <div className="mono text-[11px] tracking-widest opacity-50 mb-6">CONTACT INFO</div>
                <div className="space-y-5">
                  <div>
                    <div className="mono text-[10px] tracking-widest opacity-40 flex items-center gap-1.5"><Mail size={11} aria-hidden="true" /> EMAIL</div>
                    <div className="text-[16px] font-medium mt-1 break-all">adam.elfidh7@gmail.com</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="mono text-[10px] tracking-widest opacity-40 flex items-center gap-1.5"><Aperture size={11} aria-hidden="true" /> INSTAGRAM</div>
                      <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium mt-1 inline-block hover:text-[#9DB1FF]">@wolf.siuu7</a>
                    </div>
                    <div>
                      <div className="mono text-[10px] tracking-widest opacity-40 flex items-center gap-1.5"><AtSign size={11} aria-hidden="true" /> X / TWITTER</div>
                      <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium mt-1 inline-block hover:text-[#9DB1FF]">@wolfsiuu7</a>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E9EEFC]/10 mono text-[11px] leading-[1.6] opacity-60">
                    Response time: under 3 hours (9AM-11PM GMT+1). Prefer IG DM for quick chat.
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#E9EEFC]/15 p-6 mono text-[12px] leading-[1.6]">
                <div className="font-bold tracking-widest text-[11px] mb-3 text-[#9DB1FF]">FOR NEW CLIENTS:</div>
                Send me: 1) Raw link (Drive/Dropbox) 2) 1-2 ref videos 3) Deadline. I'll reply with price + timeline in 60 mins.
              </div>

              <div className="flex gap-2">
                <a href="https://www.instagram.com/wolf.siuu7/" target="_blank" rel="noopener noreferrer" className="flex-1 mono text-[11px] tracking-widest py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center justify-center gap-2">
                  <Aperture size={13} aria-hidden="true" /> IG
                </a>
                <a href="https://x.com/wolfsiuu7" target="_blank" rel="noopener noreferrer" className="flex-1 mono text-[11px] tracking-widest py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center justify-center gap-2">
                  <AtSign size={13} aria-hidden="true" /> X
                </a>
                <a href="mailto:adam.elfidh7@gmail.com" className="flex-1 mono text-[11px] tracking-widest py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center justify-center gap-2">
                  <Mail size={13} aria-hidden="true" /> EMAIL
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-[#E9EEFC]/15 flex flex-wrap items-center justify-between gap-4 mono text-[10px] tracking-widest opacity-60">
            <span>©2026 WOLF SIUU — VIDEO EDITOR. ALL RIGHTS RESERVED. BUILT FOR SPEED.</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#9DB1FF]" /> MADE IN MOROCCO, WATCHED WORLDWIDE</span>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeWork && (
        <div className="fixed inset-0 z-[80] bg-[#04060C]/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8" onClick={() => setActiveWork(null)}>
          <div className="relative w-full max-w-5xl bg-[#0A1128] rounded-[20px] overflow-hidden border border-[#E9EEFC]/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E9EEFC]/10 mono text-[11px] tracking-widest">
              <span className="truncate pr-4">{activeWork.title} • {activeWork.tag}</span>
              <button onClick={() => setActiveWork(null)} aria-label="Close player" className="w-8 h-8 rounded-full bg-[#E9EEFC] text-[#0A1128] flex items-center justify-center hover:bg-[#9DB1FF] transition shrink-0 cursor-pointer">
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
                <span className="text-[#E9EEFC]">{activeWork.meta}</span>
                <br />
                Plays in-page via the official YouTube embed — likes &amp; views count for the channel.
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${activeWork.ytId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[11px] tracking-widest px-5 py-3 rounded-full bg-[#1E2C86] text-[#E9EEFC] text-center hover:bg-[#2A3CA8] transition flex items-center gap-2 justify-center"
              >
                WATCH ON YOUTUBE <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
