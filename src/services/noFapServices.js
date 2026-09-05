
// Import the IndexedDB No Fap functions.
import {
    addNoFapRecord,
    getAllNoFapRecords,
    getNoFapRecord,
} from "../data/database";

// Import No Fap calculation logic.
import {
    calculateBasePenalty,
    calculateCleanStreak,
    calculatePenalty,
    calculateTotalDonated,
    formatDate,
    getYesterdayDate,
} from "../logic/noFap";

// ========================================
// LOAD NO FAP DATA
// ========================================

export async function loadNoFapData() {
    // Load every permanently recorded No Fap answer.
    const records = await getAllNoFapRecords();

    // Calculate current statistics.
    const cleanStreak = calculateCleanStreak(records);
    const basePenalty = calculateBasePenalty(records);
    const totalDonated = calculateTotalDonated(records);

    // The question always refers to yesterday.
    const yesterday = getYesterdayDate();

    // Check whether yesterday already has a permanent answer.
    const todayRecord = await getNoFapRecord(yesterday);

    return {
        records,
        todayRecord,
        cleanStreak,
        basePenalty,
        totalDonated,
    };
}

// ========================================
// RECORD ANSWER
// ========================================

export async function recordNoFapAnswer(didFap) {
    // Load existing records to calculate the penalty.
    const records = await getAllNoFapRecords();

    // The answer being recorded is for yesterday.
    const reportedDate = getYesterdayDate();

    // Check whether this date has already been answered.
    const existingRecord = await getNoFapRecord(reportedDate);

    // Never allow an existing answer to be overwritten.
    if (existingRecord) {
        throw new Error("NO_FAP_ALREADY_RECORDED");
    }

    // Calculate the current streak and base penalty.
    const cleanStreak = calculateCleanStreak(records);
    const basePenalty = calculateBasePenalty(records);

    // Calculate the penalty for this answer.
    const penaltyAmount = calculatePenalty({
        didFap,
        cleanStreak,
        basePenalty,
    });

    // Create the permanent record.
    const record = {
        id: reportedDate,
        date: reportedDate,
        recordedOn: formatDate(new Date()),
        didFap,
        penaltyAmount,
    };

    // Save permanently to IndexedDB.
    await addNoFapRecord(record);

    return record;
}
