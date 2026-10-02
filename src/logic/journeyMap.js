// Generates calendar structure and controls Journey unlock/completion rules.
import {
    currentPhaseStartYear,
    CurrentPhaseStartMonth
} from "../data/trading";

export const START_YEAR = 2010;
export const START_MONTH = 5; // June (0-based)
export const END_YEAR = 2027;

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const WEEKDAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

/* =========================================================
   BASIC DATE HELPERS
========================================================= */

export function pad(number) {
    return String(number).padStart(2, "0");
}

export function getDateKey(year, month, day) {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/* =========================================================
   CALENDAR GENERATION
========================================================= */

export function generateYears() {
    const years = [];

    for (let year = START_YEAR; year <= END_YEAR; year++) {
        years.push(year);
    }

    return years;
}

export function generateMonthDays(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Empty cells before the first day of the month.
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Generate every calendar day.
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const weekday = date.getDay();

        const isWeekend =
            weekday === 0 || weekday === 6;

        const isBeforeStart =
            year < START_YEAR ||
            (
                year === START_YEAR &&
                month < START_MONTH
            );

        days.push({
            day,
            dateKey: getDateKey(year, month, day),
            isWeekend,
            isBeforeStart,
        });
    }

    return days;
}

/* =========================================================
   DATE STATE
========================================================= */

export function isCompletedDate(
    dateKey,
    completedDates
) {
    return completedDates.includes(dateKey);
}

export function isAvailableDate(
    dateKey,
    availableDates
) {
    return availableDates.includes(dateKey);
}

/* =========================================================
   TRADING DAY HELPERS
========================================================= */

// Saturday and Sunday are not trading days.
export function isTradingDay(
    year,
    month,
    day
) {
    const weekday =
        new Date(
            year,
            month,
            day
        ).getDay();

    return weekday !== 0 && weekday !== 6;
}

// Return all trading dates in a month.
export function getTradingDates(
    year,
    month
) {
    const dates = [];
    const daysInMonth =
        getDaysInMonth(
            year,
            month
        );

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        if (
            isTradingDay(
                year,
                month,
                day
            )
        ) {
            dates.push(
                getDateKey(
                    year,
                    month,
                    day
                )
            );
        }
    }

    return dates;
}

/* =========================================================
   AUTO-COMPLETE PAST MONTHS
========================================================= */

// Collects all trading days from June 2010 up through the month
// immediately preceding the active phase start (e.g. up through September).
export function getAutoCompletedDatesUpToPhase() {
    const dates = [];

    let curYear = START_YEAR;
    let curMonth = START_MONTH;

    while (
        curYear < currentPhaseStartYear ||
        (curYear === currentPhaseStartYear && curMonth < CurrentPhaseStartMonth)
    ) {
        const monthTradingDays = getTradingDates(curYear, curMonth);
        dates.push(...monthTradingDays);

        const next = getNextMonth(curYear, curMonth);
        curYear = next.year;
        curMonth = next.month;
    }

    return dates;
}

/* =========================================================
   TRADING WEEK HELPERS
========================================================= */

// Groups trading dates into trading weeks.
// A Monday starts a new week.
// A partial first week still counts as Week 1.
export function getTradingWeeks(
    year,
    month
) {
    const tradingDates =
        getTradingDates(
            year,
            month
        );

    const weeks = [];
    let currentWeek = [];

    tradingDates.forEach(
        (dateKey) => {
            const day =
                Number(
                    dateKey.slice(-2)
                );

            const weekday =
                new Date(
                    year,
                    month,
                    day
                ).getDay();

            // Monday starts a new trading week.
            if (
                weekday === 1 &&
                currentWeek.length > 0
            ) {
                weeks.push(
                    currentWeek
                );

                currentWeek = [];
            }

            currentWeek.push(
                dateKey
            );
        }
    );

    // Add the final trading week.
    if (
        currentWeek.length > 0
    ) {
        weeks.push(
            currentWeek
        );
    }

    return weeks;
}

/* =========================================================
   MISSION DATE LOGIC
========================================================= */

