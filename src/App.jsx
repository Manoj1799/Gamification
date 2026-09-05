// Import React state and effect hooks.
import {
  useEffect,
  useState,
} from "react";

// Import all application pages.
import Trading from "./pages/trading";
import JourneyMap from "./pages/journeyMap";
import PhaseHistory from "./pages/phaseHistory";
import TradingLevelLadder from "./pages/tradingLevelLadder";
import Gym from "./pages/gym";
import NoFap from "./pages/noFap";
import Data from "./pages/data";

// Import Google Drive backup functions.
import {
  createGoogleDriveBackup,
  GOOGLE_DRIVE_REAUTH_REQUIRED,
} from "./services/googleDriveServices";

// Import database export function.
import {
  exportDatabase,
} from "./data/database";

// =========================================================
// GOOGLE DRIVE AUTOMATIC BACKUP SETTINGS
// =========================================================

// Remember whether Google Drive has been connected.
const GOOGLE_DRIVE_CONNECTED_KEY =
  "lifeGame.googleDrive.connected";

// Remember when the last successful backup happened.
const GOOGLE_DRIVE_LAST_BACKUP_KEY =
  "lifeGame.googleDrive.lastBackupAt";

// Remember when Google Drive needs the user
// to reconnect their Google account.
const GOOGLE_DRIVE_REAUTH_KEY =
  "lifeGame.googleDrive.reauthRequired";

// Automatic backup interval: 24 hours.
const GOOGLE_DRIVE_BACKUP_INTERVAL =
  24 * 60 * 60 * 1000;
  
// =========================================================
// AUTOMATIC GOOGLE DRIVE BACKUP
// =========================================================

async function runAutomaticGoogleDriveBackup() {
  try {
    // Check whether Google Drive was previously connected.
    const isConnected =
      localStorage.getItem(
        GOOGLE_DRIVE_CONNECTED_KEY
      ) === "true";

    // Do nothing if Google Drive has never
    // been connected.
    if (!isConnected) {
      return;
    }

    // Read the last successful backup timestamp.
    const lastBackupAt =
      Number(
        localStorage.getItem(
          GOOGLE_DRIVE_LAST_BACKUP_KEY
        ) || 0
      );

    // Get the current time.
    const now =
      Date.now();

    // Determine whether the backup is due.
    const backupIsDue =
      now - lastBackupAt >=
      GOOGLE_DRIVE_BACKUP_INTERVAL;

    // Do nothing when the backup is not due.
    if (!backupIsDue) {
      console.log(
        "Google Drive backup is not due yet."
      );

      return;
    }

    // Export the current LIFE GAME database.
    const backup =
      await exportDatabase();

    // Try to upload using only the current
    // in-memory Google access token.
    //
    // IMPORTANT:
    // This does NOT open an OAuth popup.
    await createGoogleDriveBackup(
      backup
    );

    // Save the successful backup time.
    localStorage.setItem(
      GOOGLE_DRIVE_LAST_BACKUP_KEY,
      String(Date.now())
    );

    // Clear any previous reconnection warning.
    localStorage.removeItem(
      GOOGLE_DRIVE_REAUTH_KEY
    );

    // Confirm successful automatic backup.
    console.log(
      "LIFE GAME automatic Google Drive backup completed."
    );
  } catch (error) {
    // If Google requires a new token, remember that
    // the user needs to reconnect.
    if (
      error?.code ===
      GOOGLE_DRIVE_REAUTH_REQUIRED
    ) {
      localStorage.setItem(
        GOOGLE_DRIVE_REAUTH_KEY,
        "true"
      );

      console.log(
        "Google Drive needs reconnection."
      );

      return;
    }

    // Other automatic backup errors should never
    // prevent LIFE GAME from loading.
    console.error(
      "Automatic Google Drive backup failed:",
      error
    );
  }
}

// =========================================================
// APP ROOT
// =========================================================

function App() {
  // Keep track of the currently visible page.
  const [
    activePage,
    setActivePage,
  ] = useState("trading");

  // =========================================================
  // AUTOMATIC BACKUP ON APP LAUNCH
  // =========================================================

  useEffect(() => {
    // Run the automatic backup check once when
    // the application is opened.
    runAutomaticGoogleDriveBackup();
  }, []);

  // =========================================================
  // APPLICATION UI
  // =========================================================

  return (
    <div>

      {/* Show the Trading page. */}
      {activePage === "trading" && (
        <Trading
          setActivePage={
            setActivePage
          }
        />
      )}

      {/* Show the Journey Map page. */}
      {activePage === "journeyMap" && (
        <JourneyMap />
      )}

      {/* Show the Phase History page. */}
      {activePage === "phaseHistory" && (
        <PhaseHistory />
      )}

      {/* Show the Trading Level Ladder page. */}
      {activePage ===
        "tradingLevelLadder" && (
          <TradingLevelLadder />
        )}

      {/* Show the Gym page. */}
      {activePage === "gym" && (
        <Gym />
      )}

      {/* Show the No Fap page. */}
      {activePage === "noFap" && (
        <NoFap />
      )}

      {/* Show the Data / Import / Export page. */}
      {activePage === "data" && (
        <Data />
      )}

      {/* =====================================================
          BOTTOM NAVIGATION
          ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-md justify-around py-3 text-xs font-bold text-slate-400">

          {/* Trading navigation button. */}
          <button
            onClick={() =>
              setActivePage(
                "trading"
              )
            }
            className={
              activePage ===
                "trading"
                ? "text-slate-900"
                : ""
            }
          >
            Trading
          </button>

          {/* Gym navigation button. */}
          <button
            onClick={() =>
              setActivePage(
                "gym"
              )
            }
            className={
              activePage === "gym"
                ? "text-slate-900"
                : ""
            }
          >
            Gym
          </button>

          {/* No Fap navigation button. */}
          <button
            onClick={() =>
              setActivePage(
                "noFap"
              )
            }
            className={
              activePage ===
                "noFap"
                ? "text-slate-900"
                : ""
            }
          >
            Fap Penality
          </button>

          {/* Data navigation button. */}
          <button
            onClick={() =>
              setActivePage(
                "data"
              )
            }
            className={
              activePage === "data"
                ? "text-slate-900"
                : ""
            }
          >
            Import/Export
          </button>

        </div>
      </nav>

    </div>
  );
}

export default App;