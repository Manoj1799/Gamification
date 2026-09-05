import {
  TrendingUp,
  Target,
  CalendarDays,
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Map,
} from "lucide-react";

import { trading } from "../data/trading";
import { useTrading } from "../hooks/useTrading";


/* =========================================================
   TRADING PAGE
========================================================= */

function Trading({ setActivePage }) {

  const {
    currentLevelXP,
    months,
    currentXP,
    currentLevel,
    nextLevelTotalXP,
    xpProgress,
    xpRequiredForNextLevel,
    phaseProgress,
    expandedMonths,
    isLoading,
    daysRemaining,
    calculateMonthProgress,
    calculateMonthXP,
    toggleMonth,
    toggleMission,

  } = useTrading();


  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (isLoading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">

        <div className="flex flex-col items-center gap-3">

          <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">

            <TrendingUp size={24} />

          </div>

          <p className="font-bold text-slate-500">
            Loading your journey...
          </p>

        </div>

      </div>
    );

  }


  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900">

      <main className="mx-auto max-w-md px-4 pb-10 pt-6">


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mb-5">
          <div className="flex items-center justify-between">

            {/* Left: Trading title */}
            <div className="flex items-center gap-2">
              <button
                // Business purpose:
                // Clicking the Trading icon opens the detailed Trading Skill Journey page.
                // App.jsx remains responsible for controlling which page is currently visible.
                onClick={() => setActivePage("journeyMap")}
                className="rounded-xl bg-indigo-100 p-2 text-indigo-600 transition hover:bg-indigo-200 active:scale-95" >
                <Map size={16} />
              </button>

              <p className="text-sm font-black uppercase tracking-wider text-indigo-500">
                Trading
              </p>
            </div>

            {/* Right: Total XP circle */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-[2px] shadow-lg shadow-orange-200">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[8px] font-black uppercase leading-none tracking-wide text-slate-400">
                  Total XP
                </span>

                <span className="mt-1 text-sm font-black leading-none text-slate-800">
                  {currentXP.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          <div className="mt-2 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Skill Journey
              </h1>

              <p className="mt-1 text-sm font-semibold text-slate-400">
                Build skill. Complete phases. Level up.
              </p>
            </div>
          </div>
        </header>


        {/* ==================================================
            SKILL XP
        ================================================== */}

        {/* ==================================================
    SKILL XP
================================================== */}

        <section
          className={`relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br ${currentLevel.theme} px-5 py-4 text-white shadow-lg`}
        >

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-4">

              {/* LEVEL */}

              <div>

                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                  Skill Level
                </p>

                <p className="text-4xl font-black leading-none">
                  {currentLevel.level}
                </p>

                <p className="mt-1 text-xs font-black uppercase tracking-wider text-white/70">
                  {currentLevel.name}
                </p>

              </div>

              <div className="h-10 w-px bg-white/20" />

              {/* XP */}

              <div>

                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                  Skill XP
                </p>

                <p className="text-lg font-black">
                  {currentLevelXP.toLocaleString()}
                  {" / "}
                  {xpRequiredForNextLevel.toLocaleString()}
                </p>

              </div>

            </div>

            <button
              onClick={() => setActivePage("tradingLevelLadder")}
              className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm hover:bg-white/25 active:scale-95"
            >
              <TrendingUp size={22} />
            </button>

          </div>

          {/* XP BAR */}

          <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-black/20">

            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-white transition-all duration-700"
              style={{
                width: `${xpProgress}%`,
              }}
            />

          </div>

        </section>


        {/* ==================================================
            CURRENT PHASE
        ================================================== */}

        <section className="mb-6 overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-xl shadow-indigo-100/60">


          {/* PHASE HEADER */}

          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 text-white">

            <div className="flex items-start justify-between">

              <div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">

                  <Target size={12} />

                  Current Phase

                </div>


                <h2 className="text-3xl font-black">
                  Phase {trading.phase.number}
                </h2>


                <p className="mt-1 font-bold text-indigo-200">
                  {trading.phase.name}
                </p>

              </div>


              <button
                onClick={() => setActivePage("phaseHistory")}
                className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm  hover:bg-indigo-200 active:scale-95"
              >
                <Target size={23} />
              </button>
            </div>


            {/* PHASE PROGRESS */}

            <div className="mt-4">

              <div className="mb-2 flex justify-between text-[10px] font-black">

                <span className="text-indigo-200">
                  PHASE COMPLETION
                </span>

                <span>
                  {phaseProgress}%
                </span>

              </div>


              <div className="h-2 overflow-hidden rounded-full bg-black/20">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${phaseProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* PHASE DETAILS */}

          <div className="p-5">


            {/* ==================================================
                PHASE AIM
            ================================================== */}

            <div className="mb-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4">

              <div className="mb-2 flex items-center gap-2">

                <div className="rounded-lg bg-amber-100 p-1.5 text-amber-600">

                  <Target size={14} />

                </div>


                <p className="text-xs font-black uppercase tracking-wide text-amber-600">
                  Phase Aim
                </p>

              </div>


              <p className="font-semibold leading-relaxed text-slate-700">
                {trading.phase.aim}
              </p>

            </div>


            {/* ==================================================
                DATES
            ================================================== */}

            <div className="mb-5 grid grid-cols-2 gap-3">

              {/* START */}

              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3.5">

                <div className="mb-1 flex items-center gap-2 text-sky-500">

                  <CalendarDays size={15} />

                  <span className="text-[10px] font-black uppercase">
                    Start
                  </span>

                </div>


                <p className="text-sm font-black text-slate-800">
                  {trading.phase.startDate}
                </p>

              </div>


              {/* REMAINING */}

              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3.5">

                <div className="mb-1 flex items-center gap-2 text-rose-500">

                  <Clock size={15} />

                  <span className="text-[10px] font-black uppercase">
                    Remaining
                  </span>

                </div>


                <p className="text-sm font-black text-slate-800">
                  {daysRemaining} days
                </p>

              </div>

            </div>



            {/* ==================================================
                MONTHLY JOURNEY
            ================================================== */}

            <div>

              <div className="mb-3">

                <div className="flex items-center gap-2">

                  <h3 className="text-xl font-black">
                    Monthly Journey
                  </h3>

                  <Sparkles
                    size={16}
                    className="text-amber-400"
                  />

                </div>


                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Complete each month to unlock the next
                </p>

              </div>


              <div className="space-y-3">

                {months.map(
                  (month) => {

                    const progress =
                      calculateMonthProgress(
                        month.missions
                      );


                    const monthXP =
                      calculateMonthXP(
                        month.missions
                      );


                    const completed =
                      month.missions.filter(
                        (mission) =>
                          mission.done
                      ).length;


                    const isExpanded =
                      expandedMonths[
                      month.id
                      ];


                    return (
                      <section
                        key={month.id}
                        className={`overflow-hidden rounded-2xl border transition-all duration-300 ${month.unlocked
                            ? "border-indigo-100 bg-white"
                            : "border-slate-200 bg-slate-100/80"
                          }`}
                      >


                        {/* MONTH HEADER */}

                        <button
                          type="button"
                          disabled={
                            !month.unlocked
                          }
                          onClick={() =>
                            toggleMonth(
                              month.id
                            )
                          }
                          className={`w-full text-left ${month.unlocked
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                            }`}
                        >

                          <div
                            className={`p-4 ${month.unlocked
                                ? "bg-gradient-to-r from-indigo-50 via-white to-cyan-50"
                                : "bg-slate-100"
                              }`}
                          >

                            <div className="flex items-center justify-between">

                              <div className="flex items-center gap-3">

                                {/* MONTH ICON */}

                                <div
                                  className={`rounded-xl p-2.5 ${month.unlocked
                                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                                      : "bg-slate-200 text-slate-400"
                                    }`}
                                >

                                  {month.unlocked ? (
                                    <CalendarDays
                                      size={19}
                                    />
                                  ) : (
                                    <Lock
                                      size={19}
                                    />
                                  )}

                                </div>


                                {/* MONTH NAME */}

                                <div>

                                  <div className="flex items-center gap-2">

                                    <h4 className="text-xl font-black">
                                      {month.name}
                                    </h4>


                                    {month.unlocked && (
                                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600">
                                        Unlocked
                                      </span>
                                    )}

                                  </div>


                                  <p className="text-[11px] font-bold text-slate-400">

                                    {month.unlocked
                                      ? `${completed} / ${month.missions.length} missions`
                                      : "Complete previous month to unlock"}

                                  </p>

                                </div>

                              </div>


                              {/* PROGRESS */}

                              <div className="flex items-center gap-2">

                                <div className="text-right">

                                  <p
                                    className={`text-xl font-black ${month.unlocked
                                        ? "text-indigo-600"
                                        : "text-slate-400"
                                      }`}
                                  >
                                    {progress}%
                                  </p>


                                  {month.unlocked && (
                                    <p className="text-[9px] font-black text-violet-500">
                                      +{monthXP} XP
                                    </p>
                                  )}

                                </div>


                                {month.unlocked && (
                                  <ChevronDown
                                    size={18}
                                    className={`text-indigo-400 transition-transform duration-300 ${isExpanded
                                        ? "rotate-180"
                                        : ""
                                      }`}
                                  />
                                )}

                              </div>

                            </div>


                            {/* MONTH PROGRESS BAR */}

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">

                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 transition-all duration-700"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>

                          </div>

                        </button>


                        {/* ==================================================
                            MISSIONS
                        ================================================== */}

                        {month.unlocked &&
                          isExpanded && (

                            <div className="space-y-2 border-t border-indigo-50 p-3">

                              {month.missions.map(
                                (mission) => (

                                  <button
                                    key={mission.id}
                                    onClick={() =>
                                      toggleMission(
                                        month.id,
                                        mission.id
                                      )
                                    }
                                    className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 hover:shadow-md ${mission.done
                                        ? "border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50"
                                        : "border-slate-100 bg-slate-50 hover:border-indigo-100 hover:bg-white"
                                      }`}
                                  >

                                    {/* STATUS */}

                                    <div
                                      className={`rounded-full p-2 ${mission.done
                                          ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
                                          : "bg-white text-indigo-400 shadow-sm"
                                        }`}
                                    >

                                      {mission.done ? (
                                        <Check
                                          size={15}
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={15}
                                        />
                                      )}

                                    </div>


                                    {/* MISSION */}

                                    <div className="flex-1">

                                      {/* Mission title */}
                                      <p
                                        className={`text-sm font-bold ${mission.done
                                          ? "text-slate-400 line-through"
                                          : "text-slate-800"
                                          }`}
                                      >
                                        {mission.title}
                                      </p>





                                      {/* Mission XP */}
                                      <div className="mt-1 flex items-center gap-1">

                                        <Zap
                                          size={11}
                                          className={
                                            mission.done
                                              ? "text-emerald-500"
                                              : "text-violet-500"
                                          }
                                        />

                                        <p
                                          className={`text-[11px] font-black ${mission.done
                                            ? "text-emerald-500"
                                            : "text-violet-500"
                                            }`}
                                        >
                                          +{mission.xp} XP
                                        </p>

                                      </div>

                                    </div>


                                    {!mission.done && (
                                      <ChevronRight
                                        size={16}
                                        className="text-slate-300 transition-transform group-hover:translate-x-1"
                                      />
                                    )}

                                  </button>

                                )
                              )}

                            </div>

                          )}

                      </section>
                    );

                  }
                )}

              </div>

            </div>

          </div>

        </section>



        {/* ==================================================
            NEXT PHASE
        ================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-sm">

          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 opacity-70" />


          <div className="relative p-6">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-slate-200 p-3.5 text-slate-400">

                <Lock size={25} />

              </div>


              <div className="flex-1">

                <div className="mb-1 flex items-center gap-2">

                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Next Phase
                  </span>


                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">
                    Locked
                  </span>

                </div>


                <h2 className="text-2xl font-black text-slate-400">
                  Phase {trading.phase.number + 1}
                </h2>


                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Complete Phase {trading.phase.number} to unlock
                </p>

              </div>

            </div>


            <div className="mt-5 rounded-xl border border-slate-200 bg-white/70 p-3 text-center">

              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Journey continues
              </p>

            </div>

          </div>

        </section>


      </main>

    </div>
  );

}


export default Trading;