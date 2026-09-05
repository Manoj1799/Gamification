import { useEffect, useState } from "react";

import {
    START_YEAR,
    START_MONTH,
    generateYears,
    generateMonthDays,
    isCompletedDate,
    isAvailableDate,
    isMonthComplete,
    isYearComplete,
    isYearUnlocked,
    isMonthUnlocked,
    isTradingDay,
} from "../logic/journeyMap";

import {
    loadJourneyData,
    completeJourneyDate,
} from "../services/journeyMapService";


export default function useJourneyMap() {
    const [level, setLevel] = useState("years");

    const [selectedYear, setSelectedYear] =
        useState(START_YEAR);
    const [selectedMonth, setSelectedMonth] =
        useState(START_MONTH);
    const [availableDates, setAvailableDates] =
        useState([]);

    const [localCompletedDates, setLocalCompletedDates] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);


    const years = generateYears();


    // ================================
    // LOAD JOURNEY DATA
    // ================================

    useEffect(() => {
        async function loadJourney() {
            try {
                const data =
                    await loadJourneyData(
                        selectedYear,
                        selectedMonth
                    );

                setAvailableDates(
                    data.availableDates
                );

                setLocalCompletedDates(
                    data.completedDates
                );
            } catch (error) {
                console.error(
                    "Failed to load Journey data:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadJourney();
    }, [
        selectedYear,
        selectedMonth,
    ]);


    // ================================
    // NAVIGATION
    // ================================

    function openYear(year) {
        if (
            !isYearUnlocked(
                year,
                availableDates,
                localCompletedDates
            )
        ) {
            return;
        }

        setSelectedYear(year);
        setLevel("months");
    }


    function openMonth(month) {
        if (
            !isMonthUnlocked(
                selectedYear,
                month,
                availableDates,
                localCompletedDates
            )
        ) {
            return;
        }

        setSelectedMonth(month);
        setLevel("days");
    }


    // ================================
    // COMPLETE DAY
    // ================================

    async function completeDay(dateKey) {
        const year =
            Number(dateKey.slice(0, 4));

        const month =
            Number(dateKey.slice(5, 7)) - 1;

        const day =
            Number(dateKey.slice(8, 10));


        // Crossed dates can never be completed.
        if (
            year < START_YEAR ||
            (
                year === START_YEAR &&
                month < START_MONTH
            ) ||
            !isTradingDay(
                year,
                month,
                day
            )
        ) {
            return;
        }


        if (
            !isAvailableDate(
                dateKey,
                availableDates
            )
        ) {
            return;
        }

        if (
            isCompletedDate(
                dateKey,
                localCompletedDates
            )
        ) {
            return;
        }

        try {
            const updatedCompletedDates =
                await completeJourneyDate(
                    dateKey
                );

            setLocalCompletedDates(
                updatedCompletedDates
            );
        } catch (error) {
            console.error(
                "Failed to complete Journey day:",
                error
            );
        }
    }


    // ================================
    // BACK
    // ================================

    function goBack() {
        if (level === "days") {
            setLevel("months");
            return;
        }

        if (level === "months") {
            setLevel("years");
        }
    }


    // ================================
    // STATUS
    // ================================

    function isMonthFinished(month) {
        return isMonthComplete(
            selectedYear,
            month,
            availableDates,
            localCompletedDates
        );
    }


    function isYearFinished(year) {
        return isYearComplete(
            year,
            availableDates,
            localCompletedDates
        );
    }


    function getDayStatus(dateKey) {
        const year =
            Number(dateKey.slice(0, 4));

        const month =
            Number(dateKey.slice(5, 7)) - 1;

        const day =
            Number(dateKey.slice(8, 10));


        // January–May 2010 are crossed.
        const isBeforeJourneyStart =
            year < START_YEAR ||
            (
                year === START_YEAR &&
                month < START_MONTH
            );

        if (isBeforeJourneyStart) {
            return "crossed";
        }


        // Saturday and Sunday are always crossed.
        if (
            !isTradingDay(
                year,
                month,
                day
            )
        ) {
            return "crossed";
        }


        // Normal Journey states.
        if (
            isCompletedDate(
                dateKey,
                localCompletedDates
            )
        ) {
            return "completed";
        }

        if (
            isAvailableDate(
                dateKey,
                availableDates
            )
        ) {
            return "available";
        }

        return "locked";
    }


    return {
        level,
        years,

        selectedYear,
        selectedMonth,

        availableDates,
        localCompletedDates,

        isLoading,

        openYear,
        openMonth,
        completeDay,
        goBack,

        isYearUnlocked: (year) =>
            isYearUnlocked(
                year,
                availableDates,
                localCompletedDates
            ),

        isMonthUnlocked: (month) =>
            isMonthUnlocked(
                selectedYear,
                month,
                availableDates,
                localCompletedDates
            ),

        isMonthFinished,
        isYearFinished,

        getDayStatus,

        generateMonthDays,
    };
}