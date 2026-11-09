import { useEffect, useMemo, useState } from "react";

import {
    Check,
    ChevronLeft,
    ChevronRight,
    ShieldAlert,
    X,
} from "lucide-react";

import {
    loadNoFapData,
    recordNoFapAnswer,
} from "../services/noFapServices";

import {
    loadWorkData,
    recordWorkDone,
} from "../services/workServices";

import {
    formatDate,
    formatDisplayDate,
    getYesterdayDate,
} from "../logic/noFap";

export default function NoFap() {
    const [records, setRecords] = useState([]);
    const [workRecords, setWorkRecords] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSavingNoFap, setIsSavingNoFap] = useState(false);
    const [isSavingWork, setIsSavingWork] = useState(false);

    const [calendarMonth, setCalendarMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const reportedDate = getYesterdayDate();

    // ========================================
    // LOAD DATA
    // ========================================

    async function load() {
        try {
            const [noFapData, workData] = await Promise.all([
                loadNoFapData(),
                loadWorkData(),
            ]);

            setRecords(noFapData.records || []);
            setWorkRecords(workData || []);
        } catch (error) {
            console.error("Data load error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    // ========================================
    // YESTERDAY RECORDS
    // ========================================

    const yesterdayNoFapRecord = records.find(
        record => record.date === reportedDate
    );

    const yesterdayWorkRecord = workRecords.find(
        record => record.date === reportedDate
    );

    const workAnswer = yesterdayWorkRecord
        ? (
            yesterdayWorkRecord.didWork ??
            yesterdayWorkRecord.done ??
            false
        )
        : null;

    // ========================================
    // NO FAP ANSWER
    // ========================================

    async function handleNoFapAnswer(didFap) {
        if (yesterdayNoFapRecord || isSavingNoFap) return;

        setIsSavingNoFap(true);

        try {
            await recordNoFapAnswer(didFap);
            await load();
        } catch (error) {
            console.error("NoFap save error:", error);
            await load();
        } finally {
            setIsSavingNoFap(false);
        }
    }

    // ========================================
    // WORK ANSWER
    // ========================================

    async function handleWorkAnswer(didWork) {
        if (yesterdayWorkRecord || isSavingWork) return;

        setIsSavingWork(true);

        try {
            await recordWorkDone(didWork);
            await load();
        } catch (error) {
            console.error("Work save error:", error);
            await load();
        } finally {
            setIsSavingWork(false);
        }
    }

    // ========================================
    // CALENDAR DAYS
    // ========================================

    const calendarDays = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const startingDay = (firstDay.getDay() + 6) % 7;

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        const days = [];

        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                date: formatDate(new Date(year, month, day)),
            });
        }

        return days;
    }, [calendarMonth]);

    // ========================================
    // RECORD LOOKUPS
    // ========================================

    const recordsByDate = useMemo(() => {
        const map = {};

        records.forEach(record => {
            map[record.date] = record;
        });

        return map;
    }, [records]);

    const workRecordsByDate = useMemo(() => {
        const map = {};

        workRecords.forEach(record => {
            map[record.date] = record;
        });

        return map;
    }, [workRecords]);

    // ========================================
    // MONTH NAVIGATION
    // ========================================

    function previousMonth() {
        setCalendarMonth(
            new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() - 1,
                1
            )
        );
    }

    function nextMonth() {
        const next = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth() + 1,
            1
        );

        const today = new Date();
        const currentMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        if (next <= currentMonth) {
            setCalendarMonth(next);
        }
    }

    // ========================================
    // CALENDAR HEADER
    // ========================================

    function CalendarHeader() {
        return (
            <>
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={previousMonth}
                        className="rounded-xl p-2"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <h2 className="font-bold">
                        {calendarMonth.toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>

                    <button
                        type="button"
                        onClick={nextMonth}
                        className="rounded-xl p-2"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                    {["M", "T", "W", "T", "F", "S", "S"].map(
                        (day, index) => (
                            <div
                                key={index}
                                className="py-2 text-xs font-bold text-gray-400"
                            >
                                {day}
                            </div>
                        )
                    )}
                </div>
            </>
        );
    }

    // ========================================
    // LOADING
    // ========================================

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // ========================================
    // PAGE
    // ========================================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="mx-auto max-w-md space-y-5">

                {/* HEADER */}

                <div className="rounded-3xl bg-black p-6 text-white">
                    <div className="flex items-center gap-3">
                        <ShieldAlert size={28} />

                        <div>
                            <h1 className="text-2xl font-bold">
                                No Fap
                            </h1>

                            <p className="text-sm text-gray-400">
                                Stay disciplined. Build better habits.
                            </p>
                        </div>
                    </div>
                </div>

                {/* NO FAP CALENDAR */}

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">
                        NoFap Calendar
                    </h2>

                    <CalendarHeader />

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="min-h-[58px]"
                                    />
                                );
                            }

                            const record = recordsByDate[day.date];

                            const didFap = record?.didFap === true;
                            const stayedClean = record?.didFap === false;

                            return (
                                <div
                                    key={day.date}
                                    className={`min-h-[58px] rounded-xl p-1 text-center ${
                                        didFap
                                            ? "bg-gray-200"
                                            : stayedClean
                                                ? "bg-gray-50"
                                                : "bg-white"
                                    }`}
                                >
                                    <p className="text-xs font-bold text-gray-500">
                                        {day.day}
                                    </p>

                                    {didFap && (
                                        <div className="mt-1 flex justify-center">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                                                <X size={15} />
                                            </div>
                                        </div>
                                    )}

                                    {stayedClean && (
                                        <div className="mt-2 flex justify-center">
                                            <Check
                                                size={18}
                                                className="text-gray-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex justify-center gap-5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <X size={14} />
                            Fapped
                        </span>

                        <span className="flex items-center gap-1">
                            <Check size={14} />
                            Clean
                        </span>
                    </div>
                </div>

                {/* WORK DONE CALENDAR */}

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">
                        Work Done Calendar
                    </h2>

                    <CalendarHeader />

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`work-empty-${index}`}
                                        className="min-h-[58px]"
                                    />
                                );
                            }

                            const record = workRecordsByDate[day.date];

                            const didWork = record
                                ? (
                                    record.didWork ??
                                    record.done ??
                                    false
                                )
                                : null;

                            return (
                                <div
                                    key={day.date}
                                    className={`min-h-[58px] rounded-xl p-1 text-center ${
                                        didWork === true
                                            ? "bg-green-50"
                                            : record
                                                ? "bg-red-50"
                                                : "bg-white"
                                    }`}
                                >
                                    <p className="text-xs font-bold text-gray-500">
                                        {day.day}
                                    </p>

                                    {record && (
                                        <div className="mt-2 flex justify-center">
                                            {didWork === true ? (
                                                <Check
                                                    size={18}
                                                    className="text-green-600"
                                                />
                                            ) : (
                                                <X
                                                    size={18}
                                                    className="text-red-500"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex justify-center gap-5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Check
                                size={14}
                                className="text-green-600"
                            />
                            YES
                        </span>

                        <span className="flex items-center gap-1">
                            <X
                                size={14}
                                className="text-red-500"
                            />
                            NO
                        </span>
                    </div>
                </div>

                {/* NO FAP QUESTION */}

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        {formatDisplayDate(reportedDate)}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                        Did you fap yesterday?
                    </h2>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            disabled={!!yesterdayNoFapRecord || isSavingNoFap}
                            onClick={() => handleNoFapAnswer(true)}
                            className={`rounded-2xl px-5 py-4 font-bold disabled:cursor-not-allowed ${
                                yesterdayNoFapRecord?.didFap === true
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-black"
                            }`}
                        >
                            YES
                        </button>

                        <button
                            disabled={!!yesterdayNoFapRecord || isSavingNoFap}
                            onClick={() => handleNoFapAnswer(false)}
                            className={`rounded-2xl px-5 py-4 font-bold disabled:cursor-not-allowed ${
                                yesterdayNoFapRecord?.didFap === false
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-black"
                            }`}
                        >
                            NO
                        </button>
                    </div>
                </div>

                {/* WORK QUESTION */}

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        {formatDisplayDate(reportedDate)}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                        Did you complete your work yesterday?
                    </h2>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            disabled={!!yesterdayWorkRecord || isSavingWork}
                            onClick={() => handleWorkAnswer(true)}
                            className={`rounded-2xl px-5 py-4 font-bold disabled:cursor-not-allowed ${
                                workAnswer === true
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-black"
                            }`}
                        >
                            YES
                        </button>

                        <button
                            disabled={!!yesterdayWorkRecord || isSavingWork}
                            onClick={() => handleWorkAnswer(false)}
                            className={`rounded-2xl px-5 py-4 font-bold disabled:cursor-not-allowed ${
                                yesterdayWorkRecord && workAnswer === false
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-black"
                            }`}
                        >
                            NO
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}