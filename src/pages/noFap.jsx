// React state management.
import { useEffect, useMemo, useState } from "react";

// Icons.
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Lock,
    ShieldAlert,
    X,
} from "lucide-react";

// No Fap service.
import {
    loadNoFapData,
    recordNoFapAnswer,
} from "../services/noFapServices";

// Date formatting.
import {
    formatDate,
    formatDisplayDate,
    getYesterdayDate,
} from "../logic/noFap";

// ========================================
// NO FAP PAGE
// ========================================

export default function NoFap() {
    // Current No Fap record for yesterday.
    const [todayRecord, setTodayRecord] = useState(null);

    // All historical records.
    const [records, setRecords] = useState([]);

    // Current base penalty.
    const [basePenalty, setBasePenalty] = useState(10);

    // Total donated amount.
    const [totalDonated, setTotalDonated] = useState(0);

    // Loading state.
    const [isLoading, setIsLoading] = useState(true);

    // Saving state.
    const [isSaving, setIsSaving] = useState(false);

    // Current calendar month.
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const date = new Date();

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );
    });

    // ========================================
    // LOAD DATA
    // ========================================

    async function load() {
        try {
            const data = await loadNoFapData();

            setTodayRecord(data.todayRecord);
            setRecords(data.records);
            setBasePenalty(data.basePenalty);
            setTotalDonated(data.totalDonated);
        } catch (error) {
            console.error("No Fap load error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    // ========================================
    // ANSWER QUESTION
    // ========================================

    async function handleAnswer(didFap) {
        // Never allow another click while saving.
        if (isSaving) {
            return;
        }

        // If today's answer already exists,
        // it cannot be changed.
        if (todayRecord) {
            return;
        }

        // Immediately lock the buttons.
        setIsSaving(true);

        try {
            const record = await recordNoFapAnswer(didFap);

            // Store the permanent answer in state.
            setTodayRecord(record);

            // Reload all data after recording.
            await load();
        } catch (error) {
            // If IndexedDB says the record already exists,
            // reload the saved answer.
            if (error.message === "NO_FAP_ALREADY_RECORDED") {
                await load();
            } else {
                console.error("No Fap save error:", error);
            }
        } finally {
            setIsSaving(false);
        }
    }

    // ========================================
    // CALENDAR DATA
    // ========================================

    const calendarDays = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDay = new Date(year, month, 1);

        // Convert Sunday = 0 into Monday = 0.
        const startingDay = (firstDay.getDay() + 6) % 7;

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        const days = [];

        // Empty cells before the first day.
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Actual calendar days.
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);

            days.push({
                day,
                date: formatDate(date),
            });
        }

        return days;
    }, [calendarMonth]);

    // ========================================
    // RECORD LOOKUP
    // ========================================

    const recordsByDate = useMemo(() => {
        const map = {};

        for (const record of records) {
            map[record.date] = record;
        }

        return map;
    }, [records]);

    // ========================================
    // CALENDAR NAVIGATION
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

        const current = new Date();

        const currentMonth = new Date(
            current.getFullYear(),
            current.getMonth(),
            1
        );

        // Do not allow future months.
        if (next > currentMonth) {
            return;
        }

        setCalendarMonth(next);
    }

    // ========================================
    // LOADING STATE
    // ========================================

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // ========================================
    // DATE
    // ========================================

    const reportedDate = getYesterdayDate();

    const monthTitle = calendarMonth.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric",
        }
    );

    // ========================================
    // PAGE
    // ========================================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="mx-auto max-w-md space-y-5">

                {/* ================================
                    HEADER
                ================================= */}

                <div className="rounded-3xl bg-black p-6 text-white">
                    <div className="flex items-center gap-3">
                        <ShieldAlert size={28} />

                        <div>
                            <h1 className="text-2xl font-bold">
                                No Fap
                            </h1>

                            <p className="text-sm text-gray-400">
                                One decision. No editing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================================
                    PENALTY INFORMATION
                ================================= */}

                <div className="grid grid-cols-2 gap-3">

                    {/* Base Penalty */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                            Base Penalty
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            ₹{basePenalty}
                        </p>
                    </div>

                    {/* Total Donated */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                            Total Donated
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            ₹{totalDonated}
                        </p>
                    </div>

                </div>

                {/* ================================
                    CALENDAR
                ================================= */}

                <div className="rounded-3xl bg-white p-5 shadow-sm">

                    {/* Calendar header */}
                    <div className="flex items-center justify-between">

                        <button
                            type="button"
                            onClick={previousMonth}
                            className="rounded-xl p-2 transition active:scale-90"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <h2 className="font-bold">
                            {monthTitle}
                        </h2>

                        <button
                            type="button"
                            onClick={nextMonth}
                            className="rounded-xl p-2 transition active:scale-90"
                        >
                            <ChevronRight size={20} />
                        </button>

                    </div>

                    {/* Weekday labels */}
                    <div className="mt-4 grid grid-cols-7 gap-1 text-center">

                        {[
                            "M",
                            "T",
                            "W",
                            "T",
                            "F",
                            "S",
                            "S",
                        ].map((day, index) => (
                            <div
                                key={`${day}-${index}`}
                                className="py-2 text-xs font-bold text-gray-400"
                            >
                                {day}
                            </div>
                        ))}

                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">

                        {calendarDays.map((calendarDay, index) => {

                            // Empty calendar cell.
                            if (!calendarDay) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="min-h-[58px]"
                                    />
                                );
                            }

                            const record =
                                recordsByDate[calendarDay.date];

                            const isFapDay =
                                record?.didFap === true;

                            const isCleanDay =
                                record?.didFap === false;

                            return (
                                <div
                                    key={calendarDay.date}
                                    className={`min-h-[58px] rounded-xl p-1 text-center ${isFapDay
                                            ? "bg-gray-200"
                                            : isCleanDay
                                                ? "bg-gray-50"
                                                : "bg-white"
                                        }`}
                                >

                                    {/* Day number */}
                                    <p className="text-xs font-bold text-gray-500">
                                        {calendarDay.day}
                                    </p>

                                    {/* Fapped */}
                                    {isFapDay && (
                                        <>
                                            <div className="mt-1 flex justify-center">

                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                                                    <X size={15} />
                                                </div>

                                            </div>

                                            <p className="mt-1 text-[10px] font-bold">
                                                ₹{record.penaltyAmount}
                                            </p>
                                        </>
                                    )}

                                    {/* Clean */}
                                    {isCleanDay && (
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

                    {/* Calendar legend */}
                    <div className="mt-4 flex items-center justify-center gap-5 text-xs text-gray-500">

                        <div className="flex items-center gap-1">
                            <X size={14} />
                            Fapped
                        </div>

                        <div className="flex items-center gap-1">
                            <Check size={14} />
                            Clean
                        </div>

                    </div>

                </div>

                {/* ================================
                    MAIN QUESTION
                ================================= */}

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <p className="text-sm text-gray-500">
                        {formatDisplayDate(reportedDate)}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                        Did you fap yesterday?
                    </h2>

                    {/* ==============================
                        ANSWER BUTTONS
                    =============================== */}

                    {!todayRecord ? (
                        <div className="mt-6 grid grid-cols-2 gap-3">

                            {/* YES */}
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleAnswer(true)}
                                className="rounded-2xl bg-black px-5 py-4 text-lg font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                YES
                            </button>

                            {/* NO */}
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleAnswer(false)}
                                className="rounded-2xl border-2 border-black bg-white px-5 py-4 text-lg font-bold text-black transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                NO
                            </button>

                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl bg-gray-100 p-5">

                            {/* Recorded status */}
                            <div className="flex items-center gap-2">
                                <Lock size={18} />

                                <p className="font-bold">
                                    Answer Recorded
                                </p>
                            </div>

                            {/* Saved answer */}
                            <p className="mt-2 text-gray-600">
                                You answered:{" "}
                                <span className="font-bold text-black">
                                    {todayRecord.didFap
                                        ? "YES"
                                        : "NO"}
                                </span>
                            </p>

                            {/* ==========================
                                AMOUNT TO DONATE
                            =========================== */}

                            <div className="mt-4 rounded-2xl bg-white p-4">

                                <p className="text-xs text-gray-500">
                                    Amount to Donate
                                </p>

                                <p className="text-3xl font-bold">
                                    ₹{todayRecord.penaltyAmount}
                                </p>

                            </div>

                            {/* ==========================
                                MESSAGE
                            =========================== */}

                            {todayRecord.didFap && (
                                <p className="mt-4 text-sm font-medium text-gray-700">
                                    You hate them, but your relapse still
                                    costs you. Turn the pain into a donation
                                    that hits where it hurts.
                                </p>
                            )}

                            {/* Clean message */}
                            {!todayRecord.didFap && (
                                <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                                    <Check size={18} />
                                    Clean day recorded.
                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}