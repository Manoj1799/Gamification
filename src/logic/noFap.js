// ========================================
// NO FAP RULES
// ========================================

// Starting progressive penalty.
export const STARTING_BASE_PENALTY = 10;

// Number of clean days required to reset
// the progressive penalty back to ₹10.
export const RESET_CLEAN_DAYS = 14;

// First-week maximum day.
export const FIRST_WEEK_END = 7;

// Day 30 is the end of the ₹100 breach-fee period.
export const STREAK_FEE_END = 30;

// Flat penalty from Day 31 onward.
export const FLAT_PENALTY = 500;

// ========================================
// DATE HELPERS
// ========================================

// Return local date as YYYY-MM-DD.
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Get yesterday's local date.
export function getYesterdayDate() {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    return formatDate(date);
}

// Convert YYYY-MM-DD to a readable date.
export function formatDisplayDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// ========================================
// STREAK CALCULATION
// ========================================

// Calculate the current clean streak.
//
// Only consecutive NO answers count as clean days.
// A YES resets the clean streak.
export function calculateCleanStreak(records) {
    if (!records || records.length === 0) {
        return 0;
    }

    const sorted = [...records].sort((a, b) =>
        b.date.localeCompare(a.date)
    );

    let streak = 0;

    for (const record of sorted) {
        if (record.didFap === false) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// ========================================
// BASE PENALTY
// ========================================

// Calculate the current progressive base penalty.
//
// Every relapse during Days 1–7 increases
// the progressive base by ₹10 for the next relapse.
//
// After 14 consecutive clean days,
// the base resets to ₹10.
export function calculateBasePenalty(records) {
    if (!records || records.length === 0) {
        return STARTING_BASE_PENALTY;
    }

    const sorted = [...records].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    let basePenalty = STARTING_BASE_PENALTY;
    let cleanStreak = 0;

    for (const record of sorted) {
        if (record.didFap) {
            // Relapse during the first 7 days
            // increases the progressive base.
            if (cleanStreak < FIRST_WEEK_END) {
                basePenalty += 10;
            }

            cleanStreak = 0;
        } else {
            cleanStreak++;

            // Successful 14-day streak resets base.
            if (cleanStreak >= RESET_CLEAN_DAYS) {
                basePenalty = STARTING_BASE_PENALTY;
            }
        }
    }

    return basePenalty;
}

// ========================================
// PENALTY CALCULATION
// ========================================

// Calculate the amount for a relapse.
//
// IMPORTANT:
// Rule 4 / 24-hour doubling is intentionally
// NOT included.
export function calculatePenalty({
    didFap,
    cleanStreak,
    basePenalty,
}) {
    if (!didFap) {
        return 0;
    }

    // Days 1–7.
    if (cleanStreak < FIRST_WEEK_END) {
        return basePenalty;
    }

    // Days 8–30.
    if (cleanStreak < STREAK_FEE_END) {
        return basePenalty + 100;
    }

    // Day 31+.
    return FLAT_PENALTY;
}

// ========================================
// TOTAL DONATIONS
// ========================================

export function calculateTotalDonated(records) {
    if (!records || records.length === 0) {
        return 0;
    }

    return records.reduce((total, record) => {
        return total + (record.penaltyAmount || 0);
    }, 0);
}

// ========================================
// COMPLETE STATUS
// ========================================

export function calculateNoFapStatus(records) {
    const cleanStreak = calculateCleanStreak(records);

    const basePenalty = calculateBasePenalty(records);

    const totalDonated = calculateTotalDonated(records);

    return {
        cleanStreak,
        basePenalty,
        totalDonated,
    };
}