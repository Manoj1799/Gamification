
import React from "react";

import {
  Sprout,
  Footprints,
  ChartCandlestick,
  Crosshair,
  Search,
  ShieldCheck,
  ScanSearch,
  Blocks,
  Swords,
  Settings2,
  BriefcaseBusiness,
  Rocket,
  GraduationCap,
  Crown,
  Brain,
  Trophy,
  Lock,
  Check,
  Zap,
  Star,
  ChevronRight,
} from "lucide-react";

import { tradingLevels } from "../data/trading";
import useTradingLevelLadder
  from "../hooks/useTradingLevelLadder";

/* =========================================================
   LEVEL ICONS
========================================================= */

// Each Trading level gets its own icon.
// The icons intentionally become more prestigious as
// the player progresses through the ladder.
const levelIcons = [
  Sprout,
  Footprints,
  ChartCandlestick,
  Crosshair,
  Search,
  ShieldCheck,
  ScanSearch,
  Blocks,
  Swords,
  Settings2,
  BriefcaseBusiness,
  Rocket,
  GraduationCap,
  Crown,
  Brain,
  Trophy,
];

/* =========================================================
   LEVEL LADDER PAGE
========================================================= */

export default function TradingLevelLadder() {

  /* ---------------------------------------------------------
     LOAD LEVEL DATA
  --------------------------------------------------------- */

  const {
    currentXP,
    currentLevel,
    currentLevelIndex,
    nextLevel,
    xpToNextLevel,
    xpProgress,
    isLoading,
  } = useTradingLevelLadder(
    tradingLevels
  );

  /* ---------------------------------------------------------
     LOADING SCREEN
  --------------------------------------------------------- */

  if (isLoading) {

    return (
      <div className="min-h-screen bg-slate-50 px-4 pb-24 pt-6">

        <div className="mx-auto max-w-md">

          <div className="animate-pulse space-y-4">

            <div className="h-48 rounded-3xl bg-slate-200" />

            <div className="h-24 rounded-2xl bg-slate-200" />

            <div className="h-24 rounded-2xl bg-slate-200" />

            <div className="h-24 rounded-2xl bg-slate-200" />

          </div>

        </div>

      </div>
    );

  }

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 px-4 pb-28 pt-5">

      <div className="mx-auto w-full max-w-md">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-5">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">
            Trading Journey
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Level Ladder
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Climb from beginner to Market Master.
          </p>

        </div>

        {/* ==================================================
            CURRENT LEVEL HERO
        ================================================== */}

        <div
          className={`relative mb - 6 overflow - hidden rounded - 3xl bg - gradient - to - br ${ currentLevel.theme } p - 5 text - white shadow - xl`}
        >

          {/* Decorative glow */}

          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur">
                    Current Level
                  </span>

                  <Star
                    size={15}
                    fill="currentColor"
                  />

                </div>

                <div className="mt-3 text-5xl font-black">
                  {currentLevel.level}
                </div>

                <h2 className="mt-1 text-xl font-black">
                  {currentLevel.name}
                </h2>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur">
                {React.createElement(
                  levelIcons[currentLevelIndex],
                  {
                    size: 34,
                    strokeWidth: 2.2,
                  }
                )}
              </div>

            </div>

            {/* XP */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-xs font-bold">

                <span>
                  {currentXP.toLocaleString()} XP
                </span>

                {nextLevel ? (
                  <span>
                    {nextLevel.xpRequired.toLocaleString()} XP
                  </span>
                ) : (
                  <span>MAX LEVEL</span>
                )}

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-black/20">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${ xpProgress }% `,
                  }}
                />

              </div>

              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-white/80">

                <Zap size={13} fill="currentColor" />

                {nextLevel
                  ? `${ xpToNextLevel.toLocaleString() } XP to ${ nextLevel.name } `
                  : "You have reached the final level!"}

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            LADDER
        ================================================== */}

        <div className="mb-5">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-lg font-black text-slate-900">
              Trading Levels
            </h2>

            <span className="text-xs font-bold text-slate-400">
              {currentLevelIndex + 1}/{tradingLevels.length}
            </span>

          </div>

          <div className="relative">

            {/* Vertical connection line */}

            <div className="absolute bottom-8 left-8 top-8 w-1 rounded-full bg-slate-200" />

            <div className="relative space-y-3">

      
              {tradingLevels.map(
                (level, index) => {

                  const Icon =
                    levelIcons[index];

                  const isCompleted =
                    index < currentLevelIndex;

                  const isCurrent =
                    index === currentLevelIndex;

                  const isLocked =
                    index > currentLevelIndex;

                  return (

                    <div
                      key={level.level}
                      className={`relative flex items-center gap-4 overflow-hidden rounded-3xl border p-4 transition-all duration-300 ${isCurrent
                          ? `border-transparent bg-gradient-to-br ${level.theme} text-white shadow-xl`
                          : isCompleted
                            ? `border-transparent bg-gradient-to-br ${level.theme} text-white shadow-md`
                            : "border-slate-100 bg-slate-50/90"
                        }`}
                    >

                      {/* ==================================================
            LARGE LEVEL ICON
        ================================================== */}

                      <div
                        className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg ${isLocked
                            ? "bg-slate-300 text-slate-500"
                            : "bg-white/20 text-white backdrop-blur"
                          } ${isCurrent
                            ? "ring-4 ring-white/30"
                            : ""
                          }`}
                      >

                        {isLocked ? (
                          <Lock
                            size={26}
                            strokeWidth={2.2}
                          />
                        ) : (
                          <Icon
                            size={32}
                            strokeWidth={2.1}
                          />
                        )}

                      </div>


                      {/* ==================================================
            LEVEL INFORMATION
        ================================================== */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">

                          <span
                            className={`text-[10px] font-black uppercase tracking-wider ${isLocked
                                ? "text-slate-400"
                                : "text-white/70"
                              }`}
                          >
                            Level {level.level}
                          </span>

                          {isCurrent && (
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white backdrop-blur">
                              Current
                            </span>
                          )}

                          {isCompleted && (
                            <Check
                              size={15}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}

                        </div>

                        <h3
                          className={`mt-1 text-base font-black ${isLocked
                              ? "text-slate-500"
                              : "text-white"
                            }`}
                        >
                          {level.name}
                        </h3>

                        <p
                          className={`mt-1 text-xs font-semibold ${isLocked
                              ? "text-slate-400"
                              : "text-white/70"
                            }`}
                        >
                          {level.xpRequired.toLocaleString()} XP required
                        </p>

                      </div>


                      {/* ==================================================
            ARROW
        ================================================== */}

                      <ChevronRight
                        size={20}
                        className={
                          isLocked
                            ? "text-slate-300"
                            : "text-white/70"
                        }
                      />

                    </div>

                  );

                }
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            FINAL MOTIVATION
        ================================================== */}

        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">

            <Trophy
              size={25}
              strokeWidth={2.2}
            />

          </div>

          <h3 className="mt-3 font-black text-slate-900">
            The Market Master awaits.
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Every mission completed moves you one step
            closer to mastering your trading system.
          </p>

        </div>

      </div>

    </div>
  );
}