export function getMissionDates(
    year,
    month,
    mission
) {
    const tradingWeeks =
        getTradingWeeks(
            year,
            month
        );

    const tradingDates =
        getTradingDates(
            year,
            month
        );

    if (
        !tradingDates.length
    ) {
        return [];
    }

    const weekNumber =
        mission.week || 1;

    const week =
        tradingWeeks[
            weekNumber - 1
        ] || [];

    if (
        mission.type === "mon-tue"
    ) {
        return week.filter(
            (dateKey) => {
                const day =
                    Number(
                        dateKey.slice(-2)
                    );

                const weekday =
                    new Date(
                        year,
                        month,
                        day
                    ).getDay();

                return (
                    weekday === 1 ||
                    weekday === 2
                );
            }
        );
    }

    if (
        mission.type === "wed-thu"
    ) {
        return week.filter(
            (dateKey) => {
                const day =
                    Number(
                        dateKey.slice(-2)
                    );

                const weekday =
                    new Date(
                        year,
                        month,
                        day
                    ).getDay();

                return (
                    weekday === 3 ||
                    weekday === 4
                );
            }
        );
    }

    if (
        mission.type === "friday"
    ) {
        return week.filter(
            (dateKey) => {
                const day =
                    Number(
                        dateKey.slice(-2)
                    );

                const weekday =
                    new Date(
                        year,
                        month,
                        day
                    ).getDay();

                return weekday === 5;
            }
        );
    }

    if (
        mission.type === "first-week"
    ) {
        return tradingWeeks[0] || [];
    }

    if (
        mission.type === "second-week"
    ) {
        return tradingWeeks[1] || [];
    }

    if (
        mission.type === "third-week"
    ) {
        return tradingWeeks[2] || [];
    }

    if (
        mission.type === "last-trading-day"
    ) {
        return tradingDates;
    }

    return [];
}

/* =========================================================
   BUILD AVAILABLE JOURNEY DATES
========================================================= */

export function calculateAvailableDates(
    year,
    month,
    missions = []
) {
    const availableDates =
        new Set();

    missions.forEach(
        (mission) => {
            if (!mission.done) {
                return;
            }

            const dates =
                getMissionDates(
                    year,
                    month,
                    mission
                );

            dates.forEach(
                (dateKey) => {
                    availableDates.add(
                        dateKey
                    );
                }
            );
        }
    );

    return Array.from(
        availableDates
    ).sort();
}

/* =========================================================
   COMPLETION
========================================================= */

export function isMonthComplete(
    year,
    month,
    availableDates,
    completedDates
) {
    const tradingDates =
        getTradingDates(year, month);

    if (tradingDates.length === 0) {
        return false;
    }

    const lastTradingDay =
        tradingDates[tradingDates.length - 1];

    return completedDates.includes(
        lastTradingDay
    );
}

export function isYearComplete(
    year,
    availableDates,
    completedDates
) {
    const decemberTradingDates =
        getTradingDates(year, 11);

    if (decemberTradingDates.length === 0) {
        return false;
    }

    const lastTradingDay =
        decemberTradingDates[
            decemberTradingDates.length - 1
        ];

    return completedDates.includes(
        lastTradingDay
    );
}

/* =========================================================
   YEAR / MONTH NAVIGATION UNLOCKS
========================================================= */

export function isYearUnlocked(
    year,
    availableDates,
    completedDates
) {
    if (
        year === START_YEAR
    ) {
        return true;
    }

    return isYearComplete(
        year - 1,
        availableDates,
        completedDates
    );
}

export function isMonthUnlocked(
    year,
    month,
    availableDates,
    completedDates
) {
    if (
        year < START_YEAR ||
        (year === START_YEAR && month < START_MONTH)
    ) {
        return false;
    }

    // June 2010 is the starting month
    if (
        year === START_YEAR &&
        month === START_MONTH
    ) {
        return true;
    }

    // Active phase month is always open
    if (
        year === currentPhaseStartYear &&
        month === CurrentPhaseStartMonth
    ) {
        return true;
    }

    const previousMonth =
        getPreviousMonth(
            year,
            month
        );

    return isMonthComplete(
        previousMonth.year,
        previousMonth.month,
        availableDates,
        completedDates
    );
}

/* =========================================================
   PREVIOUS MONTH
========================================================= */

export function getPreviousMonth(
    year,
    month
) {
    if (month === 0) {
        return {
            year: year - 1,
            month: 11,
        };
    }

    return {
        year,
        month: month - 1,
    };
}

/* =========================================================
   NEXT MONTH
========================================================= */

export function getNextMonth(
    year,
    month
) {
    if (month === 11) {
        return {
            year: year + 1,
            month: 0,
        };
    }

    return {
        year,
        month: month + 1,
    };
}