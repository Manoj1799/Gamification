// Generates calendar structure and controls Journey unlock/completion rules.

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

/*
   Journey does not store dates inside missions.

   Trading missions provide:

   mission.type
   mission.week

   Journey calculates the dates from those values.

   Supported types:

   monTue
   wedThu
   friday
   firstWeek
   secondWeek
   thirdWeek
   lastTradingDay
*/

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


    /* -------------------------
       MONDAY + TUESDAY
    ------------------------- */

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


    /* -------------------------
       WEDNESDAY + THURSDAY
    ------------------------- */

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


    /* -------------------------
       FRIDAY
    ------------------------- */

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


    /* -------------------------
       COMPLETE FIRST WEEK
    ------------------------- */

    if (
        mission.type === "first-week"
    ) {
        return tradingWeeks[0] || [];
    }


    /* -------------------------
       COMPLETE SECOND WEEK
    ------------------------- */

    if (
        mission.type === "second-week"
    ) {
        return tradingWeeks[1] || [];
    }


    /* -------------------------
       COMPLETE THIRD WEEK
    ------------------------- */

    if (
        mission.type === "third-week"
    ) {
        return tradingWeeks[2] || [];
    }


    /* -------------------------
       LAST TRADING DAY
    ------------------------- */

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

/*
   Completed Trading missions unlock
   their calculated Journey dates.

   No daily quests are involved.
*/

export function calculateAvailableDates(
    year,
    month,
    missions = []
) {
    const availableDates =
        new Set();

    missions.forEach(
        (mission) => {

            // An unfinished mission does not unlock its dates.
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
// A month is finished only when its final trading day
// has been completed in Journey.
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
// A year is finished only when the final trading day
// of December has been completed.
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
    // 2010 is the starting year.
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
    // Months before June 2010 are crossed, not locked.
    if (
        year === START_YEAR &&
        month < START_MONTH
    ) {
        return false;
    }

    // June 2010 is the starting month.
    if (
        year === START_YEAR &&
        month === START_MONTH
    ) {
        return true;
    }

    // Every later month depends on the previous month.
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