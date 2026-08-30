
import { player } from "../data/player";
import { dashboard } from "../data/dashboard";

import {
  calculateXPProgress,
  calculateLevel,
  getLevelXP,
} from "../logic/xp";

import { getCompletedQuestCount } from "../logic/quests";
import { calculateDailyScore } from "../logic/score";

import { useDashboard } from "../hooks/useDashboard";

import {
  Flame,
  Trophy,
  Target,
  Dumbbell,
  Brain,
  TrendingUp,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

const questIcons = {
  dumbbell: Dumbbell,
  brain: Brain,
  trendingUp: TrendingUp,
};

function Dashboard() {
  const {
    questList,
    currentXP,
    dailyXP,
    isLoading,
    toggleQuest,
  } = useDashboard();

  const completedQuests =
    getCompletedQuestCount(questList);

  const dailyScore =
    calculateDailyScore(questList);

  const currentLevel =
    calculateLevel(currentXP);

  const nextLevelXP =
    getLevelXP(currentLevel);

  const xpProgress =
    calculateXPProgress(currentXP);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="flex flex-col items-center gap-3">

          <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">
            <Sparkles size={24} />
          </div>

          <p className="font-bold text-slate-500">
            Loading your day...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900">

      <main className="mx-auto max-w-md px-4 pb-24 pt-6">

        {/* Header */}
        <header className="mb-6">

          <div className="mb-2 flex items-center gap-2">

            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
              <Sparkles size={16} />
            </div>

            <p className="text-sm font-black uppercase tracking-wider text-indigo-500">
              {dashboard.greet}
            </p>

          </div>

          <div className="flex items-end justify-between">

            <div>

              <h1 className="text-3xl font-black tracking-tight">
                {player.name} 👋
              </h1>

              <p className="mt-1 text-sm font-semibold text-slate-400">
                Make today count.
              </p>

            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 text-white shadow-lg shadow-orange-200">
              <Trophy size={22} />
            </div>

          </div>

        </header>


        {/* Player Card */}
        <section className="relative mb-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200">

          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-cyan-400/10" />

          <div className="relative">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="mb-1 text-xs font-black uppercase tracking-widest text-indigo-200">
                  Your Level
                </p>

                <p className="text-6xl font-black tracking-tight">
                  {currentLevel}
                </p>

              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">

                <Flame
                  size={21}
                  className="text-orange-300"
                />

                <span className="text-xl font-black">
                  {player.streak}
                </span>

                <span className="text-xs font-bold text-indigo-100">
                  day streak
                </span>

              </div>

            </div>


            <div className="mb-2 flex justify-between text-xs font-black">

              <span className="text-indigo-200">
                XP PROGRESS
              </span>

              <span>
                {currentXP.toLocaleString()} /{" "}
                {nextLevelXP.toLocaleString()}
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

              <span>
                {dailyXP > 0
                  ? `+${dailyXP} XP earned today`
                  : "Complete quests to earn XP"}
              </span>

            </div>

          </div>

        </section>


        {/* Today's Quests */}
        <section className="mb-5">

          <div className="mb-4 flex items-end justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-black">
                  Today's Quests
                </h2>

                <Sparkles
                  size={17}
                  className="text-amber-400"
                />

              </div>

              <p className="mt-1 text-xs font-semibold text-slate-400">
                Small wins build big progress.
              </p>

            </div>

            <div className="rounded-xl bg-indigo-100 px-3 py-2 text-sm font-black text-indigo-600">
              {completedQuests} / {questList.length}
            </div>

          </div>


          <div className="space-y-3">

            {questList.map((quest) => {

              const Icon =
                questIcons[quest.icon];

              return (

                <button
                  key={quest.id}
                  onClick={() =>
                    toggleQuest(quest.id)
                  }
                  className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    quest.done
                      ? "border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50"
                      : "border-slate-100 bg-white hover:border-indigo-100"
                  }`}
                >

                  <div
                    className={`rounded-xl p-3 transition-all duration-300 ${
                      quest.done
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-200"
                        : "bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100"
                    }`}
                  >

                    <Icon size={20} />

                  </div>


                  <div className="min-w-0 flex-1">

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


                  {quest.done ? (

                    <div className="rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 text-white shadow-md">
                      <Check size={16} />
                    </div>

                  ) : (

                    <ChevronRight
                      size={19}
                      className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400"
                    />

                  )}

                </button>

              );

            })}

          </div>

        </section>


        {/* Daily Score */}
        <section className="relative mb-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-6 text-white shadow-xl shadow-indigo-100">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/20" />

          <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-cyan-400/10" />

          <div className="relative">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-white/10 p-3">
                  <Target size={22} />
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Today's Progress
                  </p>

                  <p className="mt-1 text-4xl font-black">
                    {dailyScore}%
                  </p>

                </div>

              </div>


              <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-black text-indigo-200">
                {completedQuests === questList.length &&
                questList.length > 0
                  ? "COMPLETE"
                  : "IN PROGRESS"}
              </div>

            </div>


            <div className="h-3 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-indigo-300 to-white transition-all duration-700"
                style={{
                  width: `${dailyScore}%`,
                }}
              />

            </div>


            <p className="mt-3 text-xs font-semibold text-slate-400">
              {completedQuests === questList.length &&
              questList.length > 0
                ? "You completed everything for today. 🔥"
                : "Keep going — every completed quest moves the score."}
            </p>

          </div>

        </section>


        {/* Bottom Navigation */}
       

      </main>

    </div>
  );
}

export default Dashboard;

