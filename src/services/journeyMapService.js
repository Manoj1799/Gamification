import {
    getTradingRecord,
    saveTradingRecord,
} from "../data/database";

import {
    calculateAvailableDates,
} from "../logic/journeyMap";


// ================================
// LOAD JOURNEY DATA
// ================================

// Loads Trading missions for the selected month
// and converts completed missions into Journey-available dates.

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

    // Trading starts at June 2010.
    // Convert the selected calendar month into
    // the corresponding Trading month index.
    const monthIndex =
        (year - 2010) * 12 +
        (month - 5);

    const tradingMonth =
        tradingRecord.months?.[monthIndex];

    const missions =
        tradingMonth?.missions ?? [];

    // Only completed Trading missions
    // unlock their corresponding Journey dates.
    const availableDates =
        calculateAvailableDates(
            year,
            month,
            missions
        );

    const completedDates =
        tradingRecord.journey?.completedDates ?? [];

    return {
        availableDates,
        completedDates,
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

    return (
        tradingRecord?.journey?.completedDates ?? []
    );
}