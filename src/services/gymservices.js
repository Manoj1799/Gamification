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

    // Get the program for the requested day.
    const dayProgram =
        getDayProgram(day);

    // Return its exercises or an empty array.
    return dayProgram?.exercises || [];
}


// Get the default values for one exercise.
export function getExerciseDefaults(
    day,
    exerciseId
) {

    // Search every configured Gym day.
    //
    // This makes the exercise ID the true identity
    // of the exercise, regardless of which day it appears on.
    //
    // Example:
    // "lateral-raise" on Monday
    // "lateral-raise" on Thursday
    // are treated as the same exercise.
    //
    // Different IDs remain different exercises.
    const allDayPrograms =
        Object.values(gymProgram);

    // Start with no matching exercise.
    let exercise = null;

    // Search through every day's program.
    for (
        const dayProgram
        of allDayPrograms
    ) {

        // Get this day's exercises safely.
        const exercises =
            dayProgram?.exercises || [];

        // Find the requested exercise ID.
        exercise = exercises.find(
            (item) =>
                item.id === exerciseId
        );

        // Stop searching once found.
        if (exercise) {
            break;
        }
    }

    // Return null if the exercise does not exist.
    if (!exercise) {
        return null;
    }

    // Determine the default number of sets.
    const sets =
        Number(exercise.defaultSets) || 1;

    // Create one default rep value for every set.
    const reps = Array.from(
        { length: sets },
        () =>
            Number(
                exercise.defaultReps
            ) || 10
    );

    // Return the exercise defaults.
    return {
        weight:
            Number(
                exercise.defaultWeight
            ) || 0,

        sets,

        reps,
    };
}


// =========================================================
// REP / VOLUME LOGIC
// =========================================================


// Calculate the total number of repetitions.
export function calculateTotalReps(reps) {

    // Reps must always be an array.
    // Returning zero prevents reduce() from crashing.
    if (!Array.isArray(reps)) {
        return 0;
    }

    // Add all individual set repetitions together.
    return reps.reduce(
        (total, rep) =>
            total + (Number(rep) || 0),
        0
    );
}


// Calculate workout volume.
//
// Example:
//
// weight = 40
// reps = [10, 10, 8]
//
// volume = 40 × (10 + 10 + 8)
//        = 1120
export function calculateVolume(
    weight,
    sets,
    reps
) {

    // Volume is weight multiplied by total reps.
    return (
        (Number(weight) || 0) *
        calculateTotalReps(reps)
    );
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
    sets,
    reps,
    form,
}) {

    // Make sure Sets is always a valid number.
    const safeSets =
        Number(sets) || 1;

    // Make sure reps is always an array.
    const safeReps =
        Array.isArray(reps)
            ? reps
                .slice(0, safeSets)
                .map(
                    (rep) =>
                        Math.max(
                            1,
                            Number(rep) || 1
                        )
                )
            : Array.from(
                {
                    length: safeSets,
                },
                () => 10
            );

    // Make sure there is one rep value
    // for every set.
    while (
        safeReps.length <
        safeSets
    ) {

        // Use the previous set's reps when possible.
        safeReps.push(
            safeReps.length > 0
                ? safeReps[
                safeReps.length - 1
                ]
                : 10
        );
    }

    // Calculate and permanently store the volume.
    const volume =
        calculateVolume(
            weight,
            safeSets,
            safeReps
        );

    // Every saved workout gets its own permanent ID.
    const id =
        `${exerciseId}-${Date.now()}`;

    // Create the complete session record.
    const session = {
        id,
        date,
        day,
        exerciseId,
        exerciseName,
        weight,
        sets: safeSets,
        reps: safeReps,
        form,
        volume,
    };

    // Store the session permanently in IndexedDB.
    await saveGymRecord(session);

    // Return the saved session.
    return session;
}


// =========================================================
// HISTORY LOGIC
// =========================================================


// Load every Gym session.
export async function loadAllGymSessions() {

    // Do not limit this list.
    // IndexedDB keeps the complete workout history.
    const sessions =
        await getAllGymRecords();

    // Keep history in chronological order.
    return sessions.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );
}


// Load history for one exercise.
export async function loadExerciseHistory(
    exerciseId
) {

    // Load the complete Gym history.
    const sessions =
        await loadAllGymSessions();

    // Return every session with the same exercise ID.
    //
    // Same ID = same exercise history.
    //
    // Different ID = separate exercise history.
    return sessions.filter(
        (session) =>
            session.exerciseId === exerciseId
    );
}