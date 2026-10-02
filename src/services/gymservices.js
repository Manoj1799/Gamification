// Import IndexedDB functions used by the Gym system.
import {
    getAllGymRecords,
    saveGymRecord,
} from "../data/database";

// Import the code-controlled Gym program.
import gymProgram from "../data/gym";


// =========================================================
// DAY / PROGRAM LOGIC
// =========================================================

// Get today's Gym program key.
export function getTodayKey() {
    // JavaScript uses Sunday = 0 through Saturday = 6.
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    // Return the real current day.
    return days[new Date().getDay()];
}


// Get the configured program for a specific day.
export function getDayProgram(day) {
    return gymProgram[day] || null;
}


// Get all exercises configured for a specific day.
export function getExercisesForDay(day) {
    const dayProgram = getDayProgram(day);
    return dayProgram?.exercises || [];
}


// Get the default values for one exercise.
export function getExerciseDefaults(day, exerciseId) {
    const allDayPrograms = Object.values(gymProgram);

    let exercise = null;

    for (const dayProgram of allDayPrograms) {
        const exercises = dayProgram?.exercises || [];

        exercise = exercises.find((item) => item.id === exerciseId);

        if (exercise) {
            break;
        }
    }

    if (!exercise) {
        return null;
    }

    const sets = Number(exercise.defaultSets) || 1;

    // Create default rep values for every set.
    const reps = Array.from(
        { length: sets },
        () => Number(exercise.defaultReps) || 10
    );

    // Create default weight values for every set.
    const defaultWeightValue = Number(exercise.defaultWeight) || 0;
    const weights = Array.from(
        { length: sets },
        () => defaultWeightValue
    );

    return {
        weight: defaultWeightValue,
        weights,
        sets,
        reps,
    };
}


// =========================================================
// REP / VOLUME LOGIC
// =========================================================

// Calculate the total number of repetitions.
export function calculateTotalReps(reps) {
    if (!Array.isArray(reps)) {
        return 0;
    }

    return reps.reduce(
        (total, rep) => total + (Number(rep) || 0),
        0
    );
}


// Calculate workout volume.
//
// Supports:
// 1. Array of weights per set: weights = [40, 42.5, 45], reps = [10, 10, 8]
//    volume = (40 * 10) + (42.5 * 10) + (45 * 8) = 1185
//
// 2. Legacy single numeric weight: weight = 40, reps = [10, 10, 8]
//    volume = 40 * (10 + 10 + 8) = 1120
export function calculateVolume(weight, sets, reps) {
    if (!Array.isArray(reps)) {
        return 0;
    }

    // Per-set array calculation
    if (Array.isArray(weight)) {
        return reps.reduce((total, rep, index) => {
            const setWeight = Number(weight[index]) || 0;
            const setRep = Number(rep) || 0;
            return total + setWeight * setRep;
        }, 0);
    }

    // Legacy fallback (single weight multiplied by sum of reps)
    return (Number(weight) || 0) * calculateTotalReps(reps);
}


// =========================================================
// SESSION LOGIC
// =========================================================

// Save one completed exercise session.
export async function saveExerciseSession({
    date,
    day,
    exerciseId,
    exerciseName,
    weight,
    weights,
    sets,
    reps,
    form,
    volume: explicitVolume,
}) {
    // Make sure Sets is always a valid number.
    const safeSets = Number(sets) || 1;

    // Make sure reps is always an array matching safeSets.
    const safeReps = Array.isArray(reps)
        ? reps.slice(0, safeSets).map((rep) => Math.max(1, Number(rep) || 1))
        : Array.from({ length: safeSets }, () => 10);

    while (safeReps.length < safeSets) {
        safeReps.push(
            safeReps.length > 0 ? safeReps[safeReps.length - 1] : 10
        );
    }

    // Handle per-set weights safely.
    const rawWeights = Array.isArray(weights)
        ? weights
        : Array.isArray(weight)
        ? weight
        : Array.from({ length: safeSets }, () => Number(weight) || 0);

    const safeWeights = rawWeights
        .slice(0, safeSets)
        .map((w) => Math.max(0, Number(w) || 0));

    while (safeWeights.length < safeSets) {
        safeWeights.push(
            safeWeights.length > 0 ? safeWeights[safeWeights.length - 1] : 0
        );
    }

    // Calculate volume across all sets if not explicitly provided.
    const volume =
        explicitVolume !== undefined
            ? explicitVolume
            : calculateVolume(safeWeights, safeSets, safeReps);

    const id = `${exerciseId}-${Date.now()}`;

    const session = {
        id,
        date,
        day,
        exerciseId,
        exerciseName,
        weight: safeWeights[0] ?? 0, // Legacy fallback
        weights: safeWeights,
        sets: safeSets,
        reps: safeReps,
        form,
        volume,
    };

    await saveGymRecord(session);

    return session;
}


// =========================================================
// HISTORY LOGIC
// =========================================================

// Load every Gym session.
export async function loadAllGymSessions() {
    const sessions = await getAllGymRecords();

    return sessions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
}


// Load history for one exercise.
export async function loadExerciseHistory(exerciseId) {
    const sessions = await loadAllGymSessions();

    return sessions.filter((session) => session.exerciseId === exerciseId);
}