
// Data.jsx
// Business purpose:
// This page lets the user export, import, and back up LIFE GAME data.
// The layout intentionally follows the same mobile-first width structure
// used by the Gym page so the page fits correctly on phone screens.

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Database,
    Download,
    Upload,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Cloud,
    CloudUpload,
    Clock,
} from "lucide-react";

import {
    downloadDatabaseBackup,
    importDatabaseFromFile,
    exportDatabase,
} from "../data/database";

import {
    connectGoogleDrive,
    createGoogleDriveBackup,
    GOOGLE_DRIVE_REAUTH_REQUIRED,
} from "../services/googleDriveServices";


/* =========================================================
   GOOGLE DRIVE STORAGE KEYS
========================================================= */

// Business purpose:
// These keys preserve Google Drive connection and backup status
// across page reloads without storing the OAuth access token.
const GOOGLE_DRIVE_CONNECTED_KEY =
    "lifeGame.googleDrive.connected";

const GOOGLE_DRIVE_LAST_BACKUP_KEY =
    "lifeGame.googleDrive.lastBackupAt";

const GOOGLE_DRIVE_REAUTH_KEY =
    "lifeGame.googleDrive.reauthRequired";


/* =========================================================
   LAST BACKUP FORMATTER
========================================================= */

// Business purpose:
// Convert the stored timestamp into a readable date and time
// for the user's Backup page.
function formatLastBackup(timestamp) {
    if (!timestamp || timestamp === "0") {
        return "No backup yet";
    }

    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) {
        return "No backup yet";
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Data() {

    /* ---------------------------------------------------------
       FILE INPUT
    --------------------------------------------------------- */

    // Business purpose:
    // Keep the file picker hidden while allowing the Import button
    // to trigger it.
    const fileInputRef = useRef(null);


    /* ---------------------------------------------------------
       GENERAL UI STATE
    --------------------------------------------------------- */

    const [isLoading, setIsLoading] =
        useState(false);

    const [isGoogleBackupLoading, setIsGoogleBackupLoading] =
        useState(false);

    const [message, setMessage] =
        useState(null);


    /* ---------------------------------------------------------
       GOOGLE DRIVE STATE
    --------------------------------------------------------- */

    // Business purpose:
    // Remember whether the user has previously connected Google Drive.
    const [isGoogleConnected, setIsGoogleConnected] =
        useState(
            () =>
                localStorage.getItem(
                    GOOGLE_DRIVE_CONNECTED_KEY
                ) === "true"
        );


    // Business purpose:
    // Show a reconnect warning when the temporary Google OAuth
    // access token has expired and another user interaction is required.
    const [googleDriveNeedsReconnect, setGoogleDriveNeedsReconnect] =
        useState(
            () =>
                localStorage.getItem(
                    GOOGLE_DRIVE_REAUTH_KEY
                ) === "true"
        );


    /* ---------------------------------------------------------
       LAST BACKUP STATE
    --------------------------------------------------------- */

    // Business purpose:
    // Display the most recent successful Google Drive backup time.
    const [lastBackupAt, setLastBackupAt] =
        useState(
            () =>
                localStorage.getItem(
                    GOOGLE_DRIVE_LAST_BACKUP_KEY
                ) || "0"
        );


    /* =========================================================
       REFRESH LAST BACKUP TIME
    ========================================================= */

    // Business purpose:
    // Read the latest backup timestamp when this page opens.
    // This also allows the Data page to reflect backups performed
    // elsewhere in the application.
    useEffect(() => {
        const savedLastBackup =
            localStorage.getItem(
                GOOGLE_DRIVE_LAST_BACKUP_KEY
            ) || "0";

        setLastBackupAt(savedLastBackup);

        const savedConnected =
            localStorage.getItem(
                GOOGLE_DRIVE_CONNECTED_KEY
            ) === "true";

        setIsGoogleConnected(savedConnected);

        const savedReconnect =
            localStorage.getItem(
                GOOGLE_DRIVE_REAUTH_KEY
            ) === "true";

        setGoogleDriveNeedsReconnect(savedReconnect);
    }, []);


    /* =========================================================
       SAVE LAST BACKUP TIME
    ========================================================= */

    // Business purpose:
    // Store the successful backup time in localStorage so the
    // timestamp survives page reloads.
    const saveLastBackupTime = () => {
        const timestamp =
            String(Date.now());

        localStorage.setItem(
            GOOGLE_DRIVE_LAST_BACKUP_KEY,
            timestamp
        );

        setLastBackupAt(timestamp);
    };


    /* =========================================================
       EXPORT DATABASE
    ========================================================= */

    // Business purpose:
    // Create a local LIFE GAME backup file that the user can
    // download and keep independently of Google Drive.
    const handleExport = async () => {
        setMessage(null);
        setIsLoading(true);

        try {
            await downloadDatabaseBackup();

            setMessage({
                type: "success",
                text: "Database backup downloaded successfully.",
            });
        } catch (error) {
            console.error(
                "Failed to export database:",
                error
            );

            setMessage({
                type: "error",
                text: "Failed to create database backup.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    /* =========================================================
       IMPORT DATABASE
    ========================================================= */

    // Business purpose:
    // Replace the current local LIFE GAME data with the selected
    // backup file after explicit user confirmation.
    const handleImport = async (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setMessage(null);

        const confirmed =
            window.confirm(
                "Importing this backup will replace your current LIFE GAME data. Continue?"
            );

        if (!confirmed) {
            event.target.value = "";
            return;
        }

        setIsLoading(true);

        try {
            await importDatabaseFromFile(file);

            // Business purpose:
            // Imported data may differ from the previous Google Drive
            // backup, so force the next automatic backup to happen.
            localStorage.setItem(
                GOOGLE_DRIVE_LAST_BACKUP_KEY,
                "0"
            );

            setLastBackupAt("0");

            setMessage({
                type: "success",
                text: "Database imported successfully.",
            });
        } catch (error) {
            console.error(
                "Failed to import database:",
                error
            );

            setMessage({
                type: "error",
                text:
                    error?.message ||
                    "Failed to import database.",
            });
        } finally {
            setIsLoading(false);

            // Business purpose:
            // Clear the input so selecting the same file again
            // will still trigger the change event.
            event.target.value = "";
        }
    };


    /* =========================================================
       CONNECT / RECONNECT GOOGLE DRIVE
    ========================================================= */

    // Business purpose:
    // Reconnect the user's Google Drive account when the OAuth
    // access token has expired, then immediately create a backup.
    const handleConnectGoogleDrive = async () => {
        setMessage(null);
        setIsGoogleBackupLoading(true);

        try {
            await connectGoogleDrive();

            localStorage.setItem(
                GOOGLE_DRIVE_CONNECTED_KEY,
                "true"
            );

            localStorage.removeItem(
                GOOGLE_DRIVE_REAUTH_KEY
            );

            setIsGoogleConnected(true);
            setGoogleDriveNeedsReconnect(false);

            // Business purpose:
            // Back up the current LIFE GAME database immediately
            // after the user grants Google Drive access.
            const backup =
                await exportDatabase();

            await createGoogleDriveBackup(
                backup
            );

            saveLastBackupTime();

            setMessage({
                type: "success",
                text:
                    "Google Drive connected and LIFE GAME backup completed.",
            });
        } catch (error) {
            console.error(
                "Failed to connect Google Drive:",
                error
            );

            setMessage({
                type: "error",
                text:
                    error?.message ||
                    "Failed to connect Google Drive.",
            });
        } finally {
            setIsGoogleBackupLoading(false);
        }
    };


    /* =========================================================
       MANUAL GOOGLE DRIVE BACKUP
    ========================================================= */

    // Business purpose:
    // Create a manual Google Drive backup using the currently
    // available OAuth access token.
    const handleGoogleBackup = async () => {
        setMessage(null);
        setIsGoogleBackupLoading(true);

        try {
            const backup =
                await exportDatabase();

            await createGoogleDriveBackup(
                backup
            );

            localStorage.setItem(
                GOOGLE_DRIVE_CONNECTED_KEY,
                "true"
            );

            localStorage.removeItem(
                GOOGLE_DRIVE_REAUTH_KEY
            );

            setIsGoogleConnected(true);
            setGoogleDriveNeedsReconnect(false);

            saveLastBackupTime();

            setMessage({
                type: "success",
                text:
                    "LIFE GAME backup completed successfully.",
            });
        } catch (error) {
            console.error(
                "Failed to back up to Google Drive:",
                error
            );

            // Business purpose:
            // The frontend-only Google OAuth token expires, so the
            // user must reconnect through a button click rather than
            // opening an OAuth popup automatically.
            if (
                error?.code ===
                GOOGLE_DRIVE_REAUTH_REQUIRED
            ) {
                localStorage.setItem(
                    GOOGLE_DRIVE_REAUTH_KEY,
                    "true"
                );

                setGoogleDriveNeedsReconnect(
                    true
                );

                setMessage({
                    type: "warning",
                    text:
                        "Google Drive needs to be reconnected before another backup can be created.",
                });
            } else {
                setMessage({
                    type: "error",
                    text:
                        error?.message ||
                        "Failed to back up to Google Drive.",
                });
            }
        } finally {
            setIsGoogleBackupLoading(false);
        }
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-slate-950 pb-24">

            {/* ---------------------------------------------------
                MOBILE-FIRST CONTENT CONTAINER
                --------------------------------------------------- */}

            <div className="mx-auto w-full max-w-md min-w-0">

                {/* -------------------------------------------------
                    HEADER
                ------------------------------------------------- */}

                <header className="w-full min-w-0 px-4 pb-5 pt-6">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                            <Database
                                size={22}
                                className="text-white"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-xl font-black text-white">
                                Data & Backup
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                Manage your LIFE GAME data
                            </p>
                        </div>

                    </div>

                </header>


                {/* -------------------------------------------------
                    PAGE CONTENT
                ------------------------------------------------- */}

                <section className="w-full min-w-0 space-y-4 px-3 sm:px-5">


                    {/* =================================================
                       STATUS MESSAGE
                    ================================================= */}

                    {message && (
                        <div
                            className={`flex w - full min - w - 0 items - start gap - 3 overflow - hidden rounded - 2xl border p - 4 ${
    message.type === "success"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
        : message.type === "warning"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
            : "border-red-500/20 bg-red-500/10 text-red-300"
} `}
                        >

                            {message.type === "success" ? (
                                <CheckCircle
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />
                            ) : message.type === "warning" ? (
                                <AlertTriangle
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />
                            ) : (
                                <XCircle
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />
                            )}

                            <p className="min-w-0 flex-1 break-words text-sm font-semibold leading-5">
                                {message.text}
                            </p>

                        </div>
                    )}


                    {/* =================================================
                       DATA SAFETY CARD
                    ================================================= */}

                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                        <div className="flex min-w-0 items-start gap-3">

                            <ShieldCheck
                                size={22}
                                className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <div className="min-w-0 flex-1">

                                <h2 className="text-sm font-black text-emerald-300">
                                    Your data stays with you
                                </h2>

                                <p className="mt-1 break-words text-xs leading-5 text-emerald-200/70">
                                    LIFE GAME stores your personal progress
                                    locally in your browser. Backups give
                                    you an additional way to protect it.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       GOOGLE DRIVE BACKUP
                    ================================================= */}

                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">

                        <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

                                <Cloud
                                    size={20}
                                    className="text-blue-400"
                                />

                            </div>

                            <div className="min-w-0 flex-1">

                                <h2 className="break-words text-base font-black text-white">
                                    Google Drive Backup
                                </h2>

                                <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                                    Keep a backup of your LIFE GAME data
                                    in your Google Drive.
                                </p>

                            </div>

                        </div>


                        {/* ---------------------------------------------
                            CONNECTION STATUS
                        --------------------------------------------- */}

                        <div className="mt-4 flex min-w-0 items-center gap-2">

                            <span
                                className={`h - 2.5 w - 2.5 shrink - 0 rounded - full ${
    isGoogleConnected &&
        !googleDriveNeedsReconnect
        ? "bg-emerald-400"
        : "bg-amber-400"
} `}
                            />

                            <span className="min-w-0 break-words text-xs font-bold text-slate-300">

                                {isGoogleConnected &&
                                !googleDriveNeedsReconnect
                                    ? "Google Drive connected"
                                    : "Google Drive needs attention"}

                            </span>

                        </div>


                        {/* ---------------------------------------------
                            LAST BACKUP
                        --------------------------------------------- */}

                        <div className="mt-3 flex w-full min-w-0 items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-3">

                            <Clock
                                size={18}
                                className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <div className="min-w-0 flex-1">

                                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                    Last Backup
                                </p>

                                <p className="mt-1 break-words text-sm font-bold text-white">
                                    {formatLastBackup(
                                        lastBackupAt
                                    )}
                                </p>

                            </div>

                        </div>


                        {/* ---------------------------------------------
                            RECONNECT WARNING
                        --------------------------------------------- */}

                        {googleDriveNeedsReconnect && (
                            <div className="mt-3 w-full min-w-0 overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">

                                <div className="flex min-w-0 items-start gap-2">

                                    <AlertTriangle
                                        size={17}
                                        className="mt-0.5 shrink-0 text-amber-400"
                                    />

                                    <p className="min-w-0 flex-1 break-words text-xs leading-5 text-amber-200">
                                        Your Google Drive connection
                                        needs to be renewed before
                                        another backup can run.
                                    </p>

                                </div>

                            </div>
                        )}


                        {/* ---------------------------------------------
                            CONNECT / RECONNECT BUTTON
                        --------------------------------------------- */}

                        {(!isGoogleConnected ||
                            googleDriveNeedsReconnect) && (
                            <button
                                type="button"
                                onClick={
                                    handleConnectGoogleDrive
                                }
                                disabled={
                                    isGoogleBackupLoading
                                }
                                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <Cloud
                                    size={18}
                                />

                                <span className="min-w-0 break-words">
                                    {isGoogleBackupLoading
                                        ? "Connecting..."
                                        : googleDriveNeedsReconnect
                                            ? "Reconnect Google Drive"
                                            : "Connect Google Drive"}
                                </span>

                            </button>
                        )}


                        {/* ---------------------------------------------
                            MANUAL BACKUP BUTTON
                        --------------------------------------------- */}

                        <button
                            type="button"
                            onClick={
                                handleGoogleBackup
                            }
                            disabled={
                                isGoogleBackupLoading
                            }
                            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-black text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <CloudUpload
                                size={18}
                            />

                            <span className="min-w-0 break-words text-center">
                                {isGoogleBackupLoading
                                    ? "Backing up..."
                                    : "Backup to Google Drive Now"}
                            </span>

                        </button>

                    </div>


                    {/* =================================================
                       LOCAL EXPORT
                    ================================================= */}

                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">

                        <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">

                                <Download
                                    size={20}
                                    className="text-slate-300"
                                />

                            </div>

                            <div className="min-w-0 flex-1">

                                <h2 className="text-base font-black text-white">
                                    Export Database
                                </h2>

                                <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                                    Download a complete LIFE GAME
                                    backup file to your device.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={handleExport}
                            disabled={isLoading}
                            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <Download
                                size={18}
                            />

                            <span>
                                {isLoading
                                    ? "Preparing Backup..."
                                    : "Download Backup"}
                            </span>

                        </button>

                    </div>


                    {/* =================================================
                       LOCAL IMPORT
                    ================================================= */}

                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">

                        <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">

                                <Upload
                                    size={20}
                                    className="text-slate-300"
                                />

                            </div>

                            <div className="min-w-0 flex-1">

                                <h2 className="text-base font-black text-white">
                                    Import Database
                                </h2>

                                <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                                    Restore LIFE GAME from a previously
                                    downloaded backup file.
                                </p>

                            </div>

                        </div>


                        {/* Business purpose:
                            Keep the native file picker hidden and let
                            the visible button control the import flow. */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={
                                handleImport
                            }
                            className="hidden"
                        />


                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            disabled={isLoading}
                            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <Upload
                                size={18}
                            />

                            <span>
                                {isLoading
                                    ? "Importing..."
                                    : "Choose Backup File"}
                            </span>

                        </button>

                    </div>


                    {/* =================================================
                       IMPORTANT WARNING
                    ================================================= */}

                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

                        <div className="flex min-w-0 items-start gap-3">

                            <AlertTriangle
                                size={20}
                                className="mt-0.5 shrink-0 text-red-400"
                            />

                            <div className="min-w-0 flex-1">

                                <h2 className="text-sm font-black text-red-300">
                                    Important
                                </h2>

                                <p className="mt-1 break-words text-xs leading-5 text-red-200/70">
                                    Importing a backup replaces your
                                    current local LIFE GAME data.
                                    Always make sure you have a recent
                                    backup before restoring an older file.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}
