
// Import React state management.
import { useMemo, useState } from "react";

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
    const [selectedExercise, setSelectedExercise] =
        useState(null);

    // Temporary values for the current session.
    const [sessionValues, setSessionValues] =
        useState(null);

    // Historical sessions for the selected exercise.
    const [history, setHistory] = useState([]);

    // Loading state while history is being loaded.
    const [isLoading, setIsLoading] = useState(false);

    // Saved confirmation state.
    const [saved, setSaved] = useState(false);


    // =====================================================
    // OPEN EXERCISE
    // =====================================================

    const openExercise = async (exercise) => {

        // Select the exercise.
        setSelectedExercise(exercise);

        // Reset saved state for the new session.
        setSaved(false);

        // Start loading exercise history.
        setIsLoading(true);

        try {

            // Load all previously saved sessions for this exercise.
            const sessions = await loadExerciseHistory(
                exercise.id
            );

            // Keep the complete history for Session History and the chart.
            setHistory(sessions);

            // Get the code-controlled defaults.
            const defaults = getExerciseDefaults(
                todayKey,
                exercise.id
            );

            // Use the most recently saved session when available.
            const lastSession =
                sessions.length > 0
                    ? sessions[sessions.length - 1]
                    : null;


            // -------------------------------------------------
            // DETERMINE SETS
            // -------------------------------------------------

            const sets =
                Number(lastSession?.sets) ||
                Number(defaults?.sets) ||
                1;


            // -------------------------------------------------
            // DETERMINE PER-SET REPS
            // -------------------------------------------------

            let reps;

            // Saved sessions must contain an array of reps.
            if (Array.isArray(lastSession?.reps)) {

                reps = lastSession.reps.slice(0, sets);

            } else {

                // New session:
                // create one rep value for every set.
                reps = Array.from(
                    { length: sets },
                    () => Number(defaults?.reps) || 10
                );
            }


            // Make sure there is exactly one rep value
            // for every set.
            while (reps.length < sets) {

                reps.push(
                    reps.length > 0
                        ? reps[reps.length - 1]
                        : 10
                );
            }


            // Start the new session.
            setSessionValues({

                weight:
                    Number(lastSession?.weight) ||
                    Number(defaults?.weight) ||
                    0,

                sets,

                reps,

                // Always reset Form to Good.
                form: "good",
            });

        } finally {

            // Stop loading state.
            setIsLoading(false);
        }
    };


    // =====================================================
    // CLOSE EXERCISE
    // =====================================================

    const closeExercise = () => {

        // Return to the exercise list.
        setSelectedExercise(null);

        // Clear temporary session values.
        setSessionValues(null);

        // Clear displayed history.
        setHistory([]);

        // Reset saved state.
        setSaved(false);
    };


    // =====================================================
    // UPDATE SESSION VALUE
    // =====================================================

    const updateSessionValue = (key, value) => {

        // Update only the requested session value.
        setSessionValues((current) => ({
            ...current,
            [key]: value,
        }));
    };


    // =====================================================
    // UPDATE SETS
    // =====================================================

    const updateSets = (value) => {

        // Convert the Sets value to a number.
        const newSets = Math.max(
            1,
            Number(value) || 1
        );

        // Update Sets and automatically adjust the
        // per-set reps array to match.
        setSessionValues((current) => {

            // Keep existing reps only when they are an array.
            const currentReps =
                Array.isArray(current?.reps)
                    ? current.reps
                    : [];

            // Use the last existing rep value when
            // creating a newly added set.
            const fallbackRep =
                currentReps.length > 0
                    ? currentReps[currentReps.length - 1]
                    : 10;

            // Copy existing reps.
            const updatedReps =
                currentReps.slice(0, newSets);

            // Add reps for newly created sets.
            while (updatedReps.length < newSets) {

                updatedReps.push(
                    fallbackRep
                );
            }

            return {
                ...current,
                sets: newSets,
                reps: updatedReps,
            };
        });
    };


    // =====================================================
    // UPDATE INDIVIDUAL SET REPS
    // =====================================================

    const updateSetReps = (index, value) => {

        // Convert the new rep count to a valid number.
        const newReps = Math.max(
            1,
            Number(value) || 1
        );

        // Update only the selected set's reps.
        setSessionValues((current) => {

            // Reps must always be an array.
            const currentReps =
                Array.isArray(current?.reps)
                    ? current.reps
                    : [];

            const updatedReps = [
                ...currentReps,
            ];

            updatedReps[index] = newReps;

            return {
                ...current,
                reps: updatedReps,
            };
        });
    };


    // =====================================================
    // SAVE SESSION
    // =====================================================

    const handleSaveSession = async () => {

        // Do nothing if an exercise/session is not selected.
        if (!selectedExercise || !sessionValues) {
            return;
        }

        // Make absolutely sure reps is an array.
        const reps =
            Array.isArray(sessionValues.reps)
                ? sessionValues.reps
                : Array.from(
                    {
                        length:
                            Number(sessionValues.sets) || 1,
                    },
                    () => 10
                );

        // Save the completed exercise session.
        await saveExerciseSession({

            date: new Date().toISOString(),

            day: todayKey,

            exerciseId: selectedExercise.id,

            exerciseName: selectedExercise.name,

            weight: sessionValues.weight,

            sets: sessionValues.sets,

            reps,

            form: sessionValues.form,
        });

        // Reload the exercise history.
        const updatedHistory =
            await loadExerciseHistory(
                selectedExercise.id
            );

        setHistory(updatedHistory);

        // Show saved confirmation.
        setSaved(true);
    };


    // =====================================================
    // EXERCISE DETAIL SCREEN
    // =====================================================

    if (selectedExercise) {

        // Calculate the current unsaved volume.
        const currentVolume = calculateVolume(
            sessionValues?.weight,
            sessionValues?.sets,
            sessionValues?.reps
        );

        return (
            <main className="min-h-screen w-full overflow-x-hidden bg-white pb-24">

                <div className="mx-auto w-full max-w-md">

                    {/* Exercise header. */}
                    <header className="w-full border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">

                        {/* Back button. */}
                        <button
                            type="button"
                            onClick={closeExercise}
                            className="mb-4 flex min-h-10 items-center gap-2 rounded-xl text-sm font-bold text-slate-500"
                        >
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </button>

                        {/* Exercise identity. */}
                        <div className="flex w-full items-center gap-3">

                            {/* Exercise icon. */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                <Dumbbell size={19} />
                            </div>

                            {/* Exercise name and day. */}
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


                    {/* Main exercise content. */}
                    <section className="w-full space-y-5 px-3 py-5 sm:px-5 sm:py-6">

                        {/* =====================================================
                            TODAY'S SESSION CONTROLS
                        ===================================================== */}

                        <div className="w-full">

                            <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                Today's Session
                            </h2>

                            <div className="w-full space-y-2">

                                {/* Weight row. */}
                                <div className="w-full">
                                    <NumberControl
                                        label="Weight"
                                        value={
                                            sessionValues?.weight ?? 0
                                        }
                                        step={2.5}
                                        min={0}
                                        onChange={(value) =>
                                            updateSessionValue(
                                                "weight",
                                                value
                                            )
                                        }
                                    />
                                </div>


                                {/* Sets control. */}
                                <div className="w-full">
                                    <NumberControl
                                        label="Sets"
                                        value={
                                            sessionValues?.sets ?? 1
                                        }
                                        step={1}
                                        min={1}
                                        onChange={updateSets}
                                    />
                                </div>


                                {/* Individual reps controls. */}
                                <div className="w-full space-y-2">

                                    <div className="text-xs font-bold text-slate-400">
                                        Reps
                                    </div>

                                    {Array.isArray(
                                        sessionValues?.reps
                                    ) &&
                                        sessionValues.reps.map(
                                            (rep, index) => (

                                                <div
                                                    key={index}
                                                    className="w-full"
                                                >

                                                    <NumberControl
                                                        label={`R${ index + 1 } `}
                                                        value={rep}
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
                                            )
                                        )}

                                </div>

                            </div>

                        </div>


                        {/* Form selection. */}
                        <div className="w-full">

                            <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                Form
                            </h2>

                            <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">

                                {/* Good form. */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateSessionValue(
                                            "form",
                                            "good"
                                        )
                                    }
                                    className={`min - h - 12 w - full rounded - 2xl px - 3 py - 3 text - sm font - black transition active: scale - [0.98] ${
    sessionValues?.form === "good"
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-500"
} `}
                                >
                                    Good
                                </button>


                                {/* Bad form. */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateSessionValue(
                                            "form",
                                            "bad"
                                        )
                                    }
                                    className={`min - h - 12 w - full rounded - 2xl px - 3 py - 3 text - sm font - black transition active: scale - [0.98] ${
    sessionValues?.form === "bad"
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-500"
} `}
                                >
                                    Bad
                                </button>

                            </div>

                        </div>


                        {/* Current volume. */}
                        <div className="w-full rounded-2xl bg-slate-900 p-4 text-white sm:p-5">

                            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                                Session Volume
                            </div>

                            <div className="mt-1 break-words text-2xl font-black sm:text-3xl">
                                {currentVolume}
                            </div>

                            <div className="mt-1 text-xs text-slate-400">
                                Weight × total reps
                            </div>

                        </div>


                        {/* Save session button. */}
                        <button
                            type="button"
                            onClick={handleSaveSession}
                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition active:scale-[0.98] sm:py-4"
                        >
                            <Check size={18} />

                            <span>
                                {saved
                                    ? "Session Saved"
                                    : "Save Session"}
                            </span>
                        </button>


                        {/* Progress chart. */}
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

                                    <VolumeChart
                                        sessions={history}
                                    />

                                </div>

                            )}

                        </div>


                        {/* Session history. */}
                        {history.length > 0 && (

                            <div className="w-full">

                                <h2 className="mb-3 text-base font-black text-slate-900 sm:text-lg">
                                    Session History
                                </h2>

                                <div className="w-full space-y-2">

                                    {[...history]
                                        .reverse()
                                        .map((session) => (

                                            <div
                                                key={session.id}
                                                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 sm:p-4"
                                            >

                                                {/* Session details. */}
                                                <div className="min-w-0 flex-1">

                                                    {/* Session date. */}
                                                    <div className="truncate text-sm font-black text-slate-900">
                                                        {new Date(
                                                            session.date
                                                        ).toLocaleDateString()}
                                                    </div>


                                                    {/* Weight × individual set reps. */}
                                                    <div className="mt-1 truncate text-xs font-medium text-slate-400">

                                                        {session.weight} ×{" "}

                                                        {Array.isArray(
                                                            session.reps
                                                        )
                                                            ? session.reps.join(
                                                                " + "
                                                            )
                                                            : "—"}

                                                    </div>


                                                    {/* Saved form. */}
                                                    <div className="mt-1 text-xs font-bold text-slate-500">

                                                        Form:{" "}

                                                        {session.form === "bad"
                                                            ? "Bad"
                                                            : "Good"}

                                                    </div>

                                                </div>


                                                {/* Session volume. */}
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

                {/* Gym header. */}
                <header className="w-full px-4 pb-5 pt-6 sm:px-5 sm:pb-6 sm:pt-8">

                    {/* Gym label. */}
                    <div className="mb-2 flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 sm:text-sm">

                        <Dumbbell
                            size={15}
                            className="shrink-0"
                        />

                        <span className="truncate">
                            Gym
                        </span>

                    </div>


                    {/* Today's day. */}
                    <h1 className="truncate text-2xl font-black text-slate-900 sm:text-3xl">
                        {todayProgram?.name || "Rest Day"}
                    </h1>


                    {/* Subtitle. */}
                    <p className="mt-1 truncate text-sm font-medium text-slate-400">
                        Today's workout
                    </p>

                </header>


                {/* Today's exercise list. */}
                <section className="w-full px-3 sm:px-5">

                    {todayExercises.length === 0 ? (

                        /* Rest day. */
                        <div className="w-full rounded-3xl bg-slate-50 p-7 text-center sm:p-8">

                            <div className="text-lg font-black text-slate-900 sm:text-xl">
                                Rest Day
                            </div>

                            <div className="mt-2 text-sm text-slate-400">
                                No exercises are scheduled today.
                            </div>

                        </div>

                    ) : (

                        /* Today's exercises. */
                        <div className="w-full space-y-2.5 sm:space-y-3">

                            {todayExercises.map((exercise) => (

                                <button
                                    key={exercise.id}
                                    type="button"
                                    onClick={() =>
                                        openExercise(
                                            exercise
                                        )
                                    }
                                    className="flex min-h-16 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition active:scale-[0.99] sm:rounded-3xl sm:p-5"
                                >

                                    {/* Exercise information. */}
                                    <div className="min-w-0 flex-1">

                                        <div className="truncate text-sm font-black text-slate-900 sm:text-base">
                                            {exercise.name}
                                        </div>

                                        <div className="mt-1.5 truncate text-[11px] font-bold text-slate-400 sm:text-xs">

                                            {exercise.defaultWeight} kg ·{" "}

                                            {exercise.defaultSets} sets ·{" "}

                                            {exercise.defaultReps} reps

                                        </div>

                                    </div>


                                    {/* Arrow. */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 sm:h-10 sm:w-10">

                                        <ChevronRight
                                            size={17}
                                        />

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

