// Import React state management.
import { useEffect, useMemo, useState } from "react";

// Import icons used by the Gym interface.
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Dumbbell,
} from "lucide-react";

// Import the reusable Gym UI components.
import NumberControl from "../components/gym/NumberControl";
import VolumeChart from "../components/gym/VolumeChart";

// Import Gym logic/services.
import {
    calculateVolume,
    getDayProgram,
    getExerciseDefaults,
    getExercisesForDay,
    getTodayKey,
    loadAllGymSessions,
    loadExerciseHistory,
    saveExerciseSession,
} from "../services/gymservices";

// =========================================================
// GYM PAGE
// =========================================================

export default function Gym() {
    // Get today's configured Gym day.
    const todayKey = getTodayKey();

    // Get today's configured program.
    const todayProgram = getDayProgram(todayKey);

    // Get today's exercises.
    const todayExercises = useMemo(
        () => getExercisesForDay(todayKey),
        [todayKey]
    );

    // Currently selected exercise.
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Temporary values for the current session.
    const [sessionValues, setSessionValues] = useState(null);

    // Historical sessions for the selected exercise.
    const [history, setHistory] = useState([]);

    // Loading state while history is being loaded.
    const [isLoading, setIsLoading] = useState(false);

    // Saved confirmation state.
    const [saved, setSaved] = useState(false);

    // Track which exercises are completed today across the full program.
    const [completedExerciseIds, setCompletedExerciseIds] = useState(new Set());

    // Refresh completed exercise IDs for today.
    const refreshCompletedToday = async () => {
        try {
            const allSessions = await loadAllGymSessions();
            const todayStr = new Date().toDateString();

            const completed = new Set(
                allSessions
                    .filter(
                        (session) =>
                            new Date(session.date).toDateString() === todayStr
                    )
                    .map((session) => session.exerciseId)
            );

            setCompletedExerciseIds(completed);
        } catch (error) {
            console.error("Failed to load completed sessions:", error);
        }
    };

    // Load completed status on initial page render.
    useEffect(() => {
        refreshCompletedToday();
    }, []);

    // Check if the currently opened exercise already has a session recorded today.
    const isAlreadySavedToday = useMemo(() => {
        const todayStr = new Date().toDateString();
        return (
            Array.isArray(history) &&
            history.some(
                (session) => new Date(session.date).toDateString() === todayStr
            )
        );
    }, [history]);

    // =====================================================
    // OPEN EXERCISE
    // =====================================================

    const openExercise = async (exercise) => {
        setSelectedExercise(exercise);
        setSaved(false);
        setIsLoading(true);

        try {
            const sessions = await loadExerciseHistory(exercise.id);
            setHistory(sessions);

            const defaults = getExerciseDefaults(todayKey, exercise.id);

            const lastSession =
                sessions.length > 0 ? sessions[sessions.length - 1] : null;

            // Determine Sets count
            const sets =
                Number(lastSession?.sets) ||
                Number(defaults?.sets) ||
                1;

            // Determine Per-Set Reps
            let reps;
            if (Array.isArray(lastSession?.reps)) {
                reps = lastSession.reps.slice(0, sets);
            } else {
                reps = Array.from(
                    { length: sets },
                    () => Number(defaults?.reps) || 10
                );
            }
            while (reps.length < sets) {
                reps.push(reps.length > 0 ? reps[reps.length - 1] : 10);
            }

            // Determine Per-Set Weights (supporting legacy single weight or array)
            const defaultWeightValue =
                Number(lastSession?.weight) ||
                Number(defaults?.weight) ||
                0;

            let weights;
            if (Array.isArray(lastSession?.weights)) {
                weights = lastSession.weights.slice(0, sets);
            } else {
                weights = Array.from(
                    { length: sets },
                    () => defaultWeightValue
                );
            }
            while (weights.length < sets) {
                weights.push(
                    weights.length > 0
                        ? weights[weights.length - 1]
                        : defaultWeightValue
                );
            }

            // Initialize active session
            setSessionValues({
                sets,
                weights,
                reps,
                form: "good",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // =====================================================
    // CLOSE EXERCISE
    // =====================================================

    const closeExercise = () => {
        setSelectedExercise(null);
        setSessionValues(null);
        setHistory([]);
        setSaved(false);
    };

    // =====================================================
    // UPDATE SESSION VALUE
    // =====================================================

    const updateSessionValue = (key, value) => {
        setSessionValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    // =====================================================
    // UPDATE SETS (Controls both Reps and Weights arrays)
    // =====================================================

    const updateSets = (value) => {
        const newSets = Math.max(1, Number(value) || 1);

        setSessionValues((current) => {
            const currentReps = Array.isArray(current?.reps)
                ? current.reps
                : [];
            const fallbackRep =
                currentReps.length > 0
                    ? currentReps[currentReps.length - 1]
                    : 10;
            const updatedReps = currentReps.slice(0, newSets);
            while (updatedReps.length < newSets) {
                updatedReps.push(fallbackRep);
            }

            const currentWeights = Array.isArray(current?.weights)
                ? current.weights
                : [];
            const fallbackWeight =
                currentWeights.length > 0
                    ? currentWeights[currentWeights.length - 1]
                    : 0;
            const updatedWeights = currentWeights.slice(0, newSets);
            while (updatedWeights.length < newSets) {
                updatedWeights.push(fallbackWeight);
            }

            return {
                ...current,
                sets: newSets,
                reps: updatedReps,
                weights: updatedWeights,
            };
        });
    };

    // =====================================================
    // UPDATE INDIVIDUAL SET WEIGHT
    // =====================================================

    const updateSetWeight = (index, value) => {
        const newWeight = Math.max(0, Number(value) || 0);

        setSessionValues((current) => {
            const currentWeights = Array.isArray(current?.weights)
                ? [...current.weights]
                : [];
            currentWeights[index] = newWeight;

            return {
                ...current,
                weights: currentWeights,
            };
        });
    };

    // =====================================================
    // UPDATE INDIVIDUAL SET REPS
    // =====================================================

    const updateSetReps = (index, value) => {
        const newReps = Math.max(1, Number(value) || 1);

        setSessionValues((current) => {
            const currentReps = Array.isArray(current?.reps)
                ? [...current.reps]
                : [];
            currentReps[index] = newReps;

            return {
                ...current,
                reps: currentReps,
            };
        });
    };

    // =====================================================
    // SAVE SESSION
    // =====================================================

    const handleSaveSession = async () => {
        if (!selectedExercise || !sessionValues || isAlreadySavedToday) return;

        const setCount = Number(sessionValues.sets) || 1;

        const reps = Array.isArray(sessionValues.reps)
            ? sessionValues.reps
            : Array.from({ length: setCount }, () => 10);

        const weights = Array.isArray(sessionValues.weights)
            ? sessionValues.weights
            : Array.from({ length: setCount }, () => 0);

        // Calculate session volume safely for varied set weights
        const sessionVolume = weights.reduce(
            (acc, w, i) => acc + (Number(w) || 0) * (Number(reps[i]) || 0),
            0
        );

        await saveExerciseSession({
            date: new Date().toISOString(),
            day: todayKey,
            exerciseId: selectedExercise.id,
            exerciseName: selectedExercise.name,
            weight: weights[0] ?? 0, // Fallback for single-weight schema
            weights,
            sets: setCount,
            reps,
            volume: sessionVolume,
            form: sessionValues.form,
        });

        const updatedHistory = await loadExerciseHistory(selectedExercise.id);
        setHistory(updatedHistory);
        setSaved(true);

        // Instantly mark exercise finished on the outer list
        refreshCompletedToday();
    };

    // =====================================================
    // EXERCISE DETAIL SCREEN
    // =====================================================

    if (selectedExercise) {
        // Compute volume across all individual set weights and reps
        const currentVolume = Array.isArray(sessionValues?.weights)
            ? sessionValues.weights.reduce(
                  (total, w, i) =>
                      total +
                      (Number(w) || 0) *
                          (Number(sessionValues?.reps?.[i]) || 0),
                  0
              )
            : calculateVolume(
                  sessionValues?.weight,
                  sessionValues?.sets,
                  sessionValues?.reps
              );

        return (
            <main className="min-h-screen w-full overflow-x-hidden bg-white pb-24">
                <div className="mx-auto w-full max-w-md">
                    {/* Header */}
                    <header className="w-full border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">
                        <button
                            type="button"
                            onClick={closeExercise}
                            className="mb-4 flex min-h-10 items-center gap-2 rounded-xl text-sm font-bold text-slate-500"
                        >
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </button>

                        <div className="flex w-full items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                <Dumbbell size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-lg font-black text-slate-900 sm:text-2xl">
                                    {selectedExercise.name}
                                </h1>
                                <p className="mt-0.5 truncate text-xs font-medium text-slate-400 sm:text-sm">
                                    {todayProgram?.name}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Main Exercise Content */}
                    <section className="w-full space-y-5 px-3 py-5 sm:px-5 sm:py-6">
                        <div className="w-full">
                            <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                Today's Session
                            </h2>

                            <div className="w-full space-y-3">
                                {/* Sets control */}
                                <div className="w-full">
                                    <NumberControl
                                        label="Sets"
                                        value={sessionValues?.sets ?? 1}
                                        step={1}
                                        min={1}
                                        onChange={updateSets}
                                    />
                                </div>

                                {/* Per-Set Controls: Weights (W1..) and Reps (R1..) */}
                                <div className="w-full space-y-2.5">
                                    <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400">
                                        <span>Weight (kg)</span>
                                        <span>Reps</span>
                                    </div>

                                    {Array.from({
                                        length: sessionValues?.sets ?? 1,
                                    }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="grid w-full grid-cols-2 items-center gap-3"
                                        >
                                            {/* Set Weight */}
                                            <NumberControl
                                                label={`W${index + 1}`}
                                                value={
                                                    sessionValues?.weights?.[
                                                        index
                                                    ] ?? 0
                                                }
                                                step={2.5}
                                                min={0}
                                                onChange={(value) =>
                                                    updateSetWeight(
                                                        index,
                                                        value
                                                    )
                                                }
                                            />

                                            {/* Set Reps */}
                                            <NumberControl
                                                label={`R${index + 1}`}
                                                value={
                                                    sessionValues?.reps?.[
                                                        index
                                                    ] ?? 1
                                                }
                                                step={1}
                                                min={1}
                                                onChange={(value) =>
                                                    updateSetReps(
                                                        index,
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Selection */}
                        <div className="w-full">
                            <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                Form
                            </h2>

                            <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateSessionValue("form", "good")
                                    }
                                    className={`min-h-12 w-full rounded-2xl px-3 py-3 text-sm font-black transition active:scale-[0.98] ${
                                        sessionValues?.form === "good"
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    Good
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateSessionValue("form", "bad")
                                    }
                                    className={`min-h-12 w-full rounded-2xl px-3 py-3 text-sm font-black transition active:scale-[0.98] ${
                                        sessionValues?.form === "bad"
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    Bad
                                </button>
                            </div>
                        </div>

                        {/* Volume Display */}
                        <div className="w-full rounded-2xl bg-slate-900 p-4 text-white sm:p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                                Session Volume
                            </div>
                            <div className="mt-1 break-words text-2xl font-black sm:text-3xl">
                                {currentVolume}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                                Total kg lifted across all sets
                            </div>
                        </div>

                        {/* Save Session Button */}
                        <button
                            type="button"
                            disabled={isAlreadySavedToday}
                            onClick={handleSaveSession}
                            className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition sm:py-4 ${
                                isAlreadySavedToday
                                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                    : "bg-slate-900 text-white active:scale-[0.98]"
                            }`}
                        >
                            <Check size={18} />
                            <span>
                                {isAlreadySavedToday
                                    ? "Completed Today"
                                    : saved
                                    ? "Session Saved"
                                    : "Save Session"}
                            </span>
                        </button>

                        {/* Progress Chart */}
                        <div className="w-full">
                            <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                Progress
                            </h2>

                            {isLoading ? (
                                <div className="w-full rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-400">
                                    Loading history...
                                </div>
                            ) : (
                                <div className="w-full overflow-hidden">
                                    <VolumeChart sessions={history} />
                                </div>
                            )}
                        </div>

                        {/* Session History List */}
                        {history.length > 0 && (
                            <div className="w-full">
                                <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                    Session History
                                </h2>

                                <div className="w-full space-y-2">
                                    {[...history].reverse().map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 sm:p-4"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-black text-slate-900">
                                                    {new Date(
                                                        session.date
                                                    ).toLocaleDateString()}
                                                </div>

                                                {/* Displays set breakdown or legacy single weight */}
                                                <div className="mt-1 truncate text-xs font-medium text-slate-400">
                                                    {Array.isArray(session.weights)
                                                        ? session.weights.join(" / ") + " kg"
                                                        : `${session.weight} kg`}{" "}
                                                    ×{" "}
                                                    {Array.isArray(session.reps)
                                                        ? session.reps.join(" + ")
                                                        : "—"}
                                                </div>

                                                <div className="mt-1 text-xs font-bold text-slate-500">
                                                    Form:{" "}
                                                    {session.form === "bad"
                                                        ? "Bad"
                                                        : "Good"}
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <div className="text-sm font-black text-slate-900">
                                                    {session.volume}
                                                </div>
                                                <div className="text-[9px] font-bold uppercase text-slate-400">
                                                    volume
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        );
    }

    // =====================================================
    // TODAY'S EXERCISE LIST
    // =====================================================

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-white pb-24">
            <div className="mx-auto w-full max-w-md">
                <header className="w-full px-4 pb-5 pt-6 sm:px-5 sm:pb-6 sm:pt-8">
                    <div className="mb-2 flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 sm:text-sm">
                        <Dumbbell size={15} className="shrink-0" />
                        <span className="truncate">Gym</span>
                    </div>

                    <h1 className="truncate text-2xl font-black text-slate-900 sm:text-3xl">
                        {todayProgram?.name || "Rest Day"}
                    </h1>

                    <p className="mt-1 truncate text-sm font-medium text-slate-400">
                        Today's workout
                    </p>
                </header>

                <section className="w-full px-3 sm:px-5">
                    {todayExercises.length === 0 ? (
                        <div className="w-full rounded-3xl bg-slate-50 p-7 text-center sm:p-8">
                            <div className="text-lg font-black text-slate-900 sm:text-xl">
                                Rest Day
                            </div>
                            <div className="mt-2 text-sm text-slate-400">
                                No exercises are scheduled today.
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-2.5 sm:space-y-3">
                            {todayExercises.map((exercise) => {
                                const isCompleted = completedExerciseIds.has(
                                    exercise.id
                                );

                                return (
                                    <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => openExercise(exercise)}
                                        className={`flex min-h-16 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border p-3.5 text-left shadow-sm transition active:scale-[0.99] sm:rounded-3xl sm:p-5 ${
                                            isCompleted
                                                ? "border-emerald-200 bg-emerald-50/60"
                                                : "border-slate-100 bg-white"
                                        }`}
                                    >  
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`break-words text-sm font-black sm:text-base ${
                                                        isCompleted
                                                            ? "text-emerald-950"
                                                            : "text-slate-900"
                                                    }`}
                                                >
                                                    {exercise.name}
                                                </span>

                                                {isCompleted && (
                                                    <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                                                        Done
                                                    </span>
                                                )}
                                            </div>


                                        </div>

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition sm:h-10 sm:w-10 ${
                                                isCompleted
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <ChevronRight size={17} />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}