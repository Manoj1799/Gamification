
import { useEffect, useState } from "react";

import Trading from "./pages/trading";
import JourneyMap from "./pages/journeyMap";
import PhaseHistory from "./pages/phaseHistory";
import TradingLevelLadder from "./pages/tradingLevelLadder";
import Gym from "./pages/gym";
import NoFap from "./pages/noFap";
import Data from "./pages/data";

import { exportDatabase } from "./data/database";

// =================================================
// LOCAL AUTOMATIC BACKUP SETTINGS
// =================================================

const LOCAL_BACKUP_LAST_KEY =
  "lifeGame.localBackup.lastBackupAt";

const BACKUP_INTERVAL = 24 * 60 * 60 * 1000;

// =================================================
// DOWNLOAD LOCAL BACKUP
// =================================================

async function downloadLocalBackup() {
  try {
    const backup = await exportDatabase();

    const blob = new Blob(
      [typeof backup === "string"
        ? backup
        : JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "LIFE_GAME_BACKUP.json";

    document.body.appendChild(link);
    link.click();

    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    localStorage.setItem(
      LOCAL_BACKUP_LAST_KEY,
      String(Date.now())
    );

    console.log("Local backup downloaded successfully.");

  } catch (error) {
    console.error("Local backup failed:", error);
  }
}

// =================================================
// CHECK AUTOMATIC BACKUP
// =================================================

async function checkLocalBackup() {
  const lastBackupAt = Number(
    localStorage.getItem(LOCAL_BACKUP_LAST_KEY) || 0
  );

  const now = Date.now();

  if (now - lastBackupAt >= BACKUP_INTERVAL) {
    await downloadLocalBackup();
  }
}

// =================================================
// APP ROOT
// =================================================

function App() {
  const [activePage, setActivePage] = useState("trading");

  useEffect(() => {
    checkLocalBackup();
  }, []);

  return (
    <div>

      {activePage === "trading" && (
        <Trading setActivePage={setActivePage} />
      )}

      {activePage === "journeyMap" && <JourneyMap />}

      {activePage === "phaseHistory" && <PhaseHistory />}

      {activePage === "tradingLevelLadder" && (
        <TradingLevelLadder />
      )}

      {activePage === "gym" && <Gym />}

      {activePage === "noFap" && <NoFap />}

      {activePage === "data" && <Data />}

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md justify-around py-3 text-xs font-bold text-slate-400">

          {[
            ["trading", "Trading"],
            ["gym", "Gym"],
            ["noFap", "Discipline"],
            ["data", "Backup/Restore"],
          ].map(([page, label]) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={
                activePage === page
                  ? "text-slate-900"
                  : ""
              }
            >
              {label}
            </button>
          ))}

        </div>
      </nav>

    </div>
  );
}

export default App;
