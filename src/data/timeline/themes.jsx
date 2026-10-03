import React, { useMemo } from "react";

/* =========================================================
   1. ICONS (Festival & Event Badges)
========================================================= */

export const DiyaIcon = ({ className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block ${className}`}
  >
    <path
      d="M3 13C3.5 18 8 20 12 20C16 20 20.5 18 21 13H3Z"
      className="fill-amber-700"
    />
    <ellipse cx="12" cy="13" rx="9" ry="2.2" className="fill-amber-500" />
    <path
      d="M12 2C10.5 5 9.5 7.5 10 9.5C10.5 11.5 12 12 12 12C12 12 13.5 11.5 14 9.5C14.5 7.5 13.5 5 12 2Z"
      className="animate-pulse fill-yellow-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
    />
  </svg>
);

/* =========================================================
   2. SYNTHETIC SOUND ENGINE (Native Web Audio API)
========================================================= */

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Diwali firecracker pop/sparkle sound
  playDiwaliPop() {
    try {
      this.init();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (_) {}
  }

  // Holi gulal powder/splash sound
  playHoliSplash() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (_) {}
  }

  // Patriotic fanfare tone
  playPatrioticFanfare() {
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch (_) {}
  }

  // Birthday sparkle chime
  playBirthdayChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [587.33, 880, 1174.66]; // D5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.07;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch (_) {}
  }

  // Rain water drop sound
  playRainDrop() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (_) {}
  }

  // Standard clean click
  playDefaultClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(550, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (_) {}
  }
}

export const soundEngine = new SoundEngine();

/* =========================================================
   3. FLOATING PARTICLES (Direction & Multiplier Aware)
========================================================= */

export function ThemeParticles({ config, multiplier = 1.0 }) {
  if (!config || !config.enabled) return null;

  // Scales count by multiplier (pre: 0.5x, peak: 1.0x, post: 0.35x)
  const baseCount = config.count || 24;
  const count = Math.max(6, Math.round(baseCount * multiplier));
  const isFalling = config.direction === "down";

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i / count) * 96 + 2 + (Math.random() * 4 - 2)}%`,
      size: Math.floor(
        Math.random() * (config.maxSize - config.minSize + 1) + config.minSize
      ),
      duration: (Math.random() * 3 + (isFalling ? 3.5 : 7)).toFixed(2),
      delay: (Math.random() * 6).toFixed(2),
      color: config.colors[i % config.colors.length],
      glow: config.glow || "none",
      shape: config.shape || "circle",
    }));
  }, [config, count, isFalling]);

  return (
    <>
      <style>{`
        @keyframes floatAllTheWayUp {
          0% {
            transform: translateY(0) scale(0.7);
            opacity: 0;
          }
          8% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.35;
          }
          88% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(-108vh) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes rainDownwards {
          0% {
            transform: translateY(-10vh);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh);
            opacity: 0;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              display: "block",
              borderRadius: p.shape === "line" ? "2px" : "50%",
              left: p.left,
              top: isFalling ? "-20px" : "auto",
              bottom: isFalling ? "auto" : "-25px",
              width: p.shape === "line" ? "2px" : `${p.size}px`,
              height: p.shape === "line" ? `${p.size * 2.5}px` : `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: p.glow,
              filter: config.blur ? "blur(2px)" : "none",
              animation: `${isFalling ? "rainDownwards" : "floatAllTheWayUp"} ${p.duration}s linear infinite`,
              animationDelay: `-${p.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* =========================================================
   4. COMPLETE THEMES REGISTRY
========================================================= */

export const themes = {
  // ---------------- DEFAULT ----------------
  default: {
    name: "Default",
    bgGradient: "bg-gradient-to-br from-indigo-50 via-white to-cyan-50",
    headerTagBg: "bg-indigo-100",
    headerTagText: "text-indigo-600 hover:bg-indigo-200",
    headerTitleText: "text-indigo-500",
    phaseHeaderGradient: "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700",
    phaseBorder: "border-indigo-100",
    phaseShadow: "shadow-indigo-100/60",
    monthActiveBorder: "border-indigo-100 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-indigo-50 via-white to-cyan-50",
    monthIconBg: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white",
    monthProgressGradient: "bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600",
    progressValueText: "text-indigo-600",
    xpValueText: "text-violet-500",
    chevronColor: "text-indigo-400",
    missionHoverBorder: "hover:border-indigo-100 hover:bg-white",
    missionIconActive: "bg-white text-indigo-400 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-amber-400",
      greeting: "Build skill. Complete phases. Level up.",
    },
    particles: {
      enabled: false,
    },
    playSound: () => soundEngine.playDefaultClick(),
  },

  // ---------------- FESTIVALS ----------------
  diwali: {
    name: "Diwali",
    bgGradient: "bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50",
    headerTagBg: "bg-amber-100 border border-amber-200",
    headerTagText: "text-amber-700 hover:bg-amber-200",
    headerTitleText: "text-amber-600",
    phaseHeaderGradient: "bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600",
    phaseBorder: "border-amber-200",
    phaseShadow: "shadow-amber-200/50",
    monthActiveBorder: "border-amber-200 bg-amber-50/20",
    monthHeaderBg: "bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50",
    monthIconBg: "bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-white shadow-md shadow-amber-300/60",
    monthProgressGradient: "bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400",
    progressValueText: "text-amber-600",
    xpValueText: "text-amber-600",
    chevronColor: "text-amber-500",
    missionHoverBorder: "hover:border-amber-200 hover:bg-white",
    missionIconActive: "bg-white text-amber-500 shadow-sm",
    decorations: {
      showDiya: true,
      sparkleColor: "text-amber-500",
      greeting: "✨ Shubh Deepawali ✨",
    },
    particles: {
      enabled: true,
      direction: "up",
      count: 28,
      minSize: 8,
      maxSize: 15,
      blur: false,
      colors: ["#f59e0b", "#ea580c", "#eab308", "#d97706"],
      glow: "0 0 10px #f59e0b, 0 0 18px #fbbf24, 0 0 2px rgba(0, 0, 0, 0.25)",
    },
    playSound: () => soundEngine.playDiwaliPop(),
  },

  holi: {
    name: "Holi",
    bgGradient: "bg-gradient-to-br from-pink-50 via-purple-50/40 to-emerald-50",
    headerTagBg: "bg-pink-100 border border-pink-200",
    headerTagText: "text-pink-600 hover:bg-pink-200",
    headerTitleText: "text-pink-500",
    phaseHeaderGradient: "bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500",
    phaseBorder: "border-pink-200",
    phaseShadow: "shadow-pink-100/60",
    monthActiveBorder: "border-pink-100 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-pink-50 via-purple-50 to-cyan-50",
    monthIconBg: "bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 text-white",
    monthProgressGradient: "bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400",
    progressValueText: "text-pink-600",
    xpValueText: "text-purple-600",
    chevronColor: "text-pink-400",
    missionHoverBorder: "hover:border-pink-200 hover:bg-white",
    missionIconActive: "bg-white text-pink-500 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-pink-500",
      greeting: "🎨 Happy Holi 🎨",
    },
    particles: {
      enabled: true,
      direction: "up",
      count: 24,
      minSize: 14,
      maxSize: 26,
      blur: false,
      colors: [
        "rgba(225, 29, 72, 0.88)",
        "rgba(234, 88, 12, 0.88)",
        "rgba(13, 148, 136, 0.88)",
        "rgba(147, 51, 234, 0.88)",
        "rgba(22, 163, 74, 0.88)",
      ],
      glow: "0 0 12px rgba(0, 0, 0, 0.15)",
    },
    playSound: () => soundEngine.playHoliSplash(),
  },

  independence_day: {
    name: "Independence Day",
    bgGradient: "bg-gradient-to-br from-orange-50 via-white to-green-50",
    headerTagBg: "bg-orange-100 border border-orange-200",
    headerTagText: "text-orange-700 hover:bg-orange-200",
    headerTitleText: "text-orange-600",
    phaseHeaderGradient: "bg-gradient-to-r from-orange-500 via-slate-600 to-emerald-600",
    phaseBorder: "border-orange-200",
    phaseShadow: "shadow-orange-100/60",
    monthActiveBorder: "border-orange-200 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-orange-50 via-white to-emerald-50",
    monthIconBg: "bg-gradient-to-br from-orange-500 via-blue-800 to-emerald-600 text-white",
    monthProgressGradient: "bg-gradient-to-r from-orange-500 via-blue-600 to-emerald-500",
    progressValueText: "text-orange-600",
    xpValueText: "text-emerald-600",
    chevronColor: "text-orange-500",
    missionHoverBorder: "hover:border-emerald-200 hover:bg-white",
    missionIconActive: "bg-white text-orange-500 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-orange-500",
      greeting: "🇮🇳 Happy Independence Day 🇮🇳",
    },
    particles: {
      enabled: true,
      direction: "up",
      count: 24,
      minSize: 8,
      maxSize: 16,
      colors: ["#FF9933", "#FFFFFF", "#138808", "#000080"],
      glow: "0 0 10px rgba(255, 153, 51, 0.4)",
    },
    playSound: () => soundEngine.playPatrioticFanfare(),
  },

  republic_day: {
    name: "Republic Day",
    bgGradient: "bg-gradient-to-br from-blue-50 via-white to-orange-50",
    headerTagBg: "bg-blue-100 border border-blue-200",
    headerTagText: "text-blue-700 hover:bg-blue-200",
    headerTitleText: "text-blue-600",
    phaseHeaderGradient: "bg-gradient-to-r from-blue-700 via-indigo-700 to-orange-600",
    phaseBorder: "border-blue-200",
    phaseShadow: "shadow-blue-100/60",
    monthActiveBorder: "border-blue-200 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-blue-50 via-white to-orange-50",
    monthIconBg: "bg-gradient-to-br from-blue-700 via-blue-900 to-orange-500 text-white",
    monthProgressGradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500",
    progressValueText: "text-blue-700",
    xpValueText: "text-blue-800",
    chevronColor: "text-blue-500",
    missionHoverBorder: "hover:border-blue-200 hover:bg-white",
    missionIconActive: "bg-white text-blue-600 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-blue-600",
      greeting: "🇮🇳 Happy Republic Day 🇮🇳",
    },
    particles: {
      enabled: true,
      direction: "up",
      count: 24,
      minSize: 8,
      maxSize: 16,
      colors: ["#000080", "#FF9933", "#FFFFFF", "#138808"],
      glow: "0 0 10px rgba(0, 0, 128, 0.35)",
    },
    playSound: () => soundEngine.playPatrioticFanfare(),
  },

  birthday: {
    name: "Birthday",
    bgGradient: "bg-gradient-to-br from-fuchsia-50 via-pink-50 to-amber-50",
    headerTagBg: "bg-fuchsia-100 border border-fuchsia-200",
    headerTagText: "text-fuchsia-700 hover:bg-fuchsia-200",
    headerTitleText: "text-fuchsia-600",
    phaseHeaderGradient: "bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-500",
    phaseBorder: "border-fuchsia-200",
    phaseShadow: "shadow-fuchsia-100/60",
    monthActiveBorder: "border-fuchsia-200 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-fuchsia-50 via-pink-50 to-amber-50",
    monthIconBg: "bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white",
    monthProgressGradient: "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400",
    progressValueText: "text-fuchsia-600",
    xpValueText: "text-pink-600",
    chevronColor: "text-fuchsia-400",
    missionHoverBorder: "hover:border-fuchsia-200 hover:bg-white",
    missionIconActive: "bg-white text-fuchsia-500 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-pink-500",
      greeting: "🎂 Happy Birthday! Level up year ahead! 🎂",
    },
    particles: {
      enabled: true,
      direction: "up",
      count: 28,
      minSize: 10,
      maxSize: 20,
      colors: ["#ec4899", "#d946ef", "#f59e0b", "#06b6d4"],
      glow: "0 0 12px rgba(236, 72, 153, 0.4)",
    },
    playSound: () => soundEngine.playBirthdayChime(),
  },

  // ---------------- SEASONS ----------------
  summer: {
    name: "Summer",
    bgGradient: "bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-yellow-50/70",
    headerTagBg: "bg-amber-100",
    headerTagText: "text-amber-800",
    headerTitleText: "text-amber-600",
    phaseHeaderGradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500",
    phaseBorder: "border-amber-100",
    phaseShadow: "shadow-amber-100/60",
    monthActiveBorder: "border-amber-100 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-amber-50 via-white to-yellow-50",
    monthIconBg: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    monthProgressGradient: "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500",
    progressValueText: "text-amber-700",
    xpValueText: "text-orange-600",
    chevronColor: "text-amber-400",
    missionHoverBorder: "hover:border-amber-100 hover:bg-white",
    missionIconActive: "bg-white text-amber-500 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-amber-400",
      greeting: "☀️ High Energy & Steady Focus ☀️",
    },
    particles: {
      enabled: true,
      direction: "up",
      count: 20,
      minSize: 6,
      maxSize: 14,
      blur: true,
      colors: ["#fef08a", "#fed7aa", "#fde047"],
      glow: "0 0 12px rgba(254, 240, 138, 0.6)",
    },
    playSound: () => soundEngine.playDefaultClick(),
  },

  rainy: {
    name: "Monsoon",
    bgGradient: "bg-gradient-to-br from-sky-50 via-slate-50 to-teal-50",
    headerTagBg: "bg-sky-100",
    headerTagText: "text-sky-700",
    headerTitleText: "text-sky-600",
    phaseHeaderGradient: "bg-gradient-to-br from-sky-600 via-teal-600 to-cyan-700",
    phaseBorder: "border-sky-100",
    phaseShadow: "shadow-sky-100/60",
    monthActiveBorder: "border-sky-100 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-sky-50 via-white to-teal-50",
    monthIconBg: "bg-gradient-to-br from-sky-500 to-teal-600 text-white",
    monthProgressGradient: "bg-gradient-to-r from-sky-400 via-teal-500 to-cyan-500",
    progressValueText: "text-sky-600",
    xpValueText: "text-teal-600",
    chevronColor: "text-sky-400",
    missionHoverBorder: "hover:border-sky-100 hover:bg-white",
    missionIconActive: "bg-white text-sky-500 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-sky-400",
      greeting: "🌧️ Deep Focus & Flow State 🌧️",
    },
    particles: {
      enabled: true,
      direction: "down",
      shape: "line",
      count: 36,
      minSize: 3,
      maxSize: 6,
      blur: false,
      colors: ["rgba(56, 189, 248, 0.75)", "rgba(45, 212, 191, 0.7)"],
      glow: "none",
    },
    playSound: () => soundEngine.playRainDrop(),
  },

  winter: {
    name: "Winter",
    bgGradient: "bg-gradient-to-br from-slate-50 via-indigo-50/30 to-sky-50",
    headerTagBg: "bg-slate-100",
    headerTagText: "text-slate-700",
    headerTitleText: "text-slate-600",
    phaseHeaderGradient: "bg-gradient-to-br from-slate-700 via-indigo-800 to-slate-900",
    phaseBorder: "border-slate-200",
    phaseShadow: "shadow-slate-200/50",
    monthActiveBorder: "border-slate-200 bg-white",
    monthHeaderBg: "bg-gradient-to-r from-slate-50 via-indigo-50/20 to-sky-50",
    monthIconBg: "bg-gradient-to-br from-slate-600 to-indigo-700 text-white",
    monthProgressGradient: "bg-gradient-to-r from-slate-400 via-indigo-500 to-sky-400",
    progressValueText: "text-slate-700",
    xpValueText: "text-indigo-600",
    chevronColor: "text-slate-400",
    missionHoverBorder: "hover:border-slate-200 hover:bg-white",
    missionIconActive: "bg-white text-slate-500 shadow-sm",
    decorations: {
      showDiya: false,
      sparkleColor: "text-indigo-300",
      greeting: "❄️ Calm, Clear, and Disciplined ❄️",
    },
    particles: {
      enabled: true,
      direction: "down",
      count: 24,
      minSize: 6,
      maxSize: 12,
      blur: true,
      colors: ["rgba(255, 255, 255, 0.95)", "rgba(224, 242, 254, 0.9)"],
      glow: "0 0 8px rgba(255, 255, 255, 0.8)",
    },
    playSound: () => soundEngine.playDefaultClick(),
  },
};