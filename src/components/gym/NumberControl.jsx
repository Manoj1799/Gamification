
// Import the icons used by the number controls.
import {
    Minus,
    Plus,
} from "lucide-react";


// =========================================================
// NUMBER CONTROL
// =========================================================

// Number control designed to keep decimal values such as
// 34.5 completely visible on narrow mobile screens.
export default function NumberControl({
    label,
    value,
    step,
    min,
    onChange,
}) {
    // Increase the current value.
    const increase = () => {
        onChange(Number(value) + step);
    };

    // Decrease the current value without going below min.
    const decrease = () => {
        onChange(
            Math.max(
                min,
                Number(value) - step
            )
        );
    };

    return (
        <div className="w-full min-w-0 rounded-xl bg-slate-50 p-1 sm:rounded-2xl sm:p-3">

            {/* Control label. */}
            <div className="mb-1 text-center text-[8px] font-black uppercase tracking-tight text-slate-400 sm:mb-2 sm:text-[10px]">
                {label}
            </div>

            {/* Number controls. */}
            <div className="flex w-full items-center">

                {/* Decrease button. */}
                <button
                    type="button"
                    onClick={decrease}
                    className="flex h-8 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm active:scale-95 sm:h-9 sm:w-9 sm:rounded-lg"
                >
                    <Minus size={13} />
                </button>

                {/* Value gets the majority of the available width. */}
                <div className="flex min-w-0 flex-1 items-center justify-center px-0.5 text-center text-[14px] font-black leading-none tabular-nums text-slate-900 sm:text-lg">
                    {value}
                </div>

                {/* Increase button. */}
                <button
                    type="button"
                    onClick={increase}
                    className="flex h-8 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm active:scale-95 sm:h-9 sm:w-9 sm:rounded-lg"
                >
                    <Plus size={13} />
                </button>

            </div>

        </div>
    );
}
