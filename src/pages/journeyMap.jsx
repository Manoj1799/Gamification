import React from "react";
import { ChevronLeft, Lock, Map } from "lucide-react";

import useJourneyMap from "../hooks/useJourneyMap";

import {
    MONTHS,
    WEEKDAYS,
    START_YEAR,
    START_MONTH,
} from "../logic/journeyMap";

export default function JourneyMap() {
    const {
        level,
        years,
        selectedYear,
        selectedMonth,

        openYear,
        openMonth,
        completeDay,
        goBack,

        isYearUnlocked,
        isMonthUnlocked,
        isMonthFinished,
        isYearFinished,
        getDayStatus,

        generateMonthDays,
    } = useJourneyMap();

    // Check whether a month exists before the actual Journey start.
    // January-May 2010 are intentionally crossed rather than locked.
    function isMonthCrossed(year, month) {
        return (
            year < START_YEAR ||
            (
                year === START_YEAR &&
                month < START_MONTH
            )
        );
    }

    const monthDays =
        level === "days"
            ? generateMonthDays(
                selectedYear,
                selectedMonth
            )
            : [];

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 px-3 py-4 text-white sm:px-4">

            {/* Main mobile container */}
            <div className="mx-auto w-full max-w-md">

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        {level !== "years" && (
                            <button
                                onClick={goBack}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-95"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        <div>
                            <h1 className="text-xl font-black tracking-tight">
                                Journey
                            </h1>

                            <p className="text-xs text-white/40">
                                {level === "years" &&
                                    "Your life journey"}

                                {level === "months" &&
                                    `${selectedYear} • Choose a month`}

                                {level === "days" &&
                                    `${MONTHS[selectedMonth]} ${selectedYear}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-300/20 bg-yellow-400/10">
                        <Map
                            size={19}
                            className="text-yellow-300"
                        />
                    </div>
                </div>

                {/* YEARS */}
                {level === "years" && (
                    <div className="grid grid-cols-3 gap-3">

                        {years.map((year) => {

                            const unlocked =
                                isYearUnlocked(year);

                            const finished =
                                isYearFinished(year);

                            return (
                                <button
                                    key={year}
                                    disabled={!unlocked}
                                    onClick={() => openYear(year)}
                                    className={`
                    relative flex aspect-square flex-col items-center justify-center
                    overflow-hidden rounded-2xl border
                    transition-all duration-300
                    active:scale-95

                    ${finished
                                            ? `
                          bg-gradient-to-br
                          from-yellow-200
                          via-amber-300
                          to-yellow-500
                          border-yellow-100/80
                          shadow-[0_0_18px_rgba(250,204,21,0.9),0_0_40px_rgba(245,158,11,0.65),0_10px_35px_-5px_rgba(245,158,11,0.7)]
                          ring-2 ring-yellow-200/60
                        `
                                            : unlocked
                                                ? `
                          bg-white/[0.06]
                          border-cyan-300/20
                          shadow-[0_10px_30px_-10px_rgba(34,211,238,0.4)]
                        `
                                                : `
                          bg-white/[0.025]
                          border-white/[0.06]
                          opacity-40
                        `
                                        }
                  `}
                                >
                                    {!unlocked && (
                                        <Lock
                                            size={16}
                                            className="mb-2 text-white/30"
                                        />
                                    )}

                                    <span
                                        className={`
                      text-lg font-black
                      ${finished
                                                ? "text-yellow-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
                                                : unlocked
                                                    ? "text-cyan-100"
                                                    : "text-white/30"
                                            }
                    `}
                                    >
                                        {year}
                                    </span>

                                    {finished && (
                                        <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-yellow-950/70">
                                            Complete
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* MONTHS */}
                {level === "months" && (
                    <div className="grid grid-cols-3 gap-3">

                        {MONTHS.map((month, index) => {

                            const crossed =
                                isMonthCrossed(
                                    selectedYear,
                                    index
                                );

                            const unlocked =
                                !crossed &&
                                isMonthUnlocked(index);

                            const finished =
                                !crossed &&
                                isMonthFinished(index);

                            return (
                                <button
                                    key={month}
                                    disabled={
                                        crossed ||
                                        !unlocked
                                    }
                                    onClick={() =>
                                        openMonth(index)
                                    }
                                    className={`
                    relative flex aspect-square flex-col items-center justify-center
                    overflow-hidden rounded-2xl border
                    px-2 text-center
                    transition-all duration-300
                    active:scale-95

                    ${crossed
                                            ? `
                          bg-white/[0.015]
                          border-white/[0.035]
                          text-white/10
                          cursor-not-allowed
                          opacity-30
                        `
                                            : finished
                                                ? `
                          bg-gradient-to-br
                          from-yellow-200
                          via-amber-300
                          to-yellow-500
                          border-yellow-100/80
                          shadow-[0_0_18px_rgba(250,204,21,0.9),0_0_40px_rgba(245,158,11,0.65),0_10px_35px_-5px_rgba(245,158,11,0.7)]
                          ring-2 ring-yellow-200/60
                        `
                                                : unlocked
                                                    ? `
                          bg-white/[0.06]
                          border-cyan-300/20
                          animate-pulse
                          shadow-[0_10px_30px_-10px_rgba(34,211,238,0.45)]
                        `
                                                    : `
                          bg-white/[0.025]
                          border-white/[0.06]
                          opacity-40
                        `
                                        }
                  `}
                                >
                                    {/* Crossed month X */}
                                    {crossed && (
                                        <>
                                            <span className="absolute h-px w-[65%] rotate-45 bg-white/15" />
                                            <span className="absolute h-px w-[65%] -rotate-45 bg-white/15" />
                                        </>
                                    )}

                                    {/* Lock only for genuinely locked months */}
                                    {!crossed && !unlocked && (
                                        <Lock
                                            size={15}
                                            className="mb-1 text-white/30"
                                        />
                                    )}

                                    <span
                                        className={`
                      relative z-10 text-xs font-black
                      ${crossed
                                                ? "text-white/10"
                                                : finished
                                                    ? "text-yellow-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
                                                    : unlocked
                                                        ? "text-cyan-100"
                                                        : "text-white/30"
                                            }
                    `}
                                    >
                                        {month}
                                    </span>

                                    <span
                                        className={`
                      relative z-10 mt-1 text-[9px]
                      ${crossed
                                                ? "text-white/5"
                                                : finished
                                                    ? "text-yellow-950/60"
                                                    : "text-white/30"
                                            }
                    `}
                                    >
                                        {index + 1}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* DAYS */}
                {level === "days" && (
                    <div>

                        {/* Month information */}
                        <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                                        Month
                                    </p>

                                    <h2 className="mt-1 text-lg font-black">
                                        {MONTHS[selectedMonth]}
                                    </h2>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-white/30">
                                        Year
                                    </p>

                                    <p className="font-black text-cyan-300">
                                        {selectedYear}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Weekday headers */}
                        <div className="mb-2 grid grid-cols-7 gap-1.5">

                            {WEEKDAYS.map((day) => (
                                <div
                                    key={day}
                                    className="py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white/25"
                                >
                                    {day}
                                </div>
                            ))}

                        </div>

                        {/* Calendar */}
                        <div className="grid grid-cols-7 gap-1.5">

                            {monthDays.map((item, index) => {

                                if (!item) {
                                    return (
                                        <div
                                            key={`empty-${index}`}
                                            className="aspect-square"
                                        />
                                    );
                                }

                                const status =
                                    getDayStatus(
                                        item.dateKey
                                    );

                                return (
                                    <button
                                        key={item.dateKey}
                                        disabled={
                                            status !== "available"
                                        }
                                        onClick={() =>
                                            completeDay(
                                                item.dateKey
                                            )
                                        }
                                        className={`
                      relative flex aspect-square items-center justify-center
                      overflow-hidden rounded-xl border
                      text-xs font-black
                      transition-all duration-300
                      active:scale-90

                      ${status === "completed"
                                                ? `
                            bg-gradient-to-br
                            from-yellow-200
                            via-amber-300
                            to-yellow-500
                            border-yellow-100/80
                            text-yellow-950
                            shadow-[0_0_18px_rgba(250,204,21,0.9),0_0_40px_rgba(245,158,11,0.65),0_7px_24px_-3px_rgba(245,158,11,0.7)]
                            ring-2 ring-yellow-200/60
                          `
                                                : status === "available"
                                                    ? `
                            bg-gradient-to-br
                            from-cyan-300/30
                            via-blue-400/20
                            to-cyan-500/10
                            border-cyan-300/30
                            text-cyan-100
                            animate-pulse
                            shadow-[0_0_18px_rgba(34,211,238,0.35)]
                          `
                                                    : status === "crossed"
                                                        ? `
                            bg-white/[0.015]
                            border-white/[0.035]
                            text-white/10
                            cursor-not-allowed
                            opacity-35
                          `
                                                        : `
                            bg-white/[0.025]
                            border-white/[0.05]
                            text-white/20
                          `
                                            }
                    `}
                                    >

                                        {/* Day number */}
                                        <span className="relative z-10">
                                            {item.day}
                                        </span>

                                        {/* Crossed X */}
                                        {status === "crossed" && (
                                            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">

                                                <span className="absolute h-px w-[70%] rotate-45 bg-white/20" />

                                                <span className="absolute h-px w-[70%] -rotate-45 bg-white/20" />

                                            </span>
                                        )}

                                    </button>
                                );
                            })}

                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-wide text-white/30">

                            {/* Available */}
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                Available
                            </div>

                            {/* Complete */}
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.9)]" />
                                Complete
                            </div>

                            {/* Locked */}
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                                Locked
                            </div>

                            {/* Crossed */}
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2.5 w-2.5 items-center justify-center">

                                    <span className="absolute h-px w-3 rotate-45 bg-white/20" />

                                    <span className="absolute h-px w-3 -rotate-45 bg-white/20" />

                                </span>

                                Crossed
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}