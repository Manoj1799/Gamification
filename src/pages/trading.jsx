
import { useEffect, useState } from "react";

import { trading } from "../data/trading";

import {
  calculateDaysRemaining,
  calculateQuestProgress,
} from "../logic/trading";

import { calculateLevel } from "../logic/xp";

import {
  loadTradingRecord,
  saveCurrentTradingRecord,
} from "../services/tradingService";

import {
  TrendingUp,
  Target,
  CalendarDays,
  Clock,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

function Trading() {
  const [questList, setQuestList] = useState([]);
  const [baseXP, setBaseXP] = useState(trading.skill.currentXP);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrading() {
      const record = await loadTradingRecord();

      setQuestList(record.quests);
      setBaseXP(record.currentXP);

      setIsLoading(false);
    }

    loadTrading();
  }, []);

  const daysRemaining = calculateDaysRemaining(
    trading.phase.endDate
  );

  const phaseProgress =
    questList.length > 0
      ? calculateQuestProgress(questList)
      : 0;

  const earnedQuestXP = questList
    .filter((quest) => quest.done)
    .reduce(
      (total, quest) => total + quest.xp,
      0
    );

  const currentXP = baseXP + earnedQuestXP;

  const currentLevel = calculateLevel(currentXP);

  const xpProgress = Math.min(
    100,
    Math.round(
      (currentXP / trading.skill.nextLevelXP) * 100
    )
  );

  const toggleQuest = async (id) => {
    const quest = questList.find(
      (quest) => quest.id === id
    );

    if (!quest) return;

    const updatedQuests = questList.map((quest) =>
      quest.id === id
        ? { ...quest, done: !quest.done }
        : quest
    );

    const newEarnedXP = updatedQuests
      .filter((quest) => quest.done)
      .reduce(
        (total, quest) => total + quest.xp,
        0
      );

    const newCurrentXP = baseXP + newEarnedXP;

    setQuestList(updatedQuests);

    await saveCurrentTradingRecord(
      updatedQuests,
      baseXP
    );
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900">

      <main className="mx-auto max-w-md px-4 pb-10 pt-6">

        {/* Header */}
        <header className="mb-6">

          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
              <TrendingUp size={16} />
            </div>

            <p className="text-sm font-black uppercase tracking-wider text-indigo-500">
              Trading
            </p>
          </div>

          <div className="flex items-end justify-between">

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Skill Journey
              </h1>

              <p className="mt-1 text-sm font-semibold text-slate-400">
                Build skill. Complete phases. Level up.
              </p>
            </div>

            <Sparkles
              size={24}
              className="mb-1 text-amber-400"
            />

          </div>

        </header>


        {/* Skill Level */}
        <section className="relative mb-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200">

          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-cyan-400/10" />

          <div className="relative">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-widest text-indigo-200">
                  Skill Level
                </p>

                <p className="text-6xl font-black tracking-tight">
                  {currentLevel}
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <TrendingUp size={30} />
              </div>

            </div>

            <div className="mb-2 flex justify-between text-xs font-black">
              <span className="text-indigo-200">
                SKILL XP
              </span>

              <span>
                {currentXP.toLocaleString()} /{" "}
                {trading.skill.nextLevelXP.toLocaleString()} XP
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-black/20">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-white transition-all duration-700"
                style={{
                  width: `${xpProgress}%`,
                }}
              />

            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-100">
              <Zap size={14} />
              Keep completing quests to level up
            </div>

          </div>

        </section>


        {/* Current Phase */}
        <section className="mb-5 overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-lg shadow-indigo-100/60">

          {/* Phase header */}
          <div className="bg-gradient-to-r from-cyan-50 via-indigo-50 to-violet-50 p-5">

            <div className="flex items-start justify-between">

              <div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-600">
                  <Target size={13} />
                  CURRENT PHASE
                </div>

                <h2 className="text-3xl font-black">
                  Phase {trading.phase.number}
                </h2>

                <p className="mt-1 font-bold text-indigo-500">
                  {trading.phase.name}
                </p>

              </div>

              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-3 text-white shadow-lg shadow-indigo-200">
                <Target size={22} />
              </div>

            </div>

          </div>


          <div className="p-5">

            {/* Phase Aim */}
            <div className="mb-5 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4">

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


            {/* Dates */}
            <div className="mb-5 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">

                <div className="mb-2 flex items-center gap-2 text-sky-500">

                  <CalendarDays size={16} />

                  <span className="text-xs font-black uppercase">
                    Start
                  </span>

                </div>

                <p className="font-black text-slate-800">
                  {trading.phase.startDate}
                </p>

              </div>


              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">

                <div className="mb-2 flex items-center gap-2 text-rose-500">

                  <Clock size={16} />

                  <span className="text-xs font-black uppercase">
                    Remaining
                  </span>

                </div>

                <p className="font-black text-slate-800">
                  {daysRemaining} days
                </p>

              </div>

            </div>


            {/* Phase Completion */}
            <div>

              <div className="mb-2 flex justify-between text-xs font-black">

                <span className="text-slate-500">
                  PHASE COMPLETION
                </span>

                <span className="text-indigo-600">
                  {phaseProgress}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 transition-all duration-700"
                  style={{
                    width: `${phaseProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </section>


        {/* Phase Quests */}
        <section>

          <div className="mb-4 flex items-end justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-black">
                  Phase Quests
                </h2>

                <Sparkles
                  size={17}
                  className="text-amber-400"
                />

              </div>

              <p className="mt-1 text-xs font-semibold text-slate-400">
                Complete quests to increase your trading skill
              </p>

            </div>

            <div className="rounded-xl bg-indigo-100 px-3 py-2 text-sm font-black text-indigo-600">
              {questList.filter((quest) => quest.done).length}
              {" / "}
              {questList.length}
            </div>

          </div>


          <div className="space-y-3">

            {questList.map((quest) => (

              <button
                key={quest.id}
                onClick={() => toggleQuest(quest.id)}
                className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  quest.done
                    ? "border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50"
                    : "border-slate-100 bg-white hover:border-indigo-100"
                }`}
              >

                <div
                  className={`rounded-full p-2.5 transition-all duration-300 ${
                    quest.done
                      ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-200"
                      : "bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100"
                  }`}
                >

                  {quest.done ? (
                    <Check size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}

                </div>


                <div className="flex-1">

                  <p
                    className={`font-bold transition-all duration-300 ${
                      quest.done
                        ? "text-slate-400 line-through"
                        : "text-slate-800"
                    }`}
                  >
                    {quest.title}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">

                    <Zap
                      size={12}
                      className={
                        quest.done
                          ? "text-emerald-500"
                          : "text-violet-500"
                      }
                    />

                    <p
                      className={`text-xs font-black ${
                        quest.done
                          ? "text-emerald-500"
                          : "text-violet-500"
                      }`}
                    >
                      +{quest.xp} XP
                    </p>

                  </div>

                </div>


                {!quest.done && (
                  <ChevronRight
                    size={18}
                    className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400"
                  />
                )}

              </button>

            ))}

          </div>

        </section>

      </main>
    </div>
  );
}

export default Trading;

