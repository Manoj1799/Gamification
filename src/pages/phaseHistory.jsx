import React from "react";
import { completedPhases } from "../data/trading"; // update path to your data file

function PhaseHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 text-xl">
            📈
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-indigo-500">
              Trading Progression
            </p>
            <h1 className="text-2xl font-black text-slate-900">
              Completed Phases
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="space-y-4">
        {completedPhases.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
              ⏳
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-800">
              No Completed Phases Yet
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              Phases will show up here once you conclude their duration and complete the core objectives.
            </p>
          </div>
        ) : (
          /* Populated State */
          <div className="grid gap-4 sm:grid-cols-2">
            {completedPhases.map((phase) => (
              <article
                key={phase.number}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-indigo-600">
                    Phase {phase.number}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                </div>

                {/* Phase Info */}
                <div className="mt-4">
                  <h3 className="text-lg font-black text-slate-900">
                    {phase.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {phase.aim}
                  </p>
                </div>

                {/* Metrics / Timeline Footer */}
                <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-3">
                  <div>
                    <span className="block font-medium text-slate-400">Started</span>
                    <span className="font-semibold text-slate-700">{phase.startDate}</span>
                  </div>

                  <div>
                    <span className="block font-medium text-slate-400">Completed</span>
                    <span className="font-semibold text-emerald-700">{phase.completedDate}</span>
                  </div>

                  <div>
                    <span className="block font-medium text-slate-400">Experience Collected</span>
                    <span className="font-bold text-indigo-600">
                      {phase.experience_collected ?? 0} 
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PhaseHistory;