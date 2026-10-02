import {
    getTradingRecord,
    saveTradingRecord,
} from "../data/database";
import {
    currentPhaseStartYear,
    CurrentPhaseStartMonth
} from "../data/trading";
import {
    calculateAvailableDates,
    getAutoCompletedDatesUpToPhase,
} from "../logic/journeyMap";

// ================================
// LOAD JOURNEY DATA
// ================================

export async function loadJourneyData(
    year,
    month
) {
    const tradingRecord =
        await getTradingRecord();

    if (!tradingRecord) {
        return {
            availableDates: [],
            completedDates: [],
        };
    }

    const monthIndex =
        (year - currentPhaseStartYear) * 12 +
        (month - CurrentPhaseStartMonth);

    const tradingMonth =
        tradingRecord.months?.[monthIndex];

    const missions =
        tradingMonth?.missions ?? [];

    const availableDates =
        calculateAvailableDates(
            year,
            month,
            missions
        );

    // Existing completed dates from store
    const storedCompletedDates =
        tradingRecord.journey?.completedDates ?? [];

    // All trading dates from June 2010 up to current phase month
    const pastCompletedDates =
        getAutoCompletedDatesUpToPhase();

    // Deduplicate merged dates
    const mergedCompletedDates = Array.from(
        new Set([...storedCompletedDates, ...pastCompletedDates])
    );

    // Persist if any past dates were newly auto-completed
    if (mergedCompletedDates.length !== storedCompletedDates.length) {
        await saveTradingRecord({
            ...tradingRecord,
            journey: {
                ...(tradingRecord.journey ?? {}),
                completedDates: mergedCompletedDates,
            },
        });
    }

    return {
        availableDates,
        completedDates: mergedCompletedDates,
    };
}

// ================================
// SAVE COMPLETED JOURNEY DAY
// ================================

export async function completeJourneyDate(
    dateKey
) {
    const tradingRecord =
        await getTradingRecord();

    if (!tradingRecord) {
        return [];
    }

    const currentCompletedDates =
        tradingRecord.journey?.completedDates ?? [];

    if (
        currentCompletedDates.includes(dateKey)
    ) {
        return currentCompletedDates;
    }

    const updatedCompletedDates = [
        ...currentCompletedDates,
        dateKey,
    ];

    await saveTradingRecord({
        ...tradingRecord,
        journey: {
            ...(tradingRecord.journey ?? {}),
            completedDates:
                updatedCompletedDates,
        },
    });

    return updatedCompletedDates;
}

// ================================
// LOAD ONLY COMPLETED DATES
// ================================

export async function loadCompletedJourneyDates() {
    const tradingRecord =
        await getTradingRecord();

    const storedCompletedDates =
        tradingRecord?.journey?.completedDates ?? [];

    const pastCompletedDates =
        getAutoCompletedDatesUpToPhase();

    return Array.from(
        new Set([...storedCompletedDates, ...pastCompletedDates])
    );
}