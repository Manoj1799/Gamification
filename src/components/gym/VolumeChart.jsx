
// =========================================================
// VOLUME CHART
// =========================================================

// Display the volume progression for an exercise.
export default function VolumeChart({
    sessions,
}) {
    // Only the latest 10 sessions are displayed.
    // Older sessions remain stored in IndexedDB.
    const visibleSessions =
        sessions.slice(-10);

    // Show an empty state when there is no history.
    if (visibleSessions.length === 0) {
        return (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-400">
                No sessions yet.
            </div>
        );
    }

    // Extract volume values.
    const volumes =
        visibleSessions.map(
            (session) =>
                Number(session.volume) || 0
        );

    // Find the highest volume for chart scaling.
    const maxVolume =
        Math.max(...volumes, 1);

    // SVG dimensions.
    const width = 320;
    const height = 160;
    const padding = 20;

    // Calculate horizontal distance between points.
    const xStep =
        visibleSessions.length === 1
            ? 0
            : (width - padding * 2) /
            (visibleSessions.length - 1);

    // Convert sessions into SVG coordinates.
    const coordinates =
        visibleSessions.map(
            (session, index) => {

                // Calculate horizontal position.
                const x =
                    visibleSessions.length === 1
                        ? width / 2
                        : padding +
                        index * xStep;

                // Calculate vertical position.
                const y =
                    height -
                    padding -
                    (Number(session.volume) /
                        maxVolume) *
                    (height -
                        padding * 2);

                return {
                    session,
                    x,
                    y,
                };
            }
        );

    // Convert coordinates into SVG polyline points.
    const points =
        coordinates
            .map(
                ({ x, y }) =>
                    `${x},${y} `
            )
            .join(" ");

    return (
        <div className="rounded-2xl bg-slate-50 p-4">

            {/* Chart heading. */}
            <div className="mb-3 flex items-center justify-between">

                <div>
                    <div className="font-black text-slate-900">
                        Volume
                    </div>

                    <div className="text-xs text-slate-400">
                        Last {visibleSessions.length} sessions
                    </div>
                </div>

                {/* Latest volume. */}
                <div className="text-right">
                    <div className="text-lg font-black text-slate-900">
                        {
                            visibleSessions[
                                visibleSessions.length - 1
                            ].volume
                        }
                    </div>

                    <div className="text-[10px] font-bold uppercase text-slate-400">
                        latest
                    </div>
                </div>

            </div>

            {/* Responsive SVG chart. */}
            <svg
                viewBox={`0 0 ${width} ${height} `}
                className="h-40 w-full overflow-visible"
            >

                {/* Chart baseline. */}
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="currentColor"
                    className="text-slate-200"
                />

                {/* Volume line. */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-900"
                />

                {/* Data points with volume values. */}
                {coordinates.map(
                    ({
                        session,
                        x,
                        y,
                    }) => (
                        <g key={session.id}>

                            {/* Volume number displayed above each point. */}
                            <text
                                x={x}
                                y={Math.max(
                                    10,
                                    y - 9
                                )}
                                textAnchor="middle"
                                className="fill-slate-900 text-[8px] font-black"
                            >
                                {session.volume}
                            </text>

                            {/* Data point. */}
                            <circle
                                cx={x}
                                cy={y}
                                r="5"
                                className="fill-white stroke-slate-900"
                                strokeWidth="3"
                            />

                        </g>
                    )
                )}

            </svg>
        </div>
    );
}
