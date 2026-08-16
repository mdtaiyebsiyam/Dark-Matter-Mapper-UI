import { useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { Moon, Menu, X, Search, RotateCcw, Plus, Minus, Zap, BarChart3, Scan } from "lucide-react";

type Screen = "home" | "explore" | "ar-mapper" | "how-it-works";
type Filter = "all" | "clusters" | "galaxies" | "rings";

// ── CSS overrides ──────────────────────────────────────────────────────
const CSS = `
  input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
  input[type="range"]::-webkit-slider-runnable-track { height: 0; background: transparent; }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; height: 16px; border-radius: 50%;
    background: linear-gradient(135deg, #9A6BFF, #6A94FF);
    border: 2px solid #05070D;
    box-shadow: 0 0 10px rgba(154,107,255,0.75);
    margin-top: -7px;
  }
  input[type="range"]::-moz-range-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: linear-gradient(135deg, #9A6BFF, #6A94FF);
    border: 2px solid #05070D;
    box-shadow: 0 0 10px rgba(154,107,255,0.75);
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #202738; border-radius: 2px; }
  .display { font-family: 'Space Grotesk', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace; }
`;

// ── Slider ─────────────────────────────────────────────────────────────
function SliderControl({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#98A4B8]">{label}</span>
        <span className="mono text-xs text-[#F4F7FF] bg-[#0F1420] border border-[#202738] px-2 py-0.5 rounded-md">
          {value}%
        </span>
      </div>
      <div className="relative flex items-center h-6">
        <div className="absolute inset-x-0 h-1.5 bg-[#202738] rounded-full" />
        <div className="absolute h-1.5 left-0 rounded-full transition-all"
          style={{ width: `${value}%`, background: "linear-gradient(90deg, #9A6BFF, #6A94FF)" }} />
        <input type="range" min="0" max="100" value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer" />
      </div>
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative w-10 h-5 rounded-full flex-shrink-0 transition-all duration-300"
      style={{ background: on ? "linear-gradient(90deg, #9A6BFF, #6A94FF)" : "#202738" }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
        style={{ left: on ? "calc(100% - 18px)" : "2px" }} />
    </button>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────
function Nav({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) {
  const [open, setOpen] = useState(false);
  const links: { l: string; k: Screen }[] = [
    { l: "Home", k: "home" },
    { l: "Explore", k: "explore" },
    { l: "AR Mapper", k: "ar-mapper" },
    { l: "How It Works", k: "how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#202738]"
      style={{ background: "rgba(5,7,13,0.94)", backdropFilter: "blur(14px)" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <button onClick={() => onChange("home")} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-opacity group-hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #9A6BFF 0%, #6A94FF 55%, #5CE1E6 100%)" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 1.5L11.9 8.1L18.5 10L11.9 11.9L10 18.5L8.1 11.9L1.5 10L8.1 8.1L10 1.5Z" fill="white" />
              </svg>
            </div>
            <div className="text-left">
              <p className="display text-sm font-semibold text-[#F4F7FF] leading-none mb-0.5">Dark Matter</p>
              <p className="text-xs text-[#6F7B90] leading-none">Mapper</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ l, k }) => (
              <button key={k} onClick={() => onChange(k)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                  active === k
                    ? "bg-[#0F1420] text-[#F4F7FF] font-medium border border-[#202738]"
                    : "text-[#98A4B8] hover:text-[#F4F7FF]"
                }`}>
                {l}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-[#202738] bg-[#0B1018] flex items-center justify-center text-[#98A4B8] hover:text-[#F4F7FF] transition-colors">
              <Moon size={15} />
            </button>
            <button className="md:hidden w-9 h-9 rounded-xl border border-[#202738] bg-[#0B1018] flex items-center justify-center text-[#98A4B8]"
              onClick={() => setOpen(!open)}>
              {open ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#202738] bg-[#0B1018] px-5 py-4 space-y-1">
          {links.map(({ l, k }) => (
            <button key={k} onClick={() => { onChange(k); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                active === k ? "bg-[#0F1420] text-[#F4F7FF] border border-[#202738]" : "text-[#98A4B8]"
              }`}>
              {l}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ── Hero Lensing Visualization ─────────────────────────────────────────
function HeroLensViz() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(154,107,255,0.14) 0%, rgba(106,148,255,0.06) 45%, transparent 70%)" }} />
      <svg viewBox="0 0 520 520" className="w-full max-w-[520px] relative z-10" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="h-grd" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9A6BFF" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#6A94FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
          </radialGradient>
          <filter id="h-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="h-blur10"><feGaussianBlur stdDeviation="10" /></filter>
          <filter id="h-blur6"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>

        {/* Ambient glow */}
        <circle cx="260" cy="260" r="200" fill="url(#h-grd)" opacity="0.38" />

        {/* Dotted background halo */}
        <circle cx="260" cy="260" r="218" stroke="#202738" strokeWidth="0.5" strokeDasharray="2,16" fill="none" />

        {/* Lensing elliptical rings at -22° */}
        <g transform="rotate(-22, 260, 260)">
          <ellipse cx="260" cy="260" rx="216" ry="70" stroke="#9A6BFF" strokeWidth="0.4" fill="none" opacity="0.11" />
          <ellipse cx="260" cy="260" rx="180" ry="58" stroke="#6A94FF" strokeWidth="0.6" fill="none" opacity="0.18" />
          <ellipse cx="260" cy="260" rx="144" ry="46" stroke="#5CE1E6" strokeWidth="0.8" fill="none" opacity="0.28" />
          <ellipse cx="260" cy="260" rx="108" ry="35" stroke="#9A6BFF" strokeWidth="1.1" fill="none" opacity="0.44" />
          <ellipse cx="260" cy="260" rx="74" ry="24" stroke="#5CE1E6" strokeWidth="1.4" fill="none" opacity="0.60" />
          <ellipse cx="260" cy="260" rx="44" ry="14" stroke="#B993FF" strokeWidth="1.6" fill="none" opacity="0.75" />
        </g>

        {/* Dotted orbital trace */}
        <g transform="rotate(-22, 260, 260)">
          <ellipse cx="260" cy="260" rx="197" ry="64" stroke="#98A4B8" strokeWidth="0.4" strokeDasharray="3,11" fill="none" opacity="0.09" />
        </g>

        {/* Curved light paths */}
        <path d="M 52,92 C 128,158 198,218 260,260 C 320,300 392,340 484,364" stroke="#5CE1E6" strokeWidth="1.3" fill="none" opacity="0.52" filter="url(#h-glow)" />
        <path d="M 142,36 C 188,132 226,192 260,260 C 294,328 340,402 420,488" stroke="#9A6BFF" strokeWidth="1.3" fill="none" opacity="0.50" filter="url(#h-glow)" />
        <path d="M 468,70 C 382,148 318,200 260,260 C 202,320 156,390 88,472" stroke="#5CE1E6" strokeWidth="1.1" fill="none" opacity="0.45" filter="url(#h-glow)" />
        <path d="M 42,316 C 138,294 200,276 260,260 C 330,242 400,200 502,160" stroke="#6A94FF" strokeWidth="1.0" fill="none" opacity="0.40" filter="url(#h-glow)" />
        <path d="M 72,444 C 158,370 208,310 260,260 C 312,210 378,160 480,116" stroke="#B993FF" strokeWidth="0.8" fill="none" opacity="0.34" filter="url(#h-glow)" />

        {/* Soft center glow */}
        <circle cx="260" cy="260" r="58" fill="#7A50CC" opacity="0.07" filter="url(#h-blur10)" />
        <circle cx="260" cy="260" r="34" fill="#9A6BFF" opacity="0.13" filter="url(#h-blur6)" />

        {/* Central mass */}
        <circle cx="260" cy="260" r="30" fill="#0F1420" stroke="#9A6BFF" strokeWidth="1.5" />
        <circle cx="260" cy="260" r="22" fill="#05070D" />
        <circle cx="260" cy="260" r="12" fill="#9A6BFF" opacity="0.42" filter="url(#h-glow)" />
        <circle cx="260" cy="260" r="6" fill="#B993FF" opacity="0.95" />
        <circle cx="260" cy="260" r="2.5" fill="white" opacity="0.8" />

        {/* Stars */}
        {[[96,86],[446,126],[52,382],[488,400],[192,46],[382,492],[494,240],[26,196],[352,68],[118,462],[468,320],[28,430]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 0.9} fill={i % 2 === 0 ? "#F4F7FF" : "#5CE1E6"} opacity={0.22 + (i % 4) * 0.11} />
        ))}

        {/* MASS PEAK label */}
        <line x1="246" y1="238" x2="182" y2="188" stroke="#6F7B90" strokeWidth="0.5" />
        <rect x="102" y="174" width="90" height="20" rx="5" fill="#0B1018" stroke="#202738" strokeWidth="0.75" />
        <text x="147" y="187.5" textAnchor="middle" fontSize="8.5" fill="#5CE1E6" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.6" fontWeight="500">MASS PEAK</text>

        {/* DARK MATTER MAP label */}
        <line x1="274" y1="285" x2="352" y2="362" stroke="#6F7B90" strokeWidth="0.5" />
        <rect x="344" y="358" width="118" height="20" rx="5" fill="#0B1018" stroke="#202738" strokeWidth="0.75" />
        <text x="403" y="371.5" textAnchor="middle" fontSize="7.5" fill="#9A6BFF" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.1" fontWeight="500">DARK MATTER MAP</text>
      </svg>
    </div>
  );
}

// ── Event Card Mini-Visualization ──────────────────────────────────────
function EventViz({ type }: { type: "cluster" | "galaxy" | "ring" | "complex" }) {
  if (type === "cluster") return (
    <svg viewBox="0 0 260 150" className="w-full h-full">
      <defs>
        <radialGradient id="ec1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9A6BFF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
        </radialGradient>
        <filter id="ecg1"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="260" height="150" fill="#030610" />
      {[[18,18],[242,22],[15,132],[245,128],[130,10],[55,80],[200,75]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?1.4:0.8} fill={i%2===0?"#F4F7FF":"#5CE1E6"} opacity={0.2+i*0.07}/>
      ))}
      <circle cx="130" cy="75" r="50" fill="url(#ec1)" />
      <ellipse cx="130" cy="75" rx="22" ry="9" fill="#9A6BFF" opacity="0.55" transform="rotate(30, 130, 75)" />
      <ellipse cx="100" cy="58" rx="13" ry="5" fill="#6A94FF" opacity="0.45" transform="rotate(-18, 100, 58)" />
      <ellipse cx="158" cy="92" rx="11" ry="4.5" fill="#5CE1E6" opacity="0.35" transform="rotate(42, 158, 92)" />
      <circle cx="130" cy="75" r="6" fill="#B993FF" opacity="0.7" filter="url(#ecg1)" />
      <path d="M 78,28 Q 130,54 182,36" stroke="#5CE1E6" strokeWidth="1.6" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M 70,108 Q 130,128 190,110" stroke="#9A6BFF" strokeWidth="1.3" fill="none" opacity="0.52" strokeLinecap="round" />
      <path d="M 58,62 Q 85,72 92,95" stroke="#6A94FF" strokeWidth="1" fill="none" opacity="0.38" />
    </svg>
  );

  if (type === "galaxy") return (
    <svg viewBox="0 0 260 150" className="w-full h-full">
      <defs>
        <radialGradient id="eg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6A94FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
        </radialGradient>
        <filter id="egg1"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="260" height="150" fill="#030610" />
      {[[14,14],[245,18],[12,136],[248,132],[130,6],[42,130]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={0.9} fill="#F4F7FF" opacity={0.18+i*0.06}/>
      ))}
      <circle cx="130" cy="75" r="54" fill="url(#eg1)" />
      <ellipse cx="130" cy="75" rx="38" ry="13" fill="#6A94FF" opacity="0.5" transform="rotate(-14, 130, 75)" />
      <ellipse cx="130" cy="75" rx="24" ry="8" fill="#9A6BFF" opacity="0.62" transform="rotate(-14, 130, 75)" />
      <circle cx="130" cy="75" r="7" fill="#B993FF" opacity="0.75" filter="url(#egg1)" />
      <path d="M 50,32 Q 130,18 210,42" stroke="#5CE1E6" strokeWidth="1.6" fill="none" opacity="0.58" strokeLinecap="round" />
      <path d="M 45,108 Q 130,124 215,106" stroke="#6A94FF" strokeWidth="1.3" fill="none" opacity="0.48" strokeLinecap="round" />
      <path d="M 72,22 Q 88,52 78,80" stroke="#9A6BFF" strokeWidth="1" fill="none" opacity="0.32" />
    </svg>
  );

  if (type === "ring") return (
    <svg viewBox="0 0 260 150" className="w-full h-full">
      <defs>
        <radialGradient id="er1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#9A6BFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
        </radialGradient>
        <filter id="erg1"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="260" height="150" fill="#030610" />
      {[[10,10],[250,14],[10,140],[250,138],[130,4]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.8" fill="#F4F7FF" opacity={0.18+i*0.07}/>
      ))}
      <circle cx="130" cy="75" r="60" fill="url(#er1)" opacity="0.45" />
      <circle cx="130" cy="75" r="46" stroke="#5CE1E6" strokeWidth="3.5" fill="none" opacity="0.92" filter="url(#erg1)" />
      <circle cx="130" cy="75" r="46" stroke="#B993FF" strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="130" cy="75" r="55" stroke="#5CE1E6" strokeWidth="0.5" fill="none" opacity="0.15" />
      <circle cx="130" cy="75" r="13" fill="#0F1420" stroke="#9A6BFF" strokeWidth="1.2" />
      <circle cx="130" cy="75" r="7" fill="#B993FF" opacity="0.8" filter="url(#erg1)" />
      <circle cx="130" cy="75" r="3" fill="white" opacity="0.85" />
    </svg>
  );

  return (
    <svg viewBox="0 0 260 150" className="w-full h-full">
      <defs>
        <radialGradient id="ex1" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#9A6BFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ex2" cx="62%" cy="62%" r="55%">
          <stop offset="0%" stopColor="#6A94FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
        </radialGradient>
        <filter id="exg1"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="260" height="150" fill="#030610" />
      {[[12,12],[248,18],[8,138],[252,132],[200,65]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.8" fill="#F4F7FF" opacity={0.18+i*0.07}/>
      ))}
      <circle cx="98" cy="58" r="44" fill="url(#ex1)" />
      <circle cx="162" cy="94" r="38" fill="url(#ex2)" />
      <ellipse cx="98" cy="58" rx="17" ry="7" fill="#9A6BFF" opacity="0.56" transform="rotate(18, 98, 58)" />
      <circle cx="98" cy="58" r="5" fill="#B993FF" opacity="0.75" filter="url(#exg1)" />
      <ellipse cx="162" cy="94" rx="15" ry="6" fill="#6A94FF" opacity="0.56" transform="rotate(-14, 162, 94)" />
      <circle cx="162" cy="94" r="4.5" fill="#5CE1E6" opacity="0.75" filter="url(#exg1)" />
      <path d="M 36,24 Q 68,10 108,22 Q 148,34 176,60" stroke="#5CE1E6" strokeWidth="1.4" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M 28,96 Q 66,114 104,118 Q 142,122 178,108" stroke="#9A6BFF" strokeWidth="1.2" fill="none" opacity="0.48" strokeLinecap="round" />
      <path d="M 125,30 Q 140,62 134,96" stroke="#6A94FF" strokeWidth="1" fill="none" opacity="0.34" />
    </svg>
  );
}

// ── AR Canvas ──────────────────────────────────────────────────────────
function ARCanvas({ demoMode }: { demoMode: boolean }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#202738]"
      style={{ background: "#030610", aspectRatio: "4/3" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 760 570" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="ar-grd" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9A6BFF" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#6A94FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9A6BFF" stopOpacity="0" />
          </radialGradient>
          <filter id="ar-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ar-blur14"><feGaussianBlur stdDeviation="14" /></filter>
          <filter id="ar-blur6"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 47} x2="760" y2={(i + 1) * 47}
            stroke="#202738" strokeWidth="0.4" opacity="0.5" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 47} y1="0" x2={(i + 1) * 47} y2="570"
            stroke="#202738" strokeWidth="0.4" opacity="0.5" />
        ))}

        {/* Outer lens boundary */}
        <circle cx="380" cy="285" r="210" stroke="#9A6BFF" strokeWidth="0.8" fill="none" opacity="0.18" strokeDasharray="6,10" />

        {/* Ambient glow */}
        <circle cx="380" cy="285" r="170" fill="url(#ar-grd)" opacity="0.3" />
        <circle cx="380" cy="285" r="90" fill="#9A6BFF" opacity="0.06" filter="url(#ar-blur14)" />

        {/* Lensing rings */}
        <g transform="rotate(-16, 380, 285)">
          <ellipse cx="380" cy="285" rx="136" ry="46" stroke="#9A6BFF" strokeWidth="0.9" fill="none" opacity="0.36" />
          <ellipse cx="380" cy="285" rx="104" ry="35" stroke="#5CE1E6" strokeWidth="1.1" fill="none" opacity="0.46" />
          <ellipse cx="380" cy="285" rx="72" ry="24" stroke="#6A94FF" strokeWidth="1.3" fill="none" opacity="0.58" />
        </g>

        {/* Curved light paths */}
        <path d="M 96,76 C 198,158 300,222 380,285 C 462,346 562,385 690,406" stroke="#5CE1E6" strokeWidth="1.2" fill="none" opacity="0.42" filter="url(#ar-glow)" />
        <path d="M 196,38 C 260,140 324,202 380,285 C 436,368 524,442 652,528" stroke="#9A6BFF" strokeWidth="1.2" fill="none" opacity="0.42" filter="url(#ar-glow)" />
        <path d="M 664,96 C 562,162 462,224 380,285 C 298,346 218,392 96,432" stroke="#5CE1E6" strokeWidth="1" fill="none" opacity="0.38" filter="url(#ar-glow)" />
        <path d="M 76,388 C 178,346 282,316 380,285 C 478,254 578,216 728,182" stroke="#6A94FF" strokeWidth="1" fill="none" opacity="0.36" filter="url(#ar-glow)" />
        <path d="M 116,490 C 218,406 302,344 380,285 C 458,226 542,162 684,100" stroke="#B993FF" strokeWidth="0.8" fill="none" opacity="0.3" filter="url(#ar-glow)" />

        {/* Central mass */}
        <circle cx="380" cy="285" r="42" fill="#0F1420" stroke="#9A6BFF" strokeWidth="1.5" />
        <circle cx="380" cy="285" r="32" fill="#05070D" />
        <circle cx="380" cy="285" r="18" fill="#9A6BFF" opacity="0.38" filter="url(#ar-blur6)" />
        <circle cx="380" cy="285" r="9" fill="#B993FF" opacity="0.82" filter="url(#ar-glow)" />
        <circle cx="380" cy="285" r="3.5" fill="white" opacity="0.9" />

        {/* Detection brackets */}
        <path d="M 272,177 L 272,200 M 272,177 L 296,177" stroke="#5CE1E6" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />
        <path d="M 488,177 L 488,200 M 488,177 L 464,177" stroke="#5CE1E6" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />
        <path d="M 272,393 L 272,370 M 272,393 L 296,393" stroke="#5CE1E6" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />
        <path d="M 488,393 L 488,370 M 488,393 L 464,393" stroke="#5CE1E6" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />

        {/* Measurement labels */}
        <line x1="460" y1="204" x2="520" y2="168" stroke="#6F7B90" strokeWidth="0.5" />
        <text x="524" y="165" fontSize="8.5" fill="#98A4B8" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.8">light deflection</text>
        <line x1="380" y1="244" x2="448" y2="200" stroke="#6F7B90" strokeWidth="0.5" />
        <text x="452" y="197" fontSize="8.5" fill="#9A6BFF" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.8">inferred mass peak</text>

        {/* Stars */}
        {[[58,48],[722,78],[36,506],[746,496],[684,274],[98,302],[400,46],[382,520],[60,280],[700,300]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.8} fill={i % 2 === 0 ? "#F4F7FF" : "#5CE1E6"} opacity={0.18 + (i % 4) * 0.09} />
        ))}
      </svg>

      {/* Top-left HUD */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#5CE1E6] animate-pulse" />
          <span className="mono text-xs text-[#5CE1E6] tracking-widest">LIVE OVERLAY</span>
        </div>
        <div className="mono text-xs text-[#F4F7FF] px-2.5 py-1 rounded-lg border border-[#202738] tracking-wide"
          style={{ background: "rgba(11,16,24,0.85)" }}>
          RXC J2248.7−4431
        </div>
      </div>

      {/* Top-right HUD */}
      <div className="absolute top-4 right-4">
        <div className="mono text-xs text-[#6F7B90] px-2.5 py-1 rounded-lg border border-[#202738] tracking-widest"
          style={{ background: "rgba(11,16,24,0.85)" }}>
          CAM OFF
        </div>
      </div>

      {/* Bottom-left HUD */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <div className="mono flex items-center gap-2 text-[11px] text-[#6F7B90] tracking-wide">
          <span className="text-[#5CE1E6]">●</span> LATENCY 24 ms
        </div>
        <div className="mono flex items-center gap-2 text-[11px] text-[#6F7B90] tracking-wide">
          <span className="text-[#9A6BFF]">●</span> MASS MAP ON
        </div>
      </div>

      {/* Center prompt */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-6 py-4 rounded-2xl border border-[#202738]/50"
          style={{ background: "rgba(11,16,24,0.5)", backdropFilter: "blur(6px)" }}>
          <p className="text-sm font-medium text-[#98A4B8] mb-1">AR preview ready</p>
          <p className="text-xs text-[#6F7B90]">Start Demo Mode or enable your camera.</p>
        </div>
      </div>
    </div>
  );
}

// ── Lens Diagram ───────────────────────────────────────────────────────
function LensDiagram() {
  return (
    <svg viewBox="0 0 480 280" className="w-full" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="ld-mass" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9A6BFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="0" />
        </radialGradient>
        <filter id="ld-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ld-blur8"><feGaussianBlur stdDeviation="8" /></filter>
        <marker id="ld-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0,0 L 6,3 L 0,6 Z" fill="#5CE1E6" opacity="0.7" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="480" height="280" fill="#05070D" rx="16" />

      {/* Grid dots */}
      {Array.from({ length: 8 }).flatMap((_, r) => Array.from({ length: 14 }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={20 + c * 34} cy={20 + r * 34} r="0.6" fill="#202738" opacity="0.6" />
      )))}

      {/* Optical axis */}
      <line x1="24" y1="140" x2="456" y2="140" stroke="#202738" strokeWidth="0.5" strokeDasharray="4,8" />

      {/* Source (left) */}
      <circle cx="52" cy="120" r="8" fill="#5CE1E6" opacity="0.9" filter="url(#ld-glow)" />
      <circle cx="52" cy="120" r="14" fill="#5CE1E6" opacity="0.08" filter="url(#ld-blur8)" />
      <text x="52" y="148" textAnchor="middle" fontSize="8" fill="#98A4B8" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.8">SOURCE</text>

      {/* Lens/mass (center) */}
      <circle cx="240" cy="140" r="38" fill="url(#ld-mass)" opacity="0.45" />
      <circle cx="240" cy="140" r="20" fill="#0F1420" stroke="#9A6BFF" strokeWidth="1.5" />
      <circle cx="240" cy="140" r="12" fill="#05070D" />
      <circle cx="240" cy="140" r="7" fill="#9A6BFF" opacity="0.6" filter="url(#ld-glow)" />
      <circle cx="240" cy="140" r="3" fill="#B993FF" opacity="0.9" />
      <text x="240" y="178" textAnchor="middle" fontSize="8" fill="#98A4B8" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.8">LENS MASS</text>

      {/* Observer (right) */}
      <circle cx="428" cy="140" r="6" fill="#F4F7FF" opacity="0.7" filter="url(#ld-glow)" />
      <text x="428" y="162" textAnchor="middle" fontSize="8" fill="#98A4B8" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.8">OBSERVER</text>

      {/* Curved light paths */}
      <path d="M 60,116 C 140,80 200,100 240,140 C 280,178 360,168 424,144" stroke="#5CE1E6" strokeWidth="1.4" fill="none" opacity="0.65" filter="url(#ld-glow)" />
      <path d="M 60,124 C 140,96 200,112 240,140 C 280,168 360,156 424,140" stroke="#5CE1E6" strokeWidth="1" fill="none" opacity="0.42" filter="url(#ld-glow)" />
      <path d="M 60,112 C 140,64 196,90 240,140 C 284,188 368,180 424,148" stroke="#9A6BFF" strokeWidth="1.1" fill="none" opacity="0.52" filter="url(#ld-glow)" />

      {/* Deflection angle indicator */}
      <path d="M 240,120 L 240,104" stroke="#9A6BFF" strokeWidth="0.8" strokeDasharray="2,4" opacity="0.5" />
      <text x="250" y="108" fontSize="7.5" fill="#6F7B90" fontFamily="'JetBrains Mono', monospace">θ</text>
    </svg>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────
function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const features = [
    {
      icon: <Zap size={18} />,
      title: "Trace light",
      desc: "Follow distorted light paths around a massive foreground object.",
      color: "#5CE1E6",
    },
    {
      icon: <BarChart3 size={18} />,
      title: "Map mass",
      desc: "Visualize inferred mass density and identify the strongest lensing regions.",
      color: "#9A6BFF",
    },
    {
      icon: <Scan size={18} />,
      title: "Explore in AR",
      desc: "Use an AR-style overlay to understand how gravitational lensing reveals hidden structure.",
      color: "#6A94FF",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-5 lg:px-8 pt-14 sm:pt-16 lg:pt-20 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-6 items-center">
          {/* Left */}
          <div className="space-y-7 lg:space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6] animate-pulse" />
              <span className="mono text-[11px] text-[#98A4B8] tracking-widest uppercase">Gravitational Lensing • Live Simulation</span>
            </div>

            <h1 className="display text-[52px] sm:text-[64px] lg:text-[76px] font-bold leading-[1.0] tracking-tight">
              <span className="text-[#F4F7FF]">Map the</span>
              <br />
              <span style={{ background: "linear-gradient(90deg, #9A6BFF 0%, #6A94FF 50%, #5CE1E6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                invisible.
              </span>
            </h1>

            <p className="text-base lg:text-[17px] text-[#98A4B8] leading-relaxed max-w-[480px]">
              Explore how massive objects bend light and reveal hidden dark matter through an immersive AR-style overlay.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("ar-mapper")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #9A6BFF 0%, #6A94FF 100%)" }}>
                Launch AR Mapper
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => navigate("explore")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#F4F7FF] border border-[#202738] bg-[#0B1018] transition-all hover:border-[#9A6BFF]/50 hover:bg-[#0F1420]">
                Explore lensing events
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 pt-1">
              {[
                { v: "2.8M+", l: "simulated rays" },
                { v: "17", l: "lensing events" },
                { v: "98.4%", l: "model confidence" },
              ].map(s => (
                <div key={s.l}>
                  <p className="display text-2xl lg:text-3xl font-bold text-[#F4F7FF]">{s.v}</p>
                  <p className="text-xs text-[#6F7B90] mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – visualization */}
          <div className="order-first lg:order-last relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[520px]">
            <HeroLensViz />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#202738]" style={{ background: "rgba(11,16,24,0.5)" }}>
        <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="mb-12 flex flex-col lg:flex-row lg:items-end gap-5 lg:justify-between">
            <div>
              <p className="mono text-[11px] text-[#6F7B90] tracking-widest uppercase mb-4">What You Can Do</p>
              <h2 className="display text-3xl lg:text-4xl font-bold text-[#F4F7FF]">From light to mass.</h2>
            </div>
            <p className="text-sm lg:text-base text-[#98A4B8] max-w-[400px] lg:text-right leading-relaxed">
              Use the interface to inspect a lensing scene, adjust the model and visualize the inferred mass distribution.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {features.map(f => (
              <div key={f.title}
                className="group p-6 rounded-2xl border border-[#202738] bg-[#0B1018] transition-all duration-300 hover:border-[#9A6BFF]/30 cursor-default"
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(154,107,255,0.08)`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 0 transparent")}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border border-[#202738]"
                  style={{ background: `${f.color}14`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="display text-lg font-semibold text-[#F4F7FF] mb-2">{f.title}</h3>
                <p className="text-sm text-[#98A4B8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ── EXPLORE ────────────────────────────────────────────────────────────
const events = [
  {
    cat: "CLUSTER", catFilter: "clusters" as Filter,
    title: "RXC J2248.7−4431", conf: 98,
    desc: "Dense galaxy cluster with a pronounced strong-lensing signal.",
    tags: ["z = 0.348", "Strong lensing"],
    viz: "cluster" as const,
  },
  {
    cat: "GALAXY", catFilter: "galaxies" as Filter,
    title: "Abell 1689", conf: 94,
    desc: "Classic cluster lensing pattern with multiple distorted background galaxies.",
    tags: ["z = 0.183", "Weak + strong"],
    viz: "galaxy" as const,
  },
  {
    cat: "RING", catFilter: "rings" as Filter,
    title: "Einstein Ring", conf: 96,
    desc: "A near-perfect alignment creates a luminous ring around the foreground lens.",
    tags: ["z = 0.412", "Ring"],
    viz: "ring" as const,
  },
  {
    cat: "CLUSTER", catFilter: "clusters" as Filter,
    title: "MACS J0416.1−2403", conf: 92,
    desc: "Complex cluster environment with multiple interacting lensing structures.",
    tags: ["z = 0.397", "Cluster"],
    viz: "complex" as const,
  },
];

function ExploreScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: { l: string; k: Filter }[] = [
    { l: "All", k: "all" },
    { l: "Clusters", k: "clusters" },
    { l: "Galaxies", k: "galaxies" },
    { l: "Einstein rings", k: "rings" },
  ];

  const visible = events.filter(e =>
    (filter === "all" || e.catFilter === filter) &&
    (query === "" || e.title.toLowerCase().includes(query.toLowerCase()))
  );

  const confColor = (c: number) => c >= 96 ? "#5CE1E6" : c >= 93 ? "#9A6BFF" : "#6A94FF";

  return (
    <main className="max-w-[1200px] mx-auto px-5 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="mono text-[11px] text-[#6F7B90] tracking-widest uppercase mb-4">Lensing Library</p>
        <h1 className="display text-4xl lg:text-5xl font-bold text-[#F4F7FF] mb-4">Explore events.</h1>
        <p className="text-base text-[#98A4B8] max-w-[520px] leading-relaxed">
          Choose a scene and load it into the mapper. These are educational simulations, not scientific measurements.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(({ l, k }) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                filter === k
                  ? "bg-[#F4F7FF] text-[#05070D] border-[#F4F7FF]"
                  : "bg-transparent text-[#98A4B8] border-[#202738] hover:border-[#9A6BFF]/50 hover:text-[#F4F7FF]"
              }`}>
              {l}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7B90]" />
          <input
            type="text"
            placeholder="Search event…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-[#202738] bg-[#0B1018] text-sm text-[#F4F7FF] placeholder:text-[#6F7B90] focus:outline-none focus:border-[#9A6BFF]/60 transition-colors w-full sm:w-56"
          />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {visible.map(ev => (
          <div key={ev.title}
            className="group rounded-2xl border border-[#202738] bg-[#0B1018] overflow-hidden transition-all duration-300 hover:border-[#9A6BFF]/35 cursor-default">
            {/* Visualization */}
            <div className="h-40 w-full overflow-hidden">
              <EventViz type={ev.viz} />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="mono text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-[#202738] text-[#6F7B90]">
                  {ev.cat}
                </span>
                <span className="mono text-[11px] font-medium" style={{ color: confColor(ev.conf) }}>
                  {ev.conf}% confidence
                </span>
              </div>

              <h3 className="display text-lg font-semibold text-[#F4F7FF] mb-2">{ev.title}</h3>
              <p className="text-sm text-[#98A4B8] leading-relaxed mb-4">{ev.desc}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {ev.tags.map(t => (
                  <span key={t} className="mono text-[10px] tracking-wide text-[#6A94FF] bg-[#6A94FF]/10 border border-[#6A94FF]/20 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              <button onClick={() => navigate("ar-mapper")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-[#F4F7FF] border border-[#202738] bg-[#0F1420] transition-all hover:bg-[#9A6BFF]/10 hover:border-[#9A6BFF]/40">
                Load scene
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="sm:col-span-2 py-20 text-center text-[#6F7B90] text-sm">
            No events match your filter.
          </div>
        )}
      </div>
    </main>
  );
}

// ── AR MAPPER ──────────────────────────────────────────────────────────
function ARMapperScreen() {
  const [lensMass, setLensMass] = useState(72);
  const [alignment, setAlignment] = useState(64);
  const [opacity, setOpacity] = useState(78);
  const [density, setDensity] = useState(true);
  const [paths, setPaths] = useState(true);
  const [labels, setLabels] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [confidence, setConfidence] = useState(98.4);
  const [cameraEnabled, setCameraEnabled] = useState(false);
const videoRef = useRef<HTMLVideoElement | null>(null);

const handleEnableCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setCameraEnabled(true);

    toast.success("Camera enabled", {
      description: "Live camera feed is now active.",
      duration: 3000,
    });
  } catch (error) {
    console.error("Camera error:", error);

    toast.error("Camera access denied", {
      description: "Please allow camera permission.",
      duration: 4000,
    });
  }
};

const handleAnalyze = () => {
  const calculatedConfidence = Math.min(
    99.9,
    Math.max(
      70,
      70 +
        lensMass * 0.15 +
        alignment * 0.08 +
        opacity * 0.05
    )
  );
  setConfidence(calculatedConfidence);
  toast.success("Lensing signal analyzed", {
    description: `Model confidence: ${calculatedConfidence.toFixed(1)}% — stable pattern detected.`,
    duration: 4000,
  });
};

  const handleReset = () => {
    setLensMass(72); setAlignment(64); setOpacity(78);
    setDensity(true); setPaths(true); setLabels(true);
    toast("Parameters reset to defaults", { duration: 2500 });
  };

  return (
    <main className="max-w-[1200px] mx-auto px-5 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
        <div>
          <p className="mono text-[11px] text-[#6F7B90] tracking-widest uppercase mb-3">Mapper / Simulation</p>
          <h1 className="display text-3xl lg:text-4xl font-bold text-[#F4F7FF]">Gravitational lens overlay</h1>
        </div>
        <div className="flex gap-3">
<button
  onClick={() => {
    setDemoMode(true);
    toast.success("Demo Mode started", {
      description: "Gravitational lens simulation is now active.",
      duration: 3000,
    });
  }}
  className="px-4 py-2 rounded-xl text-sm font-semibold"
>
  {demoMode ? "Demo Active" : "Demo mode"}
</button>
          <button
  onClick={handleEnableCamera}
  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
  style={{
    background: "linear-gradient(135deg, #9A6BFF, #6A94FF)",
  }}
>
  {cameraEnabled ? "Camera Active" : "Enable camera"}
</button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Canvas */}
        <div className="flex-1 min-w-0 relative">
  {cameraEnabled && (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"
    />
  )}

  <div className="relative z-10 bg-transparent pointer-events-none">
  <ARCanvas demoMode={demoMode} />
</div>
</div>

        {/* Controls */}
        <div className="lg:w-[300px] flex-shrink-0 rounded-2xl border border-[#202738] bg-[#0B1018] p-5 space-y-6">
          <div>
            <p className="mono text-[10px] text-[#6F7B90] tracking-widest uppercase mb-1">Model Control</p>
            <h2 className="display text-lg font-semibold text-[#F4F7FF]">Lens parameters</h2>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            <SliderControl label="Lens mass" value={lensMass} onChange={setLensMass} />
            <SliderControl label="Alignment" value={alignment} onChange={setAlignment} />
            <SliderControl label="Overlay opacity" value={opacity} onChange={setOpacity} />
          </div>

          <div className="h-px bg-[#202738]" />

          {/* Toggles */}
          <div className="space-y-4">
            {[
              { label: "Mass density", sub: "Inferred convergence map", val: density, set: () => setDensity(!density) },
              { label: "Light paths", sub: "Ray-tracing visualization", val: paths, set: () => setPaths(!paths) },
              { label: "Labels", sub: "Show measurement markers", val: labels, set: () => setLabels(!labels) },
            ].map(t => (
              <div key={t.label} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F4F7FF]">{t.label}</p>
                  <p className="text-xs text-[#6F7B90] mt-0.5">{t.sub}</p>
                </div>
                <Toggle on={t.val} onToggle={t.set} />
              </div>
            ))}
          </div>

          <div className="h-px bg-[#202738]" />

          {/* Actions */}
          <div className="space-y-2.5">
            <button onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #9A6BFF 0%, #6A94FF 100%)" }}>
              Analyze lensing signal
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-[#98A4B8] border border-[#202738] bg-transparent transition-all hover:text-[#F4F7FF] hover:border-[#6F7B90]">
              <RotateCcw size={14} />
              Reset parameters
            </button>
          </div>

          {/* Confidence card */}
          <div className="rounded-xl border border-[#202738] p-4"
            style={{ background: "linear-gradient(135deg, rgba(154,107,255,0.08), rgba(92,225,230,0.05))" }}>
            <p className="mono text-[10px] text-[#6F7B90] tracking-widest uppercase mb-2">Model Confidence</p>
            <p className="display text-3xl font-bold mb-1"
              style={{ background: "linear-gradient(90deg, #9A6BFF, #5CE1E6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {confidence.toFixed(1)}%
            </p>
            <p className="text-xs text-[#98A4B8]">Stable lensing pattern detected.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── HOW IT WORKS ───────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Background light", body: "Light from a distant galaxy travels toward an observer." },
  { n: "02", title: "Mass bends light", body: "A foreground galaxy or cluster curves spacetime and changes the light path." },
  { n: "03", title: "Measure distortion", body: "Arcs, stretching and convergence become observable lensing signals." },
  { n: "04", title: "Infer dark matter", body: "A model estimates where additional unseen mass could explain the distortion." },
];

const faqs = [
  { q: "What is gravitational lensing?", a: "Gravitational lensing is the bending of light by massive objects. According to general relativity, mass curves spacetime, and light follows those curves — allowing distant objects to act as natural cosmic lenses." },
  { q: "How does lensing reveal dark matter?", a: "Dark matter is invisible, but its gravity bends light just like visible matter. By modeling the distorted shapes of background galaxies, scientists can map where unseen mass concentrations must exist." },
  { q: "Is the AR result a real scientific measurement?", a: "No — Dark Matter Mapper is an educational simulation. It illustrates the principles of gravitational lensing, not precise astrophysical measurements." },
  { q: "What does model confidence mean?", a: "Model confidence reflects how well the simulated lensing pattern matches a stable, coherent mass distribution given the chosen parameters. Higher confidence indicates a more physically plausible lens configuration." },
];

function HowItWorksScreen() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="max-w-[1200px] mx-auto px-5 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="mb-14">
        <p className="mono text-[11px] text-[#6F7B90] tracking-widest uppercase mb-4">The Science, Simplified</p>
        <h1 className="display text-4xl lg:text-5xl font-bold mb-5">
          <span className="text-[#F4F7FF]">How light reveals </span>
          <span style={{ background: "linear-gradient(90deg, #9A6BFF, #5CE1E6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            hidden mass.
          </span>
        </h1>
        <p className="text-base text-[#98A4B8] max-w-[520px] leading-relaxed">
          Dark Matter Mapper turns the idea of gravitational lensing into an interactive learning experience.
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {steps.map((s, i) => (
          <div key={s.n} className="p-5 rounded-2xl border border-[#202738] bg-[#0B1018]">
            <div className="flex items-center gap-3 mb-4">
              <span className="mono text-2xl font-bold"
                style={{ background: "linear-gradient(90deg, #9A6BFF, #6A94FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {s.n}
              </span>
              {i < steps.length - 1 && (
                <div className="hidden lg:block flex-1 h-px" style={{ background: "linear-gradient(90deg, #202738, transparent)" }} />
              )}
            </div>
            <h3 className="display text-base font-semibold text-[#F4F7FF] mb-2">{s.title}</h3>
            <p className="text-sm text-[#98A4B8] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Concept section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16 items-center">
        {/* Diagram */}
        <div className="rounded-2xl border border-[#202738] overflow-hidden" style={{ background: "#05070D" }}>
          <LensDiagram />
        </div>

        {/* Text */}
        <div className="space-y-5">
          <div>
            <p className="mono text-[10px] text-[#6F7B90] tracking-widest uppercase mb-3">Core Concept</p>
            <h2 className="display text-2xl lg:text-3xl font-bold text-[#F4F7FF] mb-4">Gravitational lensing</h2>
            <p className="text-sm lg:text-base text-[#98A4B8] leading-relaxed">
              In general relativity, mass and energy curve spacetime. Light follows that curved geometry, so a massive foreground object can act like a cosmic lens — bending, amplifying, and distorting the images of background sources.
            </p>
          </div>

          {/* Formula */}
          <div className="p-5 rounded-2xl border border-[#202738] bg-[#0B1018]"
            style={{ background: "linear-gradient(135deg, rgba(154,107,255,0.07), rgba(92,225,230,0.04))" }}>
            <p className="mono text-[10px] text-[#6F7B90] tracking-widest uppercase mb-3">Deflection Angle Formula</p>
            <p className="mono text-2xl lg:text-3xl font-medium tracking-wide text-center py-2"
              style={{ color: "#F4F7FF" }}>
              θ ≈{" "}
              <span style={{ color: "#9A6BFF" }}>4GM</span>
              {" / "}
              <span style={{ color: "#5CE1E6" }}>(c²b)</span>
            </p>
            <p className="text-xs text-[#6F7B90] text-center mt-3 leading-relaxed">
              The formula shown is a simplified educational relationship for deflection angle.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <p className="mono text-[11px] text-[#6F7B90] tracking-widest uppercase mb-6">Frequently Asked</p>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-[#202738] bg-[#0B1018] overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#0F1420]"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-medium text-[#F4F7FF] pr-4">{faq.q}</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#202738] flex items-center justify-center transition-all"
                  style={{ color: open === i ? "#9A6BFF" : "#6F7B90" }}>
                  {open === i ? <Minus size={12} /> : <Plus size={12} />}
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-[#98A4B8] leading-relaxed border-t border-[#202738] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="min-h-screen bg-[#05070D] text-[#F4F7FF]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{CSS}</style>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#0B1018",
            border: "1px solid #202738",
            color: "#F4F7FF",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
      <Nav active={screen} onChange={setScreen} />
      {screen === "home" && <HomeScreen navigate={setScreen} />}
      {screen === "explore" && <ExploreScreen navigate={setScreen} />}
      {screen === "ar-mapper" && <ARMapperScreen />}
      {screen === "how-it-works" && <HowItWorksScreen />}
    </div>
  );
}
